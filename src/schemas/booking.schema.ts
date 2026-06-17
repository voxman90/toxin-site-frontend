import type { TFunction } from 'i18next';
import * as yup from 'yup';

import type { BookingFilters } from '../@types/api/booking.api';
import { ADDITIONAL_SERVICES } from '../constants/constants';

import { extractDateString, isCheckOutAfterCheckIn } from './shared';

export const getBookingSchema = (
  t: TFunction<'components', 'errors'>,
  maxCapacity = 10,
): yup.ObjectSchema<BookingFilters> =>
  yup
    .object({
      checkIn: extractDateString(t('arrivalRequired')),
      checkOut: extractDateString(t('departureRequired')).test(
        'is-after-arrival',
        t('isAfterArrival'),
        isCheckOutAfterCheckIn,
      ),
      guests: yup
        .object({
          adult: yup.number().required(),
          child: yup.number().required(),
          baby: yup.number().required(),
        })
        .optional()
        .default({ adult: 0, child: 0, baby: 0 })
        .test('sum-not-zero', t('guestsRequired'), (obj) => {
          return obj.adult + obj.child > 0;
        })
        .test('max-capacity', t('maxCapacityExceeded', { maxCapacity }), (obj) => {
          const totalGuests = (obj.adult || 0) + (obj.child || 0);
          return totalGuests <= maxCapacity;
        }),
      additionalServices: yup
        .array()
        .of(yup.string().oneOf(ADDITIONAL_SERVICES).defined())
        .optional()
        .default([]),
    })
    .required();
