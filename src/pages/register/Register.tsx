import { useTranslation } from 'react-i18next';

import RegisterCard from '../../components/RegisterCard/RegisterCard';
import { BASE_URL } from '../../constants/endpoints';

import './Register.scss';

const Register = () => {
  const { t } = useTranslation('pages', { keyPrefix: 'register' });
  const bgUrl = `url(${BASE_URL}/images/bg-register-w1440.jpg)`;

  return (
    <main className="register" style={{ '--bg-image': bgUrl } as React.CSSProperties}>
      <title>{t('title')}</title>
      <div className="register__content">
        <RegisterCard />
      </div>
    </main>
  );
};

export default Register;
