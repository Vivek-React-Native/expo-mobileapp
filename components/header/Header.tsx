import {
  Image,
  SafeAreaView,
  View,
  Animated,
  Easing,
  Platform,
  StatusBar,
} from 'react-native';
import { Avatar, Text, TouchableRipple, useTheme } from 'react-native-paper';
import HeaderRightMenu from './HeaderRightMenu';
import { BottomSheetBackdrop, BottomSheetModal } from '@gorhom/bottom-sheet';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Dimensions } from 'react-native';
import { StatusBar as ExpoStatusBar } from 'expo-status-bar';
import { useCurrentQuery } from '@/hooks/useCurrentQuery';
import { Ionicons } from '@expo/vector-icons';
import { useAuth0 } from 'react-native-auth0';
import { showConfirm } from '../dialogs/ConfirmDialog';
import crowdpass from '@/adapters/crowdpass';
import { usePathname } from 'expo-router';

const Header = () => {
  const theme = useTheme();
  const bottomSheetRef = useRef(null);
  const windowHeight = Dimensions.get('window').height;
  const snapPoints = useMemo(() => [200, windowHeight - 140], [windowHeight]);
  const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false);
  const safeAreaColor = isBottomSheetOpen
    ? 'transparent'
    : theme.colors.background;
  const statusBarTheme = isBottomSheetOpen ? 'light' : 'dark';
  const handleSheetChanges = useCallback((index: number) => {
    setIsBottomSheetOpen(index > 0);
  }, []);
  const pathname = usePathname();

  const parts = pathname.split('/').filter(Boolean);

  const auth0 = useAuth0();

  useEffect(() => {
    if (isBottomSheetOpen) {
      bottomSheetRef.current?.present();
    } else {
      bottomSheetRef.current?.close();
    }
  }, [isBottomSheetOpen]);

  const safeAreaOpacity = useRef(new Animated.Value(0)).current;

  const user = useCurrentQuery().findUser().data;
  useEffect(() => {
    Animated.timing(safeAreaOpacity, {
      toValue: isBottomSheetOpen ? 1 : 0,
      duration: 300,
      easing: Easing.linear,
      useNativeDriver: true,
    }).start();
  }, [isBottomSheetOpen]);

  const renderBackdrop = useCallback(
    (props) => <BottomSheetBackdrop {...props} />,
    []
  );

  const deleteAccount = async () => {
    await crowdpass.delete(`/users/current`).then(async (res) => {
      await logOut();
    });
    await auth0.clearSession({
      customScheme: 'auth0.com.expo.crowdpass',
    });
  };

  const logOut = async () => {
    try {
      await auth0.clearSession({
        customScheme: 'auth0.com.expo.crowdpass',
      });
    } catch (error) {
      console.error('onLogout ->', error);
    }
  };

  return (
    <View>
      <SafeAreaView
        style={{
          marginVertical:
            Platform.OS === 'android' ? StatusBar.currentHeight : 0,
          flex: 1,
          height: 192,
          width: '100%',
          backgroundColor: safeAreaColor,
        }}
      />
      <ExpoStatusBar style={statusBarTheme} />

      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          height: 64,
          paddingHorizontal: 24,
          paddingVertical: 8,
          backgroundColor: theme.colors.background,
          zIndex: 5,
        }}
      >
        <Image
          source={require('@/assets/icon.png')}
          resizeMode="contain"
          style={{
            width: 40,
            height: 40,
          }}
          resizeMethod="resize"
        />

        <HeaderRightMenu
          showProfile={() => {
            setIsBottomSheetOpen(true);
          }}
        />
      </View>
      <Animated.View
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'black',
          opacity: safeAreaOpacity,
        }}
      />

      <BottomSheetModal
        backdropComponent={renderBackdrop}
        backgroundStyle={{
          backgroundColor: theme.colors.background,
        }}
        ref={bottomSheetRef}
        style={{
          borderRadius: 30,
          overflow: 'hidden',
        }}
        onChange={handleSheetChanges}
        index={1}
        snapPoints={snapPoints}
        enablePanDownToClose={true}
      >
        <View
          style={{
            backgroundColor: theme.colors.background,
            height: '100%',
            alignItems: 'center',
            paddingVertical: 24,
          }}
        >
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
              width: '100%',
              marginBottom: 30,
            }}
          >
            <Text style={{ fontSize: 22, fontWeight: '700' }}>ACCOUNT</Text>
            <TouchableRipple
              onPress={() => {
                setIsBottomSheetOpen(false);
              }}
              style={{
                padding: 16,
                position: 'absolute',
                right: 16,
              }}
            >
              <Text
                style={{
                  fontSize: 16,
                  fontWeight: '700',
                  color: '#007AFF',
                }}
              >
                CANCEL
              </Text>
            </TouchableRipple>
          </View>
          <Avatar.Text
            style={{
              backgroundColor: '#0077F2',
            }}
            label={user?.firstName?.charAt(0) + user?.lastName?.charAt(0) || ''}
            size={90}
          />
          <Text style={{ fontSize: 28, fontWeight: '700', marginTop: 29 }}>
            {user?.firstName} {user?.lastName}
          </Text>
          {user?.isEnterpriseUser && (
            <Text
              style={{
                fontSize: 17,
                fontWeight: '400',
                marginTop: 8,
                marginBottom: 3,
                color: '#78829D' || theme.colors.tertiary,
              }}
            >
              {parts.includes('dashboard') ? 'Manager' : 'Attendee'}
            </Text>
          )}
          <Text
            style={{
              fontSize: 13,
              fontWeight: '400',
              marginTop: 8,
              marginBottom: 3,
              color: '#78829D' || theme.colors.tertiary,
            }}
          >
            Contact Email
          </Text>
          <Text
            style={{
              height: 26,
              fontSize: 17,
              fontWeight: '700',
              color: '#007AFF',
            }}
          >
            {user?.email}
          </Text>
          <Text
            style={{
              fontSize: 13,
              fontWeight: '400',
              marginTop: 8,
              marginBottom: 3,
              color: '#78829D' || theme.colors.tertiary,
            }}
          >
            Phone
          </Text>
          <Text
            style={{
              height: 26,
              fontSize: 17,
              fontWeight: '700',
              color: '#007AFF',
            }}
          >
            {user?.phoneNumber}
          </Text>
          <TouchableRipple
            onPress={() => {
              showConfirm({
                title: 'Delete Account',
                message: 'Are you sure you want to delete your account?',
              }).then((val) => {
                if (val) {
                  deleteAccount();
                }
              });
            }}
            style={{
              marginTop: 24,
              backgroundColor: '#F5324A',
              justifyContent: 'center',
              alignItems: 'center',
              flexDirection: 'row',
              paddingVertical: 4,
              paddingHorizontal: 16,
              borderRadius: 49,
            }}
          >
            <Text
              style={{
                fontSize: 14,
                fontWeight: '400',
                color: theme.colors.background,
              }}
            >
              Delete Account
            </Text>
          </TouchableRipple>

          <TouchableRipple
            style={{
              position: 'absolute',
              bottom: 0,
              width: '100%',
            }}
            onPress={logOut}
          >
            <View
              style={{
                height: 117,
                justifyContent: 'center',
                alignItems: 'center',
                width: '100%',
                flexDirection: 'row',
                borderRadius: 10,
                borderWidth: 1,
                borderColor: '#E1E7F3',
                // borderColor: theme.colors.outline,
              }}
            >
              <Ionicons
                name="power-outline"
                size={24}
                color={'#78829D' || theme.colors.tertiary}
              />
              <Text
                style={{
                  fontSize: 16,
                  fontWeight: '700',
                  color: '#78829D' || theme.colors.tertiary,
                  marginLeft: 8,
                }}
              >
                Logout
              </Text>
            </View>
          </TouchableRipple>
        </View>
      </BottomSheetModal>
    </View>
  );
};

export default Header;
