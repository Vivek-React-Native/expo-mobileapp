import {  View ,StyleSheet, ActionSheetIOS} from 'react-native';
import { Stack, useRouter, useSegments } from 'expo-router';
import * as _ from 'radash';
import {
  Text,
} from 'react-native-paper';
import { useEffect, useState } from 'react';
import { Button } from 'react-native-paper';
// import NFCReader from './NFCReader';
import { NativeModules,NativeEventEmitter } from 'react-native';
const NFCReaderModule = NativeModules.NFCReaderModule;
const eventEmitter = new NativeEventEmitter(NFCReaderModule);

export default function NFCReaderEvent() {
  const router = useRouter();
  const [nfcData, setNFCData] = useState('');
  const [terminalData, setTerminalData] = useState('');
  const [nfcCardData, setNfcCardData] = useState('');
  const [nfcCardUDIDData, setNfcCardUDIDData] = useState('');


  useEffect(() => {
    const nfcDataListener = eventEmitter.addListener('NFCDataReceived', (event) => {
      const receivedNFCData = event.data;
      setNFCData(receivedNFCData);
    }
    );
    const nfcCardDataListener = eventEmitter.addListener('NFCCardDataReceived', (event) => {
      const receivedNFCData = event.data;
      setNfcCardData(receivedNFCData);
    }
    );
    const terminalDataListener = eventEmitter.addListener('terminalDataRecived', (event) => {
      const receivedNFCData = event.data;
      setTerminalData(receivedNFCData);
    }
    );
    const nfcCardUDIDDataListener = eventEmitter.addListener('NFCCardUDIDDataReceived', (event) => {
      const receivedNFCData = event.data;
      setNfcCardUDIDData(receivedNFCData);
    }
    );
    return () => {
      console.log('outside')
      nfcDataListener.remove();
      nfcCardDataListener.remove();
      terminalDataListener.remove();
      nfcCardUDIDDataListener.remove();
      NFCReaderModule.stopNFCReader();
    };
  }, []);

  function handleStartNFCReader(title = "") {
    NFCReaderModule.startNFCReader(title);
  }
  function onPressReaderButton() {
    ActionSheetIOS.showActionSheetWithOptions(
      {
        title:"Select Terminal",
        options: ['ACR3901U-S1/ACR3901T-W1', 'ACR1255U-J1', 'AMR220-C',"ACR1255U-J1 V2","Cancel"],
      },
      buttonIndex => {
        if (buttonIndex === 0) {
         handleStartNFCReader('ACR3901U-S1/ACR3901T-W1')
        } else if (buttonIndex === 1) {
          handleStartNFCReader('ACR1255U-J1')
        }
        else if (buttonIndex === 2) {
          handleStartNFCReader('AMR220-C')
        }
        else if (buttonIndex === 3) {
          handleStartNFCReader('ACR1255U-J1 V2')
        }
      },
  )}

  return (
    <>
      <View style={{ flex: 1, padding: 16, alignItems: 'center' }}>
      <Button
          style={{ width: 192,marginVertical:20 }}
          mode="outlined"
          onPress={() => onPressReaderButton()}
        >
          Start NFC Reader
        </Button>
      <Text style={{paddingTop:10}}> 
      <Text>NFC Data: </Text>
      <Text style={styles.txt}>{terminalData}</Text>
      </Text>
      <Text style={{paddingTop:10}}> 
      <Text>Card State: </Text>
      <Text style={styles.txt}>{nfcData}</Text>
      </Text>
      <Text style={{paddingTop:10}}> 
      <Text>Card Data: </Text>
      <Text style={styles.txt}>{nfcCardData}</Text>
      </Text>
      <Text style={{paddingTop:10}}> 
      <Text>UDID: </Text>
      <Text style={styles.txt}>{nfcCardUDIDData}</Text>
      </Text>
      
    </View>
    </>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    marginHorizontal: 16,
  },
  txt:{
    fontWeight:'600',
    fontSize:16
  },
  button:{
    backgroundColor:'#000',
    color:"#fff",
    height:50,
    justifyContent:'center',
    alignItems:'center',
    borderRadius:10,
    marginBottom:10
  },
  buttonText:{
    color:"#fff"
  }
});