import crowdpass from '@/adapters/crowdpass';
import { themes } from '@/config/theme';
import { queryClient } from '@/hooks/useQuery';
import makeStore from '@/redux/store';
import { ActionSheetProvider } from '@expo/react-native-action-sheet';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from '@react-navigation/native';
import { QueryClientProvider } from '@tanstack/react-query';
import { useDeepCompareEffect } from 'ahooks';
import { useFonts } from 'expo-font';
import { SplashScreen, Stack, usePathname, useRouter } from 'expo-router';
import React from 'react';
import { Container as ModalContainer } from 'react-modal-promise';
import { Auth0Provider, useAuth0 } from 'react-native-auth0';
import { PaperProvider, adaptNavigationTheme } from 'react-native-paper';
import { Provider } from 'react-redux';

export { ErrorBoundary } from 'expo-router';

export const unstable_settings = {
  initialRouteName: 'index',
};

SplashScreen.preventAutoHideAsync();

const store = makeStore();

const NavigationThemes = adaptNavigationTheme({
  materialLight: themes.light,
  reactNavigationLight: DefaultTheme,
  materialDark: themes.dark,
  reactNavigationDark: DarkTheme,
});

function App() {
  const router = useRouter();
  const pathname = usePathname();
  const auth0 = useAuth0();
  useDeepCompareEffect(() => {
    if (!!auth0.user) return;
    if (pathname.length > 1 && pathname.split('/').filter(Boolean).length > 0) {
      queryClient.removeQueries();
      router.replace('/');
    }
  }, [auth0.user]);
  return (
    <QueryClientProvider client={queryClient}>
      <PaperProvider theme={themes.light}>
        <ActionSheetProvider>
          <ThemeProvider value={NavigationThemes.LightTheme}>
            <BottomSheetModalProvider>
              <Provider store={store}>
                <Stack
                  initialRouteName="index"
                  screenOptions={{ headerShown: false }}
                />
              </Provider>
            </BottomSheetModalProvider>
            <ModalContainer />
          </ThemeProvider>
        </ActionSheetProvider>
      </PaperProvider>
    </QueryClientProvider>
  );
}

function AppLoader() {
  const auth0 = useAuth0();
  const { token, setToken } = crowdpass.useToken();
  // console.log('token ->', token);
  useDeepCompareEffect(() => {
    if (!auth0.user) {
      return setToken('');
    }
    (async () => {
      try {
        const { accessToken } = await auth0.getCredentials();
        setToken(accessToken);
      } catch (error) {
        console.error('auth0.getCredentials ->', error);
      }
    })();
  }, [auth0.user]);

  const [fontsLoaded, fontsError] = useFonts({
    ...MaterialCommunityIcons.font,
  });
  React.useEffect(() => {
    if (fontsError) throw fontsError;
  }, [fontsError]);

  const isLoading = !fontsLoaded || auth0.isLoading || (!!auth0.user && !token);
  React.useEffect(() => {
    if (isLoading) return;
    SplashScreen.hideAsync();
  }, [isLoading]);

  if (isLoading) {
    return null;
  }

  return <App />;
}

export default function AppLayout() {
  return (
    /* @ts-ignore */
    <Auth0Provider
      clientId={`${process.env['NX_AUTH0_CLIENT_ID']}`}
      domain={`${process.env['NX_AUTH0_DOMAIN']}`}
    >
      <AppLoader />
    </Auth0Provider>
  );
}
