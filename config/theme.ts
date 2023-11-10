import { copy } from 'copy-anything';
import { merge } from 'merge-anything';
import { MD3DarkTheme, MD3LightTheme, MD3Theme } from 'react-native-paper';

export const THEME = {
  colors: {
    primary: '#0077F2',
    secondary: '#0077F2',
    tertiary: '#78829D',
    error: '#F5324A',
    outline: '#E1E7F3',
    errorContainer: '#F5324A',
  },
  // animation: {
  //   defaultAnimationDuration: 300,
  //   scale: 2,
  // },
} as MD3Theme;

export const themes = {
  light: copy(merge(MD3LightTheme, THEME)) as MD3Theme,
  dark: copy(merge(MD3DarkTheme, THEME)) as MD3Theme,
};
