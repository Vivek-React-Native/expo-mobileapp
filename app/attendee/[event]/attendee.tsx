import { ScrollView, View } from 'react-native';
import { router, useGlobalSearchParams, useNavigation } from 'expo-router';
import { useCurrentQuery } from '@/hooks/useCurrentQuery';
import * as _ from 'radash';
import {
  ActivityIndicator,
  Avatar,
  IconButton,
  List,
  Text,
  TouchableRipple,
  useTheme,
} from 'react-native-paper';
import crowdpass from '@/adapters/crowdpass';
import { showEditDialog } from '@/components/dialogs/EditDialog';
import { useForm } from 'react-hook-form';
import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { BlobDto, EventAttendeeDto } from '@/types/swagger';
import { Image } from 'react-native-ui-lib';
import Button from '@/components/buttons/Button';
import EventHeader from '@/components/header/EventHeader';
import Carousel from 'react-native-reanimated-carousel';
import { showAccessQRCode } from '@/components/dialogs/AccessQRCodeDialog';
import { showTicketDialog } from '@/components/dialogs/ShowTicketDialog';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { showImagePicker } from '@/components/dialogs/ImagePickerDialog';
import * as FileSystem from 'expo-file-system';
import * as ImagePicker from 'expo-image-picker';
import { showSnackbar } from '@/components/SnackbarDialog';

export default function AttendeeEventAttendee(props) {
  const publicId = useGlobalSearchParams().event as string;
  const theme = useTheme();
  const currentQuery = useCurrentQuery();
  const { event, invalidate } = {
    event: currentQuery.findOneEvent(publicId).data,
    invalidate: currentQuery.invalidate,
  };
  const carouselRef = useRef(null);
  const navigation = useNavigation();
  const [carouselIndex, setCarouselIndex] = useState(0);
  const [showEditIcons, setShowEditIcons] = useState(false);
  const [fieldsLength, setFieldsLength] = useState(0);
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

  const updateContactCard = async (key, data) => {
    try {
      const attendee = await crowdpass
        .get(`/attendees/${event?.id}`)
        .then((res) => res.data.data);
      if (primaryFields.includes(key)) {
        // if it's a primary field
        attendee[key] = data;
      } else {
        // if it's a custom registration question
        const questionId = event.event.customRegistrationQuestions.find(
          (question) => question.name == key
        ).id;
        attendee.customRegistrationAnswers =
          attendee.customRegistrationAnswers.map((answer) => {
            if (answer.questionId == questionId) {
              return {
                ...answer,
                givenAnswer: data,
              };
            }
            return answer;
          });
      }
      await crowdpass.put(`/attendees/${event?.id}`, attendee).catch((err) => {
        console.log(err.response);
      });
      invalidate(['findOneEvent']);
    } catch (error) {
      console.log(error);
    }
  };

  let fields = _.pick(event, primaryFields) as any as Record<string, string>;

  if (event) {
    (event.event.customRegistrationQuestions ?? []).forEach((question) => {
      const answer = event.customRegistrationAnswers.find(
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

  async function uploadPhoto() {
    try {
      const asset = await showImagePicker();
      if (!asset) return;
      const response = await FileSystem.uploadAsync(
        `${process.env['NX_URI']}/blobs`,
        asset.uri,
        {
          httpMethod: 'POST',
          uploadType: FileSystem.FileSystemUploadType.MULTIPART,
          fieldName: 'file',
          headers: {
            Authorization: `Bearer ${crowdpass.useToken.getState().token}`,
          },
        }
      );
      const profilePhotoBlobId = (JSON.parse(response.body).data as BlobDto).id;
      await crowdpass.put(`/attendees/${event.id}`, {
        ..._.omit(event, ['healthScreening']),
        profilePhotoBlobId,
      });
      invalidate(['findOneEvent']);

      showSnackbar({
        message: 'Successfully uploaded attendee photo!',
      });
    } catch (error) {
      console.error('photo upload ->', error);
      showSnackbar({ message: `Error: ${error?.message}` });
    }
  }

  const { control, getValues, watch, setValue } = useForm({});

  useEffect(() => {
    if (event) {
      Object.entries(fields).forEach(([key, value]) => {
        setValue(key, value);
      });
    }
  }, [event]);

  useEffect(() => {
    if (event) {
      setFieldsLength(Object.entries(fields).length);
    }
  }, [event]);

  useLayoutEffect(() => {
    navigation.setOptions({
      header: () => (
        <EventHeader
          rightItem={
            <IconButton
              iconColor={theme.colors.primary}
              onPress={() => {
                setShowEditIcons(!showEditIcons);
              }}
              icon={showEditIcons ? 'close' : 'pencil'}
            />
          }
          title={event?.event.title}
        />
      ),
    });
  }, [navigation, showEditIcons, event]);

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
      {Number.isFinite(event.profilePhotoBlobId) ? (
        <Avatar.Image
          style={{
            alignSelf: 'center',
            marginTop: -80,
            position: 'absolute',
            zIndex: 1,
          }}
          size={120}
          source={{
            uri: `${process.env['NX_URI']}/blobs/${event.profilePhotoBlobId}`,
            headers: {
              Authorization: `Bearer ${crowdpass.useToken.getState().token}`,
            },
          }}
        />
      ) : (
        <TouchableOpacity
          onPress={uploadPhoto}
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
            top: fieldsLength * 70 - 200,
            width: '100%',
            borderWidth: 0,
            borderColor: 'transparent',
            objectFit: 'cover',
            overflow: 'visible',
          }}
          width={100}
          source={require('@/assets/images/gradient-profile-bg.png')}
        />
      )}
      {Object.entries(fields).map(([key, value], i) => {
        return (
          <List.Item
            onPress={() => {
              if (!showEditIcons) return;
              showEditDialog({
                title: 'Edit attendee details',
                label: _.title(key),
                name: key,
                control: control,
              }).then(() => updateContactCard(key, getValues(key)));
            }}
            right={() =>
              showEditIcons && (
                <Text style={{ color: theme.colors.primary }}>Edit </Text>
              )
            }
            key={i}
            titleStyle={{ fontWeight: '500' }}
            title={value}
            description={_.title(key)}
          />
        );
      })}

      <View
        style={{
          alignItems: 'center',
          width: '100%',
          justifyContent: 'center',
          flexDirection: 'row',
          marginTop: 20,
        }}
      >
        <Carousel
          style={{
            alignSelf: 'center',
            borderColor: 'transparent',
          }}
          width={150}
          ref={carouselRef}
          height={150}
          loop={false}
          snapEnabled
          data={event.tickets}
          scrollAnimationDuration={1000}
          onSnapToItem={(index) => {
            setCarouselIndex(index);
          }}
          renderItem={({ index, item }) => {
            return (
              <TouchableRipple
                onPress={() => {
                  showTicketDialog({
                    publicId: item.publicId,
                    uri: item.qrCodeUrl,
                  });
                }}
              >
                <Image
                  style={{
                    width: 150,
                    height: 150,
                    alignSelf: 'center',
                  }}
                  source={{
                    uri: item.qrCodeUrl,
                  }}
                />
              </TouchableRipple>
            );
          }}
        />
        <IconButton
          style={{
            backgroundColor: theme.colors.primary,
            left: 40,
            position: 'absolute',
            zIndex: 10,
          }}
          iconColor="white"
          icon="chevron-left"
          onPress={() => {
            carouselRef.current.prev();
          }}
        />
        <IconButton
          style={{
            backgroundColor: theme.colors.primary,
            position: 'absolute',
            right: 40,
            zIndex: 10,
          }}
          iconColor="white"
          icon="chevron-right"
          onPress={() => {
            carouselRef.current.next();
          }}
        />
      </View>
      <View
        style={{
          bottom: 10,
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'row',
        }}
      >
        <Text style={{ fontSize: 16, fontWeight: '700', marginTop: 20 }}>
          {carouselIndex + 1} of {event.tickets.length}
        </Text>
      </View>

      <Button
        reversed
        style={{
          marginTop: 20,
          marginBottom: 20,
        }}
        onPress={() => {
          showAccessQRCode({ publicId: event.publicId });
        }}
        title={'Show Access QR'}
        leftItem={
          <List.Icon
            style={{ width: 20, height: 20 }}
            color={theme.colors.primary}
            icon="qrcode"
          />
        }
      />
      <Button
        style={{
          marginBottom: 40,
        }}
        onPress={() => {
          // router.push(`/attendee/${event.event.publicId}/AddedToList`);
          router.push(`/attendee/${event.event.publicId}/contacts/`);
        }}
        title={'Lead Retrieval'}
        leftItem={
          <List.Icon
            style={{ width: 20, height: 20 }}
            color="white"
            icon="account-search-outline"
          />
        }
      />
    </ScrollView>
  );
}
