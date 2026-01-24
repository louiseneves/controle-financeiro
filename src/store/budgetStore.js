/**
 * Budget Store - Zustand
 * Gerenciamento de orçamentos mensais
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
import useTransactionStore from './transactionStore';

const useBudgetStore = create((set, get) => ({
  // ==================== STATE ====================
  budgets: [],
  loading: false,
  error: null,

  // ==================== LOAD ====================
  loadBudgets: async (userId) => {
    if (!userId) return;

    try {
      set({ loading: true, error: null });

      const budgets = await getDocuments(
        COLLECTIONS.PLANNING,
        { field: 'userId', operator: '==', value: userId },
        { field: 'month', direction: 'desc' }
      );

      set({ budgets, loading: false });
      return { success: true };
    } catch (error) {
      console.error('Erro ao carregar orçamentos:', error);
      set({ error: error.message, loading: false });
      return { success: false };
    }
  },

  // ==================== ADD ====================
  addBudget: async (budgetData, userId) => {
    if (!userId) {
      return { success: false, error: 'Usuário não autenticado' };
    }

    try {
      set({ loading: true, error: null });

      const newBudget = {
        ...budgetData,
        userId,
        createdAt: new Date().toISOString(),
      };

      const id = await addDocument(COLLECTIONS.PLANNING, newBudget);

      set(state => ({
        budgets: [{ id, ...newBudget }, ...state.budgets],
        loading: false,
      }));

      return { success: true };
    } catch (error) {
      console.error('Erro ao adicionar orçamento:', error);
      set({ error: error.message, loading: false });
      return { success: false };
    }
  },

  // ==================== UPDATE ====================
  updateBudget: async (id, data) => {
    try {
      set({ loading: true, error: null });

      await updateDocument(COLLECTIONS.PLANNING, id, data);

      set(state => ({
        budgets: state.budgets.map(b =>
          b.id === id ? { ...b, ...data } : b
        ),
        loading: false,
      }));

      return { success: true };
    } catch (error) {
      console.error('Erro ao atualizar orçamento:', error);
      set({ error: error.message, loading: false });
      return { success: false };
    }
  },

  // ==================== DELETE ====================
  deleteBudget: async (id) => {
    try {
      set({ loading: true, error: null });

      await deleteDocument(COLLECTIONS.PLANNING, id);

      set(state => ({
        budgets: state.budgets.filter(b => b.id !== id),
        loading: false,
      }));

      return { success: true };
    } catch (error) {
      console.error('Erro ao deletar orçamento:', error);
      set({ error: error.message, loading: false });
      return { success: false };
    }
  },

  // ==================== GET CURRENT ====================
  getCurrentMonthBudget: () => {
    const now = new Date();
    const currentMonth = `${now.getFullYear()}-${String(
      now.getMonth() + 1
    ).padStart(2, '0')}`;

    return get().budgets.find(b => b.month === currentMonth) || null;
  },

  // ==================== ALERTS ====================
  checkBudgetAlerts: () => {
    const settings = useSettingsStore.getState();
    if (!settings.notifications.enabled || !settings.notifications.bills) {
      return;
    }

    const { budgets } = get();
    const { transactions } = useTransactionStore.getState();

    const now = new Date();
    const month = now.getMonth();
    const year = now.getFullYear();

    budgets.forEach(budget => {
      const spent = transactions
        .filter(t => {
          const d = new Date(t.date);
          return (
            t.type === 'despesa' &&
            t.category === budget.category &&
            d.getMonth() === month &&
            d.getFullYear() === year
          );
        })
        .reduce((sum, t) => sum + Number(t.amount || 0), 0);

      if (!budget.amount || budget.amount <= 0) return;

      const percentage = (spent / budget.amount) * 100;

      NotificationService.scheduleBudgetWarning(
        budget.category,
        percentage
      );
    });
  },

  // ==================== UTILS ====================
  clearError: () => set({ error: null }),
}));

export default useBudgetStore;
