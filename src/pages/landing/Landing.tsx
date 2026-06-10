import { useTranslation } from 'react-i18next';

import RoomBasicSearchCard from '../../components/RoomBasicSearchCard/RoomBasicSearchCard';

import './Landing.scss';

const Landing = () => {
  const { t } = useTranslation('pages', { keyPrefix: 'landing' });

  return (
    <main className="landing__main">
      <title>{t('title')}</title>
      <div className="landing__search-card-wrapper">
        <RoomBasicSearchCard />
      </div>
      <p className="landing__caption">{t('caption')}</p>
    </main>
  );
};

export default Landing;
