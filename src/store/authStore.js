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

  // ✅ VALIDAR EMAIL
  validateEmail: (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  },

  // ✅ LOGIN COM VALIDAÇÃO
  login: async (email, password) => {
    set({ loading: true, error: null });

    try {
      // ✅ Validações
      if (!email || !email.trim()) {
        throw new Error("Email é obrigatório");
      }

      const validateEmail = get().validateEmail;
      if (!validateEmail(email)) {
        throw new Error("Email inválido");
      }

      if (!password) {
        throw new Error("Senha é obrigatória");
      }

      if (password.length < 6) {
        throw new Error("Senha deve ter no mínimo 6 caracteres");
      }

      // 🔍 DEBUG
      console.log("🔍 Tentando login com:", { email, password: "***" });

      // ✅ Fazer login no Firebase
      const result = await signInWithEmailAndPassword(auth, email, password);

      console.log("✅ Login realizado:", result.user.email);

      // ✅ User já será setado pelo onAuthStateChanged
      set({ loading: false, error: null });
      return { success: true };
    } catch (error) {
      console.log("❌ Erro:", error.message, error.code);

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
          errorMessage = error.message || "Erro ao fazer login";
      }

      // ✅ CRÍTICO: Sempre desativar loading
      set({ error: errorMessage, loading: false });
      return { success: false, error: errorMessage };
    }
  },

  // ✅ REGISTER COM VALIDAÇÃO
  register: async (email, password, displayName) => {
    set({ loading: true, error: null });

    try {
      // ✅ Validações
      if (!email || !email.trim()) {
        throw new Error("Email é obrigatório");
      }

      const validateEmail = get().validateEmail;
      if (!validateEmail(email)) {
        throw new Error("Email inválido");
      }

      if (!password) {
        throw new Error("Senha é obrigatória");
      }

      if (password.length < 6) {
        throw new Error("Senha deve ter no mínimo 6 caracteres");
      }

      if (!displayName || !displayName.trim()) {
        throw new Error("Nome é obrigatório");
      }

      // ✅ Criar usuário no Firebase
      const { user } = await createUserWithEmailAndPassword(
        auth,
        email,
        password,
      );

      // ✅ Atualizar perfil
      if (displayName) {
        await updateProfile(user, { displayName });
      }

      // ✅ User já será setado pelo onAuthStateChanged
      set({ loading: false, error: null });
      return { success: true };
    } catch (error) {
      console.log("❌ Erro de registro:", error.message, error.code);

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
          errorMessage = error.message || "Erro ao cadastrar";
      }

      // ✅ CRÍTICO: Sempre desativar loading
      set({ error: errorMessage, loading: false });
      return { success: false, error: errorMessage };
    }
  },

  // ✅ LOGOUT COMPLETO
  logout: async () => {
    set({ loading: true, error: null });

    try {
      await signOut(auth);
      // ✅ Resetar tudo
      set({
        user: null,
        loading: false,
        error: null,
        initialized: true,
      });
      return { success: true };
    } catch (error) {
      console.log("❌ Erro ao fazer logout:", error.message);
      set({
        error: error.message,
        loading: false,
      });
      return { success: false, error: error.message };
    }
  },

  // ✅ RESET PASSWORD
  resetPassword: async (email) => {
    set({ loading: true, error: null });

    try {
      if (!email || !email.trim()) {
        throw new Error("Email é obrigatório");
      }

      const validateEmail = get().validateEmail;
      if (!validateEmail(email)) {
        throw new Error("Email inválido");
      }

      await sendPasswordResetEmail(auth, email);
      set({ loading: false });
      return { success: true };
    } catch (error) {
      set({ error: error.message, loading: false });
      return { success: false, error: error.message };
    }
  },

  // ✅ LIMPAR ERRO
  clearError: () => {
    set({ error: null });
  },
}));

export default useAuthStore;
