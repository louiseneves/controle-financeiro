/**
 * Settings Store - Zustand
 * Gerenciamento de configurações do app
 */

import { create } from 'zustand';
import { saveData, getData, STORAGE_KEYS } from '../services/storage/asyncStorage';
import NotificationService from '../services/notifications/notificationService';

const DEFAULT_NOTIFICATIONS = {
  enabled: true,
  bills: true,
  tithe: true,
  goals: true,
  dailyReminder: true, // ✅ ADICIONAR
  time: '09:00',
};


const useSettingsStore = create((set, get) => ({
  /* ==================== STATE ==================== */
  darkMode: false,
  currency: 'BRL',
  language: 'pt-BR',
  notifications: { ...DEFAULT_NOTIFICATIONS },
  loading: false,

  /* ==================== STATIC DATA ==================== */
  availableCurrencies: [
    { code: 'BRL', symbol: 'R$', name: 'Real Brasileiro' },
    { code: 'USD', symbol: '$', name: 'Dólar Americano' },
    { code: 'EUR', symbol: '€', name: 'Euro' },
    { code: 'GBP', symbol: '£', name: 'Libra Esterlina' },
    { code: 'ARS', symbol: '$', name: 'Peso Argentino' },
    { code: 'CLP', symbol: '$', name: 'Peso Chileno' },
  ],

  availableLanguages: [
    { code: 'pt-BR', name: 'Português (Brasil)', flag: '🇧🇷' },
    { code: 'en-US', name: 'English (US)', flag: '🇺🇸' },
    { code: 'es-ES', name: 'Español', flag: '🇪🇸' },
  ],

  /* ==================== LOAD ==================== */
  loadSettings: async () => {
  set({ loading: true });
  try {
    const settings = await getData(STORAGE_KEYS.SETTINGS);

    if (settings) {
      const notifications = {
        ...DEFAULT_NOTIFICATIONS,
        ...(settings.notifications || {}),
      };

      set({
        darkMode: settings.darkMode ?? false,
        currency: settings.currency ?? 'BRL',
        language: settings.language ?? 'pt-BR',
        notifications,
      });

      // 🔔 APLICA NOTIFICAÇÕES SALVAS
      await NotificationService.applySettings(notifications);
    }
  } catch (error) {
    console.error('Erro ao carregar configurações:', error);
  } finally {
    set({ loading: false });
  }
},


  /* ==================== SAVE ==================== */
  saveSettings: async () => {
    try {
      const { darkMode, currency, language, notifications } = get();

      await saveData(STORAGE_KEYS.SETTINGS, {
        darkMode,
        currency,
        language,
        notifications,
      });

      return { success: true };
    } catch (error) {
      console.error('Erro ao salvar configurações:', error);
      return { success: false, error: error.message };
    }
  },

  /* ==================== ACTIONS ==================== */
  toggleDarkMode: async () => {
    const newValue = !get().darkMode;
    set({ darkMode: newValue });
    await get().saveSettings();
    return newValue;
  },

  setCurrency: async (currency) => {
    set({ currency });
    await get().saveSettings();
  },

  setLanguage: async (language) => {
    set({ language });
    await get().saveSettings();
  },

  updateNotifications: async (config) => {
  const updated = {
    ...get().notifications,
    ...config,
  };

  set({ notifications: updated });

  await get().saveSettings();

  // 🔔 REAPLICA TODAS AS NOTIFICAÇÕES
  await NotificationService.applySettings(updated);
},


  setNotificationTime: async (time) => {
  const updated = {
    ...get().notifications,
    time,
  };

  set({ notifications: updated });

  await get().saveSettings();

  // ⏰ REAGENDAR COM NOVO HORÁRIO
  await NotificationService.applySettings(updated);
},



  resetSettings: async () => {
  set({
    darkMode: false,
    currency: 'BRL',
    language: 'pt-BR',
    notifications: { ...DEFAULT_NOTIFICATIONS },
  });

  await NotificationService.cancelAll();
  await NotificationService.applySettings(DEFAULT_NOTIFICATIONS);

  await get().saveSettings();
},


  /* ==================== HELPERS ==================== */
  getCurrencySymbol: () => {
    const { currency, availableCurrencies } = get();
    return availableCurrencies.find(c => c.code === currency)?.symbol || 'R$';
  },

  formatCurrency: (value) => {
    const symbol = get().getCurrencySymbol();
    const formatted = Math.abs(value).toLocaleString('pt-BR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
    return `${symbol} ${formatted}`;
  },

  getTheme: () => {
    return get().darkMode
      ? {
          background: '#121212',
          card: '#1E1E1E',
          text: '#FFFFFF',
          textSecondary: '#B0B0B0',
          border: '#2C2C2C',
          primary: '#2196F3',
          success: '#4CAF50',
          danger: '#f44336',
          warning: '#FF9800',
          income: '#4CAF50',
          expense: '#f44336',
        }
      : {
          background: '#f5f5f5',
          card: '#FFFFFF',
          text: '#333333',
          textSecondary: '#666666',
          border: '#e0e0e0',
          primary: '#2196F3',
          success: '#4CAF50',
          danger: '#f44336',
          warning: '#FF9800',
          income: '#4CAF50',
          expense: '#f44336',
        };
  },
}));

export default useSettingsStore;
