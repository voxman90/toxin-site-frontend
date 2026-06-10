import clsx from 'clsx';
import type { FocusEvent } from 'react';
import { useTranslation } from 'react-i18next';

import type { ExpandableNavItem, NavItem } from '../../constants/navigation';
import { useExpandable } from '../../hooks/useExpandable';
import Icon from '../Icon/Icon';
import Link from '../Link/Link';

interface MenuRendererProps {
  items: (NavItem | ExpandableNavItem)[];
  blockName: 'navbar' | 'hamburger';
}

interface MenuItemProps {
  item: NavItem | ExpandableNavItem;
  blockName: string;
}

const isExpandableNavItem = (item: NavItem | ExpandableNavItem): item is ExpandableNavItem => {
  return 'isExpandable' in item;
};

const MenuItem = ({ item, blockName }: MenuItemProps) => {
  const { t } = useTranslation('components', { keyPrefix: 'navbar' });
  const { ref, isExpanded, setIsExpanded } = useExpandable<HTMLLIElement>(false);
  const { text, href } = item;

  const handleBlur = (e: FocusEvent) => {
    if (!ref.current?.contains(e.relatedTarget as Node)) {
      setIsExpanded(false);
    }
  };

  return isExpandableNavItem(item) ? (
    <li className={`${blockName}__item`} ref={ref} onBlur={handleBlur}>
      <div className={`${blockName}__item-head`}>
        <Link text={text} href={href} />
        <button
          type="button"
          className={clsx(`${blockName}__submenu-toggle`, {
            [`${blockName}__submenu-toggle--active`]: isExpanded,
          })}
          onClick={() => setIsExpanded(!isExpanded)}
          aria-expanded={isExpanded}
          aria-label={t('toggleSubmenu', { name: text })}
        >
          <Icon name="expand_more" />
        </button>
      </div>
      <ul
        className={clsx(`${blockName}__submenu`, isExpanded && `${blockName}__submenu--expanded`)}
      >
        {item.submenuItems.map((sub: NavItem) => (
          <li key={sub.text} className={`${blockName}__submenu-item`}>
            <Link text={sub.text} href={sub.href} className={`${blockName}__submenu-link`} />
          </li>
        ))}
      </ul>
    </li>
  ) : (
    <li className={`${blockName}__item`}>
      <Link text={text} href={href} />
    </li>
  );
};

const MenuRenderer = ({ items, blockName }: MenuRendererProps) => {
  return (
    <ul className={`${blockName}__menu`}>
      {items.map((item) => (
        <MenuItem key={item.text} item={item} blockName={blockName} />
      ))}
    </ul>
  );
};

export default MenuRenderer;
