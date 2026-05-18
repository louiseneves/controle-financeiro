jest.mock("@react-native-async-storage/async-storage", () => ({
  setItem: jest.fn(),
  getItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
  getAllKeys: jest.fn(),
  multiSet: jest.fn(),
  multiGet: jest.fn(),
}));

import AsyncStorage from "@react-native-async-storage/async-storage";

import {
  saveData,
  getData,
  removeData,
  clearAll,
  getAllKeys,
  saveMultiple,
  getMultiple,
  STORAGE_KEYS,
} from "../../../src/services/storage/asyncStorage";

describe("asyncStorage service", () => {
  beforeEach(() => {
    jest.clearAllMocks();

    jest.spyOn(console, "error").mockImplementation(() => {});
    jest.spyOn(console, "log").mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  // =========================
  // saveData
  // =========================

  it("deve salvar dados", async () => {
    AsyncStorage.setItem.mockResolvedValue();

    const result = await saveData("key", { a: 1 });

    expect(result).toBe(true);

    expect(AsyncStorage.setItem).toHaveBeenCalledWith(
      "key",
      JSON.stringify({ a: 1 }),
    );
  });

  it("deve lidar com erro ao salvar", async () => {
    AsyncStorage.setItem.mockRejectedValue(new Error("fail"));

    const result = await saveData("key", {});

    expect(result).toBe(false);
  });

  it("deve lidar com referência circular", async () => {
    AsyncStorage.setItem.mockResolvedValue();

    const obj = {};
    obj.self = obj;

    const result = await saveData("circular", obj);

    expect(result).toBe(true);
  });

  // =========================
  // getData
  // =========================

  it("deve recuperar dados", async () => {
    AsyncStorage.getItem.mockResolvedValue(JSON.stringify({ test: true }));

    const result = await getData("key");

    expect(result).toEqual({ test: true });
  });

  it("deve retornar null quando não existir", async () => {
    AsyncStorage.getItem.mockResolvedValue(null);

    const result = await getData("key");

    expect(result).toBeNull();
  });

  it("deve lidar com JSON inválido", async () => {
    AsyncStorage.getItem.mockResolvedValue("{ invalid json");

    const result = await getData("key");

    expect(result).toBeNull();
  });

  it("deve lidar com erro ao recuperar", async () => {
    AsyncStorage.getItem.mockRejectedValue(new Error("fail"));

    const result = await getData("key");

    expect(result).toBeNull();
  });

  // =========================
  // removeData
  // =========================

  it("deve remover dados", async () => {
    AsyncStorage.removeItem.mockResolvedValue();

    const result = await removeData("key");

    expect(result).toBe(true);
  });

  it("deve lidar com erro ao remover", async () => {
    AsyncStorage.removeItem.mockRejectedValue(new Error("fail"));

    const result = await removeData("key");

    expect(result).toBe(false);
  });

  // =========================
  // clearAll
  // =========================

  it("deve limpar storage", async () => {
    AsyncStorage.clear.mockResolvedValue();

    const result = await clearAll();

    expect(result).toBe(true);
  });

  it("deve lidar com erro ao limpar", async () => {
    AsyncStorage.clear.mockRejectedValue(new Error("fail"));

    const result = await clearAll();

    expect(result).toBe(false);
  });

  // =========================
  // getAllKeys
  // =========================

  it("deve buscar todas as chaves", async () => {
    AsyncStorage.getAllKeys.mockResolvedValue(["a", "b"]);

    const result = await getAllKeys();

    expect(result).toEqual(["a", "b"]);
  });

  it("deve lidar com erro ao buscar chaves", async () => {
    AsyncStorage.getAllKeys.mockRejectedValue(new Error("fail"));

    const result = await getAllKeys();

    expect(result).toEqual([]);
  });

  // =========================
  // saveMultiple
  // =========================

  it("deve salvar múltiplos dados", async () => {
    AsyncStorage.multiSet.mockResolvedValue();

    const result = await saveMultiple([
      ["a", { x: 1 }],
      ["b", { y: 2 }],
    ]);

    expect(result).toBe(true);
  });

  it("deve lidar com erro no saveMultiple", async () => {
    AsyncStorage.multiSet.mockRejectedValue(new Error("fail"));

    const result = await saveMultiple([["a", 1]]);

    expect(result).toBe(false);
  });

  // =========================
  // getMultiple
  // =========================

  it("deve recuperar múltiplos dados", async () => {
    AsyncStorage.multiGet.mockResolvedValue([
      ["a", JSON.stringify({ x: 1 })],
      ["b", JSON.stringify({ y: 2 })],
    ]);

    const result = await getMultiple(["a", "b"]);

    expect(result).toEqual({
      a: { x: 1 },
      b: { y: 2 },
    });
  });

  it("deve ignorar valores null", async () => {
    AsyncStorage.multiGet.mockResolvedValue([["a", null]]);

    const result = await getMultiple(["a"]);

    expect(result).toEqual({});
  });

  it("deve lidar com erro no getMultiple", async () => {
    AsyncStorage.multiGet.mockRejectedValue(new Error("fail"));

    const result = await getMultiple(["a"]);

    expect(result).toEqual({});
  });

  // =========================
  // STORAGE_KEYS
  // =========================

  it("deve possuir STORAGE_KEYS", () => {
    expect(STORAGE_KEYS.USER_DATA).toBeDefined();
    expect(STORAGE_KEYS.TRANSACTIONS).toBeDefined();
  });
});
