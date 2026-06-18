import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';

import type { CreateBookingResponse } from '../../@types/api/booking.api';
import BookingSuccessCard from '../../components/BookingSuccessCard/BookingSuccessCard';

import './BookingSuccess.scss';

const BookingSuccess = () => {
  const { t } = useTranslation('pages', { keyPrefix: 'bookingSuccess' });
  const location = useLocation();

  const { booking, roomNumber } = location.state as {
    booking?: CreateBookingResponse;
    roomNumber?: number;
  };

  if (!booking || !roomNumber) return null;

  return (
    <main className="booking-success">
      <title>{t('title')}</title>
      <BookingSuccessCard bookingData={booking} roomNumber={roomNumber} />
    </main>
  );
};

export default BookingSuccess;
