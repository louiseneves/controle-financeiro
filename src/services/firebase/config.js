/**
 * Configuração do Firebase Web SDK v12
 * Para React Native
 */

import {initializeApp} from 'firebase/app';
import {getAuth} from 'firebase/auth';
import {getFirestore} from 'firebase/firestore';

// COLE SUAS CREDENCIAIS AQUI (do Firebase Console)
const firebaseConfig = {
  apiKey: 'AIzaSyBLCSsiHQWnu-xKnzA_Aabk2e0hLLaPmaE',
  authDomain: 'caldizimo.firebaseapp.com',
  projectId: 'caldizimo',
  storageBucket: 'caldizimo.appspot.com',
  messagingSenderId: '823938921031',
  appId: '1:823938921031:web:05eee5cebea890f44af762',
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);

// Inicializar serviços
const auth = getAuth(app);
const db = getFirestore(app);

console.log('🔥 Firebase Web SDK inicializado');

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
};

// Exportar serviços
export {auth, db};

// Export default
export default {
  app,
  auth,
  db,
  COLLECTIONS,
};