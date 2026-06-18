import { Outlet } from 'react-router';

import AppErrorBoundary from '../AppErrorBoundary/AppErrorBoundary';

const ErrorBoundaryLayout = () => {
  return (
    <AppErrorBoundary>
      <Outlet />
    </AppErrorBoundary>
  );
};

export default ErrorBoundaryLayout;
