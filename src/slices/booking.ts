import { createSlice } from '@reduxjs/toolkit';

import type { KnownError } from '../@types/api/errors.api';
import type { IPriceSummary } from '../@types/data';
import { createBooking, fetchBookingPreview } from '../actions/booking.actions';
import { UnknownError } from '../constants/constants';

export interface BookingState {
  details: IPriceSummary;
  isLoading: boolean;
  error: {
    preview: KnownError | null;
    submit: KnownError | null;
  };
}

const initialState: BookingState = {
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
};

const bookingSlice = createSlice({
  name: 'booking',
  initialState,
  reducers: {
    resetBooking: () => initialState,
    clearErrors: (prev) => ({
      ...prev,
      error: { preview: null, submit: null },
    }),
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchBookingPreview.pending, (state) => {
        state.isLoading = true;
        state.error.preview = null;
      })
      .addCase(fetchBookingPreview.fulfilled, (state, action) => {
        state.isLoading = false;
        state.details = action.payload;
      })
      .addCase(fetchBookingPreview.rejected, (state, action) => {
        state.isLoading = false;
        state.error.preview = action.payload ?? UnknownError;
      })

      .addCase(createBooking.pending, (state) => {
        state.isLoading = true;
        state.error.submit = null;
      })
      .addCase(createBooking.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(createBooking.rejected, (state, action) => {
        state.isLoading = false;
        state.error.submit = action.payload ?? UnknownError;
      });
  },
});

export const { resetBooking, clearErrors } = bookingSlice.actions;

export default bookingSlice.reducer;
