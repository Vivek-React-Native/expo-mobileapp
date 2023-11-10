import { useDeepCompareEffect } from 'ahooks';
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

export interface ScanQRCodeDialogResolver {
  data: string;
  note: string;
}
export interface ScanQRCodeDialogProps
  extends InstanceProps<ScanQRCodeDialogResolver> {
  title?: string;
  showNoteTextInput?: boolean;
}
export function ScanQRCodeDialog({
  title = 'Scan QR Code',
  showNoteTextInput = false,
  isOpen,
  onResolve,
}: ScanQRCodeDialogProps) {
  const [permission] = BarCodeScanner.usePermissions({
    get: true,
    request: true,
  });

  const { control, getValues } = useForm({
    defaultValues: { note: '' } as ScanQRCodeDialogResolver,
  });

  return (
    <Portal>
      <Dialog visible={isOpen} onDismiss={() => onResolve()}>
        <Dialog.Title>{title}</Dialog.Title>
        <Dialog.Content>
          {showNoteTextInput && (
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
          )}

          {permission?.granted == true ? (
            <BarCodeScanner
              style={{ width: '100%', height: 256 }}
              barCodeTypes={[BarCodeScanner.Constants.BarCodeType.qr]}
              onBarCodeScanned={(result) => {
                if (result.data) {
                  onResolve({ data: result.data, note: getValues('note') });
                }
              }}
            />
          ) : (
            <Text>Requesting for camera permission...</Text>
          )}
        </Dialog.Content>
        <Dialog.Actions>
          <Button onPress={() => onResolve()}>Cancel</Button>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  );
}

export const scanQRCode = create<
  ScanQRCodeDialogProps,
  ScanQRCodeDialogResolver
>(ScanQRCodeDialog);
