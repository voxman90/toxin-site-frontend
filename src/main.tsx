import i18next from 'i18next';
import I18nextBrowserLanguageDetector from 'i18next-browser-languagedetector';
import React from 'react';
import { createRoot } from 'react-dom/client';
import { I18nextProvider, initReactI18next } from 'react-i18next';
import { Provider } from 'react-redux';

import App from './App.tsx';
import './index.css';
import resources from './locales/resources.ts';
import ThemeProvider from './providers/ThemeProvider.tsx';
import store from './slices/store.ts';

const lngDetectionOptions = {
  order: ['querystring', 'localStorage', 'navigator'],
  caches: ['localStorage'],
  lookupLocalStorage: 'i18nextLng',
};

const i18nextConfig = {
  debug: true,
  defaultNS: 'components',
  detection: lngDetectionOptions,
  fallbackLng: 'ru',
  interpolation: {
    escapeValue: false,
  },
  supportedLng: ['en', 'ru'],
  resources,
};

const app = async () => {
  await i18next.use(initReactI18next).use(I18nextBrowserLanguageDetector).init(i18nextConfig);

  const container = document.getElementById('root');

  if (!container) {
    throw new Error('Failed to find the root element');
  }

  createRoot(container).render(
    <React.StrictMode>
      <Provider store={store}>
        <I18nextProvider i18n={i18next}>
          <ThemeProvider>
            <App />
          </ThemeProvider>
        </I18nextProvider>
      </Provider>
    </React.StrictMode>,
  );
};

app();
