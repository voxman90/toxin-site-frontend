import { RATING } from '../../constants/endpoints';
import type { ApiPath } from '../utils';

import type { paths } from './api';

type CreateRoute = ApiPath<typeof RATING.CREATE_TEMPLATE>;

export type CreateRatingRequest =
  paths[CreateRoute]['post']['requestBody']['content']['application/json'] &
    paths[CreateRoute]['post']['parameters']['path'];

export type CreateRatingResponse =
  paths[CreateRoute]['post']['responses']['201']['content']['application/json'];

type GetSummaryRoute = ApiPath<typeof RATING.GET_SUMMARY_BY_ROOM_ID_TEMPLATE>;

export type GetSummaryParams = paths[GetSummaryRoute]['post']['parameters']['path'];

export type GetSummaryResponse =
  paths[GetSummaryRoute]['get']['responses']['200']['content']['application/json'];
