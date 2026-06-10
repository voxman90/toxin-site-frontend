import { REVIEW } from '../../constants/endpoints';
import type { ApiPath } from '../utils';

import type { paths } from './api';

type CreateRoute = ApiPath<typeof REVIEW.CREATE>;

export type CreateReviewRequest =
  paths[CreateRoute]['post']['requestBody']['content']['application/json'];

export type CreateReviewResponse =
  paths[CreateRoute]['post']['responses']['201']['content']['application/json'];

type GetRoomReviewsRoute = ApiPath<typeof REVIEW.GET_BY_ROOM_ID_TEMPLATE>;

export type GetRoomReviewsParams = paths[GetRoomReviewsRoute]['get']['parameters']['path'];

export type GetRoomReviewsRequest = paths[GetRoomReviewsRoute]['get']['parameters']['query'];

export type GetRoomReviewsResponse =
  paths[GetRoomReviewsRoute]['get']['responses']['200']['content']['application/json'];

type ToggleLikeRoute = ApiPath<typeof REVIEW.TOGGLE_LIKE_TEMPLATE>;

export type ToggleLikeRequest = paths[ToggleLikeRoute]['put']['parameters']['path']['reviewId'];

export type ToggleLikeResponse =
  paths[ToggleLikeRoute]['put']['responses']['200']['content']['application/json'];
