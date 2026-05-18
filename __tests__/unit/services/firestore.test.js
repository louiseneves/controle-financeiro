jest.mock("firebase/firestore", () => ({
  collection: jest.fn(),
  doc: jest.fn(),
  addDoc: jest.fn(),
  getDoc: jest.fn(),
  getDocs: jest.fn(),
  updateDoc: jest.fn(),
  deleteDoc: jest.fn(),
  query: jest.fn(),
  where: jest.fn(),
  orderBy: jest.fn(),
  limit: jest.fn(),
  serverTimestamp: jest.fn(() => "timestamp"),
  onSnapshot: jest.fn(),
}));

jest.mock("../../../src/services/firebase/config", () => ({
  db: {},
  COLLECTIONS: {
    TRANSACTIONS: "transactions",
    GOALS: "goals",
    INVESTMENTS: "investments",
    OFFERS: "offers",
  },
}));

import {
  addDoc,
  getDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  onSnapshot,
} from "firebase/firestore";

import {
  addDocument,
  getDocument,
  getDocuments,
  updateDocument,
  deleteDocument,
  backupUserData,
} from "../../../src/services/firebase/firestore";

describe("firestore - Sprint 3 FIXED FINAL", () => {
  beforeAll(() => {
    jest.spyOn(console, "error").mockImplementation(() => {});
  });

  afterAll(() => {
    console.error.mockRestore();
  });
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("deve adicionar documento", async () => {
    addDoc.mockResolvedValue({ id: "123" });
    const result = await addDocument("users", { nome: "Louise" });
    expect(result).toBe("123");
    expect(addDoc).toHaveBeenCalled();
  });

  it("deve retornar null se documento não existir", async () => {
    getDoc.mockResolvedValue({
      exists: () => false,
    });

    const result = await getDocument("users", "1");

    expect(result).toBeNull();
  });

  it("deve buscar documentos", async () => {
    getDocs.mockResolvedValue({
      docs: [{ id: "1", data: () => ({ nome: "Teste" }) }],
    });
    const docs = await getDocuments("test");
    expect(docs.length).toBe(1);
    expect(docs[0].nome).toBe("Teste");
  });

  it("deve deletar documento", async () => {
    deleteDoc.mockResolvedValue();
    const result = await deleteDocument("test", "123");
    expect(result).toBe(true);
  });

  it("deve lidar com erro no addDocument", async () => {
    addDoc.mockRejectedValue(new Error("fail"));
    await expect(addDocument("test", {})).rejects.toThrow("fail");
  });

  it("deve lidar com erro no getDocuments", async () => {
    getDocs.mockRejectedValue(new Error("fail"));
    await expect(getDocuments("test")).rejects.toThrow("fail");
  });

  it("deve lidar com erro no deleteDocument", async () => {
    deleteDoc.mockRejectedValue(new Error("fail"));
    await expect(deleteDocument("test", "1")).rejects.toThrow("fail");
  });

  it("deve lançar erro no updateDocument", async () => {
    updateDoc.mockRejectedValue(new Error("firestore error"));

    await expect(
      updateDocument("users", "1", {
        nome: "Teste",
      }),
    ).rejects.toThrow("firestore error");
  });
  it("deve buscar documento existente", async () => {
    getDoc.mockResolvedValue({
      exists: () => true,
      id: "1",
      data: () => ({
        nome: "Louise",
      }),
    });

    const result = await getDocument("users", "1");

    expect(result.id).toBe("1");
    expect(result.nome).toBe("Louise");
  });

  it("deve atualizar documento", async () => {
    updateDoc.mockResolvedValue();

    const result = await updateDocument("users", "1", {
      nome: "Novo",
    });

    expect(result).toBe(true);
  });

  it("deve buscar documentos com filtros", async () => {
    getDocs.mockResolvedValue({
      docs: [
        {
          id: "1",
          data: () => ({
            nome: "Teste",
          }),
        },
      ],
    });

    const result = await getDocuments(
      "users",
      {
        field: "userId",
        operator: "==",
        value: "1",
      },
      {
        field: "createdAt",
        direction: "desc",
      },
      10,
    );

    expect(result.length).toBe(1);
  });

  it("deve ouvir documento em tempo real", () => {
    const callback = jest.fn();

    onSnapshot.mockImplementation((ref, success) => {
      success({
        exists: () => true,
        id: "1",
        data: () => ({
          nome: "Realtime",
        }),
      });

      return jest.fn();
    });

    const {
      listenToDocument,
    } = require("../../../src/services/firebase/firestore");

    const unsubscribe = listenToDocument("users", "1", callback);

    expect(callback).toHaveBeenCalled();

    unsubscribe();
  });

  it("deve ouvir coleção em tempo real", () => {
    const callback = jest.fn();

    onSnapshot.mockImplementation((ref, success) => {
      success({
        docs: [
          {
            id: "1",
            data: () => ({
              nome: "Live",
            }),
          },
        ],
      });

      return jest.fn();
    });

    const {
      listenToCollection,
    } = require("../../../src/services/firebase/firestore");

    const unsubscribe = listenToCollection("users", callback);

    expect(callback).toHaveBeenCalled();

    unsubscribe();
  });

  it("deve fazer backupUserData", async () => {
    getDocs.mockResolvedValue({
      docs: [
        {
          id: "1",
          data: () => ({
            nome: "Teste",
          }),
        },
      ],
    });

    const result = await backupUserData("user-1");

    expect(result.transactions).toBeDefined();
    expect(result.goals).toBeDefined();
    expect(result.investments).toBeDefined();
    expect(result.offers).toBeDefined();
  });
});
