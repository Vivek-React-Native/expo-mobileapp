import LoadingIndicator from '@/components/LoadingIndicator';
import crowdpass, { speedway } from '@/adapters/crowdpass';
import { showConfirm } from '@/components/dialogs/ConfirmDialog';
import { showSnackbar } from '@/components/SnackbarDialog';
import { useEventAttendeesQuery } from '@/hooks/useEventAttendeesQuery';
import { useEventsQuery } from '@/hooks/useEventsQuery';
import { BlobDto } from '@/types/swagger';
import dayjs from 'dayjs';
import * as FileSystem from 'expo-file-system';
import { useLocalSearchParams, useNavigation } from 'expo-router';
import * as _ from 'radash';
import React, { useLayoutEffect } from 'react';
import NfcManager, { Ndef, NfcTech } from 'react-native-nfc-manager';
import {
  Avatar,
  Card,
  Divider,
  List,
  IconButton,
  useTheme,
  Menu,
  Appbar,
} from 'react-native-paper';
import { useAttendeeQuery } from '@/hooks/useAttendeeQuery';
import { ScrollView, Text, View } from 'react-native';
import { showImagePicker } from '@/components/dialogs/ImagePickerDialog';
import { useEventAreasQuery } from '@/hooks/useEventAreasQuery';
import { useReadersQuery } from '@/hooks/useReadersQuery';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Dropdown from '@/components/dropdown';
import EventHeader from '@/components/header/EventHeader';

export default function DashboardEventAttendee(props) {
  const theme = useTheme();

  const params = useLocalSearchParams();
  const eventId = Number.parseInt(params.event as string);
  const attendeeId = Number.parseInt(params.attendee as string);

  const queries = {
    events: useEventsQuery(),
    attendees: useEventAttendeesQuery(eventId),
    attendee: useAttendeeQuery(attendeeId),
    areas: useEventAreasQuery(eventId),
    readers: useReadersQuery(eventId),
  };
  const { event, attendee, devices, readers, areas, ...data } = {
    event: queries.events.findOne(eventId).data,
    attendee: queries.attendee.findOne().data,
    devices: queries.attendee.findAllDevices().data,
    readers: queries.readers.findAll().data ?? [],
    areas: queries.areas.findAll().data,
    visits: queries.areas.findAllVisits().data,
    exits: queries.areas.findAllExits().data,
  };

  const navigation = useNavigation();
  const [headerRightMenuVisible, setHeaderRightMenuVisible] =
    React.useState(false);

  useLayoutEffect(() => {
    navigation.setOptions({
      header: () => (
        <EventHeader
          title={attendee?.firstName + ' ' + attendee?.lastName}
          rightItem={
            <Menu
              style={{ marginTop: 8, marginLeft: 8 }}
              visible={headerRightMenuVisible}
              onDismiss={() => setHeaderRightMenuVisible(false)}
              anchorPosition="bottom"
              anchor={
                <Appbar.Action
                  size={28}
                  iconColor={theme.colors.primary}
                  style={{ margin: 0, marginRight: -4 }}
                  icon="dots-vertical"
                  onPress={() => setHeaderRightMenuVisible(true)}
                />
              }
            >
              <Menu.Item
                leadingIcon="face-man-profile"
                title="Upload photo"
                onPress={() => {
                  setHeaderRightMenuVisible(false);
                  uploadPhoto();
                }}
              />
            </Menu>
          }
        />
      ),
    });
  }, [headerRightMenuVisible, attendee]);

  if (
    !event ||
    !attendee ||
    !devices ||
    !areas ||
    !data.visits ||
    !data.exits
  ) {
    return <LoadingIndicator />;
  }

  let fields = _.pick(attendee, [
    'company',
    'customUrl',
    'instagram',
    'jobTitle',
    'linkedin',
    'phoneNumber',
    'twitter',
  ]) as any as Record<string, string>;
  (event.customRegistrationQuestions ?? []).forEach((question) => {
    const answer = attendee.customRegistrationAnswers.find(
      (v) => v.questionId == question.id
    );
    if (answer?.givenAnswer) {
      fields[question.name] = answer?.givenAnswer;
    }
  });
  fields = _.shake(fields, (v) => !v);

  const group =
    event.attendeeGroups.find((v) => v.id == attendee.attendeeGroupId) ??
    event.attendeeGroups.find((v) => v.isDefault == true);

  const allVisits = _.clone(
    data.visits.concat(data.exits).filter((v) => v.attendeeId == attendeeId)
  ).sort((a, b) => {
    return (
      new Date(b.checkInDate ?? b.checkOutDate).valueOf() -
      new Date(a.checkInDate ?? a.checkOutDate).valueOf()
    );
  });

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
      await crowdpass.put(`/attendees/${attendeeId}`, {
        ..._.omit(attendee, ['healthScreening']),
        profilePhotoBlobId,
      });
      queries.attendee.invalidate();
      queries.attendees.invalidate();
      showSnackbar({
        message: 'Successfully uploaded attendee photo!',
      });
    } catch (error) {
      console.error('photo upload ->', error);
      showSnackbar({ message: `Error: ${error?.message}` });
    }
  }

  async function doManualCheckin() {
    try {
      const confirm = await showConfirm({
        title: `Check-in "${attendee.firstName} ${attendee.lastName}"?`,
      });
      if (!confirm) return;
      await crowdpass.post(
        `/events/${eventId}/attendees/${attendeeId}/checkin?checkInMethod=Manual`
      );
      queries.attendee.invalidate();
      queries.attendees.invalidate();
      queries.areas.invalidate(['findAllVisits']);
      queries.areas.invalidate(['findAllExits']);
      showSnackbar({ message: 'Successfully checked in!' });
    } catch (error) {
      console.error('Manual check-in ->', error);
      showSnackbar({ message: `Error: ${error?.message}` });
    }
  }

  return (
    <ScrollView nestedScrollEnabled={true} style={{ flex: 1 }}>
      <Card mode="elevated" style={{ margin: 16 }} onPress={uploadPhoto}>
        {Number.isFinite(attendee.profilePhotoBlobId) && (
          <Card.Cover
            source={{
              uri: `${process.env['NX_URI']}/blobs/${attendee.profilePhotoBlobId}`,
              headers: {
                Authorization: `Bearer ${crowdpass.useToken.getState().token}`,
              },
            }}
          />
        )}
        <Card.Title
          title={`${attendee.firstName} ${attendee.lastName}`}
          titleVariant="titleMedium"
          subtitle={group.name}
          subtitleVariant="bodySmall"
          subtitleStyle={{ color: group.color }}
          left={(props) => {
            return (
              <Avatar.Text
                {...props}
                style={{ backgroundColor: group.color }}
                color="white"
                label={`${(attendee.firstName ?? '')
                  ?.charAt(0)
                  ?.toUpperCase()}${(attendee.lastName ?? '')
                  ?.charAt(0)
                  ?.toUpperCase()}`}
              />
            );
          }}
          right={(props) => (
            <List.Icon
              {...props}
              style={{ marginRight: 16 }}
              color={attendee.isCheckedIn ? '#00CA81' : ''}
              icon={
                attendee.isCheckedIn ? 'check-decagram' : 'decagram-outline'
              }
            />
          )}
        />

        {!attendee.isCheckedIn && (
          <>
            <Divider />
            <List.Item
              title="Manual check-in"
              left={(props) => (
                <List.Icon {...props} icon="check-decagram-outline" />
              )}
              right={(props) => <List.Icon {...props} icon="chevron-right" />}
              onPress={doManualCheckin}
            />
          </>
        )}
      </Card>
      <Text
        style={{
          fontSize: 16,
          fontWeight: '600',
          margin: 16,
          paddingVertical: 5,
        }}
      >
        Attendee Group
      </Text>
      <View
        style={{
          paddingHorizontal: 18,
          zIndex: 2000,
        }}
      >
        <Dropdown
          data={event.attendeeGroups}
          color={group.color}
          items={event.attendeeGroups.map((v) => ({
            label: v.name,
            value: v,
          }))}
          placeholder="Updating"
          value={group}
          setValue={async (v) => {
            console.log(v, 'v');
            const res = await crowdpass.put(`/attendees/${attendeeId}`, {
              ...attendee,
              attendeeGroupId: v.value.id,
            });
            queries.attendee.invalidate();
            queries.attendees.invalidate();
          }}
          style={{ margin: 16 }}
        />
      </View>
      <Text
        style={{
          fontSize: 16,
          fontWeight: '600',
          margin: 16,
          marginBottom: 0,
        }}
      >
        Attendee Details
      </Text>
      <List.Item
        title={`${attendeeId} - ${attendee.publicId}`}
        description="Identification"
        left={(props) => <List.Icon {...props} icon="identifier" />}
      />

      <List.Item
        title={attendee.email}
        description="Email"
        left={(props) => <List.Icon {...props} icon="email" />}
      />
      {Object.entries(fields).map(([key, value], i) => {
        return (
          <List.Item
            key={i}
            title={value}
            description={_.title(key)}
            left={(props) => (
              <View style={{ ...props.style, width: 24 }}></View>
            )}
          />
        );
      })}
      <Text
        style={{
          fontSize: 16,
          fontWeight: '600',
          margin: 16,
          marginTop: 0,
          paddingVertical: 5,
        }}
      >
        Devices
      </Text>
      {devices.length == 0 && (
        <List.Item
          style={{
            width: '95%',
            left: '2.5%',
            borderRadius: 8,
            backgroundColor: theme.colors.primary,
          }}
          titleStyle={{
            color: 'white',
          }}
          title="Pair NFC wristband"
          left={(props) => (
            <MaterialCommunityIcons
              {...props}
              name="nfc-tap"
              color="white"
              size={24}
            />
          )}
          right={(props) => (
            <MaterialCommunityIcons
              {...props}
              name="chevron-right"
              color="white"
              size={24}
            />
          )}
          onPress={async () => {
            try {
              await NfcManager.start();
              await NfcManager.requestTechnology(NfcTech.Ndef);
              const tag = await NfcManager.getTag();
              if (!tag.id) throw new Error(`Invalid tag.id`);
              const bytes = Ndef.encodeMessage([
                Ndef.textRecord(attendee.publicId),
              ]);
              if (!bytes) throw new Error(`Invalid bytes`);
              await NfcManager.ndefHandler.writeNdefMessage(bytes);
              NfcManager.cancelTechnologyRequest();

              if (readers.length > 0) {
                await speedway.post(`/attendees/${attendeeId}/devices`, {
                  deviceUuid: tag.id,
                });
              } else {
                await crowdpass.post(`/attendees/${attendeeId}/devices`, {
                  deviceUuid: tag.id,
                  metadata: 'Wristband',
                });
              }

              queries.attendee.invalidate(['findAllDevices']);
              showSnackbar({
                message: 'Successfully paired NFC wristband!',
              });

              if (readers.length > 0) {
                doManualCheckin();
              }
            } catch (error) {
              console.error('Pair NFC wristband ->', error);
              showSnackbar({
                message: 'Could not pair NFC wristband',
                error,
              });
            } finally {
              NfcManager.cancelTechnologyRequest();
            }
          }}
        />
      )}

      {devices.length > 0 &&
        devices.map((device, i) => {
          return (
            <List.Item
              key={i}
              title={device.deviceUuid}
              description={device.metadata}
              left={(props) => (
                <List.Icon {...props} icon="nfc-tap" color="#00CA81" />
              )}
              right={(props) => (
                <IconButton
                  style={{ margin: 0, marginRight: -8 }}
                  icon="nfc-variant-off"
                  iconColor="#F5324A"
                  onPress={async () => {
                    try {
                      const confirm = await showConfirm({
                        title: `Unpair "${attendee.firstName} ${attendee.lastName}" wristband?`,
                      });
                      if (!confirm) return;
                      await crowdpass.delete(
                        `/attendees/${attendeeId}/devices/${device.deviceUuid}`
                      );
                      queries.attendee.invalidate(['findAllDevices']);
                      showSnackbar({
                        message: 'Successfully unpaired wristband!',
                      });
                    } catch (error) {
                      console.error('unpair wristband ->', error);
                      showSnackbar({ message: `Error: ${error?.message}` });
                    }
                  }}
                />
              )}
            />
          );
        })}
      <Text
        style={{
          fontSize: 16,
          fontWeight: '600',
          margin: 16,
          marginBottom: 0,
          paddingVertical: 5,
        }}
      >
        Areas
      </Text>

      {areas.map((area, i) => {
        const visits = allVisits.filter((v) => v.areaId == area.id);
        return (
          <List.Accordion
            key={i}
            title={area.name}
            description={
              visits[0]?.checkInDate
                ? `Checked-in ${dayjs(visits[0]?.checkInDate).fromNow()}`
                : visits[0]?.checkOutDate
                ? `Checked-out ${dayjs(visits[0]?.checkOutDate).fromNow()}`
                : ''
            }
            descriptionStyle={{
              color: visits[0]?.checkInDate
                ? '#00CA81'
                : visits[0]?.checkOutDate
                ? '#F5324A'
                : '',
            }}
            left={(props) => (
              <Avatar.Text
                style={props.style}
                size={24}
                label={visits.length.toString()}
                color="white"
                labelStyle={{ fontWeight: 'bold' }}
              />
            )}
          >
            {area.eventAreaGates.map((gate, i) => {
              const visits = allVisits.filter((v) => v.gateId == gate.id);
              return (
                <List.Item
                  key={i}
                  title={gate.name}
                  description={`${visits.length} Visits`}
                  left={(props) => (
                    <View style={{ ...props.style, width: 24 }}></View>
                  )}
                  right={(props) => (
                    <View
                      style={{
                        ...props.style,
                        flexDirection: 'row',
                        columnGap: 8,
                        marginRight: -4,
                      }}
                    >
                      <IconButton
                        style={{ margin: 0 }}
                        icon="location-enter"
                        iconColor="#00CA81"
                        onPress={async () => {
                          try {
                            const confirm = await showConfirm({
                              title: `Check-in\n${attendee.firstName} ${attendee.lastName}\nto gate\n${gate.name}?`,
                            });
                            if (!confirm) return;
                            await crowdpass.post(
                              `/events/${eventId}/attendees/${attendeeId}/checkin?checkInMethod=Manual&gateId=${gate.id}`
                            );
                            queries.attendee.invalidate();
                            queries.attendees.invalidate();
                            queries.areas.invalidate(['findAllVisits']);
                            queries.areas.invalidate(['findAllExits']);
                            showSnackbar({
                              message: 'Successfully checked in!',
                            });
                          } catch (error) {
                            console.error('Manual check-in ->', error);
                            showSnackbar({
                              message: `Error: ${error?.message}`,
                            });
                          }
                        }}
                      />
                      <IconButton
                        style={{ margin: 0 }}
                        icon="location-exit"
                        iconColor="#F5324A"
                        onPress={async () => {
                          try {
                            const confirm = await showConfirm({
                              title: `Check-out\n${attendee.firstName} ${attendee.lastName}\nout of gate\n${gate.name}?`,
                            });
                            if (!confirm) return;
                            await crowdpass.post(
                              `/events/${eventId}/attendees/${attendeeId}/check-out?checkInMethod=Manual&gateId=${gate.id}`
                            );
                            queries.attendee.invalidate();
                            queries.attendees.invalidate();
                            queries.areas.invalidate(['findAllVisits']);
                            queries.areas.invalidate(['findAllExits']);
                            showSnackbar({
                              message: 'Successfully checked out!',
                            });
                          } catch (error) {
                            console.error('Manual check-out ->', error);
                            showSnackbar({
                              message: `Error: ${error?.message}`,
                            });
                          }
                        }}
                      />
                    </View>
                  )}
                />
              );
            })}
          </List.Accordion>
        );
      })}

      <View style={{ marginVertical: 64 }} />
    </ScrollView>
  );
}
