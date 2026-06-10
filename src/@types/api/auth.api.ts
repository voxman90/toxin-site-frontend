import { AUTH } from '../../constants/endpoints';
import type { ApiPath } from '../utils';

import type { paths } from './api';

type RegisterRoute = ApiPath<typeof AUTH.REGISTER>;

export type RegisterRequest =
  paths[RegisterRoute]['post']['requestBody']['content']['application/json'];

export type RegisterData = RegisterRequest & { passwordConfirm: string };

export type RegisterResponse =
  paths[RegisterRoute]['post']['responses']['201']['content']['application/json'];

type LoginRoute = ApiPath<typeof AUTH.LOGIN>;

export type LoginRequest = paths[LoginRoute]['post']['requestBody']['content']['application/json'];

export type LoginResponse =
  paths[LoginRoute]['post']['responses']['200']['content']['application/json'];
