import crowdpass from '@/adapters/crowdpass';
import {
  AttendeeDto,
  CreateEventAttendeeDto,
  UpdateAttendeeDto,
} from '@/types/swagger';
import {
  useMutation,
  UseMutationOptions,
  useQuery,
  UseQueryOptions,
} from '@tanstack/react-query';
import { queryClient } from './useQuery';

export interface DeviceDto {
  attendeeId: number;
  deviceUuid: string;
  metadata: string;
}

export function useEventAttendeesQuery(eventId: number) {
  const QUERY_KEY = ['useEventAttendeesQuery', eventId];
  const invalidate = (keys = [] as (string | number)[]) => {
    return queryClient.invalidateQueries([...QUERY_KEY, ...keys]);
  };
  return {
    invalidate,

    findAll: (options: UseQueryOptions<AttendeeDto[]> = {}) => {
      return useQuery(
        [...QUERY_KEY],
        async () => {
          return (await crowdpass.get(`/events/${eventId}/attendees`)).data
            .data as AttendeeDto[];
        },
        { enabled: Number.isFinite(eventId), ...(options as any) }
      );
    },

    findAllDevices: (options: UseQueryOptions<DeviceDto[]> = {}) => {
      return useQuery(
        [...QUERY_KEY, 'findAllDevices'],
        async () => {
          return (
            ((await crowdpass.get(`/events/${eventId}/devices`)).data
              .data as DeviceDto[]) ?? []
          );
        },
        { enabled: Number.isFinite(eventId), ...(options as any) }
      );
    },

    mutations: (options: UseMutationOptions<AttendeeDto> = {}) => {
      return {
        create: useMutation(
          async (body: CreateEventAttendeeDto) => {
            const attendee = (
              await crowdpass.post(`/events/${eventId}/attendees`, body)
            ).data.data as AttendeeDto;
            return attendee;
          },
          {
            onError: (error, body) => {
              console.error('useEventAttendeesQuery create ->', error);
            },
            ...(options as any),
          }
        ),
        update: useMutation(
          async (body: UpdateAttendeeDto & { id: number }) => {
            await crowdpass.put(`/attendees/${body.id}`, body);
          },
          {
            onError: (error, body) => {
              console.error('useEventAttendeesQuery update ->', error);
            },
            ...(options as any),
          }
        ),
      };
    },
  };
}
