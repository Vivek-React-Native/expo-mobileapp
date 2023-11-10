import LoadingIndicator from '@/components/LoadingIndicator';
import { Alert, ScrollView } from 'react-native';
import { useGlobalSearchParams, useRouter, useNavigation } from 'expo-router';
import dayjs from 'dayjs';
import * as _ from 'radash';
import {
  Avatar,
  Button,
  Card,
  List,
  Divider,
  useTheme,
} from 'react-native-paper';
import { useEventAreasQuery } from '@/hooks/useEventAreasQuery';
import { useEventsQuery } from '@/hooks/useEventsQuery';
import React, { useLayoutEffect } from 'react';
import { useEventAttendeesQuery } from '@/hooks/useEventAttendeesQuery';
import { useInterval } from 'ahooks';
import EventHeader from '@/components/header/EventHeader';

export default function AttendeeEventContacts(props) {
  const theme = useTheme();
  const router = useRouter();
  const navigation = useNavigation();
  const eventId = Number.parseInt(useGlobalSearchParams().event as string);
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

  const allVisits = _.clone(data?.visits?.concat(data.exits))?.sort((a, b) => {
    return (
      new Date(b.checkInDate ?? b.checkOutDate).valueOf() -
      new Date(a.checkInDate ?? a.checkOutDate).valueOf()
    );
  });

  useInterval(() => {
    queries.areas.invalidate(['findAllVisits']);
    queries.areas.invalidate(['findAllExits']);
  }, 3000);

  useLayoutEffect(() => {
    navigation.setOptions({
      header: () => <EventHeader title={event?.title} />,
    });
  }, [navigation, event]);

  if (!event || !attendees || !areas || !data.visits || !data.exits) {
    return <LoadingIndicator />;
  }
  return (
    <ScrollView style={{ flex: 1, marginVertical: 8 }}>
      {areas.map((area, i) => {
        const visits = allVisits.filter((v) => v.areaId == area.id);
        const checkedins = attendees.filter((attendee) => {
          const visit = visits.find((v) => v.attendeeId == attendee.id);
          return !!visit?.checkInDate;
        });
        const percent = Number.parseInt(
          ((checkedins.length / attendees.length) * 100) as any
        );
        return (
          <Card
            key={i}
            mode="outlined"
            style={{ marginHorizontal: 16, marginVertical: 8 }}
          >
            <Card.Title
              title={area.name}
              titleVariant="titleLarge"
              subtitle={`(${checkedins.length}/${attendees.length}) ${percent}% Attendees`}
              subtitleVariant="bodySmall"
              left={(props) => (
                <Avatar.Text {...props} label={checkedins.length.toString()} />
              )}
              {...(area.isDefault && {
                right: (props) => (
                  <List.Icon
                    {...props}
                    style={{ marginRight: 16 }}
                    color="#00CA81"
                    icon="star"
                  />
                ),
              })}
            />

            {area.eventAreaGates.map((gate, i) => {
              return (
                <React.Fragment key={i}>
                  <Divider />
                  <List.Item
                    title={gate.name}
                    description={`${
                      visits.filter((v) => v.gateId == gate.id).length
                    } Visits`}
                    right={() => (
                      <Button
                        mode="contained"
                        style={{ backgroundColor: '#00CA81' }}
                        onPress={() => {
                          if (eventId == 1245 && area.id == 1311) {
                            router.push(
                              `/dashboard/${eventId}/${area.id}/${gate.id}/advoc8-scan`
                            );
                            return;
                          }
                          router.push(
                            `/dashboard/${eventId}/${area.id}/${gate.id}/scan`
                          );
                        }}
                        icon={(props) => (
                          <List.Icon
                            {...props}
                            color={theme.colors.background}
                            icon="blur"
                          />
                        )}
                      >
                        Scan
                      </Button>
                    )}
                  />
                </React.Fragment>
              );
            })}

            <List.Accordion
              title={`${area.name} visits history`}
              left={(props) => <List.Icon {...props} icon="history" />}
            >
              {visits.map((visit, i) => {
                return (
                  <List.Item
                    key={i}
                    title={`${visit.firstName} ${visit.lastName}\n@ ${
                      visit.gateName
                    }\nvia ${visit.checkInMethod ?? visit.checkOutMethod}`}
                    titleNumberOfLines={3}
                    description={dayjs(
                      visit.checkInDate ?? visit.checkOutDate
                    ).fromNow()}
                    left={(props) => (
                      <List.Icon
                        {...props}
                        icon={
                          visit.checkInDate ? 'location-enter' : 'location-exit'
                        }
                        color={visit.checkInDate ? '#00CA81' : '#F5324A'}
                      />
                    )}
                    onPress={() => {
                      router.push(
                        `/dashboard/${eventId}/attendee/${visit.attendeeId}/attendee`
                      );
                    }}
                  />
                );
              })}
            </List.Accordion>
          </Card>
        );
      })}
    </ScrollView>
  );
}
