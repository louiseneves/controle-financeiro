import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import Button from "../../../src/components/ui/Button";

// Mock do ThemeContext
jest.mock("../../../src/context/ThemeContext", () => ({
  useTheme: () => ({
    colors: {
      primary: "#2563EB",
      secondary: "#8B5CF6",
      success: "#10B981",
      error: "#EF4444",
      warning: "#F59E0B",
      disabled: "#CBD5E1",
      textTertiary: "#94A3B8",
    },
  }),
}));

describe("Button", () => {
  it("deve renderizar título corretamente", () => {
    const { getByText } = render(<Button title="Salvar" />);

    expect(getByText("Salvar")).toBeTruthy();
  });

  it("deve chamar onPress ao clicar", () => {
    const onPress = jest.fn();

    const { getByText } = render(<Button title="Clique" onPress={onPress} />);

    fireEvent.press(getByText("Clique"));

    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it("não deve chamar onPress quando disabled", () => {
    const onPress = jest.fn();

    const { getByText } = render(
      <Button title="Disabled" onPress={onPress} disabled />,
    );

    fireEvent.press(getByText("Disabled"));

    expect(onPress).not.toHaveBeenCalled();
  });

  it("deve mostrar loading quando loading=true", () => {
    const { getByTestId } = render(
      <Button title="Carregando" loading testID="btn" />,
    );

    expect(getByTestId("btn")).toBeTruthy();
  });

  it("deve renderizar ícone quando fornecido", () => {
    const { getByText } = render(<Button title="Com ícone" icon="🔥" />);

    expect(getByText("🔥")).toBeTruthy();
  });

  it("deve aplicar variant primary por padrão", () => {
    const { getByText } = render(<Button title="Primary" />);

    const text = getByText("Primary");

    expect(text.props.style).toEqual(
      expect.arrayContaining([expect.objectContaining({ color: "#FFFFFF" })]),
    );
  });

  it("deve aplicar variant success", () => {
    const { getByText } = render(<Button title="Success" variant="success" />);

    const text = getByText("Success");

    expect(text.props.style).toEqual(
      expect.arrayContaining([expect.objectContaining({ color: "#FFFFFF" })]),
    );
  });

  it("deve aplicar variant outline", () => {
    const { getByText } = render(<Button title="Outline" variant="outline" />);

    const text = getByText("Outline");

    expect(text.props.style).toEqual(
      expect.arrayContaining([expect.objectContaining({ color: "#2563EB" })]),
    );
  });

  it("deve aplicar size small", () => {
    const { getByText } = render(<Button title="Small" size="small" />);

    const text = getByText("Small");

    expect(text.props.style).toEqual(
      expect.arrayContaining([expect.objectContaining({ fontSize: 14 })]),
    );
  });

  it("deve aplicar size large", () => {
    const { getByText } = render(<Button title="Large" size="large" />);

    const text = getByText("Large");

    expect(text.props.style).toEqual(
      expect.arrayContaining([expect.objectContaining({ fontSize: 18 })]),
    );
  });

  it("deve ocupar largura total quando fullWidth=true", () => {
    const { getByTestId } = render(
      <Button title="Full" fullWidth testID="btn" />,
    );

    const button = getByTestId("btn");

    expect(button.props.style.width).toBe("100%");
  });
    test("Button não dispara onPress quando loading", () => {
  const onPress = jest.fn();

  const { getByTestId } = render(
    <Button testID="btn" loading onPress={onPress} />,
  );

  fireEvent.press(getByTestId("btn"));

  expect(onPress).not.toHaveBeenCalled();
    });
   test("Button disabled altera opacity", () => {
  const { getByTestId } = render(
    <Button testID="btn" disabled />,
  );

  const btn = getByTestId("btn");

  expect(btn.props.style.opacity).toBe(0.5);
});
});
