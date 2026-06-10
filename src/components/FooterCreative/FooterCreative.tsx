import { useTranslation } from 'react-i18next';

import Copyright from '../Copyright/Copyright';
import Logo from '../Logo/Logo';
import SocialFollow from '../SocialFollow/SocialFollow';

import './FooterCreative.scss';

const FooterCreative = () => {
  const { t } = useTranslation('components', { keyPrefix: 'footer' });

  return (
    <footer className="footer-creative">
      <div className="footer-creative__wrapper">
        <a href="/" className="footer-creative__logo" aria-label={t('logo')}>
          <Logo size="sm" isColored isSigned />
        </a>
        <Copyright year={2026} />
        <div className="footer-creative__social-follow">
          <SocialFollow />
        </div>
      </div>
    </footer>
  );
};

export default FooterCreative;
