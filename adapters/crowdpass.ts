import axios from 'axios';
import { create } from 'zustand';
import { combine } from 'zustand/middleware';
import { STATUS_TEXT } from './http_status';

const useToken = create(
  combine({ token: '' }, (set) => ({
    setToken: (token: string) => set({ token }),
  }))
);

const crowdpass = axios.create({
  baseURL: process.env['NX_URI'],
  headers: {
    // 'Accept': 'application/json',
    'Timezone-Offset': -(new Date().getTimezoneOffset() / 60),
  },
});
crowdpass.interceptors.request.use((config) => {
  config.headers.Authorization = `Bearer ${useToken.getState().token}`;
  return config;
});
crowdpass.interceptors.response.use(null, (error) => {
  if (axios.isAxiosError(error)) {
    // Sentry.Native.captureException(error);
    let message = error.response?.data?.errorMessage as string;
    message ||= error.response?.statusText;
    message ||= STATUS_TEXT[error.response?.status];
    error.message = message || error.message;
  }
  return Promise.reject(error);
});

export const fareharbor = axios.create({
  baseURL: process.env['NX_FAREHARBOR_URI'],
});
fareharbor.interceptors.request.use((config) => {
  config.headers.Authorization = `Bearer ${useToken.getState().token}`;
  return config;
});

export const speedway = axios.create({
  baseURL: process.env['NX_SPEEDWAY_URI'],
});
speedway.interceptors.request.use((config) => {
  config.headers.Authorization = `Bearer ${useToken.getState().token}`;
  return config;
});

export default Object.assign(crowdpass, {
  useToken,
  public: axios.create({
    baseURL: process.env['NX_PUBLIC_URI'],
    headers: crowdpass.defaults.headers,
  }),
});
