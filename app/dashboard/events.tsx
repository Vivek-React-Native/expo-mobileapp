import LoadingIndicator from '@/components/LoadingIndicator';
import { ScrollView, View } from 'react-native';
import { useRouter } from 'expo-router';
import { useCurrentQuery } from '@/hooks/useCurrentQuery';
import dayjs from 'dayjs';
import * as _ from 'radash';
import { Avatar, Card, Divider, Text } from 'react-native-paper';
import { useEventsQuery } from '@/hooks/useEventsQuery';
import crowdpass from '@/adapters/crowdpass';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

export default function DashboardEvents() {
  const router = useRouter();

  const queries = {
    events: useEventsQuery(),
    current: useCurrentQuery(),
  };
  const { dashboards, company, teammates, ...data } = {
    events: queries.events.findAll().data,
    dashboards: queries.events.findAllDashboard().data,
    company: queries.current.findCompany().data,
    teammates: queries.current.findAllTeammates().data,
  };

  if (!data.events || !dashboards || !company || !teammates) {
    return <LoadingIndicator />;
  }

  const pasts = _.sort(
    data.events.filter(
      (v) => new Date(v.endDate ?? v.startDate).valueOf() < Date.now()
    ),
    (v) => new Date(v.endDate ?? v.startDate).valueOf(),
    true
  );
  const futures = _.sort(
    data.events.filter(
      (v) => new Date(v.endDate ?? v.startDate).valueOf() > Date.now()
    ),
    (v) => new Date(v.endDate ?? v.startDate).valueOf()
  );
  const events = [...futures, ...pasts].filter((v) => v.statusId == 1);

  return (
    <ScrollView style={{ flex: 1, padding: 16 }}>
      <Text
        style={{ fontWeight: 'bold', marginBottom: 32 }}
        variant="headlineMedium"
      >
        {company.name}
      </Text>

      <Card
        style={{ backgroundColor: '#B339DE', flexGrow: 1, marginBottom: 16 }}
        mode="contained"
      >
        <Card.Content>
          <Icon size={20} color="white" name="domain" />
          <Text
            style={{ fontWeight: 'bold', color: 'white' }}
            variant="bodyLarge"
          >
            Company
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
            {teammates.length.toLocaleString()}
          </Text>
        </Card.Content>
      </Card>

      <View
        style={{
          flexDirection: 'row',
          columnGap: 16,
        }}
      >
        <Card
          style={{ backgroundColor: '#0077F2', flexGrow: 1 }}
          mode="contained"
        >
          <Card.Content>
            <Icon size={20} color="white" name="calendar-check" />
            <Text
              style={{ fontWeight: 'bold', color: 'white' }}
              variant="bodyLarge"
            >
              Events
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
              {events.length.toLocaleString()}
            </Text>
          </Card.Content>
        </Card>

        <Card
          style={{ backgroundColor: '#00CA81', flexGrow: 1 }}
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
              {dashboards
                .reduce((target, value) => {
                  target += value.numberOfAttendees;
                  return target;
                }, 0)
                .toLocaleString()}
            </Text>
          </Card.Content>
        </Card>
      </View>

      <Divider style={{ marginVertical: 32 }} />

      <Text
        style={{ fontWeight: 'bold', marginBottom: 32 }}
        variant="titleLarge"
      >
        {company.name} Events
      </Text>

      {events.map((event, i) => {
        return (
          <Card
            key={i}
            style={{ backgroundColor: 'white', marginBottom: 32 }}
            mode="outlined"
            onPress={() => {
              router.push(`/dashboard/${event.id}`);
            }}
          >
            <Card.Cover
              source={
                Number.isFinite(event.pageBackgroundBlobId)
                  ? {
                      uri: `${process.env['NX_URI']}/blobs/${event.pageBackgroundBlobId}`,
                      headers: {
                        Authorization: `Bearer ${
                          crowdpass.useToken.getState().token
                        }`,
                      },
                    }
                  : require('@/assets/images/default-event-image.png')
              }
            />
            <Card.Title
              style={{ marginVertical: 4 }}
              title={event.title}
              titleVariant="titleMedium"
              titleNumberOfLines={3}
              subtitle={`${dayjs(event.startDate).fromNow()}`}
              subtitleVariant="bodySmall"
              left={(props) => (
                <Avatar.Image
                  {...props}
                  style={{ backgroundColor: 'transparent' }}
                  source={
                    Number.isFinite(event.logoBlobId)
                      ? {
                          uri: `${process.env['NX_URI']}/blobs/${event.logoBlobId}`,
                          headers: {
                            Authorization: `Bearer ${
                              crowdpass.useToken.getState().token
                            }`,
                          },
                        }
                      : require('@/assets/icon.png')
                  }
                />
              )}
            />
          </Card>
        );
      })}

      <View style={{ height: 64 }} />
    </ScrollView>
  );
}
