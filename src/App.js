import React, { useEffect } from 'react';
import { StatusBar, Platform } from 'react-native';
import AppNavigator from './navigation/AppNavigator';
import { COLORS } from './utils';
import * as NavigationBar from 'expo-navigation-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import useAuthStore from './store/authStore';
import useSettingsStore from './store/settingsStore';

import NotificationService from './services/notifications/notificationService';
import { ThemeProvider } from './context/ThemeContext';

export default function App() {

  /* ==================== AUTH ==================== */
  const initializeAuth = useAuthStore(state => state.initializeAuth);
  const authInitialized = useAuthStore(state => state.initialized);

  /* ==================== SETTINGS ==================== */
  const loadSettings = useSettingsStore(state => state.loadSettings);
  const notifications = useSettingsStore(state => state.notifications);

  /* ==================== ANDROID NAV BAR ==================== */
  useEffect(() => {
    if (Platform.OS === 'android') {
      NavigationBar.setVisibilityAsync('visible');
      NavigationBar.setBehaviorAsync('inset');
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
  }, []);

  /* ==================== LOAD SETTINGS ==================== */
  useEffect(() => {
    loadSettings?.();
  }, []);

  /* ==================== INIT NOTIFICATIONS ==================== */
  useEffect(() => {
    NotificationService.applySettings(notifications);

  }, []);

  /* ==================== SCHEDULE NOTIFICATIONS ==================== */
  useEffect(() => {
    if (!notifications?.enabled) {
      NotificationService.cancelAll();
      return;
    }

    const [hour, minute] = (notifications.time || '09:00')
      .split(':')
      .map(Number);

    NotificationService.cancelAll();

    if (notifications.bills || notifications.dailyReminder) {
  NotificationService.scheduleBillsReminder(hour, minute);
}


    if (notifications.tithe) {
      NotificationService.scheduleTitheReminder(hour, minute);
    }

    if (notifications.goals) {
      NotificationService.scheduleGoalsReminder(hour, minute);
    }
  }, [notifications]);

  /* ==================== LOADING ==================== */
  if (!authInitialized) {
    return null;
  }

  /* ==================== APP ==================== */
  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <StatusBar
          barStyle="dark-content"
          backgroundColor={COLORS.white}
        />
        <AppNavigator />
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
