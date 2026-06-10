import type { TFunction } from 'i18next';
import type { ObjectSchema } from 'yup';
import * as yup from 'yup';

import type { RegisterData } from '../@types/api/auth.api';

const getAge = (birthDateStr: string) => {
  const [day, month, year] = birthDateStr.split('.').map((str) => parseInt(str, 10));
  const birthDate = new Date(year, month - 1, day);
  const today = new Date();
  const age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();

  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    return age - 1;
  }

  return age;
};

export const getRigisterSchema = (
  t: TFunction<'components', 'errors'>,
): ObjectSchema<RegisterData> =>
  yup.object({
    firstName: yup.string().trim().required(t('firstNameRequired')),
    lastName: yup.string().trim().required(t('lastNameRequired')),
    email: yup.string().trim().required(t('emailRequired')).email(t('emailInvalid')),
    birthdate: yup
      .string()
      .required(t('birthDateRequired'))
      .test('not-minor', t('birthDateMinor'), (birthdate: string) => {
        return getAge(birthdate) >= 18;
      }),
    password: yup
      .string()
      .required(t('passwordRequired'))
      .matches(/[a-z]/, t('passwordMustContainLowercaseLetter'))
      .matches(/[A-Z]/, t('passwordMustContainUppercaseLetter'))
      .matches(/[0-9]/, t('passwordMustContainNumber'))
      .matches(/[!@#$%^&*]/, t('passwordMustContainSpecialSymbol')),
    passwordConfirm: yup
      .string()
      .required(t('passwordMismatch'))
      .oneOf([yup.ref('password')], t('passwordMismatch')),
    gender: yup.string().required(),
    specialOffer: yup.boolean().required(),
  });
