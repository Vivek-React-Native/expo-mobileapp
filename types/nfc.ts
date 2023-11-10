export type NfcWebSocketMessage = {
  text: string;
  uid: string;
};

export type Reader = {
  heartbeat: number;
  hostname: string;
  mac_address: string[];
  reader: string;
};
