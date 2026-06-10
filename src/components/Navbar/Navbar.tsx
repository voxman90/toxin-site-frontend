import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import { getNavItems } from '../../constants/navigation';
import MenuRenderer from '../MenuRenderer/MenuRenderer';

import './Navbar.scss';

const Navbar = () => {
  const { t } = useTranslation('components', { keyPrefix: 'navbar' });

  const navItems = useMemo(() => getNavItems(t), [t]);

  return (
    <nav className="navbar" aria-label={t('main')}>
      <MenuRenderer blockName="navbar" items={navItems} />
    </nav>
  );
};

export default Navbar;
