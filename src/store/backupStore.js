import { create } from "zustand";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { auth } from "../services/firebase/config";
import {
  addDocument,
  getDocuments,
  deleteDocument,
} from "../services/firebase/firestore";

import useTransactionStore from "./transactionStore";
import useGoalsStore from "./goalsStore";
import useBudgetStore from "./budgetStore";

const BACKUP_LIMIT_FREE = 3;

export const useBackupStore = create((set, get) => ({
  backups: [],
  loading: false,
  autoBackupEnabled: true,
  lastBackup: null,

  // ================= SETTINGS =================
  loadSettings: async () => {
    try {
      const settings = await AsyncStorage.getItem("backupSettings");
      if (settings) {
        const parsed = JSON.parse(settings);
        set({
          autoBackupEnabled: parsed.autoBackupEnabled ?? true,
          lastBackup: parsed.lastBackup ?? null,
        });
      }
    } catch (error) {
      console.error("Erro ao carregar settings:", error);
    }
  },

  saveSettings: async () => {
    try {
      const { autoBackupEnabled, lastBackup } = get();
      await AsyncStorage.setItem(
        "backupSettings",
        JSON.stringify({ autoBackupEnabled, lastBackup }),
      );
    } catch (error) {
      console.error("Erro ao salvar settings:", error);
    }
  },

  toggleAutoBackup: async (enabled) => {
    set({ autoBackupEnabled: enabled });
    await get().saveSettings();
  },

  // ================= CREATE =================
  createBackup: async (isAutomatic = false, isPremium = false) => {
    const user = auth.currentUser;
    if (!user) throw new Error("Usuário não autenticado");

    const { backups } = get();

    // ✅ Conta apenas backups manuais no limite gratuito
    const manualBackups = backups.filter((b) => !b.isAutomatic);
    if (
      !isPremium &&
      !isAutomatic &&
      manualBackups.length >= BACKUP_LIMIT_FREE
    ) {
      throw new Error("BACKUP_LIMIT");
    }

    set({ loading: true });

    try {
      const now = new Date().toISOString();

      const backupData = {
        userId: user.uid,
        isAutomatic,
        version: "1.0.0",
        timestamp: now,
        data: {
          transactions: useTransactionStore.getState().transactions,
          goals: useGoalsStore.getState().goals,
          budgets: useBudgetStore.getState().budgets,
        },
      };

      const id = await addDocument("backups", backupData);

      const newBackup = { id, ...backupData };

      set((state) => ({
        backups: [newBackup, ...state.backups],
        lastBackup: now,
        loading: false,
      }));

      await get().saveSettings();

      return newBackup;
    } catch (error) {
      console.error("Erro ao criar backup:", error);
      set({ loading: false });
      throw error;
    }
  },

  // ================= LOAD =================
  loadBackups: async () => {
    const user = auth.currentUser;
    if (!user) return;

    set({ loading: true });

    try {
      const backups = await getDocuments(
        "backups",
        { field: "userId", operator: "==", value: user.uid },
        { field: "timestamp", direction: "desc" },
        10,
      );

      set({ backups, loading: false });
    } catch (error) {
      console.error("Erro ao carregar backups:", error);
      set({ loading: false });
    }
  },

  // ================= RESTORE =================
  restoreBackup: async (backupId) => {
    set({ loading: true });

    try {
      const backup = get().backups.find((b) => b.id === backupId);
      if (!backup || !backup.data) {
        throw new Error("Backup inválido");
      }

      const { data } = backup;

      await useTransactionStore
        .getState()
        .restoreTransactions(data.transactions || []);

      await useGoalsStore.getState().restoreGoals(data.goals || []);

      await useBudgetStore.getState().restoreBudgets(data.budgets || []);

      set({ loading: false });
      return true;
    } catch (error) {
      console.error("Erro ao restaurar:", error);
      set({ loading: false });
      throw error;
    }
  },

  // ================= DELETE =================
  deleteBackup: async (backupId) => {
    try {
      await deleteDocument("backups", backupId);

      set((state) => ({
        backups: state.backups.filter((b) => b.id !== backupId),
      }));
    } catch (error) {
      console.error("Erro ao deletar:", error);
      throw error;
    }
  },

  // ================= EXPORT =================
  exportBackupJSON: async () => {
    try {
      const data = {
        timestamp: new Date().toISOString(),
        version: "1.0.0",
        data: {
          transactions: useTransactionStore.getState().transactions,
          goals: useGoalsStore.getState().goals,
          budgets: useBudgetStore.getState().budgets,
        },
      };

      return JSON.stringify(data, null, 2);
    } catch (error) {
      console.error("Erro export JSON:", error);
      throw error;
    }
  },

  // ================= IMPORT =================
  importBackupJSON: async (jsonString) => {
    set({ loading: true });

    try {
      const parsed = JSON.parse(jsonString);

      if (!parsed?.data) {
        throw new Error("Formato inválido");
      }

      const { data } = parsed;

      await useTransactionStore
        .getState()
        .restoreTransactions(data.transactions || []);

      await useGoalsStore.getState().restoreGoals(data.goals || []);

      await useBudgetStore.getState().restoreBudgets(data.budgets || []);

      set({ loading: false });
      return true;
    } catch (error) {
      console.error("Erro import:", error);
      set({ loading: false });
      throw error;
    }
  },
}));
