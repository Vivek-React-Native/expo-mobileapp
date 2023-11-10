/** @type {import('expo/config').ExpoConfig} */
module.exports = {
  name: 'CrowdPass',
  slug: 'expo-mobileapp',
  scheme: 'com.expo.crowdpass',
  version: '1.1.51',
  owner: 'crowdpass-inc',
  githubUrl: 'https://github.com/crowdpass-inc/expo-mobileapp',
  orientation: 'portrait',
  icon: './assets/icon.png',
  userInterfaceStyle: 'light',
  splash: {
    image: './assets/splash.png',
    resizeMode: 'contain',
    backgroundColor: '#0077F2',
  },
  assetBundlePatterns: ['**/*'],
  ios: {
    supportsTablet: true,
    bundleIdentifier: 'com.expo.crowdpass',
    infoPlist: {
      CFBundleDisplayName: 'CrowdPass.co',
    },
    config: {
      usesNonExemptEncryption: false,
    },
  },
  android: {
    adaptiveIcon: {
      foregroundImage: './assets/adaptive-icon.png',
      backgroundColor: '#0077F2',
    },
    package: 'com.expo.crowdpass',
  },
  updates: {
    url: 'https://u.expo.dev/d30ce626-5559-44b2-af29-7a53abbe4971',
  },
  runtimeVersion: {
    policy: 'appVersion',
  },
  hooks: {
    postPublish: [
      ...(!!process.env.SENTRY_AUTH_TOKEN
        ? [
            {
              file: 'sentry-expo/upload-sourcemaps',
              config: {
                organization: 'crowdpass-inc',
                project: 'expo-mobileapp',
                setCommits: true,
              },
            },
          ]
        : []),
    ],
  },
  plugins: [
    'expo-router',
    ...(!!process.env.SENTRY_AUTH_TOKEN ? ['sentry-expo'] : []),
    [
      'react-native-auth0',
      {
        domain: 'login.crowdpass.co',
        customScheme: 'auth0.com.expo.crowdpass',
      },
    ],
    [
      'react-native-nfc-manager',
      {
        nfcPermission: `Allow $(PRODUCT_NAME) to read/write NFC attendee wristbands`,
        selectIdentifiers: ['D2760000850100', 'D2760000850101'],
        systemCodes: [],
        includeNdefEntitlement: false,
      },
    ],
    [
      'expo-barcode-scanner',
      {
        cameraPermission: `Allow $(PRODUCT_NAME) to use barcode scanner to scan attendee tickets`,
      },
    ],
    [
      'expo-image-picker',
      {
        photosPermission: `Allow $(PRODUCT_NAME) to read photos library to set attendee profile image`,
        cameraPermission: `Allow $(PRODUCT_NAME) to use camera to set attendee profile image`,
      },
    ],
  ],
  experiments: {
    tsconfigPaths: true,
  },
  extra: {
    eas: { projectId: `d30ce626-5559-44b2-af29-7a53abbe4971` },
    NX_AUTH0_CLIENT_ID: `5McbjiUDOBlcdNXo6iCdNRLCT7aTw6LR`,
    NX_AUTH0_DOMAIN: `login.crowdpass.co`,
    NX_FAREHARBOR_URI: `https://cp-fareharbor-webhook.deno.dev`,
    NX_MAIN_URI: `https://dashboard.crowdpass.co`,
    NX_PUBLIC_URI: `https://dashboard.crowdpass.co/api/public`,
    NX_SPEEDWAY_URI: `https://cp-impinj-speedway.deno.dev`,
    NX_URI: `https://dashboard.crowdpass.co/api/v1`,
    SENTRY_AUTH_TOKEN: `8a968510279246ed9c854efa7de05daa51c28ac46bf54b69aad1a86daa2d0c5f`,
  },
};
