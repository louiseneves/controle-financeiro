/**
 * Settings Store - CORRIGIDO
 * Gerenciamento de configurações com dark mode funcional
 */

import { create } from "zustand";
import {
  saveData,
  getData,
  STORAGE_KEYS,
} from "../services/storage/asyncStorage";
import NotificationService from "../services/notifications/notificationService";
import { convertFromBRL } from "../services/currency/currencyService";

const EXCHANGE_RATES = {
  BRL: 1,
  USD: 0.2, // exemplo
  EUR: 0.18,
  GBP: 0.15,
  ARS: 55,
  CLP: 180,
  PYG: 1450,
  UYU: 7.8,
};

const DEFAULT_NOTIFICATIONS = {
  enabled: true,
  bills: true,
  tithe: true,
  goals: true,
  dailyReminder: true,
  time: "20:00",
};

const useSettingsStore = create((set, get) => ({
  /* ==================== STATE ==================== */
  darkMode: true, // ✅ TRUE por padrão (modo escuro)
  currency: "BRL",
  language: "pt-BR",
  notifications: { ...DEFAULT_NOTIFICATIONS },
  loading: false,

  /* ==================== STATIC DATA ==================== */
  availableCurrencies: [
    { code: "BRL", symbol: "R$", name: "Real Brasileiro", flag: "🇧🇷" },
    { code: "USD", symbol: "$", name: "Dólar Americano", flag: "🇺🇸" },
    { code: "EUR", symbol: "€", name: "Euro", flag: "🇪🇺" },
    { code: "GBP", symbol: "£", name: "Libra Esterlina", flag: "🇬🇧" },
    { code: "ARS", symbol: "$", name: "Peso Argentino", flag: "🇦🇷" },
    { code: "CLP", symbol: "$", name: "Peso Chileno", flag: "🇨🇱" },
    { code: "PYG", symbol: "₲", name: "Guarani Paraguaio", flag: "🇵🇾" },
    { code: "UYU", symbol: "$", name: "Peso Uruguaio", flag: "🇺🇾" },
  ],

  availableLanguages: [
    { code: "pt-BR", name: "Português (Brasil)", flag: "🇧🇷" },
    { code: "en-US", name: "English (US)", flag: "🇺🇸" },
    { code: "es-ES", name: "Español", flag: "🇪🇸" },
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
          darkMode: settings.darkMode ?? true,
          currency: settings.currency ?? "BRL",
          language: settings.language ?? "pt-BR",
          notifications,
          loading: false,
        });

        // ✅ Aplicar notificações APÓS carregar configurações
        await NotificationService.applySettings(notifications);
      } else {
        await get().saveSettings();
        set({ loading: false });
      }
    } catch (error) {
      console.error("Erro ao carregar configurações:", error);
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
      console.error("Erro ao salvar configurações:", error);
      return { success: false, error: error.message };
    }
  },

  updateNotifications: async (config) => {
    const updated = {
      ...get().notifications,
      ...config,
    };

    set({ notifications: updated });
    await get().saveSettings();

    // ✅ Aplicar as novas configurações (cancela antigas, agenda novas)
    await NotificationService.applySettings(updated);
  },

  /* ==================== ACTIONS ==================== */
  toggleDarkMode: async () => {
    const newValue = !get().darkMode;
    set({ darkMode: newValue });
    await get().saveSettings();
    return newValue;
  },

  setDarkMode: async (value) => {
    set({ darkMode: value });
    await get().saveSettings();
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
    await NotificationService.applySettings(updated);
  },

  setNotificationTime: async (time) => {
    const updated = {
      ...get().notifications,
      time,
    };

    set({ notifications: updated });
    await get().saveSettings();
    await NotificationService.applySettings(updated);
  },

  resetSettings: async () => {
    set({
      darkMode: true, // ✅ TRUE por padrão
      currency: "BRL",
      language: "pt-BR",
      notifications: { ...DEFAULT_NOTIFICATIONS },
    });

    await NotificationService.cancelAll();
    await NotificationService.applySettings(DEFAULT_NOTIFICATIONS);
    await get().saveSettings();
  },

  /* ==================== HELPERS ==================== */
  getCurrencySymbol: () => {
    const { currency, availableCurrencies } = get();
    return availableCurrencies.find((c) => c.code === currency)?.symbol || "R$";
  },

  getCurrencyData: () => {
    const { currency, availableCurrencies } = get();
    return (
      availableCurrencies.find((c) => c.code === currency) ||
      availableCurrencies[0]
    );
  },

  convertFromBRL: (value) => {
    const { currency } = get();
    const rate = EXCHANGE_RATES[currency] ?? 1;

    const num = typeof value === "number" ? value : parseFloat(value) || 0;
    return num * rate;
  },

  formatCurrency: (value) => {
    const { currency } = get();
    const converted = get().convertFromBRL(value);

    const localeMap = {
      BRL: "pt-BR",
      USD: "en-US",
      EUR: "pt-PT",
      GBP: "en-GB",
      ARS: "es-AR",
      CLP: "es-CL",
      PYG: "es-PY",
      UYU: "es-UY",
    };

    const locale = localeMap[currency] || "pt-BR";

    try {
      return new Intl.NumberFormat(locale, {
        style: "currency",
        currency,
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(converted);
    } catch {
      return `${currency} ${converted.toFixed(2)}`;
    }
  },

  getTheme: () => {
    const darkMode = get().darkMode;

    return {
      dark: darkMode,
      colors: darkMode
        ? {
            // Modo Escuro
            primary: "#3B82F6",
            primaryDark: "#2563EB",
            primaryLight: "#60A5FA",
            secondary: "#8B5CF6",
            success: "#10B981",
            error: "#EF4444",
            warning: "#F59E0B",
            info: "#3B82F6",
            income: "#10B981",
            expense: "#EF4444",
            investment: "#8B5CF6",
            offer: "#F59E0B",
            tithe: "#6366F1",
            background: "#0F172A",
            backgroundSecondary: "#1E293B",
            card: "#1E293B",
            surface: "#334155",
            text: "#F1F5F9",
            textSecondary: "#CBD5E1",
            textTertiary: "#94A3B8",
            border: "#334155",
            borderLight: "#475569",
            overlay: "rgba(0, 0, 0, 0.7)",
            disabled: "#475569",
            placeholder: "#64748B",
            inputBackground: "#1E293B",
            inputBorder: "#334155",
            buttonDisabled: "#475569",
            shadow: "rgba(0, 0, 0, 0.5)",
          }
        : {
            // Modo Claro
            primary: "#2563EB",
            primaryDark: "#1E40AF",
            primaryLight: "#60A5FA",
            secondary: "#8B5CF6",
            success: "#10B981",
            error: "#EF4444",
            warning: "#F59E0B",
            info: "#3B82F6",
            income: "#10B981",
            expense: "#EF4444",
            investment: "#8B5CF6",
            offer: "#F59E0B",
            tithe: "#6366F1",
            background: "#F8FAFC",
            backgroundSecondary: "#F1F5F9",
            card: "#FFFFFF",
            surface: "#F1F5F9",
            text: "#0F172A",
            textSecondary: "#475569",
            textTertiary: "#64748B",
            border: "#E2E8F0",
            borderLight: "#F1F5F9",
            overlay: "rgba(0, 0, 0, 0.5)",
            disabled: "#CBD5E1",
            placeholder: "#94A3B8",
            inputBackground: "#FFFFFF",
            inputBorder: "#E2E8F0",
            buttonDisabled: "#CBD5E1",
            shadow: "rgba(0, 0, 0, 0.1)",
          },
    };
  },
}));

export default useSettingsStore;
