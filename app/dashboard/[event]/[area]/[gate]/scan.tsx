import ToggleButton from '@/components/buttons/ToggleButton';
import { BarCodeScanner } from 'expo-barcode-scanner';
import { useNavigation } from 'expo-router/src/useNavigation';
import { useCallback, useEffect, useLayoutEffect, useState } from 'react';
import { SafeAreaView, View } from 'react-native';
import { Text, useTheme } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import NfcManager, { NfcTech, Ndef, NfcEvents } from 'react-native-nfc-manager';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { Image } from 'expo-image';
import { useEventsQuery } from '@/hooks/useEventsQuery';
import { useEventAttendeesQuery } from '@/hooks/useEventAttendeesQuery';
import { useEventAreasQuery } from '@/hooks/useEventAreasQuery';
import { useFocusEffect, useGlobalSearchParams, useRouter } from 'expo-router';
import crowdpass from '@/adapters/crowdpass';
import * as _ from 'radash';
import { useIsFocused } from '@react-navigation/native';

export default function ScanMode() {
  const theme = useTheme();
  const navigation = useNavigation();
  const primaryColor = theme.colors.primary;
  const bgColor = theme.colors.background;
  const eventId = Number.parseInt(useGlobalSearchParams().event as string);
  const gateId = Number.parseInt(useGlobalSearchParams().gate as string);
  const router = useRouter();
  const [scanData, setScanData] = useState<any>();
  const isFocused = useIsFocused();
  const [isNfcOpen, setIsNfcOpen] = useState(false);
  const queries = {
    events: useEventsQuery(),
    attendees: useEventAttendeesQuery(eventId),
    areas: useEventAreasQuery(eventId),
  };
  const { event, attendees, areas, ...data } = {
    event: queries.events.findOne(eventId).data,
    attendees: queries.attendees.findAll().data,
    areas: queries.areas.findAll().data,
    visits: queries.areas.findAllVisits().data,
    exits: queries.areas.findAllExits().data,
  };

  const [selectedIndex, setSelectedIndex] = useState(0);

  const handleError = (error) => {
    router.push({
      pathname: '/dashboard/check-in-result',
      params: {
        error,
      },
    });
  };

  const handleNFC = async () => {
    try {
      if (!isFocused) return;
      let error;
      setIsNfcOpen(true);
      NfcManager.start();
      await NfcManager.requestTechnology(NfcTech.Ndef);
      const tag = await NfcManager.getTag();
      if (!tag?.ndefMessage?.length) {
        error = 'This tag does not contain any data';
        return;
      }
      const publicId = Ndef.text.decodePayload(
        tag.ndefMessage[0].payload as any
      );

      NfcManager.cancelTechnologyRequest();

      const attendee = attendees.find((v) => v.publicId == publicId);
      if (!attendee) {
        error = 'Could not find attendee: ' + publicId;
        return;
      }
      setIsNfcOpen(false);
      await crowdpass
        .post(
          `/events/${eventId}/attendees/${attendee.id}/checkin?checkInMethod=NFC&gateId=${gateId}`
        )
        .catch((e) => {
          error = e.response.data.errorMessage;
        });
      if (error) {
        handleError(error);
        return;
      }
      console.log('4');
      queries.attendees.invalidate();
      queries.areas.invalidate();
      router.push({
        pathname: '/dashboard/check-in-result',
        params: {
          firstName: attendee.firstName,
          lastName: attendee.lastName,
          ticketId: publicId,
          checkedIn: true,
          profilePhotoBlobId: attendee.profilePhotoBlobId,
        },
      });
    } finally {
      NfcManager.cancelTechnologyRequest();
    }
  };

  const handleQR = async (publicId) => {
    try {
      if (!publicId || !attendees || !attendees.length || !isFocused) return;
      let error;

      const attendee = attendees.find(
        (v) => v.publicId == publicId.slice(0, -2)
      );
      if (!attendee) {
        throw new Error(`Cound not find attendee: ${publicId}`);
      }
      await crowdpass
        .post(
          `/events/${eventId}/attendees/checkin/${publicId}?checkInMethod=QRCode&gateId=${gateId}`
        )
        .catch((e) => {
          error = e.response.data.errorMessage;
        });

      if (error) {
        handleError(error);
        return;
      }
      queries.attendees.invalidate();
      queries.areas.invalidate();
      router.push({
        pathname: '/dashboard/check-in-result',
        params: {
          firstName: attendee.firstName,
          lastName: attendee.lastName,
          ticketId: publicId,
          checkedIn: true,
          profilePhotoBlobId: attendee.profilePhotoBlobId,
        },
      });
    } catch (error) {
      handleError(error.message);
    }
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, []);

  useEffect(() => {
    if (scanData) {
      handleQR(scanData);
    }
  }, [scanData]);

  useEffect(() => {
    if (!isNfcOpen && selectedIndex) handleNFC();
  }, [isNfcOpen, isFocused, selectedIndex]);

  useFocusEffect(
    useCallback(() => {
      setIsNfcOpen(false);
      const debouncedSetScanData = _.debounce({ delay: 100 }, () => {
        setScanData(null);
      });
      debouncedSetScanData();
      return () => {};
    }, [setScanData])
  );

  useEffect(() => {
    () => {
      NfcManager.unregisterTagEvent();
    };
  }, []);

  return (
    <View
      style={{
        height: '100%',
        flex: 1,
        backgroundColor: selectedIndex ? bgColor : primaryColor,
      }}
    >
      <SafeAreaView />
      <View
        style={{
          height: 60,
          width: '100%',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingHorizontal: 20,
          position: 'relative',
        }}
      >
        <Icon
          name="chevron-left"
          size={40}
          onPress={() => navigation.goBack()}
          color={selectedIndex ? primaryColor : bgColor}
        />
        <ToggleButton
          index={selectedIndex}
          setIndex={(index) => {
            setSelectedIndex(index);
            setIsNfcOpen(!index);
          }}
        />
      </View>
      <View
        style={{
          height: '100%',
          alignItems: 'center',
        }}
      >
        <Image
          style={{
            width: 200,
            height: 100,
          }}
          contentFit="contain"
          source={
            selectedIndex
              ? require('@/assets/crowdpass-banner.svg')
              : require('@/assets/crowdpass-banner-light.svg')
          }
        />

        {selectedIndex ? (
          <TouchableOpacity
            style={{
              marginTop: 200,
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: primaryColor,
              width: 300,
              height: 200,
              borderRadius: 100,
            }}
            onPress={handleNFC}
          >
            <Icon name="nfc-tap" size={100} color={bgColor} />
            <Text
              style={{
                color: bgColor,
                fontSize: 20,
              }}
            >
              Tap NFC Wristband
            </Text>
          </TouchableOpacity>
        ) : (
          <BarCodeScanner
            style={{ width: '100%', height: '100%' }}
            focusable
            barCodeTypes={[BarCodeScanner.Constants.BarCodeType.qr]}
            onBarCodeScanned={(result) => {
              setScanData(result.data);
            }}
          />
        )}
      </View>
    </View>
  );
}
