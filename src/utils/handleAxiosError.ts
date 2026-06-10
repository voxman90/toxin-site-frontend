import axios from 'axios';
import { toast } from 'react-toastify';

import type { BaseError, KnownError } from '../@types/api/errors.api';

interface HandleAxiosErrorOptions {
  showToast?: boolean;
}

const isExtendsBaseError = <T extends BaseError>(data: unknown): data is T => {
  return (
    typeof data === 'object' &&
    data !== null &&
    'message' in data &&
    typeof data.message === 'string'
  );
};

export const handleAxiosError = (
  error: unknown,
  rejectWithValue: (value: KnownError) => unknown,
  options: HandleAxiosErrorOptions = { showToast: false },
) => {
  let displayMessage = 'Unknown network error';
  let status = 500;
  let responseData: unknown = null;

  if (axios.isAxiosError(error) && error.response) {
    status = error.response.status;
    responseData = error.response.data;

    if (isExtendsBaseError(responseData)) {
      displayMessage = responseData.message;
    } else {
      displayMessage = error.response?.statusText ?? `Server error (${status})`;
    }
  }

  if (options.showToast) {
    toast.error(displayMessage);
  }

  return rejectWithValue({
    status,
    data: responseData ? responseData : { message: displayMessage },
  } as KnownError);
};
