import { createAsyncThunk } from '@reduxjs/toolkit';

import type { KnownError } from '../@types/api/errors.api';
import type { GetSummaryParams, GetSummaryResponse } from '../@types/api/rating.api';
import type {
  GetRoomReviewsParams,
  GetRoomReviewsRequest,
  GetRoomReviewsResponse,
  ToggleLikeRequest,
  ToggleLikeResponse,
} from '../@types/api/review.api';
import type { GetRoomByIdRequest, GetRoomByIdResponse } from '../@types/api/room.api';
import api from '../api/axiosInstance';
import { DEFAULT_REVIEW_LIMIT } from '../constants/constants';
import { RATING, REVIEW, ROOM } from '../constants/endpoints';
import type { RoomDetailsState } from '../slices/roomDetails';
import { setRoomId } from '../slices/roomDetails';
import { handleAxiosError } from '../utils/handleAxiosError';

const getRoomIdOrThrow = (getState: () => unknown) => {
  const {
    roomDetails: { roomId },
  } = getState() as { roomDetails: RoomDetailsState };

  const error: KnownError = {
    status: 400,
    data: { message: 'roomId not set' },
  };

  if (!roomId) {
    throw error;
  }

  return roomId;
};

export const toggleLike = createAsyncThunk<
  ToggleLikeResponse,
  ToggleLikeRequest,
  { rejectValue: KnownError }
>('roomDetails/toggleLike', async (reviewId, { rejectWithValue }) => {
  try {
    const { data } = await api.put(REVIEW.TOGGLE_LIKE(reviewId));

    return data;
  } catch (error) {
    return handleAxiosError(error, rejectWithValue, { showToast: true });
  }
});

export const fetchRoom = createAsyncThunk<GetRoomByIdResponse, void, { rejectValue: KnownError }>(
  'roomDetails/fetchRoom',
  async (_, { getState, rejectWithValue }) => {
    try {
      const roomId: GetRoomByIdRequest = getRoomIdOrThrow(getState);
      const { data } = await api.get(ROOM.GET_BY_ID(roomId));

      return data;
    } catch (error) {
      return handleAxiosError(error, rejectWithValue);
    }
  },
);

export const fetchRatingSummary = createAsyncThunk<
  GetSummaryResponse,
  void,
  { rejectValue: KnownError }
>('roomDetails/fetchRatingSummary', async (_, { getState, rejectWithValue }) => {
  try {
    const roomId: GetSummaryParams['roomId'] = getRoomIdOrThrow(getState);
    const { data } = await api.get(RATING.GET_SUMMARY_BY_ROOM_ID(roomId));

    return data;
  } catch (error) {
    return handleAxiosError(error, rejectWithValue);
  }
});

export const fetchReviews = createAsyncThunk<
  GetRoomReviewsResponse,
  GetRoomReviewsRequest,
  { rejectValue: KnownError }
>('roomDetails/fetchReviews', async (params = {}, { getState, rejectWithValue }) => {
  try {
    const roomId: GetRoomReviewsParams['roomId'] = getRoomIdOrThrow(getState);
    const { limit = DEFAULT_REVIEW_LIMIT, page = 1, ...query } = params;

    const { data } = await api.get(REVIEW.GET_BY_ROOM_ID(roomId), {
      params: { page, limit, ...query },
    });

    return data;
  } catch (error) {
    return handleAxiosError(error, rejectWithValue);
  }
});

export const initRoomDetails = createAsyncThunk(
  'roomDetails/init',
  async (id: string, { dispatch, rejectWithValue }) => {
    try {
      dispatch(setRoomId(id));

      await Promise.all([
        dispatch(fetchRoom()).unwrap(),
        dispatch(fetchRatingSummary()).unwrap(),
        dispatch(fetchReviews()).unwrap(),
      ]);

      return id;
    } catch (error) {
      return handleAxiosError(error, rejectWithValue);
    }
  },
);
