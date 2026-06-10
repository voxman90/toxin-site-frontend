import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import { getFooterNavItems } from '../../constants/navigation';
import { NOOP } from '../Calendar/Calendar.constants';
import Copyright from '../Copyright/Copyright';
import Heading from '../Heading/Heading';
import Link from '../Link/Link';
import Logo from '../Logo/Logo';
import SocialFollow from '../SocialFollow/SocialFollow';
import SubscriptionField from '../SubscriptionField/SubscriptionField';

import './Footer.scss';

const Footer = () => {
  const { t } = useTranslation('components', { keyPrefix: 'footer' });

  const navGroups = useMemo(() => getFooterNavItems(t), [t]);

  return (
    <footer className="footer">
      <div className="footer__top">
        <section className="footer__info">
          <a href="/" className="footer__logo" aria-label={t('logo')}>
            <Logo size="sm" isColored isSigned />
          </a>
          <p className="footer__idea">{t('idea')}</p>
        </section>
        <nav className="footer__nav">
          {navGroups.map(({ heading, items }) => (
            <section key={heading} className="footer__nav-group">
              <Heading type="label">{heading}</Heading>
              <ul className="footer__nav-group-items">
                {items.map(({ href, text }) => (
                  <li key={text} className="footer__nav-group-item">
                    <Link href={href} text={text} />
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </nav>
        <section className="footer__subscription">
          <Heading type="label">{t('subscriptionHeading')}</Heading>
          <p className="footer__subscription-text">{t('subscriptionText')}</p>
          <SubscriptionField name="subEmail" onSubscribe={NOOP} />
        </section>
      </div>
      <div className="footer__bottom">
        <Copyright year={2026} />
        <SocialFollow />
      </div>
    </footer>
  );
};

export default Footer;
