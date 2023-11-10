import * as Sentry from 'sentry-expo';

Sentry.init({
  dsn: 'https://75fa0a4f697b4d56a6382c44d35fae49@o1037833.ingest.sentry.io/4505483642994688',
  environment: !!__DEV__ ? 'development' : 'production',
  enableNative: !__DEV__,
  // enableInExpoDevelopment: !!__DEV__,
  // debug: !!__DEV__,
  // attachStacktrace: true,
  // integrations: [new Sentry.Native.ReactNativeTracing()],
  // enableCaptureFailedRequests: true,
});
