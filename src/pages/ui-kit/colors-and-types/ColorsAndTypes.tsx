import clsx from 'clsx';
import { useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

import Logo from '../../../components/Logo/Logo';
import ThemeToggle from '../../../components/ThemeToggle/ThemeToggle';
import { ThemeContext } from '../../../contexts/ThemeContext';
import { ROUTES } from '../../../routes';

import './ColorsAndTypes.scss';

type TextType = {
  type: 'h1' | 'widget' | 'label' | 'p';
  label: string;
};

type ColorValuesState = Record<(typeof COLORS)[number], string>;

const COLORS = [
  'foreground',
  'foreground-75',
  'foreground-50',
  'foreground-25',
  'foreground-05',
  'primary',
  'secondary',
] as const;

const TYPES: TextType[] = [
  { type: 'h1', label: 'H1' },
  { type: 'widget', label: 'H2' },
  { type: 'label', label: 'H3' },
  { type: 'p', label: 'Body' },
];

const ColorsAndTypes = () => {
  const { t } = useTranslation('ui-kit', { keyPrefix: 'colorsAndTypes' });
  const { theme } = useContext(ThemeContext);
  const [colorValues, setColorValues] = useState<ColorValuesState>({} as ColorValuesState);

  useEffect(() => {
    const rafId = requestAnimationFrame(() => {
      const rootStyles = getComputedStyle(document.documentElement);

      const extracted = COLORS.reduce((acc, name) => {
        const colorValue = rootStyles.getPropertyValue(`--color-${name}`).trim();

        return { ...acc, [name]: colorValue.match(/#\S*/)?.[0] ?? colorValue };
      }, {} as ColorValuesState);

      setColorValues(extracted);
    });

    return () => cancelAnimationFrame(rafId);
  }, [theme]);

  return (
    <>
      <title>{t('title')}</title>
      <div className="colors-and-types">
        <Link className="colors-and-types__logo" to={ROUTES.UI_KIT}>
          <Logo size="lg" isColored />
        </Link>
        <div className="colors-and-types__theme-toggle">
          <ThemeToggle />
        </div>
        <main className="colors-and-types__grid">
          <section className="colors-and-types__color-palette">
            <ul className="color-palette">
              {COLORS.map((name) => (
                <li key={name} className="color-palette__item">
                  <div
                    className={clsx(
                      'color-palette__sample',
                      `color-palette__sample--color-${name}`,
                    )}
                  />
                  <div className="color-palette__descr">
                    {t(name)}
                    <br />
                    <span className="color-palette__code">{colorValues[name]}</span>
                  </div>
                </li>
              ))}
            </ul>
          </section>
          <section className="colors-and-types__types">
            <ul className="types">
              {TYPES.map(({ type, label }) => (
                <li key={type} className="types__item">
                  <span className={clsx('types__label', `types__label--type-${type}`)}>
                    {label}
                  </span>
                  <span className={clsx('types__descr', `types__descr--type-${type}`)}>
                    {t(type)}
                  </span>
                </li>
              ))}
            </ul>
          </section>
        </main>
      </div>
    </>
  );
};

export default ColorsAndTypes;
