import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  event: {},
  eventId: '',
  attendees: [],
  attendeeDevices: [],
  photoboothSettings: {},
};

export const eventSlice = createSlice({
  name: 'event',
  initialState,
  reducers: {
    setEvent: (state, action) => {
      state.event = action.payload;
    },
    setPhotoboothSettings: (state, action) => {
      state.photoboothSettings = action.payload;
    },
    setEventId: (state, action) => {
      state.eventId = action.payload;
    },
    setAttendees: (state, action) => {
      state.attendees = action.payload;
    },
    setAttendeeDevices: (state, action) => {
      state.attendeeDevices = action.payload;
    },
  },
});
export const eventActions = eventSlice.actions;

export default eventSlice.reducer;
