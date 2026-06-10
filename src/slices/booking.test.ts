import { beforeEach, describe, expect, it, vi } from 'vitest';

import type { FetchBookingPreviewResponse } from '../@types/api/booking.api';
import { createPriceSummaryMock, knownErrorMock } from '../__tests__/fixtures/fixtures';
import { createBooking, fetchBookingPreview } from '../actions/booking.actions';

import type { BookingState } from './booking';
import bookingReducer, { clearErrors, resetBooking } from './booking';

const createInititalState = (override: Partial<BookingState> = {}): BookingState => ({
  details: {
    nights: 0,
    discount: 0,
    basePrice: 0,
    pricePerNight: 0,
    servicePrice: 0,
    additionalServicePrice: 0,
    additionalServiceSummary: {},
    totalPrice: 0,
  },
  isLoading: false,
  error: {
    preview: null,
    submit: null,
  },
  ...override,
});

const createDirtyState = (override: Partial<BookingState> = {}): BookingState => ({
  details: createPriceSummaryMock(),
  isLoading: false,
  error: {
    preview: { status: 400, data: { message: 'Bad request' } },
    submit: null,
  },
  ...override,
});

describe('booking', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return the initial state when passed an empty action', () => {
    const result = bookingReducer(undefined, { type: '' });

    expect(result).toEqual(createInititalState());
  });

  describe('reducers', () => {
    it('should handle resetBooking', () => {
      const result = bookingReducer(createDirtyState(), resetBooking());

      expect(result).toEqual(createInititalState());
    });

    it('should handle clearErrors', () => {
      const result = bookingReducer(createDirtyState(), clearErrors());

      expect(result.error).toEqual({
        preview: null,
        submit: null,
      });
    });
  });

  describe('extraReducers (fetchBookingPreview)', () => {
    it('should set isLoading to true and reset error when pending', () => {
      const action = { type: fetchBookingPreview.pending.type };
      const state = bookingReducer(createInititalState(), action);

      expect(state.isLoading).toBe(true);
      expect(state.error.preview).toBe(null);
    });

    it('should set details when fulfilled', () => {
      const response: FetchBookingPreviewResponse = createPriceSummaryMock();
      const action = { type: fetchBookingPreview.fulfilled.type, payload: response };
      const state = bookingReducer(createInititalState({ isLoading: true }), action);

      expect(state.isLoading).toBe(false);
      expect(state.details).toEqual(response);
    });

    it('should set isLoading to false and set error when rejected', () => {
      const action = { type: fetchBookingPreview.rejected.type, payload: knownErrorMock };
      const state = bookingReducer(createInititalState({ isLoading: true }), action);

      expect(state.isLoading).toBe(false);
      expect(state.error.preview).toEqual(knownErrorMock);
      expect(state.error.submit).toEqual(null);
    });
  });

  describe('extraReducers (createBooking)', () => {
    it('should set isLoading to true and reset error when pending', () => {
      const action = { type: createBooking.pending.type };
      const state = bookingReducer(createInititalState(), action);

      expect(state.isLoading).toBe(true);
      expect(state.error.submit).toBe(null);
    });

    it('should set isLoading to false when fullfiled', () => {
      const action = { type: createBooking.fulfilled.type };
      const state = bookingReducer(createInititalState({ isLoading: true }), action);

      expect(state.isLoading).toBe(false);
    });

    it('should set isLoading to false and set error when rejected', () => {
      const action = { type: createBooking.rejected.type, payload: knownErrorMock };
      const state = bookingReducer(createInititalState({ isLoading: true }), action);

      expect(state.isLoading).toBe(false);
      expect(state.error.preview).toEqual(null);
      expect(state.error.submit).toEqual(knownErrorMock);
    });
  });
});
