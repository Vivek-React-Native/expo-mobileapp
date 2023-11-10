import { create, InstanceProps } from 'react-modal-promise';
import { Button, Dialog, Portal, Text } from 'react-native-paper';

export interface ConfirmDialogProps extends InstanceProps<boolean> {
  title: string;
  message?: string;
}
export function ConfirmDialog({
  title,
  message,
  isOpen,
  onResolve,
}: ConfirmDialogProps) {
  return (
    <Portal>
      <Dialog visible={isOpen} onDismiss={() => onResolve(false)}>
        <Dialog.Title>{title}</Dialog.Title>
        {message && (
          <Dialog.Content>
            <Text>{message}</Text>
          </Dialog.Content>
        )}
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

export const showConfirm = create<ConfirmDialogProps, boolean>(ConfirmDialog);
