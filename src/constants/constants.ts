import type { KnownError } from '../@types/api/errors.api';
import type { Accessibility, AdditionalService, Order, Role, RoomSort, Rule } from '../@types/data';

export const ADDITIONAL_SERVICES: AdditionalService[] = [
  'dinner',
  'desk',
  'highchair',
  'crib',
  'TV',
  'shampoo',
] as const;

export const ROOM_SORT: RoomSort[] = [
  'price',
  'roomNumber',
  'avgRating',
  'reviewsCount',
  'createAt',
] as const;

export const ACCESSIBILITY: Accessibility[] = ['wideCorridor', 'assistant'] as const;

export const RULES: Rule[] = ['smokeAllowed', 'petsAllowed', 'guestsAllowed'] as const;

export const ROLES: Role[] = ['user', 'admin'] as const;

export const MIN_PRICE = 0;
export const MAX_PRICE = 25000;
export const DEFAULT_STEP = 100;

export const MIN_LOADING_DELAY = 400;

export const DEFAULT_REVIEW_LIMIT = 10;

export const DEFAULT_ROOM_ORDER: Order = 1;
export const DEFAULT_ROOM_SORT: RoomSort = 'createAt';
export const DEFAULT_ROOM_LIMIT = 12;

export const UnknownError: KnownError = {
  status: 500,
  data: { message: 'An unknown error occured' },
};
