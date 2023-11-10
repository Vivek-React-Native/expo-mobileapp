import LoadingIndicator from '@/components/LoadingIndicator';
import { SafeAreaView, ScrollView, View } from 'react-native';
import { useGlobalSearchParams, useRouter, useNavigation } from 'expo-router';
import {
  ScanQRCodeDialogResolver,
  scanQRCode,
} from '@/components/ScanQRCodeDialog';
import { ScanContactCardDto, useCurrentQuery } from '@/hooks/useCurrentQuery';
import * as _ from 'radash';
import {
  AnimatedFAB,
  Avatar,
  IconButton,
  List,
  Text,
  TextInput,
  TouchableRipple,
  useTheme,
} from 'react-native-paper';
import crowdpass from '@/adapters/crowdpass';
import { showSnackbar } from '@/components/SnackbarDialog';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useActionSheet } from '@expo/react-native-action-sheet';
import NfcManager, { NfcTech, Ndef } from 'react-native-nfc-manager';
import { showNotesDialog } from '@/components/NotesDialog';
import React, { useLayoutEffect, useState } from 'react';
import { showImageDialog } from '@/components/dialogs/ImageDialog';
import EventHeader from '@/components/header/EventHeader';
import { shareCSV } from '@/utils/file';
import { showConfirm } from '@/components/dialogs/ConfirmDialog';
import { EventAttendeeDto } from '@/types/swagger';

export default function AttendeeEventContacts() {
  const navigation = useNavigation();
  const { showActionSheetWithOptions } = useActionSheet();
  const router = useRouter();
  const publicId = useGlobalSearchParams()?.event as string;
  const [searchText, setSearchText] = useState('');
  const theme = useTheme();
  const currentQuery = useCurrentQuery();
  const event = currentQuery.findOneEvent(publicId).data;
  const contacts = currentQuery.findAllContactCards(event?.eventId).data;
  const [selectedContacts, setSelectedContacts] = useState<
    ScanContactCardDto[]
  >([]);
  const [selectMode, setSelectMode] = useState(false);
  function showActionSheet() {
    showActionSheetWithOptions(
      {
        options: ['Tap NFC wristband', 'Scan QR code', 'Cancel'],
        cancelButtonIndex: 2,
      },
      async (index) => {
        let result = {} as ScanQRCodeDialogResolver;
        if (index == 0) {
          try {
            result.note = await showNotesDialog();
            await NfcManager.start();
            await NfcManager.requestTechnology(NfcTech.Ndef);
            const tag = await NfcManager.getTag();
            result.data = Ndef.text.decodePayload(
              tag.ndefMessage[0].payload as any
            );
          } catch (error) {
            console.error('Tap NFC wristband ->', error);
            showSnackbar({
              message: `Error: ${
                error?.message ?? 'Could not tap NFC wristband'
              }`,
            });
          } finally {
            NfcManager.cancelTechnologyRequest();
          }
        }
        if (index == 1) {
          try {
            result = await scanQRCode({
              title: 'Scan New Lead',
              showNoteTextInput: true,
            });
          } catch (error) {
            console.error('new lead Scan QR code ->', error);
            showSnackbar({ message: `Error: ${error?.message}` });
          }
        }
        if (!result?.data) return;
        try {
          if (result.data.length == 10) {
            result.data = result.data.slice(0, 8);
          }
          const contact = contacts.find(
            (v) => v.attendee.publicId == result.data
          );
          if (contact) {
            showConfirm({
              title: 'Lead already scanned',
              message: 'Do you want to view the lead?',
            }).then((result) => {
              if (!result) return;
              router.push({
                pathname: '/attendee/[event]/contact-card',
                params: {
                  publicId,
                  contact: JSON.stringify({
                    id: contact.id,
                    attendee: contact.attendee,
                    note: contact.note,
                  }),
                },
              });
            });

            return;
          } else {
            await crowdpass.post(
              `/attendees/current/scanned-contact-cards/${event?.eventId}`,
              { attendeeId: result.data, note: result.note }
            );
            await currentQuery.invalidate([
              'findAllContactCards',
              event?.eventId,
            ]);
            showSnackbar({ message: 'Successfully added new lead!' });
          }
        } catch (error) {
          console.error('add new lead ->', error);
          showSnackbar({ message: `Error: ${error?.message}` });
        }
      }
    );
  }
  useLayoutEffect(() => {
    if (!event) return;
    const COLUMNS = [
      'First Name',
      'Last Name',
      'Email',
      'Phone Number',
      ...event.event.customRegistrationQuestions.map((v) => v.name),
      'Note',
    ];

    const data = selectedContacts.map(({ id, note, attendee }) => {
      const primaryFields: (keyof EventAttendeeDto)[] = [
        'firstName',
        'lastName',
        'email',
        'company',
        'customUrl',
        'instagram',
        'jobTitle',
        'linkedin',
        'phoneNumber',
        'twitter',
      ];
      let fields = _.pick(attendee, primaryFields) as any as Record<
        string,
        string
      >;

      if (event) {
        (event.event.customRegistrationQuestions ?? []).forEach((question) => {
          const answer = attendee.customRegistrationAnswers.find(
            (v) => v.questionId == question.id
          );
          if (answer?.givenAnswer) {
            fields[question.name] = answer?.givenAnswer;
          } else {
            fields[question.name] = 'Not answered';
          }
        });
        fields = _.shake(fields, (v) => !v);
      }

      return {
        ...fields,
        note: note ?? '',
      };
    });
    navigation.setOptions({
      header: () => (
        <EventHeader
          rightItem={
            <IconButton
              iconColor={theme.colors.primary}
              onPress={async () => {
                if (selectedContacts.length == 0 || !selectMode) {
                  showSnackbar({ message: 'No contacts selected' });
                  return;
                }
                shareCSV(data, COLUMNS, 'Contact Cards.csv');
              }}
              icon={'export-variant'}
            />
          }
          title={event?.event.title}
        />
      ),
    });
  }, [navigation, event, selectedContacts, selectMode]);

  if (!event || !contacts) {
    return <LoadingIndicator />;
  }

  return (
    <SafeAreaView style={{ flexGrow: 1 }}>
      {contacts.length == 0 && (
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            gap: 16,
          }}
        >
          <Icon size={64} name="qrcode-scan" />
          <Text>No scanned lead retrievals found!</Text>
        </View>
      )}

      {contacts.length > 0 && (
        <ScrollView style={{ flex: 1 }}>
          <TextInput
            theme={{
              colors: {},
            }}
            onChangeText={setSearchText}
            value={searchText}
            left={
              <TextInput.Icon
                icon="magnify"
                style={{
                  marginTop: 16,
                }}
              />
            }
            placeholder="Search"
            mode="outlined"
            outlineColor="transparent"
            outlineStyle={{
              borderWidth: 0,
            }}
            underlineStyle={{
              borderRadius: 50,
              borderWidth: 0,
              borderBottomWidth: 0,
              borderBottomColor: 'transparent',
            }}
            underlineColor="transparent"
            style={{
              height: 42,
              backgroundColor: '#EEF2FA',
              marginHorizontal: 16,
              borderBottomColor: 'transparent',
              borderRadius: 8,
            }}
          />
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            {selectMode ? (
              <Text
                onPress={() => {
                  if (selectedContacts.length == contacts.length) {
                    setSelectedContacts([]);
                  } else {
                    setSelectedContacts(contacts);
                  }
                }}
                style={{
                  padding: 16,
                  fontWeight: '500',
                  letterSpacing: 0.342,
                  fontSize: 16,
                  color: theme.colors.primary,
                }}
              >
                {selectedContacts.length == contacts.length
                  ? 'Deselect'
                  : 'Select'}{' '}
                All{' '}
                <Text
                  style={{
                    padding: 16,
                    fontWeight: '400',
                    letterSpacing: 0.342,
                    fontSize: 16,
                    color: theme.colors.tertiary,
                  }}
                >
                  ({selectedContacts.length} Selected)
                </Text>
              </Text>
            ) : (
              <Text
                style={{
                  padding: 16,
                  fontWeight: '400',
                  letterSpacing: 0.342,
                  fontSize: 16,
                  color: theme.colors.tertiary,
                }}
              >
                {contacts.length} Leads
              </Text>
            )}
            <Text
              onPress={() => {
                setSelectMode((prev) => !prev);
              }}
              style={{
                padding: 16,
                fontWeight: '500',
                letterSpacing: 0.342,
                fontSize: 16,
                color: theme.colors.primary,
              }}
            >
              {selectMode ? 'Cancel' : 'Select'}
            </Text>
          </View>
          {contacts
            .filter(({ attendee }) =>
              attendee.firstName
                .toLowerCase()
                .includes(searchText.toLowerCase())
            )
            .map(({ id, note, attendee }, i) => {
              let fields = _.pick(attendee, [
                'company',
                'customUrl',
                'instagram',
                'jobTitle',
                'linkedin',
                'twitter',
              ]) as any as Record<string, string>;
              (event.event.customRegistrationQuestions ?? []).forEach(
                (question) => {
                  const answer = attendee.customRegistrationAnswers.find(
                    (v) => v.questionId == question.id
                  );
                  if (answer?.givenAnswer) {
                    fields[question.name] = answer?.givenAnswer;
                  }
                }
              );
              fields = _.shake(fields, (v) => !v);
              const firstName =
                attendee.contactCardFirstName || attendee.firstName;
              const lastName =
                attendee.contactCardLastName || attendee.lastName;
              return (
                <List.Item
                  title={`${firstName} ${lastName}`}
                  onPress={() => {
                    if (selectMode) {
                      setSelectedContacts((prev: any) => {
                        if (prev.find((v) => v.id == id)) {
                          return prev.filter((v) => v.id != id);
                        } else {
                          return [...prev, { id, note, attendee }];
                        }
                      });
                      return;
                    }
                    router.push({
                      pathname: '/attendee/[event]/contact-card',
                      params: {
                        publicId,
                        contact: JSON.stringify({
                          id,
                          attendee,
                          note,
                        }),
                      },
                    });
                  }}
                  titleStyle={{
                    fontWeight: '700',
                    letterSpacing: 0.342,
                    fontSize: 18,
                    marginBottom: 4,
                  }}
                  description={note || ' '}
                  left={(props) => {
                    return (
                      <View
                        style={{
                          paddingLeft: 18,
                          flexDirection: 'row',
                          gap: 16,
                          alignItems: 'center',
                        }}
                      >
                        {selectMode && (
                          <View
                            style={{
                              flexDirection: 'row',
                              gap: 4,
                              height: 24,
                              width: 24,
                              backgroundColor: selectedContacts.find(
                                (v) => v.id == id
                              )
                                ? '#00CA81'
                                : 'transparent',
                              borderColor: '#00CA81',
                              borderWidth: 1,
                              borderRadius: 50,
                              alignItems: 'center',
                              justifyContent: 'center',
                            }}
                          >
                            <Icon size={16} name="check" color={'white'} />
                          </View>
                        )}
                        {Number.isFinite(attendee.profilePhotoBlobId) ? (
                          <TouchableRipple
                            underlayColor="transparent"
                            onPress={() =>
                              showImageDialog({
                                attendeeName: `${attendee.firstName} ${attendee.lastName}`,
                                blobId: attendee.profilePhotoBlobId,
                              })
                            }
                          >
                            <Avatar.Image
                              size={48}
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
                        ) : (
                          <Avatar.Text
                            label={`${firstName.charAt(0)}${lastName.charAt(
                              0
                            )}`}
                          />
                        )}
                      </View>
                    );
                  }}
                />
              );
            })}
        </ScrollView>
      )}

      <AnimatedFAB
        style={{ bottom: 24, right: 24, position: 'absolute' }}
        variant="surface"
        icon="qrcode"
        label="New Lead"
        extended
        visible
        onPress={() => showActionSheet()}
      />
    </SafeAreaView>
  );
}
