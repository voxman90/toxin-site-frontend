import type { ReactNode } from 'react';
import type { ErrorBoundaryPropsWithComponent, FallbackProps } from 'react-error-boundary';
import { ErrorBoundary } from 'react-error-boundary';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';

import { ROUTES } from '../../routes';
import ErrorView from '../ErrorView/ErrorView';

const DefaultFallback = ({ resetErrorBoundary }: FallbackProps) => {
  const { t } = useTranslation('components', { keyPrefix: 'errorBoudary.defaultFallback' });

  const handleGoHome = () => {
    resetErrorBoundary();

    window.location.href = ROUTES.LANDING;
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

type AppErrorBoundaryProps = {
  children: ReactNode;
  FallbackComponent?: React.ComponentType<FallbackProps>;
} & Omit<ErrorBoundaryPropsWithComponent, 'FallbackComponent'>;

const AppErrorBoundary = ({
  children,
  FallbackComponent,
  resetKeys = [],
  ...rest
}: AppErrorBoundaryProps) => {
  const location = useLocation();

  return (
    <ErrorBoundary
      FallbackComponent={FallbackComponent || DefaultFallback}
      resetKeys={[location.pathname, ...resetKeys]}
      {...rest}
    >
      {children}
    </ErrorBoundary>
  );
};

export default AppErrorBoundary;
