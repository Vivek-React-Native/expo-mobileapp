import { Image, View } from 'react-native';
import * as _ from 'radash';
import Button from '@/components/buttons/Button';
import { useRouter } from 'expo-router';
import { Text } from 'react-native-paper';

export default function AddedToList() {
  const router = useRouter();
  return (
    <View style={{ flex: 1, paddingHorizontal: 16, alignItems: 'center' }}>
      <Image
        style={{ width: 120, height: 120, marginTop: '20%', marginBottom: 24 }}
        source={require('@/assets/images/confirm-check.png')}
      />
      <Text
        style={{
          fontSize: 34,
          fontWeight: '700',
          marginBottom: 24,
          letterSpacing: 0.374,
        }}
      >
        Added to List!
      </Text>
      <Button
        onPress={() => {
          router.back();
        }}
        title="Return to Attendee"
        style={{ marginTop: 24 }}
      />

      <Button
        reversed
        onPress={() => {
          router.back();
        }}
        title="View Lists"
        style={{ marginTop: 24 }}
      />
    </View>
  );
}
