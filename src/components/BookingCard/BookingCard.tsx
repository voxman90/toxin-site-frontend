import { yupResolver } from '@hookform/resolvers/yup';
import clsx from 'clsx';
import { memo, useEffect, useMemo } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';

import type { AdditionalService, IRoom } from '../../@types/data';
import { createBooking } from '../../actions/booking.actions';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { useSearchFilters } from '../../hooks/useSearchFilters';
import { getBookingSchema } from '../../schemas/booking.schema';
import { formatCurrency } from '../../utils/utils';
import Button from '../Button';
import CardFrame from '../CardFrame/CardFrame';
import DropdownDate from '../DropdownDate/DropdownDate';
import DropdownGuests from '../DropdownGuests/DropdownGuests';
import Field from '../Field/Field';
import Heading from '../Heading/Heading';
import Tooltip from '../Tooltip/Tooltip';

import './BookingCard.scss';
import BookingCardSkeleton from './BookingCardSkeleton';

interface BookingCardProps {
  roomId: string;
  room: IRoom | null;
  isRoomLoading: boolean;
}

const BookingCard = ({ roomId, room, isRoomLoading }: BookingCardProps) => {
  const dispatch = useAppDispatch();
  const { t } = useTranslation('components', { keyPrefix: 'bookingCard' });
  const { t: tErr } = useTranslation('components', { keyPrefix: 'errors' });
  const { t: tAddService } = useTranslation('components', { keyPrefix: 'additionalServices' });
  const { filters, applyFilters } = useSearchFilters();

  const {
    details: preview,
    isLoading: isPreviewLoading,
    error,
  } = useAppSelector((state) => state.booking);

  const schema = useMemo(() => getBookingSchema(tErr, room?.capacity), [tErr, room]);

  const { additionalServices } = filters;
  const {
    nights,
    pricePerNight,
    discount,
    basePrice,
    servicePrice,
    additionalServicePrice,
    additionalServiceSummary,
    totalPrice,
  } = preview;

  const {
    handleSubmit,
    control,
    setFocus,
    trigger,
    getValues,
    formState: { isValid },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      checkIn: filters.checkIn,
      checkOut: filters.checkOut,
      guests: filters.guests,
    },
    mode: 'onChange',
  });

  const addServiceSummaryEntries = Object.entries(additionalServiceSummary);

  const isBlurred = isPreviewLoading || !isValid || !!error.preview;

  useEffect(() => {
    trigger(undefined, { shouldFocus: true }).then((isValid) => {
      if (isValid) setFocus('checkIn');
    });
  }, [trigger, room, setFocus]);

  const [checkIn, checkOut, { adult, baby, child }] = useWatch({
    control,
    name: ['checkIn', 'checkOut', 'guests'],
  });
  const guestsStr = `${adult}-${baby}-${child}`;

  useEffect(() => {
    const data = schema.cast(getValues());

    applyFilters(data);
  }, [checkIn, checkOut, guestsStr, applyFilters, getValues, schema]);

  const onSubmit = async () => {
    await dispatch(
      createBooking({
        roomId,
        checkIn: filters.checkIn,
        checkOut: filters.checkOut,
        guests: filters.guests,
        additionalServices,
      }),
    )
      .unwrap()
      .then(() => toast.success('Room booking was successful'))
      .catch((reason) => toast.error(reason?.message || tErr('unknownError')));
  };

  if (isRoomLoading || !room) {
    return <BookingCardSkeleton />;
  }

  return (
    <section className="booking-card">
      <CardFrame>
        <header className="booking-card__header">
          <div className="booking-card__room-info">
            <span className="booking-card__number-symbol">№&nbsp;</span>
            <Heading type="h1">{room.roomNumber}</Heading>
            {room.isLuxe && <span className="booking-card__room-type">{t('luxe')}</span>}
          </div>
          <div className="booking-card__price-per-day">
            <span className="booking-card__price-bold">{formatCurrency(room.price)}</span>
            <span className="booking-card__price-text"> {t('perDay')}</span>
          </div>
        </header>
        <form className="booking-card__form" onSubmit={handleSubmit(onSubmit)} noValidate>
          <Field width="lg" margin="md" zIndex={10}>
            <DropdownDate
              control={control}
              nameFrom="checkIn"
              nameTo="checkOut"
              labelFrom={t('arrivalLabel')}
              labelTo={t('departureLabel')}
            />
          </Field>
          <Field width="lg" margin="md" zIndex={5}>
            <DropdownGuests control={control} name="guests" labelText={t('guestsLabel')} />
          </Field>
          <div
            className={clsx('booking-card__invoice-details', {
              'booking-card__invoice-details--blurred': isBlurred,
            })}
          >
            <div className="booking-card__invoice-item">
              <span>
                {formatCurrency(pricePerNight)} x {nights} {t('days', { count: nights })}
              </span>
              <span className="booking-card__info-price">{formatCurrency(basePrice)}</span>
            </div>
            <div className="booking-card__invoice-item">
              <span className="booking-card__info-label">
                {t('serviceFee')}
                {discount > 0 ? `: ${t('discount')} ${formatCurrency(discount)}` : ''}
              </span>
              <span className="booking-card__info-price">{formatCurrency(servicePrice)}</span>
            </div>
            <div className="booking-card__invoice-item">
              <span className="booking-card__info-label">
                {t('additionalServiceFee')}
                {addServiceSummaryEntries.length !== 0 && (
                  <Tooltip
                    target={<i className="booking-card__info-icon">i</i>}
                    label={t('additionalServiceFee')}
                    isFocusable={!isBlurred}
                  >
                    <ul className="booking-card__add-service-list">
                      {addServiceSummaryEntries.map(([name, value]) => {
                        return (
                          <li className="booking-card__add-service-item" key={name}>
                            <div className="booking-card__add-service-label">
                              {tAddService(name as AdditionalService)}
                            </div>
                            <div className="booking-card__add-service-divider" />
                            <div className="booking-card__add-service-price">
                              {formatCurrency(value)}
                            </div>
                          </li>
                        );
                      })}
                    </ul>
                  </Tooltip>
                )}
              </span>
              <span className="booking-card__info-price">
                {formatCurrency(additionalServicePrice)}
              </span>
            </div>
          </div>
          <div
            className={clsx('booking-card__total', {
              'booking-card__total--blurred': isBlurred,
            })}
          >
            <Heading type="h2">{t('total')}</Heading>
            <div className="booking-card__total-divider" />
            <Heading type="h2">{formatCurrency(totalPrice)}</Heading>
          </div>
          <Button type="submit" size="long" variant="filled" disabled={isBlurred} hasArrow>
            {t('btnSubmit')}
          </Button>
        </form>
      </CardFrame>
    </section>
  );
};

const MemoizedBookingCard = memo(BookingCard);

export default MemoizedBookingCard;
