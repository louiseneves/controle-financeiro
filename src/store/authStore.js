/**
 * Auth Store - Zustand
 * Gerenciamento de estado de autenticação
 */

import { create } from "zustand";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  onAuthStateChanged,
  updateProfile,
} from "firebase/auth";
import { auth } from "../services/firebase/config";
import { saveData, STORAGE_KEYS } from "../services/storage/asyncStorage";
import {
  handleError,
  getErrorMessage,
  ERROR_TYPES,
} from "../utils/errorHandler";

const useAuthStore = create((set, get) => ({
  /* =========================
     Estado
  ========================= */
  user: null,
  loading: true,
  initialized: false,
  error: null,

  /* =========================
     Inicializar Auth
  ========================= */
  initializeAuth: () => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const userData = {
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          displayName: firebaseUser.displayName,
          photoURL: firebaseUser.photoURL,
        };

        set({
          user: userData,
          loading: false,
          initialized: true,
          error: null,
        });

        // Salva apenas se mudou
        const storedUser = get().user;
        if (!storedUser || storedUser.uid !== userData.uid) {
          await saveData(STORAGE_KEYS.USER_DATA, userData);
        }
      } else {
        set({
          user: null,
          loading: false,
          initialized: true,
          error: null,
        });

        await saveData(STORAGE_KEYS.USER_DATA, null);
      }
    });

    return unsubscribe;
  },

  /* =========================
     Login
  ========================= */
  login: async (email, password) => {
    try {
      set({ loading: true, error: null });

      await signInWithEmailAndPassword(auth, email, password);

      // onAuthStateChanged vai atualizar o estado
      return { success: true };
    } catch (error) {
      const appError = handleError(error, "authStore.login", { email });
      const errorMessage = getErrorMessage(appError);

      set({
        error: errorMessage,
        loading: false,
      });

      return { success: false, error: errorMessage };
    }
  },

  /* =========================
     Cadastro
  ========================= */
  register: async (email, password, displayName) => {
    try {
      set({ loading: true, error: null });

      const { user } = await createUserWithEmailAndPassword(
        auth,
        email,
        password,
      );

      if (displayName) {
        await updateProfile(user, { displayName });
      }

      // onAuthStateChanged vai sincronizar o estado
      return { success: true };
    } catch (error) {
      const appError = handleError(error, "authStore.register", { email });
      const errorMessage = getErrorMessage(appError);

      set({
        error: errorMessage,
        loading: false,
      });

      return { success: false, error: errorMessage };
    }
  },

  /* =========================
     Logout
  ========================= */
  logout: async () => {
    try {
      set({ loading: true });
      await signOut(auth);
      return { success: true };
    } catch {
      set({ loading: false });
      return { success: false, error: "Erro ao fazer logout" };
    }
  },

  /* =========================
     Reset de senha
  ========================= */
  resetPassword: async (email) => {
    try {
      set({ loading: true, error: null });
      await sendPasswordResetEmail(auth, email);
      set({ loading: false });
      return { success: true, message: "Email de recuperação enviado" };
    } catch (error) {
      const appError = handleError(error, "authStore.resetPassword", { email });
      const errorMessage = getErrorMessage(appError);

      set({
        error: errorMessage,
        loading: false,
      });

      return { success: false, error: errorMessage };
    }
  },

  /* =========================
     Utilidades
  ========================= */
  clearError: () => set({ error: null }),
}));

export default useAuthStore;
