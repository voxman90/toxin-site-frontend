import clsx from 'clsx';
import { useTranslation } from 'react-i18next';

import Button from '../Button';
import Icon from '../Icon/Icon';

import './MiniErrorPlaceholder.scss';

interface MiniErrorPlaceholderProps {
  message: string;
  onRetry: () => void;
  className?: string;
}

const MiniErrorPlaceholder = ({ message, className, onRetry }: MiniErrorPlaceholderProps) => {
  const { t } = useTranslation('components', { keyPrefix: 'miniErrorPlaceholder' });
  return (
    <div className={clsx('mini-error-placeholder', className)}>
      <div className="mini-error-placeholder__content">
        <Icon name="report_problem" className="mini-error-placeholder__icon" size="lg" />
        <p className="mini-error-placeholder__message">{message}</p>
        <Button size="content" variant="text" type="button" onClick={onRetry}>
          {t('onRetry')}
        </Button>
      </div>
    </div>
  );
};

export default MiniErrorPlaceholder;
