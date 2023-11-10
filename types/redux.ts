import {
  AttendeeDevice,
  AttendeeDeviceDto,
  AttendeeDto,
  EventDto,
  PhotoboothSettingsDto,
} from './swagger';

export type EventState = {
  event: EventDto[];
  photoboothSettings: PhotoboothSettingsDto;
  attendees: AttendeeDto[];
  attendeeDevices: AttendeeDevice[];
};

export type ReduxState = {
  event: EventState;
};
