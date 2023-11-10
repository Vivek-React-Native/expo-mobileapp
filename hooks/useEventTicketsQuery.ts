import crowdpass from '@/adapters/crowdpass';
import { TicketDto, TicketTypeDto } from '@/types/swagger';
import {
  useMutation,
  UseMutationOptions,
  useQuery,
  UseQueryOptions,
} from '@tanstack/react-query';
import { queryClient } from './useQuery';

export function useEventTicketsQuery(eventId: number) {
  const QUERY_KEY = ['useEventTicketsQuery', eventId];
  const invalidate = (keys = [] as (string | number)[]) => {
    return queryClient.invalidateQueries([...QUERY_KEY, ...keys]);
  };
  return {
    invalidate,

    findAll: (options: UseQueryOptions<TicketDto[]> = {}) => {
      return useQuery(
        QUERY_KEY,
        async () => {
          return (await crowdpass.get(`/events/${eventId}/ticketing/dashboard`))
            .data.data as TicketDto[];
        },
        options as any
      );
    },

    findAllTypes: (options: UseQueryOptions<TicketTypeDto[]> = {}) => {
      return useQuery(
        [...QUERY_KEY, 'types'],
        async () => {
          return (await crowdpass.get(`/events/${eventId}/ticketTypes`)).data
            .data as TicketTypeDto[];
        },
        options as any
      );
    },

    findOneType: (
      id?: number,
      options: UseQueryOptions<TicketTypeDto> = {}
    ) => {
      return useQuery(
        [...QUERY_KEY, 'types', id],
        async () => {
          return (await crowdpass.get(`/events/${eventId}/ticketTypes/${id}`))
            .data.data as TicketTypeDto;
        },
        { enabled: Number.isFinite(id), ...(options as any) }
      );
    },
  };
}
