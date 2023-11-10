import { Image } from 'expo-image';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Text, View, useWindowDimensions } from 'react-native';
import {
  useCameraDevices,
  Camera,
  CameraDeviceFormat,
} from 'react-native-vision-camera';
import {
  TouchableOpacity,
  TouchableWithoutFeedback,
} from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native-safe-area-context';
import EvilIcon from 'react-native-vector-icons/EvilIcons';
import AntIcon from 'react-native-vector-icons/AntDesign';
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import { BlurView } from 'expo-blur';
import { useGlobalSearchParams, useRouter } from 'expo-router';
import ViewShot from 'react-native-view-shot';
import { useEventsQuery } from '@/hooks/useEventsQuery';
import crowdpass from '@/adapters/crowdpass';
import * as ScreenOrientation from 'expo-screen-orientation';
import { useSelector } from 'react-redux';
import { ReduxState } from '@/types/redux';
import { getStorage } from '@/utils/storage';
import { Timer } from '@/types/photobooth';

type Time = 0 | 3 | 5 | 10;
type Zoom = 1.5 | 1 | 0.5;
export default function Photobooth() {
  const viewShotRef = useRef();
  const cameraShotRef = useRef();
  const router = useRouter();
  const { width } = useWindowDimensions();
  const devices = useCameraDevices();
  const device = devices?.front;
  const [image, setImage] = useState(null);
  const cameraRef = useRef(null);
  const [countDownStart, setCountDownStart] = useState(false);
  const [photoboothOn, setPhotoboothOn] = useState(false);
  const [selectedTimer, setSelectedTimer] = useState<Timer>(3);
  const [nfc, setNfc] = useState(null);
  const [timer, setTimer] = useState(0);
  const [overlay, setOverlay] = useState(null);
  const [overlayOpactiy, setOverlayOpacity] = useState(100);
  const { eventId } = useGlobalSearchParams();
  const [orientation, setOrientation] = useState(1);
  const [selectedFormat, setSelectedFormat] =
    useState<CameraDeviceFormat>(null);
  const photoboothSettings = useSelector(
    (state: ReduxState) => state.event.photoboothSettings
  );
  const [zoomLevel, setZoomLevel] = useState<Zoom>(1.5);
  const sortFormatsByResolution = (
    left: CameraDeviceFormat,
    right: CameraDeviceFormat
  ): number => {
    let leftPoints = left.photoHeight * left.photoWidth;
    let rightPoints = right.photoHeight * right.photoWidth;

    leftPoints += left.videoWidth * left.videoHeight;
    rightPoints += right.videoWidth * right.videoHeight;

    return rightPoints - leftPoints;
  };
  const formats = useMemo(
    () => device?.formats.sort(sortFormatsByResolution),
    [device?.formats]
  );
  const event = useEventsQuery().findOne(Number.parseInt(eventId as string));

  useEffect(() => {
    let timeoutId;

    try {
      if (!countDownStart) return;

      if (timer > 0) {
        timeoutId = setTimeout(() => {
          setTimer((prev) => prev - 1);
        }, 1000);
      }

      if (timer <= 0) {
        cameraRef.current
          .takePhoto({
            qualityPrioritization: 'quality',
            enableAutoStabilization: true,
          })
          .then((photo) => {
            setImage(photo);
          });
      }
    } catch (error) {}

    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [timer, countDownStart]);

  useEffect(() => {
    getStorage('nfc').then((res: any) => {
      setNfc(res);
    });
  }, []);

  const renderLogo = () => {
    return;
    if (
      !photoboothSettings.enableEventLogo &&
      !photoboothSettings.photoboothLogoBlobId
    ) {
      return (
        <Image
          style={{
            width: '50%',
            position: 'absolute',
            top: 50,
            height: 100,
          }}
          contentFit="contain"
          source={require('@/assets/crowdpass-banner-original.svg')}
        />
      );
    } else if (photoboothSettings.enableEventLogo) {
      return (
        <Image
          style={{
            width: '60%',
            height: 150,
          }}
          contentFit="contain"
          source={{
            uri: `${process.env['NX_URI']}/blobs/${event.data.logoBlobId}`,
            headers: {
              Authorization: `Bearer ${crowdpass.useToken.getState().token}`,
            },
          }}
        />
      );
    } else if (photoboothSettings.photoboothLogoBlobId) {
      return (
        <Image
          style={{
            width: '60%',
            height: 150,
          }}
          contentFit="contain"
          source={{
            uri: `${process.env['NX_URI']}/blobs/${photoboothSettings.photoboothLogoBlobId}`,
            headers: {
              Authorization: `Bearer ${crowdpass.useToken.getState().token}`,
            },
          }}
        />
      );
    }
  };

  const renderButton = (icon, text, onPress) => {
    return (
      <TouchableOpacity
        onPress={onPress}
        containerStyle={{
          flexGrow: 1,
          height: '100%',
        }}
        style={{
          backgroundColor: '#2C2C2E',
          borderRadius: 16,
          height: '100%',
          justifyContent: 'center',
          alignItems: 'center',
          flexDirection: 'row',
          gap: width / 50,
          zIndex: 1,
        }}
      >
        <View
          style={{
            width: width / 15,
            height: width / 15,
            justifyContent: 'center',
            alignItems: 'center',
            borderRadius: 50,
            backgroundColor: '#48484F',
          }}
        >
          {icon}
        </View>
        <Text style={{ color: 'white', fontSize: width / 40 }}>{text}</Text>
      </TouchableOpacity>
    );
  };
  const renderItems = () => {
    if (!photoboothOn) {
      return (
        <>
          {renderLogo()}
          {!event?.data?.logoBlobId && (
            <Image
              style={{
                width: '100%',
                height: '10%',
                marginVertical: 20,
              }}
              contentFit="contain"
              source={require('@/assets/images/Ecolab_Logo_White_RGB.png')}
            />
          )}

          {/* {event?.data?.logoBlobId ? (
            <Image
              style={{
                width: '60%',
                height: 150,
              }}
              contentFit="contain"
              source={{
                uri: `${process.env['NX_URI']}/blobs/${event.data.logoBlobId}`,
                headers: {
                  Authorization: `Bearer ${
                    crowdpass.useToken.getState().token
                  }`,
                },
              }}
            />
          ) : (
            <>
              <Text
                style={{
                  color: 'white',
                  fontSize: width / 12,
                  fontWeight: '700',
                }}
              >
                Crowdbooth
              </Text>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <Text
                  style={{
                    color: 'rgba(255, 255, 255, 0.65)',
                    fontSize: width / 40,
                    fontWeight: '400',
                  }}
                >
                  Powered by
                </Text>
                <View
                  style={{
                    width: width / 5.5,
                  }}
                >
                  <Image
                    style={{
                      flex: 1,
                    }}
                    contentFit="contain"
                    source={require('@/assets/crowdpass-banner-original.svg')}
                  />
                </View>
              </View>
            </>
          )} */}

          <Text
            style={{
              position: 'absolute',
              bottom: 50,
              color: 'white',
              fontSize: width / 15,
              fontWeight: '500',
            }}
          >
            Tap to start
          </Text>
        </>
      );
    } else if (countDownStart) {
      if (!image) {
        return (
          <>
            {selectedTimer > 0 && (
              <Text
                style={{
                  position: 'absolute',
                  top: '20%',
                  color: 'white',
                  fontSize: width / 2,
                  fontWeight: '700',
                }}
              >
                {timer}
              </Text>
            )}
            <TouchableOpacity
              onPress={() => {
                setCountDownStart(false);
                setTimer(selectedTimer);
              }}
              containerStyle={{
                position: 'absolute',
                bottom: 50,
              }}
              style={{
                width: width / 8,
                height: width / 8,
                borderRadius: width / 2,
                borderColor: 'white',
                borderWidth: 2,
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: 'black',
              }}
            >
              <View
                style={{
                  width: width / 20,
                  height: width / 20,
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderColor: 'white',
                  borderWidth: 2,
                  borderRadius: 10,
                }}
              />
            </TouchableOpacity>
          </>
        );
      } else {
        return (
          <>
            <View
              style={{
                position: 'absolute',
                bottom: 50,
                width: width / 2,
                height: width / 7,
                padding: width / 40,
                alignItems: 'center',
                backgroundColor: '#1C1C1E',
                justifyContent: 'center',
                borderRadius: 16,
                flexDirection: 'row',
                flex: 1,
                gap: 32,
                zIndex: 1,
              }}
            >
              {renderButton(
                <EvilIcon name="undo" size={width / 16} color="white" />,
                'Redo',
                () => {
                  setImage(null);
                  setCountDownStart(false);
                }
              )}
              {renderButton(
                <AntIcon name="arrowright" size={width / 24} color="white" />,
                'Next',
                async () => {
                  if (!viewShotRef.current) return;
                  (viewShotRef.current as any).capture().then((uri) => {
                    router.push({
                      pathname: '/dashboard/[event]/photobooth/send',
                      params: {
                        uri,
                        eventId,
                        nfc,
                      },
                    });
                  });
                }
              )}
            </View>
          </>
        );
      }
    } else {
      return (
        <>
          <BlurView
            intensity={14}
            tint="dark"
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '10%',
            }}
          />

          <View
            style={{
              top: '3%',
              position: 'absolute',
              flexDirection: 'row',
              justifyContent: 'flex-end',
              width: '100%',
              paddingHorizontal: 20,
              gap: 16,
            }}
          >
            <View
              style={{
                alignItems: 'center',
                backgroundColor: '#070707',
                borderRadius: 32,
                paddingLeft: 16,
                paddingRight: 20,
                flexDirection: 'row',
              }}
            >
              <MaterialCommunityIcon
                name="timer-outline"
                size={32}
                color="white"
              />
              {renderTime(0)}
              {renderTime(3)}
              {renderTime(5)}
              {renderTime(10)}
            </View>
          </View>
          <TouchableOpacity
            onPress={() => {
              setCountDownStart(true);
              setTimer(selectedTimer);
            }}
            containerStyle={{
              position: 'absolute',
              bottom: 50,
            }}
            style={{
              borderColor: 'white',
              borderWidth: 2,
              width: width / 8,
              height: width / 8,
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: 'black',
              borderRadius: width / 16,
            }}
          >
            <MaterialCommunityIcon
              name="camera-outline"
              size={width / 18}
              color="white"
            />
          </TouchableOpacity>
          <View
            style={{
              right: 20,
              position: 'absolute',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <TouchableOpacity
              containerStyle={{
                opacity: 0.1,
                backgroundColor: 'black',
                width: width / 16,
                height: width / 16,
                borderRadius: width / 32,
                justifyContent: 'center',
                alignItems: 'center',
                position: 'relative',
                bottom: 50,
              }}
              onPress={() => {
                if (zoomLevel === 1.5) {
                  setZoomLevel(1);
                  setSelectedFormat(formats[16]);
                } else if (zoomLevel === 1) {
                  setZoomLevel(0.5);
                  setSelectedFormat(formats[0]);
                } else {
                  setZoomLevel(1.5);
                }
              }}
            >
              <Text style={{ color: 'white', fontSize: width / 40 }}>
                {zoomLevel}x
              </Text>
              {/* <MaterialCommunityIcon
                name={
                  selectedFormat === formats[16]
                    ? 'fullscreen'
                    : 'fullscreen-exit'
                }
                size={32}
                color="white"
              /> */}
            </TouchableOpacity>
          </View>
        </>
      );
    }
  };

  const renderTime = (seconds: Timer) => {
    return (
      <TouchableOpacity
        onPress={() => {
          setSelectedTimer(seconds);
        }}
        style={{
          flexDirection: 'row',
          gap: 8,
          paddingHorizontal: 30,
          paddingVertical: 12,
        }}
      >
        <Text
          style={{
            color:
              selectedTimer === seconds ? 'white' : 'rgba(255, 255, 255, 0.50)',
            fontSize: 18,
            fontWeight: '700',
          }}
        >
          {seconds}s
        </Text>
      </TouchableOpacity>
    );
  };

  useEffect(() => {
    ScreenOrientation.addOrientationChangeListener((orientation: any) => {
      setOrientation(orientation.orientationInfo.orientation);
    });

    return () => {
      ScreenOrientation.removeOrientationChangeListeners();
    };
  }, [ScreenOrientation]);
  return (
    <TouchableWithoutFeedback
      onPress={() => {
        if (photoboothOn) return;
        setPhotoboothOn(true);
        setCountDownStart(true);
        setTimer(selectedTimer);
      }}
      containerStyle={{
        flex: 1,
        backgroundColor: 'black',
      }}
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <SafeAreaView />
      {device && !image && (
        <Camera
          zoom={zoomLevel === 1.5 ? 1.5 : 1}
          format={selectedFormat ?? formats[0]}
          enableHighQualityPhotos={true}
          enablePortraitEffectsMatteDelivery={true}
          pixelFormat={'native'}
          photo
          isActive
          device={device}
          ref={cameraRef}
          style={{
            width: '100%',
            height: '100%',
            position: 'absolute',
            transform: [
              {
                rotateX: orientation === 1 ? '0deg' : '180deg',
              },
            ],
          }}
        />
      )}
      <ViewShot
        style={{
          position: 'absolute',
          width: '100%',
          height: '100%',
        }}
        ref={viewShotRef}
        options={{ format: 'jpg', quality: 1 }}
      >
        {photoboothOn && (
          <Image
            source={require('@/assets/images/ecolab-overlay.png')}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              zIndex: image ? 1 : 0,
            }}
          />
        )}
        {overlay && (
          <Image
            source={{ uri: overlay }}
            style={{
              opacity: overlayOpactiy / 100,
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              zIndex: image ? 1 : 0,
            }}
          />
        )}

        {image && photoboothOn && (
          <Image
            source={image.path}
            style={{
              width: '100%',
              height: '100%',
              position: 'absolute',
              top: 0,
              left: 0,
              transform: [
                {
                  rotateX: orientation === 1 ? '0deg' : '180deg',
                },
              ],
            }}
          />
        )}
        {!photoboothOn &&
          !photoboothSettings.transparentBackgroundOnLanding && (
            <View
              style={{
                backgroundColor: photoboothSettings?.primaryColor,
                width: '100%',
                height: '100%',
                position: 'absolute',
                top: 0,
                left: 0,
              }}
            />
          )}
      </ViewShot>

      {renderItems()}
    </TouchableWithoutFeedback>
  );
}
