import {
  useMutation,
  UseMutationOptions,
  useQuery,
  UseQueryOptions,
} from '@tanstack/react-query';
import { queryClient } from './useQuery';
import { speedway } from '@/adapters/crowdpass';

export interface RFIDReader {
  mac_address: string;
  name: string;
  csvfile: string;
  eventId: number;
  antennas: {
    port: number;
    gateId: number;
  }[];
}
export interface RFIDReaderHeartbeat {
  mac_address: string;
  heartbeat: number;
}

export function useReadersQuery(eventId: number) {
  const QUERY_KEY = ['useReadersQuery', eventId];
  const invalidate = (keys = [] as (string | number)[]) => {
    return queryClient.invalidateQueries([...QUERY_KEY, ...keys]);
  };
  return {
    invalidate,

    findAll: (options: UseQueryOptions<RFIDReader[]> = {}) => {
      return useQuery(
        [...QUERY_KEY],
        async () => {
          return (await speedway.get(`/readers/${eventId}`))
            .data as RFIDReader[];
        },
        options as any
      );
    },

    findAllHeartbeats: (
      options: UseQueryOptions<RFIDReaderHeartbeat[]> = {}
    ) => {
      return useQuery(
        [...QUERY_KEY, 'findAllHeartbeats'],
        async () => {
          return (await speedway.get(`/readers/${eventId}/heartbeats`))
            .data as RFIDReaderHeartbeat[];
        },
        options as any
      );
    },
  };
}
