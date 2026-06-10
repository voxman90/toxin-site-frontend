export const BASE_URL = import.meta.env.VITE_SEVER_URL || 'http://localhost:5000';
export const API_V1 = '/api/v1';

export const AUTH = {
  LOGIN: '/auth/login',
  REGISTER: '/auth/register',
} as const;

export const USER = {
  ME: '/users/me',
  GET_BY_ID: (id: string) => `/users/${id}`,
  GET_BY_ID_TEMPLATE: '/users/{id}',
} as const;

export const ROOM = {
  SEARCH: '/rooms/search',
  GET_BY_ID: (id: string) => `/rooms/${id}`,
  GET_BY_ID_TEMPLATE: '/rooms/{id}',
} as const;

export const REVIEW = {
  CREATE: '/reviews',
  GET_BY_ROOM_ID: (roomId: string) => `/reviews/${roomId}`,
  GET_BY_ROOM_ID_TEMPLATE: '/reviews/{roomId}',
  TOGGLE_LIKE: (reviewId: string) => `/reviews/${reviewId}/toggle-like`,
  TOGGLE_LIKE_TEMPLATE: '/reviews/{reviewId}/toggle-like',
} as const;

export const BOOKING = {
  PREVIEW: (roomId: string) => `/bookings/${roomId}/preview`,
  PREVIEW_TEMPLATE: '/bookings/{roomId}/preview',
  CONFIRM: (roomId: string) => `/bookings/${roomId}/confirm`,
  CONFIRM_TEMPLATE: '/bookings/{roomId}/confirm',
} as const;

export const RATING = {
  CREATE: (roomId: string) => `/ratings/${roomId}`,
  CREATE_TEMPLATE: '/ratings/{roomId}',
  GET_SUMMARY_BY_ROOM_ID: (roomId: string) => `/ratings/${roomId}`,
  GET_SUMMARY_BY_ROOM_ID_TEMPLATE: '/ratings/{roomId}',
} as const;
