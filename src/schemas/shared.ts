import * as yup from 'yup';

export const extractDateString = (required: string) =>
  yup
    .string()
    .transform((value) => (value === null ? '' : value))
    .trim()
    .min(1, required)
    .required(required);
