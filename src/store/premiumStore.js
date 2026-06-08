/**
 * Premium Store - Zustand
 * Gerenciamento de assinatura Premium com Google Play Billing
 */

import { create } from "zustand";
import * as ExpoIap from "expo-iap";
import {
  saveData,
  getData,
  removeData,
  STORAGE_KEYS,
} from "../services/storage/asyncStorage";

const PRODUCT_IDS = {
  monthly: "premium_monthly",
  yearly: "premium_yearly",
};

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
  availableProducts: [],

  // ================= INIT IAP =================
  initIAP: async () => {
    try {
      await ExpoIap.initConnection();

      const products = await ExpoIap.fetchProducts({
        skus: [PRODUCT_IDS.monthly, PRODUCT_IDS.yearly],
        type: "subs",
      });

      console.log("Produtos encontrados:", products.length);
      set({ availableProducts: products });
    } catch (e) {
      console.error("❌ Erro ao inicializar IAP:", e);
    }
  },

  // ================= LOAD =================
  loadPremiumStatus: async () => {
    try {
      set({ loading: true });

      // Verifica compras ativas no Google Play
      const connected = await ExpoIap.initConnection();

      if (!connected) {
        set({
          isPremium: false,
          initialized: true,
        });

        return;
      }

      const purchases = await ExpoIap.getAvailablePurchases();

      const activeSub = purchases.find(
        (p) =>
          p.productId === PRODUCT_IDS.monthly ||
          p.productId === PRODUCT_IDS.yearly,
      );

      if (activeSub) {
        const subscriptionType =
          activeSub.productId === PRODUCT_IDS.monthly ? "monthly" : "yearly";

        const expirationDate = new Date(activeSub.transactionDate);

        if (subscriptionType === "monthly") {
          expirationDate.setMonth(expirationDate.getMonth() + 1);
        } else {
          expirationDate.setFullYear(expirationDate.getFullYear() + 1);
        }

        const premiumData = {
          subscriptionType,
          expirationDate: expirationDate.toISOString(),
          activatedAt: new Date(activeSub.transactionDate).toISOString(),
        };

        await saveData(STORAGE_KEYS.PREMIUM_STATUS, premiumData);

        set({
          isPremium: true,
          subscriptionType,
          expirationDate: expirationDate.toISOString(),
          initialized: true,
        });

        return;
      }

      // Fallback: verifica AsyncStorage
      const premiumData = await getData(STORAGE_KEYS.PREMIUM_STATUS);

      if (!premiumData?.expirationDate || !premiumData?.subscriptionType) {
        set({
          isPremium: false,
          subscriptionType: null,
          expirationDate: null,
          initialized: true,
        });
        return;
      }

      const expirationDate = new Date(premiumData.expirationDate);

      if (isNaN(expirationDate.getTime()) || expirationDate <= new Date()) {
        await removeData(STORAGE_KEYS.PREMIUM_STATUS);
        set({
          isPremium: false,
          subscriptionType: null,
          expirationDate: null,
          initialized: true,
        });
        return;
      }

      set({
        isPremium: true,
        subscriptionType: premiumData.subscriptionType,
        expirationDate: premiumData.expirationDate,
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

  // ================= ACTIVATE (COMPRA REAL) =================
  activatePremium: async (subscriptionType) => {
    try {
      const state = get();

      if (state.loading) return { success: false, error: "Processando" };
      if (state.isPremium) return { success: false, error: "Já é premium" };

      if (subscriptionType !== "monthly" && subscriptionType !== "yearly") {
        return { success: false, error: "Plano inválido" };
      }

      set({ loading: true });

      const productId = PRODUCT_IDS[subscriptionType];

      // 👇 Abre o Google Play Billing de verdade
      await ExpoIap.requestPurchase({ sku: productId });

      // O listener no PremiumScreen trata o resultado
      return { success: true };
    } catch (error) {
      console.error("❌ Erro ao iniciar compra:", error);

      if (error.code === "E_USER_CANCELLED") {
        return { success: false, error: "Compra cancelada pelo usuário" };
      }

      return { success: false, error: error.message };
    } finally {
      set({ loading: false });
    }
  },

  // ================= CONFIRM PURCHASE =================
  confirmPurchase: async (purchase) => {
    try {
      const subscriptionType =
        purchase.productId === PRODUCT_IDS.monthly ? "monthly" : "yearly";

      const expirationDate = new Date(purchase.transactionDate);

      if (subscriptionType === "monthly") {
        expirationDate.setMonth(expirationDate.getMonth() + 1);
      } else {
        expirationDate.setFullYear(expirationDate.getFullYear() + 1);
      }

      const premiumData = {
        subscriptionType,
        expirationDate: expirationDate.toISOString(),
        activatedAt: new Date(purchase.transactionDate).toISOString(),
      };

      await saveData(STORAGE_KEYS.PREMIUM_STATUS, premiumData);

      // Finaliza a compra no Google Play
      await ExpoIap.finishTransaction({ purchase, isConsumable: false });

      set({
        isPremium: true,
        subscriptionType,
        expirationDate: expirationDate.toISOString(),
      });

      return { success: true };
    } catch (error) {
      console.error("❌ Erro ao confirmar compra:", error);
      return { success: false, error: error.message };
    }
  },

  // ================= CANCEL =================
  cancelPremium: async () => {
    try {
      set({ loading: true });
      await removeData(STORAGE_KEYS.PREMIUM_STATUS);
      set({ isPremium: false, subscriptionType: null, expirationDate: null });
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    } finally {
      set({ loading: false });
    }
  },

  // ================= RESTORE =================
  restorePurchases: async () => {
    try {
      set({ loading: true });
      await get().loadPremiumStatus();
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    } finally {
      set({ loading: false });
    }
  },

  // ================= ACCESS =================
  hasAccess: (feature) => {
    const { isPremium, expirationDate } = get();
    if (!PREMIUM_FEATURES.includes(feature)) return true;
    if (!isPremium || !expirationDate) return false;
    const expiration = new Date(expirationDate).getTime();
    if (Number.isNaN(expiration)) return false;
    return expiration > Date.now();
  },

  // ================= RESET =================
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
