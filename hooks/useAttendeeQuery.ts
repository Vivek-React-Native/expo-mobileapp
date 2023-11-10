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
import { DeviceDto } from './useEventAttendeesQuery';

export function useAttendeeQuery(attendeeId: number) {
  const QUERY_KEY = ['useAttendeeQuery', attendeeId];
  const invalidate = (keys = [] as (string | number)[]) => {
    return queryClient.invalidateQueries([...QUERY_KEY, ...keys]);
  };
  return {
    invalidate,

    findOne: (options: UseQueryOptions<AttendeeDto> = {}) => {
      return useQuery(
        [...QUERY_KEY],
        async () => {
          return (await crowdpass.get(`/attendees/${attendeeId}`)).data
            .data as AttendeeDto;
        },
        { enabled: Number.isFinite(attendeeId), ...(options as any) }
      );
    },

    findAllDevices: (options: UseQueryOptions<DeviceDto[]> = {}) => {
      return useQuery(
        [...QUERY_KEY, 'findAllDevices'],
        async () => {
          return (
            ((await crowdpass.get(`/attendees/${attendeeId}/devices`)).data
              .data as DeviceDto[]) ?? []
          );
        },
        { enabled: Number.isFinite(attendeeId), ...(options as any) }
      );
    },
  };
}
