import { useTranslation } from 'react-i18next';

import RegisterCard from '../../components/RegisterCard/RegisterCard';

import './Register.scss';

const Register = () => {
  const { t } = useTranslation('pages', { keyPrefix: 'register' });

  return (
    <main className="register">
      <title>{t('title')}</title>
      <div className="register__content">
        <RegisterCard />
      </div>
    </main>
  );
};

export default Register;
