import { KeyboardAvoidingView, ScrollView, View } from 'react-native';
import { useLocalSearchParams, useNavigation, useRouter } from 'expo-router';
import * as _ from 'radash';
import { Button, TextInput, HelperText } from 'react-native-paper';
import crowdpass from '@/adapters/crowdpass';
import React, { useLayoutEffect } from 'react';
import { AttendeeDto, CreateEventAttendeeDto } from '@/types/swagger';
import { showSnackbar } from '@/components/SnackbarDialog';
import { useEventAttendeesQuery } from '@/hooks/useEventAttendeesQuery';
import { Controller, useForm } from 'react-hook-form';
import isEmail from 'validator/lib/isEmail';
import Dropdown from '@/components/dropdown';
import { useEventsQuery } from '@/hooks/useEventsQuery';
import EventHeader from '@/components/header/EventHeader';

export default function DashboardEventAddAttendee(props) {
  const router = useRouter();
  const navigation = useNavigation();
  const eventId = Number.parseInt(useLocalSearchParams().event as string);

  const queries = {
    attendees: useEventAttendeesQuery(eventId),
    events: useEventsQuery(),
  };
  const { event } = {
    event: queries.events.findOne(eventId).data,
  };

  const { control, formState, handleSubmit, setValue, watch } = useForm({
    defaultValues: {
      email: '',
      firstName: '',
      lastName: '',
      attendeeGroupId: event?.attendeeGroups?.[0]?.id,
    } as CreateEventAttendeeDto,
  });

  const onSubmit = async (data: CreateEventAttendeeDto) => {
    try {
      const payload = _.clone(data);
      if (__DEV__) {
        payload.email = `sanmar+${data.email.split('@')[0]}@crowdpass.co`;
      }
      const attendee = (
        await crowdpass.post(`/events/${eventId}/attendees`, payload)
      ).data.data as AttendeeDto;
      queries.attendees.invalidate();
      router.back();
      router.push(`/dashboard/${eventId}/attendee/${attendee.id}/attendee`);
    } catch (error) {
      console.error('add-attendee ->', error);
      showSnackbar({ message: `Error: ${error?.message}` });
    }
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      header: () => <EventHeader title={'Add Attendee'} />,
    });
  }, [navigation]);

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior="padding"
      keyboardVerticalOffset={96}
    >
      <ScrollView style={{ marginHorizontal: 32 }}>
        <Controller
          control={control}
          name="email"
          rules={{
            required: 'Email address required!',
            validate: (value) => isEmail(value) || 'Invalid email address!',
          }}
          render={({
            field: { onChange, onBlur, value },
            fieldState: { error },
          }) => (
            <>
              <TextInput
                style={{ marginTop: 32 }}
                mode="outlined"
                label="Email"
                inputMode="email"
                autoComplete="off"
                autoCapitalize="none"
                autoCorrect={false}
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
              />
              <HelperText type="error" visible={!!error}>
                {error?.message ?? ' '}
              </HelperText>
            </>
          )}
        />

        <Controller
          control={control}
          name="firstName"
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              style={{ marginTop: 0 }}
              mode="outlined"
              label="First Name"
              autoComplete="off"
              autoCorrect={false}
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
            />
          )}
        />

        <Controller
          control={control}
          name="lastName"
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              style={{ marginTop: 32 }}
              mode="outlined"
              label="Last Name"
              autoComplete="off"
              autoCorrect={false}
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
            />
          )}
        />
        <View style={{ marginTop: 32, zIndex: 50 }}>
          <Dropdown
            data={event.attendeeGroups}
            color={
              event.attendeeGroups.find((v) => v.id == watch('attendeeGroupId'))
                ?.color
            }
            items={event.attendeeGroups.map((v) => ({
              label: v.name,
              value: v,
            }))}
            placeholder="Loading"
            value={event.attendeeGroups.find(
              (v) => v.id == watch('attendeeGroupId')
            )}
            setValue={(v) => {
              setValue('attendeeGroupId', v.value.id);
            }}
          />
        </View>
        <Button
          style={{ marginTop: 48 }}
          mode="contained"
          disabled={formState.isSubmitting}
          loading={formState.isSubmitting}
          onPress={handleSubmit(onSubmit)}
        >
          Submit
        </Button>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
