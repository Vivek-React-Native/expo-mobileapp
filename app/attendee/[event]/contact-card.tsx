import { ScanContactCardDto, useCurrentQuery } from '@/hooks/useCurrentQuery';
import { useLocalSearchParams, useNavigation } from 'expo-router';
import { KeyboardAvoidingView, ScrollView, View } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import {
  ActivityIndicator,
  Avatar,
  List,
  Text,
  TouchableRipple,
} from 'react-native-paper';
import _ from 'radash';
import crowdpass from '@/adapters/crowdpass';
import { EventAttendeeDto } from '@/types/swagger';
import { useEffect, useLayoutEffect, useState } from 'react';
import { Image, TextField } from 'react-native-ui-lib';
import Button from '@/components/buttons/Button';
import EventHeader from '@/components/header/EventHeader';
import { showSnackbar } from '@/components/SnackbarDialog';
import { showImageDialog } from '@/components/dialogs/ImageDialog';

export default function ContactCard(props) {
  const navigation = useNavigation();
  const params = useLocalSearchParams();
  const publicId = params.publicId as any;
  const contact = JSON.parse(params.contact as string) as ScanContactCardDto;
  const queries = {
    current: useCurrentQuery(),
  };
  const event = queries.current.findOneEvent(publicId).data;
  const [note, setNote] = useState(contact.note);
  const [fieldsLength, setFieldsLength] = useState(0);

  console.log(event, 'event');
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
  let fields = _.pick(contact.attendee, primaryFields) as any as Record<
    string,
    string
  >;

  if (event) {
    (event?.event?.customRegistrationQuestions ?? []).forEach((question) => {
      const answer = contact.attendee.customRegistrationAnswers.find(
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

  useEffect(() => {
    if (event) {
      setFieldsLength(Object.entries(fields).length);
    }
  }, [event]);

  useLayoutEffect(() => {
    navigation.setOptions({
      header: () => <EventHeader title={event?.event?.title} />,
    });
  }, [navigation, event]);
  if (!event) {
    return <ActivityIndicator size="large" />;
  }
  return (
    <ScrollView
      contentContainerStyle={{
        paddingHorizontal: 16,
        paddingBottom: 120,
        alignItems: 'center',
      }}
      style={{ paddingTop: 100 }}
    >
      <KeyboardAvoidingView
        style={{ flex: 1, backgroundColor: '#fff', width: '100%' }}
        behavior="position"
        keyboardVerticalOffset={200}
      >
        {Number.isFinite(contact.attendee.profilePhotoBlobId) ? (
          <TouchableRipple
            underlayColor="transparent"
            onPress={() =>
              showImageDialog({
                attendeeName: `${contact.attendee.firstName} ${contact.attendee.lastName}`,
                blobId: contact.attendee.profilePhotoBlobId,
              })
            }
          >
            <Avatar.Image
              style={{
                alignSelf: 'center',
                marginTop: -80,
                position: 'absolute',
                zIndex: 1,
              }}
              size={120}
              source={{
                uri: `${process.env['NX_URI']}/blobs/${contact.attendee.profilePhotoBlobId}`,
                headers: {
                  Authorization: `Bearer ${
                    crowdpass.useToken.getState().token
                  }`,
                },
              }}
            />
          </TouchableRipple>
        ) : (
          <TouchableOpacity
            containerStyle={{
              alignSelf: 'center',
              marginTop: -80,
              position: 'absolute',
              zIndex: 10,
            }}
          >
            <Avatar.Icon size={120} {...props} icon="account" />
          </TouchableOpacity>
        )}
        <View style={{ height: 40 }} />
        {fieldsLength > 0 && (
          <Image
            style={{
              position: 'absolute',
              top: fieldsLength * 70 - 280 + contact.note.length / 100,
              width: '100%',
              borderWidth: 0,
              borderColor: 'transparent',
            }}
            width={100}
            source={require('@/assets/images/gradient-profile-bg.png')}
          />
        )}
        {Object.entries(fields).map(([key, value], i) => {
          return (
            <List.Item
              key={i}
              titleStyle={{ fontWeight: '500' }}
              title={value}
              description={_.title(key)}
            />
          );
        })}
        <View
          style={{
            marginTop: 60,
            height: 30,
            flexDirection: 'row',
            width: '100%',
            justifyContent: 'space-between',
          }}
        >
          <Text
            style={{
              fontWeight: '300',
              fontSize: 16,
              paddingLeft: 2,
              color: '#4F5974',
            }}
          >
            Notes
          </Text>
        </View>
        <TextField
          value={note}
          onChangeText={setNote}
          containerStyle={{
            width: '100%',
            borderRadius: 8,
            height: 100,
            backgroundColor: 'rgba(205, 214, 232, 0.25)',
            paddingHorizontal: 16,
            paddingVertical: 10,
          }}
          fieldStyle={{
            width: '100%',
            height: 16,
          }}
          style={{
            width: '100%',
            textAlign: 'left',
            height: 200,
            textAlignVertical: 'auto',
          }}
          placeholder={'Add a note'}
        />

        <Button
          style={{
            marginTop: 20,
            marginBottom: 40,
          }}
          onPress={async () => {
            const res = await crowdpass.put(
              `/attendees/current/scanned-contact-cards/${event?.eventId}`,
              {
                id: contact.id,
                attendeeId: contact.attendee.publicId,
                note: note,
              }
            );
            await queries.current.invalidate([
              'findAllContactCards',
              event?.eventId,
            ]);
            if (res.data.status.code === 1)
              showSnackbar({
                message: 'Saved',
              });
            else {
              showSnackbar({
                message: 'Error',
              });
            }
          }}
          title={'Save'}
        />
      </KeyboardAvoidingView>
    </ScrollView>
  );
}
