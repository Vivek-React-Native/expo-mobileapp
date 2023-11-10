import React, { useRef } from 'react';
import { View, Animated, TouchableOpacity, StyleSheet } from 'react-native';
import { useTheme } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const ToggleButton = ({ index, setIndex }) => {
  const animValue = useRef(new Animated.Value(0)).current;
  const theme = useTheme();
  const blue = theme.colors.primary;
  const white = theme.colors.background;
  const toggleSwitch = () => {
    setIndex(!index);
    Animated.timing(animValue, {
      toValue: index ? 0 : 1,
      duration: 200,
      useNativeDriver: false,
    }).start();
  };

  const backgroundColor = animValue.interpolate({
    inputRange: [0, 1],
    outputRange: [white, blue],
  });

  const marginLeft = animValue.interpolate({
    inputRange: [0, 1],
    outputRange: [5, 55],
  });

  return (
    <View style={[styles.container, { backgroundColor: 'black' }]}>
      <Animated.View style={[styles.toggle, { backgroundColor }]} />
      <Animated.View style={[styles.switch, { marginLeft, backgroundColor }]}>
        <View
          style={{
            width: 40,
            height: 40,
            borderRadius: 50,
            backgroundColor: index ? white : blue,
            justifyContent: 'center',
            alignItems: 'center',
            position: 'absolute',
            bottom: 1,
          }}
        >
          <Icon
            name={index ? 'nfc-tap' : 'qrcode-scan'}
            size={26}
            color={index ? blue : white}
          />
        </View>
      </Animated.View>
      <TouchableOpacity style={styles.touchArea} onPress={toggleSwitch} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 100,
    height: 42,
    borderRadius: 50,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    overflow: 'hidden',
    position: 'relative',
  },
  toggle: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  switch: {
    width: 40,
    height: 40,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    top: 2,
    bottom: 1,
  },
  touchArea: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
});

export default ToggleButton;
