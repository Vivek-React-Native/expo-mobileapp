import crowdpass from '@/adapters/crowdpass';
import LoadingIndicator from '@/components/LoadingIndicator';
import { scanQRCode } from '@/components/ScanQRCodeDialog';
import { showSnackbar } from '@/components/SnackbarDialog';
import { showImageDialog } from '@/components/dialogs/ImageDialog';
import { useEventAttendeesQuery } from '@/hooks/useEventAttendeesQuery';
import { useEventsQuery } from '@/hooks/useEventsQuery';
import { FlashList } from '@shopify/flash-list';
import { useDebounce } from 'ahooks';
import { Image } from 'expo-image';
import {
  useFocusEffect,
  useGlobalSearchParams,
  useNavigation,
  useRouter,
} from 'expo-router';
import { NativeStackNavigationOptions } from '@react-navigation/native-stack';
import React, { useLayoutEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { SafeAreaView, View } from 'react-native';
import NfcManager, { Ndef, NfcTech } from 'react-native-nfc-manager';
import {
  AnimatedFAB,
  Avatar,
  Card,
  IconButton,
  List,
  Searchbar,
  TouchableRipple,
  useTheme,
} from 'react-native-paper';

export default function DashboardEventAttendees(props) {
  const theme = useTheme();
  const router = useRouter();

  // const navigation = useNavigation();
  // useFocusEffect(
  //   React.useCallback(() => {
  //     navigation.getParent().setOptions({
  //       headerTitle: '',
  //     } as NativeStackNavigationOptions);
  //   }, [])
  // );

  // useFocusEffect(
  //   React.useCallback(() => {
  //     (async () => {
  //       if (!(await NfcManager.isSupported())) {
  //         return;
  //       }
  //       await NfcManager.start();
  //       const bgTag = await NfcManager.getBackgroundTag()
  //       console.log('bgTag ->', bgTag)
  //       NfcManager.setEventListener(NfcEvents.DiscoverTag, (tag) => {
  //         console.log('DiscoverTag ->', tag);
  //       });
  //       NfcManager.setEventListener(NfcEvents.DiscoverBackgroundTag, (tag) => {
  //         console.log('DiscoverBackgroundTag ->', tag);
  //       });
  //       // NfcManager.registerTagEvent()
  //     })();
  //     return () => {
  //       // NfcManager.unregisterTagEvent()
  //       NfcManager.setEventListener(NfcEvents.DiscoverTag, null);
  //       NfcManager.setEventListener(NfcEvents.DiscoverBackgroundTag, null);
  //     };
  //   }, [])
  // );

  const eventId = Number.parseInt(useGlobalSearchParams().event as string);
  const queries = {
    events: useEventsQuery(),
    attendees: useEventAttendeesQuery(eventId),
  };
  const { event, ...data } = {
    event: queries.events.findOne(eventId).data,
    attendees: queries.attendees.findAll().data,
  };

  const { control, watch } = useForm({
    defaultValues: { search: '' },
  });
  const search = useDebounce(watch('search'), { wait: 500 });

  if (!event || !data.attendees) {
    return <LoadingIndicator />;
  }

  let attendees = data.attendees.map((attendee, i) => {
    return {
      ...attendee,
      group:
        event.attendeeGroups.find((v) => v.id == attendee.attendeeGroupId) ??
        event.attendeeGroups.find((v) => v.isDefault == true),
    };
  });

  if (search) {
    attendees = attendees.filter((v) => {
      const values = [v.id, v.publicId, v.firstName, v.lastName, v.email, v.phoneNumber, v.group.name].filter(Boolean); // prettier-ignore
      return values
        .join(' ')
        .toLowerCase()
        .includes(search.trim().toLowerCase());
    });
  }

  return (
    <>
      <Controller
        control={control}
        name="search"
        render={({ field: { onChange, onBlur, value } }) => (
          <Searchbar
            style={{ margin: 16, marginBottom: 8 }}
            mode="bar"
            placeholder="Search..."
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            inputMode="search"
            autoComplete="off"
            autoCapitalize="none"
            autoCorrect={false}
            {...(!value && {
              right: () => (
                <View style={{ flexDirection: 'row', gap: -4, marginRight: 8 }}>
                  <IconButton
                    icon="cellphone-nfc"
                    iconColor={theme.colors.primary}
                    onPress={async () => {
                      try {
                        await NfcManager.start();
                        await NfcManager.requestTechnology(NfcTech.Ndef);
                        const tag = await NfcManager.getTag();
                        const publicId = Ndef.text.decodePayload(
                          tag.ndefMessage[0].payload as any
                        );
                        NfcManager.cancelTechnologyRequest();
                        const attendee = attendees.find(
                          (v) => v.publicId == publicId
                        );
                        if (!attendee) {
                          throw new Error(
                            `Cound not find attendee: ${publicId}`
                          );
                        }
                        router.push(
                          `/dashboard/${eventId}/attendee/${attendee.id}/attendee`
                        );
                      } catch (error) {
                        console.error('Searchbar right nfc ->', error);
                        showSnackbar({
                          message: `Error: ${
                            error?.message ?? 'Could not read NFC wristband'
                          }`,
                        });
                      } finally {
                        NfcManager.cancelTechnologyRequest();
                      }
                    }}
                  />
                  <IconButton
                    icon="qrcode-scan"
                    iconColor={theme.colors.primary}
                    onPress={async () => {
                      try {
                        const result = await scanQRCode({
                          title: 'Scan QR Code',
                        });
                        if (!result) return;
                        if (result.data.length == 10) {
                          result.data = result.data.slice(0, 8);
                        }
                        const attendee = attendees.find(
                          (v) => v.publicId == result.data
                        );
                        if (!attendee) {
                          throw new Error(
                            `Cound not find attendee: ${result.data}`
                          );
                        }
                        router.push(
                          `/dashboard/${eventId}/attendee/${attendee.id}/attendee`
                        );
                      } catch (error) {
                        console.error('Searchbar right qrcode ->', error);
                        showSnackbar({
                          message: `Error: ${
                            error?.message ?? 'Could not scan qr code'
                          }`,
                        });
                      }
                    }}
                  />
                </View>
              ),
            })}
          />
        )}
      />

      <SafeAreaView style={{ flexGrow: 1 }}>
        <FlashList
          data={attendees}
          estimatedItemSize={100}
          keyboardShouldPersistTaps="always"
          renderItem={({ item: attendee }) => {
            return (
              <Card
                mode="elevated"
                style={{ marginHorizontal: 16, marginVertical: 8 }}
                onPress={() => {
                  router.push(
                    `/dashboard/${eventId}/attendee/${attendee.id}/attendee`
                  );
                }}
              >
                <Card.Title
                  title={`${attendee.firstName} ${attendee.lastName}`}
                  titleVariant="titleMedium"
                  subtitle={attendee.group.name}
                  subtitleVariant="bodySmall"
                  subtitleStyle={{ color: attendee.group.color }}
                  left={(props) => {
                    console.log(
                      `${process.env['NX_URI']}/blobs/${attendee.profilePhotoBlobId}`
                    );
                    if (Number.isFinite(attendee.profilePhotoBlobId)) {
                      return (
                        <TouchableRipple
                          underlayColor="transparent"
                          onPress={() =>
                            showImageDialog({
                              attendeeName: `${attendee.firstName} ${attendee.lastName}`,
                              blobId: attendee.profilePhotoBlobId,
                            })
                          }
                        >
                          <Image
                            style={{ width: 40, height: 40, borderRadius: 20 }}
                            source={{
                              uri: `${process.env['NX_URI']}/blobs/${attendee.profilePhotoBlobId}`,
                              headers: {
                                Authorization: `Bearer ${
                                  crowdpass.useToken.getState().token
                                }`,
                              },
                            }}
                          />
                        </TouchableRipple>
                      );
                    } else {
                      return (
                        <Avatar.Text
                          {...props}
                          style={{ backgroundColor: attendee.group.color }}
                          color="white"
                          label={`${(attendee.firstName ?? '')
                            ?.charAt(0)
                            ?.toUpperCase()}${(attendee.lastName ?? '')
                            ?.charAt(0)
                            ?.toUpperCase()}`}
                        />
                      );
                    }
                  }}
                  right={(props) => (
                    <List.Icon
                      {...props}
                      style={{ marginRight: 20 }}
                      color={attendee.isCheckedIn ? '#00CA81' : ''}
                      icon={
                        attendee.isCheckedIn
                          ? 'check-decagram'
                          : 'decagram-outline'
                      }
                    />
                  )}
                />
              </Card>
            );
          }}
        />

        <AnimatedFAB
          style={{ bottom: 32, right: 24, position: 'absolute' }}
          variant="surface"
          icon="account-plus"
          label=" Add Attendee"
          iconMode="dynamic"
          extended
          visible
          onPress={() => {
            router.push(`/dashboard/${eventId}/add-attendee`);
          }}
        />
      </SafeAreaView>
    </>
  );
}
