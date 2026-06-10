import clsx from 'clsx';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import { getNavItems } from '../../constants/navigation';
import { useExpandable } from '../../hooks/useExpandable';
import Icon from '../Icon/Icon';
import MenuRenderer from '../MenuRenderer/MenuRenderer';

import './Hamburger.scss';

const Hamburger = ({ isExpanded: isInitiallyExpanded = false }) => {
  const { t } = useTranslation('components', { keyPrefix: 'navbar' });
  const { isExpanded, ref, setIsExpanded } = useExpandable(isInitiallyExpanded);

  const navItems = useMemo(() => getNavItems(t), [t]);

  const handleBlur = (e: React.FocusEvent) => {
    if (!ref.current?.contains(e.relatedTarget as Node)) {
      setIsExpanded(false);
    }
  };

  return (
    <nav className="hamburger" ref={ref} onBlur={handleBlur}>
      <button
        type="button"
        className={clsx('hamburger__menu-toggle', {
          'hamburger__menu-toggle--active': isExpanded,
        })}
        onClick={() => setIsExpanded(!isExpanded)}
        aria-expanded={isExpanded}
        aria-haspopup="true"
        aria-label={t('toggleMenu')}
      >
        <Icon name={'menu'} />
      </button>
      <div
        className={clsx('hamburger__container', { 'hamburger__container--expanded': isExpanded })}
      >
        <MenuRenderer blockName="hamburger" items={navItems} />
      </div>
    </nav>
  );
};

export default Hamburger;
