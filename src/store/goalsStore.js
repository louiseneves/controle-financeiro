/**
 * Goals Store - Zustand
 * Gerenciamento de metas financeiras
 */

import { create } from 'zustand';
import {
  addDocument,
  getDocuments,
  updateDocument,
  deleteDocument,
} from '../services/firebase/firestore';
import { COLLECTIONS } from '../services/firebase/config';
import NotificationService from '../services/notifications/notificationService';
import useSettingsStore from './settingsStore';

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
        { field: 'userId', operator: '==', value: userId },
        { field: 'createdAt', direction: 'desc' }
      );

      set({ goals, loading: false });
      return { success: true };
    } catch (error) {
      console.error('Erro ao carregar metas:', error);
      set({ error: error.message, loading: false });
      return { success: false };
    }
  },

  // ==================== ADD ====================
  addGoal: async (goalData, userId) => {
    if (!userId) {
      return { success: false, error: 'Usuário não autenticado' };
    }

    try {
      set({ loading: true, error: null });

      const newGoal = {
        ...goalData,
        userId,
        currentAmount: goalData.currentAmount || 0,
        createdAt: new Date().toISOString(),
      };

      const id = await addDocument(COLLECTIONS.GOALS, newGoal);

      set(state => ({
        goals: [{ id, ...newGoal }, ...state.goals],
        loading: false,
      }));

      return { success: true };
    } catch (error) {
      console.error('Erro ao adicionar meta:', error);
      set({ error: error.message, loading: false });
      return { success: false };
    }
  },

  // ==================== UPDATE ====================
  updateGoal: async (id, data) => {
    try {
      set({ loading: true, error: null });

      await updateDocument(COLLECTIONS.GOALS, id, data);

      set(state => ({
        goals: state.goals.map(g =>
          g.id === id ? { ...g, ...data } : g
        ),
        loading: false,
      }));

      return { success: true };
    } catch (error) {
      console.error('Erro ao atualizar meta:', error);
      set({ error: error.message, loading: false });
      return { success: false };
    }
  },

  // ==================== PROGRESS ====================
  addToGoal: async (id, amount) => {
    try {
      const goal = get().goals.find(g => g.id === id);
      if (!goal) {
        return { success: false, error: 'Meta não encontrada' };
      }

      const newCurrentAmount =
        Number(goal.currentAmount || 0) + Number(amount || 0);

      await updateDocument(COLLECTIONS.GOALS, id, {
        currentAmount: newCurrentAmount,
        updatedAt: new Date().toISOString(),
      });

      set(state => ({
        goals: state.goals.map(g =>
          g.id === id
            ? { ...g, currentAmount: newCurrentAmount }
            : g
        ),
      }));

      // 🔔 Notificação de progresso
      const settings = useSettingsStore.getState();
      if (
        settings.notifications.enabled &&
        settings.notifications.goals &&
        goal.targetAmount > 0
      ) {
        const percentage =
          (newCurrentAmount / goal.targetAmount) * 100;

        NotificationService.scheduleGoalAchievementNotification(
          goal.name,
          percentage
        );
      }

      return { success: true };
    } catch (error) {
      console.error('Erro ao adicionar valor à meta:', error);
      return { success: false, error: error.message };
    }
  },

  // ==================== DELETE ====================
  deleteGoal: async (id) => {
    try {
      set({ loading: true, error: null });

      await deleteDocument(COLLECTIONS.GOALS, id);

      set(state => ({
        goals: state.goals.filter(g => g.id !== id),
        loading: false,
      }));

      return { success: true };
    } catch (error) {
      console.error('Erro ao deletar meta:', error);
      set({ error: error.message, loading: false });
      return { success: false };
    }
  },

  restoreGoals: async (goals) => {
  const user = auth.currentUser;
  if (!user) {
    return { success: false, error: 'Usuário não autenticado' };
  }

  try {
    set({ loading: true, error: null });

    const existingGoals = get().goals;
    for (const goal of existingGoals) {
      await deleteDocument(COLLECTIONS.GOALS, goal.id);
    }

    const restoredGoals = [];
    for (const goal of goals) {
      const { id, ...data } = goal;
      
      const newGoalData = {
        ...data,
        userId: user.uid,
        restoredAt: new Date().toISOString(),
      };

      const newId = await addDocument(COLLECTIONS.GOALS, newGoalData);
      restoredGoals.push({ id: newId, ...newGoalData });
    }

    set({ goals: restoredGoals, loading: false });
    
    console.log(`✅ ${restoredGoals.length} metas restauradas`);
    return { success: true, count: restoredGoals.length };
  } catch (error) {
    console.error('❌ Erro ao restaurar metas:', error);
    set({ error: error.message, loading: false });
    return { success: false, error: error.message };
  }
},

  // ==================== UTILS ====================
  clearError: () => set({ error: null }),
}));

export default useGoalsStore;
