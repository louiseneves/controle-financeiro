import { useBackupStore } from "../../../src/store/backupStore";

// MOCKS (CORRETO — FORA DOS TESTES)
jest.mock("../../../src/services/firebase/config", () => ({
  auth: {
    currentUser: { uid: "test-user" },
  },
}));

jest.mock("../../../src/services/firebase/firestore", () => ({
  addDocument: jest.fn(() => Promise.resolve("backup-id")),
  getDocuments: jest.fn(() => Promise.resolve([])),
  deleteDocument: jest.fn(() => Promise.resolve(true)),
}));

jest.mock("../../../src/store/transactionStore", () => ({
  __esModule: true,
  default: {
    getState: () => ({
      transactions: [],
      restoreTransactions: jest.fn().mockResolvedValue(true),
    }),
  },
}));

jest.mock("../../../src/store/goalsStore", () => ({
  __esModule: true,
  default: {
    getState: () => ({
      goals: [],
      restoreGoals: jest.fn().mockResolvedValue(true),
    }),
  },
}));

jest.mock("../../../src/store/budgetStore", () => ({
  __esModule: true,
  default: {
    getState: () => ({
      budgets: [],
      restoreBudgets: jest.fn().mockResolvedValue(true),
    }),
  },
}));

jest.mock("@react-native-async-storage/async-storage", () =>
  require("@react-native-async-storage/async-storage/jest/async-storage-mock"),
);
import AsyncStorage from "@react-native-async-storage/async-storage";
describe("backupStore - Sprint 3 FINAL", () => {
  beforeAll(() => {
    jest.spyOn(console, "error").mockImplementation(() => {});
  });

  afterAll(() => {
    console.error.mockRestore();
  });
  beforeEach(() => {
    useBackupStore.setState({
      backups: [],
      loading: false,
      autoBackupEnabled: true,
      lastBackup: null,
    });

    jest.clearAllMocks();
  });

  it("deve iniciar com estado padrão", () => {
    const state = useBackupStore.getState();

    expect(state.backups).toEqual([]);
    expect(state.loading).toBe(false);
    expect(state.autoBackupEnabled).toBe(true);
  });

  it("deve ativar/desativar auto backup", async () => {
    await useBackupStore.getState().toggleAutoBackup(false);

    expect(useBackupStore.getState().autoBackupEnabled).toBe(false);
  });

  it("deve criar backup com sucesso", async () => {
    const result = await useBackupStore.getState().createBackup(false, true);

    expect(result).toBeDefined();

    const state = useBackupStore.getState();
    expect(state.lastBackup).not.toBeNull();
    expect(state.backups.length).toBeGreaterThanOrEqual(0);
  });

  it("deve bloquear backup manual ao atingir limite free", async () => {
    useBackupStore.setState({
      backups: Array.from({ length: 3 }, (_, i) => ({
        id: i,
        isAutomatic: false,
      })),
    });

    await expect(
      useBackupStore.getState().createBackup(false, false),
    ).rejects.toThrow("BACKUP_LIMIT");
  });

  it("deve permitir backup automático mesmo no limite", async () => {
    useBackupStore.setState({
      backups: Array.from({ length: 3 }, (_, i) => ({
        id: i,
        isAutomatic: false,
      })),
    });

    const result = await useBackupStore.getState().createBackup(true, false);

    expect(result).toBeDefined();
  });

  it("deve exportar JSON corretamente", async () => {
    const json = await useBackupStore.getState().exportBackupJSON();

    expect(typeof json).toBe("string");
    expect(json).toContain("version");
    expect(json).toContain("transactions");
  });

  it("deve importar JSON inválido e falhar", async () => {
    await expect(
      useBackupStore.getState().importBackupJSON("{}"),
    ).rejects.toThrow("Formato inválido");
  });

  it("deve deletar backup corretamente", async () => {
    await useBackupStore.getState().deleteBackup("123");

    const state = useBackupStore.getState();
    expect(state.backups).toBeDefined();
  });

  it("deve falhar restore com backup inválido", async () => {
    useBackupStore.setState({
      backups: [
        {
          id: "1",
          version: "0.0.1",
          data: null,
        },
      ],
    });

    await expect(
      useBackupStore.getState().restoreBackup("1"),
    ).rejects.toThrow();
  });
  test("deve falhar restore com versão inválida", async () => {
    const store = useBackupStore.getState();

    store.backups = [
      {
        id: "1",
        version: "0.0.0",
        data: { transactions: [], goals: [], budgets: [] },
      },
    ];

    await expect(store.restoreBackup("1")).rejects.toThrow();
  });
  describe("backupStore - extra coverage", () => {
    test("loadSettings deve carregar settings salvos", async () => {
      AsyncStorage.getItem.mockResolvedValueOnce(
        JSON.stringify({
          autoBackupEnabled: false,
          lastBackup: "2025",
        }),
      );

      await useBackupStore.getState().loadSettings();

      const state = useBackupStore.getState();

      expect(state.autoBackupEnabled).toBe(false);
      expect(state.lastBackup).toBe("2025");
    });

    test("loadSettings catch", async () => {
      AsyncStorage.getItem.mockRejectedValueOnce(new Error("fail"));

      await useBackupStore.getState().loadSettings();

      expect(console.error).toHaveBeenCalled();
    });

    test("saveSettings catch", async () => {
      AsyncStorage.setItem.mockRejectedValueOnce(new Error("fail"));

      await useBackupStore.getState().saveSettings();

      expect(console.error).toHaveBeenCalled();
    });

    test("createBackup deve retornar se loading=true", async () => {
      useBackupStore.setState({ loading: true });

      const result = await useBackupStore.getState().createBackup();

      expect(result).toBeUndefined();
    });

    test("createBackup sem usuário", async () => {
      const config = require("../../../src/services/firebase/config");

      config.auth.currentUser = null;

      await expect(useBackupStore.getState().createBackup()).rejects.toThrow(
        "Usuário não autenticado",
      );

      config.auth.currentUser = { uid: "test-user" };
    });

    test("loadBackups sem usuário", async () => {
      const config = require("../../../src/services/firebase/config");

      config.auth.currentUser = null;

      const result = await useBackupStore.getState().loadBackups();

      expect(result).toBeUndefined();

      config.auth.currentUser = { uid: "test-user" };
    });

    test("loadBackups catch", async () => {
      const firestore = require("../../../src/services/firebase/firestore");

      firestore.getDocuments.mockRejectedValueOnce(new Error("fail"));

      await useBackupStore.getState().loadBackups();

      expect(console.error).toHaveBeenCalled();
    });

    test("deleteBackup catch", async () => {
      const firestore = require("../../../src/services/firebase/firestore");

      firestore.deleteDocument.mockRejectedValueOnce(new Error("fail"));

      await expect(
        useBackupStore.getState().deleteBackup("1"),
      ).rejects.toThrow();
    });

    test("exportBackupJSON catch", async () => {
      const transactionStore = require("../../../src/store/transactionStore");

      transactionStore.default.getState = () => {
        throw new Error("fail");
      };

      await expect(
        useBackupStore.getState().exportBackupJSON(),
      ).rejects.toThrow();

      transactionStore.default.getState = () => ({
        transactions: [],
        restoreTransactions: jest.fn().mockResolvedValue(true),
      });
    });

    test("importBackupJSON sucesso", async () => {
      const json = JSON.stringify({
        data: {
          transactions: [],
          goals: [],
          budgets: [],
        },
      });

      const result = await useBackupStore.getState().importBackupJSON(json);

      expect(result).toBe(true);
    });

    test("restoreBackup transactions inválidas", async () => {
      useBackupStore.setState({
        backups: [
          {
            id: "1",
            version: "1.0.0",
            data: {
              transactions: null,
              goals: [],
              budgets: [],
            },
          },
        ],
      });

      await expect(
        useBackupStore.getState().restoreBackup("1"),
      ).rejects.toThrow("Transactions inválidas");
    });

    test("restoreBackup goals inválidas", async () => {
      useBackupStore.setState({
        backups: [
          {
            id: "1",
            version: "1.0.0",
            data: {
              transactions: [],
              goals: null,
              budgets: [],
            },
          },
        ],
      });

      await expect(
        useBackupStore.getState().restoreBackup("1"),
      ).rejects.toThrow("Goals inválidas");
    });

    test("restoreBackup budgets inválidos", async () => {
      useBackupStore.setState({
        backups: [
          {
            id: "1",
            version: "1.0.0",
            data: {
              transactions: [],
              goals: [],
              budgets: null,
            },
          },
        ],
      });

      await expect(
        useBackupStore.getState().restoreBackup("1"),
      ).rejects.toThrow("Budgets inválidos");
    });
  });
});
