import type { Globals } from '../utils';

export type ValidationError = Globals['ValidationErrorResponse'];

export type BaseError = Globals['BaseMessageResponse'];

export interface KnownError {
  status: number;
  data: BaseError | ValidationError;
}
