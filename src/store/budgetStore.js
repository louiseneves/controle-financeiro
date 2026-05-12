import { create } from "zustand";
import {
  addDocument,
  getDocuments,
  updateDocument,
  deleteDocument,
} from "../services/firebase/firestore";
import { COLLECTIONS, auth } from "../services/firebase/config";
import NotificationService from "../services/notifications/notificationService";
import useSettingsStore from "./settingsStore";
import useTransactionStore from "./transactionStore";
import { Alert } from "react-native";
import { EXPENSE_CATEGORIES } from "../utils";
import { formatCurrency } from "../utils/helpers/formatters";

// ✅ Fora do create() — persiste entre chamadas
let _alertHistory = {};

const useBudgetStore = create((set, get) => ({
  budgets: [],
  loading: false,
  error: null,
  alertHistory: {},

  loadBudgets: async (userId) => {
    if (!userId) return;

    try {
      set({ loading: true, error: null });

      const now = new Date();
      const currentMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;

      const budgets = await getDocuments(
        COLLECTIONS.PLANNING,
        { field: "userId", operator: "==", value: userId },
        { field: "month", direction: "desc" },
      );

      // ✅ Filtra apenas o orçamento do mês atual
      const currentMonthBudgets = budgets.filter(
        (b) => b.month === currentMonth,
      );

      set({ budgets: currentMonthBudgets, loading: false });
      return { success: true };
    } catch (error) {
      set({ error: error.message, loading: false });
      return { success: false };
    }
  },

  addBudget: async (budgetData) => {
    if (!budgetData?.userId) {
      return { success: false, error: "Usuário não autenticado" };
    }

    try {
      set({ loading: true, error: null });

      const existing = get().budgets.find(
        (b) => b.month === budgetData.month && b.userId === budgetData.userId,
      );

      if (existing) {
        set({ loading: false });
        return {
          success: false,
          error: "Já existe um orçamento para este mês",
        };
      }

      const newBudget = {
        ...budgetData,
        createdAt: new Date().toISOString(),
      };

      const id = await addDocument(COLLECTIONS.PLANNING, newBudget);

      set((state) => ({
        budgets: [{ id, ...newBudget }, ...state.budgets],
        loading: false,
      }));

      return { success: true };
    } catch (error) {
      set({ error: error.message, loading: false });
      return { success: false };
    }
  },

  updateBudget: async (id, data) => {
    try {
      set({ loading: true, error: null });

      await updateDocument(COLLECTIONS.PLANNING, id, data);

      set((state) => ({
        budgets: state.budgets.map((b) =>
          b.id === id ? { ...b, ...data } : b,
        ),
        loading: false,
      }));

      return { success: true };
    } catch (error) {
      set({ error: error.message, loading: false });
      return { success: false };
    }
  },

  deleteBudget: async (id) => {
    try {
      set({ loading: true, error: null });

      await deleteDocument(COLLECTIONS.PLANNING, id);

      set((state) => ({
        budgets: state.budgets.filter((b) => b.id !== id),
        loading: false,
      }));

      return { success: true };
    } catch (error) {
      set({ error: error.message, loading: false });
      return { success: false };
    }
  },

  getCurrentMonthBudget: () => {
    const now = new Date();
    const currentMonth = `${now.getFullYear()}-${String(
      now.getMonth() + 1,
    ).padStart(2, "0")}`;

    return get().budgets.find((b) => b.month === currentMonth) || null;
  },

  // ✅ newCategory e newAmount são opcionais:
  // - addTransaction passa (category, amount) para incluir despesa ainda não no estado
  // - deleteTransaction chama sem argumentos pois o estado já foi atualizado
  checkBudgetAlerts: async (newCategory, newAmount, silent = false) => {
    const settings = useSettingsStore.getState();
    let { budgets } = get();
    // ✅ Se não há orçamentos, tenta carregar antes de verificar
    if (!budgets || budgets.length === 0) {
      const { transactions } = useTransactionStore.getState();
      const userId = transactions[0]?.userId;
      if (userId) {
        await get().loadBudgets(userId);
        budgets = get().budgets;
      }
    }

    if (!budgets || budgets.length === 0) return;
    const { transactions } = useTransactionStore.getState();
    const now = new Date();
    const month = now.getMonth();
    const year = now.getFullYear();
    const monthKey = `${year}-${month}`;

    // ✅ Limpeza de meses anteriores
    Object.keys(_alertHistory).forEach((key) => {
      if (!key.includes(monthKey)) {
        delete _alertHistory[key];
      }
    });

    // ✅ NOVO: Limpeza de orçamentos deletados
    // Mantém apenas chaves cujo budgetId ainda existe no array de budgets
    const activeBudgetIds = budgets.map((b) => b.id);
    Object.keys(_alertHistory).forEach((key) => {
      const budgetId = key.split("_")[0];
      if (!activeBudgetIds.includes(budgetId)) {
        delete _alertHistory[key];
      }
    });

    // Indexar despesas do mês atual
    const expensesByCategory = {};
    transactions.forEach((t) => {
      const d = new Date(t.date);
      if (
        t.type === "despesa" &&
        d.getMonth() === month &&
        d.getFullYear() === year
      ) {
        expensesByCategory[t.category] =
          (expensesByCategory[t.category] || 0) + Number(t.amount || 0);
      }
    });

    if (newCategory && newAmount && newAmount > 0) {
      expensesByCategory[newCategory] =
        (expensesByCategory[newCategory] || 0) + Number(newAmount);
    }

    const alertsToShow = [];

    budgets.forEach((budget) => {
      if (!budget.categories) return;

      Object.entries(budget.categories).forEach(([category, limit]) => {
        if (!limit || limit <= 0) return;

        const spent = expensesByCategory[category] || 0;
        const percentage = (spent / Number(limit)) * 100;
        const alertKey = `${budget.id}_${category}_${monthKey}`;

        const categoryName =
          EXPENSE_CATEGORIES.find((c) => c.id === category)?.name || category;

        // ✅ Salvar estado anterior antes de resetar
        const previousHistory = _alertHistory[alertKey];

        // Reset direto baseado no percentual atual
        if (percentage < 90) {
          _alertHistory[alertKey] = null;
        } else if (percentage < 100 && _alertHistory[alertKey] === "exceeded") {
          _alertHistory[alertKey] = "warning";
        }

        // 🚨 100%
        if (percentage >= 100 && _alertHistory[alertKey] !== "exceeded") {
          if (!silent && settings?.notifications?.enabled) {
            NotificationService.scheduleBudgetWarning(category, "exceeded");
          }
          alertsToShow.push({
            title: "🚨 Orçamento Excedido!",
            message: `Você ultrapassou o orçamento de "${categoryName}".\n\nGasto: ${formatCurrency(spent)} | Limite: ${formatCurrency(Number(limit))}`,
          });
          _alertHistory[alertKey] = "exceeded";

          // ⚠️ 90% — dispara se estava "exceeded" e caiu para 90-99%
        } else if (
          percentage >= 90 &&
          percentage < 100 &&
          previousHistory === "exceeded" // ✅ usa o estado anterior ao reset
        ) {
          if (!silent && settings?.notifications?.enabled) {
            NotificationService.scheduleBudgetWarning(category, "warning");
          }
          alertsToShow.push({
            title: "⚠️ Atenção ao Orçamento",
            message: `Você gastou ${percentage.toFixed(0)}% do orçamento de "${categoryName}".\n\nGasto: ${formatCurrency(spent)} | Limite: ${formatCurrency(Number(limit))}`,
          });
          // _alertHistory já está "warning" pelo reset acima

          // ⚠️ 90% — dispara normalmente se nunca foi alertado
        } else if (
          percentage >= 90 &&
          _alertHistory[alertKey] !== "warning" &&
          _alertHistory[alertKey] !== "exceeded"
        ) {
          if (!silent && settings?.notifications?.enabled) {
            NotificationService.scheduleBudgetWarning(category, "warning");
          }
          alertsToShow.push({
            title: "⚠️ Atenção ao Orçamento",
            message: `Você gastou ${percentage.toFixed(0)}% do orçamento de "${categoryName}".\n\nGasto: ${formatCurrency(spent)} | Limite: ${formatCurrency(Number(limit))}`,
          });
          _alertHistory[alertKey] = "warning";
        }
      });
    });

    if (!silent && alertsToShow.length > 0) {
      Alert.alert(alertsToShow[0].title, alertsToShow[0].message);
    }
  },

  restoreBudgets: async (budgets) => {
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

      if (!Array.isArray(budgets)) {
        throw new Error("Formato inválido");
      }

      _alertHistory = {};

      const sanitizedBudgets = budgets.map((budget) => {
        const { id, ...data } = budget;

        return {
          ...JSON.parse(JSON.stringify(data)),
          userId: user.uid,
          restoredAt: new Date().toISOString(),
        };
      });

      const existingBudgets = get().budgets;

      await Promise.all(
        existingBudgets.map((budget) =>
          deleteDocument(COLLECTIONS.PLANNING, budget.id),
        ),
      );

      const restoredBudgets = await Promise.all(
        sanitizedBudgets.map(async (budgetData) => {
          const newId = await addDocument(COLLECTIONS.PLANNING, budgetData);

          return {
            id: newId,
            ...budgetData,
          };
        }),
      );

      // ✅ Adicione após criar restoredBudgets
      const now = new Date();
      const currentMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
      const currentMonthBudgets = restoredBudgets.filter(
        (b) => b.month === currentMonth,
      );

      set({ budgets: currentMonthBudgets });
      return {
        success: true,
        count: restoredBudgets.length,
      };
    } catch (error) {
      console.error("Erro ao restaurar orçamentos:", error);

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

  clearError: () => set({ error: null }),
}));

export default useBudgetStore;
