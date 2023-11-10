import { create, InstanceProps } from 'react-modal-promise';
import { Dialog, Portal, Text } from 'react-native-paper';
import { View } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';

export interface ChoiceDialogProps extends InstanceProps<string> {
  choice1: string;
  choice2: string;
  backgroundColor?: string;
  buttonColor?: string;
  buttonTextColor?: string;
}
export function ChoiceDialog({
  choice1,
  choice2,
  backgroundColor = '#1C1C1E',
  isOpen,
  onResolve,
}: ChoiceDialogProps) {
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
            paddingHorizontal: '25%',
            flexDirection: 'row',
          }}
          visible={isOpen}
          onDismiss={() => onResolve()}
        >
          {/* <TouchableOpacity
            containerStyle={{
              position: 'absolute',
              right: 30,
              top: -5,
            }}
            onPress={() => onResolve(false)}
          >
            <MaterialCommunityIcons name="close" size={32} color="white" />
          </TouchableOpacity> */}

          <TouchableOpacity
            containerStyle={{
              width: '100%',
            }}
            onPress={() => onResolve(choice1)}
          >
            <Text
              style={{
                color: '#00CA81',
                fontSize: 32,
                textAlign: 'center',
                width: '80%',
              }}
            >
              {choice1}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            containerStyle={{
              width: '100%',
            }}
            onPress={() => onResolve(choice2)}
          >
            <Text
              style={{
                color: 'white',
                fontSize: 32,
                marginTop: 16,
                textAlign: 'center',
                width: '80%',
              }}
            >
              {choice2}
            </Text>
          </TouchableOpacity>
        </Dialog>
      </View>
    </Portal>
  );
}

export const showChoiceDialog = create<ChoiceDialogProps, string>(ChoiceDialog);
