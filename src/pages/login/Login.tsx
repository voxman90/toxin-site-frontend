import { useTranslation } from 'react-i18next';

import LoginCard from '../../components/LoginCard/LoginCard';
import { BASE_URL } from '../../constants/endpoints';

import './Login.scss';

const Login = () => {
  const { t } = useTranslation('pages', { keyPrefix: 'login' });
  const bgUrl = `url(${BASE_URL}/images/bg-register-w1440.jpg)`;

  return (
    <main className="login" style={{ '--bg-image': bgUrl } as React.CSSProperties}>
      <title>{t('title')}</title>
      <div className="login__content">
        <LoginCard />
      </div>
    </main>
  );
};

export default Login;
