import LoadingIndicator from '@/components/LoadingIndicator';
import { useEventAreasQuery } from '@/hooks/useEventAreasQuery';
import { useEventAttendeesQuery } from '@/hooks/useEventAttendeesQuery';
import { useEventsQuery } from '@/hooks/useEventsQuery';
import dayjs from 'dayjs';
import { useGlobalSearchParams, useRouter } from 'expo-router';
import * as _ from 'radash';
import React from 'react';
import { ScrollView, View } from 'react-native';
import { Card, Divider, List, Text } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useDispatch } from 'react-redux';

export default function DashboardEventDashboard(props) {
  const router = useRouter();
  const eventId = Number.parseInt(useGlobalSearchParams().event as string);
  const queries = {
    events: useEventsQuery(),
    attendees: useEventAttendeesQuery(eventId),
    areas: useEventAreasQuery(eventId),
  };
  const { event, areas, ...data } = {
    event: queries.events.findOne(eventId).data,
    attendees: queries.attendees.findAll().data,
    areas: queries.areas.findAll().data,
    visits: queries.areas.findAllVisits().data,
    exits: queries.areas.findAllExits().data,
  };

  if (!event || !data.attendees || !areas || !data.visits || !data.exits) {
    return <LoadingIndicator />;
  }

  const attendees = data.attendees.map((attendee, i) => {
    return {
      ...attendee,
      group:
        event.attendeeGroups.find((v) => v.id == attendee.attendeeGroupId) ??
        event.attendeeGroups.find((v) => v.isDefault == true),
    };
  });

  const allVisits = _.clone(data.visits.concat(data.exits)).sort((a, b) => {
    return (
      new Date(b.checkInDate ?? b.checkOutDate).valueOf() -
      new Date(a.checkInDate ?? a.checkOutDate).valueOf()
    );
  });

  const checkedins = attendees.filter((attendee) => {
    const visit = allVisits.find((v) => v.attendeeId == attendee.id);
    return !!visit?.checkInDate;
  });
  const percent = Number.parseInt(
    ((checkedins.length / attendees.length) * 100) as any
  );

  return (
    <ScrollView style={{ flex: 1, padding: 16 }}>
      <Text style={{ color: '#78829D', marginTop: 16 }} variant="bodyMedium">
        {dayjs(event.startDate).format('MMM D, hh:mm A')}
      </Text>

      <View
        style={{
          flexDirection: 'row',
          columnGap: 16,
          marginTop: 32,
        }}
      >
        <Card
          onPress={() =>
            router.push({
              pathname: '/dashboard/[event]/(tabs)/attendees',
              params: { event: eventId },
            })
          }
          style={{ backgroundColor: '#0077F2', flexGrow: 1 }}
          mode="contained"
        >
          <Card.Content>
            <Icon size={20} color="white" name="account-group" />
            <Text
              style={{ fontWeight: 'bold', color: 'white' }}
              variant="bodyLarge"
            >
              Attendees
            </Text>
          </Card.Content>
          <Card.Content style={{ marginTop: 32 }}>
            <Text style={{ color: 'white' }} variant="bodyMedium">
              Total
            </Text>
            <Text
              style={{ fontWeight: 'bold', color: 'white' }}
              variant="headlineLarge"
            >
              {attendees.length.toLocaleString()}
            </Text>
          </Card.Content>
        </Card>

        <Card
          style={{ backgroundColor: '#00CA81', flexGrow: 1 }}
          mode="contained"
        >
          <Card.Content>
            <Icon size={20} color="white" name="location-enter" />
            <Text
              style={{ fontWeight: 'bold', color: 'white' }}
              variant="bodyLarge"
            >
              Checked In
            </Text>
          </Card.Content>
          <Card.Content style={{ marginTop: 32 }}>
            <Text style={{ color: 'white' }} variant="bodyMedium">
              <Text
                style={{ fontWeight: 'bold', color: 'white' }}
                variant="bodyMedium"
              >
                {checkedins.length}
              </Text>
              {` `}/ {attendees.length}
            </Text>
            <Text
              style={{ fontWeight: 'bold', color: 'white' }}
              variant="headlineLarge"
            >
              {percent || 0}%
            </Text>
          </Card.Content>
        </Card>
      </View>

      <Divider style={{ marginVertical: 32 }} />

      <Text style={{ color: '#4F5974' }} variant="bodyMedium">
        EVENT AREA VISITS
      </Text>

      {areas.map((area, i) => {
        const visits = allVisits.filter((v) => v.areaId == area.id);
        const checkedins = attendees.filter((attendee) => {
          const visit = visits.find((v) => v.attendeeId == attendee.id);
          return !!visit?.checkInDate;
        });
        return (
          <Card
            key={i}
            style={{ marginTop: 16, backgroundColor: 'white' }}
            mode="outlined"
          >
            <List.Item
              title={
                <Text style={{ fontWeight: 'bold' }} variant="titleLarge">
                  {area.name}
                </Text>
              }
              left={(props) => (
                <View style={{ ...props.style, width: 24 }}></View>
              )}
              right={(props) => (
                <Text style={{ fontWeight: 'bold' }} variant="titleLarge">
                  {checkedins.length.toLocaleString()}
                </Text>
              )}
            />

            <Divider />

            {area.eventAreaGates.map((gate, i) => {
              const visits = allVisits.filter((v) => v.gateId == gate.id);
              const checkedins = attendees.filter((attendee) => {
                const visit = visits.find((v) => v.attendeeId == attendee.id);
                return !!visit?.checkInDate;
              });
              const last = visits.find((v) => !!v.checkInDate)?.checkInDate;
              return (
                <List.Item
                  key={i}
                  title={gate.name}
                  titleStyle={{ fontWeight: 'bold' }}
                  description={`Last check-in: ${
                    last ? dayjs(last).fromNow() : 'N/A'
                  }`}
                  left={(props) => (
                    <View style={{ ...props.style, width: 24 }}></View>
                  )}
                  right={(props) => (
                    <Text style={{ fontWeight: 'bold' }} variant="titleMedium">
                      {checkedins.length.toLocaleString()}
                    </Text>
                  )}
                />
              );
            })}
          </Card>
        );
      })}

      <View style={{ height: 64 }} />
    </ScrollView>
  );
}
