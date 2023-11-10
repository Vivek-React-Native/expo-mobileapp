import { Control, Controller } from 'react-hook-form';
import { create, InstanceProps } from 'react-modal-promise';
import { Dialog, Portal, TextInput } from 'react-native-paper';
import Button from '../buttons/Button';
import { View } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { TouchableOpacity } from 'react-native-gesture-handler';
export interface EmailDialogProps extends InstanceProps<boolean> {
  title: string;
  name: string;
  control: Control<any>;
  backgroundColor?: string;
  buttonColor?: string;
}
export function EmailDialog({
  title,
  name,
  control,
  backgroundColor = '#1C1C1E',
  buttonColor = '#0077F2',
  isOpen,
  onResolve,
}: EmailDialogProps) {
  return (
    <Portal>
      <Dialog
        style={{
          width: '70%',
          left: '15%',
          backgroundColor: backgroundColor,
          paddingVertical: 40,
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
        <Dialog.Title
          style={{
            color: 'white',
          }}
        >
          {title}
        </Dialog.Title>

        <Controller
          control={control}
          name={name}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              cursorColor="black"
              theme={{
                colors: {
                  primary: 'white',
                  text: 'white',
                  placeholder: 'white',
                  background: 'transparent',
                },
              }}
              autoCapitalize="none"
              placeholder="Email"
              placeholderTextColor={'white'}
              // placeholderTextColor={'#808080'}
              left={
                <TextInput.Icon
                  icon="email-outline"
                  color="white"
                  style={{
                    marginRight: 16,
                  }}
                />
              }
              textColor="white"
              style={{
                marginHorizontal: 16,
                marginBottom: 16,
                color: 'white',
                borderTopLeftRadius: 16,
                borderBottomLeftRadius: 16,
                borderBottomRightRadius: 16,
                borderTopRightRadius: 16,
                backgroundColor: backgroundColor,
              }}
              contentStyle={{
                color: 'white',
                marginLeft: 24,
              }}
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
            />
          )}
        />

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
            textColor={backgroundColor}
            style={{
              color: 'black',
              backgroundColor: buttonColor,
            }}
            title="Submit"
            onPress={() => onResolve(true)}
          />
        </View>
      </Dialog>
    </Portal>
  );
}

export const showEmailDialog = create<EmailDialogProps, boolean>(EmailDialog);
