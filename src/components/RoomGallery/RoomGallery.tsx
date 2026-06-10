import { useTranslation } from 'react-i18next';

import { getImageUrl } from '../../utils/utils';
import ImgWithSkeleton from '../ImgWithSkeleton/ImgWithSkeleton';

import './RoomGallery.scss';

interface RoomGalleryProps {
  isRoomLoading: boolean;
  images: string[];
}

const RoomGallery = ({ images, isRoomLoading }: RoomGalleryProps) => {
  const { t } = useTranslation('components', { keyPrefix: 'roomGallery' });
  const [main, sideTop, sideBottom] = images.map((img) => getImageUrl(img));

  return (
    <section className="room-gallery">
      {isRoomLoading && <div className="u-shimmer" />}

      {!isRoomLoading && (
        <>
          <div className="room-gallery__main">
            <ImgWithSkeleton
              src={main}
              className="room-gallery__image"
              alt={t('roomView')}
              loading="eager"
            />
          </div>
          <div className="room-gallery__side-top">
            <ImgWithSkeleton
              src={sideTop}
              className="room-gallery__image"
              alt={t('roomView')}
              loading="eager"
            />
          </div>
          <div className="room-gallery__side-bottom">
            <ImgWithSkeleton
              src={sideBottom}
              className="room-gallery__image"
              alt={t('roomView')}
              loading="eager"
            />
          </div>
        </>
      )}
    </section>
  );
};

export default RoomGallery;
