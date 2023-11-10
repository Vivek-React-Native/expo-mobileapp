import React from 'react';
import { create, InstanceProps } from 'react-modal-promise';
import { Image } from 'expo-image';
import { Button, Dialog, Portal } from 'react-native-paper';
import crowdpass from '@/adapters/crowdpass';

export interface ImageDialogProps extends InstanceProps<never> {
  blobId: number;
  attendeeName: string;
}
export function ImageDialog({
  blobId,
  attendeeName,
  isOpen,
  onResolve,
}: ImageDialogProps) {
  return (
    <Portal>
      <Dialog visible={isOpen} onDismiss={() => onResolve()}>
        <Dialog.Title>{attendeeName}</Dialog.Title>
        <Dialog.Content>
          <Image
            style={{ width: '100%', height: 256 }}
            contentFit="contain"
            source={{
              uri: `${process.env['NX_URI']}/blobs/${blobId}`,
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

export const showImageDialog = create<ImageDialogProps, never>(ImageDialog);
