import EventHeader from '@/components/header/EventHeader';
import { useCurrentQuery } from '@/hooks/useCurrentQuery';
import { Stack, useGlobalSearchParams } from 'expo-router';
import React from 'react';

export default function AttendeeEventLayout(props) {
  const publicId = useGlobalSearchParams().event as string;
  const event = useCurrentQuery().findOneEvent(publicId).data;

  return (
    <Stack
      screenOptions={{
        header: () => <EventHeader title={event?.event.title} />,
      }}
      initialRouteName="attendee"
    >
      <Stack.Screen name="attendee" />
      <Stack.Screen name="contacts" />
      <Stack.Screen name="tickets" />
      <Stack.Screen name="contact-card" />
    </Stack>
  );
}
