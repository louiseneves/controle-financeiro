/**
 * Transaction Store - Zustand
 * Gerenciamento de transações
 */

import { create } from "zustand";
import {
  addDocument,
  getDocuments,
  updateDocument,
  deleteDocument,
} from "../services/firebase/firestore";
import { COLLECTIONS } from "../services/firebase/config";
import NotificationService from "../services/notifications/notificationService";
import useSettingsStore from "./settingsStore";

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
        { field: "userId", operator: "==", value: userId },
        { field: "date", direction: "desc" },
      );

      set({ transactions, loading: false });
      return { success: true };
    } catch (error) {
      console.error("Erro ao carregar transações:", error);
      set({ error: error.message, loading: false });
      return { success: false };
    }
  },

  // ==================== ADD ====================
  addTransaction: async (transaction) => {
    if (!transaction?.userId) {
      return { success: false, error: "Usuário não autenticado" };
    }

    set({ loading: true, error: null }); // ✅ Inicia loading

    try {
      const newTransaction = {
        ...transaction,
        createdAt: new Date().toISOString(),
      };

      console.log("📝 Salvando transação:", newTransaction);

      // ✅ Aguarda a adição
      const id = await addDocument(COLLECTIONS.TRANSACTIONS, newTransaction);

      console.log("✅ Transação salva com ID:", id);

      // ✅ Atualiza estado
      set((state) => ({
        transactions: [{ id, ...newTransaction }, ...state.transactions],
        loading: false, // ✅ Desativa loading
        error: null,
      }));

      // 🔔 Notificação (com tratamento de erro)
      try {
        const settings = useSettingsStore.getState();
        if (settings?.notifications?.enabled) {
          const formattedAmount =
            settings.formatCurrency?.(transaction.amount) ||
            `R$ ${transaction.amount.toFixed(2)}`;

          await NotificationService.showNotification(
            "✅ Transação registrada",
            `${formattedAmount} adicionada com sucesso`,
          );
        }
      } catch (notifError) {
        console.warn("⚠️ Erro ao enviar notificação:", notifError);
        // ✅ Notificação falha NÃO impede retorno de sucesso
      }

      return { success: true, id };
    } catch (error) {
      console.error("❌ Erro ao adicionar transação:", error);

      // ✅ SEMPRE desativa loading em erro
      set({
        error: error.message || "Erro ao adicionar transação",
        loading: false,
      });

      return {
        success: false,
        error: error.message || "Erro ao adicionar transação",
      };
    }
  },

  // ==================== UPDATE ====================
  updateTransaction: async (id, data) => {
    try {
      set({ loading: true, error: null });

      await updateDocument(COLLECTIONS.TRANSACTIONS, id, data);

      set((state) => ({
        transactions: state.transactions.map((t) =>
          t.id === id ? { ...t, ...data } : t,
        ),
        loading: false,
      }));

      return { success: true };
    } catch (error) {
      console.error("Erro ao atualizar transação:", error);
      set({ error: error.message, loading: false });
      return { success: false };
    }
  },

  // ==================== DELETE ====================
  deleteTransaction: async (id) => {
    try {
      set({ loading: true, error: null });

      // 🔍 Pega o userId do estado
      const state = get();
      const transaction = state.transactions.find((t) => t.id === id);

      if (!transaction?.userId) {
        return {
          success: false,
          error: "Transação sem userId - não pode deletar",
        };
      }

      console.log("🗑️ Deletando:", { id, userId: transaction.userId });

      await deleteDocument(COLLECTIONS.TRANSACTIONS, id);

      set((state) => ({
        transactions: state.transactions.filter((t) => t.id !== id),
        loading: false,
      }));

      return { success: true };
    } catch (error) {
      console.error("❌ Erro ao deletar transação:", error);
      set({ error: error.message, loading: false });
      return { success: false, error: error.message };
    }
  },

  // ==================== SUMMARY ====================
  getSummary: () => {
    const { transactions } = get();

    const sumByType = (type) =>
      transactions
        .filter((t) => t.type === type)
        .reduce((sum, t) => sum + Number(t.amount || 0), 0);

    const income = sumByType("receita");
    const expense = sumByType("despesa");
    const investment = sumByType("investimento");
    const offer = sumByType("oferta");

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

    return get().transactions.filter((t) => {
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
