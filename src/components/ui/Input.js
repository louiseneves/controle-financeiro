import React, { useMemo, useState, useEffect } from "react";
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { useTheme } from "../../context/ThemeContext";
import Feather from "@expo/vector-icons/Feather";
import useSettingsStore from "../../store/settingsStore";
import {
  formatDateInput,
  formattedDateToISO,
  getDisplayDate,
} from "../../utils/helpers/formatters";

const Input = ({
  label,
  value,
  onChangeText,
  placeholder,
  secureTextEntry,
  keyboardType,
  error,
  leftIcon,

  // 🔥 NOVO
  type = "text",
  onChangeDate,

  ...props
}) => {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

  const language = useSettingsStore((state) => state.language);

  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [displayValue, setDisplayValue] = useState("");

  const isPassword = secureTextEntry;
  const isDate = type === "date";

  /* ==================== DATE SYNC ==================== */

  useEffect(() => {
    if (isDate) {
      setDisplayValue(getDisplayDate(value, language));
    }
  }, [value, language, isDate]);

  const handleChange = (text) => {
    if (isDate) {
      const formatted = formatDateInput(text, language);
      setDisplayValue(formatted);

      const iso = formattedDateToISO(formatted, language);

      onChangeDate?.(iso);
      return;
    }

    onChangeText?.(text);
  };

  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}

      <View
        style={[
          styles.inputWrapper,
          {
            backgroundColor: colors.inputBackground || "#fff",
            borderColor: error
              ? colors.error || "#ff0000"
              : colors.inputBorder || "#ccc",
          },
        ]}
      >
        {leftIcon && <View style={styles.iconContainer}>{leftIcon}</View>}

        <TextInput
          style={styles.input}
          value={isDate ? displayValue : value}
          onChangeText={handleChange}
          placeholder={placeholder}
          placeholderTextColor={colors.placeholder}
          secureTextEntry={isPassword && !isPasswordVisible}
          keyboardType={isDate ? "numeric" : keyboardType}
          {...props}
        />

        {isPassword && (
          <TouchableOpacity
            testID="toggle-password"
            onPress={() => setIsPasswordVisible((prev) => !prev)}
            style={styles.iconContainer}
          >
            <Feather
              name={isPasswordVisible ? "eye-off" : "eye"}
              size={22}
              color={colors.textSecondary}
            />
          </TouchableOpacity>
        )}
      </View>

      {error && <Text style={styles.error}>{error}</Text>}
    </View>
  );
};

const createStyles = (colors) =>
  StyleSheet.create({
    container: {
      marginBottom: 16,
    },
    label: {
      fontSize: 14,
      fontWeight: "600",
      marginBottom: 8,
      color: colors.text,
    },
    inputWrapper: {
      flexDirection: "row",
      alignItems: "center",
      borderWidth: 1,
      borderRadius: 12,
      height: 50,
      paddingHorizontal: 12,
    },
    iconContainer: {
      marginHorizontal: 4,
    },
    input: {
      flex: 1,
      fontSize: 16,
      color: colors.inputText || colors.text || "#000",
    },
    error: {
      fontSize: 12,
      marginTop: 4,
      color: colors.error,
    },
  });

export default Input;
