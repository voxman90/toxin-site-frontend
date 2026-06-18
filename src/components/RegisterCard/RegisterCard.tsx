import { yupResolver } from '@hookform/resolvers/yup';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

import type { RegisterData } from '../../@types/api/auth.api';
import { register as signUp } from '../../actions/auth.actions';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { ROUTES } from '../../routes';
import { getRigisterSchema } from '../../schemas/register.schema';
import { clearError } from '../../slices/auth';
import { getErrorMessage } from '../../utils/utils';
import Button from '../Button';
import CardFrame from '../CardFrame/CardFrame';
import ErrorMessage from '../ErrorMessage/ErrorMessage';
import Field from '../Field/Field';
import Fieldset from '../Fieldset/Fieldset';
import Heading from '../Heading/Heading';
import Input from '../Input/Input';
import MaskedFieldDate from '../MaskedFieldDate/MaskedFieldDate';
import RadioButton from '../RadioButton/RadioButton';
import Toggle from '../Toggle/Toggle';

import './RegisterCard.scss';

const RegisterCard = () => {
  const { isLoading, error: serverError } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation('components', { keyPrefix: 'registerCard' });
  const { t: tErr } = useTranslation('components', { keyPrefix: 'errors' });

  const methods = useForm({
    defaultValues: {
      gender: 'male',
      specialOffer: false,
    },
    resolver: yupResolver(getRigisterSchema(tErr)),
    mode: 'onSubmit',
  });

  const {
    register,
    handleSubmit,
    setFocus,
    control,
    formState: { errors },
  } = methods;

  const firstError = Object.values(errors)[0]?.message as string | undefined;

  useEffect(() => {
    return () => {
      if (serverError) {
        dispatch(clearError());
      }
    };
  }, [serverError, dispatch]);

  useEffect(() => setFocus('firstName'), [setFocus]);

  const fromPage = (location.state as { from?: string })?.from || ROUTES.LANDING;

  const onSubmit = async (data: RegisterData) => {
    if (serverError) {
      dispatch(clearError());
    }

    await dispatch(signUp(data))
      .unwrap()
      .then(() => {
        toast.success(t('success'));
        navigate(fromPage, { replace: true });
      })
      .catch((err) => toast.error(getErrorMessage(err, tErr('unknownError'))));
  };

  return (
    <section className="register-card">
      <CardFrame>
        <div className="login-card__heading">
          <Heading type="h1">{t('heading')}</Heading>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <Fieldset name="fullName" disabled={isLoading}>
            <Field width="lg" margin="sm">
              <Input
                type="text"
                name="firstName"
                register={register}
                placeholder={t('firstNamePlaceholder')}
                isInvalid={!!errors.firstName}
                aria-label={t('firstNamePlaceholder')}
              />
            </Field>
            <Field width="lg" margin="sm">
              <Input
                type="text"
                name="lastName"
                register={register}
                placeholder={t('lastNamePlaceholder')}
                isInvalid={!!errors.lastName}
                aria-label={t('lastNamePlaceholder')}
              />
            </Field>
          </Fieldset>
          <Field width="lg" margin="md">
            <div
              className="register-card__gender-btns"
              role="radiogroup"
              aria-label={t('genderSelection')}
            >
              <RadioButton value="male" name="gender" register={register} text={t('genderMale')} />
              <RadioButton
                value="female"
                name="gender"
                register={register}
                text={t('genderFemale')}
              />
            </div>
          </Field>
          <Field width="lg" margin="md">
            <MaskedFieldDate
              labelText={t('birthdateLabel')}
              name="birthdate"
              control={control}
              showErrors={false}
            />
          </Field>
          <Fieldset legend={t('credentialsLabel')} name="credentials" indent="xs">
            <Field width="lg" margin="sm">
              <Input
                type="text"
                name="email"
                register={register}
                placeholder={t('emailPlaceholder')}
                isInvalid={!!errors.email}
                autoComplete="username"
                aria-label={t('emailPlaceholder')}
              />
            </Field>
            <Field width="lg" margin="sm">
              <Input
                type="password"
                name="password"
                register={register}
                placeholder={t('passwordPlaceholder')}
                isInvalid={!!errors.password}
                autoComplete="new-password"
                aria-label={t('passwordPlaceholder')}
              />
            </Field>
            <Field width="lg" margin="sm">
              <Input
                type="password"
                name="passwordConfirm"
                register={register}
                placeholder={t('passwordConfirmPlaceholder')}
                isInvalid={!!errors.passwordConfirm}
                autoComplete="off"
                aria-label={t('passwordConfirmPlaceholder')}
              />
            </Field>
          </Fieldset>
          <Field width="lg" margin="md">
            <Toggle name="specialOffer" register={register} text={t('subscription')} />
            <ErrorMessage message={firstError} />
          </Field>
          <Field width="lg" margin="lg">
            <Button type="submit" size="long" variant="filled" hasArrow disabled={isLoading}>
              {t('btnSubmit')}
            </Button>
          </Field>
          <footer className="register-card__login">
            <p className="register-card__login-text">{t('hasAccount')}</p>
            <Button
              type="button"
              size="short"
              variant="outlined"
              onClick={() => navigate(ROUTES.LOGIN, { state: { from: fromPage } })}
            >
              {t('btnLogin')}
            </Button>
          </footer>
        </form>
      </CardFrame>
    </section>
  );
};

export default RegisterCard;
