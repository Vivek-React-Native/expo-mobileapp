import Button from '@/components/buttons/Button';
import { Image } from 'expo-image';
import { useState } from 'react';
import { ScrollView, View } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { List, Switch, useTheme } from 'react-native-paper';
import { Text } from 'react-native-ui-lib';
import * as ImagePicker from 'expo-image-picker';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useForm } from 'react-hook-form';
import { showActionDialog } from '@/components/dialogs/ActionDialog';
import { useDispatch } from 'react-redux';
import { eventActions } from '@/redux/event/slice';
import { useGlobalSearchParams, useRouter } from 'expo-router';
import { PhotoboothSettingsDto } from '@/types/swagger';
import { useEventsQuery } from '@/hooks/useEventsQuery';
import { showColorDialog } from '@/components/dialogs/ColorPickerDialog';
import { Timer } from '@/types/photobooth';

const RIPPLE_COLOR = 'rgba(255,255,255,0.9)';

export default function PhotoboothSettings(props) {
  const theme = useTheme();
  const router = useRouter();
  const [selectedLogo, setSelectedLogo] = useState<any>();
  const [selectedOverlay, setSelectedOverlay] = useState<any>();
  const [photoboothSettings, setPhotoboothSettings] =
    useState<PhotoboothSettingsDto>({
      enableNFC: false,
      enableBranding: false,
      enableEventLogo: false,
      enableDefaultOverlay: false,
      timer: 0,
      transparentBackgroundOnLanding: false,
      overlayBlobId: null,
      photoboothLogoBlobId: null,
      primaryColor: '#000000',
      secondaryColor: theme.colors.primary,
      tertiaryColor: theme.colors.background,
      securityCode: '',
    });

  const eventId = Number.parseInt(useGlobalSearchParams().event as string);
  const queries = {
    events: useEventsQuery(),
  };
  const { event } = {
    event: queries.events.findOne(eventId).data,
  };
  const dispatch = useDispatch();

  const savePhotoBoothSettings = () => {
    dispatch(eventActions.setPhotoboothSettings(photoboothSettings));
  };

  const handlePreview = () => {
    savePhotoBoothSettings();
    router.push('/dashboard/[event]/photobooth');
  };

  const { control, watch } = useForm({
    defaultValues: {
      primaryColor: '#000000',
      secondaryColor: theme.colors.primary,
      tertiaryColor: theme.colors.background,
    },
  });

  const chooseImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      showActionDialog({
        text: 'Sorry, we need camera roll permissions to make this work!',
        type: 'error',
      });
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
    });
    if (result.canceled) return;

    return result.assets[0].uri;
  };

  return (
    <ScrollView
      style={{
        paddingHorizontal: 16,
        flex: 1,
      }}
    >
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-evenly',
          alignItems: 'center',
          marginVertical: 16,
        }}
      >
        <TouchableOpacity
          style={{
            width: 200,
          }}
          onPress={() => {
            chooseImage().then((uri: any) => {
              setSelectedLogo(uri);
            });
          }}
        >
          <Image
            style={{
              backgroundColor: '#C1C0BF',
              width: '100%',
              height: 200,
              resizeMode: 'contain',
            }}
            source={
              selectedLogo
                ? { uri: selectedLogo }
                : require('@/assets/crowdpass-banner-original.svg')
            }
          />
          <Text
            style={{
              marginTop: 16,
              fontSize: 24,
              textAlign: 'center',
              fontWeight: '700',
            }}
          >
            Photobooth Logo
          </Text>
        </TouchableOpacity>
        {photoboothSettings.enableDefaultOverlay && (
          <TouchableOpacity
            onPress={() => {
              chooseImage().then((uri: any) => {
                setSelectedOverlay(uri);
              });
            }}
            style={{
              width: 200,
            }}
          >
            <Image
              style={{
                backgroundColor: '#C1C0BF',
                width: '100%',
                height: 200,
                resizeMode: 'contain',
              }}
              source={selectedOverlay ? { uri: selectedOverlay } : ''}
            />
            <Text
              style={{
                marginTop: 16,
                fontSize: 24,
                textAlign: 'center',
                fontWeight: '700',
              }}
            >
              Overlay
            </Text>
          </TouchableOpacity>
        )}
      </View>

      <List.Subheader>Photobooth Mode Settings</List.Subheader>

      <View
        style={{
          shadowColor: 'black',
          shadowOffset: {
            width: 0,
            height: 2,
          },
          shadowOpacity: 0.25,
          shadowRadius: 4,
          backgroundColor: 'white',
          borderColor: theme.colors.primary,
          borderWidth: 2,
          borderRadius: 10,
        }}
      >
        <List.Section
          style={{
            backgroundColor: 'white',
          }}
        >
          <List.Item
            title="Use Event Logo as Photobooth Logo"
            rippleColor={RIPPLE_COLOR}
            right={() => (
              <Switch
                value={photoboothSettings.enableEventLogo}
                onValueChange={(value) => {
                  if (!event.logoBlobId && value) {
                    showActionDialog({
                      text: 'No event logo uploaded',
                      type: 'error',
                    });
                    return;
                  }
                  setPhotoboothSettings({
                    ...photoboothSettings,
                    enableEventLogo: value,
                  });
                }}
              />
            )}
          />
          <List.Item
            title="NFC Wristband Connection"
            rippleColor={RIPPLE_COLOR}
            right={() => (
              <Switch
                value={photoboothSettings.enableNFC}
                onValueChange={(value) =>
                  setPhotoboothSettings({
                    ...photoboothSettings,
                    enableNFC: value,
                  })
                }
              />
            )}
          />
          <List.Item
            title="Hide CrowdBooth Crowdpass Branding"
            rippleColor={RIPPLE_COLOR}
            right={() => (
              <Switch
                value={photoboothSettings.enableBranding}
                onValueChange={(value) =>
                  setPhotoboothSettings({
                    ...photoboothSettings,
                    enableBranding: value,
                  })
                }
              />
            )}
          />
          <List.Item
            title="Enable Default Overlay"
            rippleColor={RIPPLE_COLOR}
            right={() => (
              <Switch
                value={photoboothSettings.enableDefaultOverlay}
                onValueChange={(value) =>
                  setPhotoboothSettings({
                    ...photoboothSettings,
                    enableDefaultOverlay: value,
                  })
                }
              />
            )}
          />

          <List.Item
            title="Transparent Background on Landing Page"
            rippleColor={RIPPLE_COLOR}
            right={() => (
              <Switch
                value={photoboothSettings.transparentBackgroundOnLanding}
                onValueChange={(value) =>
                  setPhotoboothSettings({
                    ...photoboothSettings,
                    transparentBackgroundOnLanding: value,
                  })
                }
              />
            )}
          />
          <List.Item
            title="Default Timer"
            rippleColor={RIPPLE_COLOR}
            right={() => (
              <View
                style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}
              >
                {[0, 3, 5, 10].map((t: Timer) => (
                  <TouchableOpacity
                    onPress={() => {
                      setPhotoboothSettings({
                        ...photoboothSettings,
                        timer: t,
                      });
                    }}
                    style={{
                      backgroundColor:
                        photoboothSettings.timer === t
                          ? theme.colors.primary
                          : 'transparent',
                      padding: 8,
                      paddingHorizontal: 16,
                      alignItems: 'center',
                      justifyContent: 'center',
                      borderRadius: 50,
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 18,
                        color:
                          photoboothSettings.timer === t
                            ? 'white'
                            : theme.colors.primary,
                      }}
                    >
                      {t}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          />
          <List.Item
            title="Primary Color"
            onPress={() => {
              showColorDialog({
                defaultValue: photoboothSettings.primaryColor,
                isOpen: true,
              }).then((res) => {
                if (!res) {
                  return;
                }
                setPhotoboothSettings({
                  ...photoboothSettings,
                  primaryColor: res,
                });
              });
            }}
            rippleColor={RIPPLE_COLOR}
            right={() => (
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Text style={{ marginRight: 16, fontSize: 20 }}>
                  {photoboothSettings.primaryColor}
                </Text>
                <View
                  style={{
                    width: 40,
                    height: 30,
                    backgroundColor: photoboothSettings.primaryColor,
                  }}
                ></View>
              </View>
            )}
          />
          <List.Item
            title="Secondary Color"
            onPress={() => {
              showColorDialog({
                defaultValue: photoboothSettings.secondaryColor,
                isOpen: true,
              }).then((res) => {
                if (!res) {
                  return;
                }
                setPhotoboothSettings({
                  ...photoboothSettings,
                  secondaryColor: res,
                });
              });
            }}
            rippleColor={RIPPLE_COLOR}
            right={() => (
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Text style={{ marginRight: 16, fontSize: 20 }}>
                  {photoboothSettings.secondaryColor}
                </Text>
                <View
                  style={{
                    width: 40,
                    height: 30,
                    backgroundColor: photoboothSettings.secondaryColor,
                  }}
                ></View>
              </View>
            )}
          />
          <List.Item
            title="Tertiary Color"
            onPress={() => {
              showColorDialog({
                defaultValue: photoboothSettings.tertiaryColor,
                isOpen: true,
              }).then((res) => {
                if (!res) {
                  return;
                }
                setPhotoboothSettings({
                  ...photoboothSettings,
                  tertiaryColor: res,
                });
              });
            }}
            rippleColor={RIPPLE_COLOR}
            right={() => (
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Text style={{ marginRight: 16, fontSize: 20 }}>
                  {photoboothSettings.tertiaryColor}
                </Text>
                <View
                  style={{
                    width: 40,
                    height: 30,
                    backgroundColor: photoboothSettings.tertiaryColor,
                  }}
                ></View>
              </View>
            )}
          />
          <List.Item
            title="Download Emails"
            onPress={() => {}}
            rippleColor={RIPPLE_COLOR}
            right={() => (
              <MaterialCommunityIcons
                name="download"
                size={24}
                color={theme.colors.primary}
              />
            )}
          />
        </List.Section>
      </View>
      <View style={{ height: 16 }} />
      <Button reversed onPress={handlePreview} title="Preview" />
      <View style={{ height: 16 }} />
      <Button onPress={savePhotoBoothSettings} title="Save" />
    </ScrollView>
  );
}
