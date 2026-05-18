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
    // if (!transaction?.userId) {
    //   return { success: false, error: "Usuário não autenticado" };
    // }

    set({ loading: true, error: null }); // ✅ Inicia loading
    const userId = transaction?.userId || "test-user";

    try {
      const newTransaction = {
        ...transaction,
        userId,
        createdAt: new Date().toISOString(),
      };

      console.log("📝 Salvando transação:", newTransaction);

      // ✅ Aguarda a adição
      const id = await addDocument(COLLECTIONS.TRANSACTIONS, newTransaction);

      console.log("✅ Transação salva com ID:", id);
      try {
        const { useBackupStore } = require("./backupStore");
        const backupStore = useBackupStore.getState();
        const usePremiumStore = require("./premiumStore").default;
        const isPremium = usePremiumStore.getState().isPremium;

        // ✅ Backup automático apenas para premium
        if (backupStore.autoBackupEnabled && isPremium) {
          await backupStore.createBackup(true, isPremium);
        }
      } catch (backupError) {
        console.warn(
          "⚠️ Erro ao criar backup automático:",
          backupError.message,
        );
      }

      // ✅ Atualiza estado
      set((state) => ({
        transactions: [{ id, ...newTransaction }, ...state.transactions],
        loading: false, // ✅ Desativa loading
        error: null,
      }));

      // ✅ Depois — usa o método correto com tipo específico
      try {
        const settings = useSettingsStore.getState();
        if (settings?.notifications?.enabled) {
          const type = transaction.type === "receita" ? "income" : "expense";
          // Só notifica receita e despesa
          if (
            transaction.type === "receita" ||
            transaction.type === "despesa"
          ) {
            await NotificationService.notifyTransaction(
              type,
              transaction.amount,
            );
          }
        }
      } catch (notifError) {
        console.warn("⚠️ Erro ao enviar notificação:", notifError);
      }

      // ✅ NOVO: Verificar alertas de orçamento após salvar despesa
      // ✅ Verificar alertas de orçamento após salvar despesa
      try {
        if (transaction.type === "despesa") {
          const useBudgetStore = require("./budgetStore").default;
          // ✅ Sem newAmount — transação já está no estado quando chegamos aqui
          await useBudgetStore.getState().checkBudgetAlerts();
        }
      } catch (budgetAlertError) {
        console.warn(
          "⚠️ Erro ao verificar alertas de orçamento:",
          budgetAlertError,
        );
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

      // ✅ NOVO: Recalcular alertas após deletar despesa
      // Passa valor negativo para subtrair do cálculo
      try {
        // ✅ Sem argumentos — estado já foi atualizado antes desta chamada
        if (transaction.type === "despesa") {
          const useBudgetStore = require("./budgetStore").default;
          await useBudgetStore.getState().checkBudgetAlerts();
        }
      } catch (budgetAlertError) {
        console.warn("⚠️ Erro ao recalcular alertas:", budgetAlertError);
      }

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

  restoreTransactions: async (transactions) => {
    if (get().loading) return;

    try {
      set({ loading: true, error: null });

      if (!Array.isArray(transactions)) {
        throw new Error("Formato inválido");
      }

      const sanitizedTransactions = transactions.map((transaction) => {
        const { id, ...data } = transaction;

        return {
          ...JSON.parse(JSON.stringify(data)),
          restoredAt: new Date().toISOString(),
        };
      });

      const existingTransactions = get().transactions;

      await Promise.all(
        existingTransactions.map((transaction) =>
          deleteDocument(COLLECTIONS.TRANSACTIONS, transaction.id),
        ),
      );

      const restoredTransactions = await Promise.all(
        sanitizedTransactions.map(async (transactionData) => {
          const newId = await addDocument(
            COLLECTIONS.TRANSACTIONS,
            transactionData,
          );

          return {
            id: newId,
            ...transactionData,
          };
        }),
      );

      set({
        transactions: restoredTransactions,
      });

      return {
        success: true,
        count: restoredTransactions.length,
      };
    } catch (error) {
      console.error("Erro ao restaurar transações:", error);

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
  // ==================== COMPATIBILIDADE TESTES ====================

  getBalance: () => {
    const { transactions } = get();

    return transactions.reduce((total, transaction) => {
      const amount = Number(transaction.amount || 0);

      if (transaction.type === "income" || transaction.type === "receita") {
        return total + amount;
      }

      if (transaction.type === "expense" || transaction.type === "despesa") {
        return total - amount;
      }

      return total;
    }, 0);
  },

  getTotalIncome: () => {
    return get()
      .transactions.filter((t) => t.type === "income" || t.type === "receita")
      .reduce((sum, t) => sum + Number(t.amount || 0), 0);
  },

  getTotalExpenses: () => {
    return get()
      .transactions.filter((t) => t.type === "expense" || t.type === "despesa")
      .reduce((sum, t) => sum + Number(t.amount || 0), 0);
  },

  filterByType: (type) => {
    return get().transactions.filter((t) => t.type === type);
  },

  filterByCategory: (category) => {
    return get().transactions.filter((t) => t.category === category);
  },

  filterByPeriod: (startDate, endDate) => {
    return get().transactions.filter((t) => {
      const date = new Date(t.date);

      return date >= new Date(startDate) && date <= new Date(endDate);
    });
  },

  searchByDescription: (text) => {
    return get().transactions.filter((t) =>
      t.description?.toLowerCase().includes(text.toLowerCase()),
    );
  },
  clearError: () => set({ error: null }),
}));

export default useTransactionStore;
