import { API_V1 } from '../constants/endpoints';

import type { paths } from './api/api';
import type { components } from './api/api';

export type ApiPath<T extends string> = `${typeof API_V1}${T}` extends keyof paths
  ? `${typeof API_V1}${T}`
  : never;

export type Globals = components['schemas'];

// eslint-disable-next-line @typescript-eslint/no-unsafe-function-type, @typescript-eslint/no-explicit-any
export type DeepRequired<T> = T extends Date | RegExp | Function | Error | any[]
  ? T
  : T extends object
    ? { [K in keyof T]-?: DeepRequired<T[K]> }
    : T;
