import clsx from 'clsx';
import { useContext } from 'react';
import { useTranslation } from 'react-i18next';

import { ThemeContext } from '../../contexts/ThemeContext';

import './ThemeToggle.scss';

const LightThemeIcon = () => {
  return (
    <svg
      className="theme-toggle__icon theme-toggle__icon--light"
      viewBox="-3 -3 96 96"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g>
        <path d="M 88 47 H 77.866 c -1.104 0 -2 -0.896 -2 -2 s 0.896 -2 2 -2 H 88 c 1.104 0 2 0.896 2 2 S 89.104 47 88 47 z" />
        <path d="M 12.134 47 H 2 c -1.104 0 -2 -0.896 -2 -2 s 0.896 -2 2 -2 h 10.134 c 1.104 0 2 0.896 2 2 S 13.239 47 12.134 47 z" />
        <path d="M 45 14.134 c -1.104 0 -2 -0.896 -2 -2 V 2 c 0 -1.104 0.896 -2 2 -2 s 2 0.896 2 2 v 10.134 C 47 13.239 46.104 14.134 45 14.134 z" />
        <path d="M 45 90 c -1.104 0 -2 -0.896 -2 -2 V 77.866 c 0 -1.104 0.896 -2 2 -2 s 2 0.896 2 2 V 88 C 47 89.104 46.104 90 45 90 z" />
        <path d="M 75.405 77.405 c -0.512 0 -1.023 -0.195 -1.414 -0.586 l -7.166 -7.166 c -0.781 -0.781 -0.781 -2.047 0 -2.828 s 2.047 -0.781 2.828 0 l 7.166 7.166 c 0.781 0.781 0.781 2.047 0 2.828 C 76.429 77.21 75.917 77.405 75.405 77.405 z" />
        <path d="M 21.76 23.76 c -0.512 0 -1.024 -0.195 -1.414 -0.586 l -7.166 -7.166 c -0.781 -0.781 -0.781 -2.047 0 -2.828 c 0.78 -0.781 2.048 -0.781 2.828 0 l 7.166 7.166 c 0.781 0.781 0.781 2.047 0 2.828 C 22.784 23.565 22.272 23.76 21.76 23.76 z" />
        <path d="M 68.239 23.76 c -0.512 0 -1.023 -0.195 -1.414 -0.586 c -0.781 -0.781 -0.781 -2.047 0 -2.828 l 7.166 -7.166 c 0.781 -0.781 2.047 -0.781 2.828 0 c 0.781 0.781 0.781 2.047 0 2.828 l -7.166 7.166 C 69.263 23.565 68.751 23.76 68.239 23.76 z" />
        <path d="M 14.594 77.405 c -0.512 0 -1.024 -0.195 -1.414 -0.586 c -0.781 -0.781 -0.781 -2.047 0 -2.828 l 7.166 -7.166 c 0.78 -0.781 2.048 -0.781 2.828 0 c 0.781 0.781 0.781 2.047 0 2.828 l -7.166 7.166 C 15.618 77.21 15.106 77.405 14.594 77.405 z" />
        <path d="M 45 66.035 c -11.599 0 -21.035 -9.437 -21.035 -21.035 S 33.401 23.965 45 23.965 S 66.035 33.401 66.035 45 S 56.599 66.035 45 66.035 z M 45 27.965 c -9.393 0 -17.035 7.642 -17.035 17.035 c 0 9.394 7.642 17.035 17.035 17.035 c 9.394 0 17.035 -7.642 17.035 -17.035 C 62.035 35.607 54.394 27.965 45 27.965 z" />
      </g>
    </svg>
  );
};

const DarkThemeIcon = () => {
  return (
    <svg
      className="theme-toggle__icon theme-toggle__icon--dark"
      viewBox="-3 -3 96 96"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g>
        <path d="M 46.607 90 c -12.452 0 -24.159 -4.849 -32.964 -13.654 c -18.176 -18.177 -18.176 -47.752 0 -65.928 c 4.469 -4.469 9.687 -7.925 15.507 -10.273 c 0.813 -0.327 1.742 -0.089 2.295 0.588 C 32 1.41 32.051 2.368 31.57 3.099 c -10.35 15.731 -8.183 36.83 5.154 50.167 l 0 0 c 13.338 13.336 34.437 15.503 50.166 5.153 c 0.73 -0.482 1.69 -0.431 2.366 0.123 c 0.678 0.555 0.915 1.484 0.588 2.296 c -2.347 5.82 -5.803 11.038 -10.272 15.508 C 70.766 85.151 59.059 90 46.607 90 z M 25.065 6.595 c -3.118 1.827 -5.994 4.051 -8.594 6.651 c -16.616 16.617 -16.616 43.654 0 60.271 C 24.521 81.567 35.223 86 46.607 86 s 22.086 -4.433 30.136 -12.482 c 2.6 -2.601 4.824 -5.477 6.651 -8.595 c -16.447 7.582 -36.384 4.285 -49.499 -8.829 l 0 0 C 20.781 42.979 17.484 23.041 25.065 6.595 z" />
      </g>
    </svg>
  );
};

const ThemeToggle = () => {
  const { theme, setTheme } = useContext(ThemeContext);
  const { t } = useTranslation('components', { keyPrefix: 'themeToggle' });
  const isDark = theme === 'dark';

  return (
    <label className="theme-toggle">
      <input
        className="theme-toggle__input"
        type="checkbox"
        checked={isDark}
        onChange={() => setTheme(isDark ? 'light' : 'dark')}
        role="switch"
        aria-label={isDark ? t('setLight') : t('setDark')}
        aria-checked={isDark}
      />
      <div className="theme-toggle__slider" aria-hidden="true">
        <LightThemeIcon />
        <DarkThemeIcon />
        <div
          className={clsx('theme-toggle__dot', {
            'theme-toggle__dot--slide': isDark,
          })}
        />
      </div>
    </label>
  );
};

export default ThemeToggle;
