export type Theme = 'dark' | 'light';

export interface ThemeContext {
  theme: Theme;
  setTheme: (newTheme: Theme) => void;
}

export interface ColorPalette {
  textShade: string;
  textShade05: string;
  textShade25: string;
  textShade50: string;
  textShade75: string;
  textShade100: string;
  background: string;
  primary: string;
  primaryGradient: string;
  secondary: string;
  secondaryGradient: string;
}
