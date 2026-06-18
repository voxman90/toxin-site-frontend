import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import type { CreateBookingResponse } from '../../@types/api/booking.api';
import type { AdditionalService } from '../../@types/data';
import Button from '../../components/Button';
import CardFrame from '../../components/CardFrame/CardFrame';
import Heading from '../../components/Heading/Heading';
import { ROUTES } from '../../routes';
import { formatCurrency, formatISOString } from '../../utils/utils';
import Field from '../Field/Field';
import Icon from '../Icon/Icon';

import './BookingSuccessCard.scss';

const BookingSuccessCard = ({
  bookingData,
  roomNumber,
}: {
  bookingData: CreateBookingResponse;
  roomNumber: number;
}) => {
  const { t } = useTranslation('components', { keyPrefix: 'bookingSuccessCard' });
  const { t: tAddService } = useTranslation('components', { keyPrefix: 'additionalServices' });
  const navigate = useNavigate();

  const { priceSummary, checkIn, checkOut } = bookingData;
  const addServiceEntries = Object.entries(priceSummary.additionalServiceSummary || {});

  const handlePrint = () => {
    window.print();
  };

  return (
    <CardFrame>
      <div className="booking-success-card__content">
        <header className="booking-success-card__header">
          <Icon name="check_circle" className="booking-success-card__icon" size="xl" />
          <Heading type="h1">{t('title')}</Heading>
          <p className="booking-success-card__subtitle">{t('subtitle')}</p>
        </header>

        <div className="booking-success-card__receipt">
          <div className="booking-success-card__invoice-item booking-success-card__invoice-item--header">
            <span className="booking-success-card__room-title">
              {t('roomLabel')} <strong>№ {roomNumber}</strong>
            </span>
          </div>

          <div className="booking-success-card__invoice-item">
            <span>{t('datesLabel')}:</span>
            <br />
            <span className="booking-success-card__dates">
              {formatISOString(checkIn)} — {formatISOString(checkOut)}
            </span>
          </div>

          <div className="booking-success-card__invoice-item">
            <span>
              {formatCurrency(priceSummary.pricePerNight)} x{' '}
              {t('days', { count: priceSummary.nights })}
            </span>
            <span className="booking-success-card__info-price">
              {formatCurrency(priceSummary.basePrice)}
            </span>
          </div>

          {priceSummary.discount > 0 && (
            <div className="booking-success-card__invoice-item">
              <span>{t('serviceFeeWithDiscount')}</span>
              <span className="booking-success-card__info-price">
                -{formatCurrency(priceSummary.discount)}
              </span>
            </div>
          )}

          {addServiceEntries.length > 0 && (
            <div className="booking-success-card__services-section">
              <Heading type="label" className="booking-success-card__services-title">
                {t('additionalServices')}:
              </Heading>
              <ul className="booking-success-card__add-service-list">
                {addServiceEntries.map(([name, value]) => (
                  <li className="booking-success-card__add-service-item" key={name}>
                    <div className="booking-success-card__add-service-label">
                      {tAddService(name as AdditionalService)}
                    </div>
                    <div className="booking-success-card__add-service-divider" />
                    <div className="booking-success-card__add-service-price">
                      {formatCurrency(value)}
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="booking-success-card__total">
            <Heading type="h2">{t('total')}</Heading>
            <div className="booking-success-card__total-divider" />
            <Heading type="h2">{formatCurrency(priceSummary.totalPrice)}</Heading>
          </div>
        </div>

        <Field width="lg" margin="lg">
          <Button
            type="button"
            variant="filled"
            size="long"
            onClick={() => navigate(ROUTES.LANDING)}
            hasArrow
          >
            {t('btnHome')}
          </Button>
        </Field>

        <footer className="booking-success-card__print">
          <p className="booking-success-card__print-text">{t('canPrint')}</p>
          <Button type="button" variant="outlined" size="short" onClick={handlePrint}>
            {t('btnPrint')}
          </Button>
        </footer>
      </div>
    </CardFrame>
  );
};

export default BookingSuccessCard;
