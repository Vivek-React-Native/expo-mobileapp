import crowdpass from '@/adapters/crowdpass';
import {
  CompanyDto,
  EventAttendeeDto,
  PublicEventAttendeeDto,
  ScanContactCardDto as ScanContactCard,
  TeammateDto,
  TicketDto,
  TicketOrderDto,
  UserDto,
} from '@/types/swagger';
import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { queryClient } from './useQuery';

export interface ScanContactCardDto extends ScanContactCard {
  id: number;
  eventId: number;
  scannedAttendeeId: number;
  attendee: PublicEventAttendeeDto;
}

export function useCurrentQuery() {
  const QUERY_KEY = ['useCurrentQuery'];
  const invalidate = (keys = [] as (string | number)[]) => {
    return queryClient.invalidateQueries([...QUERY_KEY, ...keys]);
  };
  return {
    invalidate,

    findAllEvents: (options: UseQueryOptions<EventAttendeeDto[]> = {}) => {
      return useQuery(
        [...QUERY_KEY, 'findAllEvents'],
        async () => {
          return (await crowdpass.get(`/attendees/current/events`)).data
            .data as EventAttendeeDto[];
        },
        options as any
      );
    },

    findOneEvent: (
      publicId?: string,
      options: UseQueryOptions<EventAttendeeDto> = {}
    ) => {
      return useQuery(
        [...QUERY_KEY, 'findOneEvent', publicId],
        async () => {
          return (await crowdpass.get(`/attendees/current/event/${publicId}`))
            .data.data as EventAttendeeDto;
        },
        { enabled: !!publicId, ...(options as any) }
      );
    },

    findAllTickets: (options: UseQueryOptions<TicketDto[]> = {}) => {
      return useQuery(
        [...QUERY_KEY, 'findAllTickets'],
        async () => {
          return (await crowdpass.get(`/attendees/current/tickets`)).data
            .data as TicketDto[];
        },
        options as any
      );
    },

    findAllOrders: (options: UseQueryOptions<TicketOrderDto[]> = {}) => {
      return useQuery(
        [...QUERY_KEY, 'findAllOrders'],
        async () => {
          return (await crowdpass.get(`/attendees/current/ticketOrders`)).data
            .data as TicketOrderDto[];
        },
        options as any
      );
    },

    findOneOrder: (
      publicId?: string,
      options: UseQueryOptions<TicketOrderDto> = {}
    ) => {
      return useQuery(
        [...QUERY_KEY, 'findOneOrder', publicId],
        async () => {
          return (
            await crowdpass.get(`/attendees/current/ticketOrders/${publicId}`)
          ).data.data as TicketOrderDto;
        },
        { enabled: !!publicId, ...(options as any) }
      );
    },

    findUser: (options: UseQueryOptions<UserDto> = {}) => {
      return useQuery(
        [...QUERY_KEY, 'findUser'],
        async () => {
          return (await crowdpass.get(`/users/current`)).data.data as UserDto;
        },
        options as any
      );
    },

    findCompany: (options: UseQueryOptions<CompanyDto> = {}) => {
      return useQuery(
        [...QUERY_KEY, 'findCompany'],
        async () => {
          return (await crowdpass.get(`/companies/current`)).data
            .data as CompanyDto;
        },
        options as any
      );
    },

    findAllTeammates: (options: UseQueryOptions<TeammateDto[]> = {}) => {
      return useQuery(
        [...QUERY_KEY, 'findAllTeammates'],
        async () => {
          return (
            await crowdpass.get(`/teammates`, {
              params: { pageSize: 9999 },
            })
          ).data.data as TeammateDto[];
        },
        options as any
      );
    },

    findAllContactCards: (
      eventId?: number,
      options: UseQueryOptions<ScanContactCardDto[]> = {}
    ) => {
      return useQuery(
        [...QUERY_KEY, 'findAllContactCards', eventId],
        async () => {
          return (
            await crowdpass.get(
              `/attendees/current/scanned-contact-cards/${eventId}`
            )
          ).data.data as ScanContactCardDto[];
        },
        { enabled: Number.isFinite(eventId), ...(options as any) }
      );
    },
  };
}
