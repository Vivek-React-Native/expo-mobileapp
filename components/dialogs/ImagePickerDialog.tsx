import * as ImagePicker from 'expo-image-picker';
import { create, InstanceProps } from 'react-modal-promise';
import { Button, Dialog, Portal } from 'react-native-paper';

export interface ImagePickerDialogProps
  extends InstanceProps<ImagePicker.ImagePickerAsset> {}
export function ImagePickerDialog({
  isOpen,
  onResolve,
}: ImagePickerDialogProps) {
  return (
    <Portal>
      <Dialog visible={isOpen} onDismiss={() => onResolve()}>
        <Dialog.Title>Select image using:</Dialog.Title>
        <Dialog.Content style={{ marginVertical: 16, gap: 32 }}>
          <Button
            mode="outlined"
            icon="camera"
            onPress={async () => {
              const permissions = await ImagePicker.getCameraPermissionsAsync();
              if (!permissions.granted) {
                await ImagePicker.requestCameraPermissionsAsync();
              }
              const result = await ImagePicker.launchCameraAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                aspect: [4, 3],
              });
              onResolve(result?.assets?.[0]);
            }}
          >
            Camera
          </Button>
          <Button
            mode="outlined"
            icon="file-image"
            onPress={async () => {
              const permissions =
                await ImagePicker.getMediaLibraryPermissionsAsync();
              if (!permissions.granted) {
                await ImagePicker.requestMediaLibraryPermissionsAsync();
              }
              const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                aspect: [4, 3],
              });
              onResolve(result?.assets?.[0]);
            }}
          >
            Photo Library
          </Button>
        </Dialog.Content>
      </Dialog>
    </Portal>
  );
  // return (
  //   <Portal>
  //     <FAB.Group
  //       open={isOpen}
  //       visible={isOpen}
  //       icon="close"
  //       label="Select image using"
  //       actions={[
  //         { icon: 'plus', onPress: () => console.log('Pressed add') },
  //         {
  //           icon: 'star',
  //           label: 'Star',
  //           onPress: () => console.log('Pressed star'),
  //         },
  //         {
  //           icon: 'email',
  //           label: 'Email',
  //           onPress: () => console.log('Pressed email'),
  //         },
  //         {
  //           icon: 'bell',
  //           label: 'Remind',
  //           onPress: () => console.log('Pressed notifications'),
  //         },
  //       ]}
  //       onStateChange={({ open }) => !open && onResolve()}
  //       onPress={() => {
  //         console.log('onPress');
  //       }}
  //     />
  //   </Portal>
  // );
}

export const showImagePicker = create<
  ImagePickerDialogProps,
  ImagePicker.ImagePickerAsset
>(ImagePickerDialog);
