import { beforeEach, describe, expect, it, vi } from 'vitest';

import type { IRatingSummary, IReview } from '../@types/data';
import {
  createPaginationApiResponseMock,
  createReviewMock,
  createRoomMock,
  knownErrorMock,
} from '../__tests__/fixtures/fixtures';
import {
  fetchRatingSummary,
  fetchReviews,
  fetchRoom,
  toggleLike,
} from '../actions/roomDetails.actions';

import roomDetailReducer, { setRoomId, toggleLikeLocal } from './roomDetails';
import type { RoomDetailsState } from './roomDetails';

type IsLoading = RoomDetailsState['isLoading'];
type Errors = RoomDetailsState['error'];

const createIsLoading = (overrides: Partial<IsLoading> = {}): IsLoading => ({
  room: false,
  ratingSummary: false,
  reviews: false,
  ...overrides,
});

const createErrors = (overrides: Partial<Errors> = {}) => ({
  room: null,
  ratingSummary: null,
  reviews: null,
  ...overrides,
});

const createRatingSummary = (): IRatingSummary => ({
  avgScore: 3,
  totalCount: 5,
  scoreBreakdown: { '1': 1, '2': 1, '3': 1, '4': 1, '5': 1 },
});

const createInitialState = (overrides: Partial<RoomDetailsState> = {}): RoomDetailsState => ({
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
  isLoading: createIsLoading(),
  error: createErrors(),
  ...overrides,
});

const createDirtyState = (overrides: Partial<RoomDetailsState> = {}): RoomDetailsState => ({
  roomId: 'room-id',
  room: createRoomMock({ id: 'room-id' }),
  reviews: [
    createReviewMock({ id: 'rid01' }),
    createReviewMock({ id: 'rid02' }),
    createReviewMock({ id: 'rid03' }),
  ],
  pagination: {
    page: 1,
    hasNextPage: false,
    totalPages: 1,
    totalDocs: 3,
  },
  ratingSummary: createRatingSummary(),
  isLoading: createIsLoading({ room: true }),
  error: createErrors({ reviews: knownErrorMock }),
  ...overrides,
});

describe('search', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return the initial state when passed an empty action', () => {
    const result = roomDetailReducer(undefined, { type: '' });

    expect(result).toEqual(createInitialState());
  });

  describe('reducers', () => {
    it('setRoomId: should reset state to initial and set roomId', () => {
      const roomId = 'fake-id';

      const result = roomDetailReducer(createDirtyState(), setRoomId(roomId));

      expect(result).toEqual(createInitialState({ roomId }));
    });

    it.each([true, false])(
      'toggleLikeLocal: should toggle like and change likeCount [%s]',
      (isLikedInitially) => {
        const targetId = 'tll-id';
        const likeCount = 10;
        const targetReview = createReviewMock({
          id: targetId,
          isLiked: isLikedInitially,
          likeCount,
        });
        const dirtyState = createDirtyState();
        dirtyState.reviews.push(targetReview);

        const result = roomDetailReducer(dirtyState, toggleLikeLocal(targetId));

        expect(result.reviews.find(({ id }) => id === targetId)).toEqual({
          ...targetReview,
          isLiked: !isLikedInitially,
          likeCount: isLikedInitially ? likeCount - 1 : likeCount + 1,
        });
      },
    );

    it('toggleLikeLocal: should not reduce likeCount to negative value', () => {
      const targetId = 'tll-id';
      const targetReview = createReviewMock({
        id: targetId,
        isLiked: true,
        likeCount: 0,
      });
      const dirtyState = createDirtyState();
      dirtyState.reviews.push(targetReview);

      const result = roomDetailReducer(dirtyState, toggleLikeLocal(targetId));

      expect(result.reviews.find(({ id }) => id === targetId)).toEqual({
        ...targetReview,
        isLiked: false,
        likeCount: 0,
      });
    });
  });

  describe('extraReducers (fetchRoom)', () => {
    it('should set isLoading to true when pending', () => {
      const action = { type: fetchRoom.pending.type };
      const state = roomDetailReducer(createInitialState(), action);

      expect(state.isLoading).toEqual(createIsLoading({ room: true }));
    });

    it('should set room when fulfilled', () => {
      const room = createRoomMock();

      const action = { type: fetchRoom.fulfilled.type, payload: room };
      const state = roomDetailReducer(
        createInitialState({ isLoading: createIsLoading({ room: true }) }),
        action,
      );

      expect(state.isLoading).toEqual(createIsLoading());
      expect(state.room).toEqual(room);
    });

    it('should set isLoading to false when rejected', () => {
      const action = { type: fetchRoom.rejected.type, payload: knownErrorMock };
      const state = roomDetailReducer(
        createInitialState({ isLoading: createIsLoading({ room: true }) }),
        action,
      );

      expect(state.isLoading).toEqual(createIsLoading());
    });
  });

  describe('extraReducers (fetchReviews)', () => {
    it('should set isLoading to true when pending', () => {
      const action = { type: fetchReviews.pending.type };
      const state = roomDetailReducer(createInitialState(), action);

      expect(state.isLoading).toEqual(createIsLoading({ reviews: true }));
    });

    it('should set reviews and pagination when fulfilled', () => {
      const reviews = Array.from({ length: 5 }).map((_, i) => createReviewMock({ id: `rid-${i}` }));
      const reviewsPagination = createPaginationApiResponseMock(reviews);

      const action = { type: fetchReviews.fulfilled.type, payload: reviewsPagination };
      const state = roomDetailReducer(
        createInitialState({ isLoading: createIsLoading({ reviews: true }) }),
        action,
      );

      expect(state.isLoading).toEqual(createIsLoading());
      expect(state.reviews).toEqual(reviewsPagination.docs);
      expect(reviewsPagination).toMatchObject(state.pagination);
    });

    it('should add only new reviews when fullfilled', () => {
      const oldReviews = Array.from({ length: 5 }).map((_, i) =>
        createReviewMock({ id: `old-rid-${i}` }),
      );
      const newReviews = Array.from({ length: 5 }).map((_, i) =>
        createReviewMock({ id: `new-rid-${i}` }),
      );
      const finalReviews = [...oldReviews, ...newReviews];
      const payloadReviews = [oldReviews[0], ...newReviews, oldReviews[1]];
      const reviewsPagination = createPaginationApiResponseMock(payloadReviews);

      const action = { type: fetchReviews.fulfilled.type, payload: reviewsPagination };
      const state = roomDetailReducer(
        createInitialState({ isLoading: createIsLoading({ reviews: true }), reviews: oldReviews }),
        action,
      );

      expect(state.isLoading).toEqual(createIsLoading());

      const sortById = (r1: IReview, r2: IReview) => (r1.id < r2.id ? -1 : 1);
      expect(state.reviews.toSorted(sortById)).toEqual(finalReviews.toSorted(sortById));
    });

    it('should set isLoading to false when rejected', () => {
      const action = { type: fetchReviews.rejected.type, payload: knownErrorMock };
      const state = roomDetailReducer(
        createInitialState({ isLoading: createIsLoading({ reviews: true }) }),
        action,
      );

      expect(state.isLoading).toEqual(createIsLoading());
    });
  });

  describe('extraReducers (fetchRatingSummary)', () => {
    it('should set isLoading to true when pending', () => {
      const action = { type: fetchRatingSummary.pending.type };
      const state = roomDetailReducer(createInitialState(), action);

      expect(state.isLoading).toEqual(createIsLoading({ ratingSummary: true }));
    });

    it('should set ratingSummary when fulfilled', () => {
      const ratingSummary = createRatingSummary();

      const action = { type: fetchRatingSummary.fulfilled.type, payload: ratingSummary };
      const state = roomDetailReducer(
        createInitialState({ isLoading: createIsLoading({ ratingSummary: true }) }),
        action,
      );

      expect(state.isLoading).toEqual(createIsLoading());
      expect(state.ratingSummary).toEqual(ratingSummary);
    });

    it('should set isLoading to false when rejected', () => {
      const action = { type: fetchRatingSummary.rejected.type, payload: knownErrorMock };
      const state = roomDetailReducer(
        createInitialState({ isLoading: createIsLoading({ ratingSummary: true }) }),
        action,
      );

      expect(state.isLoading).toEqual(createIsLoading());
    });
  });

  describe('extraReducers (toggleLike)', () => {
    it('should set likeCount and isLiked when fulfilled', () => {
      const targetId = 'target-id';
      const reviews = [createReviewMock({ id: targetId })];
      const action = {
        type: toggleLike.fulfilled.type,
        payload: { isLiked: true, likeCount: 50, reviewId: targetId },
      };
      const state = roomDetailReducer(createInitialState({ reviews }), action);

      const targetReview = state.reviews.find(({ id }) => id === targetId);
      expect(targetReview?.isLiked).toBe(true);
      expect(targetReview?.likeCount).toBe(50);
    });
  });
});
