import type { ChangeEvent } from 'react';
import { useTranslation } from 'react-i18next';

import './LangSelector.scss';

const LangSelector = () => {
  const { i18n, t } = useTranslation('components', { keyPrefix: 'langSelector' });

  const handleChange = (e: ChangeEvent<HTMLSelectElement>) => {
    i18n.changeLanguage(e.target.value);
  };

  return (
    <div className="lang-selector">
      <select
        id="lang-select"
        className="lang-selector__select"
        value={i18n.language}
        onChange={handleChange}
        aria-label={t('select')}
      >
        <option value="en-EN">🇬🇧 English</option>
        <option value="ru-RU">🇷🇺 Русский</option>
      </select>
    </div>
  );
};

export default LangSelector;
