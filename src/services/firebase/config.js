/**
 * Configuração do Firebase - CORRIGIDA
 * Credenciais movidas para app.json por segurança
 */

import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import Constants from 'expo-constants';

// Pegar credenciais do app.json (variáveis de ambiente)
const firebaseConfig = {
  apiKey: Constants.expoConfig?.extra?.firebaseApiKey,
  authDomain: Constants.expoConfig?.extra?.firebaseAuthDomain,
  projectId: Constants.expoConfig?.extra?.firebaseProjectId,
  storageBucket: Constants.expoConfig?.extra?.firebaseStorageBucket,
  messagingSenderId: Constants.expoConfig?.extra?.firebaseMessagingSenderId,
  appId: Constants.expoConfig?.extra?.firebaseAppId,
};

// Validar configuração
if (!firebaseConfig.apiKey) {
  console.error('❌ Firebase config não encontrada!');
  console.error('Verifique se as credenciais estão no app.json em "extra"');
  throw new Error('Firebase config não encontrada! Verifique app.json');
}

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

console.log('🔥 Firebase inicializado com sucesso');

// Collections do Firestore
export const COLLECTIONS = {
  USERS: 'users',
  TRANSACTIONS: 'transactions',
  CATEGORIES: 'categories',
  GOALS: 'goals',
  INVESTMENTS: 'investments',
  OFFERS: 'offers',
  TITHES: 'tithes',
  PLANNING: 'planning',
  SUPPORT_TICKETS: 'support_tickets',
  BACKUPS: 'backups',
};

// Exportar serviços
export { auth, db };

// Export default
export default {
  app,
  auth,
  db,
  COLLECTIONS,
};