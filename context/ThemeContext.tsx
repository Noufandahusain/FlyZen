import { createContext, useContext, ReactNode } from 'react';
import { useColorScheme } from 'react-native';

type ThemeColors = {
  primary: string;
  secondary: string;
  accent: string;
  success: string;
  warning: string;
  error: string;
  background: string;
  cardBackground: string;
  text: string;
  textSecondary: string;
  border: string;
  white: string;
};

type ThemeContextType = {
  colors: ThemeColors;
  isDark: boolean;
};

const lightColors: ThemeColors = {
  primary: '#4A90E2',
  secondary: '#2C3E50',
  accent: '#F4D03F',
  success: '#2ECC71',
  warning: '#F39C12',
  error: '#E74C3C',
  background: '#F5F7FA',
  cardBackground: '#FFFFFF',
  text: '#1A1A1A',
  textSecondary: '#7A7A7A',
  border: '#E0E0E0',
  white: '#FFFFFF',
};

const darkColors: ThemeColors = {
  primary: '#5A9FF2',
  secondary: '#3D556B',
  accent: '#F7DC6F',
  success: '#2ECC71',
  warning: '#F39C12',
  error: '#E74C3C',
  background: '#121212',
  cardBackground: '#1E1E1E',
  text: '#F5F5F5',
  textSecondary: '#A0A0A0',
  border: '#2C2C2C',
  white: '#FFFFFF',
};

const ThemeContext = createContext<ThemeContextType>({
  colors: lightColors,
  isDark: false,
});

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const colors = isDark ? darkColors : lightColors;

  return (
    <ThemeContext.Provider value={{ colors, isDark }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);