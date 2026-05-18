import usePremiumStore from "../../../src/store/premiumStore";

// MOCK STORAGE LAYER
jest.mock("../../../src/services/storage/asyncStorage", () => ({
  saveData: jest.fn(() => Promise.resolve()),
  getData: jest.fn(() =>
    Promise.resolve({
      subscriptionType: "monthly",
      expirationDate: new Date(Date.now() + 86400000).toISOString(),
    }),
  ),
  removeData: jest.fn(() => Promise.resolve()),
  STORAGE_KEYS: {
    PREMIUM_STATUS: "premium_status",
  },
}));

import {
  saveData,
  getData,
  removeData,
} from "../../../src/services/storage/asyncStorage";

describe("premiumStore - Sprint 3 FIXED", () => {
  beforeEach(() => {
    usePremiumStore.getState().resetPremiumState();
    jest.clearAllMocks();
  });

  it("deve iniciar como não premium", () => {
    const state = usePremiumStore.getState();
    expect(state.isPremium).toBe(false);
  });

  it("deve ativar premium com sucesso", async () => {
    const res = await usePremiumStore.getState().activatePremium("monthly");

    expect(res.success).toBe(true);

    const state = usePremiumStore.getState();
    expect(state.isPremium).toBe(true);
    expect(state.subscriptionType).toBe("monthly");
  });

  it("deve desativar premium", async () => {
    await usePremiumStore.getState().activatePremium("monthly");
    await usePremiumStore.getState().cancelPremium();

    const state = usePremiumStore.getState();

    expect(state.isPremium).toBe(false);
    expect(state.subscriptionType).toBeNull();
  });

  it("deve persistir estado premium", async () => {
    await usePremiumStore.getState().activatePremium("monthly");

    const state = usePremiumStore.getState();

    expect(state.isPremium).toBe(true);
    expect(state.subscriptionType).toBe("monthly");
  });

  it("deve liberar features quando premium", async () => {
    await usePremiumStore.getState().activatePremium("monthly");

    const canUse = usePremiumStore.getState().hasAccess("export_pdf");

    expect(canUse).toBe(true);
  });

  it("deve bloquear features quando não premium", () => {
    const canUse = usePremiumStore.getState().hasAccess("export_pdf");

    expect(canUse).toBe(false);
  });

  it("deve rejeitar plano inválido", async () => {
    const res = await usePremiumStore.getState().activatePremium("weekly");

    expect(res.success).toBe(false);
    expect(res.error).toBe("Plano inválido");
  });

  it("deve bloquear feature expirada", () => {
    usePremiumStore.setState({
      isPremium: true,
      expirationDate: new Date(Date.now() - 1000).toISOString(),
    });

    const canUse = usePremiumStore.getState().hasAccess("export_pdf");

    expect(canUse).toBe(false);
  });
  test("deve expirar premium automaticamente", async () => {
    const past = new Date();
    past.setFullYear(past.getFullYear() - 1);

    await usePremiumStore.getState().loadPremiumStatus();

    usePremiumStore.setState({
      expirationDate: past.toISOString(),
    });

    const canUse = usePremiumStore.getState().hasAccess("export_pdf");

    expect(canUse).toBe(false);
  });

  test("loadPremiumStatus sem dados", async () => {
    getData.mockResolvedValueOnce(null);

    await usePremiumStore.getState().loadPremiumStatus();

    expect(usePremiumStore.getState().isPremium).toBe(false);
  });

  test("loadPremiumStatus com data inválida", async () => {
    getData.mockResolvedValueOnce({
      subscriptionType: "monthly",
      expirationDate: "data-invalida",
    });

    await usePremiumStore.getState().loadPremiumStatus();

    expect(removeData).toHaveBeenCalled();
  });

  test("loadPremiumStatus catch", async () => {
    jest.spyOn(console, "error").mockImplementation(() => {});

    getData.mockRejectedValueOnce(new Error("fail"));

    await usePremiumStore.getState().loadPremiumStatus();

    expect(console.error).toHaveBeenCalled();
  });

  test("activatePremium loading=true", async () => {
    usePremiumStore.setState({
      loading: true,
    });

    const result = await usePremiumStore.getState().activatePremium("monthly");

    expect(result.success).toBe(false);
  });

  test("activatePremium usuário já premium", async () => {
    usePremiumStore.setState({
      isPremium: true,
    });

    const result = await usePremiumStore.getState().activatePremium("monthly");

    expect(result.success).toBe(false);
  });

  test("activatePremium catch", async () => {
    saveData.mockRejectedValueOnce(new Error("fail"));

    const result = await usePremiumStore.getState().activatePremium("monthly");

    expect(result.success).toBe(false);
  });

  test("cancelPremium catch", async () => {
    removeData.mockRejectedValueOnce(new Error("fail"));

    const result = await usePremiumStore.getState().cancelPremium();

    expect(result.success).toBe(false);
  });

  test("restorePurchases sem compras", async () => {
    getData.mockResolvedValueOnce(null);

    const result = await usePremiumStore.getState().restorePurchases();

    expect(result.success).toBe(false);
  });

  test("restorePurchases sucesso", async () => {
    const result = await usePremiumStore.getState().restorePurchases();

    expect(result.success).toBe(true);
  });

  test("restorePurchases catch", async () => {
    getData.mockRejectedValueOnce(new Error("fail"));

    const result = await usePremiumStore.getState().restorePurchases();

    expect(result.success).toBe(false);
  });

  test("hasAccess deve liberar feature gratuita", () => {
    const result = usePremiumStore.getState().hasAccess("feature_fake");

    expect(result).toBe(true);
  });

  test("hasAccess com data inválida", () => {
    usePremiumStore.setState({
      isPremium: true,
      expirationDate: "invalid-date",
    });

    const result = usePremiumStore.getState().hasAccess("export_pdf");

    expect(result).toBe(false);
  });

  test("resetPremiumState", () => {
    usePremiumStore.setState({
      isPremium: true,
      subscriptionType: "monthly",
    });

    usePremiumStore.getState().resetPremiumState();

    expect(usePremiumStore.getState().isPremium).toBe(false);
    expect(usePremiumStore.getState().subscriptionType).toBeNull();
  });
});
