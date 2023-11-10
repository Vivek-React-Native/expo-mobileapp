import {
  useBoolean,
  useMount,
  useTimeout,
  useUnmount,
  useUpdate,
  useUpdateEffect,
} from 'ahooks';
import { View } from 'react-native';
import { ActivityIndicator } from 'react-native-paper';
import { LoaderScreen } from 'react-native-ui-lib';

export default function LoadingIndicator() {
  const [animating, { setTrue }] = useBoolean(false);
  useTimeout(() => setTrue(), 500);

  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <ActivityIndicator
        animating={animating}
        hidesWhenStopped
        size={64}
        style={{ margin: 64 }}
        theme={{ animation: { scale: 2 } }}
      />
    </View>
  );

  // return <ActivityIndicator style={{ marginTop: '50%' }} size={64} />;
  // return <LoaderScreen message="Message goes here" />;
}
