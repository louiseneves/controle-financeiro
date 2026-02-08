import React, { createContext, useContext, useEffect } from 'react';
import { useColorScheme } from 'react-native';
import useSettingsStore from '../store/settingsStore';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const darkMode = useSettingsStore(state => state.darkMode);
  const systemColorScheme = useColorScheme();

  // Se darkMode for null/undefined, usar preferência do sistema
  const isDark = darkMode ?? (systemColorScheme === 'dark');

  const theme = {
    dark: isDark,
    colors: isDark ? {
      // Modo Escuro
      primary: '#1E40AF',
      primaryDark: '#2563EB',
      primaryLight: '#60A5FA',
      
      
      secondary: '#8B5CF6',
      secondaryDark: '#7C3AED',
      secondaryLight: '#A78BFA',
      
      success: '#10B981',
      successDark: '#059669',
      successLight: '#34D399',
      
      error: '#EF4444',
      errorDark: '#DC2626',
      errorLight: '#F87171',
      
      warning: '#F59E0B',
      warningDark: '#D97706',
      warningLight: '#FBBF24',
      
      info: '#3B82F6',
      
      // Cores de transação
      income: '#10B981',
      expense: '#EF4444',
      investment: '#8B5CF6',
      offer: '#F59E0B',
      tithe: '#6366F1',
      
      // Backgrounds
      background: '#0F172A', // Slate 900
      backgroundSecondary: '#1E293B', // Slate 800
      card: '#1E293B', // Slate 800
      surface: '#334155', // Slate 700
      
      // Texto
      text: '#F1F5F9', // Slate 100
      textSecondary: '#CBD5E1', // Slate 300
      textTertiary: '#94A3B8', // Slate 400
      onPrimary: '#FFFFFF',
      
      // Bordas
      border: '#334155', // Slate 700
      borderLight: '#475569', // Slate 600
      
      // Outros
      overlay: 'rgba(0, 0, 0, 0.7)',
      disabled: '#475569', // Slate 600
      placeholder: '#64748B', // Slate 500
      
      // Específicos para componentes
      inputBackground: '#1E293B',
      inputBorder: '#334155',
      buttonDisabled: '#475569',
      shadow: 'rgba(0, 0, 0, 0.5)',
      
      // Status bar
      statusBar: '#0F172A',
      statusBarStyle: 'light-content',

      //Suporte tela cores
      supportCards: {
        primary: '#1E3A5F',    // azul escuro elegante
        secondary: '#3B2F4A',  // roxo escuro
        tertiary: '#4A3A1E',   // laranja/marrom escuro
      },

      modeSelectorBg: '#1F2933',

    } : {
      // Modo Claro
      primary: '#2563EB',
      primaryDark: '#1E40AF',
      primaryLight: '#60A5FA',
      
      secondary: '#8B5CF6',
      secondaryDark: '#6D28D9',
      secondaryLight: '#A78BFA',
      
      success: '#10B981',
      successDark: '#036344',
      successLight: '#34D399',
      
      error: '#EF4444',
      errorDark: '#DC2626',
      errorLight: '#F87171',
      
      warning: '#F59E0B',
      warningDark: '#D97706',
      warningLight: '#FBBF24',
      
      info: '#3B82F6',
      
      // Cores de transação
      income: '#10B981',
      expense: '#EF4444',
      investment: '#8B5CF6',
      offer: '#F59E0B',
      tithe: '#6366F1',
      
      // Backgrounds
      background: '#F8FAFC', // Slate 50
      backgroundSecondary: '#F1F5F9', // Slate 100
      card: '#FFFFFF',
      surface: '#F1F5F9', // Slate 100
      
      // Texto
      text: '#0F172A', // Slate 900
      textSecondary: '#475569', // Slate 600
      textTertiary: '#64748B', // Slate 500
      onPrimary: '#FFFFFF',
      
      // Bordas
      border: '#E2E8F0', // Slate 200
      borderLight: '#F1F5F9', // Slate 100
      
      // Outros
      overlay: 'rgba(0, 0, 0, 0.5)',
      disabled: '#CBD5E1', // Slate 300
      placeholder: '#94A3B8', // Slate 400
      
      // Específicos para componentes
      inputBackground: '#FFFFFF',
      inputBorder: '#E2E8F0',
      buttonDisabled: '#CBD5E1',
      shadow: 'rgba(0, 0, 0, 0.1)',
      
      // Status bar
      statusBar: '#FFFFFF',
        statusBarStyle: 'dark-content',
      
        // Cores específicas para a tela de suporte
    supportCards: {
      primary: '#E3F2FD',
      secondary: '#F3E5F5',
      tertiary: '#FFF3E0',
        },
    modeSelectorBg: '#E5E7EB',
    },

    
  };

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

export default ThemeContext;