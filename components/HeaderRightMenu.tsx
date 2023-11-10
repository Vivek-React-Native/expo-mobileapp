import { useCurrentQuery } from '@/hooks/useCurrentQuery';
import {
  Tabs,
  Stack,
  Slot,
  useGlobalSearchParams,
  usePathname,
  useRouter,
} from 'expo-router';
import React from 'react';
import { View } from 'react-native';
import { useAuth0 } from 'react-native-auth0';
import {
  Appbar,
  Divider,
  IconButton,
  Menu,
  useTheme,
} from 'react-native-paper';

export default function HeaderRightMenu() {
  const theme = useTheme();
  const auth0 = useAuth0();
  const router = useRouter();
  const pathname = usePathname();
  const parts = pathname.split('/').filter(Boolean);
  const user = useCurrentQuery().findUser().data;

  const [visible, setVisible] = React.useState(false);
  return (
    <Menu
      visible={visible}
      onDismiss={() => setVisible(false)}
      anchor={
        <Appbar.Action
          iconColor={theme.colors.primary}
          style={{ margin: 0 }}
          icon={
            parts.includes('dashboard') ? 'shield-account' : 'account-circle'
          }
          onPress={() => setVisible(true)}
        />
      }
    >
      {!parts.includes('dashboard') && user?.isEnterpriseUser && (
        <Menu.Item
          leadingIcon="shield-account"
          title="Switch to Hosting"
          onPress={() => {
            setVisible(false);
            router.replace('/dashboard');
          }}
        />
      )}
      {parts.includes('dashboard') && (
        <Menu.Item
          leadingIcon="account-circle"
          title="Switch to Attendee"
          onPress={() => {
            setVisible(false);
            router.replace('/attendee');
          }}
        />
      )}
      <Menu.Item
        leadingIcon="logout-variant"
        title="Logout"
        onPress={async () => {
          setVisible(false);
          try {
            await auth0.clearSession({
              customScheme: 'auth0.com.expo.crowdpass',
            });
          } catch (error) {
            console.error('onLogout ->', error);
          }
        }}
      />
    </Menu>
  );
}
