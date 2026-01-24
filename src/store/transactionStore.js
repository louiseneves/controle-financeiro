/**
 * Transaction Store - Zustand
 * Gerenciamento de transações
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

const useTransactionStore = create((set, get) => ({
  // ==================== STATE ====================
  transactions: [],
  loading: false,
  error: null,

  // ==================== LOAD ====================
  loadTransactions: async (userId) => {
    if (!userId) return;

    try {
      set({ loading: true, error: null });

      const transactions = await getDocuments(
        COLLECTIONS.TRANSACTIONS,
        { field: 'userId', operator: '==', value: userId },
        { field: 'date', direction: 'desc' }
      );

      set({ transactions, loading: false });
      return { success: true };
    } catch (error) {
      console.error('Erro ao carregar transações:', error);
      set({ error: error.message, loading: false });
      return { success: false };
    }
  },

  // ==================== ADD ====================
  addTransaction: async (transaction, userId) => {
    if (!userId) {
      return { success: false, error: 'Usuário não autenticado' };
    }

    try {
      set({ loading: true, error: null });

      const newTransaction = {
        ...transaction,
        userId,
        createdAt: new Date().toISOString(),
      };

      const id = await addDocument(COLLECTIONS.TRANSACTIONS, newTransaction);

      set(state => ({
        transactions: [{ id, ...newTransaction }, ...state.transactions],
        loading: false,
      }));

      // 🔔 Notificação
      const settings = useSettingsStore.getState();
      if (settings.notifications.enabled) {
        NotificationService.showNotification(
          '✅ Transação registrada',
          `${settings.formatCurrency(transaction.amount)} adicionada com sucesso`
        );
      }

      return { success: true };
    } catch (error) {
      console.error('Erro ao adicionar transação:', error);
      set({ error: error.message, loading: false });
      return { success: false };
    }
  },

  // ==================== UPDATE ====================
  updateTransaction: async (id, data) => {
    try {
      set({ loading: true, error: null });

      await updateDocument(COLLECTIONS.TRANSACTIONS, id, data);

      set(state => ({
        transactions: state.transactions.map(t =>
          t.id === id ? { ...t, ...data } : t
        ),
        loading: false,
      }));

      return { success: true };
    } catch (error) {
      console.error('Erro ao atualizar transação:', error);
      set({ error: error.message, loading: false });
      return { success: false };
    }
  },

  // ==================== DELETE ====================
  deleteTransaction: async (id) => {
    try {
      set({ loading: true, error: null });

      await deleteDocument(COLLECTIONS.TRANSACTIONS, id);

      set(state => ({
        transactions: state.transactions.filter(t => t.id !== id),
        loading: false,
      }));

      return { success: true };
    } catch (error) {
      console.error('Erro ao deletar transação:', error);
      set({ error: error.message, loading: false });
      return { success: false };
    }
  },

  // ==================== SUMMARY ====================
  getSummary: () => {
    const { transactions } = get();

    const sumByType = (type) =>
      transactions
        .filter(t => t.type === type)
        .reduce((sum, t) => sum + Number(t.amount || 0), 0);

    const income = sumByType('receita');
    const expense = sumByType('despesa');
    const investment = sumByType('investimento');
    const offer = sumByType('oferta');

    return {
      income,
      expense,
      investment,
      offer,
      balance: income - expense - investment - offer,
      total: transactions.length,
    };
  },

  // ==================== FILTERS ====================
  getCurrentMonthTransactions: () => {
    const now = new Date();
    const month = now.getMonth();
    const year = now.getFullYear();

    return get().transactions.filter(t => {
      const d = new Date(t.date);
      return d.getMonth() === month && d.getFullYear() === year;
    });
  },

  getRecentTransactions: (limit = 5) => {
    return get().transactions.slice(0, limit);
  },

  // ==================== UTILS ====================
  clearError: () => set({ error: null }),
}));

export default useTransactionStore;
