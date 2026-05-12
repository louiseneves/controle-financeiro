/**
 * Goals Store - Zustand
 * Gerenciamento de metas financeiras
 */

import { create } from "zustand";
import {
  addDocument,
  getDocuments,
  updateDocument,
  deleteDocument,
} from "../services/firebase/firestore";
import { auth, COLLECTIONS } from "../services/firebase/config";
import NotificationService from "../services/notifications/notificationService";
import useSettingsStore from "./settingsStore";

const useGoalsStore = create((set, get) => ({
  // ==================== STATE ====================
  goals: [],
  loading: false,
  error: null,

  // ==================== LOAD ====================
  loadGoals: async (userId) => {
    if (!userId) return;

    try {
      set({ loading: true, error: null });

      const goals = await getDocuments(
        COLLECTIONS.GOALS,
        { field: "userId", operator: "==", value: userId },
        { field: "createdAt", direction: "desc" },
      );

      set({ goals, loading: false });
      return { success: true };
    } catch (error) {
      console.error("Erro ao carregar metas:", error);
      set({ error: error.message, loading: false });
      return { success: false };
    }
  },

  // ==================== ADD ====================
  // ✅ CORRIGIDO: userId vem dentro de goalData, não como parâmetro separado
  addGoal: async (goalData) => {
    if (!goalData?.userId) {
      return { success: false, error: "Usuário não autenticado" };
    }

    try {
      set({ loading: true, error: null });

      // ✅ Verificar limite de metas para usuários free
      const usePremiumStore = require("./premiumStore").default;
      const { isPremium } = usePremiumStore.getState();
      const FREE_GOALS_LIMIT = 3;

      if (!isPremium && get().goals.length >= FREE_GOALS_LIMIT) {
        set({ loading: false });
        return { success: false, error: "GOALS_LIMIT" };
      }

      const newGoal = {
        ...goalData,
        currentAmount: goalData.currentAmount || 0,
        createdAt: new Date().toISOString(),
      };

      const id = await addDocument(COLLECTIONS.GOALS, newGoal);

      set((state) => ({
        goals: [{ id, ...newGoal }, ...state.goals],
        loading: false,
      }));

      return { success: true };
    } catch (error) {
      console.error("Erro ao adicionar meta:", error);
      set({ error: error.message, loading: false });
      return { success: false, error: error.message };
    }
  },

  // ==================== UPDATE ====================
  updateGoal: async (id, data) => {
    try {
      set({ loading: true, error: null });

      await updateDocument(COLLECTIONS.GOALS, id, data);

      set((state) => ({
        goals: state.goals.map((g) => (g.id === id ? { ...g, ...data } : g)),
        loading: false,
      }));

      return { success: true };
    } catch (error) {
      console.error("Erro ao atualizar meta:", error);
      set({ error: error.message, loading: false });
      return { success: false };
    }
  },

  // ==================== PROGRESS ====================
  addToGoal: async (id, amount) => {
    try {
      const goal = get().goals.find((g) => g.id === id);
      if (!goal) {
        return { success: false, error: "Meta não encontrada" };
      }

      const newCurrentAmount =
        Number(goal.currentAmount || 0) + Number(amount || 0);

      await updateDocument(COLLECTIONS.GOALS, id, {
        currentAmount: newCurrentAmount,
        updatedAt: new Date().toISOString(),
      });

      set((state) => ({
        goals: state.goals.map((g) =>
          g.id === id ? { ...g, currentAmount: newCurrentAmount } : g,
        ),
      }));

      // 🔔 Notificação de progresso
      const settings = useSettingsStore.getState();
      if (
        settings.notifications.enabled &&
        settings.notifications.goals &&
        goal.targetAmount > 0
      ) {
        const targetAmount = Number(goal.targetAmount || 0);
        const percentage = (newCurrentAmount / targetAmount) * 100;

        NotificationService.scheduleGoalAchievementNotification(
          goal.title,
          percentage,
        );
      }

      return { success: true };
    } catch (error) {
      console.error("Erro ao adicionar valor à meta:", error);
      return { success: false, error: error.message };
    }
  },

  // ==================== DELETE ====================
  deleteGoal: async (id) => {
    try {
      set({ loading: true, error: null });

      await deleteDocument(COLLECTIONS.GOALS, id);

      set((state) => ({
        goals: state.goals.filter((g) => g.id !== id),
        loading: false,
      }));

      return { success: true };
    } catch (error) {
      console.error("Erro ao deletar meta:", error);
      set({ error: error.message, loading: false });
      return { success: false };
    }
  },

  // ==================== RESTORE ====================
  restoreGoals: async (goals) => {
    const user = auth.currentUser;

    if (!user) {
      return {
        success: false,
        error: "Usuário não autenticado",
      };
    }

    if (get().loading) return;

    try {
      set({ loading: true, error: null });

      if (!Array.isArray(goals)) {
        throw new Error("Formato inválido");
      }

      const sanitizedGoals = goals.map((goal) => {
        const { id, ...data } = goal;

        return {
          ...JSON.parse(JSON.stringify(data)),
          userId: user.uid,
          restoredAt: new Date().toISOString(),
        };
      });

      const existingGoals = get().goals;

      await Promise.all(
        existingGoals.map((goal) => deleteDocument(COLLECTIONS.GOALS, goal.id)),
      );

      const restoredGoals = await Promise.all(
        sanitizedGoals.map(async (goalData) => {
          const newId = await addDocument(COLLECTIONS.GOALS, goalData);

          return {
            id: newId,
            ...goalData,
          };
        }),
      );

      set({
        goals: restoredGoals,
      });

      return {
        success: true,
        count: restoredGoals.length,
      };
    } catch (error) {
      console.error("Erro ao restaurar metas:", error);

      set({
        error: error.message,
      });

      return {
        success: false,
        error: error.message,
      };
    } finally {
      set({ loading: false });
    }
  },

  // ==================== UTILS ====================
  clearError: () => set({ error: null }),
}));

export default useGoalsStore;
