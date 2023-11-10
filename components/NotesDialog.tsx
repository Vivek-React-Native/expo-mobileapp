import { create, InstanceProps } from 'react-modal-promise';
import { Button, Dialog, Portal, TextInput } from 'react-native-paper';
import { useForm, Controller } from 'react-hook-form';

export interface NotesDialogProps extends InstanceProps<string> {
  note?: string;
}
export function NotesDialog({
  note = '',
  isOpen,
  onResolve,
}: NotesDialogProps) {
  const { control, getValues } = useForm({
    defaultValues: { note },
  });

  return (
    <Portal>
      <Dialog visible={isOpen} onDismiss={() => onResolve('')}>
        <Dialog.Title>Note for lead</Dialog.Title>
        <Dialog.Content>
          <Controller
            control={control}
            name="note"
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                style={{ marginBottom: 16 }}
                mode="outlined"
                label="Note"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
              />
            )}
          />
        </Dialog.Content>
        <Dialog.Actions>
          <Button onPress={() => onResolve('')}>Cancel</Button>
          <Button mode="contained" onPress={() => onResolve(getValues('note'))}>
            Continue
          </Button>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  );
}

export const showNotesDialog = create<NotesDialogProps, string>(NotesDialog);
