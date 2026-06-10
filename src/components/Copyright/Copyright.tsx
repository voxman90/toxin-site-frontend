import { useTranslation } from 'react-i18next';

import './Copyright.scss';

interface CopyrightProps {
  year: number | string;
}

const Copyright = ({ year }: CopyrightProps) => {
  const { t } = useTranslation('components', { keyPrefix: 'copyright' });

  return <div className="copyright">{t('text', { year })}</div>;
};

export default Copyright;
