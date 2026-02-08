import React, { useEffect } from 'react';
import { StatusBar, Platform } from 'react-native';
import AppNavigator from './navigation/AppNavigator';
import * as NavigationBar from 'expo-navigation-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import useAuthStore from './store/authStore';
import useSettingsStore from './store/settingsStore';
import NotificationService from './services/notifications/notificationService';
import { ThemeProvider, useTheme } from './context/ThemeContext';

function AppContent() {
  const { colors, dark } = useTheme();

  return (
    <>
      <StatusBar
        barStyle={dark ? 'light-content' : 'dark-content'}
        backgroundColor={colors.background}
        translucent={false}
      />
      <AppNavigator />
    </>
  );
}

export default function App() {
  /* ==================== SELECTORS ==================== */
  const initializeAuth = useAuthStore(state => state.initializeAuth);
  const authInitialized = useAuthStore(state => state.initialized);
  const loadSettings = useSettingsStore(state => state.loadSettings);

  /* ==================== ANDROID NAV BAR ==================== */
  useEffect(() => {
    if (Platform.OS === 'android') {
      NavigationBar.setVisibilityAsync('visible');
      NavigationBar.setBehaviorAsync('inset-swipe');
      NavigationBar.setBackgroundColorAsync('#0F172A'); // Modo escuro
    }
  }, []);

  /* ==================== INIT AUTH ==================== */
  useEffect(() => {
    const unsubscribe = initializeAuth?.();
    
    return () => {
      if (typeof unsubscribe === 'function') {
        unsubscribe();
      }
    };
  }, [initializeAuth]);

  /* ==================== INIT APP ==================== */
  useEffect(() => {
    const initializeApp = async () => {
      try {
        console.log('🚀 Inicializando aplicativo...');

        // 1. Inicializar NotificationService
        await NotificationService.init();
        console.log('✅ NotificationService inicializado');

        // 2. Carregar settings (já aplica notificações)
        await loadSettings();
        console.log('✅ Settings carregados');

        console.log('✅ Aplicativo inicializado com sucesso!');
      } catch (error) {
        console.error('❌ Erro ao inicializar app:', error);
      }
    };

    initializeApp();
  }, [loadSettings]);

  /* ==================== LOADING ==================== */
  if (!authInitialized) {
    return null; // TODO: Adicionar splash screen aqui
  }

  /* ==================== RENDER ==================== */
  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <AppContent />
      </ThemeProvider>
    </SafeAreaProvider>
  );
}