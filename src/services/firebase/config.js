/**
 * Configuração do Firebase - CORRIGIDA
 * Credenciais movidas para app.json por segurança
 */

import { initializeApp } from "firebase/app";
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import Constants from "expo-constants";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Pegar credenciais do app.json (variáveis de ambiente)
const extra = Constants?.expoConfig?.extra ?? Constants?.manifest?.extra ?? {};

const firebaseConfig = {
  apiKey: extra.firebaseApiKey,
  authDomain: extra.firebaseAuthDomain,
  projectId: extra.firebaseProjectId,
  storageBucket: extra.firebaseStorageBucket,
  messagingSenderId: extra.firebaseMessagingSenderId,
  appId: extra.firebaseAppId,
};
console.log("🔥 Firebase Config:", firebaseConfig);
if (!extra.firebaseApiKey) {
  throw new Error("Firebase não configurado no app.json");
}

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});
const db = getFirestore(app);

console.log("🔥 Firebase inicializado com sucesso");

// Collections do Firestore
export const COLLECTIONS = {
  USERS: "users",
  TRANSACTIONS: "transactions",
  CATEGORIES: "categories",
  GOALS: "goals",
  INVESTMENTS: "investments",
  OFFERS: "offers",
  TITHES: "tithes",
  PLANNING: "planning",
  SUPPORT_TICKETS: "support_tickets",
  BACKUPS: "backups",
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
