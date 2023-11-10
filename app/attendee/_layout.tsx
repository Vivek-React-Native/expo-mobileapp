import Header from '@/components/header/Header';
import { Stack } from 'expo-router';
import React from 'react';
export default function AttendeeLayout() {
  return (
    <Stack
      screenOptions={{
        header: () => <Header />,
      }}
      initialRouteName="events"
    >
      <Stack.Screen name="events" />
      <Stack.Screen
        options={{
          headerShown: false,
        }}
        name="[event]"
      />
    </Stack>
  );
}
