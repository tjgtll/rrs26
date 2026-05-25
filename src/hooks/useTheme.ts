import { useContext } from 'react';
import { ThemeContext } from '../contexts/themeContext';

export const useTheme = () => {
  const context = useContext(ThemeContext);
  return context;
};