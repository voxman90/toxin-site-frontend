import { useCallback, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { FadeLoader } from 'react-spinners';

import { fetchReviews } from '../../actions/roomDetails.actions';
import { useAppDispatch, useAppSelector } from '../../hooks';
import Heading from '../Heading/Heading';
import Review from '../Review/Review';

import './ReviewsList.scss';

const ReviewsList = () => {
  const { t } = useTranslation('components', { keyPrefix: 'reviewList' });
  const dispatch = useAppDispatch();
  const { room, reviews, pagination, isLoading } = useAppSelector((state) => state.roomDetails);

  const observer = useRef<IntersectionObserver | null>(null);

  const lastReviewRef = useCallback(
    (node: HTMLLIElement | null) => {
      if (isLoading.reviews || !node) return;

      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting && pagination.hasNextPage) {
            dispatch(fetchReviews({ page: pagination.page + 1 }));
          }
        },
        { threshold: 0.5, rootMargin: '100px' },
      );

      observer.current.observe(node);
    },
    [isLoading.reviews, pagination.hasNextPage, pagination.page, room, dispatch],
  );

  if (!room) return null;

  return (
    <section className="reviews-list">
      <header className="reviews-list__header">
        <Heading type="h2">{t('heading')}</Heading>
        <span className="reviews-list__counter">
          {t('counter', { count: pagination.totalDocs })}
        </span>
      </header>
      <ul className="reviews-list__container">
        {reviews.map((item, i) => (
          <li
            key={item.id}
            className="reviews-list__item"
            {...(reviews.length === i + 1 ? { ref: lastReviewRef } : {})}
          >
            <Review review={item} />
          </li>
        ))}

        {isLoading.reviews && (
          <div className="reviews-list__loader-wrapper">
            <FadeLoader color="var(--color-foreground)" />
          </div>
        )}
      </ul>
    </section>
  );
};

export default ReviewsList;
