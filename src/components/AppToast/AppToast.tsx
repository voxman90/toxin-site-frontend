import { useContext } from 'react';
import type { Theme as ToastTheme } from 'react-toastify';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import type { Theme } from '../../@types/theme';
import { ThemeContext } from '../../contexts/ThemeContext';

const toToastTheme = (theme: Theme): ToastTheme => {
  if (theme === 'dark') return 'dark';
  if (theme === 'light') return 'light';
  return 'colored';
};

export const AppToast = () => {
  const { theme } = useContext(ThemeContext);

  return <ToastContainer position="top-right" theme={toToastTheme(theme)} />;
};
