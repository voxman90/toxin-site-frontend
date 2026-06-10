import CardFrame from '../CardFrame/CardFrame';
import Field from '../Field/Field';

import './BookingCard.scss';

const BookingCardSkeleton = () => {
  return (
    <section className="booking-card booking-card--skeleton">
      <CardFrame>
        <header className="booking-card__skeleton-header">
          <div className="booking-card__skeleton-text booking-card__skeleton-text--room-number u-shimmer" />
          <div className="booking-card__skeleton-text booking-card__skeleton-text--price-per-night u-shimmer" />
        </header>
        <Field width="lg" margin="md">
          <div className="booking-card__skeleton-text booking-card__skeleton-text--label u-shimmer" />
          <div className="booking-card__skeleton-date-dropdown">
            <div className="booking-card__skeleton-field booking-card__skeleton-field--check-in u-shimmer" />
            <div className="booking-card__skeleton-field booking-card__skeleton-field--check-out u-shimmer" />
          </div>
        </Field>
        <Field width="lg" margin="md">
          <div className="booking-card__skeleton-text booking-card__skeleton-text--label u-shimmer" />
          <div className="booking-card__skeleton-field booking-card__skeleton-field--guests u-shimmer" />
        </Field>
        <div className="booking-card__invoice-details">
          <div className="booking-card__invoice-item">
            <div className="booking-card__skeleton-text booking-card__skeleton-text--title u-shimmer" />
            <div className="booking-card__skeleton-text booking-card__skeleton-text--price u-shimmer" />
          </div>
          <div className="booking-card__invoice-item">
            <div className="booking-card__skeleton-text booking-card__skeleton-text--title u-shimmer" />
            <div className="booking-card__skeleton-text booking-card__skeleton-text--price u-shimmer" />
          </div>
          <div className="booking-card__invoice-item">
            <div className="booking-card__skeleton-text booking-card__skeleton-text--title u-shimmer" />
            <div className="booking-card__skeleton-text booking-card__skeleton-text--price u-shimmer" />
          </div>
        </div>
        <div className="booking-card__total">
          <div className="booking-card__skeleton-text booking-card__skeleton-text--total u-shimmer" />
          <div className="booking-card__total-divider" />
          <div className="booking-card__skeleton-text booking-card__skeleton-text--total-price u-shimmer" />
        </div>
        <div className="booking-card__skeleton-field booking-card__skeleton-field--submit u-shimmer" />
      </CardFrame>
    </section>
  );
};

export default BookingCardSkeleton;
