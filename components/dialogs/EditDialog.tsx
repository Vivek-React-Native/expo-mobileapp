import { Control, Controller } from 'react-hook-form';
import { create, InstanceProps } from 'react-modal-promise';
import { Button, Dialog, Portal, Text, TextInput } from 'react-native-paper';

export interface EditDialogProps extends InstanceProps<boolean> {
  title: string;
  label: string;
  name: string;
  control: Control<any>;
}
export function EditDialog({
  title,
  label,
  name,
  control,
  isOpen,
  onResolve,
}: EditDialogProps) {
  return (
    <Portal>
      <Dialog visible={isOpen} onDismiss={() => onResolve(false)}>
        <Dialog.Title>{title}</Dialog.Title>

        <Controller
          control={control}
          name={name}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              label={label}
              style={{
                marginHorizontal: 16,
                marginBottom: 16,
                backgroundColor: 'transparent',
              }}
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
            />
          )}
        />

        <Dialog.Actions>
          <Button onPress={() => onResolve(false)}>Cancel</Button>
          <Button mode="contained" onPress={() => onResolve(true)}>
            Confirm
          </Button>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  );
}

export const showEditDialog = create<EditDialogProps, boolean>(EditDialog);
