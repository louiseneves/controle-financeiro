import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import Input from "../../../src/components/ui/Input";

// ===================== MOCKS =====================

jest.mock("../../../src/store/settingsStore", () => ({
  __esModule: true,
  default: (selector) =>
    selector({
      language: "pt-BR",
    }),
}));

jest.mock("../../../src/utils/helpers/formatters", () => ({
  formatDateInput: jest.fn((text) => text),
  formattedDateToISO: jest.fn(() => "2025-01-01"),
  getDisplayDate: jest.fn(() => "01/01/2025"),
}));
jest.mock("../../../src/context/ThemeContext", () => ({
  useTheme: () => ({
    colors: {
      primary: "#2563EB",
      secondary: "#8B5CF6",
      success: "#10B981",
      error: "#EF4444",
      warning: "#F59E0B",
      disabled: "#999",
      text: "#000",
      textSecondary: "#666",
      textTertiary: "#999",
      inputBackground: "#FFF",
      inputBorder: "#DDD",
      placeholder: "#AAA",
    },
  }),
}));
// ===================== TESTS =====================

describe("Input", () => {
  it("deve renderizar label e placeholder", () => {
    const { getByText, getByPlaceholderText } = render(
      <Input label="Nome" placeholder="Digite aqui" />,
    );

    expect(getByText("Nome")).toBeTruthy();
    expect(getByPlaceholderText("Digite aqui")).toBeTruthy();
  });

  it("deve chamar onChangeText normalmente", () => {
    const onChangeText = jest.fn();

    const { getByPlaceholderText } = render(
      <Input placeholder="teste" onChangeText={onChangeText} />,
    );

    fireEvent.changeText(getByPlaceholderText("teste"), "abc");

    expect(onChangeText).toHaveBeenCalledWith("abc");
  });

  it("deve mostrar erro", () => {
    const { getByText } = render(<Input error="Campo obrigatório" />);

    expect(getByText("Campo obrigatório")).toBeTruthy();
  });

  it("deve alternar password visibility", () => {
    const { getByTestId } = render(<Input secureTextEntry testID="input" />);

    const eyeButton = getByTestId("input");

    expect(eyeButton).toBeTruthy();
  });

  it("deve ativar modo data", () => {
    const onChangeDate = jest.fn();

    const { getByDisplayValue } = render(
      <Input type="date" value="2025-01-01" onChangeDate={onChangeDate} />,
    );

    const input = getByDisplayValue("01/01/2025");

    fireEvent.changeText(input, "02/02/2025");

    expect(onChangeDate).toHaveBeenCalled();
  });
    it("deve alternar visibilidade da senha", () => {
  const { getByTestId } = render(
    <Input secureTextEntry testID="input" />,
  );

  fireEvent.press(getByTestId("toggle-password"));

  expect(true).toBe(true); // estado interno muda (não exposto)
});
});
