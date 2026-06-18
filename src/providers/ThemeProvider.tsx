import { useCallback, useEffect, useMemo, useState } from 'react';
import type { PropsWithChildren } from 'react';

import type { Theme } from '../@types/theme';
import { ThemeContext } from '../contexts/ThemeContext';

const THEMES: Theme[] = ['dark', 'light'];

const isTheme = (str: string): str is Theme => THEMES.includes(str as Theme);

const getTheme = (): Theme => {
  if (!window) {
    return 'light';
  }

  const saved = localStorage.getItem('theme');
  if (saved && isTheme(saved)) {
    return saved;
  }

  const userMedia = window.matchMedia('(prefers-color-scheme: dark)');
  return userMedia.matches ? 'dark' : 'light';
};

const ThemeProvider = ({ children }: PropsWithChildren) => {
  const [theme, setThemeState] = useState(getTheme());

  const setTheme = useCallback((newTheme: Theme) => {
    setThemeState(newTheme);
    document.documentElement.dataset.theme = newTheme;
    localStorage.setItem('theme', newTheme);
  }, []);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
  }, []);

  const contextValue = useMemo(() => ({ theme, setTheme }), [theme, setTheme]);

  return <ThemeContext.Provider value={contextValue}>{children}</ThemeContext.Provider>;
};

export default ThemeProvider;
