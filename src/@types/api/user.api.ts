import { USER } from '../../constants/endpoints';
import type { ApiPath } from '../utils';

import type { paths } from './api';

type GetUserRoute = ApiPath<typeof USER.GET_BY_ID_TEMPLATE>;

export type GetUserByIdParams = paths[GetUserRoute]['get']['parameters']['path'];

export type GetUserByIdResponse =
  paths[GetUserRoute]['get']['responses']['200']['content']['application/json'];

type MeRoute = ApiPath<typeof USER.ME>;

export type GetMeResponse =
  paths[MeRoute]['get']['responses']['200']['content']['application/json'];
