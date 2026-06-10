import type { ReactNode } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import type { FallbackProps } from 'react-error-boundary';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import { ROUTES } from '../../routes';
import ErrorView from '../ErrorView/ErrorView';

const DefaultFallback = ({ resetErrorBoundary }: FallbackProps) => {
  const { t } = useTranslation('components', { keyPrefix: 'errorBoudary.defaultFallback' });
  const navigate = useNavigate();

  const handleGoHome = () => {
    resetErrorBoundary();
    navigate(ROUTES.LANDING);
  };

  return (
    <ErrorView
      title={t('title')}
      message={t('message')}
      onRetry={handleGoHome}
      btnText={t('btnText')}
    />
  );
};

interface AppErrorBoundaryProps {
  children: ReactNode;
  FallbackComponent?: React.ComponentType<FallbackProps>;
}

const AppErrorBoundary = ({ children, FallbackComponent }: AppErrorBoundaryProps) => {
  return (
    <ErrorBoundary FallbackComponent={FallbackComponent || DefaultFallback}>
      {children}
    </ErrorBoundary>
  );
};

export default AppErrorBoundary;
