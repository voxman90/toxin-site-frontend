const UI_KIT = '/ui-kit';

export const ROUTES = {
  LANDING: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  BOOKING_PATTERN: '/booking/:roomId',
  BOOKING: (roomId: string) => `/booking/${roomId}`,
  SEARCH: '/search',
  UI_KIT,
  CARDS: `${UI_KIT}/cards`,
  HEADERS_AND_FOOTERS: `${UI_KIT}/headers-and-footers`,
  FORM_ELEMENTS: `${UI_KIT}/form-elements`,
  COLORS_AND_TYPES: `${UI_KIT}/colors-and-types`,
};
