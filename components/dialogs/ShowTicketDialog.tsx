import { Image } from 'expo-image';
import React from 'react';
import { create, InstanceProps } from 'react-modal-promise';
import { Button, Dialog, Portal } from 'react-native-paper';

export interface ShowTicketDialogProps extends InstanceProps<never> {
  publicId: string;
  uri: string;
}
export function ShowTicketDialog({
  publicId,
  uri,
  isOpen,
  onResolve,
}: ShowTicketDialogProps) {
  return (
    <Dialog visible={isOpen} onDismiss={() => onResolve()}>
      <Dialog.Title>{publicId}</Dialog.Title>
      <Dialog.Content>
        <Image
          style={{
            width: 150,
            height: 150,
            alignSelf: 'center',
          }}
          contentFit="contain"
          source={{
            uri: uri,
          }}
        />
      </Dialog.Content>
      <Dialog.Actions>
        <Button onPress={() => onResolve()}>Close</Button>
      </Dialog.Actions>
    </Dialog>
  );
}

export const showTicketDialog = create<ShowTicketDialogProps>(ShowTicketDialog);
