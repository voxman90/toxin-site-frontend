import { ROOM } from '../../constants/endpoints';
import type { AdditionalService } from '../data';
import type { ApiPath } from '../utils';

import type { paths } from './api';

type GetRoute = ApiPath<typeof ROOM.GET_BY_ID_TEMPLATE>;

export type GetRoomByIdRequest = paths[GetRoute]['get']['parameters']['path']['id'];

export type GetRoomByIdResponse =
  paths[GetRoute]['get']['responses']['200']['content']['application/json'];

type SearchRoute = ApiPath<typeof ROOM.SEARCH>;

export type SearchRoomsQuery = paths[SearchRoute]['get']['parameters']['query'] & {
  additionalServices: AdditionalService[];
};

export type SearchRoomsFilters = Omit<SearchRoomsQuery, 'page' | 'limit' | 'order' | 'sort'>;

export type BaseSearchRoomsFilters = Omit<
  SearchRoomsFilters,
  'rules' | 'accessibility' | 'amenities' | 'minPrice' | 'maxPrice' | 'additionalServices'
>;

export type SearchRoomsResponse =
  paths[SearchRoute]['get']['responses']['200']['content']['application/json'];
