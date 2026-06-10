import { createContext, useContext } from 'react';

import type FocusController from './FocusController';

export const FocusContext = createContext<FocusController | null>(null);

export const useFocus = () => {
  const context = useContext(FocusContext);

  if (!context) {
    throw new Error('useFocus must be used within FocusContext.Provider');
  }

  return context;
};
