import LoadingIndicator from '@/components/LoadingIndicator';
import { ScrollView, View } from 'react-native';
import { Stack, useRouter, useSegments } from 'expo-router';
import { useCurrentQuery } from '@/hooks/useCurrentQuery';
import dayjs from 'dayjs';
import * as _ from 'radash';
import {
  ActivityIndicator,
  Avatar,
  Button,
  Card,
  Divider,
  List,
  Searchbar,
  Text,
} from 'react-native-paper';
import { useMount } from 'ahooks';
import crowdpass from '@/adapters/crowdpass';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

export default function AttendeeEvents() {
  const router = useRouter();

  const queries = {
    current: useCurrentQuery(),
  };
  const { user, ...data } = {
    user: queries.current.findUser().data,
    events: queries.current.findAllEvents().data,
    orders: queries.current.findAllOrders().data,
  };

  if (!user || !data.events || !data.orders) {
    return <LoadingIndicator />;
  }

  const pasts = _.sort(
    data.events.filter(
      (v) =>
        new Date(v.event.endDate ?? v.event.startDate).valueOf() < Date.now()
    ),
    (v) => new Date(v.event.endDate ?? v.event.startDate).valueOf(),
    true
  );
  const futures = _.sort(
    data.events.filter(
      (v) =>
        new Date(v.event.endDate ?? v.event.startDate).valueOf() > Date.now()
    ),
    (v) => new Date(v.event.endDate ?? v.event.startDate).valueOf()
  );
  const events = [...futures, ...pasts];

  return (
    <>
      {/* <Searchbar
        mode="view"
        placeholder="Search"
        onChangeText={() => {}}
        value={''}
      /> */}

      {events.length == 0 && (
        <View
          style={{
            flex: 1,
            justifyContent: 'flex-start',
            alignItems: 'center',
            gap: 16,
            marginTop: '25%',
          }}
        >
          <Icon size={128} color="#B339DE" name="calendar-remove-outline" />
          <Text variant="titleLarge">No events found</Text>
          <Text
            variant="bodyMedium"
            style={{ textAlign: 'center', width: 256 }}
          >
            {`The events you accept invitations to attend will show up here.`}
          </Text>
          <Button
            style={{ width: 192 }}
            mode="outlined"
            onPress={() => queries.current.invalidate(['findAllEvents'])}
          >
            Refresh
          </Button>
        </View>
      )}

      {events.length > 0 && (
        <ScrollView style={{ flex: 1 }}>
          {events.map((event, i) => {
            const orders = (data.orders ?? []).filter(
              (v) => v.event.publicId == event.event.publicId
            );
            return (
              <Card
                key={i}
                mode="elevated"
                style={{ margin: 16 }}
                onPress={(e) => {
                  router.push(`/attendee/${event.event.publicId}`);
                }}
              >
                <Card.Cover
                  source={
                    event.event.pageBackgroundReferenceKey
                      ? {
                          uri: `${process.env['NX_PUBLIC_URI']}/blobs/${event.event.pageBackgroundReferenceKey}`,
                        }
                      : require('@/assets/images/default-event-image.png')
                  }
                />

                <Card.Title
                  style={{ paddingVertical: 8 }}
                  title={event.event.title}
                  titleVariant="titleMedium"
                  titleNumberOfLines={3}
                  subtitle={`${dayjs(event.event.startDate).fromNow()}`}
                  subtitleVariant="bodySmall"
                  left={(props) => (
                    <Avatar.Image
                      {...props}
                      source={
                        event.event.logoBlobReferenceKey
                          ? {
                              uri: `${process.env['NX_PUBLIC_URI']}/blobs/${event.event.logoBlobReferenceKey}`,
                            }
                          : require('@/assets/images/gradient-profile-bg.png')
                      }
                    />
                  )}
                />

                <Divider />

                <List.Item
                  title={`${event.tickets.length} Tickets`}
                  left={(props) => <List.Icon {...props} icon="qrcode" />}
                />
                <List.Item
                  title={`${orders.length} Orders`}
                  left={(props) => <List.Icon {...props} icon="receipt" />}
                />
              </Card>
            );
          })}
        </ScrollView>
      )}
    </>
  );
}
