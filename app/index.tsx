import * as Sentry from 'sentry-expo';
import { useRouter, Redirect } from 'expo-router';
import { Image } from 'expo-image';
import { View } from 'react-native';
import { useAuth0 } from 'react-native-auth0';
import { Button, Text } from 'react-native-paper';
import { useCurrentQuery } from '@/hooks/useCurrentQuery';
import { useDeepCompareEffect } from 'ahooks';
import crowdpass from '@/adapters/crowdpass';
import LoadingIndicator from '@/components/LoadingIndicator';
export default function Index() {
  const router = useRouter();
  const auth0 = useAuth0();

  const { token } = crowdpass.useToken();
  const queries = {
    current: useCurrentQuery(),
  };
  const { data: user, isLoading } = queries.current.findUser({
    enabled: !!token,
  });

  useDeepCompareEffect(() => {
    if (!!auth0.user && !isLoading && !user) {
      (async () => {
        try {
          await crowdpass.post(
            `/users/from-identity`,
            {},
            { params: { isAttendee: true } }
          );
          queries.current.invalidate(['findUser']);
        } catch (error) {
          console.error('post /users/from-identity ->', error);
        }
      })();
    }
  }, [user]);

  async function onLogin(screen_hint?: string) {
    try {
      await auth0.authorize(
        { scope: 'openid profile email', screen_hint },
        { customScheme: 'auth0.com.expo.crowdpass' }
      );
    } catch (error) {
      console.error('onLogin ->', error);
    }
  }

  if (!!auth0.user) {
    if (isLoading) {
      return <LoadingIndicator />;
    }
    // if (!__DEV__) {
    if (user?.isEnterpriseUser) {
      return <Redirect href="/dashboard" />;
    }
    if (!!user) {
      return <Redirect href="/attendee" />;
    }
    // }
  }

  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        gap: 16,
      }}
    >
      <Image
        style={{ width: '100%', height: 48, marginBottom: 64 }}
        source={require('../assets/crowdpass-banner.svg')}
        contentFit="contain"
      />

      {!auth0.user && (
        <>
          <Button
            style={{ width: 192 }}
            mode="contained"
            onPress={() => onLogin()}
          >
            Login
          </Button>
          <Button
            style={{ width: 192 }}
            mode="outlined"
            onPress={() => onLogin('signup')}
          >
            Sign Up
          </Button>
        </>
      )}

      {auth0.error && <Text>Auth0 Error: {auth0.error.error_description}</Text>}

      {auth0.user && (
        <>
          <Text>{auth0.user.name}</Text>

          <Button
            style={{ width: 192 }}
            mode="contained"
            onPress={async () => {
              try {
                await auth0.clearSession({
                  customScheme: 'auth0.com.expo.crowdpass',
                });
              } catch (error) {
                console.error('onLogout ->', error);
              }
            }}
          >
            Log Out
          </Button>

          <Button
            style={{ width: 192 }}
            mode="outlined"
            onPress={() => router.replace('/attendee')}
          >
            My Events
          </Button>

          <Button
            style={{ width: 192 }}
            mode="outlined"
            onPress={() => router.replace('/dashboard')}
          >
            Events Dashboard
          </Button>
        </>
      )}

      {__DEV__ && (
        <Button
          style={{ width: 192 }}
          mode="outlined"
          onPress={() => router.push('/_sitemap')}
        >
          Sitemap
        </Button>
      )}

      <Button
          style={{ width: 192 }}
          mode="outlined"
          onPress={() =>  router.push('/NFCReader')}
        >
          NFC Reader Data
        </Button>
    </View>
  );
}
