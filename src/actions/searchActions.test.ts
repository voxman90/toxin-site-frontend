// @vitest-environment happy-dom
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import type { BaseError } from '../@types/api/errors.api';
import type { SearchRoomsQuery } from '../@types/api/room.api';
import {
  createAxiosErrorMock,
  createPaginationApiResponseMock,
  createRoomMock,
} from '../__tests__/fixtures/fixtures';
import api from '../api/axiosInstance';
import { MIN_LOADING_DELAY } from '../constants/constants';
import { ROOM } from '../constants/endpoints';

import { fetchRooms } from './searchActions';

vi.mock('../api/axiosInstance', () => ({
  default: {
    get: vi.fn(),
  },
}));

const filterParams: SearchRoomsQuery = {
  checkIn: '2030-07-01T00:00:00Z',
  checkOut: '2030-07-01T00:00:00Z',
  guests: {
    adult: 1,
    child: 1,
    baby: 0,
  },
  minPrice: 0,
  maxPrice: 10000,
  rules: [],
  additionalServices: [],
  accessibility: [],
  amenities: {
    bed: 1,
    bedroom: 1,
    bathroom: 0,
  },
  page: 1,
};

describe('searchAction', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe('fetchRooms', () => {
    it('should dispatch fulfilled when fetch is successful', async () => {
      vi.useFakeTimers();

      const rooms = Array.from({ length: 5 }).map((_, i) => createRoomMock({ id: `rid-${i}` }));
      const paginatedRooms = createPaginationApiResponseMock(rooms);
      vi.mocked(api.get).mockResolvedValueOnce({ data: paginatedRooms });

      const dispatch = vi.fn();
      const thunk = fetchRooms(filterParams);

      const thunkPromise = thunk(dispatch, () => ({}), {});

      await vi.advanceTimersByTimeAsync(MIN_LOADING_DELAY);

      const result = await thunkPromise;

      expect(api.get).toHaveBeenLastCalledWith(ROOM.SEARCH, {
        params: filterParams,
        signal: expect.any(AbortSignal),
      });
      expect(result.type).toBe(fetchRooms.fulfilled.type);
      expect(result.payload).toEqual(paginatedRooms);
    });

    it('should dispatch rejected when fetch fails with server error', async () => {
      const errorData: BaseError = { message: 'Bad request' };
      const error = createAxiosErrorMock(errorData, 400);
      vi.mocked(api.get).mockRejectedValueOnce(error);

      const dispatch = vi.fn();
      const thunk = fetchRooms(filterParams);

      const thunkPromise = thunk(dispatch, () => ({}), {});

      const result = await thunkPromise;

      expect(result.type).toBe(fetchRooms.rejected.type);
      expect(result.payload).toEqual({ status: 400, data: errorData });
    });
  });
});
