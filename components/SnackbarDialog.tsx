import { useDeepCompareEffect, useRequest } from 'ahooks';
import { BarCodeScanner, PermissionResponse } from 'expo-barcode-scanner';
import React from 'react';
import { create, InstanceProps } from 'react-modal-promise';
import { Image } from 'expo-image';
import { StyleSheet, View } from 'react-native';
import {
  Button,
  Dialog,
  Modal,
  Portal,
  Text,
  Title,
  Snackbar,
} from 'react-native-paper';
import axios from 'axios';
import { isString } from 'is-what';

export interface SnackbarDialogProps extends InstanceProps<never> {
  message: string;
  error?: any;
}
export function SnackbarDialog({
  message,
  error,
  isOpen,
  onResolve,
}: SnackbarDialogProps) {
  if (error) {
    if (axios.isAxiosError(error)) {
      message ||= error.response?.data;
      message ||= error.response?.data?.errorMessage;
      message ||= error.response?.statusText;
    } else if (error?.message) {
      message = error.message;
    } else if (error?.constructor?.name) {
      message = error.constructor.name;
    }
    message = `🔴 ${message}`;
  }
  return (
    <Portal>
      <Snackbar visible={isOpen} onDismiss={() => onResolve()} duration={5000}>
        {message}
      </Snackbar>
    </Portal>
  );
}

export const showSnackbar = create<SnackbarDialogProps, never>(SnackbarDialog);
