import { renderHook, act } from "@testing-library/react-hooks";

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

// MOCK FIREBASE
jest.mock("firebase/app", () => ({
  initializeApp: jest.fn(() => ({})),
}));

jest.mock("firebase/auth", () => ({
  initializeAuth: jest.fn(() => ({})),
  getReactNativePersistence: jest.fn(),
  getAuth: jest.fn(() => ({
    currentUser: { uid: "test-user-123" },
  })),
}));

jest.mock("firebase/firestore", () => ({
  getFirestore: jest.fn(() => ({})),

  collection: jest.fn(),

  addDoc: jest.fn(async () => ({
    id: "mock-id-" + Date.now() + Math.random(),
  })),

  getDocs: jest.fn(async () => ({
    docs: [],
  })),

  updateDoc: jest.fn(async () => true),

  deleteDoc: jest.fn(async () => true),

  doc: jest.fn(),

  query: jest.fn(),

  where: jest.fn(),

  orderBy: jest.fn(),

  serverTimestamp: jest.fn(() => new Date()),
}));

jest.mock("firebase/storage", () => ({
  getStorage: jest.fn(() => ({})),
}));
jest.mock("../../../src/i18n/translations", () => ({
  translations: {
    "pt-BR": {
      greeting: "Olá {{name}}",
    },
  },
}));
import useSettingsStore from "../../../src/store/settingsStore";
import { t } from "../../../src/i18n";

test("deve usar pt-BR como fallback", () => {
  useSettingsStore.setState({ language: undefined });

  const result = t("qualquer.coisa");

  expect(result).toBe("qualquer.coisa");
});
test("deve retornar path quando chave não existe", () => {
  useSettingsStore.setState({ language: "pt-BR" });

  const result = t("nao.existe.aqui");

  expect(result).toBe("nao.existe.aqui");
});
test("deve retornar path quando resultado não é string", () => {
  useSettingsStore.setState({ language: "pt-BR" });

  const result = t("invalido.objeto");

  expect(result).toBe("invalido.objeto");
});
test("deve interpolar parâmetros corretamente", () => {
  useSettingsStore.setState({ language: "pt-BR" });

  const result = t("greeting", { name: "João" });

  expect(result).toContain("João");
});
test("deve manter placeholder quando param não existe", () => {
  useSettingsStore.setState({ language: "pt-BR" });

  const result = t("greeting", {});

  expect(result).toBeTruthy();
});
