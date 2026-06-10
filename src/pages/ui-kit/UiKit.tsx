import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

import LangSelector from '../../components/LangSelector/LangSelector';
import ThemeToggle from '../../components/ThemeToggle/ThemeToggle';
import { ROUTES } from '../../routes';

import './UiKit.scss';

const UiKit = () => {
  const { t } = useTranslation('ui-kit');

  return (
    <div className="ui-kit">
      <title>Ui-Kit</title>
      <header>
        <LangSelector />
        <ThemeToggle />
      </header>
      <main>
        <h1>UI KIT</h1>
        <ul className="ui-kit__pages">
          <li>
            <Link to={ROUTES.CARDS}>{t('cards.title')}</Link>
          </li>
          <li>
            <Link to={ROUTES.COLORS_AND_TYPES}>{t('colorsAndTypes.title')}</Link>
          </li>
          <li>
            <Link to={ROUTES.FORM_ELEMENTS}>{t('formElements.title')}</Link>
          </li>
          <li>
            <Link to={ROUTES.HEADERS_AND_FOOTERS}>{t('headersAndFooters.title')}</Link>
          </li>
        </ul>
      </main>
    </div>
  );
};

export default UiKit;
