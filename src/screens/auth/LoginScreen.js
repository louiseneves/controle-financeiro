/**
 * Tela de Login
 */

import React, { useState, useMemo } from "react";
import { useTheme } from "../../context/ThemeContext";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  TouchableOpacity,
  Image,
} from "react-native";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { Button, Input } from "../../components/ui";
import useAuthStore from "../../store/authStore";
import { t } from "../../i18n";

const LoginScreen = ({ navigation }) => {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  // ✅ CORRETO: selectors do Zustand
  const login = useAuthStore((state) => state.login);
  const loading = useAuthStore((state) => state.loading);

  // Validar email
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Validar campos
  const validateFields = () => {
    let isValid = true;

    setEmailError("");
    setPasswordError("");

    if (!email) {
      setEmailError(t("login.errors.emailRequired"));
      isValid = false;
    } else if (!validateEmail(email)) {
      setEmailError(t("login.errors.emailInvalid"));
      isValid = false;
    }

    if (!password) {
      setPasswordError(t("login.errors.passwordRequired"));
      isValid = false;
    } else if (password.length < 6) {
      setPasswordError(t("login.errors.passwordMin"));
      isValid = false;
    }

    return isValid;
  };

  // Fazer login
  const handleLogin = async () => {
    if (!validateFields()) return;

    try {
      const result = await login(email, password);

      if (result?.success) {
        // sucesso: mostrar alerta com callback para evitar UX abrupta
        Alert.alert(
          t("login.alerts.successTitle"),
          t("login.alerts.successMessage"),
          [
            {
              text: "OK",
            },
          ],
          { cancelable: false },
        );
      } else {
        Alert.alert(
          t("login.alerts.errorTitle"),
          result?.error || t("login.alerts.loginError"),
        );
      }
    } catch (error) {
      Alert.alert(
        t("login.alerts.errorTitle"),
        t("login.alerts.unexpectedError"),
      );
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        {/* Header */}
        <View style={styles.header}>
          <Image
            source={require("../../assets/icons/logo.png")}
            style={styles.logo}
          />
          <View style={{ flexDirection: "row", justifyContent: "center" }}>
            <Text style={styles.title}>{t("login.title")} </Text>
            <Text style={styles.title2}>{t("login.titleHighlight")}</Text>
          </View>
          <Text style={styles.subtitle}>{t("login.subtitle")}</Text>
        </View>

        {/* Form */}
        <View style={styles.form}>
          <Input
            label={t("login.email")}
            value={email}
            onChangeText={setEmail}
            placeholder={t("login.emailPlaceholder")}
            keyboardType="email-address"
            autoCapitalize="none"
            error={emailError}
            leftIcon={
              <MaterialIcons
                name="email"
                size={24}
                color={colors.textSecondary}
              />
            }
          />

          <Input
            label={t("login.password")}
            value={password}
            onChangeText={setPassword}
            placeholder="••••••••"
            secureTextEntry
            error={passwordError}
            showPasswordToggle
            leftIcon={
              <MaterialIcons
                name="lock"
                size={24}
                color={colors.textSecondary}
              />
            }
          />

          <TouchableOpacity
            onPress={() => navigation.navigate("ForgotPassword")}
            style={styles.forgotPassword}
          >
            <Text style={styles.forgotPasswordText}>
              {t("login.forgotPassword")}
            </Text>
          </TouchableOpacity>

          <Button
            title={t("login.loginButton")}
            onPress={handleLogin}
            loading={loading}
            disabled={loading}
            style={styles.loginButton}
          />

          <View style={styles.divider}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>{t("login.or")}</Text>
            <View style={styles.dividerLine} />
          </View>

          <View style={styles.registerContainer}>
            <Text style={styles.registerText}>{t("login.noAccount")} </Text>
            <TouchableOpacity onPress={() => navigation.navigate("Register")}>
              <Text style={styles.registerLink}>{t("login.register")}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const createStyles = (colors) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    scrollContent: {
      flexGrow: 1,
      padding: 24,
      justifyContent: "center",
    },
    header: {
      alignItems: "center",
      marginBottom: 40,
    },
    logo: {
      width: 100,
      height: 100,
      marginBottom: 16,
    },
    title: {
      fontSize: 28,
      fontWeight: "bold",
      color: colors.primary,
    },
    title2: {
      fontSize: 28,
      fontWeight: "bold",
      color: colors.secondary /* destaque */ || colors.primary,
    },
    subtitle: {
      fontSize: 16,
      color: colors.textSecondary,
    },
    form: {
      width: "100%",
    },
    forgotPassword: {
      alignSelf: "flex-end",
      marginBottom: 24,
    },
    forgotPasswordText: {
      fontSize: 14,
      color: colors.primary,
      fontWeight: "600",
    },
    loginButton: {
      marginBottom: 24,
    },
    divider: {
      flexDirection: "row",
      alignItems: "center",
      marginVertical: 24,
    },
    dividerLine: {
      flex: 1,
      height: 1,
      backgroundColor: colors.border,
    },
    dividerText: {
      marginHorizontal: 16,
      fontSize: 14,
      color: colors.textSecondary,
    },
    registerContainer: {
      flexDirection: "row",
      justifyContent: "center",
    },
    registerText: {
      fontSize: 14,
      color: colors.textSecondary,
    },
    registerLink: {
      fontSize: 14,
      color: colors.primary,
      fontWeight: "600",
    },
  });

export default LoginScreen;
