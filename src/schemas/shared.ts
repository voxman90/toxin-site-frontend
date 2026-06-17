import * as yup from 'yup';

export const extractDateString = (required: string) =>
  yup
    .string()
    .transform((value) => (value === null ? '' : value))
    .trim()
    .min(1, required)
    .required(required);

export function isCheckOutAfterCheckIn(
  this: yup.TestContext,
  checkOutDate: string | null | undefined,
): boolean {
  const parent = this.parent as Record<string, any>;
  const checkInDate = parent?.checkIn;

  if (!checkInDate || !checkOutDate) return true;

  return new Date(checkOutDate).getTime() > new Date(checkInDate).getTime();
}
