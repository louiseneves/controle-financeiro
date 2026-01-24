/**
 * Auth Store - Zustand
 * Gerenciamento de estado de autenticação
 */

import { create } from 'zustand';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  onAuthStateChanged,
  updateProfile,
} from 'firebase/auth';
import { auth } from '../services/firebase/config';
import { saveData, STORAGE_KEYS } from '../services/storage/asyncStorage';

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
      let errorMessage = 'Erro ao fazer login';

      if (error.code === 'auth/invalid-credential') {
        errorMessage = 'Email ou senha incorretos';
      } else if (error.code === 'auth/user-not-found') {
        errorMessage = 'Usuário não encontrado';
      } else if (error.code === 'auth/wrong-password') {
        errorMessage = 'Senha incorreta';
      } else if (error.code === 'auth/too-many-requests') {
        errorMessage = 'Muitas tentativas. Tente novamente mais tarde';
      }

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
        password
      );

      if (displayName) {
        await updateProfile(user, { displayName });
      }

      // onAuthStateChanged vai sincronizar o estado
      return { success: true };
    } catch (error) {
      let errorMessage = 'Erro ao cadastrar';

      if (error.code === 'auth/email-already-in-use') {
        errorMessage = 'Este email já está em uso';
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = 'Email inválido';
      } else if (error.code === 'auth/weak-password') {
        errorMessage = 'Senha muito fraca. Use no mínimo 6 caracteres';
      }

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
      return { success: false, error: 'Erro ao fazer logout' };
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
      return { success: true, message: 'Email de recuperação enviado' };
    } catch (error) {
      let errorMessage = 'Erro ao enviar email';

      if (error.code === 'auth/user-not-found') {
        errorMessage = 'Usuário não encontrado';
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = 'Email inválido';
      }

      set({ error: errorMessage, loading: false });
      return { success: false, error: errorMessage };
    }
  },

  /* =========================
     Utilidades
  ========================= */
  clearError: () => set({ error: null }),
}));

export default useAuthStore;
