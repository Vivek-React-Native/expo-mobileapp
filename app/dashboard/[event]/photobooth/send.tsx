import Button from '@/components/buttons/Button';
import { showEmailDialog } from '@/components/dialogs/EmailDialog';
import { Image } from 'expo-image';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Controller, useForm } from 'react-hook-form';
import { StyleSheet, Text, View } from 'react-native';
import {
  TouchableOpacity,
  TouchableWithoutFeedback,
} from 'react-native-gesture-handler';
import { TextInput } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import crowdpass from '@/adapters/crowdpass';
import { useEffect, useRef, useState } from 'react';
import { AttendeeDto, BlobDto } from '@/types/swagger';
import AttendeeAvatar from '@/components/attendee/AttendeeAvatar';
import { BottomSheetBackdrop, BottomSheetModal } from '@gorhom/bottom-sheet';
import { showActionDialog } from '@/components/dialogs/ActionDialog';
import * as FileSystem from 'expo-file-system';
import { useWebSocket } from 'ahooks';
import { NfcWebSocketMessage } from '@/types/nfc';
import { shareFile } from '@/utils/file';
import { useEventAttendeesQuery } from '@/hooks/useEventAttendeesQuery';
import PhotoboothDropdown from '@/components/dropdown/PhotoboothDropdown';

const eventBackground = (eventId) => {
  switch (eventId) {
    case '1233':
      return 'white';
    default:
      return 'black';
  }
};
const buttonBackground = (eventId) => {
  switch (eventId) {
    case '1233':
      return 'white';
    default:
      return '#006bd3';
  }
};

const bottomSheetButtonColor = (eventId) => {
  switch (eventId) {
    case '1233':
      return 'white';
    default:
      return 'rgba(255, 255, 255, 0.04)';
  }
};

const buttonTextColor = (eventId) => {
  switch (eventId) {
    case '1233':
      return '#006bd3';
    default:
      return 'white';
  }
};

const nfcTagReaderTextColor = (eventId) => {
  switch (eventId) {
    case '1233':
      return 'white';
    default:
      return '#00CA81';
  }
};
const nfcContainerStyle = (eventId) => {
  switch (eventId) {
    case '1233':
      return {
        backgroundColor: '#006bd3',
        borderColor: 'white',
      };
    default:
      return {
        borderColor: '#00CA81',
        backgroundColor: 'black',
      };
  }
};

const boxBackgroundColor = (eventId) => {
  switch (eventId) {
    case '1233':
      return '#006bd3';
    default:
      return '#2C2C2E';
  }
};

const addIconBackgroundColor = (eventId) => {
  switch (eventId) {
    case '1233':
      return '#6fb7ed';
    default:
      return '#48484F';
  }
};

const renderTextByEvent = (eventId) => {
  switch (eventId) {
    case '1233':
      return 'Send photos to others';
    default:
      return 'Share photos with attendees';
  }
};

const paddingForEmailButton = (eventId) => {
  switch (eventId) {
    case '1233':
      return 12;
    default:
      return 16;
  }
};
export default function SendPhotobooth() {
  const { uri, eventId, nfc } = useLocalSearchParams();
  const router = useRouter();
  const { control, getValues, watch, setValue } = useForm({});
  const [addedAttendees, setAddedAttendees] = useState<any[]>([]);
  const bottomSheetRef = useRef();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [attendeeSearchResults, setAttendeeSearchResults] = useState<
    AttendeeDto[]
  >([]);
  const queries = {
    attendees: useEventAttendeesQuery(Number(eventId)),
  };
  const { attendees, devices } = {
    attendees: queries.attendees.findAll().data,
    devices: queries.attendees.findAllDevices().data,
  };

  useWebSocket(`wss://cp-raspberrypi-nfc.deno.dev/websocket/${nfc}`, {
    reconnectLimit: 0,
    onError() {
      showActionDialog({
        type: 'error',
        highlightedText: 'Error',
        text: ', could not connect to NFC reader',
      });
    },
    onMessage: (e) => {
      const data = JSON.parse(e.data) as NfcWebSocketMessage;
      const attendeeByDevice = devices.find(
        (attendeeDevice) =>
          attendeeDevice.deviceUuid.toLowerCase() === data.uid.toLowerCase()
      );
      if (!attendeeByDevice) {
        showActionDialog({
          type: 'error',
          highlightedText: 'Error',
          text: ', could not find attendee',
        });
        return;
      }
      const attendee = attendees.find(
        (attendee) => attendee.id === attendeeByDevice.attendeeId
      );
      if (!attendee) {
        showActionDialog({
          type: 'error',
          highlightedText: 'Error',
          text: ', could not find attendee',
        });
        return;
      }
      if (addedAttendees.some((a) => a.email === attendee.email)) {
        showActionDialog({
          type: 'error',
          highlightedText: attendee.firstName + ' ' + attendee.lastName,
          text: ', is already added',
        });
        return;
      }
      setAddedAttendees([...addedAttendees, attendee]);
      showActionDialog({
        type: 'success',
        highlightedText: attendee.firstName + ' ' + attendee.lastName,
        text: ', has been added to the list.',
        buttonTextColor: 'black',
      });
    },
  });

  const addEmail = async () => {
    const email = getValues('email');
    if (!email) {
      return;
    }
    if (!email.includes('@') || !email.includes('.')) {
      showActionDialog({
        backgroundColor: eventId === '1233' ? '#006bd3' : 'black',
        buttonTextColor: eventId === '1233' ? '#006bd3' : 'white',
        buttonColor: 'white',
        type: 'error',
        highlightedText: email,
        text: ', is not a valid email',
      });
      return;
    }
    const res = await crowdpass.get(`/events/${eventId}/attendees/getByEmail`, {
      params: {
        email,
      },
    });
    if (addedAttendees.some((a) => a.email === email)) {
      showActionDialog({
        backgroundColor: eventId === '1233' ? '#006bd3' : 'black',
        buttonTextColor: eventId === '1233' ? '#006bd3' : 'white',
        buttonColor: 'white',
        type: 'error',
        highlightedText: email,
        text: ', is already added',
      });
      return;
    }
    let name;
    if (res.data.data) {
      const attendee = res.data.data as AttendeeDto;
      setAddedAttendees([...addedAttendees, attendee]);
      name = attendee.firstName + ' ' + attendee.lastName;
    } else {
      setAddedAttendees([
        ...addedAttendees,
        {
          firstName: email[0],
          lastName: '',
          email,
        },
      ]);
      name = email;
    }
    showActionDialog({
      backgroundColor: eventId === '1233' ? '#006bd3' : 'black',
      buttonTextColor: eventId === '1233' ? '#006bd3' : 'white',
      buttonColor: 'white',
      type: 'success',
      highlightedText: name,
      text: ', has been added to the list.',
    });
  };

  const shareEmail = async () => {
    try {
      const response = await FileSystem.uploadAsync(
        `${process.env['NX_URI']}/blobs`,
        'file:///' + uri,
        {
          httpMethod: 'POST',
          uploadType: FileSystem.FileSystemUploadType.MULTIPART,
          fieldName: 'file',
          headers: {
            Authorization: `Bearer ${crowdpass.useToken.getState().token}`,
          },
        }
      );
      const photoblobId = (JSON.parse(response.body).data as BlobDto).id;
      await crowdpass.post(`/events/${eventId}/photobooth`, {
        eventId,
        photoblobId,
        emails: attendeeSearchResults.map((attendee) => attendee.email),
      });
      (bottomSheetRef.current as any).present();
      setTimeout(() => {
        router.replace({
          pathname: '/dashboard/[event]/photobooth',
          params: {
            eventId,
          },
        });
      }, 3000);
    } catch (error) {
      console.log("Couldn't send photo", error);
      showActionDialog({
        type: 'error',
        highlightedText: 'Error',
        text: ', could not send photo',
      });
    }
  };

  const shareAirDrop = async () => {
    shareFile(uri as string);
  };

  const handleShare = async () => {
    shareEmail();

    // showChoiceDialog({
    //   choice1: 'Email',
    //   choice2: 'AirDrop',
    //   backgroundColor: eventId === '1233' ? '#006bd3' : 'black',
    //   buttonColor: 'white',
    //   buttonTextColor: eventId === '1233' ? 'white' : 'black',
    // }).then((result) => {
    //   if (result === 'Email') {
    //     shareEmail();
    //   } else if (result === 'AirDrop') {
    //     shareAirDrop();
    //   }
    // });
  };

  const renderAttendee = (attendee: any) => {
    return (
      <View
        key={attendee.email}
        style={{ ...styles.box, backgroundColor: boxBackgroundColor(eventId) }}
      >
        <AttendeeAvatar attendee={attendee} size={48} />
        <View
          style={{
            width: '80%',
          }}
        >
          {attendee.firstName && (
            <Text numberOfLines={1} style={{ color: 'white', fontSize: 20 }}>
              {attendee.firstName} {attendee.lastName}
            </Text>
          )}
          <Text numberOfLines={1} style={{ color: 'white', fontSize: 14 }}>
            {attendee.email}
          </Text>
          <TouchableOpacity
            containerStyle={{
              bottom: 30,
              position: 'absolute',
              right: -8,
            }}
            onPress={() => {
              setAddedAttendees(
                addedAttendees.filter((a) => a.email !== attendee.email)
              );
            }}
          >
            <MaterialCommunityIcons
              name="close-circle"
              size={24}
              color="#F5324A"
            />
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  useEffect(() => {
    if (watch('search')?.length < 3) return;
    const filteredAttendees = attendees.filter((attendee) => {
      if (
        attendee.email.toLowerCase().includes(watch('email')?.toLowerCase()) &&
        !addedAttendees.some((a) => a.email === attendee.email)
      ) {
        return true;
      }
      return false;
    });
    setAttendeeSearchResults(filteredAttendees);
  }, [watch('email')]);

  console.log(addedAttendees);
  useEffect(() => {
    if (attendeeSearchResults && watch('email')?.length > 2)
      setDropdownOpen(true);
    else setDropdownOpen(false);
  }, [attendeeSearchResults]);

  return (
    <TouchableWithoutFeedback
      onPress={() => {
        setDropdownOpen(false);
      }}
      containerStyle={styles.safeArea}
      style={styles.safeArea}
    >
      <View
        style={{
          ...styles.container,
          backgroundColor: eventBackground(eventId),
        }}
      >
        <TouchableOpacity
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            gap: 4,
          }}
          containerStyle={{
            position: 'absolute',
            top: 30,
          }}
          onPress={() => {
            router.back();
          }}
        >
          <MaterialCommunityIcons
            name="chevron-left"
            size={32}
            color={eventId === '1233' ? '#006bd3' : 'white'}
          />
          <Text
            style={{
              color: eventId === '1233' ? '#006bd3' : 'white',
              fontSize: 24,
              fontWeight: 'bold',
            }}
          >
            Back
          </Text>
        </TouchableOpacity>
        <View
          style={{
            width: '60%',

            height: '100%',
          }}
        >
          <View style={styles.imageContainer}>
            <Image contentFit="contain" source={uri} style={styles.image} />
          </View>
          <View style={[styles.nfcStyle, nfcContainerStyle(eventId)]}>
            <MaterialCommunityIcons
              style={{
                transform: [{ rotate: '90deg' }],
              }}
              name="wifi"
              size={40}
              color={nfcTagReaderTextColor(eventId)}
            />
            <Text
              style={{
                fontSize: 24,
                color: nfcTagReaderTextColor(eventId),
              }}
            >
              NFC Tag Reader
            </Text>
            <Text style={styles.tabNFCText}>
              Tap your wristband to be sent your photos
            </Text>
          </View>
        </View>
        <View
          style={{
            width: '36%',
            flexDirection: 'column',
            gap: 16,
          }}
        >
          <Text
            style={{
              color: 'white',
              fontSize: 20,
              marginBottom: 16,
            }}
          >
            {renderTextByEvent(eventId)}
          </Text>

          <View
            style={{
              position: 'relative',
              height: 60,
              zIndex: 100,
            }}
          >
            <View
              style={{
                zIndex: -1,
                borderRadius: 50,
              }}
            >
              <PhotoboothDropdown
                setValue={(value) => {
                  const attendee = attendees.find(
                    (a) => a.email === value.value
                  );
                  setAddedAttendees([...addedAttendees, attendee]);
                  setValue('email', '');
                  setDropdownOpen(false);
                }}
                setOpen={setDropdownOpen}
                open={dropdownOpen}
                items={attendeeSearchResults.map((e) => ({
                  label: e.email,
                  value: e.email,
                }))}
              />
            </View>
            <View
              style={{
                flex: 1,
                zIndex: 100,
                position: 'absolute',
                width: '100%',
              }}
            >
              <Controller
                control={control}
                name={'email'}
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    mode="outlined"
                    outlineColor="transparent"
                    outlineStyle={{
                      borderWidth: 0,
                      borderTopLeftRadius: 16,
                      borderTopRightRadius: 16,
                      borderBottomLeftRadius: dropdownOpen ? 0 : 16,
                      borderBottomRightRadius: dropdownOpen ? 0 : 16,
                    }}
                    underlineStyle={{
                      borderRadius: 50,
                      borderWidth: 0,
                      borderBottomWidth: 0,
                      borderBottomColor: 'transparent',
                    }}
                    underlineColor="transparent"
                    left={
                      <TextInput.Icon
                        icon="magnify"
                        color="white"
                        style={{
                          marginRight: 16,
                        }}
                      />
                    }
                    autoCapitalize="none"
                    onChangeText={onChange}
                    onBlur={onBlur}
                    value={value}
                    placeholderTextColor={'white'}
                    contentStyle={{
                      color: 'white',
                      marginLeft: 40,
                    }}
                    style={{
                      ...styles.input,
                      backgroundColor: boxBackgroundColor(eventId),
                    }}
                    placeholder="Email"
                  />
                )}
              />
            </View>
          </View>
          <TouchableOpacity
            onPress={() => {
              showEmailDialog({
                backgroundColor: eventId === '1233' ? '#006bd3' : 'black',
                buttonColor: 'white',
                title: 'Edit attendee details',
                name: 'email',
                control: control,
              }).then((result) => {
                if (result) addEmail();
              });
            }}
            style={{
              ...styles.box,
              backgroundColor: boxBackgroundColor(eventId),
              paddingVertical: paddingForEmailButton(eventId),
            }}
          >
            <View
              style={{
                padding: paddingForEmailButton(eventId),
                borderRadius: 50,
                backgroundColor: addIconBackgroundColor(eventId),
              }}
            >
              <MaterialCommunityIcons name="plus" size={24} color="white" />
            </View>
            <Text style={{ color: 'white', fontSize: 20 }}>Add Email</Text>
          </TouchableOpacity>
          {addedAttendees.map((attendee) => renderAttendee(attendee))}
        </View>
      </View>
      <View style={styles.buttonContainer}>
        <Button
          style={{
            backgroundColor: buttonBackground(eventId),
          }}
          textColor={buttonTextColor(eventId)}
          onPress={handleShare}
          title="Share"
        />
      </View>
      <BottomSheetModal
        backdropComponent={(props) => (
          <BottomSheetBackdrop opacity={1} disappearsOnIndex={-1} {...props} />
        )}
        backgroundStyle={{
          backgroundColor: nfcContainerStyle(eventId).backgroundColor,
        }}
        ref={bottomSheetRef}
        style={{
          borderRadius: 30,
          overflow: 'hidden',
        }}
        index={0}
        snapPoints={['40%']}
        enablePanDownToClose={true}
      >
        <View
          style={{
            height: '100%',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingBottom: 24,
            paddingVertical: 42,
          }}
        >
          <Image
            contentFit="contain"
            style={{
              width: '100%',
              height: 146,
            }}
            source={require('@/assets/icons/photobooth-success.png')}
          />
          <Text
            style={{
              color: '#00CA81',
              fontSize: 32,
              marginTop: 16,
              textAlign: 'center',
              width: '80%',
            }}
          >
            Congratulations!
            <Text
              style={{
                color: 'white',
                fontSize: 32,
                marginTop: 16,
                textAlign: 'center',
                width: '80%',
              }}
            >
              , your photo has been sent out! Keep an eye on your email.
            </Text>
          </Text>

          <TouchableOpacity
            onPress={() => {
              (bottomSheetRef.current as any).close();
            }}
            style={{
              marginTop: 32,
              alignItems: 'center',
              justifyContent: 'center',
              paddingHorizontal: 36,
              paddingVertical: 18,
              backgroundColor: bottomSheetButtonColor(eventId),
              borderRadius: 100,
            }}
            containerStyle={{
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Text style={{ color: buttonTextColor(eventId), fontSize: 24 }}>
              Close
            </Text>
          </TouchableOpacity>
        </View>
      </BottomSheetModal>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flexDirection: 'column',
    flex: 1,
    backgroundColor: 'black',
  },
  container: {
    paddingTop: 40,
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    backgroundColor: 'black',
    paddingVertical: '5%',
    paddingHorizontal: '4%',
  },
  nfcStyle: {
    width: '100%',
    borderRadius: 16,
    borderWidth: 4,
    borderColor: '#00CA81',
    backgroundColor: '#26312A',
    height: '25%',
    alignItems: 'center',
    justifyContent: 'space-evenly',
  },
  tabNFCText: {
    color: 'white',
    fontSize: 44,
    fontWeight: '700',
    letterSpacing: 0.085,
    textAlign: 'center',
  },
  image: {
    borderRadius: 16,
    height: '100%',
    width: '100%',
  },
  imageContainer: {
    width: '100%',
    height: '65%',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    gap: 0,
  },
  buttonContainer: {
    position: 'absolute',
    bottom: '4%',
    width: '100%',
    paddingHorizontal: '4%',
    borderRadius: 16,
  },
  box: {
    width: '100%',
    paddingHorizontal: 24,
    paddingVertical: 16,
    justifyContent: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    backgroundColor: '#2C2C2E',
    borderRadius: 16,
  },
  input: {
    color: 'white',
    borderTopLeftRadius: 16,
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
    borderTopRightRadius: 16,
    backgroundColor: '#2C2C2E',
  },
});
