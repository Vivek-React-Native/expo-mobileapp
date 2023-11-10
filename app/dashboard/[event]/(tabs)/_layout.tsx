import EventHeader from '@/components/header/EventHeader';
import { useEventsQuery } from '@/hooks/useEventsQuery';
import { Tabs, useGlobalSearchParams, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { useWindowDimensions } from 'react-native';
import { IconButton, Menu as PaperMenu, useTheme } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import * as ImagePicker from 'expo-image-picker';

export default function DashboardEventLayout(props) {
  const eventId = Number.parseInt(useGlobalSearchParams().event as string);
  const event = useEventsQuery().findOne(eventId).data;

  return (
    <Tabs
      initialRouteName="dashboard"
      screenOptions={{
        header: () => <EventHeader rightItem={<Menu />} title={event?.title} />,
      }}
    >
      <Tabs.Screen
        name="dashboard"
        options={{
          tabBarIcon: (props) => <Icon {...props} name="view-dashboard" />,
          tabBarLabel: 'Dashboard',
        }}
      />
      <Tabs.Screen
        name="attendees"
        options={{
          tabBarIcon: (props) => <Icon {...props} name="account-group" />,
          tabBarLabel: 'Attendees',
        }}
      />
      <Tabs.Screen
        name="scan"
        options={{
          tabBarIcon: (props) => <Icon {...props} name="credit-card-scan" />,
          tabBarLabel: 'Scan Tickets',
        }}
      />
      <Tabs.Screen
        name="areas"
        options={{
          tabBarIcon: (props) => <Icon {...props} name="select-group" />,
          tabBarLabel: 'Areas',
        }}
      />
    </Tabs>
  );
}

function Menu() {
  const { width } = useWindowDimensions();
  const [visible, setVisible] = useState(false);
  const theme = useTheme();
  const eventId = Number.parseInt(useGlobalSearchParams().event as string);
  const router = useRouter();
  if (width < 800) return null;
  return (
    <PaperMenu
      theme={{
        colors: {
          backdrop: theme.colors.primary,
          background: theme.colors.primary,
        },
      }}
      style={{
        marginTop: 48,
        borderRadius: 10,
      }}
      contentStyle={{
        backgroundColor: theme.colors.background,
        borderRadius: 10,
        paddingHorizontal: 12,
      }}
      visible={visible}
      onDismiss={() => setVisible(false)}
      anchor={
        <IconButton
          iconColor={theme.colors.primary}
          onPress={() => {
            setVisible(true);
          }}
          icon={'dots-vertical'}
        />
      }
    >
      <PaperMenu.Item
        leadingIcon={() => (
          <Icon name="camera" size={24} color={theme.colors.backdrop} />
        )}
        title="Photobooth Mode"
        theme={{
          colors: {
            text: theme.colors.primary,
          },
        }}
        onPress={async () => {
          setVisible(false);
          const cameraPermissions =
            await ImagePicker.getCameraPermissionsAsync();
          let permission = false;
          if (!cameraPermissions.granted) {
            const res = await ImagePicker.requestCameraPermissionsAsync();
            if (!res.granted) return;
          }
          router.push({
            pathname: '/dashboard/[event]/photobooth',
            params: {
              eventId,
            },
          });
        }}
      />
      <PaperMenu.Item
        leadingIcon={() => (
          <Icon
            name="transit-connection-variant"
            size={24}
            color={theme.colors.backdrop}
          />
        )}
        title="Connect NFC Reader"
        theme={{
          colors: {
            text: theme.colors.primary,
          },
        }}
        onPress={async () => {
          setVisible(false);
          router.push({
            pathname: '/dashboard/[event]/nfc-reader',
            params: {
              event: eventId,
            },
          });
        }}
      />
      <PaperMenu.Item
        leadingIcon={() => (
          <Icon name="cog-outline" size={24} color={theme.colors.backdrop} />
        )}
        title="Photobooth Settings"
        theme={{
          colors: {
            text: theme.colors.primary,
          },
        }}
        onPress={() => {
          setVisible(false);
          router.push({
            pathname: '/dashboard/[event]/photobooth/settings',
            params: {
              event: eventId,
            },
          });
        }}
      />
    </PaperMenu>
  );
}
