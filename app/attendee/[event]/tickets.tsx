import LoadingIndicator from '@/components/LoadingIndicator';
import { ScrollView, View } from 'react-native';
import {
  Stack,
  useGlobalSearchParams,
  useLocalSearchParams,
  usePathname,
  useRouter,
  useSegments,
  useRootNavigation,
} from 'expo-router';
import { useCurrentQuery } from '@/hooks/useCurrentQuery';
import dayjs from 'dayjs';
import * as _ from 'radash';
import {
  ActivityIndicator,
  Avatar,
  Button,
  Card,
  List,
  Searchbar,
  Text,
} from 'react-native-paper';

export default function AttendeeEventTickets(props) {
  const publicId = useGlobalSearchParams().event as string;
  const event = useCurrentQuery().findOneEvent(publicId).data;
  const router = useRouter();

  if (!event) {
    return <LoadingIndicator />;
  }

  // const event = useCurrentQuery().findOneEvent(eventId).data;
  // console.log('event ->', event);

  return (
    <>
      <List.Section title="Personal Details">
        <List.Item title={event.firstName} description="First Name" />
        <List.Item title={event.lastName} description="Last Name" />
      </List.Section>
      <View style={{ flex: 1 }}></View>
    </>
  );
}
