import { useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';

import { fetchBookingPreview } from '../../actions/booking.actions';
import {
  fetchRatingSummary,
  fetchReviews,
  initRoomDetails,
} from '../../actions/roomDetails.actions';
import BookingCard from '../../components/BookingCard/BookingCard';
import BulletList from '../../components/BulletList/BulletList';
import Heading from '../../components/Heading/Heading';
import IconItemList from '../../components/IconItemList/IconItemList';
import MiniErrorPlaceholder from '../../components/MiniErrorPlaceholder/MiniErrorPlaceholder';
import RatingChart from '../../components/RatingChart/RatingChart';
import ReviewsList from '../../components/ReviewsList/ReviewsList';
import RoomGallery from '../../components/RoomGallery/RoomGallery';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { useSearchFilters } from '../../hooks/useSearchFilters';
import { useStableBookingFields } from '../../hooks/useStableBookingFields';
import { getBookingSchema } from '../../schemas/booking.schema';
import { resetBooking } from '../../slices/booking';
import { resetRoomDetails } from '../../slices/roomDetails';
import { createKnownError, getFeatures, getRules } from '../../utils/utils';

import './Booking.scss';

const Booking = () => {
  const { t } = useTranslation('pages', { keyPrefix: 'booking' });
  const { t: tErr } = useTranslation('components', { keyPrefix: 'errors' });
  const { roomId } = useParams<{ roomId: string }>();
  const { filters } = useSearchFilters();
  const dispatch = useAppDispatch();

  const {
    room,
    ratingSummary,
    isLoading: { room: isRoomLoading, ratingSummary: isSummaryLoading },
    error: { room: roomError, reviews: reviewsError, ratingSummary: summaryError },
  } = useAppSelector((state) => state.roomDetails);

  useEffect(() => {
    return () => {
      dispatch(resetBooking());
      dispatch(resetRoomDetails());
    };
  }, [dispatch]);

  const isRoomNotFound = !roomId || roomError?.status === 404;
  const hasOtherCriticalError = !!roomError;

  if (isRoomNotFound) {
    throw createKnownError({
      message: roomError?.data.message || 'Room not found',
      status: 404,
    });
  }

  if (hasOtherCriticalError) {
    throw createKnownError({
      message: roomError?.data.message || 'Server critical error',
      status: roomError?.status || 500,
    });
  }

  const features = useMemo(() => getFeatures(t), [t]);
  const rules = useMemo(() => getRules(t, room?.rules || []), [t, room]);

  const stableBookingFields = useStableBookingFields(filters);
  const roomCapacity = room?.capacity ?? 0;

  const bookingSchema = useMemo(() => getBookingSchema(tErr, roomCapacity), [tErr, roomCapacity]);

  useEffect(() => {
    if (roomId) {
      const bookingFormData = bookingSchema.cast(filters, { stripUnknown: true });
      const isValid = bookingSchema.isValidSync(bookingFormData);

      if (isValid) {
        dispatch(
          fetchBookingPreview({
            roomId,
            ...bookingFormData,
            additionalServices: filters.additionalServices,
          }),
        );
      }
    }
  }, [dispatch, stableBookingFields, bookingSchema, roomId]);

  useEffect(() => {
    if (roomId) {
      dispatch(initRoomDetails(roomId));
    }
  }, [dispatch, roomId]);

  return (
    <main className="booking">
      <RoomGallery images={room?.images ?? []} isRoomLoading={isRoomLoading} />

      <div className="booking__content-grid">
        <section className="booking__features">
          <Heading type="h2">{t('featuresTitle')}</Heading>
          <IconItemList items={features} />
        </section>

        <section className="booking__rating-chart">
          {summaryError ? (
            <MiniErrorPlaceholder
              message={t('summaryFetchError')}
              onRetry={() => dispatch(fetchRatingSummary())}
            />
          ) : (
            <RatingChart summary={ratingSummary} isLoading={isSummaryLoading} />
          )}
        </section>

        <section className="booking__reviews">
          {reviewsError ? (
            <MiniErrorPlaceholder
              message={t('reviewsFetchError')}
              onRetry={() => dispatch(fetchReviews())}
            />
          ) : (
            <ReviewsList />
          )}
        </section>

        <section className="booking__rules">
          <Heading type="h2">{t('rulesTitle')}</Heading>
          <BulletList items={rules} isAlignWithText />
        </section>

        <section className="booking__cancellation">
          <Heading type="h2">{t('cancellationTitle')}</Heading>
          <p className="booking__cancellation-text">{t('cancellationText')}</p>
        </section>

        <aside className="booking__sidebar">
          <BookingCard roomId={roomId} room={room} isRoomLoading={isRoomLoading} />
        </aside>
      </div>
    </main>
  );
};

export default Booking;
