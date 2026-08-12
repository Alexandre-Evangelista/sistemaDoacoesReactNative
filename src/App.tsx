import React from 'react';
import { StatusBar } from 'expo-status-bar';
import AppRoutes from './routes/AppRoutes';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider, useTheme } from './contexts/ThemeContext';

function AppContent() {
  const { isDarkMode } = useTheme();

  return (
    <AuthProvider>
      <StatusBar style={isDarkMode ? 'light' : 'dark'} />
      <AppRoutes />
    </AuthProvider>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}
