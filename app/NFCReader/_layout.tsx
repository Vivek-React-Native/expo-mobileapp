import Header from '@/components/header/Header';
import { Stack,useRouter } from 'expo-router';
import React from 'react';
import { Button } from 'react-native';
export default function NFCReaderLayout() {
  const router = useRouter();
  return (
    <Stack
      initialRouteName="events"
    >
      <Stack.Screen
        options={{
          headerTitle: "NFC Reader",
          headerLeft: () => (
            <Button
              onPress={() => router.back()}
              title="Back"
              color="black"
            />
          ),
        }}
        name="events"
      />
    </Stack>
  );
}
