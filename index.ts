import dayjs from 'dayjs';
import advancedFormat from 'dayjs/plugin/advancedFormat';
import relativeTime from 'dayjs/plugin/relativeTime';
import timezone from 'dayjs/plugin/timezone';
import Constants from 'expo-constants';
import { LogBox } from 'react-native';

dayjs.extend(timezone);
dayjs.extend(advancedFormat);
dayjs.extend(relativeTime);

if (__DEV__) {
  LogBox.uninstall();
  // console.log('\x1b[2J\x1b[3J\x1b[1;1H');
  console.log();
  console.log();
  console.log();
  console.log(`████  ${dayjs().format('hh:mm:ss')}  ████`);
  console.log();
}

for (const [key, value] of Object.entries(Constants.expoConfig.extra)) {
  if (typeof value == 'string') {
    Object.assign(process.env, { [key]: value });
  }
}
// if (__DEV__) {
//   process.env.NX_MAIN_URI = 'https://dashboard.dev.crowdpass.co';
//   process.env.NX_PUBLIC_URI = 'https://dashboard.dev.crowdpass.co/api/public';
//   process.env.NX_URI = 'https://dashboard.dev.crowdpass.co/api/v1';
// }

import '@/adapters/sentry';
import 'expo-router/entry';
