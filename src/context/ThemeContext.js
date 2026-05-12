/**
 * Theme Context - COMPLETO E OTIMIZADO
 */

import React, { createContext, useContext, useMemo } from "react";

import { useColorScheme } from "react-native";

import useSettingsStore from "../store/settingsStore";

/* =========================================================
 * CONTEXT
 * =======================================================*/

const ThemeContext = createContext(null);

/* =========================================================
 * THEME PROVIDER
 * =======================================================*/

export const ThemeProvider = ({ children }) => {
  const darkMode = useSettingsStore((state) => state.darkMode);

  const systemColorScheme = useColorScheme();

  /* =========================================================
   * DARK MODE
   * =======================================================*/

  // ✅ Se não existir configuração salva,
  // usa tema do sistema

  const isDark = darkMode ?? systemColorScheme === "dark";

  /* =========================================================
   * THEME MEMO
   * Evita rerenders desnecessários
   * =======================================================*/

  const theme = useMemo(
    () => ({
      dark: isDark,

      colors: isDark
        ? {
            /* =====================================================
             * DARK MODE
             * ===================================================*/

            /* =========================
             * PRIMARY
             * =======================*/

            primary: "#2563EB",
            primaryDark: "#1D4ED8",
            primaryLight: "#60A5FA",

            /* =========================
             * SECONDARY
             * =======================*/

            secondary: "#8B5CF6",
            secondaryDark: "#7C3AED",
            secondaryLight: "#A78BFA",

            /* =========================
             * SUCCESS
             * =======================*/

            success: "#10B981",
            successDark: "#059669",
            successLight: "#34D399",

            /* =========================
             * ERROR
             * =======================*/

            error: "#EF4444",
            errorDark: "#DC2626",
            errorLight: "#F87171",

            /* =========================
             * WARNING
             * =======================*/

            warning: "#F59E0B",
            warningDark: "#D97706",
            warningLight: "#FBBF24",

            info: "#3B82F6",

            /* =========================
             * BALANCE CARD
             * =======================*/

            balanceCard: "#1E40AF",

            /* =========================
             * TRANSACTIONS
             * =======================*/

            income: "#22C55E",

            // ✅ Vermelho harmonizado
            // com azul primário

            expense: "#FF6161",

            investment: "#8B5CF6",

            offer: "#F59E0B",

            tithe: "#6366F1",

            incomeOnInvestment: "#34D399",

            /* =========================
             * BACKGROUNDS
             * =======================*/

            background: "#0F172A",

            backgroundSecondary: "#1E293B",

            card: "#1E293B",

            surface: "#334155",

            /* =========================
             * TEXT
             * =======================*/

            text: "#F1F5F9",

            textSecondary: "#CBD5E1",

            textTertiary: "#94A3B8",

            onPrimary: "#FFFFFF",

            /* =========================
             * BORDERS
             * =======================*/

            border: "#334155",

            borderLight: "#475569",

            /* =========================
             * INPUTS
             * =======================*/

            inputBackground: "#1E293B",

            inputBorder: "#334155",

            placeholder: "#64748B",

            /* =========================
             * BUTTONS
             * =======================*/

            buttonDisabled: "#475569",

            disabled: "#475569",

            /* =========================
             * OVERLAY
             * =======================*/

            overlay: "rgba(0,0,0,0.7)",

            shadow: "rgba(0,0,0,0.5)",

            /* =========================
             * STATUS BAR
             * =======================*/

            statusBar: "#0F172A",

            statusBarStyle: "light-content",

            /* =========================
             * SUPPORT SCREEN
             * =======================*/

            supportCards: {
              primary: "#1E3A5F",

              secondary: "#3B2F4A",

              tertiary: "#4A3A1E",
            },

            /* =========================
             * OTHERS
             * =======================*/

            modeSelectorBg: "#1F2933",
          }
        : {
            /* =====================================================
             * LIGHT MODE
             * ===================================================*/

            /* =========================
             * PRIMARY
             * =======================*/

            primary: "#2563EB",
            primaryDark: "#1E40AF",
            primaryLight: "#60A5FA",

            /* =========================
             * SECONDARY
             * =======================*/

            secondary: "#8B5CF6",
            secondaryDark: "#6D28D9",
            secondaryLight: "#A78BFA",

            /* =========================
             * SUCCESS
             * =======================*/

            success: "#10B981",
            successDark: "#047857",
            successLight: "#34D399",

            /* =========================
             * ERROR
             * =======================*/

            error: "#EF4444",
            errorDark: "#DC2626",
            errorLight: "#F87171",

            /* =========================
             * WARNING
             * =======================*/

            warning: "#F59E0B",
            warningDark: "#D97706",
            warningLight: "#FBBF24",

            info: "#3B82F6",

            /* =========================
             * BALANCE CARD
             * =======================*/

            balanceCard: "#4389E4",

            /* =========================
             * TRANSACTIONS
             * =======================*/

            income: "#4ADE80",

            // ✅ Vermelho harmonizado
            // com azul principal

            expense: "#E03131",

            investment: "#8B5CF6",

            offer: "#F59E0B",

            tithe: "#6366F1",

            incomeOnInvestment: "#10B981",

            /* =========================
             * BACKGROUNDS
             * =======================*/

            background: "#F8FAFC",

            backgroundSecondary: "#F1F5F9",

            card: "#FFFFFF",

            surface: "#F1F5F9",

            /* =========================
             * TEXT
             * =======================*/

            text: "#0F172A",

            textSecondary: "#475569",

            textTertiary: "#64748B",

            onPrimary: "#FFFFFF",

            /* =========================
             * BORDERS
             * =======================*/

            border: "#E2E8F0",

            borderLight: "#F1F5F9",

            /* =========================
             * INPUTS
             * =======================*/

            inputBackground: "#FFFFFF",

            inputBorder: "#E2E8F0",

            placeholder: "#94A3B8",

            /* =========================
             * BUTTONS
             * =======================*/

            buttonDisabled: "#CBD5E1",

            disabled: "#CBD5E1",

            /* =========================
             * OVERLAY
             * =======================*/

            overlay: "rgba(0,0,0,0.5)",

            shadow: "rgba(0,0,0,0.1)",

            /* =========================
             * STATUS BAR
             * =======================*/

            statusBar: "#FFFFFF",

            statusBarStyle: "dark-content",

            /* =========================
             * SUPPORT SCREEN
             * =======================*/

            supportCards: {
              primary: "#E3F2FD",

              secondary: "#F3E5F5",

              tertiary: "#FFF3E0",
            },

            /* =========================
             * OTHERS
             * =======================*/

            modeSelectorBg: "#E5E7EB",
          },
    }),
    [isDark],
  );

  return (
    <ThemeContext.Provider value={theme}>{children}</ThemeContext.Provider>
  );
};

/* =========================================================
 * HOOK
 * =======================================================*/

export const useTheme = () => {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error("useTheme deve ser usado dentro de ThemeProvider");
  }

  return context;
};

export default ThemeContext;
