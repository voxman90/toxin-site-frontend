import type { BaseError, KnownError } from '../../@types/api/errors.api';
import type { IBooking, IPriceSummary, IReview, IRoom, IUser, Paginated } from '../../@types/data';
import { ACCESSIBILITY, RULES } from '../../constants/constants';

export const MONGO_ID_MOCK = '5d7a4c2e8b1f6a390e4d2c1b';

export const createRoomMock = (overrides: Partial<IRoom> = {}): IRoom => ({
  id: '6a26399912f45ea285cd81b2',
  roomNumber: 999,
  isLuxe: true,
  price: 10000,
  capacity: 2,
  accessibility: [ACCESSIBILITY[0]],
  rules: [RULES[0]],
  bedroom: 1,
  bed: 1,
  bathroom: 1,
  isAvailable: true,
  images: [],
  avgRating: 4,
  reviewsCount: 10,
  createdAt: '2030-07-01T00:00:00Z',
  updatedAt: '2030-07-02T00:00:00Z',
  ...overrides,
});

export const createReviewMock = (overrides: Partial<IReview> = {}): IReview => ({
  id: '6a263999b915fabc988d06ee',
  authorName: 'Max',
  createdAt: '2030-07-01T00:00:00Z',
  text: 'lorem ipsum',
  likeCount: 15,
  isLiked: true,
  avatarUrl: '',
  ...overrides,
});

export const createUserMock = (overrides: Partial<IUser> = {}): IUser => ({
  id: '6263f7b2e4b09d2a3f8c14a2',
  firstName: 'Max',
  lastName: 'Y',
  birthdate: new Date(2000, 0, 1).toISOString(),
  email: 'test@test.com',
  gender: 'Male',
  role: 'user',
  specialOffer: true,
  avatarUrl: '',
  createdAt: '2030-07-01T00:00:00Z',
  updatedAt: '2030-07-02T00:00:00Z',
  ...overrides,
});

export const createPriceSummaryMock = (overrides: Partial<IPriceSummary> = {}): IPriceSummary => ({
  nights: 10,
  discount: 2000,
  pricePerNight: 1000,
  basePrice: 10000,
  servicePrice: 3000,
  additionalServicePrice: 5000,
  additionalServiceSummary: {
    dinner: 100,
    crib: 300,
    highchair: 400,
  },
  totalPrice: 1000000,
  ...overrides,
});

export const createBookingMock = (overrides: Partial<IBooking> = {}): IBooking => ({
  id: '4f61746865616e6463616e64',
  user: '6a260600916f6f81cd61f75e',
  room: '6a2639996399ba83814fbbe9',
  checkIn: '2030-07-01T00:00:00Z',
  checkOut: '2030-07-02T00:00:00Z',
  guests: {
    adult: 1,
    child: 0,
    baby: 0,
  },
  additionalServices: [],
  priceSummary: createPriceSummaryMock(),
  createdAt: '2030-07-01T00:00:00Z',
  updatedAt: '2030-07-01T00:00:00Z',
  ...overrides,
});

export const createPaginationApiResponseMock = <T>(
  docs: T[] = [],
  overrides: Partial<Paginated<T>> = {},
): Paginated<T> => ({
  docs,
  totalDocs: docs.length * 5,
  limit: docs.length,
  page: 2,
  totalPages: 5,
  pagingCounter: docs.length + 1,
  hasPrevPage: true,
  hasNextPage: true,
  prevPage: null,
  nextPage: null,
  ...overrides,
});

export const createAxiosErrorMock = <T extends BaseError>(
  data: T,
  status = 400,
  statusText = 'Bad Request',
) => ({
  isAxiosError: true,
  response: {
    status,
    statusText,
    headers: { 'content-type': 'application/json; charset=utf-8' },
    data,
  },
});

export const knownErrorMock: KnownError = {
  status: 400,
  data: { message: 'Bad request' },
};
