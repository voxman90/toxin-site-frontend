import { useTranslation } from 'react-i18next';

import LoginCard from '../../components/LoginCard/LoginCard';

import './Login.scss';

const Login = () => {
  const { t } = useTranslation('pages', { keyPrefix: 'login' });

  return (
    <main className="login">
      <title>{t('title')}</title>
      <div className="login__content">
        <LoginCard />
      </div>
    </main>
  );
};

export default Login;
