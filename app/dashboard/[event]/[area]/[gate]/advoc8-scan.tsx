import { useNavigation } from 'expo-router/src/useNavigation';
import { useEffect, useLayoutEffect, useState } from 'react';
import { SafeAreaView, Text, View } from 'react-native';
import NfcManager, { NfcTech, Ndef, NfcEvents } from 'react-native-nfc-manager';
import { useEventsQuery } from '@/hooks/useEventsQuery';
import { useEventAttendeesQuery } from '@/hooks/useEventAttendeesQuery';
import { useEventAreasQuery } from '@/hooks/useEventAreasQuery';
import { useGlobalSearchParams } from 'expo-router';
import crowdpass from '@/adapters/crowdpass';
import { Image } from 'expo-image';
import { useIsFocused } from '@react-navigation/native';
import {
  TouchableOpacity,
  TouchableWithoutFeedback,
} from 'react-native-gesture-handler';
import _ from 'radash';
export default function ScanMode() {
  const navigation = useNavigation();
  const primaryColor = '#006bd3';
  const eventId = Number.parseInt(useGlobalSearchParams().event as string);
  const gateId = Number.parseInt(useGlobalSearchParams().gate as string);
  const areaId = Number.parseInt(useGlobalSearchParams().area as string);
  const [scanned, setScanned] = useState<any>();
  const [error, setError] = useState<any>();
  const [counter, setCounter] = useState(0);
  const isFocused = useIsFocused();
  const queries = {
    events: useEventsQuery(),
    attendees: useEventAttendeesQuery(eventId),
    areas: useEventAreasQuery(eventId),
  };
  const { event, attendees, area, ...data } = {
    area: queries.areas.findOne(areaId).data,
    event: queries.events.findOne(eventId).data,
    attendees: queries.attendees.findAll().data,
  };

  const gate = area?.eventAreaGates?.find((v) => v.id == gateId);

  const handleNFC = async () => {
    try {
      setCounter(0);
      await NfcManager.requestTechnology(NfcTech.Ndef);
      const tag = await NfcManager.getTag();

      if (!tag?.ndefMessage?.length) {
        setError('No tag found');
        return;
      }
      const publicId = Ndef.text.decodePayload(
        tag.ndefMessage[0].payload as any
      );
      const attendee = attendees.find((v) => v.publicId == publicId);
      if (!attendee) {
        setError('Could not find attendee: ' + publicId);
        return;
      }
      await crowdpass.post(
        `/events/${eventId}/attendees/${attendee.id}/checkin?checkInMethod=NFC&gateId=${gateId}`
      );
      queries.attendees.invalidate();
      queries.areas.invalidate();
      setScanned(attendee);
    } catch (ex) {
      NfcManager.cancelTechnologyRequest();
    } finally {
      NfcManager.cancelTechnologyRequest();
      if (!error && !scanned) {
        debounceNFC();
        return;
      }
    }
  };

  const debounceNFC = _.debounce({ delay: 2000 }, () => {
    handleNFC();
  });
  useEffect(() => {
    NfcManager.start();
    handleNFC();
  }, []);

  useEffect(() => {
    if (counter > 4) {
      navigation.goBack();
    }
  }, [counter]);

  useEffect(() => {
    if (scanned || error) {
      setTimeout(() => {
        setScanned(null);
        setError(null);
        if (!error && !scanned) {
          debounceNFC();
        }
      }, 5000);
    }
  }, [scanned, error]);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, []);

  useEffect(() => {
    if (!isFocused) {
      NfcManager.unregisterTagEvent();
      NfcManager.cancelTechnologyRequest();
    }
  }, [isFocused]);

  return (
    <TouchableOpacity
      onPress={() => {}}
      containerStyle={{
        flex: 1,
      }}
      style={{
        height: '100%',
        backgroundColor: primaryColor,
      }}
    >
      <SafeAreaView />
      <View
        style={{
          flex: 1,
          width: '100%',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingHorizontal: 20,
          position: 'relative',
        }}
      >
        <Text
          style={{
            color: 'white',
            top: 40,
            fontSize: 24,
            fontWeight: 'bold',
            textAlign: 'center',
          }}
        >
          {scanned || error ? '' : gate?.name.toLocaleUpperCase()}
        </Text>

        {!error && !scanned && (
          <TouchableWithoutFeedback
            containerStyle={{
              width: '100%',
              height: 100,
            }}
            style={{
              top: 50,
            }}
            onPress={() => {
              setCounter((prev) => ++prev);
            }}
          >
            <Image
              source={require('@/assets/icons/advoc8-arrow.png')}
              style={{
                width: '100%',
                height: 100,
                resizeMode: 'contain',
              }}
            />
          </TouchableWithoutFeedback>
        )}
        <Text
          style={{
            color: 'white',
            fontSize: 48,
            textAlign: 'center',
            fontWeight: 'bold',
          }}
        >
          {error
            ? error
            : scanned
            ? `Thanks! ${'\n'} Stay tuned for more info`
            : 'Tap here to scan!'}
        </Text>
        <Image
          style={{
            width: '50%',
            height: 200,
            bottom: 40,
            left: 10,
            resizeMode: 'contain',
          }}
          source={require('@/assets/images/innovation-gallery.png')}
        />
      </View>
    </TouchableOpacity>
  );
}
