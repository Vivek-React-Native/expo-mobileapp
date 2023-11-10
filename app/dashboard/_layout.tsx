import HeaderRightMenu from '@/components/HeaderRightMenu';
import { useAttendeeQuery } from '@/hooks/useAttendeeQuery';
import { useEventsQuery } from '@/hooks/useEventsQuery';
import { Stack, useGlobalSearchParams } from 'expo-router';
import React from 'react';
import { Image } from 'expo-image';
import EventHeader from '@/components/header/EventHeader';

export default function DashboardLayout(props) {
  const eventId = Number.parseInt(useGlobalSearchParams().event as string);
  const event = useEventsQuery().findOne(eventId).data;
  const attendeeId = Number.parseInt(
    useGlobalSearchParams().attendee as string
  );
  const attendee = useAttendeeQuery(attendeeId).findOne().data;
  return (
    <Stack initialRouteName="events">
      <Stack.Screen
        name="events"
        options={{
          headerTitle: 'Events',
          headerLeft: () => (
            <Image
              style={{ width: 32, height: 32 }}
              source={require('@/assets/icon.png')}
              contentFit="contain"
            />
          ),
          headerRight: () => <HeaderRightMenu />,
          headerStyle: { backgroundColor: 'transparent' },
        }}
      />
      <Stack.Screen
        name="[event]/(tabs)"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="[event]/attendee/[attendee]/attendee"
        options={{
          headerBackTitleVisible: false,
          headerTitle: attendee
            ? `${attendee.firstName} ${attendee.lastName}`
            : '',
        }}
      />
      <Stack.Screen
        name="[event]/add-attendee"
        initialParams={{ step: 0 }}
        options={{
          title: 'Add Attendee',
          headerBackTitle: 'Cancel',
        }}
      />
      <Stack.Screen
        name="[event]/photobooth/index"
        initialParams={{ step: 0 }}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="[event]/photobooth/send"
        initialParams={{ step: 0 }}
        options={{
          headerShown: false,
          gestureEnabled: false,
        }}
      />
      <Stack.Screen
        name="[event]/photobooth/settings"
        initialParams={{ step: 0 }}
        options={{
          header: () => <EventHeader title={event?.title} />,
        }}
      />
      <Stack.Screen
        name="[event]/[area]/[gate]/advoc8-scan"
        initialParams={{ step: 0 }}
        options={{
          gestureEnabled: false,
        }}
      />
      <Stack.Screen
        name="[event]/nfc-reader/index"
        initialParams={{ step: 0 }}
        options={{
          header: () => <EventHeader title={event?.title} />,
        }}
      />

      <Stack.Screen name="check-in-result" initialParams={{ step: 0 }} />
    </Stack>
  );
}
