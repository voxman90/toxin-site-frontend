import { yupResolver } from '@hookform/resolvers/yup';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

import type { LoginRequest } from '../../@types/api/auth.api';
import { login } from '../../actions/auth.actions';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { ROUTES } from '../../routes';
import { getLoginSchema } from '../../schemas/login.schemas';
import { clearError } from '../../slices/auth';
import { getErrorMessage } from '../../utils/utils';
import Button from '../Button';
import CardFrame from '../CardFrame/CardFrame';
import ErrorMessage from '../ErrorMessage/ErrorMessage';
import Field from '../Field/Field';
import Fieldset from '../Fieldset/Fieldset';
import Heading from '../Heading/Heading';
import Input from '../Input/Input';

import './LoginCard.scss';

const LoginCard = () => {
  const { isLoading, error: serverError } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation('components', { keyPrefix: 'loginCard' });
  const { t: tErr } = useTranslation('components', { keyPrefix: 'errors' });

  const methods = useForm({
    resolver: yupResolver(getLoginSchema(tErr)),
    mode: 'onSubmit',
  });

  const {
    register,
    handleSubmit,
    setFocus,
    formState: { errors },
  } = methods;

  const fromPage = (location.state as { from?: string })?.from || ROUTES.LANDING;

  const firstError = Object.values(errors)[0]?.message as string | undefined;

  useEffect(() => setFocus('email'), [setFocus]);

  useEffect(() => {
    return () => {
      if (serverError) {
        dispatch(clearError());
      }
    };
  }, [serverError, dispatch]);

  const onSubmit = async (credentials: LoginRequest) => {
    if (serverError) {
      dispatch(clearError());
    }

    await dispatch(login(credentials))
      .unwrap()
      .then(() => {
        toast.success(t('success'));
        navigate(fromPage, { replace: true });
      })
      .catch((err) => toast.error(getErrorMessage(err, tErr('unknownError'))));
  };

  return (
    <section className="login-card">
      <CardFrame>
        <div className="login-card__heading">
          <Heading type="h1">{t('heading')}</Heading>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <Fieldset name="credentials" disabled={isLoading}>
            <Field width="lg" margin="sm">
              <Input
                type="text"
                name="email"
                register={register}
                placeholder={t('emailPlaceholder')}
                isInvalid={!!errors.email}
                autoComplete="off"
                aria-label={t('emailPlaceholder')}
              />
            </Field>
            <Field width="lg" margin="lg">
              <Input
                type="password"
                name="password"
                register={register}
                placeholder={t('passwordPlaceholder')}
                isInvalid={!!errors.password}
                aria-label={t('passwordPlaceholder')}
              />
              <ErrorMessage message={firstError} />
            </Field>
          </Fieldset>
          <Field width="lg" margin="lg">
            <Button type="submit" size="long" variant="filled" hasArrow disabled={isLoading}>
              {t('btnSubmit')}
            </Button>
          </Field>
          <footer className="login-card__register">
            <p className="login-card__register-text">{t('hasNotAccount')}</p>
            <Button
              type="button"
              size="short"
              variant="outlined"
              onClick={() => navigate(ROUTES.REGISTER, { state: { from: fromPage } })}
            >
              {t('btnRegister')}
            </Button>
          </footer>
        </form>
      </CardFrame>
    </section>
  );
};

export default LoginCard;
