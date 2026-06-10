import { createAsyncThunk } from '@reduxjs/toolkit';

import type {
  CreateBookingRequest,
  CreateBookingResponse,
  FetchBookingPreviewRequest,
  FetchBookingPreviewResponse,
} from '../@types/api/booking.api';
import type { KnownError } from '../@types/api/errors.api';
import api from '../api/axiosInstance';
import { MIN_LOADING_DELAY } from '../constants/constants';
import { BOOKING } from '../constants/endpoints';
import { handleAxiosError } from '../utils/handleAxiosError';
import { sleep } from '../utils/utils';

export const fetchBookingPreview = createAsyncThunk<
  FetchBookingPreviewResponse,
  FetchBookingPreviewRequest,
  { rejectValue: KnownError }
>('booking/fetchBookingPreview', async (params, { rejectWithValue }) => {
  try {
    const { roomId, ...requestData } = params;
    const fetchPreview = api.post(BOOKING.PREVIEW(roomId), requestData);

    const { data } = await sleep(fetchPreview, MIN_LOADING_DELAY);

    return data;
  } catch (error) {
    return handleAxiosError(error, rejectWithValue);
  }
});

export const createBooking = createAsyncThunk<
  CreateBookingResponse,
  CreateBookingRequest,
  { rejectValue: KnownError }
>('booking/createBooking', async (params, { rejectWithValue }) => {
  try {
    const { roomId, ...requestData } = params;
    const { data } = await api.post(BOOKING.CONFIRM(roomId), requestData);

    return data;
  } catch (error) {
    return handleAxiosError(error, rejectWithValue);
  }
});
