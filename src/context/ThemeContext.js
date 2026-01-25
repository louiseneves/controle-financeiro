import React, { createContext, useContext } from 'react';
import useSettingsStore from '../store/settingsStore';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const { getTheme } = useSettingsStore();
  const theme = getTheme();

  return (
    <ThemeContext.Provider value={theme}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme deve ser usado dentro de ThemeProvider');
  }
  return context;
};