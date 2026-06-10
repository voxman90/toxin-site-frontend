import { useTranslation } from 'react-i18next';

import RoomBasicSearchCard from '../../components/RoomBasicSearchCard/RoomBasicSearchCard';
import { BASE_URL } from '../../constants/endpoints';

import './Landing.scss';

const Landing = () => {
  const { t } = useTranslation('pages', { keyPrefix: 'landing' });
  const bgUrl = `url(${BASE_URL}/images/bg-landing-w1440.jpg)`;

  return (
    <main className="landing__main" style={{ '--bg-image': bgUrl } as React.CSSProperties}>
      <title>{t('title')}</title>
      <div className="landing__search-card-wrapper">
        <RoomBasicSearchCard />
      </div>
      <p className="landing__caption">{t('caption')}</p>
    </main>
  );
};

export default Landing;
