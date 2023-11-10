import {
  useMutation,
  UseMutationOptions,
  useQuery,
  UseQueryOptions,
} from '@tanstack/react-query';
import {
  EventAreaDto,
  UpdateEventAreaDto,
  EventAttendeeDto,
  EventAreaVisitDto,
} from '@/types/swagger';
import { queryClient } from './useQuery';
import crowdpass from '@/adapters/crowdpass';

export interface EventAreaDashboardDto {
  gatesCount: number;
  groupsWithAccessCount: number;
  id: number;
  isDefault: boolean;
  name: string;
  visitsCount: number;
}

export interface EventAreaVisitDashboardDto {
  attendeeId: number;
  checkInDate: string;
  checkInMethod: any;
  firstName: string;
  gateName: string;
  lastName: string;
  scannerId: any;
}

export function useEventAreasQuery(eventId: number) {
  const QUERY_KEY = ['useEventAreasQuery', eventId];
  const invalidate = (keys = [] as (string | number)[]) => {
    return queryClient.invalidateQueries([...QUERY_KEY, ...keys]);
  };
  return {
    invalidate,

    findAll: (options: UseQueryOptions<EventAreaDto[]> = {}) => {
      return useQuery(
        QUERY_KEY,
        async () => {
          return (await crowdpass.get(`/events/${eventId}/areas`)).data
            .data as EventAreaDto[];
        },
        options as any
      );
    },

    findOne: (areaId?: number, options: UseQueryOptions<EventAreaDto> = {}) => {
      return useQuery(
        [...QUERY_KEY, areaId],
        async () => {
          return (await crowdpass.get(`/events/${eventId}/areas/${areaId}`))
            .data.data as EventAreaDto;
        },
        { enabled: Number.isFinite(areaId), ...(options as any) }
      );
    },

    findAllDashboard: (
      options: UseQueryOptions<EventAreaDashboardDto[]> = {}
    ) => {
      return useQuery(
        [...QUERY_KEY, 'findAllDashboard'],
        async () => {
          return (
            await crowdpass.get(`/events/${eventId}/areas/dashboard`, {
              params: { pageSize: 9999 },
            })
          ).data.data as EventAreaDashboardDto[];
        },
        options as any
      );
    },

    findAllVisits: (options: UseQueryOptions<EventAreaVisitDto[]> = {}) => {
      return useQuery(
        [...QUERY_KEY, 'findAllVisits'],
        async () => {
          return (await crowdpass.get(`/events/${eventId}/areas/visits`)).data
            .data as EventAreaVisitDto[];
        },
        options as any
      );
    },

    findAllExits: (options: UseQueryOptions<EventAreaVisitDto[]> = {}) => {
      return useQuery(
        [...QUERY_KEY, 'findAllExits'],
        async () => {
          return (await crowdpass.get(`/events/${eventId}/areas/exits`)).data
            .data as EventAreaVisitDto[];
        },
        options as any
      );
    },

    findOneVisitsDashboard: (
      areaId?: number,
      options: UseQueryOptions<EventAreaVisitDashboardDto[]> = {}
    ) => {
      return useQuery(
        [...QUERY_KEY, 'findOneVisitsDashboard', areaId],
        async () => {
          return (
            await crowdpass.get(
              `/events/${eventId}/areas/${areaId}/visits/dashboard`,
              { params: { pageSize: 9999 } }
            )
          ).data.data as EventAreaVisitDashboardDto[];
        },
        { enabled: Number.isFinite(areaId), ...(options as any) }
      );
    },
  };
}
