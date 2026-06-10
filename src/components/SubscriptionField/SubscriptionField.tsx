import { yupResolver } from '@hookform/resolvers/yup';
import React, { useMemo } from 'react';
import { get, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import * as yup from 'yup';

import Icon from '../Icon/Icon';
import Input from '../Input/Input';
import InputGroup from '../InputGroup/InputGroup';

import './SubscriptionField.scss';

type SubscriptionFieldProps = {
  name: string;
  onSubscribe: (payload: Record<string, string>) => void;
  isDisabled?: boolean;
  labelText?: string;
} & React.ComponentPropsWithoutRef<'input'>;

const NOOP = () => {};

const SubscriptionField = ({
  name,
  labelText,
  isDisabled = false,
  onSubscribe = NOOP,
  ...props
}: SubscriptionFieldProps) => {
  const { t } = useTranslation('components', { keyPrefix: 'subscriptionField' });
  const { t: tErr } = useTranslation('components', { keyPrefix: 'errors' });

  const schema = useMemo(
    () =>
      yup.object({
        [name]: yup.string().email(tErr('emailInvalid')).required(tErr('emailRequired')),
      }),
    [name, tErr],
  );

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Record<string, string>>({
    resolver: yupResolver(schema),
    mode: 'onSubmit',
  });
  const error = get(errors, name);

  return (
    <div className="subscription-field">
      <form onSubmit={handleSubmit(onSubscribe)} noValidate>
        <InputGroup error={error} labelText={labelText}>
          <div className="subscription-field__input">
            <Input
              {...props}
              type="text"
              name={name}
              register={register}
              placeholder={t('placeholder')}
              isInvalid={!!error}
            />
            <button
              type="submit"
              className="subscription-field__button"
              disabled={isDisabled}
              aria-label={t('submit')}
            >
              <Icon name="arrow_forward" font="material" />
            </button>
          </div>
        </InputGroup>
      </form>
    </div>
  );
};

export default SubscriptionField;
