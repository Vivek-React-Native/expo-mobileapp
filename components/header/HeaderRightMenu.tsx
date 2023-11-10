import { useCurrentQuery } from '@/hooks/useCurrentQuery';
import { usePathname, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { TouchableWithoutFeedback } from 'react-native';
import { Avatar, Menu } from 'react-native-paper';

export default function HeaderRightMenu({ showProfile }) {
  const router = useRouter();
  const pathname = usePathname();
  const parts = pathname.split('/').filter(Boolean);
  const user = useCurrentQuery().findUser().data;
  const [visible, setVisible] = useState(false);

  return (
    <Menu
      visible={visible}
      onDismiss={() => setVisible(false)}
      anchor={
        <TouchableWithoutFeedback onPress={() => setVisible(true)}>
          <Avatar.Text
            label={
              (user?.firstName && user?.lastName
                ? user?.firstName?.charAt(0) + user?.lastName?.charAt(0)
                : user?.email?.slice(0, 1)) || ''
            }
            size={38}
            style={{ margin: 0 }}
          />
        </TouchableWithoutFeedback>
      }
    >
      <Menu.Item
        leadingIcon="account-circle"
        title="Profile"
        onPress={() => {
          setVisible(false);
          showProfile();
        }}
      />
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
    </Menu>
  );
}
