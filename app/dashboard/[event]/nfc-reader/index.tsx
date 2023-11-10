import { Text, View } from 'react-native';
import { List } from 'react-native-paper';
import { useEffect, useState } from 'react';
import { getStorage, setStorage } from '@/utils/storage';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { TouchableOpacity } from 'react-native-gesture-handler';
import axios from 'axios';
import { Reader } from '@/types/nfc';

export default function NFCReaderList() {
  const [nfc, setNfc] = useState<string>();
  const [readers, setReaders] = useState<Reader[]>([]);

  useEffect(() => {
    axios.get('https://cp-raspberrypi-nfc.deno.dev/readers').then((res) => {
      setReaders(res.data);
    });
  }, []);

  useEffect(() => {
    if (!readers.length) return;
    getStorage('nfc').then((res: any) => {
      setNfc(res);
    });
  }, [readers]);

  const handleNFC = async (m: string) => {
    if (nfc === m) {
      setNfc(undefined);
      return;
    }
    await setStorage('nfc', m);
    setNfc(m);
  };

  return (
    <View>
      {readers.map((m) => (
        <List.Item
          title={m.reader + ' ' + m.mac_address[1]}
          description={nfc === m.mac_address[1] ? 'Connected' : 'Disconnected'}
          left={(props) => (
            <MaterialCommunityIcons
              {...props}
              name="transit-connection-variant"
              size={32}
              color={nfc === m.mac_address[1] ? 'green' : 'red'}
            />
          )}
          right={() => (
            <TouchableOpacity
              style={{
                backgroundColor: nfc === m.mac_address[1] ? 'red' : 'green',
                padding: 8,
                paddingHorizontal: 16,
                borderRadius: 16,
              }}
            >
              <Text style={{ color: 'white' }}>
                {nfc === m.mac_address[1] ? 'Disconnect' : 'Connect'}
              </Text>
            </TouchableOpacity>
          )}
          onPress={() => {
            handleNFC(m.mac_address[1]);
          }}
        />
      ))}
    </View>
  );
}
