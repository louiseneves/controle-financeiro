/**
 * Premium Store - Zustand
 * Gerenciamento de assinatura Premium
 */

import {create} from 'zustand';
import {saveData, getData, STORAGE_KEYS} from '../services/storage/asyncStorage';

const usePremiumStore = create((set, get) => ({
  // Estado
  isPremium: false,
  subscriptionType: null, // 'monthly' ou 'yearly'
  expirationDate: null,
  loading: false,

  // Carregar status premium
  loadPremiumStatus: async () => {
    try {
      set({loading: true});
      const premiumData = await getData(STORAGE_KEYS.PREMIUM_STATUS);
      
      if (premiumData) {
        // Verificar se a assinatura ainda está válida
        const expirationDate = new Date(premiumData.expirationDate);
        const now = new Date();
        
        if (expirationDate > now) {
          set({
            isPremium: true,
            subscriptionType: premiumData.subscriptionType,
            expirationDate: premiumData.expirationDate,
            loading: false,
          });
        } else {
          // Assinatura expirada
          set({
            isPremium: false,
            subscriptionType: null,
            expirationDate: null,
            loading: false,
          });
          await saveData(STORAGE_KEYS.PREMIUM_STATUS, null);
        }
      } else {
        set({loading: false});
      }
    } catch (error) {
      console.error('Erro ao carregar status premium:', error);
      set({loading: false});
    }
  },

  // Ativar premium (simulado)
  activatePremium: async (subscriptionType) => {
    try {
      set({loading: true});

      // Calcular data de expiração
      const now = new Date();
      const expirationDate = new Date(now);
      
      if (subscriptionType === 'monthly') {
        expirationDate.setMonth(expirationDate.getMonth() + 1);
      } else if (subscriptionType === 'yearly') {
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
        loading: false,
      });

      return {success: true};
    } catch (error) {
      console.error('Erro ao ativar premium:', error);
      set({loading: false});
      return {success: false, error: error.message};
    }
  },

  // Cancelar premium (simulado)
  cancelPremium: async () => {
    try {
      await saveData(STORAGE_KEYS.PREMIUM_STATUS, null);
      
      set({
        isPremium: false,
        subscriptionType: null,
        expirationDate: null,
      });

      return {success: true};
    } catch (error) {
      console.error('Erro ao cancelar premium:', error);
      return {success: false, error: error.message};
    }
  },

  // Verificar se tem acesso a uma funcionalidade
  hasAccess: (feature) => {
    const {isPremium} = get();
    
    // Funcionalidades premium
    const premiumFeatures = [
      'advanced_reports',
      'export_pdf',
      'export_excel',
      'yearly_reports',
      'projections',
      'comparison',
      'unlimited_goals',
    ];

    if (premiumFeatures.includes(feature)) {
      return isPremium;
    }

    return true; // Funcionalidades gratuitas
  },
}));

export default usePremiumStore;