import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { DarkTheme, DefaultTheme, Theme } from '@react-navigation/native';
import { useColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SystemUI from 'expo-system-ui';
import { darkColors, lightColors, ThemeColors } from '../styles/theme';

type ThemeContextData = {
  isDarkMode: boolean;
  colors: ThemeColors;
  navigationTheme: Theme;
  toggleTheme: () => Promise<void>;
};

const THEME_KEY = '@app:theme';
const ThemeContext = createContext<ThemeContextData | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const systemScheme = useColorScheme();
  const [preference, setPreference] = useState<'light' | 'dark' | null>(null);

  useEffect(() => {
    AsyncStorage.getItem(THEME_KEY)
      .then((savedTheme) => {
        if (savedTheme === 'dark' || savedTheme === 'light') setPreference(savedTheme);
      })
      .catch(() => undefined);
  }, []);

  const isDarkMode = preference ? preference === 'dark' : systemScheme === 'dark';
  const colors = isDarkMode ? darkColors : lightColors;

  useEffect(() => {
    SystemUI.setBackgroundColorAsync(colors.background).catch(() => undefined);
  }, [colors.background]);

  async function toggleTheme() {
    const nextPreference = isDarkMode ? 'light' : 'dark';
    setPreference(nextPreference);
    await AsyncStorage.setItem(THEME_KEY, nextPreference);
  }

  const navigationTheme = useMemo<Theme>(() => {
    const base = isDarkMode ? DarkTheme : DefaultTheme;
    return {
      ...base,
      colors: {
        ...base.colors,
        primary: colors.green,
        background: colors.background,
        card: colors.surface,
        text: colors.textPrimary,
        border: colors.divider,
        notification: colors.danger,
      },
    };
  }, [colors, isDarkMode]);

  return (
    <ThemeContext.Provider value={{ isDarkMode, colors, navigationTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useTheme deve ser usado dentro de ThemeProvider');
  return context;
}
