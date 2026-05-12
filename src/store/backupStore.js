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
const SUPPORTED_VERSIONS = ["1.0.0"];

export const useBackupStore = create((set, get) => ({
  backups: [],
  loading: false,
  autoBackupEnabled: true,
  lastBackup: null,

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
        JSON.stringify({
          autoBackupEnabled,
          lastBackup,
        }),
      );
    } catch (error) {
      console.error("Erro ao salvar settings:", error);
    }
  },

  toggleAutoBackup: async (enabled) => {
    set({ autoBackupEnabled: enabled });
    await get().saveSettings();
  },

  createBackup: async (isAutomatic = false, isPremium = false) => {
    if (get().loading) return;

    const user = auth.currentUser;

    if (!user) {
      throw new Error("Usuário não autenticado");
    }

    try {
      set({ loading: true });

      if (get().backups.length === 0) {
        await get().loadBackups();
      }

      const { backups } = get();

      const manualBackups = backups.filter((b) => !b.isAutomatic);

      if (
        !isPremium &&
        !isAutomatic &&
        manualBackups.length >= BACKUP_LIMIT_FREE
      ) {
        throw new Error("BACKUP_LIMIT");
      }

      const now = new Date().toISOString();

      const transactions = JSON.parse(
        JSON.stringify(useTransactionStore.getState().transactions),
      );

      const goals = JSON.parse(JSON.stringify(useGoalsStore.getState().goals));

      const budgets = JSON.parse(
        JSON.stringify(useBudgetStore.getState().budgets),
      );

      const backupData = {
        userId: user.uid,
        isAutomatic,
        version: "1.0.0",
        timestamp: now,

        metadata: {
          transactionCount: transactions.length,
          goalCount: goals.length,
          budgetCount: budgets.length,
        },

        data: {
          transactions,
          goals,
          budgets,
        },
      };

      const id = await addDocument("backups", backupData);

      const newBackup = {
        id,
        ...backupData,
      };

      set((state) => ({
        backups: [newBackup, ...state.backups],
        lastBackup: now,
      }));

      await get().saveSettings();

      return newBackup;
    } catch (error) {
      console.error("Erro ao criar backup:", error);
      throw error;
    } finally {
      set({ loading: false });
    }
  },

  loadBackups: async () => {
    const user = auth.currentUser;

    if (!user) return;

    try {
      set({ loading: true });

      const backups = await getDocuments(
        "backups",
        {
          field: "userId",
          operator: "==",
          value: user.uid,
        },
        {
          field: "timestamp",
          direction: "desc",
        },
        10,
      );

      set({ backups });
    } catch (error) {
      console.error("Erro ao carregar backups:", error);
    } finally {
      set({ loading: false });
    }
  },

  restoreBackup: async (backupId) => {
    if (get().loading) return;

    try {
      set({ loading: true });

      const backup = get().backups.find((b) => b.id === backupId);

      if (!backup?.data) {
        throw new Error("Backup inválido");
      }

      if (!SUPPORTED_VERSIONS.includes(backup.version)) {
        throw new Error("Versão incompatível");
      }

      const { transactions = [], goals = [], budgets = [] } = backup.data;

      if (!Array.isArray(transactions)) {
        throw new Error("Transactions inválidas");
      }

      if (!Array.isArray(goals)) {
        throw new Error("Goals inválidas");
      }

      if (!Array.isArray(budgets)) {
        throw new Error("Budgets inválidos");
      }

      // ✅ Depois — sequencial, seguro
      await useTransactionStore.getState().restoreTransactions(transactions);
      await useGoalsStore.getState().restoreGoals(goals);
      await useBudgetStore.getState().restoreBudgets(budgets);

      return true;
    } catch (error) {
      console.error("Erro ao restaurar:", error);
      throw error;
    } finally {
      set({ loading: false });
    }
  },

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
