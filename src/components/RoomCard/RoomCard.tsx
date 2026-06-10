import { memo, useRef } from 'react';
import { useTranslation } from 'react-i18next';

import type { IRoom } from '../../@types/data';
import noImageAvailable from '../../assets/img/no_image_placeholder.jpg';
import { formatCurrency, getImageUrl } from '../../utils/utils';
import type { CarouselRef } from '../Carousel';
import Carousel from '../Carousel';
import CarouselItem from '../Carousel/CarouselItem';
import ImgWithSkeleton from '../ImgWithSkeleton/ImgWithSkeleton';
import RateButton from '../RateButton/RateButton';

import './RoomCard.scss';

type RoomCardProps = {
  onClick: (id: string) => void;
} & Pick<IRoom, 'id' | 'avgRating' | 'price' | 'images' | 'reviewsCount' | 'roomNumber'> &
  Partial<IRoom>;

const RoomCard = memo(
  ({
    id,
    roomNumber,
    price,
    avgRating,
    reviewsCount,
    isLuxe = false,
    images = [],
    onClick,
  }: RoomCardProps) => {
    const { t } = useTranslation('components', { keyPrefix: 'roomCard' });
    const carouselRef = useRef<CarouselRef | null>(null);

    const rating = Math.round(avgRating);

    const handleKeyDown = (e: React.KeyboardEvent) => {
      if (e.key === 'ArrowRight') {
        e.preventDefault();
        carouselRef.current?.next();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        carouselRef.current?.prev();
      } else if (e.key === 'Enter' || e.key === ' ') {
        onClick(id);
      }
    };

    return (
      <article
        className="room-card"
        role="link"
        tabIndex={0}
        onClick={() => onClick(id)}
        onKeyDown={handleKeyDown}
        aria-label={`${t('label')} ${roomNumber}`}
      >
        <div className="room-card__carousel" onClick={(e) => e.stopPropagation()}>
          <Carousel ref={carouselRef} hasControlButtons hasNavPanel isFocusable={false}>
            {images.map((image, i) => (
              <CarouselItem key={`${roomNumber}-${i}`}>
                <ImgWithSkeleton
                  src={getImageUrl(image)}
                  fallbackSrc={noImageAvailable}
                  alt={`${t('roomPhotoAlt')} ${roomNumber}`}
                  loading={i === 0 ? 'eager' : 'lazy'}
                />
              </CarouselItem>
            ))}
          </Carousel>
        </div>
        <div className="room-card__body">
          <header className="room-card__heading">
            <div className="room-card__room-info">
              <span className="room-card__number-symbol">№&nbsp;</span>
              <h2>{roomNumber}</h2>
              {isLuxe && <span className="room-card__luxe">{t('luxe')}</span>}
            </div>
            <div className="room-card__price-per-day">
              <span className="booking-card__price-bold">{`${formatCurrency(price)} `}</span>
              <span className="booking-card__price-text">{t('perNight')}</span>
            </div>
          </header>
          <div className="room-card__hr" />
          <div className="room-card__rating-panel">
            <RateButton value={rating} readonly />
            <span className="room-card__reviews">
              <b>{`${reviewsCount} `}</b>
              {t('review', { count: reviewsCount })}
            </span>
          </div>
        </div>
      </article>
    );
  },
);

export default RoomCard;
