import type { TFunction } from 'i18next';
import * as yup from 'yup';

import type { SearchRoomsFilters } from '../@types/api/room.api';
import { ACCESSIBILITY, ADDITIONAL_SERVICES, RULES } from '../constants/constants';

import { extractDateString } from './shared';

export const getSearchSchema = (
  t: TFunction<'components', 'errors'>,
): yup.ObjectSchema<SearchRoomsFilters> =>
  yup
    .object({
      checkIn: extractDateString(t('arrivalRequired')),
      checkOut: extractDateString(t('departureRequired')),
      guests: yup
        .object({
          adult: yup.number().required(),
          child: yup.number().required(),
          baby: yup.number().required(),
        })
        .test('sum-not-zero', t('guestsRequired'), ({ adult, child }) => adult + child > 0),
      minPrice: yup.number().required(),
      maxPrice: yup.number().required(),
      rules: yup.array().of(yup.string().oneOf(RULES).defined()).default([]),
      accessibility: yup.array().of(yup.string().oneOf(ACCESSIBILITY).defined()).default([]),
      additionalServices: yup
        .array()
        .of(yup.string().oneOf(ADDITIONAL_SERVICES).defined())
        .default([]),
      amenities: yup.object({
        bed: yup.number().defined(),
        bathroom: yup.number().required(),
        bedroom: yup.number().required(),
      }),
    })
    .required();
