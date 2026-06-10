import { useTranslation } from 'react-i18next';

import Icon from '../Icon/Icon';

import './SocialFollow.scss';

interface SocialFollowItem {
  href: string;
  name: string;
  label: string;
}

const DEFAULT_ITEMS: SocialFollowItem[] = [
  { href: '#', name: '', label: 'x (Twitter)' },
  { href: '#', name: '', label: 'Facebook' },
  { href: '#', name: '', label: 'Instagram' },
];

const SocialFollow = ({ items = DEFAULT_ITEMS }) => {
  const { t } = useTranslation('components', { keyPrefix: 'socialFollow' });

  return (
    <nav className="social-follow" aria-label={t('label')}>
      <ul className="social-follow__items">
        {items.map(({ href, name, label }) => (
          <li key={name} className="social-follow__item">
            <a
              href={href}
              className="social-follow__link"
              target="_blank"
              rel="noopener noreferrer"
              aria-label={label}
            >
              <Icon name={name} font="awesome" />
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default SocialFollow;
