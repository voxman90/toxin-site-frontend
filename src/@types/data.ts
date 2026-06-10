import type { SearchRoomsQuery } from './api/room.api';
import type { Globals } from './utils';

export type IRoom = Globals['Room'];

export type IPaginatedRooms = Globals['PaginatedRooms'];

export type Rule = IRoom['rules'][number];

export type Accessibility = IRoom['accessibility'][number];

export type Amenity = keyof NonNullable<SearchRoomsQuery['amenities']>;

export type Guest = keyof NonNullable<SearchRoomsQuery['guests']>;

export type RoomSort = NonNullable<SearchRoomsQuery['sort']>;

export type Order = 1 | -1;

export type IReview = Globals['Review'];

export type IPaginatedReviews = Globals['PaginatedReviews'];

export type IUser = Globals['User'];

export type Role = IUser['role'];

export type IBooking = Globals['Booking'];

export type IPriceSummary = Globals['PriceSummary'];

export type AdditionalService = IBooking['additionalServices'][number];

export type IRatingSummary = Globals['RatingSummary'];

export type Score = keyof Required<IRatingSummary['scoreBreakdown']>;

export type Paginated<T> = { docs: T[] } & Omit<IPaginatedRooms, 'docs'>;
