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

import { Alert } from "react-native";
import useBudgetStore from "../../../src/store/budgetStore";
import useTransactionStore from "../../../src/store/transactionStore";
import useSettingsStore from "../../../src/store/settingsStore";
import NotificationService from "../../../src/services/notifications/notificationService";

jest.spyOn(Alert, "alert");

jest.mock("../../../src/services/notifications/notificationService", () => ({
  scheduleBudgetWarning: jest.fn(),
}));

describe("budgetStore", () => {
  const authModule = require("../../../src/services/firebase/config");
  beforeEach(() => {
    jest.clearAllMocks();

    authModule.auth.currentUser = {
      uid: "test-user-123",
    };

    useBudgetStore.setState({
      budgets: [],
      loading: false,
      error: null,
    });

    useTransactionStore.setState({
      transactions: [],
    });
  });

  test("deve adicionar orçamento", async () => {
    const result = await useBudgetStore.getState().addBudget({
      userId: "test-user-123",
      month: "2026-05",
      name: "Mercado",
      categories: {
        alimentacao: 500,
      },
    });

    const budgets = useBudgetStore.getState().budgets;

    expect(result.success).toBe(true);

    expect(budgets).toHaveLength(1);

    expect(budgets[0].name).toBe("Mercado");

    expect(budgets[0].userId).toBe("test-user-123");
  });
  test("não deve adicionar orçamento duplicado", async () => {
    const data = {
      userId: "test-user-123",
      month: "2026-05",
      name: "Mercado",
      categories: {
        alimentacao: 500,
      },
    };

    await useBudgetStore.getState().addBudget(data);

    const result = await useBudgetStore.getState().addBudget(data);

    expect(result.success).toBe(false);

    expect(result.error).toMatch(/já existe/i);

    expect(useBudgetStore.getState().budgets).toHaveLength(1);
  });
  test("deve remover orçamento", async () => {
    await useBudgetStore.getState().addBudget({
      userId: "123",
      month: "2026-05",
      name: "Mercado",
      categories: {},
    });

    const budget = useBudgetStore.getState().budgets[0];

    await useBudgetStore.getState().deleteBudget(budget.id);

    expect(useBudgetStore.getState().budgets).toHaveLength(0);
  });
  test("deve atualizar orçamento", async () => {
    await useBudgetStore.getState().addBudget({
      userId: "123",
      month: "2026-05",
      name: "Mercado",
      categories: {},
    });

    const budget = useBudgetStore.getState().budgets[0];

    await useBudgetStore.getState().updateBudget(budget.id, {
      name: "Mercado Atualizado",
    });

    const updated = useBudgetStore.getState().budgets[0];

    expect(updated.name).toBe("Mercado Atualizado");
  });
  test("deve retornar orçamento do mês atual", async () => {
    const now = new Date();

    const currentMonth = `${now.getFullYear()}-${String(
      now.getMonth() + 1,
    ).padStart(2, "0")}`;

    await useBudgetStore.getState().addBudget({
      userId: "123",
      month: currentMonth,
      name: "Mercado",
      categories: {},
    });

    const budget = useBudgetStore.getState().getCurrentMonthBudget();

    expect(budget).not.toBeNull();

    expect(budget.name).toBe("Mercado");
  });
  test("deve disparar alerta warning ao atingir 90%", async () => {
    useSettingsStore.setState({
      notifications: {
        enabled: true,
      },
    });

    useBudgetStore.setState({
      budgets: [
        {
          id: "1",
          userId: "user-1",
          month: "2026-05",
          categories: {
            food: 100,
          },
        },
      ],
    });

    useTransactionStore.setState({
      transactions: [
        {
          id: "t1",
          type: "despesa",
          category: "food",
          amount: 90,
          date: new Date().toISOString(),
        },
      ],
    });

    await useBudgetStore.getState().checkBudgetAlerts();

    expect(Alert.alert).toHaveBeenCalled();

    expect(NotificationService.scheduleBudgetWarning).toHaveBeenCalledWith(
      "food",
      "warning",
    );
  });
  test("deve disparar alerta exceeded ao ultrapassar 100%", async () => {
    useSettingsStore.setState({
      notifications: {
        enabled: true,
      },
    });

    useBudgetStore.setState({
      budgets: [
        {
          id: "1",
          userId: "user-1",
          month: "2026-05",
          categories: {
            food: 100,
          },
        },
      ],
    });

    useTransactionStore.setState({
      transactions: [
        {
          id: "t1",
          type: "despesa",
          category: "food",
          amount: 150,
          date: new Date().toISOString(),
        },
      ],
    });

    await useBudgetStore.getState().checkBudgetAlerts();

    expect(Alert.alert).toHaveBeenCalled();

    expect(NotificationService.scheduleBudgetWarning).toHaveBeenCalledWith(
      "food",
      "exceeded",
    );
  });
  test("não deve disparar alerta sem orçamento", async () => {
    useBudgetStore.setState({
      budgets: [],
    });

    useTransactionStore.setState({
      transactions: [],
    });

    await useBudgetStore.getState().checkBudgetAlerts();

    expect(Alert.alert).not.toHaveBeenCalled();
  });
  test("não deve mostrar alert em modo silent", async () => {
    useSettingsStore.setState({
      notifications: {
        enabled: true,
      },
    });

    useBudgetStore.setState({
      budgets: [
        {
          id: "1",
          userId: "user-1",
          month: "2026-05",
          categories: {
            food: 100,
          },
        },
      ],
    });

    useTransactionStore.setState({
      transactions: [
        {
          id: "t1",
          type: "despesa",
          category: "food",
          amount: 120,
          date: new Date().toISOString(),
        },
      ],
    });

    await useBudgetStore
      .getState()
      .checkBudgetAlerts(undefined, undefined, true);

    expect(Alert.alert).not.toHaveBeenCalled();
  });
  test("deve restaurar orçamentos", async () => {
    const budgetsBackup = [
      {
        id: "old-1",
        month: "2026-05",
        categories: {
          food: 500,
        },
      },
    ];

    const result = await useBudgetStore
      .getState()
      .restoreBudgets(budgetsBackup);

    expect(result.success).toBe(true);

    const budgets = useBudgetStore.getState().budgets;

    expect(budgets.length).toBeGreaterThan(0);
  });
  test("deve retornar erro ao restaurar formato inválido", async () => {
    const result = await useBudgetStore.getState().restoreBudgets(null);

    expect(result.success).toBe(false);

    expect(result.error).toBe("Formato inválido");
  });
  test("não deve restaurar sem usuário autenticado", async () => {
    const authModule = require("../../../src/services/firebase/config");

    authModule.auth.currentUser = null;

    const result = await useBudgetStore.getState().restoreBudgets([]);

    expect(result.success).toBe(false);

    expect(result.error).toBe("Usuário não autenticado");
  });
    test("deve limpar erro", () => {
  useBudgetStore.setState({
    error: "Erro teste",
  });

  useBudgetStore.getState().clearError();

  expect(useBudgetStore.getState().error).toBe(null);
    });
    test("deve falhar ao adicionar orçamento sem userId", async () => {
  const result = await useBudgetStore.getState().addBudget({
    name: "Mercado",
  });

  expect(result.success).toBe(false);
  expect(result.error).toBe("Usuário não autenticado");
    });
    test("deve carregar orçamentos do mês atual", async () => {
  const currentMonth = `${new Date().getFullYear()}-${String(
    new Date().getMonth() + 1
  ).padStart(2, "0")}`;

  useBudgetStore.setState({
    budgets: [
      {
        id: 1,
        month: currentMonth,
      },
    ],
  });

  const budget =
    useBudgetStore.getState().getCurrentMonthBudget();

  expect(budget).not.toBe(null);
});
});
