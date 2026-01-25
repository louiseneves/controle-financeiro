// src/services/SettingsService.js
/**
 * Serviço de Configurações
 * Gerencia preferências, modo escuro, moeda, idioma, notificações
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import { Appearance } from 'react-native';

const STORAGE_KEYS = {
  THEME: 'app_theme',
  CURRENCY: 'app_currency',
  LANGUAGE: 'app_language',
  NOTIFICATIONS: 'app_notifications',
  NOTIFICATION_BILLS: 'notification_bills',
  NOTIFICATION_TITHE: 'notification_tithe',
  NOTIFICATION_GOALS: 'notification_goals',
  NOTIFICATION_TIME: 'notification_time',
};

class SettingsService {
  constructor() {
    this.defaultSettings = {
      theme: 'auto', // auto, light, dark
      currency: 'BRL',
      language: 'pt-BR',
      notifications: {
        enabled: true,
        bills: true,
        tithe: true,
        goals: true,
        time: '09:00',
      },
    };
  }

  // ==================== TEMA ====================

  // Obter tema atual
  async getTheme() {
    try {
      const theme = await AsyncStorage.getItem(STORAGE_KEYS.THEME);
      return theme || this.defaultSettings.theme;
    } catch (error) {
      console.error('Erro ao obter tema:', error);
      return this.defaultSettings.theme;
    }
  }

  // Salvar tema
  async setTheme(theme) {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.THEME, theme);
      return { success: true };
    } catch (error) {
      console.error('Erro ao salvar tema:', error);
      throw error;
    }
  }

  // Verificar se está em modo escuro
  async isDarkMode() {
    try {
      const theme = await this.getTheme();
      
      if (theme === 'dark') {
        return true;
      } else if (theme === 'light') {
        return false;
      } else {
        // Auto - usar preferência do sistema
        const colorScheme = Appearance.getColorScheme();
        return colorScheme === 'dark';
      }
    } catch (error) {
      return false;
    }
  }

  // Opções de tema
  getThemeOptions() {
    return [
      { id: 'auto', label: 'Automático', description: 'Seguir sistema', icon: 'theme-light-dark' },
      { id: 'light', label: 'Claro', description: 'Sempre claro', icon: 'white-balance-sunny' },
      { id: 'dark', label: 'Escuro', description: 'Sempre escuro', icon: 'weather-night' },
    ];
  }

  // ==================== MOEDA ====================

  // Obter moeda atual
  async getCurrency() {
    try {
      const currency = await AsyncStorage.getItem(STORAGE_KEYS.CURRENCY);
      return currency || this.defaultSettings.currency;
    } catch (error) {
      console.error('Erro ao obter moeda:', error);
      return this.defaultSettings.currency;
    }
  }

  // Salvar moeda
  async setCurrency(currency) {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.CURRENCY, currency);
      return { success: true };
    } catch (error) {
      console.error('Erro ao salvar moeda:', error);
      throw error;
    }
  }

  // Lista de moedas disponíveis
  getCurrencies() {
    return [
      { id: 'BRL', name: 'Real Brasileiro', symbol: 'R$', flag: '🇧🇷' },
      { id: 'USD', name: 'Dólar Americano', symbol: '$', flag: '🇺🇸' },
      { id: 'EUR', name: 'Euro', symbol: '€', flag: '🇪🇺' },
      { id: 'GBP', name: 'Libra Esterlina', symbol: '£', flag: '🇬🇧' },
      { id: 'ARS', name: 'Peso Argentino', symbol: '$', flag: '🇦🇷' },
      { id: 'CLP', name: 'Peso Chileno', symbol: '$', flag: '🇨🇱' },
      { id: 'PYG', name: 'Guarani Paraguaio', symbol: '₲', flag: '🇵🇾' },
      { id: 'UYU', name: 'Peso Uruguaio', symbol: '$', flag: '🇺🇾' },
    ];
  }

  // Formatar valor com moeda
  async formatCurrency(value) {
    try {
      const currency = await this.getCurrency();
      const currencyData = this.getCurrencies().find(c => c.id === currency);
      
      if (!currencyData) {
        return `R$ ${value.toFixed(2)}`;
      }

      // Formatação básica
      const formatted = value.toFixed(2).replace('.', ',').replace(/\B(?=(\d{3})+(?!\d))/g, '.');
      return `${currencyData.symbol} ${formatted}`;
    } catch (error) {
      return `R$ ${value.toFixed(2)}`;
    }
  }

  // ==================== IDIOMA ====================

  // Obter idioma atual
  async getLanguage() {
    try {
      const language = await AsyncStorage.getItem(STORAGE_KEYS.LANGUAGE);
      return language || this.defaultSettings.language;
    } catch (error) {
      console.error('Erro ao obter idioma:', error);
      return this.defaultSettings.language;
    }
  }

  // Salvar idioma
  async setLanguage(language) {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.LANGUAGE, language);
      return { success: true };
    } catch (error) {
      console.error('Erro ao salvar idioma:', error);
      throw error;
    }
  }

  // Lista de idiomas disponíveis
  getLanguages() {
    return [
      { id: 'pt-BR', name: 'Português (Brasil)', flag: '🇧🇷' },
      { id: 'en-US', name: 'English (US)', flag: '🇺🇸' },
      { id: 'es-ES', name: 'Español', flag: '🇪🇸' },
    ];
  }

  // ==================== NOTIFICAÇÕES ====================

  // Obter configurações de notificações
  async getNotificationSettings() {
    try {
      const enabled = await AsyncStorage.getItem(STORAGE_KEYS.NOTIFICATIONS);
      const bills = await AsyncStorage.getItem(STORAGE_KEYS.NOTIFICATION_BILLS);
      const tithe = await AsyncStorage.getItem(STORAGE_KEYS.NOTIFICATION_TITHE);
      const goals = await AsyncStorage.getItem(STORAGE_KEYS.NOTIFICATION_GOALS);
      const time = await AsyncStorage.getItem(STORAGE_KEYS.NOTIFICATION_TIME);

      return {
        enabled: enabled === null ? true : enabled === 'true',
        bills: bills === null ? true : bills === 'true',
        tithe: tithe === null ? true : tithe === 'true',
        goals: goals === null ? true : goals === 'true',
        time: time || '09:00',
      };
    } catch (error) {
      console.error('Erro ao obter configurações de notificações:', error);
      return this.defaultSettings.notifications;
    }
  }

  // Salvar configuração de notificação
  async setNotificationSetting(key, value) {
    try {
      const storageKey = STORAGE_KEYS[`NOTIFICATION_${key.toUpperCase()}`] || STORAGE_KEYS.NOTIFICATIONS;
      await AsyncStorage.setItem(storageKey, value.toString());
      return { success: true };
    } catch (error) {
      console.error('Erro ao salvar configuração de notificação:', error);
      throw error;
    }
  }

  // Ativar/Desativar todas as notificações
  async toggleNotifications(enabled) {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, enabled.toString());
      return { success: true };
    } catch (error) {
      console.error('Erro ao alterar notificações:', error);
      throw error;
    }
  }

  // Definir horário das notificações
  async setNotificationTime(time) {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.NOTIFICATION_TIME, time);
      return { success: true };
    } catch (error) {
      console.error('Erro ao salvar horário:', error);
      throw error;
    }
  }

  // ==================== CONFIGURAÇÕES GERAIS ====================

  // Obter todas as configurações
  async getAllSettings() {
    try {
      const theme = await this.getTheme();
      const currency = await this.getCurrency();
      const language = await this.getLanguage();
      const notifications = await this.getNotificationSettings();

      return {
        theme,
        currency,
        language,
        notifications,
      };
    } catch (error) {
      console.error('Erro ao obter configurações:', error);
      return this.defaultSettings;
    }
  }

  // Resetar todas as configurações
  async resetSettings() {
    try {
      await AsyncStorage.multiRemove([
        STORAGE_KEYS.THEME,
        STORAGE_KEYS.CURRENCY,
        STORAGE_KEYS.LANGUAGE,
        STORAGE_KEYS.NOTIFICATIONS,
        STORAGE_KEYS.NOTIFICATION_BILLS,
        STORAGE_KEYS.NOTIFICATION_TITHE,
        STORAGE_KEYS.NOTIFICATION_GOALS,
        STORAGE_KEYS.NOTIFICATION_TIME,
      ]);

      return { success: true };
    } catch (error) {
      console.error('Erro ao resetar configurações:', error);
      throw error;
    }
  }

  // Exportar configurações
  async exportSettings() {
    try {
      const settings = await this.getAllSettings();
      return JSON.stringify(settings, null, 2);
    } catch (error) {
      console.error('Erro ao exportar configurações:', error);
      throw error;
    }
  }

  // Importar configurações
  async importSettings(settingsJson) {
    try {
      const settings = JSON.parse(settingsJson);

      if (settings.theme) await this.setTheme(settings.theme);
      if (settings.currency) await this.setCurrency(settings.currency);
      if (settings.language) await this.setLanguage(settings.language);
      
      if (settings.notifications) {
        await this.toggleNotifications(settings.notifications.enabled);
        if (settings.notifications.bills !== undefined) {
          await this.setNotificationSetting('bills', settings.notifications.bills);
        }
        if (settings.notifications.tithe !== undefined) {
          await this.setNotificationSetting('tithe', settings.notifications.tithe);
        }
        if (settings.notifications.goals !== undefined) {
          await this.setNotificationSetting('goals', settings.notifications.goals);
        }
        if (settings.notifications.time) {
          await this.setNotificationTime(settings.notifications.time);
        }
      }

      return { success: true };
    } catch (error) {
      console.error('Erro ao importar configurações:', error);
      throw error;
    }
  }
}

export default new SettingsService();