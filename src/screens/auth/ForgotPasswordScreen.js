/**
 * Tela de Recuperação de Senha
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
} from "react-native";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { Button, Input } from "../../components/ui";
import useAuthStore from "../../store/authStore";
import { t } from "../../i18n";

const ForgotPasswordScreen = ({ navigation }) => {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [emailSent, setEmailSent] = useState(false);

  // ✅ CORRETO: usar selectors
  const resetPassword = useAuthStore((state) => state.resetPassword);
  const loading = useAuthStore((state) => state.loading);

  // Validar email
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Validar campos
  const validateFields = () => {
    setEmailError("");

    if (!email) {
      setEmailError(t("forgotPassword.emailRequired"));
      return false;
    }

    if (!validateEmail(email)) {
      setEmailError(t("forgotPassword.emailInvalid"));
      return false;
    }

    return true;
  };

  // Enviar email de recuperação
  const handleResetPassword = async () => {
    if (!validateFields()) return;

    const result = await resetPassword(email);

    if (result.success) {
      setEmailSent(true);
      Alert.alert(
        t("forgotPassword.successTitle"),
        <MaterialCommunityIcons
          name="checkbox-marked"
          size={24}
          color={colors.text}
        />,
        t("forgotPassword.successMessage"),
      );
    } else {
      Alert.alert(
        t("forgotPassword.errorTitle"),
        result.error || t("forgotPassword.sendError"),
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
          <MaterialCommunityIcons name="lock" size={64} color={colors.text} />
          <Text style={styles.title}>{t("forgotPassword.title")}</Text>
          <Text style={styles.subtitle}>
            {emailSent
              ? t("forgotPassword.subtitleSent")
              : t("forgotPassword.subtitleDefault")}
          </Text>
        </View>

        {!emailSent ? (
          <View style={styles.form}>
            <Input
              label={t("forgotPassword.emailLabel")}
              value={email}
              onChangeText={setEmail}
              placeholder={t("forgotPassword.emailPlaceholder")}
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

            <Button
              title={t("forgotPassword.sendButton")}
              onPress={handleResetPassword}
              loading={loading}
              style={styles.submitButton}
            />

            <TouchableOpacity
              onPress={() => navigation.goBack()}
              style={styles.backButton}
            >
              <Text style={styles.backButtonText}>
                {t("forgotPassword.backToLogin")}
              </Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.successContainer}>
            <Text style={styles.successIcon}>✅</Text>
            <Text style={styles.successText}>
              {t("forgotPassword.successInfo")}
            </Text>
            <Text style={styles.emailText}>{email}</Text>

            <Text style={styles.instructionsText}>
              {t("forgotPassword.instructions")}
            </Text>

            <Button
              title={t("forgotPassword.backLoginButton")}
              onPress={() => navigation.navigate("Login")}
              style={styles.backToLoginButton}
            />

            <TouchableOpacity
              onPress={() => setEmailSent(false)}
              style={styles.resendButton}
            >
              <Text style={styles.resendText}>
                {t("forgotPassword.resend")}
              </Text>
            </TouchableOpacity>
          </View>
        )}
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
    title: {
      fontSize: 28,
      fontWeight: "bold",
      color: colors.text,
      marginBottom: 8,
    },
    subtitle: {
      fontSize: 16,
      color: colors.textSecondary,
      textAlign: "center",
      paddingHorizontal: 20,
    },
    form: {
      width: "100%",
    },
    submitButton: {
      marginTop: 8,
      marginBottom: 24,
    },
    backButton: {
      alignSelf: "center",
    },
    backButtonText: {
      fontSize: 14,
      color: colors.primary,
      fontWeight: "600",
    },
    successContainer: {
      alignItems: "center",
      paddingHorizontal: 20,
    },
    successIcon: {
      fontSize: 64,
      marginBottom: 24,
    },
    successText: {
      fontSize: 16,
      color: colors.textSecondary,
      textAlign: "center",
      marginBottom: 12,
    },
    emailText: {
      fontSize: 18,
      fontWeight: "bold",
      color: colors.primary,
      marginBottom: 24,
    },
    instructionsText: {
      fontSize: 14,
      color: colors.textSecondary,
      textAlign: "center",
      marginBottom: 32,
    },
    backToLoginButton: {
      width: "100%",
      marginBottom: 16,
    },
    resendButton: {
      padding: 12,
    },
    resendText: {
      fontSize: 14,
      color: colors.primary,
      fontWeight: "600",
    },
  });

export default ForgotPasswordScreen;
