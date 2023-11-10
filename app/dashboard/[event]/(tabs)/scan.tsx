import { useFocusEffect, useRouter } from 'expo-router';
import * as _ from 'radash';
import React, { useEffect, useState } from 'react';
import { BarCodeScanner } from 'expo-barcode-scanner';
import crowdpass from '@/adapters/crowdpass';

export default function AttendeeEventContacts(props) {
  const router = useRouter();
  const [permission] = BarCodeScanner.usePermissions({
    get: true,
    request: true,
  });
  const [scanData, setScanData] = useState<any>();

  const scanTicket = async (ticketId) => {
    await crowdpass
      .post(`/ticket/scan/${ticketId}`, {
        scannerId: 'string',
        scannerName: 'string',
      })
      .then((res) => {
        if (
          res.data.message ==
          'SUCCESSFULLY_CHECKED_ATTENDEE_INTO_EVENT_WITH_VALID_TICKET'
        ) {
          router.push({
            pathname: '/dashboard/check-in-result',
            params: {
              firstName: res.data.data.firstName,
              lastName: res.data.data.lastName,
              ticketId,
              checkedIn: true,
              profilePhotoBlobId: res.data.data.profilePhotoBlobId,
            },
          });
        }
      })
      .catch((e) => {
        if (e.response.data.message == 'TICKET_IS_ALREADY_USED')
          router.push({
            pathname: '/dashboard/check-in-result',
            params: { error: 'Ticket is already used' },
          });
      });
  };

  useEffect(() => {
    if (scanData) {
      scanTicket(scanData);
    }
  }, [scanData]);

  useFocusEffect(
    React.useCallback(() => {
      const debouncedSetScanData = _.debounce({ delay: 100 }, () => {
        setScanData(null);
      });
      debouncedSetScanData();
      return () => {};
    }, [setScanData])
  );

  return (
    <BarCodeScanner
      style={{ width: '100%', height: '100%' }}
      focusable
      barCodeTypes={[BarCodeScanner.Constants.BarCodeType.qr]}
      onBarCodeScanned={(result) => {
        setScanData(result.data);
      }}
    />
  );
}
