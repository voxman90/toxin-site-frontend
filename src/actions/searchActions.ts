import { createAsyncThunk } from '@reduxjs/toolkit';

import type { KnownError } from '../@types/api/errors.api';
import type { SearchRoomsQuery, SearchRoomsResponse } from '../@types/api/room.api';
import api from '../api/axiosInstance';
import { MIN_LOADING_DELAY } from '../constants/constants';
import { ROOM } from '../constants/endpoints';
import { handleAxiosError } from '../utils/handleAxiosError';

export const fetchRooms = createAsyncThunk<
  SearchRoomsResponse,
  SearchRoomsQuery,
  { rejectValue: KnownError }
>('search/fetchRooms', async (filters, { rejectWithValue, signal }) => {
  try {
    const delayPromise = new Promise((resolve) => {
      const timeoutId = setTimeout(resolve, MIN_LOADING_DELAY);

      signal.addEventListener('abort', () => {
        clearTimeout(timeoutId);
      });
    });

    const fetchRooms = api.get(ROOM.SEARCH, { params: filters, signal });

    const [response] = await Promise.all([fetchRooms, delayPromise]);

    return response.data;
  } catch (error) {
    return handleAxiosError(error, rejectWithValue);
  }
});
