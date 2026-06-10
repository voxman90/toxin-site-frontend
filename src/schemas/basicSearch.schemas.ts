import type { TFunction } from 'i18next';
import type { ObjectSchema } from 'yup';
import * as yup from 'yup';

import type { BaseSearchRoomsFilters } from '../@types/api/room.api';

export const getBasicSearchRoomSchema = (
  t: TFunction<'components', 'errors'>,
): ObjectSchema<BaseSearchRoomsFilters> =>
  yup.object({
    checkIn: yup.string().required(t('arrivalRequired')),
    checkOut: yup.string().required(t('departureRequired')),
    guests: yup
      .object({
        adult: yup.number().required(),
        child: yup.number().required(),
        baby: yup.number().required(),
      })
      .test('has-guests', t('guestsRequired'), (obj) => obj.adult !== 0 || obj.child !== 0),
  });
