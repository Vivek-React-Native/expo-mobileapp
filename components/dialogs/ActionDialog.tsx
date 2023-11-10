import { Control, Controller } from 'react-hook-form';
import { create, InstanceProps } from 'react-modal-promise';
import { Dialog, Portal, Text, TextInput } from 'react-native-paper';
import Button from '../buttons/Button';
import { View } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { Image } from 'expo-image';

export interface ActionDialogProps extends InstanceProps<boolean> {
  highlightedText?: string;
  text: string;
  type: 'success' | 'error';
  backgroundColor?: string;
  buttonColor?: string;
  buttonTextColor?: string;
}
export function ActionDialog({
  highlightedText,
  text,
  type,
  backgroundColor = '#1C1C1E',
  buttonColor = '#0077F2',
  buttonTextColor = 'black',
  isOpen,
  onResolve,
}: ActionDialogProps) {
  return (
    <Portal>
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: 'rgba(0,0,0,0.8)',
        }}
      >
        <Dialog
          style={{
            width: '70%',
            left: '15%',
            backgroundColor: backgroundColor,
            paddingVertical: 40,
            justifyContent: 'center',
            alignItems: 'center',
            paddingHorizontal: 40,
          }}
          visible={isOpen}
          onDismiss={() => onResolve(false)}
        >
          <TouchableOpacity
            containerStyle={{
              position: 'absolute',
              right: 30,
              top: -5,
            }}
            onPress={() => onResolve(false)}
          >
            <MaterialCommunityIcons name="close" size={32} color="white" />
          </TouchableOpacity>
          {type == 'success' ? (
            <Image
              contentFit="contain"
              style={{
                width: '100%',
                height: 146,
              }}
              source={require('@/assets/icons/photobooth-success.png')}
            />
          ) : (
            <View
              style={{
                width: 120,
                height: 120,
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: '#F5324A',
                borderRadius: 32,
                marginBottom: 16,
              }}
            >
              <MaterialCommunityIcons name="alert" size={64} color="white" />
            </View>
          )}
          <Text
            style={{
              color: type === 'success' ? '#00CA81' : '#F5324A',
              fontSize: 32,
              marginTop: 16,
              textAlign: 'center',
              width: '80%',
            }}
          >
            {highlightedText}
            <Text
              style={{
                color: 'white',
                fontSize: 32,
                marginTop: 16,
                textAlign: 'center',
                width: '80%',
              }}
            >
              {text}
            </Text>
          </Text>

          <View
            style={{
              marginTop: 20,
              flexDirection: 'row',
              justifyContent: 'flex-end',
              marginHorizontal: 16,
              marginBottom: 16,
            }}
          >
            <Button
              textColor={buttonTextColor}
              style={{
                backgroundColor: buttonColor,
              }}
              title="OK"
              onPress={() => onResolve(true)}
            />
          </View>
        </Dialog>
      </View>
    </Portal>
  );
}

export const showActionDialog = create<ActionDialogProps, boolean>(
  ActionDialog
);
