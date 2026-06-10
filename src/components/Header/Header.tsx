import { useTranslation } from 'react-i18next';

import Hamburger from '../Hamburger/Hamburger';
import Logo from '../Logo/Logo';
import Navbar from '../Navbar/Navbar';
import Userbar from '../Userbar/Userbar';

import './Header.scss';

const Header = () => {
  const { t } = useTranslation('components', { keyPrefix: 'header' });

  return (
    <header className="header">
      <a href="/" className="header__logo" aria-label={t('logo')}>
        <Logo size="sm" isColored isSigned />
      </a>
      <div className="header__navbar">
        <Navbar />
      </div>
      <div className="header__hamburger">
        <Hamburger />
      </div>
      <div className="header__userbar">
        <Userbar />
      </div>
    </header>
  );
};

export default Header;
