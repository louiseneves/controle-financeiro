// MOCK ASYNC STORAGE
jest.mock("@react-native-async-storage/async-storage", () =>
  require("@react-native-async-storage/async-storage/jest/async-storage-mock"),
);
import { renderHook } from "@testing-library/react-native";
import {
  formatCurrency,
  formatDate,
  formatPercentage,
  capitalize,
  brToISO,
  isoToBR,
  getInitials,
  formatCPF,
  formatPhone,
  formatNumberCompact,
  truncateText,
  formatRelativeTime,
  parseCurrencyInput,
  getCurrencySymbol,
  getCurrencyPlaceholder,
  formatMonthYear,
  formatWeekday,
  capitalizeWords,
  parseISODateOnly,
  toSafeISOString,
  getDisplayDate,
  formattedDateToISO,
  formatDateInput,
  formatDateTime,
  formatDateLong,
  formatMonth,
  formatMonthShort,
  getCurrentLocale,
  useCurrentLocale,
  useCurrencyFormatter,
  formatCurrencyValue,
  parseLocalDate,
} from "../../../src/utils/helpers/formatters";
import useSettingsStore from "../../../src/store/settingsStore";

describe("formatters", () => {
  beforeEach(() => {
  useSettingsStore.setState({
    language: "pt-BR",
    currency: "BRL",
  });
});
  describe("formatCurrency", () => {
    test("deve formatar moeda corretamente", () => {
      const result = formatCurrency(1500);

      expect(result).toContain("1.500");
    });

    test("deve formatar zero corretamente", () => {
      const result = formatCurrency(0);

      expect(result).toContain("0");
    });

    test("deve formatar valores negativos", () => {
      const result = formatCurrency(-500);

      expect(result).toContain("500");
    });
  });

  describe("formatDate", () => {
    test("deve formatar data corretamente", () => {
      const result = formatDate("2024-01-15");

      expect(result).toBeTruthy();
    });

    test("deve lidar com data inválida", () => {
      const result = formatDate(null);

      expect(result).toBe("");
    });
  });

  describe("formatPercentage", () => {
    test("deve formatar porcentagem corretamente", () => {
      const result = formatPercentage(25);

      expect(result).toContain("25");
    });

    test("deve formatar porcentagem decimal", () => {
      const result = formatPercentage(12.5);

      expect(result).toContain("12");
    });
  });

  describe("capitalize", () => {
    test("deve capitalizar primeira letra", () => {
      const result = capitalize("mercado");

      expect(result).toBe("Mercado");
    });

    test("deve retornar vazio para string vazia", () => {
      const result = capitalize("");

      expect(result).toBe("");
    });
  });
  describe("formatRelativeTime", () => {
    test("deve retornar Agora para data atual", () => {
      const now = new Date();

      expect(formatRelativeTime(now)).toBeTruthy();
    });

    test("deve retornar vazio para data inválida", () => {
      expect(formatRelativeTime(null)).toBe("");
    });
  });

  describe("parseCurrencyInput", () => {
    test("deve converter moeda BR corretamente", () => {
      expect(parseCurrencyInput("R$ 1.500,50")).toBe(1500.5);
    });

    test("deve retornar zero para valor inválido", () => {
      expect(parseCurrencyInput(null)).toBe(0);
    });
  });

  describe("getCurrencySymbol", () => {
    test("deve retornar símbolo da moeda", () => {
      expect(getCurrencySymbol()).toBeTruthy();
    });
  });

  describe("getCurrencyPlaceholder", () => {
    test("deve retornar placeholder monetário", () => {
      expect(getCurrencyPlaceholder()).toBeTruthy();
    });
  });

  describe("formatMonthYear", () => {
    test("deve formatar mês e ano", () => {
      expect(formatMonthYear("2025-12-25")).toBeTruthy();
    });
  });

  describe("formatWeekday", () => {
    test("deve formatar dia da semana", () => {
      expect(formatWeekday("2025-12-25")).toBeTruthy();
    });
  });

  describe("capitalizeWords", () => {
    test("deve capitalizar palavras", () => {
      expect(capitalizeWords("joao da silva")).toBe("Joao Da Silva");
    });
  });

  describe("parseISODateOnly", () => {
    test("deve converter ISO para Date", () => {
      const result = parseISODateOnly("2025-12-25");

      expect(result instanceof Date).toBe(true);
    });

    test("deve retornar null para valor inválido", () => {
      expect(parseISODateOnly(null)).toBeNull();
    });
  });

  describe("toSafeISOString", () => {
    test("deve converter data para ISO seguro", () => {
      const result = toSafeISOString("2025-12-25");

      expect(result).toContain("2025-12-25");
    });

    test("deve retornar null para data inválida", () => {
      expect(toSafeISOString(null)).toBeNull();
    });
  });

  describe("getDisplayDate", () => {
    test("deve formatar data BR", () => {
      expect(getDisplayDate("2025-12-25")).toBe("25/12/2025");
    });

    test("deve formatar data EN", () => {
      expect(getDisplayDate("2025-12-25", "en-US")).toBe("12/25/2025");
    });
  });

  describe("formattedDateToISO", () => {
    test("deve converter BR para ISO", () => {
      expect(formattedDateToISO("25/12/2025")).toBe("2025-12-25");
    });

    test("deve converter EN para ISO", () => {
      expect(formattedDateToISO("12/25/2025", "en-US")).toBe("2025-12-25");
    });
  });

  describe("formatDateInput", () => {
    test("deve aplicar máscara BR", () => {
      expect(formatDateInput("25122025")).toBe("25/12/2025");
    });

    test("deve aplicar máscara EN", () => {
      expect(formatDateInput("12252025", "en-US")).toBe("12/25/2025");
    });
  });
  test("deve converter data BR para ISO", () => {
    expect(brToISO("25/12/2025")).toBe("2025-12-25");
  });

  test("deve converter ISO para BR", () => {
    expect(isoToBR("2025-12-25")).toBe("25/12/2025");
  });

  test("deve retornar iniciais corretamente", () => {
    expect(getInitials("João Silva")).toBe("JS");
  });

  test("deve formatar CPF", () => {
    expect(formatCPF("12345678901")).toBe("123.456.789-01");
  });

  test("deve formatar telefone celular", () => {
    expect(formatPhone("27999998888")).toBe("(27) 99999-8888");
  });

  test("deve compactar milhões", () => {
    expect(formatNumberCompact(2500000)).toBe("2.5 mi");
  });

  test("deve truncar texto longo", () => {
    expect(truncateText("abcdefghijklmnopqrstuvwxyz", 10)).toBe(
      "abcdefghij...",
    );
  });
  describe("branches extras", () => {
    test("formatCurrency null", () => {
      expect(formatCurrency(null)).toContain("0");
    });

    test("capitalize null", () => {
      expect(capitalize(null)).toBe("");
    });

    test("truncateText curto", () => {
      expect(truncateText("abc", 10)).toBe("abc");
    });

    test("getInitials nome único", () => {
      expect(getInitials("João")).toBe("J");
    });

    test("formatPhone telefone fixo", () => {
      expect(formatPhone("2733334444")).toBe("(27) 3333-4444");
    });

    test("formatNumberCompact mil", () => {
      expect(formatNumberCompact(1500)).toBe("1.5 mil");
    });

    test("formatNumberCompact bilhão", () => {
      expect(formatNumberCompact(2000000000)).toBe("2.0 bi");
    });

    test("formatNumberCompact número pequeno", () => {
      expect(formatNumberCompact(15)).toBe("15");
    });

    test("formattedDateToISO incompleto", () => {
      expect(formattedDateToISO("12/25")).toBe("12/25");
    });

    test("formatDateInput parcial", () => {
      expect(formatDateInput("12")).toBe("12");
    });

    test("parseISODateOnly inválida", () => {
      expect(parseISODateOnly("abc")).toBeNull();
    });

    test("toSafeISOString Date object", () => {
      const result = toSafeISOString(new Date());

      expect(typeof result).toBe("string");
    });

    test("getDisplayDate sem traço", () => {
      expect(getDisplayDate("25122025")).toBeTruthy();
    });

    test("formatRelativeTime anos", () => {
      const oldDate = new Date();

      oldDate.setFullYear(oldDate.getFullYear() - 2);

      expect(formatRelativeTime(oldDate)).toBeTruthy();
    });

    test("formatRelativeTime semanas", () => {
      const oldDate = new Date();

      oldDate.setDate(oldDate.getDate() - 14);

      expect(formatRelativeTime(oldDate)).toBeTruthy();
    });
  });
  describe("coverage extra final", () => {
    test("getCurrentLocale", () => {
      expect(getCurrentLocale()).toBeTruthy();
    });

    test("useCurrentLocale hook", () => {
      const { result } = renderHook(() => useCurrentLocale());

      expect(result.current).toBeTruthy();
    });

    test("useCurrencyFormatter hook", () => {
      const { result } = renderHook(() => useCurrencyFormatter());

      expect(result.current(100)).toContain("100");
    });

    test("formatCurrencyValue USD", () => {
      const result = formatCurrencyValue(100, "USD", "en-US");

      expect(result).toContain("$");
    });

    test("formatCurrencyValue inválido fallback", () => {
      const result = formatCurrencyValue(100, "INVALID");

      expect(result).toContain("100");
    });

    test("formatDateTime", () => {
      expect(formatDateTime("2025-12-25")).toBeTruthy();
    });

    test("formatDateLong", () => {
      expect(formatDateLong("2025-12-25")).toBeTruthy();
    });

    test("formatMonth", () => {
      expect(formatMonth("2025-12-25")).toBeTruthy();
    });

    test("formatMonthShort", () => {
      expect(formatMonthShort("2025-12-25")).toBeTruthy();
    });

    test("parseLocalDate fallback", () => {
      const result = parseLocalDate("Thu Dec 25 2025");

      expect(result instanceof Date).toBe(true);
    });

    test("relative time em inglês", () => {
      useSettingsStore.setState({
        language: "en-US",
      });

      const date = new Date();

      date.setHours(date.getHours() - 2);

      expect(formatRelativeTime(date)).toContain("hour");
    });

    test("relative time espanhol", () => {
      useSettingsStore.setState({
        language: "es-ES",
      });

      const date = new Date();

      date.setDate(date.getDate() - 3);

      expect(formatRelativeTime(date)).toContain("Hace");
    });
  });
  test("formatRelativeTime deve lidar com data futura", () => {
  const future = new Date();
  future.setHours(future.getHours() + 2);

  const result = formatRelativeTime(future);

  expect(result).toBeTruthy();
  });
  test("parseCurrencyInput com string vazia e espaços", () => {
  expect(parseCurrencyInput("   ")).toBe(0);
  });
  test("parseLocalDate com data inválida", () => {
  const result = parseLocalDate("2025-99-99");

  expect(result instanceof Date).toBe(true);
});
});
