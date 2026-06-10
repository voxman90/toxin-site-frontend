import { yupResolver } from '@hookform/resolvers/yup';
import { useEffect } from 'react';
import type { SubmitHandler } from 'react-hook-form';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import type { BaseSearchRoomsFilters } from '../../@types/api/room.api';
import { ROUTES } from '../../routes';
import { getBasicSearchRoomSchema } from '../../schemas/basicSearch.schemas';
import Button from '../Button';
import CardFrame from '../CardFrame/CardFrame';
import DropdownDate from '../DropdownDate/DropdownDate';
import DropdownGuests from '../DropdownGuests/DropdownGuests';
import ErrorMessage from '../ErrorMessage/ErrorMessage';
import Field from '../Field/Field';
import Heading from '../Heading/Heading';

const RoomBasicSearchCard = () => {
  const { t } = useTranslation('components', { keyPrefix: 'roomSearchCard' });
  const { t: tErr } = useTranslation('components', { keyPrefix: 'errors' });
  const navigate = useNavigate();

  const methods = useForm({
    resolver: yupResolver(getBasicSearchRoomSchema(tErr)),
    values: {
      checkIn: '',
      checkOut: '',
      guests: {
        adult: 0,
        child: 0,
        baby: 0,
      },
    },
    mode: 'onBlur',
  });

  const {
    handleSubmit,
    setFocus,
    control,
    formState: { errors },
  } = methods;

  useEffect(() => {
    setFocus('checkIn');
  }, [setFocus]);

  const onSubmit: SubmitHandler<BaseSearchRoomsFilters> = async ({ checkIn, checkOut, guests }) => {
    const params = new URLSearchParams(
      Object.entries({ checkIn, checkOut, ...guests }).map(([k, v]) => [k, String(v)]),
    );

    navigate(`${ROUTES.SEARCH}?${params}`);
  };

  return (
    <section className="room-basic-search-card">
      <CardFrame>
        <Heading type="h1">{t('heading')}</Heading>
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <Field width="lg" margin="md" zIndex={10}>
            <DropdownDate
              control={control}
              nameFrom="checkIn"
              nameTo="checkOut"
              labelFrom={t('arrivalLabel')}
              labelTo={t('departureLabel')}
            />
          </Field>
          <Field width="lg" margin="lg" zIndex={5}>
            <DropdownGuests control={control} name="guests" labelText={t('guestsLabel')} />
            <ErrorMessage message={errors.guests?.message} />
          </Field>
          <Button type="submit" size="long" variant="filled" hasArrow>
            {t('btnSubmit')}
          </Button>
        </form>
      </CardFrame>
    </section>
  );
};

export default RoomBasicSearchCard;
