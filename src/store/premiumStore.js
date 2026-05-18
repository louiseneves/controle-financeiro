/**
 * Premium Store - Zustand
 * Gerenciamento de assinatura Premium
 */

import { create } from "zustand";
import {
  saveData,
  getData,
  removeData,
  STORAGE_KEYS,
} from "../services/storage/asyncStorage";

const PREMIUM_FEATURES = [
  "advanced_reports",
  "export_pdf",
  "export_excel",
  "yearly_reports",
  "projections",
  "comparison",
  "unlimited_goals",
  "support_tickets",
  "multiple_budgets",
  "extra_backups",
  "planning_items",
];

const usePremiumStore = create((set, get) => ({
  // ================= STATE =================
  isPremium: false,
  subscriptionType: null,
  expirationDate: null,
  loading: false,
  initialized: false,

  // ================= LOAD =================
  loadPremiumStatus: async () => {
    try {
      set({ loading: true });

      const premiumData = await getData(STORAGE_KEYS.PREMIUM_STATUS);

      // ✅ Dados inválidos
      if (
        !premiumData ||
        !premiumData.expirationDate ||
        !premiumData.subscriptionType
      ) {
        set({
          isPremium: false,
          subscriptionType: null,
          expirationDate: null,
          initialized: true,
        });

        return;
      }

      const expirationDate = new Date(premiumData.expirationDate);

      const now = new Date();

      // ✅ Data inválida
      if (isNaN(expirationDate.getTime())) {
        await removeData(STORAGE_KEYS.PREMIUM_STATUS);

        set({
          isPremium: false,
          subscriptionType: null,
          expirationDate: null,
          initialized: true,
        });

        return;
      }

      // ✅ Assinatura válida
      if (expirationDate > now) {
        set({
          isPremium: true,
          subscriptionType: premiumData.subscriptionType,
          expirationDate: premiumData.expirationDate,
          initialized: true,
        });

        return;
      }

      // ✅ Expirada
      await removeData(STORAGE_KEYS.PREMIUM_STATUS);

      set({
        isPremium: false,
        subscriptionType: null,
        expirationDate: null,
        initialized: true,
      });
    } catch (error) {
      console.error("❌ Erro ao carregar premium:", error);

      set({
        isPremium: false,
        subscriptionType: null,
        expirationDate: null,
        initialized: true,
      });
    } finally {
      set({ loading: false });
    }
  },

  // ================= ACTIVATE =================
  activatePremium: async (subscriptionType) => {
    try {
      const state = get();

      // ✅ Evita race condition
      if (state.loading) {
        return {
          success: false,
          error: "Processando assinatura",
        };
      }

      // ✅ Já premium
      if (state.isPremium) {
        return {
          success: false,
          error: "Usuário já premium",
        };
      }

      if (subscriptionType !== "monthly" && subscriptionType !== "yearly") {
        return {
          success: false,
          error: "Plano inválido",
        };
      }

      set({ loading: true });

      const now = new Date();
      const expirationDate = new Date(now);

      if (subscriptionType === "monthly") {
        expirationDate.setMonth(expirationDate.getMonth() + 1);
      } else {
        expirationDate.setFullYear(expirationDate.getFullYear() + 1);
      }

      const premiumData = {
        subscriptionType,
        expirationDate: expirationDate.toISOString(),
        activatedAt: now.toISOString(),
      };

      await saveData(STORAGE_KEYS.PREMIUM_STATUS, premiumData);

      set({
        isPremium: true,
        subscriptionType,
        expirationDate: expirationDate.toISOString(),
      });

      return { success: true };
    } catch (error) {
      console.error("❌ Erro ao ativar premium:", error);

      return {
        success: false,
        error: error.message,
      };
    } finally {
      set({ loading: false });
    }
  },

  // ================= CANCEL =================
  cancelPremium: async () => {
    try {
      set({ loading: true });

      await removeData(STORAGE_KEYS.PREMIUM_STATUS);

      set({
        isPremium: false,
        subscriptionType: null,
        expirationDate: null,
      });

      return { success: true };
    } catch (error) {
      console.error("❌ Erro ao cancelar premium:", error);

      return {
        success: false,
        error: error.message,
      };
    } finally {
      set({ loading: false });
    }
  },

  // ================= RESTORE =================
  restorePurchases: async () => {
    try {
      set({ loading: true });

      const premiumData = await getData(STORAGE_KEYS.PREMIUM_STATUS);

      if (!premiumData) {
        return {
          success: false,
          error: "Nenhuma compra encontrada",
        };
      }

      await get().loadPremiumStatus();

      return { success: true };
    } catch (error) {
      console.error("❌ Erro ao restaurar compras:", error);

      return {
        success: false,
        error: error.message,
      };
    } finally {
      set({ loading: false });
    }
  },

  // ================= ACCESS =================
 hasAccess: (feature) => {
  const { isPremium, expirationDate } = get();

  if (!PREMIUM_FEATURES.includes(feature)) {
    return true;
  }

  if (!isPremium || !expirationDate) {
    return false;
  }

  const expiration = new Date(expirationDate).getTime();

  if (Number.isNaN(expiration)) {
    return false;
  }

  return expiration > Date.now();
},

  // ================= UTILS =================
  resetPremiumState: () => {
    set({
      isPremium: false,
      subscriptionType: null,
      expirationDate: null,
      loading: false,
      initialized: false,
    });
  },
}));

export default usePremiumStore;
