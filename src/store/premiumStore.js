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
      const connected = await ExpoIap.initConnection();

      if (!connected) {
        console.warn(
          "⚠️ Não foi possível conectar ao Google Play Billing Service.",
        );
        set({ initialized: true });
        return;
      }

      const products = await ExpoIap.fetchProducts({
        skus: [PRODUCT_IDS.monthly, PRODUCT_IDS.yearly],
        type: "subs",
      });

      console.log("🛒 Produtos carregados com sucesso:", products.length);
      set({ availableProducts: products, initialized: true });
    } catch (e) {
      console.error("❌ Erro ao inicializar IAP:", e);
      set({ initialized: true }); // Garante que destrava o estado de carregamento do app
    }
  },

  // ================= LOAD PREMIUM STATUS =================
  loadPremiumStatus: async () => {
    try {
      set({ loading: true });

      const connected = await ExpoIap.initConnection();
      if (!connected) {
        set({ isPremium: false, initialized: true });
        return;
      }

      const purchases = await ExpoIap.getAvailablePurchases();
      console.log("Compras disponíveis na Google Play:", purchases);

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
          expirationDate: premiumData?.expirationDate || null,
          initialized: true,
        });

        console.log("🎉 PREMIUM ATIVADO VIA GOOGLE PLAY");
        return;
      }

      // Nenhuma assinatura ativa na Play Store, remove dados locais
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

      // Busca o produto na lista salva
      const product = state.availableProducts.find(
        (p) => p.productId === productId || p.id === productId,
      );

      if (!product) {
        console.error(
          `❌ Produto ${productId} ausente. Disponíveis:`,
          state.availableProducts,
        );
        return {
          success: false,
          error: "Produto não sincronizado com a Google Play. Tente novamente.",
        };
      }

      // Correção Sintática: Acessa o array interno com segurança usando a notação opcional padrão do JS
      const offerToken =
        product.subscriptionOfferDetailsAndroid?.[0]?.offerToken;

      if (!offerToken) {
        console.error("❌ Offer token não encontrado para o produto:", product);
        return {
          success: false,
          error: "Plano sem oferta de faturamento ativa no Android.",
        };
      }

      // Abre o Google Play Billing com segurança
      await ExpoIap.requestPurchase({
        type: "subs",
        request: {
          android: {
            skus: [productId],
            subscriptionOffers: [
              {
                sku: productId,
                offerToken: offerToken,
              },
            ],
          },
        },
      });

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
      const purchaseData = Array.isArray(purchase) ? purchase[0] : purchase;

      const subscriptionType =
        purchaseData.productId === PRODUCT_IDS.monthly ? "monthly" : "yearly";

      const expirationDate = new Date(purchaseData.transactionDate);

      if (subscriptionType === "monthly") {
        expirationDate.setMonth(expirationDate.getMonth() + 1);
      } else {
        expirationDate.setFullYear(expirationDate.getFullYear() + 1);
      }
console.log("expirationDate:", expirationDate);
      const premiumData = {
        subscriptionType,
        expirationDate: expirationDate.toISOString(),
        activatedAt: new Date(purchaseData.transactionDate).toISOString(),
      };

      await saveData(STORAGE_KEYS.PREMIUM_STATUS, premiumData);

      await ExpoIap.finishTransaction({
        purchase: purchaseData,
        isConsumable: false,
      });

      set({
        isPremium: true,
        subscriptionType,
        expirationDate: expirationDate.toISOString(),
      });

      console.log("✅ Premium confirmado");
      console.log("Plano:", subscriptionType);
      console.log("Expira:", expirationDate.toISOString());

      return { success: true };
    } catch (error) {
      console.error("❌ Erro ao confirmar compra:", error);
      return {
        success: false,
        error: error.message,
      };
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
    if (!isPremium) return false;

    if (!expirationDate) return true;

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
      availableProducts: [],
    });
  },
}));

export default usePremiumStore;
