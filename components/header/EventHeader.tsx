import { Image } from 'expo-image';
import { useRouter } from 'expo-router/src/hooks';
import { SafeAreaView, View } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { Text, useTheme } from 'react-native-paper';

interface EventHeaderProps {
  title: any;
  rightItem?: any;
}

const EventHeader = ({ title, rightItem }: EventHeaderProps) => {
  const theme = useTheme();
  const router = useRouter();

  return (
    <SafeAreaView
      style={{
        backgroundColor: theme.colors.background,
        flexDirection: 'row',
        position: 'relative',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 40,
      }}
    >
      <TouchableOpacity
        containerStyle={{
          position: 'absolute',
          left: 16,
          right: 0,
          bottom: 20,
          zIndex: 10,
        }}
        onPress={() => {
          router.back();
        }}
      >
        <Image
          style={{
            width: 24,
            height: 24,
          }}
          source={require('@/assets/icons/chevron-back.png')}
        />
      </TouchableOpacity>

      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          height: 64,
          paddingHorizontal: 24,
          paddingVertical: 8,
          backgroundColor: theme.colors.background,
        }}
      >
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'flex-start',
            left: 40,
            width: '100%',
          }}
        >
          <Text
            lineBreakMode="tail"
            numberOfLines={1}
            style={{
              letterSpacing: 0.312,
              fontSize: 24,
              fontWeight: '700',
              color: 'black',
              width: '80%',
            }}
          >
            {title}
          </Text>
        </View>
      </View>
      <View
        style={{
          position: 'absolute',
          right: 6,
          bottom: 4,
          zIndex: 10,
        }}
      >
        {rightItem}
      </View>
    </SafeAreaView>
  );
};

export default EventHeader;
