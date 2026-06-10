import type { Locale } from 'date-fns';
import { formatDistanceToNow } from 'date-fns';
import { enUS, ru } from 'date-fns/locale';
import i18next from 'i18next';
import { memo } from 'react';

import type { IReview } from '../../@types/data';
import { toggleLike } from '../../actions/roomDetails.actions';
import defaultAvatar from '../../assets/img/default_avatar.png';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { toggleLikeLocal } from '../../slices/roomDetails';
import ImgWithSkeleton from '../ImgWithSkeleton/ImgWithSkeleton';
import LikeButton from '../LikeButton/LikeButton';

import './Review.scss';

const locales: Record<string, Locale> = {
  'ru-RU': ru,
  'en-EN': enUS,
};

const getRelativeTime = (date: string | Date): string => {
  return formatDistanceToNow(new Date(date), {
    addSuffix: true,
    locale: locales[i18next.language] || enUS,
  });
};

const Review = memo(({ review }: { review: IReview }) => {
  const { id, authorName, avatarUrl, createdAt, text, likeCount, isLiked } = review;
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);

  const handleLikeChange = () => {
    dispatch(toggleLikeLocal(id));

    if (!user) return;

    dispatch(toggleLike(id));
  };

  return (
    <article className="review">
      <div className="review__header">
        <div className="review__avatar">
          <ImgWithSkeleton
            src={avatarUrl || defaultAvatar}
            fallbackSrc={defaultAvatar}
            alt={authorName}
            loading="lazy"
            decoding="async"
          />
        </div>
        <div className="review__info">
          <span className="review__author">{authorName}</span>
          <time className="review__date">{getRelativeTime(createdAt)}</time>
        </div>
      </div>
      <div className="review__content">
        <div className="review__like-btn">
          <LikeButton count={likeCount} isLiked={isLiked} onChange={handleLikeChange} />
        </div>
        <p className="review__text">{text}</p>
      </div>
    </article>
  );
});

export default Review;
