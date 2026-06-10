import { FormProvider, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

import Footer from '../../../components/Footer/Footer';
import FooterCreative from '../../../components/FooterCreative/FooterCreative';
import Header from '../../../components/Header/Header';
import LangSelector from '../../../components/LangSelector/LangSelector';
import Logo from '../../../components/Logo/Logo';
import ThemeToggle from '../../../components/ThemeToggle/ThemeToggle';
import { ROUTES } from '../../../routes';

import './HeadersAndFooters.scss';

const HeadersAndFooters = () => {
  const methods = useForm();
  const { t } = useTranslation('ui-kit', { keyPrefix: 'headersAndFooters' });

  return (
    <FormProvider {...methods}>
      <title>{t('title')}</title>
      <div className="headers-and-footers">
        <header>
          <Link className="headers-and-footers__logo" to={ROUTES.UI_KIT}>
            <Logo size="lg" isColored isSigned />
          </Link>
          <LangSelector />
          <ThemeToggle />
        </header>
        <div className="headers-and-footers__wrapper">
          <div className="headers-and-footers__header">
            <Header />
          </div>
          <div className="headers-and-footers__footer">
            <Footer />
          </div>
          <div className="headers-and-footers__footer-creative">
            <FooterCreative />
          </div>
        </div>
      </div>
    </FormProvider>
  );
};

export default HeadersAndFooters;
