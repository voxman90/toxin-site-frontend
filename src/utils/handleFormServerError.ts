import type { Control, FieldPath, FieldValues, UseFormSetError } from 'react-hook-form';
import { toast } from 'react-toastify';

import { isKnownError } from './utils';

interface HandleServerErrorOptions<T extends FieldValues = FieldValues> {
  err: unknown;
  setError: UseFormSetError<T>;
  control: Control<T>;
  defaultErrorMessage: string;
  onUnauthorized?: () => void;
}

export const handleFormServerError = <T extends FieldValues>({
  err,
  setError,
  control,
  defaultErrorMessage,
  onUnauthorized,
}: HandleServerErrorOptions<T>): void => {
  if (!isKnownError(err)) {
    toast.error(defaultErrorMessage);
    return;
  }

  if (err.status === 401 && onUnauthorized) {
    onUnauthorized();
    return;
  }

  const errorData = err.data;
  if (err.status === 400 && 'errors' in errorData && Array.isArray(errorData.errors)) {
    const registeredFields = control._names.mount;

    errorData.errors.forEach((fieldErr) => {
      const targetField = fieldErr.field.split('.')[0] as FieldPath<T>;

      if (registeredFields.has(targetField)) {
        setError(targetField, {
          type: 'server',
          message: fieldErr.message,
        });
      } else {
        toast.error(fieldErr.message);
      }
    });

    return;
  }

  toast.error(errorData.message || defaultErrorMessage);
};
