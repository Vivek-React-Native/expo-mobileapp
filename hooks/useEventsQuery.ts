import crowdpass from '@/adapters/crowdpass';
import { EventDto, PublicEventDto } from '@/types/swagger';
import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { queryClient } from './useQuery';

export interface EventDashboardDto {
  extraRegistrationCredits: number;
  id: number;
  managers: {
    firstName: string;
    lastName: string;
  }[];
  numberOfAttendees: number;
  organizationId: number;
  organizationName: string;
  publicId: string;
  startDate: string;
  statusId: number;
  title: string;
}

export function useEventsQuery() {
  const QUERY_KEY = ['useEventsQuery'];
  const invalidate = (keys = [] as (string | number)[]) => {
    return queryClient.invalidateQueries([...QUERY_KEY, ...keys]);
  };
  return {
    invalidate,

    findAll: (options: UseQueryOptions<EventDto[]> = {}) => {
      return useQuery(
        [...QUERY_KEY],
        async () => {
          return (await crowdpass.get(`/events`)).data.data as EventDto[];
        },
        options as any
      );
    },

    findAllDashboard: (options: UseQueryOptions<EventDashboardDto[]> = {}) => {
      return useQuery(
        [...QUERY_KEY, 'findAllDashboard'],
        async () => {
          return (
            await crowdpass.get(`/events/dashboard`, {
              params: { pageSize: 9999 },
            })
          ).data.data as EventDashboardDto[];
        },
        options as any
      );
    },

    findOne: (eventId?: number, options: UseQueryOptions<EventDto> = {}) => {
      return useQuery(
        [...QUERY_KEY, eventId],
        async () => {
          return (await crowdpass.get(`/events/${eventId}`)).data
            .data as EventDto;
        },
        { enabled: Number.isFinite(eventId), ...(options as any) }
      );
    },

    findOnePublic: (
      publicId?: string,
      options: UseQueryOptions<PublicEventDto> = {}
    ) => {
      return useQuery(
        [...QUERY_KEY, publicId],
        async () => {
          return (await crowdpass.public.get(`/events/${publicId}`)).data
            .data as PublicEventDto;
        },
        { enabled: !!publicId, ...(options as any) }
      );
    },
  };
}
