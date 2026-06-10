import { beforeEach, describe, expect, it, vi } from 'vitest';

import type { BaseError } from '../@types/api/errors.api';
import type { GetSummaryResponse } from '../@types/api/rating.api';
import type { GetRoomReviewsResponse, ToggleLikeResponse } from '../@types/api/review.api';
import type { GetRoomByIdResponse } from '../@types/api/room.api';
import {
  MONGO_ID_MOCK,
  createAxiosErrorMock,
  createPaginationApiResponseMock,
  createReviewMock,
  createRoomMock,
} from '../__tests__/fixtures/fixtures';
import api from '../api/axiosInstance';
import { DEFAULT_REVIEW_LIMIT } from '../constants/constants';
import { RATING, REVIEW, ROOM } from '../constants/endpoints';
import { setRoomId } from '../slices/roomDetails';

import {
  fetchRatingSummary,
  fetchReviews,
  fetchRoom,
  initRoomDetails,
  toggleLike,
} from './roomDetails.actions';

vi.mock('../api/axiosInstance', () => ({
  default: {
    put: vi.fn(),
    get: vi.fn(),
  },
}));

vi.mock('../slices/roomDetails', () => ({
  setRoomId: vi.fn((id) => ({ type: 'roomDetails/setRoomId', payload: id })),
}));

describe('roomDetails', () => {
  const roomId = MONGO_ID_MOCK;
  const mockState = { roomDetails: { roomId } };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('toggleLike', () => {
    const reviewId = MONGO_ID_MOCK;

    it('should dispatch fulfilled when fetch is successful', async () => {
      const response: ToggleLikeResponse = { reviewId, likeCount: 100, isLiked: true };
      vi.mocked(api.put).mockResolvedValueOnce({ data: response });

      const dispatch = vi.fn();
      const thunk = toggleLike(reviewId);

      const result = await thunk(dispatch, () => ({}), {});

      expect(api.put).toHaveBeenLastCalledWith(REVIEW.TOGGLE_LIKE(reviewId));
      expect(result.type).toBe(toggleLike.fulfilled.type);
      expect(result.payload).toEqual(response);
    });

    it('should dispatch rejected when API returns an error', async () => {
      const errorData: BaseError = { message: 'Bad request' };
      const error = createAxiosErrorMock(errorData, 400);
      vi.mocked(api.put).mockRejectedValueOnce(error);

      const dispatch = vi.fn();
      const thunk = toggleLike(reviewId);

      const result = await thunk(dispatch, () => ({}), {});

      expect(result.type).toBe(toggleLike.rejected.type);
      expect(result.payload).toEqual({ status: 400, data: errorData });
    });
  });

  describe('fetchRoom', () => {
    it('should dispatch fulfilled when fetch is successful', async () => {
      const room: GetRoomByIdResponse = createRoomMock({ id: roomId });
      vi.mocked(api.get).mockResolvedValueOnce({ data: room });

      const dispatch = vi.fn();
      const thunk = fetchRoom();

      const result = await thunk(dispatch, () => mockState, {});

      expect(api.get).toHaveBeenLastCalledWith(ROOM.GET_BY_ID(roomId));
      expect(result.type).toBe(fetchRoom.fulfilled.type);
      expect(result.payload).toEqual(room);
    });

    it('should dispatch rejected when API returns an error', async () => {
      const errorData: BaseError = { message: 'Bad request' };
      const error = createAxiosErrorMock(errorData, 400);
      vi.mocked(api.get).mockRejectedValueOnce(error);

      const dispatch = vi.fn();
      const thunk = fetchRoom();

      const result = await thunk(dispatch, () => mockState, {});

      expect(result.type).toBe(fetchRoom.rejected.type);
      expect(result.payload).toEqual({ status: 400, data: errorData });
    });
  });

  describe('fetchRatingSummary', () => {
    const roomId = MONGO_ID_MOCK;

    it('should dispatch fulfilled when fetch is successful', async () => {
      const summary: GetSummaryResponse = {
        avgScore: 3,
        totalCount: 5,
        scoreBreakdown: { '1': 1, '2': 1, '3': 1, '4': 1, '5': 1 },
      };
      vi.mocked(api.get).mockResolvedValueOnce({ data: summary });

      const dispatch = vi.fn();
      const thunk = fetchRatingSummary();

      const result = await thunk(dispatch, () => mockState, {});

      expect(api.get).toHaveBeenLastCalledWith(RATING.GET_SUMMARY_BY_ROOM_ID(roomId));
      expect(result.type).toBe(fetchRatingSummary.fulfilled.type);
      expect(result.payload).toEqual(summary);
    });

    it('should dispatch rejected when API returns an error', async () => {
      const errorData: BaseError = { message: 'Bad request' };
      const error = createAxiosErrorMock(errorData, 400);
      vi.mocked(api.get).mockRejectedValueOnce(error);

      const dispatch = vi.fn();
      const thunk = fetchRatingSummary();

      const result = await thunk(dispatch, () => mockState, {});

      expect(result.type).toBe(fetchRatingSummary.rejected.type);
      expect(result.payload).toEqual({ status: 400, data: errorData });
    });
  });

  describe('fetchReviews', () => {
    it('should dispatch fulfilled when fetch is successful', async () => {
      const reviews = Array.from({ length: 5 }).map((_, i) => createReviewMock({ id: `rid-${i}` }));
      const paginatedReviews: GetRoomReviewsResponse = createPaginationApiResponseMock(reviews);
      vi.mocked(api.get).mockResolvedValueOnce({ data: paginatedReviews });

      const dispatch = vi.fn();
      const thunk = fetchReviews();

      const result = await thunk(dispatch, () => mockState, {});

      expect(api.get).toHaveBeenLastCalledWith(REVIEW.GET_BY_ROOM_ID(roomId), {
        params: { page: 1, limit: DEFAULT_REVIEW_LIMIT },
      });
      expect(result.type).toBe(fetchReviews.fulfilled.type);
      expect(result.payload).toEqual(paginatedReviews);
    });

    it('should dispatch rejected when API returns an error', async () => {
      const errorData: BaseError = { message: 'Bad request' };
      const error = createAxiosErrorMock(errorData, 400);
      vi.mocked(api.get).mockRejectedValueOnce(error);

      const dispatch = vi.fn();
      const thunk = fetchReviews();

      const result = await thunk(dispatch, () => mockState, {});

      expect(result.type).toBe(fetchReviews.rejected.type);
      expect(result.payload).toEqual({ status: 400, data: errorData });
    });
  });

  describe('initRoomDetails', () => {
    const roomId = MONGO_ID_MOCK;

    it('should dispatch fulfilled when fetch is successful', async () => {
      const dispatch = vi.fn().mockImplementation((action) => {
        if (typeof action === 'function') {
          return {
            unwrap: () => Promise.resolve(),
          };
        }

        return action;
      });

      const thunk = initRoomDetails(roomId);
      const result = await thunk(dispatch, () => ({}), {});

      expect(setRoomId).toHaveBeenCalledWith(roomId);
      expect(dispatch).toHaveBeenCalledTimes(6);
      expect(result.type).toBe(initRoomDetails.fulfilled.type);
      expect(result.payload).toBe(roomId);
    });

    it('should dispatch rejected when one of the fetches fails', async () => {
      const errorData: BaseError = { message: 'Bad request' };
      const error = createAxiosErrorMock(errorData, 400);
      const dispatch = vi.fn().mockImplementation((action) => {
        if (typeof action === 'function') {
          return { unwrap: () => Promise.reject(error) };
        }

        return action;
      });

      const thunk = initRoomDetails(roomId);

      const result = await thunk(dispatch, () => ({}), {});

      expect(dispatch).toHaveBeenCalledWith(
        expect.objectContaining({ type: 'roomDetails/setRoomId', payload: roomId }),
      );
      expect(result.type).toBe(initRoomDetails.rejected.type);
      expect(result.payload).toEqual({ status: 400, data: errorData });
    });
  });
});
