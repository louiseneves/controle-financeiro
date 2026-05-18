import {
  calculateTithe,
  calculateTotalTithe,
  calculatePercentage,
  checkTitheStatus,
  getOfferSuggestions,
  getTitheHistory,
} from "../../../src/utils/helpers/titheCalculator";
describe("titheCalculator", () => {
  /* ==================== calculateTithe ==================== */

  describe("calculateTithe", () => {
    test("deve calcular 10% corretamente", () => {
      expect(calculateTithe(1000)).toBe(100);
    });

    test("deve retornar 0 para valor zero", () => {
      expect(calculateTithe(0)).toBe(0);
    });

    test("deve retornar 0 para valor negativo", () => {
      expect(calculateTithe(-500)).toBe(0);
    });

    test("deve retornar 0 para valor inválido", () => {
      expect(calculateTithe(null)).toBe(0);
    });
  });

  /* ==================== calculateTotalTithe ==================== */

  describe("calculateTotalTithe", () => {
    test("deve calcular dízimo total das receitas", () => {
      const incomes = [
        { amount: 1000 },
        { amount: 500 },
      ];

      expect(calculateTotalTithe(incomes)).toBe(150);
    });

    test("deve retornar 0 para array vazio", () => {
      expect(calculateTotalTithe([])).toBe(0);
    });

    test("deve ignorar valores inválidos", () => {
      const incomes = [
        { amount: 1000 },
        {},
        { amount: null },
      ];

      expect(calculateTotalTithe(incomes)).toBe(100);
    });
  });

  /* ==================== calculatePercentage ==================== */

  describe("calculatePercentage", () => {
    test("deve calcular porcentagem corretamente", () => {
      expect(calculatePercentage(1000, 15)).toBe(150);
    });

    test("deve retornar 0 para valor inválido", () => {
      expect(calculatePercentage(null, 10)).toBe(0);
    });

    test("deve retornar 0 para porcentagem inválida", () => {
      expect(calculatePercentage(1000, null)).toBe(0);
    });
  });

  /* ==================== checkTitheStatus ==================== */

  describe("checkTitheStatus", () => {
    test("deve retornar não pago sem ofertas", () => {
      const result = checkTitheStatus([], 100);

      expect(result).toEqual({
        paid: false,
        amount: 0,
        remaining: 100,
        percentage: 0,
      });
    });

    test("deve calcular dízimo pago corretamente", () => {
      const offers = [
        { category: "dizimo", amount: 50 },
        { type: "dizimo", amount: 30 },
        { category: "oferta", amount: 100 },
      ];

      const result = checkTitheStatus(offers, 100);

      expect(result.paid).toBe(false);
      expect(result.amount).toBe(80);
      expect(result.remaining).toBe(20);
      expect(result.percentage).toBe(80);
    });

    test("deve marcar como pago quando atingir valor esperado", () => {
      const offers = [
        { category: "dizimo", amount: 100 },
      ];

      const result = checkTitheStatus(offers, 100);

      expect(result.paid).toBe(true);
      expect(result.remaining).toBe(0);
    });

    test("não deve ultrapassar 100%", () => {
      const offers = [
        { category: "dizimo", amount: 200 },
      ];

      const result = checkTitheStatus(offers, 100);

      expect(result.percentage).toBe(100);
    });
  });

  /* ==================== getOfferSuggestions ==================== */

  describe("getOfferSuggestions", () => {
    test("deve retornar sugestões corretamente", () => {
      const result = getOfferSuggestions(1000);

      expect(result).toEqual({
        min: 100,
        recommended: 150,
        generous: 200,
      });
    });

    test("deve retornar zeros para renda inválida", () => {
      expect(getOfferSuggestions(0)).toEqual({
        min: 0,
        recommended: 0,
        generous: 0,
      });
    });
  });

  /* ==================== getTitheHistory ==================== */

  describe("getTitheHistory", () => {
    test("deve retornar histórico vazio", () => {
      const result = getTitheHistory([]);

      expect(result).toEqual({
        total: 0,
        count: 0,
        average: 0,
        lastPayment: null,
      });
    });

    test("deve calcular histórico corretamente", () => {
      const offers = [
        {
          category: "dizimo",
          amount: 100,
          date: "2025-01-01",
        },
        {
          type: "dizimo",
          amount: 200,
          date: "2025-02-01",
        },
        {
          category: "oferta",
          amount: 300,
          date: "2025-03-01",
        },
      ];

      const result = getTitheHistory(offers);

      expect(result.total).toBe(300);
      expect(result.count).toBe(2);
      expect(result.average).toBe(150);
      expect(result.lastPayment.amount).toBe(200);
    });

    test("deve retornar média zero sem dízimos", () => {
      const offers = [
        {
          category: "oferta",
          amount: 100,
        },
      ];

      const result = getTitheHistory(offers);

      expect(result.total).toBe(0);
      expect(result.count).toBe(0);
      expect(result.average).toBe(0);
    });
  });
});