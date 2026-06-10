import { BOOKING } from '../../constants/endpoints';
import type { ApiPath } from '../utils';

import type { paths } from './api';

type FetchPreviewRoute = ApiPath<typeof BOOKING.PREVIEW_TEMPLATE>;

export type FetchBookingPreviewRequest =
  paths[FetchPreviewRoute]['post']['requestBody']['content']['application/json'] &
    paths[FetchPreviewRoute]['post']['parameters']['path'];

export type FetchBookingPreviewResponse =
  paths[FetchPreviewRoute]['post']['responses']['200']['content']['application/json'];

type CreateRoute = ApiPath<typeof BOOKING.CONFIRM_TEMPLATE>;

export type BookingFilters =
  paths[CreateRoute]['post']['requestBody']['content']['application/json'];

export type CreateBookingRequest = BookingFilters &
  paths[CreateRoute]['post']['parameters']['path'];

export type CreateBookingResponse =
  paths[CreateRoute]['post']['responses']['201']['content']['application/json'];
