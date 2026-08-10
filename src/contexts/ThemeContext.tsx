import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

type ThemeContextData = {
  isDarkMode: boolean;
  toggleTheme: () => void;
};


const ThemeContext = createContext<ThemeContextData>({} as ThemeContextData);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [isDarkMode, setIsDarkMode] = useState(false);

  
  useEffect(() => {
    async function loadTheme() {
      const savedTheme = await AsyncStorage.getItem('@app:theme');
      if (savedTheme === 'dark') {
        setIsDarkMode(true);
      }
    }
    loadTheme();
  }, []);

  
  async function toggleTheme() {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    await AsyncStorage.setItem('@app:theme', newMode ? 'dark' : 'light');
  }

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}


export function useTheme() {
  return useContext(ThemeContext);
}