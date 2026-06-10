import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import type {
  CreateBookingRequest,
  CreateBookingResponse,
  FetchBookingPreviewRequest,
  FetchBookingPreviewResponse,
} from '../@types/api/booking.api';
import type { BaseError } from '../@types/api/errors.api';
import {
  MONGO_ID_MOCK,
  createAxiosErrorMock,
  createBookingMock,
  createPriceSummaryMock,
} from '../__tests__/fixtures/fixtures';
import api from '../api/axiosInstance';
import { BOOKING } from '../constants/endpoints';

import { createBooking, fetchBookingPreview } from './booking.actions';

vi.mock('../api/axiosInstance', () => ({
  default: {
    post: vi.fn(),
  },
}));

describe('bookingAction', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe('fetchBookingPreview', () => {
    const requestData: FetchBookingPreviewRequest = {
      roomId: MONGO_ID_MOCK,
      checkIn: '2030-07-02T00:00:00Z',
      checkOut: '2030-07-04T00:00:00Z',
      guests: { adult: 1, child: 0, baby: 0 },
      additionalServices: [],
    };

    const responseData: FetchBookingPreviewResponse = createPriceSummaryMock();

    it('should dispatch fulfilled when request is successful', async () => {
      vi.mocked(api.post).mockResolvedValueOnce({ data: responseData });

      const dispatch = vi.fn();
      const thunk = fetchBookingPreview(requestData);

      const thunkPromise = thunk(dispatch, () => ({}), {});

      await vi.runAllTimersAsync();

      const result = await thunkPromise;

      const { roomId, ...data } = requestData;
      expect(api.post).toHaveBeenCalledWith(BOOKING.PREVIEW(roomId), data);
      expect(result.type).toBe(fetchBookingPreview.fulfilled.type);
      expect(result.payload).toEqual(responseData);
    }, 50);

    it('should dispatch rejected when API returns an error', async () => {
      const errorData: BaseError = { message: 'Bad request' };
      const error = createAxiosErrorMock(errorData, 400);

      vi.mocked(api.post).mockRejectedValueOnce(error);

      const dispatch = vi.fn();
      const thunk = fetchBookingPreview(requestData);

      const result = await thunk(dispatch, () => ({}), {});

      expect(result.type).toBe(fetchBookingPreview.rejected.type);
      expect(result.payload).toEqual({ status: 400, data: errorData });
    });
  });

  describe('createBooking', () => {
    const requestData: CreateBookingRequest = {
      roomId: MONGO_ID_MOCK,
      checkIn: '2030-07-02T00:00:00Z',
      checkOut: '2030-07-04T00:00:00Z',
      guests: { adult: 1, child: 0, baby: 0 },
      additionalServices: [],
    };

    const responseData: CreateBookingResponse = createBookingMock();

    it('should dispatch fulfilled when request is successful', async () => {
      vi.mocked(api.post).mockResolvedValueOnce({ data: responseData });

      const dispatch = vi.fn();
      const thunk = createBooking(requestData);

      const result = await thunk(dispatch, () => ({}), {});

      const { roomId, ...data } = requestData;
      expect(api.post).toHaveBeenCalledWith(BOOKING.CONFIRM(roomId), data);
      expect(result.type).toBe(createBooking.fulfilled.type);
      expect(result.payload).toEqual(responseData);
    });

    it('should dispatch rejected when API returns an error', async () => {
      const errorData = { message: 'Bad request' };
      const error = createAxiosErrorMock(errorData, 400);
      vi.mocked(api.post).mockRejectedValueOnce(error);

      const dispatch = vi.fn();
      const thunk = createBooking(requestData);

      const result = await thunk(dispatch, () => ({}), {});

      expect(result.type).toBe(createBooking.rejected.type);
      expect(result.payload).toEqual({ status: 400, data: errorData });
    });
  });
});
