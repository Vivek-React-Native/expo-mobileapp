import React from 'react';
import { create, InstanceProps } from 'react-modal-promise';
import { Image } from 'expo-image';
import { Button, Dialog, Portal } from 'react-native-paper';
import crowdpass from '@/adapters/crowdpass';

export interface AccessQRCodeDialogProps extends InstanceProps<never> {
  publicId: string;
}
export function AccessQRCodeDialog({
  publicId,
  isOpen,
  onResolve,
}: AccessQRCodeDialogProps) {
  return (
    <Portal>
      <Dialog visible={isOpen} onDismiss={() => onResolve()}>
        <Dialog.Title>Event Access QR Code</Dialog.Title>
        <Dialog.Content>
          <Image
            style={{ width: '100%', height: 256 }}
            contentFit="contain"
            source={{
              uri: `${process.env['NX_URI']}/attendees/${publicId}/qr-code`,
              headers: {
                Authorization: `Bearer ${crowdpass.useToken.getState().token}`,
              },
            }}
          />
        </Dialog.Content>
        <Dialog.Actions>
          <Button onPress={() => onResolve()}>Close</Button>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  );
}

export const showAccessQRCode = create<AccessQRCodeDialogProps, never>(
  AccessQRCodeDialog
);
