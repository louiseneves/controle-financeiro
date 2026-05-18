// MOCK ASYNC STORAGE
jest.mock("@react-native-async-storage/async-storage", () =>
  require("@react-native-async-storage/async-storage/jest/async-storage-mock"),
);

// MOCK EXPO CONSTANTS
jest.mock("expo-constants", () => ({
  expoConfig: {
    extra: {
      firebaseApiKey: "test-api-key",
      firebaseAuthDomain: "test.firebaseapp.com",
      firebaseProjectId: "test-project",
      firebaseStorageBucket: "test.appspot.com",
      firebaseMessagingSenderId: "123456789",
      firebaseAppId: "1:123:web:test",
    },
  },
}));

// MOCK FIREBASE APP
jest.mock("firebase/app", () => ({
  initializeApp: jest.fn(() => ({})),
}));

// MOCK FIREBASE AUTH
jest.mock("firebase/auth", () => ({
  getAuth: jest.fn(() => ({
    currentUser: null,
  })),

  initializeAuth: jest.fn(() => ({})),

  getReactNativePersistence: jest.fn(),

  createUserWithEmailAndPassword: jest.fn(async () => ({
    user: {
      uid: "mock-user-id",
      email: "test@test.com",
    },
  })),

  signInWithEmailAndPassword: jest.fn(async () => ({
    user: {
      uid: "mock-user-id",
      email: "test@test.com",
    },
  })),

  signOut: jest.fn(async () => true),

  onAuthStateChanged: jest.fn(),
}));

// MOCK FIRESTORE
// MOCK FIREBASE FIRESTORE
jest.mock("firebase/firestore", () => ({
  getFirestore: jest.fn(() => ({})),

  collection: jest.fn(),
  doc: jest.fn(),

  addDoc: jest.fn(async () => ({
    id: "mock-doc-id",
  })),

  getDocs: jest.fn(async () => ({
    docs: [],
  })),

  updateDoc: jest.fn(async () => true),

  deleteDoc: jest.fn(async () => true),

  query: jest.fn(),
  where: jest.fn(),
  orderBy: jest.fn(),

  serverTimestamp: jest.fn(() => new Date()),
}));
const mockAuthStore = {
  login: jest.fn(async () => ({
    success: false,
    error: "Credenciais inválidas",
  })),

  register: jest.fn(async () => ({
    success: false,
    error: "Erro",
  })),

  loading: false,
  error: null,
  user: null,
};

// 👇 CORRETO
jest.mock("../../src/store/authStore", () => {
  return {
    __esModule: true,
    default: (selector) => selector(mockAuthStore),
  };
});
import { render, fireEvent, waitFor } from "@testing-library/react-native";
import LoginScreen from "../../src/screens/auth/LoginScreen";
import RegisterScreen from "../../src/screens/auth/RegisterScreen";
import { ThemeProvider } from "../../src/context/ThemeContext";

const AllProviders = ({ children }) => {
  return <ThemeProvider>{children}</ThemeProvider>;
};

describe("Fluxo de Autenticação", () => {
  describe("Cadastro", () => {
    test("deve mostrar erro ao deixar campos vazios", async () => {
      const { getByText, getByPlaceholderText, getByTestId } = render(
        <RegisterScreen />,
        {
          wrapper: AllProviders,
        },
      );

      const signupButton = getByTestId("register-button");
      fireEvent.press(signupButton);

      await waitFor(() => {
        expect(getByText("Preencha todos os campos")).toBeTruthy();
      });
    });

    test("deve mostrar erro com email inválido", async () => {
      const { getByText, getByPlaceholderText, getByTestId } = render(
        <RegisterScreen />,
        {
          wrapper: AllProviders,
        },
      );

      const nameInput = getByPlaceholderText("João Silva");
      const emailInput = getByPlaceholderText("seu@email.com");
      const passwordInput = getByPlaceholderText("Mínimo 6 caracteres");
      const confirmPasswordInput = getByPlaceholderText(
        "Digite a senha novamente",
      );

      fireEvent.changeText(nameInput, "Teste Usuário");
      fireEvent.changeText(emailInput, "emailinvalido");
      fireEvent.changeText(passwordInput, "123456");
      fireEvent.changeText(confirmPasswordInput, "123456");

      const signupButton = getByTestId("register-button");
      fireEvent.press(signupButton);

      await waitFor(() => {
        expect(getByText(/email inválido/i)).toBeTruthy();
      });
    });

    test("deve mostrar erro com senhas diferentes", async () => {
      const { getByText, getByPlaceholderText, getByTestId } = render(
        <RegisterScreen />,
        {
          wrapper: AllProviders,
        },
      );

      const nameInput = getByPlaceholderText("João Silva");
      const emailInput = getByPlaceholderText("seu@email.com");
      const passwordInput = getByPlaceholderText("Mínimo 6 caracteres");
      const confirmPasswordInput = getByPlaceholderText(
        "Digite a senha novamente",
      );

      fireEvent.changeText(nameInput, "Teste Usuário");
      fireEvent.changeText(emailInput, "teste@exemplo.com");
      fireEvent.changeText(passwordInput, "123456");
      fireEvent.changeText(confirmPasswordInput, "654321");

      const signupButton = getByTestId("register-button");
      fireEvent.press(signupButton);

      await waitFor(() => {
        expect(getByText(/senhas não coincidem/i)).toBeTruthy();
      });
    });
  });

  describe("Login", () => {
    test("deve mostrar erro com credenciais inválidas", async () => {
      const { getByText, getByPlaceholderText } = render(<LoginScreen />, {
        wrapper: AllProviders,
      });

      const emailInput = getByPlaceholderText("seu@email.com");
      const passwordInput = getByPlaceholderText("••••••••");

      fireEvent.changeText(emailInput, "usuario@inexistente.com");
      fireEvent.changeText(passwordInput, "senhaerrada");

      const loginButton = getByText("Entrar");
      fireEvent.press(loginButton);

      await waitFor(() => {
        expect(getByText(/credenciais inválidas/i)).toBeTruthy();
      });
    });
  });
});
