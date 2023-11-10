import { Text, View } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { useTheme } from 'react-native-paper';

interface ButtonProps {
  title: string;
  onPress: () => void;
  leftItem?: React.ReactNode;
  reversed?: boolean;
  style?: {};
  textColor?: string;
}

export default function Button({
  title,
  onPress,
  leftItem,
  reversed,
  textColor,
  ...props
}: ButtonProps) {
  const theme = useTheme();

  const backgroundColor = reversed
    ? theme.colors.background
    : theme.colors.primary;
  const color =
    textColor ?? (reversed ? theme.colors.primary : theme.colors.background);

  console.log(color);
  return (
    <TouchableOpacity
      {...props}
      containerStyle={{
        backgroundColor: backgroundColor,
        ...props.style,
        width: '100%',
        borderRadius: 8,
        paddingVertical: 16,
        borderWidth: 1,
        borderColor: theme.colors.primary,
      }}
      style={{
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        position: 'relative',
      }}
      onPress={onPress}
    >
      {leftItem && (
        <View
          style={{
            position: 'absolute',
            left: 16,
          }}
        >
          {leftItem}
        </View>
      )}
      <Text
        style={{
          color: color,
          fontSize: 16,
          fontWeight: '700',
          textAlign: 'center',
        }}
      >
        {title}
      </Text>
    </TouchableOpacity>
  );
}
