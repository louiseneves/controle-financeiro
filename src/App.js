import React, { useEffect } from "react";
import { StatusBar, Platform } from "react-native";
import AppNavigator from "./navigation/AppNavigator";
import * as NavigationBar from "expo-navigation-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";

import useAuthStore from "./store/authStore";
import useSettingsStore from "./store/settingsStore";
import NotificationService from "./services/notifications/notificationService";
import { ThemeProvider, useTheme } from "./context/ThemeContext";

function AppContent() {
  const { colors, dark } = useTheme();

  return (
    <>
      <StatusBar
        barStyle={dark ? "light-content" : "dark-content"}
        backgroundColor={colors.statusBar}
        translucent={false}
      />

      <AppNavigator />
    </>
  );
}

export default function App() {
  const initializeAuth = useAuthStore((state) => state.initializeAuth);

  const authInitialized = useAuthStore((state) => state.initialized);

  const loadSettings = useSettingsStore((state) => state.loadSettings);

  // =========================
  // ANDROID NAVIGATION BAR
  // =========================

  useEffect(() => {
    if (Platform.OS === "android") {
      NavigationBar.setVisibilityAsync("visible");
    }
  }, []);

  // =========================
  // AUTH
  // =========================

  useEffect(() => {
    const unsubscribe = initializeAuth?.();

    return () => {
      if (typeof unsubscribe === "function") {
        unsubscribe();
      }
    };
  }, [initializeAuth]);

  // =========================
  // APP INIT
  // =========================

  useEffect(() => {
    const initializeApp = async () => {
      try {
        console.log("🚀 Inicializando aplicativo...");

        await NotificationService.init();

        console.log("✅ NotificationService inicializado");

        await loadSettings();

        console.log("✅ Settings carregados");

        console.log("✅ Aplicativo inicializado com sucesso!");
      } catch (error) {
        console.error("❌ Erro ao inicializar app:", error);
      }
    };

    initializeApp();
  }, [loadSettings]);

  // =========================
  // LOADING
  // =========================

  if (!authInitialized) {
    return null;
  }

  // =========================
  // RENDER
  // =========================

  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <AppContent />
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
