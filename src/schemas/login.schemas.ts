import type { TFunction } from 'i18next';
import type { ObjectSchema } from 'yup';
import * as yup from 'yup';

import type { LoginRequest } from '../@types/api/auth.api';

export const getLoginSchema = (t: TFunction<'components', 'errors'>): ObjectSchema<LoginRequest> =>
  yup.object({
    email: yup.string().trim().required(t('loginRequired')),
    password: yup.string().required(t('passwordRequired')),
  });
