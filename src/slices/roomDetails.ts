import type { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from '@reduxjs/toolkit';

import type { KnownError } from '../@types/api/errors.api';
import type { IRatingSummary, IReview, IRoom } from '../@types/data';
import {
  fetchRatingSummary,
  fetchReviews,
  fetchRoom,
  toggleLike,
} from '../actions/roomDetails.actions';
import { UnknownError } from '../constants/constants';

export interface RoomDetailsState {
  roomId: string | null;
  room: IRoom | null;
  reviews: IReview[];
  pagination: {
    page: number;
    hasNextPage: boolean;
    totalPages: number;
    totalDocs: number;
  };
  ratingSummary: IRatingSummary | null;
  isLoading: {
    ratingSummary: boolean;
    reviews: boolean;
    room: boolean;
  };
  error: {
    room: KnownError | null;
    reviews: KnownError | null;
    ratingSummary: KnownError | null;
  };
}

const initialState: RoomDetailsState = {
  roomId: '',
  room: null,
  reviews: [],
  pagination: {
    page: 1,
    hasNextPage: false,
    totalPages: 0,
    totalDocs: 0,
  },
  ratingSummary: null,
  isLoading: {
    room: false,
    ratingSummary: false,
    reviews: false,
  },
  error: {
    room: null,
    ratingSummary: null,
    reviews: null,
  },
};

const roomDetailsSlice = createSlice({
  name: 'roomDetails',
  initialState,
  reducers: {
    setRoomId: (_, action: PayloadAction<string>) => ({
      ...initialState,
      roomId: action.payload,
    }),
    toggleLikeLocal: (state, action: PayloadAction<string>) => {
      const review = state.reviews.find((r) => r.id === action.payload);

      if (!review) return;

      review.isLiked = !review.isLiked;

      const newLikeCount = review.likeCount + (review.isLiked ? 1 : -1);
      review.likeCount = newLikeCount <= 0 ? 0 : newLikeCount;
    },
    resetRoomDetails: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchRoom.pending, (state) => {
        state.isLoading.room = true;
        state.error.room = null;
      })
      .addCase(fetchRoom.fulfilled, (state, action) => {
        state.isLoading.room = false;
        state.room = action.payload;
      })
      .addCase(fetchRoom.rejected, (state, action) => {
        state.isLoading.room = false;
        state.error.room = action.payload ?? UnknownError;
      })

      .addCase(fetchReviews.pending, (state) => {
        state.isLoading.reviews = true;
        state.error.reviews = null;
      })
      .addCase(fetchReviews.fulfilled, (state, action) => {
        state.isLoading.reviews = false;

        const newReviews = action.payload.docs.filter(
          (newRev: IReview) => !state.reviews.some((oldRev) => oldRev.id === newRev.id),
        );

        state.reviews = [...state.reviews, ...newReviews];

        state.pagination = {
          page: action.payload.page || 1,
          hasNextPage: action.payload.hasNextPage,
          totalPages: action.payload.totalPages,
          totalDocs: action.payload.totalDocs,
        };
      })
      .addCase(fetchReviews.rejected, (state, action) => {
        state.isLoading.reviews = false;
        state.error.reviews = action.payload ?? UnknownError;
      })

      .addCase(fetchRatingSummary.pending, (state) => {
        state.isLoading.ratingSummary = true;
        state.error.ratingSummary = null;
      })
      .addCase(fetchRatingSummary.fulfilled, (state, action: PayloadAction<IRatingSummary>) => {
        state.isLoading.ratingSummary = false;
        state.ratingSummary = action.payload;
      })
      .addCase(fetchRatingSummary.rejected, (state, action) => {
        state.isLoading.ratingSummary = false;
        state.error.ratingSummary = action.payload ?? UnknownError;
      })

      .addCase(toggleLike.fulfilled, (state, action) => {
        const review = state.reviews.find((r) => r.id === action.payload.reviewId);

        if (review) {
          review.likeCount = action.payload.likeCount;
          review.isLiked = action.payload.isLiked;
        }
      });
  },
});

export const { setRoomId, toggleLikeLocal, resetRoomDetails } = roomDetailsSlice.actions;

export default roomDetailsSlice.reducer;
