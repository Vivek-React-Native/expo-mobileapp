import React from 'react';
import { KeyboardAvoidingView, useWindowDimensions } from 'react-native';
import Animated, { useSharedValue } from 'react-native-reanimated';
import ColorPicker, {
  Panel2,
  OpacitySlider,
  InputWidget,
  SaturationSlider,
} from 'reanimated-color-picker';
import { create, InstanceProps } from 'react-modal-promise';
import { Dialog, Portal, Text } from 'react-native-paper';
import { StyleSheet } from '@bacons/react-views';
import { View } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';

export interface ColorPickerDialogProps extends InstanceProps<string> {
  defaultValue?: string;
}
export function ColorPickerDialog({
  defaultValue,
  isOpen,
  onResolve,
}: ColorPickerDialogProps) {
  const initialColor = defaultValue || '#000000';
  const selectedColor = useSharedValue(initialColor);
  const ref = React.useRef(null);
  const onColorSelect = (color) => {
    selectedColor.value = color.hex;
  };
  const { width } = useWindowDimensions();
  return (
    <Portal>
      <Dialog
        style={{
          backgroundColor: 'transparent',
          height: '100%',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
        }}
        visible={isOpen}
        onDismiss={() => onResolve()}
      >
        <Animated.View style={[styles.container]}>
          <KeyboardAvoidingView behavior="position">
            <View style={styles.pickerContainer}>
              <ColorPicker
                ref={ref}
                value={selectedColor.value}
                sliderThickness={25}
                thumbSize={20}
                thumbShape="doubleTriangle"
                onChange={onColorSelect}
                adaptSpectrum
              >
                <Panel2
                  style={styles.panelStyle}
                  verticalChannel="brightness"
                  thumbShape="ring"
                  thumbSize={30}
                  reverseVerticalChannel
                />

                <SaturationSlider
                  style={styles.sliderStyle}
                  thumbColor="#fff"
                />

                <OpacitySlider style={styles.sliderStyle} thumbColor="#fff" />

                <View style={styles.previewTxtContainer}>
                  <InputWidget
                    formats={['HEX', 'RGB']}
                    inputStyle={{
                      color: '#fff',
                      paddingVertical: 2,
                      borderColor: '#707070',
                      fontSize: width / 36,
                      marginLeft: 5,
                    }}
                    inputTitleStyle={{
                      fontSize: width / 32,
                      marginLeft: 5,
                    }}
                    iconStyle={{
                      width: 40,
                      height: 50,
                      marginBottom: 20,
                    }}
                    iconColor="#707070"
                  />
                </View>
              </ColorPicker>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                }}
              >
                <TouchableOpacity
                  containerStyle={[
                    styles.button,
                    { backgroundColor: '#F5324A' },
                  ]}
                  onPress={() => onResolve()}
                >
                  <Text style={{ color: 'white', fontWeight: 'bold' }}>
                    Close
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  containerStyle={[
                    styles.button,
                    { backgroundColor: '#00CA81' },
                  ]}
                  onPress={() => onResolve(selectedColor.value)}
                >
                  <Text style={{ color: 'black', fontWeight: 'bold' }}>
                    Save
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </KeyboardAvoidingView>
        </Animated.View>
      </Dialog>
    </Portal>
  );
}

export const showColorDialog = create<ColorPickerDialogProps, string>(
  ColorPickerDialog
);
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignContent: 'center',
  },
  pickerContainer: {
    alignSelf: 'center',
    width: '100%',
    backgroundColor: '#202124',
    padding: 20,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.34,
    shadowRadius: 6.27,

    elevation: 10,
  },
  panelStyle: {
    height: '60%',
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  sliderStyle: {
    borderRadius: 20,
    marginTop: 40,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  previewTxtContainer: {
    paddingTop: 20,
    marginTop: 20,
    borderTopWidth: 1,
    borderColor: '#bebdbe',
  },

  button: {
    width: '45%',
    alignItems: 'center',
    borderRadius: 20,
    paddingVertical: 24,
    alignSelf: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
});
