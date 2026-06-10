import React from 'react';

import type { ThemeContext as ThemeContextType } from '../@types/theme';

export const ThemeContext = React.createContext<ThemeContextType>({
  theme: 'light',
  setTheme: () => {},
});
