import { useDeepCompareEffect, useWebSocket } from 'ahooks';
import { BarCodeScanner, PermissionResponse } from 'expo-barcode-scanner';
import React from 'react';
import { create, InstanceProps } from 'react-modal-promise';
import { StyleSheet, View } from 'react-native';
import {
  Button,
  Dialog,
  Modal,
  Portal,
  Text,
  TextInput,
  Title,
} from 'react-native-paper';
import { useForm, Controller } from 'react-hook-form';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { showSnackbar } from './SnackbarDialog';

export interface ReadNfcDialogProps extends InstanceProps<string> {}
export function ReadNfcDialog({ isOpen, onResolve }: ReadNfcDialogProps) {
  const ws = useWebSocket('wss://cp-raspberrypi-nfc.deno.dev/websocket', {
    reconnectLimit: 0,
    onOpen({ target }) {
      console.log('socket onopen ->', target);
    },
    onClose({ code, reason }) {
      console.warn('socket onclose ->', code, reason);
    },
    onError(error) {
      console.error('socket onerror ->', error);
    },
    onMessage: (e) => {
      const data = JSON.parse(e.data);
      console.log('onMessage data ->', data);
      if (data?.text) {
        showSnackbar({
          message: `NFC tag read: '${data?.text}'`,
        });
      }
    },
  });

  return (
    <Portal>
      <Dialog visible={isOpen} onDismiss={() => onResolve()}>
        <Dialog.Title>{`Scan NFC Device`}</Dialog.Title>
        <Dialog.Content>
          <Text>Waiting for NFC tag read...</Text>
        </Dialog.Content>
        <Dialog.Actions>
          <Button onPress={() => onResolve()}>Cancel</Button>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  );
}

export const showReadNfcDialog = create<ReadNfcDialogProps, string>(
  ReadNfcDialog
);
