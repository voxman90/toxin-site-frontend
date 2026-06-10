import { beforeEach, describe, expect, it, vi } from 'vitest';

import type { IPaginatedRooms } from '../@types/data';
import {
  createPaginationApiResponseMock,
  createRoomMock,
  knownErrorMock,
} from '../__tests__/fixtures/fixtures';
import { fetchRooms } from '../actions/searchActions';

import type { SearchState } from './search';
import searchReducer, { clearSearch } from './search';

const createInitialState = (overrides: Partial<SearchState> = {}): SearchState => ({
  rooms: [],
  pagination: {
    totalPages: 0,
    roomsPerPage: 0,
    totalRooms: 0,
  },
  isLoading: false,
  error: null,
  ...overrides,
});

const createDirtyState = (overrides: Partial<SearchState> = {}): SearchState => ({
  rooms: [createRoomMock()],
  pagination: {
    totalPages: 10,
    roomsPerPage: 12,
    totalRooms: 120,
  },
  isLoading: false,
  error: knownErrorMock,
  ...overrides,
});

describe('search', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return the initial state when passed an empty action', () => {
    const result = searchReducer(undefined, { type: '' });

    expect(result).toEqual(createInitialState());
  });

  describe('reducers', () => {
    it('should handle clearSearch', () => {
      const result = searchReducer(createDirtyState(), clearSearch());

      expect(result).toEqual(createInitialState());
    });
  });

  describe('extraReducers (fetchRooms)', () => {
    it('should set isLoading to true when pending', () => {
      const action = { type: fetchRooms.pending.type };
      const state = searchReducer(createInitialState(), action);

      expect(state.isLoading).toBe(true);
    });

    it('should set rooms and pagination when fulfilled', () => {
      const dirtyState = createDirtyState();
      const roomsPagination: IPaginatedRooms = createPaginationApiResponseMock(
        dirtyState['rooms'],
        {
          limit: dirtyState['pagination'].roomsPerPage,
          totalDocs: dirtyState['pagination'].totalRooms,
          totalPages: dirtyState['pagination'].totalPages,
        },
      );
      const action = { type: fetchRooms.fulfilled.type, payload: roomsPagination };
      const state = searchReducer(createInitialState({ isLoading: true }), action);

      expect(state.isLoading).toBe(false);
      expect(state.pagination).toEqual(dirtyState['pagination']);
      expect(state.rooms).toEqual(dirtyState['rooms']);
    });

    it('should set isLoading to false when rejected but not aborted', () => {
      const action = {
        type: fetchRooms.rejected.type,
        payload: knownErrorMock,
        meta: { aborted: false },
      };
      const state = searchReducer(createInitialState({ isLoading: true }), action);

      expect(state.isLoading).toBe(false);
    });

    it('should keep isLoading as true when aborted', () => {
      const action = {
        type: fetchRooms.rejected.type,
        meta: { aborted: true },
      };
      const state = searchReducer(createInitialState({ isLoading: true }), action);

      expect(state.isLoading).toBe(true);
    });
  });
});
