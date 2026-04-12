import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { auth } from '../services/firebase/config';
import { addDocument, getDocuments, deleteDocument } from '../services/firebase/firestore';
import  useTransactionStore  from './transactionStore';
import  useGoalsStore  from './goalsStore';
import  useBudgetStore  from './budgetStore';


export const useBackupStore = create((set, get) => ({
  backups: [],
  loading: false,
  autoBackupEnabled: true,
  lastBackup: null,

  loadSettings: async () => {
    try {
      const settings = await AsyncStorage.getItem('backupSettings');
      if (settings) {
        const { autoBackupEnabled, lastBackup } = JSON.parse(settings);
        set({ autoBackupEnabled, lastBackup });
      }
    } catch (error) {
      console.error('Erro ao carregar configurações de backup:', error);
    }
  },

  saveSettings: async () => {
  try {
    const { autoBackupEnabled, lastBackup } = get();
    await AsyncStorage.setItem(
      'backupSettings',
      JSON.stringify({ autoBackupEnabled, lastBackup })
    );
  } catch (error) {
    console.error('Erro ao salvar configurações:', error);
  }
},


  toggleAutoBackup: async (enabled) => {
    set({ autoBackupEnabled: enabled });
    await get().saveSettings();
  },

  createBackup: async (isAutomatic = false, isPremium = false) => {
  const user = auth.currentUser;
  if (!user) return null;

  set({ loading: true });
    
if (!isPremium && get().backups.length >= 3) {
  throw new Error('Limite de backups atingido');
}

  try {
const now = new Date().toISOString();

const backupData = {
  userId: user.uid,
  isAutomatic,
  version: '1.0.0',
  timestamp: now, // 🔑 ESSENCIAL
  data: {
    transactions: useTransactionStore.getState().transactions,
    goals: useGoalsStore.getState().goals,
    budgets: useBudgetStore.getState().budgets,
    userProfile: {
      name: user.displayName,
      email: user.email,
    },
  },
};

    
    const backupId = await addDocument('backups', backupData);

    const backup = {
      id: backupId,
      ...backupData,
    };

    set(state => ({
      backups: [backup, ...state.backups],
      lastBackup: now,
      loading: false,
    }));

    await get().saveSettings();
    return backup;
  } catch (error) {
    console.error('Erro ao criar backup:', error);
    set({ loading: false });
    throw error;
  }
},

  loadBackups: async () => {
  const user = auth.currentUser;
  if (!user) return;

  set({ loading: true });

  try {
    const backups = await getDocuments(
      'backups',
      { field: 'userId', operator: '==', value: user.uid },
      { field: 'timestamp', direction: 'desc' },
      10
    );

    set({ backups, loading: false });
  } catch (error) {
    console.error('Erro ao carregar backups:', error);
    set({ loading: false });
  }
},


  restoreBackup: async (backupId) => {
    set({ loading: true });

    try {
      const backup = get().backups.find(b => b.id === backupId);
      if (!backup) throw new Error('Backup não encontrado');

      const { data } = backup;

      await useTransactionStore.getState().restoreTransactions(data.transactions || []);
      await useGoalsStore.getState().restoreGoals(data.goals || []);
      await useBudgetStore.getState().restoreBudgets(data.budgets || []);

      set({ loading: false });
      return true;
    } catch (error) {
      console.error('Erro ao restaurar backup:', error);
      set({ loading: false });
      throw error;
    }
  },

  deleteBackup: async backupId => {
  try {
    await deleteDocument('backups', backupId);
    set(state => ({
      backups: state.backups.filter(b => b.id !== backupId),
    }));
  } catch (error) {
    console.error('Erro ao excluir backup:', error);
    throw error;
  }
},


  exportBackupJSON: async () => {
    try {
      const transactions = useTransactionStore.getState().transactions;
      const goals = useGoalsStore.getState().goals;
      const budgets = useBudgetStore.getState().budgets;

      const backupData = {
        timestamp: new Date().toISOString(),
        version: '1.0.0',
        data: {
          transactions,
          goals,
          budgets
        }
      };

      return JSON.stringify(backupData, null, 2);
    } catch (error) {
      console.error('Erro ao exportar backup:', error);
      throw error;
    }
  },

  importBackupJSON: async (jsonString) => {
    set({ loading: true });

    try {
      const backupData = JSON.parse(jsonString);
      const { data } = backupData;

      if (!data || !data.transactions) {
        throw new Error('Formato de backup inválido');
      }

      await useTransactionStore.getState().restoreTransactions(data.transactions || []);
      await useGoalsStore.getState().restoreGoals(data.goals || []);
      await useBudgetStore.getState().restoreBudgets(data.budgets || []);

      set({ loading: false });
      return true;
    } catch (error) {
      console.error('Erro ao importar backup:', error);
      set({ loading: false });
      throw error;
    }
  },
}));

export default useBackupStore;