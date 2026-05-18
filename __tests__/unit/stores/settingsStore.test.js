import { renderHook, act } from "@testing-library/react-hooks";
import useSettingsStore from "../../../src/store/settingsStore";
import {
  saveData,
  getData,
} from "../../../src/services/storage/asyncStorage";

// Mock do AsyncStorage
jest.mock("../../../src/services/storage/asyncStorage", () => ({
  saveData: jest.fn(() => Promise.resolve()),
  getData: jest.fn(() => Promise.resolve(null)),
  removeData: jest.fn(() => Promise.resolve()),
  STORAGE_KEYS: {
    SETTINGS: "@settings",
  },
}));
jest.mock(
  "../../../src/services/notifications/notificationService",
  () => ({
    __esModule: true,
    default: {
      applySettings: jest.fn(() => Promise.resolve()),
      cancelAll: jest.fn(() => Promise.resolve()),
    },
  }),
);

describe("settingsStore", () => {
  beforeEach(() => {
    // Limpar mocks antes de cada teste
    jest.clearAllMocks();

    // Resetar store
    const { result } = renderHook(() => useSettingsStore());
    act(() => {
      result.current.resetSettings();
    });
  });

  describe("Configurações Iniciais", () => {
    test("deve ter valores padrão corretos", () => {
      const { result } = renderHook(() => useSettingsStore());

      expect(result.current.darkMode).toBe(true);
      expect(result.current.currency).toBe("BRL");
      expect(result.current.language).toBe("pt-BR");
      expect(result.current.notifications.enabled).toBe(true);
    });

    test("deve ter 6 moedas disponíveis", () => {
      const { result } = renderHook(() => useSettingsStore());

      expect(result.current.availableCurrencies).toHaveLength(8);
      expect(result.current.availableCurrencies[0].code).toBe("BRL");
    });

    test("deve ter 3 idiomas disponíveis", () => {
      const { result } = renderHook(() => useSettingsStore());

      expect(result.current.availableLanguages).toHaveLength(3);
    });
  });

  describe("Modo Escuro", () => {
    test("deve alternar modo escuro", async () => {
      const { result } = renderHook(() => useSettingsStore());

      expect(result.current.darkMode).toBe(true);

      await act(async () => {
        await result.current.toggleDarkMode();
      });

      expect(result.current.darkMode).toBe(false);
    });

    test("deve retornar tema claro quando darkMode = false", async () => {
      const { result } = renderHook(() => useSettingsStore());

      await act(async () => {
        await result.current.setDarkMode(false);
      });

      const theme = result.current.getTheme();

      expect(theme.colors.background).toBe("#F8FAFC");
      expect(theme.colors.text).toBe("#0F172A");
    });

    test("deve retornar tema escuro quando darkMode = true", async () => {
      const { result } = renderHook(() => useSettingsStore());

      await act(async () => {
        await result.current.setDarkMode(true);
      });

      const theme = result.current.getTheme();

      expect(theme.colors.background).toBe("#0F172A");
      expect(theme.colors.text).toBe("#F1F5F9");
    });
  });

  describe("Moeda", () => {
    test("deve alterar moeda", async () => {
      const { result } = renderHook(() => useSettingsStore());

      await act(async () => {
        await result.current.setCurrency("USD");
      });

      expect(result.current.currency).toBe("USD");
    });

    test("deve retornar símbolo correto da moeda", async () => {
      const { result } = renderHook(() => useSettingsStore());

      expect(result.current.getCurrencySymbol()).toBe("R$");

      await act(async () => {
        await result.current.setCurrency("USD");
      });

      expect(result.current.getCurrencySymbol()).toBe("$");
    });

    test("deve formatar valor com moeda correta", async () => {
      const { result } = renderHook(() => useSettingsStore());

      const formatted = result.current.formatCurrency(1000);
      expect(formatted.replace(/\s/g, " ")).toContain("1.000,00");

      await act(async () => {
        await result.current.setCurrency("USD");
      });

      const formattedUSD = result.current.formatCurrency(1000);
      expect(formattedUSD).toContain("200");
    });
  });

  describe("Idioma", () => {
    test("deve alterar idioma", async () => {
      const { result } = renderHook(() => useSettingsStore());

      await act(async () => {
        await result.current.setLanguage("en-US");
      });

      expect(result.current.language).toBe("en-US");
    });
  });

  describe("Notificações", () => {
    test("deve atualizar configurações de notificação", async () => {
      const { result } = renderHook(() => useSettingsStore());

      await act(async () => {
        await result.current.updateNotifications({ bills: false });
      });

      expect(result.current.notifications.bills).toBe(false);
      expect(result.current.notifications.enabled).toBe(true); // Outros não mudaram
    });

    test("deve alterar horário de notificação", async () => {
      const { result } = renderHook(() => useSettingsStore());

      await act(async () => {
        await result.current.setNotificationTime("14:30");
      });

      expect(result.current.notifications.time).toBe("14:30");
    });
  });

  describe("Persistência", () => {
    test("deve salvar configurações no AsyncStorage", async () => {
      const { result } = renderHook(() => useSettingsStore());

      await act(async () => {
        await result.current.toggleDarkMode();
        await result.current.saveSettings();
      });

      expect(saveData).toHaveBeenCalledWith(
        "@settings",
        expect.objectContaining({
          darkMode: false,
        }),
      );
    });

    test("deve carregar configurações do AsyncStorage", async () => {
      getData.mockResolvedValueOnce({
        darkMode: true,
        currency: "EUR",
        language: "es-ES",
      });

      const { result } = renderHook(() => useSettingsStore());

      await act(async () => {
        await result.current.loadSettings();
      });

      expect(result.current.darkMode).toBe(true);
      expect(result.current.currency).toBe("EUR");
      expect(result.current.language).toBe("es-ES");
    });

    describe("Reset", () => {
      test("deve resetar todas as configurações", async () => {
        const { result } = renderHook(() => useSettingsStore());

        // Alterar várias configurações
        await act(async () => {
          await result.current.toggleDarkMode();
          await result.current.setCurrency("USD");
          await result.current.setLanguage("en-US");
        });

        // Resetar
        await act(async () => {
          await result.current.resetSettings();
        });

        expect(result.current.darkMode).toBe(true);
        expect(result.current.currency).toBe("BRL");
        expect(result.current.language).toBe("pt-BR");
      });
    });
    test("loadSettings sem dados", async () => {
      getData.mockResolvedValueOnce(null);

      const { result } = renderHook(() => useSettingsStore());

      await act(async () => {
        await result.current.loadSettings();
      });

      expect(result.current.loading).toBe(false);
    });
    test("loadSettings catch", async () => {
      getData.mockRejectedValueOnce(new Error("fail"));

      const spy = jest.spyOn(console, "error").mockImplementation(() => { });

      const { result } = renderHook(() => useSettingsStore());

      await act(async () => {
        await result.current.loadSettings();
      });

      expect(spy).toHaveBeenCalled();

      spy.mockRestore();
    });
    test("saveSettings catch", async () => {
      saveData.mockRejectedValueOnce(new Error("fail"));

      const { result } = renderHook(() => useSettingsStore());

      const response = await result.current.saveSettings();

      expect(response.success).toBe(false);
    });
    test("getCurrencySymbol fallback", () => {
      const { result } = renderHook(() => useSettingsStore());

      act(() => {
        useSettingsStore.setState({
          currency: "INVALID",
        });
      });

      expect(result.current.getCurrencySymbol()).toBe("R$");
    });
    test("convertFromBRL inválido", () => {
      const { result } = renderHook(() => useSettingsStore());

      const value = result.current.convertFromBRL("abc");

      expect(value).toBe(0);
    });
    test("formatCurrency catch fallback", () => {
      const original = Intl.NumberFormat;

      Intl.NumberFormat = jest.fn(() => {
        throw new Error("fail");
      });

      const { result } = renderHook(() => useSettingsStore());

      const formatted = result.current.formatCurrency(100);

      expect(formatted).toContain("BRL");

      Intl.NumberFormat = original;
    });
    test("updateNotifications catch", async () => {
      const NotificationService =
        require("../../../src/services/notifications/notificationService").default;

      NotificationService.applySettings.mockRejectedValueOnce(
        new Error("fail"),
      );

      const spy = jest.spyOn(console, "error").mockImplementation(() => { });

      const { result } = renderHook(() => useSettingsStore());

      await act(async () => {
        await result.current.updateNotifications({
          bills: false,
        });
      });

      expect(spy).toHaveBeenCalled();

      spy.mockRestore();
    });
  });
  test("formatCurrency usa locale fallback", () => {
  const { result } = renderHook(() => useSettingsStore());

  act(() => {
    useSettingsStore.setState({
      currency: "INVALID",
    });
  });

  const formatted = result.current.formatCurrency(100);

  expect(formatted).toContain("100");
  });
  test("getTheme retorna tema light completo", () => {
  const { result } = renderHook(() => useSettingsStore());

  act(() => {
    useSettingsStore.setState({
      darkMode: false,
    });
  });

  const theme = result.current.getTheme();

  expect(theme.dark).toBe(false);

  expect(theme.colors.primary).toBe("#2563EB");
  expect(theme.colors.card).toBe("#FFFFFF");
  expect(theme.colors.surface).toBe("#F1F5F9");
  expect(theme.colors.shadow).toBe("rgba(0,0,0,0.1)");
  });
  test("getTheme retorna tema dark completo", () => {
  const { result } = renderHook(() => useSettingsStore());

  act(() => {
    useSettingsStore.setState({
      darkMode: true,
    });
  });

  const theme = result.current.getTheme();

  expect(theme.dark).toBe(true);

  expect(theme.colors.primary).toBe("#3B82F6");
  expect(theme.colors.card).toBe("#1E293B");
  expect(theme.colors.surface).toBe("#334155");
  expect(theme.colors.shadow).toBe("rgba(0,0,0,0.5)");
});
})
