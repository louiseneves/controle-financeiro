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

const useAuthStore = create((set, get) => ({
  user: null,
  loading: true,
  initialized: false,
  error: null,

  initializeAuth: () => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const userData = {
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          displayName: firebaseUser.displayName,
          photoURL: firebaseUser.photoURL,
        };
        set({ user: userData, loading: false, initialized: true, error: null });
        await saveData(STORAGE_KEYS.USER_DATA, userData);
      } else {
        set({ user: null, loading: false, initialized: true, error: null });
        await saveData(STORAGE_KEYS.USER_DATA, null);
      }
    });

    return unsubscribe;
  },

  // No authStore.js, na função login:
  login: async (email, password) => {
    try {
      set({ loading: true, error: null });

      // 🔍 DEBUG: Log dos dados
      console.log("🔍 Tentando login com:", { email, password: "***" });

      const result = await signInWithEmailAndPassword(auth, email, password);

      console.log("✅ Login realizado:", result.user.email);
      set({ loading: false });
      return { success: true };
    } catch (error) {
      // 🔍 DEBUG: Log completo do erro
      console.log("❌ Erro completo:", error);
      console.log("❌ Código do erro:", error.code);
      console.log("❌ Mensagem:", error.message);
      console.log("👀 Configuração do Firebase:", firebaseConfig);

      let errorMessage = "Erro ao fazer login";

      switch (error.code) {
        case "auth/invalid-credential":
        case "auth/wrong-password":
        case "auth/user-not-found":
          errorMessage = "Email ou senha incorretos";
          break;
        case "auth/too-many-requests":
          errorMessage =
            "Muitas tentativas. Aguarde alguns minutos e tente novamente";
          break;
        case "auth/network-request-failed":
          errorMessage = "Sem conexão com a internet. Verifique sua rede";
          break;
        case "auth/invalid-email":
          errorMessage = "Email inválido";
          break;
        default:
          errorMessage = `Erro ao fazer login (${error.code})`;
      }

      set({ error: errorMessage, loading: false });
      return { success: false, error: errorMessage };
    }
  },

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

      set({ loading: false });
      return { success: true };
    } catch (error) {
      let errorMessage = "Erro ao cadastrar";

      switch (error.code) {
        case "auth/email-already-in-use":
          errorMessage = "Este email já está em uso";
          break;
        case "auth/invalid-email":
          errorMessage = "Email inválido";
          break;
        case "auth/weak-password":
          errorMessage = "Senha muito fraca. Use no mínimo 6 caracteres";
          break;
        case "auth/network-request-failed":
          errorMessage = "Sem conexão com a internet. Verifique sua rede";
          break;
        default:
          errorMessage = `Erro ao cadastrar (${error.code})`;
      }

      set({ error: errorMessage, loading: false });
      return { success: false, error: errorMessage };
    }
  },

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

  resetPassword: async (email) => {
    try {
      set({ loading: true, error: null });
      await sendPasswordResetEmail(auth, email);
      set({ loading: false });
      return { success: true };
    } catch (error) {
      let errorMessage = "Erro ao enviar email";

      switch (error.code) {
        case "auth/user-not-found":
          errorMessage = "Nenhuma conta encontrada com este email";
          break;
        case "auth/invalid-email":
          errorMessage = "Email inválido";
          break;
        case "auth/network-request-failed":
          errorMessage = "Sem conexão com a internet. Verifique sua rede";
          break;
        default:
          errorMessage = `Erro ao enviar email (${error.code})`;
      }

      set({ error: errorMessage, loading: false });
      return { success: false, error: errorMessage };
    }
  },

  clearError: () => set({ error: null }),
}));

export default useAuthStore;
