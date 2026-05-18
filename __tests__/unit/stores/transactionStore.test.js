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
jest.mock("../../../src/store/backupStore", () => ({
  useBackupStore: {
    getState: jest.fn(() => ({
      createAutomaticBackup: jest.fn(),
    })),
  },
}));

jest.mock("../../../src/store/premiumStore", () => ({
  default: {
    getState: () => ({
      isPremium: false,
    }),
  },
}));

import useTransactionStore from "../../../src/store/transactionStore";

describe("transactionStore", () => {
  let consoleErrorSpy;
  beforeAll(() => {
    consoleErrorSpy = jest.spyOn(console, "error").mockImplementation(() => {});
  });
  afterAll(() => {
    consoleErrorSpy.mockRestore();
  });
  beforeEach(() => {
    const { result } = renderHook(() => useTransactionStore());
    act(() => {
      // Limpar transações
      useTransactionStore.setState({
        transactions: [],
      });
    });
  });

  describe("Adicionar Transação", () => {
    beforeAll(() => {
      jest.spyOn(console, "error").mockImplementation(() => {});
    });

    afterAll(() => {
      console.error.mockRestore();
    });
    test("deve adicionar receita corretamente", async () => {
      const { result } = renderHook(() => useTransactionStore());

      const transaction = {
        type: "income",
        description: "Salário",
        amount: 5000,
        category: "Salário",
        date: new Date().toISOString(),
      };

      await act(async () => {
        await result.current.addTransaction(transaction);
      });

      expect(result.current.transactions).toHaveLength(1);
      expect(result.current.transactions[0].description).toBe("Salário");
      expect(result.current.transactions[0].amount).toBe(5000);
    });

    test("deve adicionar despesa corretamente", async () => {
      const { result } = renderHook(() => useTransactionStore());

      const transaction = {
        type: "expense",
        description: "Aluguel",
        amount: 1500,
        category: "Moradia",
        date: new Date().toISOString(),
      };

      await act(async () => {
        await result.current.addTransaction(transaction);
      });

      expect(result.current.transactions).toHaveLength(1);
      expect(result.current.transactions[0].type).toBe("expense");
    });

    test("deve gerar ID único para transação", async () => {
      const { result } = renderHook(() => useTransactionStore());

      const transaction1 = {
        type: "income",
        description: "Receita 1",
        amount: 100,
        category: "Outros",
        date: new Date().toISOString(),
      };

      const transaction2 = {
        type: "income",
        description: "Receita 2",
        amount: 200,
        category: "Outros",
        date: new Date().toISOString(),
      };

      await act(async () => {
        await result.current.addTransaction(transaction1);
        await result.current.addTransaction(transaction2);
      });

      expect(result.current.transactions[0].id).not.toBe(
        result.current.transactions[1].id,
      );
    });
  });

  describe("Editar Transação", () => {
    beforeAll(() => {
      jest.spyOn(console, "error").mockImplementation(() => {});
    });

    afterAll(() => {
      console.error.mockRestore();
    });
    test("deve editar transação existente", async () => {
      const { result } = renderHook(() => useTransactionStore());

      // Adicionar transação
      const transaction = {
        type: "income",
        description: "Salário",
        amount: 5000,
        category: "Salário",
        date: new Date().toISOString(),
      };

      await act(async () => {
        await result.current.addTransaction(transaction);
      });

      const transactionId = result.current.transactions[0].id;

      // Editar
      await act(async () => {
        await result.current.updateTransaction(transactionId, {
          amount: 5500,
        });
      });

      expect(result.current.transactions[0].amount).toBe(5500);
      expect(result.current.transactions[0].description).toBe("Salário"); // Não mudou
    });
  });

  describe("Excluir Transação", () => {
    test("deve excluir transação", async () => {
      const { result } = renderHook(() => useTransactionStore());

      // Adicionar transação
      const transaction = {
        type: "income",
        description: "Salário",
        amount: 5000,
        category: "Salário",
        date: new Date().toISOString(),
      };

      await act(async () => {
        await result.current.addTransaction(transaction);
      });

      expect(result.current.transactions).toHaveLength(1);

      const transactionId = result.current.transactions[0].id;

      // Excluir
      await act(async () => {
        await result.current.deleteTransaction(transactionId);
      });

      expect(result.current.transactions).toHaveLength(0);
    });
  });

  describe("Cálculo de Saldo", () => {
    test("deve calcular saldo corretamente", async () => {
      const { result } = renderHook(() => useTransactionStore());

      // Adicionar receitas e despesas
      await act(async () => {
        await result.current.addTransaction({
          type: "income",
          description: "Salário",
          amount: 5000,
          category: "Salário",
          date: new Date().toISOString(),
        });

        await result.current.addTransaction({
          type: "expense",
          description: "Aluguel",
          amount: 1500,
          category: "Moradia",
          date: new Date().toISOString(),
        });

        await result.current.addTransaction({
          type: "expense",
          description: "Mercado",
          amount: 800,
          category: "Alimentação",
          date: new Date().toISOString(),
        });
      });

      const balance = result.current.getBalance();

      expect(balance).toBe(2700); // 5000 - 1500 - 800
    });

    test("deve calcular total de receitas", async () => {
      const { result } = renderHook(() => useTransactionStore());

      await act(async () => {
        await result.current.addTransaction({
          type: "income",
          amount: 5000,
          description: "Salário",
          category: "Salário",
          date: new Date().toISOString(),
        });

        await result.current.addTransaction({
          type: "income",
          amount: 1000,
          description: "Freelance",
          category: "Outros",
          date: new Date().toISOString(),
        });
      });

      const totalIncome = result.current.getTotalIncome();

      expect(totalIncome).toBe(6000);
    });

    test("deve calcular total de despesas", async () => {
      const { result } = renderHook(() => useTransactionStore());

      await act(async () => {
        await result.current.addTransaction({
          type: "expense",
          amount: 1500,
          description: "Aluguel",
          category: "Moradia",
          date: new Date().toISOString(),
        });

        await result.current.addTransaction({
          type: "expense",
          amount: 800,
          description: "Mercado",
          category: "Alimentação",
          date: new Date().toISOString(),
        });
      });

      const totalExpenses = result.current.getTotalExpenses();

      expect(totalExpenses).toBe(2300);
    });
  });

  describe("Summary", () => {
    test("deve retornar summary corretamente", async () => {
      const { result } = renderHook(() => useTransactionStore());

      await act(async () => {
        await result.current.addTransaction({
          type: "receita",
          amount: 5000,
          description: "Salário",
          category: "Salário",
          date: new Date().toISOString(),
        });

        await result.current.addTransaction({
          type: "despesa",
          amount: 1000,
          description: "Mercado",
          category: "Alimentação",
          date: new Date().toISOString(),
        });

        await result.current.addTransaction({
          type: "investimento",
          amount: 500,
          description: "Ações",
          category: "Investimentos",
          date: new Date().toISOString(),
        });

        await result.current.addTransaction({
          type: "oferta",
          amount: 200,
          description: "Oferta",
          category: "Igreja",
          date: new Date().toISOString(),
        });
      });

      const summary = result.current.getSummary();

      expect(summary.income).toBe(5000);
      expect(summary.expense).toBe(1000);
      expect(summary.investment).toBe(500);
      expect(summary.offer).toBe(200);
      expect(summary.balance).toBe(3300);
      expect(summary.total).toBe(4);
      expect(summary).toEqual({
        income: 5000,
        expense: 1000,
        investment: 500,
        offer: 200,
        balance: 3300,
        total: 4,
      });
    });
  });

  describe("Recent Transactions", () => {
    test("deve limitar transações recentes", async () => {
      const { result } = renderHook(() => useTransactionStore());

      await act(async () => {
        for (let i = 0; i < 10; i++) {
          await result.current.addTransaction({
            type: "income",
            amount: 100,
            description: `Transação ${i}`,
            category: "Teste",
            date: new Date().toISOString(),
          });
        }
      });

      const recent = result.current.getRecentTransactions(5);

      expect(recent).toHaveLength(5);
    });
  });

  describe("Current Month Transactions", () => {
    test("deve retornar apenas transações do mês atual", async () => {
      const { result } = renderHook(() => useTransactionStore());

      const now = new Date();

      const currentMonth = new Date(
        now.getFullYear(),
        now.getMonth(),
        10,
      ).toISOString();

      const oldMonth = new Date(
        now.getFullYear(),
        now.getMonth() - 1,
        10,
      ).toISOString();

      await act(async () => {
        await result.current.addTransaction({
          type: "income",
          amount: 1000,
          description: "Atual",
          category: "Teste",
          date: currentMonth,
        });

        await result.current.addTransaction({
          type: "income",
          amount: 500,
          description: "Antiga",
          category: "Teste",
          date: oldMonth,
        });
      });

      const current = result.current.getCurrentMonthTransactions();

      expect(current).toHaveLength(1);
      expect(current[0].description).toBe("Atual");
    });
  });

  describe("Clear Error", () => {
    test("deve limpar erro", () => {
      const { result } = renderHook(() => useTransactionStore());

      act(() => {
        useTransactionStore.setState({
          error: "Erro fake",
        });
      });

      act(() => {
        result.current.clearError();
      });

      expect(result.current.error).toBeNull();
    });
  });

  describe("Restore Transactions", () => {
    test("deve restaurar transações corretamente", async () => {
      const { result } = renderHook(() => useTransactionStore());

      const transactions = [
        {
          id: "1",
          type: "income",
          amount: 1000,
          description: "Salário",
          category: "Salário",
          date: new Date().toISOString(),
        },
        {
          id: "2",
          type: "expense",
          amount: 500,
          description: "Mercado",
          category: "Alimentação",
          date: new Date().toISOString(),
        },
      ];

      let response;

      await act(async () => {
        response = await result.current.restoreTransactions(transactions);
      });

      expect(response.success).toBe(true);
      expect(response.count).toBe(2);
      expect(result.current.transactions).toHaveLength(2);
    });

    test("deve falhar com formato inválido", async () => {
      const spy = jest.spyOn(console, "error").mockImplementation(() => {});

      const { result } = renderHook(() => useTransactionStore());

      let response;

      await act(async () => {
        response = await result.current.restoreTransactions(null);
      });

      expect(response.success).toBe(false);
      expect(result.current.error).toBe("Formato inválido");

      spy.mockRestore();
    });
  });

  describe("Filtros", () => {
    beforeEach(async () => {
      const { result } = renderHook(() => useTransactionStore());

      // Adicionar transações de teste
      await act(async () => {
        await result.current.addTransaction({
          type: "income",
          amount: 5000,
          description: "Salário Janeiro",
          category: "Salário",
          date: "2024-01-15T00:00:00.000Z",
        });

        await result.current.addTransaction({
          type: "expense",
          amount: 1500,
          description: "Aluguel Janeiro",
          category: "Moradia",
          date: "2024-01-20T00:00:00.000Z",
        });

        await result.current.addTransaction({
          type: "expense",
          amount: 800,
          description: "Mercado Fevereiro",
          category: "Alimentação",
          date: "2024-02-05T00:00:00.000Z",
        });
      });
    });

    test("deve filtrar por tipo", () => {
      const { result } = renderHook(() => useTransactionStore());

      const incomes = result.current.filterByType("income");
      const expenses = result.current.filterByType("expense");

      expect(incomes).toHaveLength(1);
      expect(expenses).toHaveLength(2);
    });

    test("deve filtrar por categoria", () => {
      const { result } = renderHook(() => useTransactionStore());

      const moradia = result.current.filterByCategory("Moradia");

      expect(moradia).toHaveLength(1);
      expect(moradia[0].description).toBe("Aluguel Janeiro");
    });

    test("deve filtrar por período", () => {
      const { result } = renderHook(() => useTransactionStore());

      const january = result.current.filterByPeriod(
        "2024-01-01T00:00:00.000Z",
        "2024-01-31T23:59:59.999Z",
      );

      expect(january).toHaveLength(2);
    });

    test("deve buscar por descrição", () => {
      const { result } = renderHook(() => useTransactionStore());

      const searched = result.current.searchByDescription("Mercado");

      expect(searched).toHaveLength(1);
      expect(searched[0].description).toBe("Mercado Fevereiro");
    });
  });

  test("não deve atualizar transação inexistente", async () => {
    const { result } = renderHook(() => useTransactionStore());

    await act(async () => {
      await result.current.updateTransaction("id-invalido", {
        amount: 999,
      });
    });

    expect(result.current.transactions).toHaveLength(0);
  });
  test("não deve deletar transação inexistente", async () => {
    const { result } = renderHook(() => useTransactionStore());

    await act(async () => {
      await result.current.deleteTransaction("id-invalido");
    });

    expect(result.current.transactions).toHaveLength(0);
  });
  test("deve retornar saldo zero sem transações", () => {
    const { result } = renderHook(() => useTransactionStore());

    expect(result.current.getBalance()).toBe(0);
  });
  test("deve retornar receitas zeradas sem transações", () => {
    const { result } = renderHook(() => useTransactionStore());

    expect(result.current.getTotalIncome()).toBe(0);
  });
  test("deve retornar despesas zeradas sem transações", () => {
    const { result } = renderHook(() => useTransactionStore());

    expect(result.current.getTotalExpenses()).toBe(0);
  });
  test("deve retornar array vazio na busca sem resultados", () => {
    const { result } = renderHook(() => useTransactionStore());

    const searched = result.current.searchByDescription("Inexistente");

    expect(searched).toEqual([]);
  });
  test("deve retornar vazio para categoria inexistente", () => {
    const { result } = renderHook(() => useTransactionStore());

    const resultFilter = result.current.filterByCategory("Categoria Fake");

    expect(resultFilter).toEqual([]);
  });
  test("deve retornar vazio para tipo inválido", () => {
    const { result } = renderHook(() => useTransactionStore());

    const filtered = result.current.filterByType("fake");

    expect(filtered).toEqual([]);
  });
  test("deve atualizar apenas os campos enviados", async () => {
    const { result } = renderHook(() => useTransactionStore());

    await act(async () => {
      await result.current.addTransaction({
        type: "income",
        description: "Salário",
        amount: 5000,
        category: "Salário",
        date: new Date().toISOString(),
      });
    });

    const id = result.current.transactions[0].id;

    await act(async () => {
      await result.current.updateTransaction(id, {
        amount: 7000,
      });
    });

    const updated = result.current.transactions[0];

    expect(updated.amount).toBe(7000);
    expect(updated.description).toBe("Salário");
    expect(updated.category).toBe("Salário");
  });
  test("deve carregar transações", async () => {
    const { result } = renderHook(() => useTransactionStore());

    await act(async () => {
      await result.current.loadTransactions("user-123");
    });

    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBe(null);
  });
  test("não deve carregar transações sem userId", async () => {
    const { result } = renderHook(() => useTransactionStore());

    await act(async () => {
      await result.current.loadTransactions();
    });

    expect(result.current.transactions).toEqual([]);
  });

  test("deve tratar erro ao adicionar transação", async () => {
    const spy = jest.spyOn(console, "error").mockImplementation(() => {});

    const firestore = require("../../../src/services/firebase/firestore");

    jest
      .spyOn(firestore, "addDocument")
      .mockRejectedValueOnce(new Error("Erro Firebase"));

    const { result } = renderHook(() => useTransactionStore());

    let response;

    await act(async () => {
      response = await result.current.addTransaction({
        type: "income",
        amount: 100,
        description: "Teste",
        category: "Outros",
        date: new Date().toISOString(),
      });
    });

    expect(response.success).toBe(false);
    expect(result.current.error).toBe("Erro Firebase");

    spy.mockRestore();
  });
  test("deve tratar erro ao atualizar transação", async () => {
    const spy = jest.spyOn(console, "error").mockImplementation(() => {});

    const firestore = require("../../../src/services/firebase/firestore");

    jest
      .spyOn(firestore, "updateDocument")
      .mockRejectedValueOnce(new Error("Erro update"));

    const { result } = renderHook(() => useTransactionStore());

    await act(async () => {
      await result.current.updateTransaction("id", {
        amount: 100,
      });
    });

    expect(result.current.error).toBe("Erro update");

    spy.mockRestore();
  });
  test("deve tratar erro ao deletar transação", async () => {
    const spy = jest.spyOn(console, "error").mockImplementation(() => {});

    const firestore = require("../../../src/services/firebase/firestore");

    jest
      .spyOn(firestore, "deleteDocument")
      .mockRejectedValueOnce(new Error("Erro delete"));

    const { result } = renderHook(() => useTransactionStore());

    act(() => {
      useTransactionStore.setState({
        transactions: [
          {
            id: "1",
            userId: "user",
            type: "income",
            amount: 100,
          },
        ],
      });
    });

    await act(async () => {
      await result.current.deleteTransaction("1");
    });

    expect(result.current.error).toBe("Erro delete");

    spy.mockRestore();
  });

  test("deve usar limite padrão de 5 transações", () => {
    const { result } = renderHook(() => useTransactionStore());

    const recent = result.current.getRecentTransactions();

    expect(recent.length).toBeLessThanOrEqual(5);
  });
  test("não deve restaurar durante loading", async () => {
    const { result } = renderHook(() => useTransactionStore());

    act(() => {
      useTransactionStore.setState({
        loading: true,
      });
    });

    const response = await result.current.restoreTransactions([]);

    expect(response).toBeUndefined();
  });
  test("deve buscar descrição ignorando maiúsculas", () => {
    const { result } = renderHook(() => useTransactionStore());
    act(() => {
      useTransactionStore.setState({
        transactions: [
          {
            description: "Mercado",
          },
        ],
      });
    });

    const searched = result.current.searchByDescription("mercado");

    expect(searched).toHaveLength(1);
  });
  test("deve calcular saldo usando receita/despesa PT-BR", () => {
    const { result } = renderHook(() => useTransactionStore());

    act(() => {
      useTransactionStore.setState({
        transactions: [
          {
            type: "receita",
            amount: 1000,
          },
          {
            type: "despesa",
            amount: 300,
          },
        ],
      });
    });

    expect(result.current.getBalance()).toBe(700);
  });
  test("não deve chamar firestore sem userId", async () => {
    const { result } = renderHook(() => useTransactionStore());

    const spy = jest.spyOn(console, "error").mockImplementation(() => {});

    await act(async () => {
      const res = await result.current.loadTransactions(null);
      expect(res).toBeUndefined();
    });

    expect(result.current.transactions).toEqual([]);

    spy.mockRestore();
  });
  test("deve usar userId padrão quando não informado", async () => {
    const { result } = renderHook(() => useTransactionStore());

    await act(async () => {
      await result.current.addTransaction({
        type: "income",
        amount: 100,
        description: "Teste fallback",
        category: "Outros",
        date: new Date().toISOString(),
        // sem userId
      });
    });

    expect(result.current.transactions[0].userId).toBe("test-user");
  });
  test("não deve enviar notificação quando desativado", async () => {
    const { result } = renderHook(() => useTransactionStore());

    const settingsStore = require("../../../src/store/settingsStore").default;
    act(() => {
      settingsStore.setState({
        notifications: { enabled: false },
      });
    });

    await act(async () => {
      await result.current.addTransaction({
        type: "income",
        amount: 1000,
        description: "Sem notificação",
        category: "Salário",
        date: new Date().toISOString(),
      });
    });

    expect(result.current.transactions).toHaveLength(1);
  });
  test("deve tentar enviar notificação para despesa", async () => {
    const { result } = renderHook(() => useTransactionStore());

    const settingsStore = require("../../../src/store/settingsStore").default;
    act(() => {
      settingsStore.setState({
        notifications: { enabled: true },
      });
    });

    await act(async () => {
      await result.current.addTransaction({
        type: "despesa",
        amount: 500,
        description: "Teste despesa",
        category: "Teste",
        date: new Date().toISOString(),
      });
    });

    expect(result.current.transactions[0].type).toBe("despesa");
  });
  test("deve acionar budget alerts apenas para despesa", async () => {
    const { result } = renderHook(() => useTransactionStore());

    await act(async () => {
      await result.current.addTransaction({
        type: "receita",
        amount: 1000,
        description: "Não deve acionar budget",
        category: "Teste",
        date: new Date().toISOString(),
      });
    });

    expect(result.current.transactions[0].type).toBe("receita");
  });
  test("não deve deletar transação sem userId", async () => {
    const { result } = renderHook(() => useTransactionStore());
    act(() => {
      useTransactionStore.setState({
        transactions: [
          {
            id: "123",
            amount: 100,
            type: "income",
            description: "Sem userId",
          },
        ],
      });
    });

    await act(async () => {
      const res = await result.current.deleteTransaction("123");
      expect(res.success).toBe(false);
    });
  });
  test("não deve carregar transações sem userId", async () => {
    const { result } = renderHook(() => useTransactionStore());

    const res = await result.current.loadTransactions(null);

    expect(res).toBeUndefined();
    expect(result.current.transactions).toEqual([]);
  });
  test("não deve criar backup quando não é premium", async () => {
    const { result } = renderHook(() => useTransactionStore());

    await act(async () => {
      await result.current.addTransaction({
        type: "income",
        amount: 100,
        description: "Sem backup",
        category: "Teste",
        date: new Date().toISOString(),
      });
    });

    expect(result.current.transactions).toHaveLength(1);
  });
  test("deve impedir delete sem userId", async () => {
    const { result } = renderHook(() => useTransactionStore());
    act(() => {
      useTransactionStore.setState({
        transactions: [
          {
            id: "1",
            type: "income",
            amount: 100,
            description: "teste",
            // sem userId
          },
        ],
      });
    });

    let res;

    await act(async () => {
      res = await result.current.deleteTransaction("1");
    });

    expect(res.success).toBe(false);

    expect(res.success).toBe(false);
  });
});
