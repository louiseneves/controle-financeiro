/**
 * Tela de Adicionar Receita
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
import { Button, Input } from "../../components/ui";
import { INCOME_CATEGORIES } from "../../utils";
import useAuthStore from "../../store/authStore";
import useTransactionStore from "../../store/transactionStore";
import { isoToBR, brToISO } from "../../utils/helpers/formatters";
import { t } from "../../i18n";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";

const AddIncomeScreen = ({ navigation }) => {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

  const { user, initialized, loading: authLoading } = useAuthStore();
  const { addTransaction } = useTransactionStore();

  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [isRecurring, setIsRecurring] = useState(false);

  const [descriptionError, setDescriptionError] = useState("");
  const [amountError, setAmountError] = useState("");
  const [categoryError, setCategoryError] = useState("");
  const [loading, setLoading] = useState(false);

  // -----------------------------
  // Validação
  // -----------------------------
  const validateFields = () => {
    let valid = true;

    setDescriptionError("");
    setAmountError("");
    setCategoryError("");

    if (!description.trim()) {
      setDescriptionError(t("addIncome.form.description.required"));
      valid = false;
    }

    if (!amount || parseFloat(amount) <= 0) {
      setAmountError(t("addIncome.form.amount.invalid"));
      valid = false;
    }

    if (!category) {
      setCategoryError(t("addIncome.form.category.required"));
      valid = false;
    }

    return valid;
  };

  // -----------------------------
  // Salvar Receita
  // -----------------------------
  const handleSave = async () => {
    if (!validateFields()) return;

    if (!user?.uid) {
      Alert.alert(
        t("addIncome.alerts.sessionExpired.title"),
        t("addIncome.alerts.sessionExpired.message"),
      );
      navigation.replace("Login");
      return;
    }

    try {
      setLoading(true);

      // Conversão segura da data
      const parsedDate = new Date(`${date}T00:00:00`);

      if (isNaN(parsedDate.getTime())) {
        Alert.alert(t("addIncome.error.title"), t("addIncome.date.invalid"));
        return;
      }

      const transactionData = {
        type: "receita",
        description: description.trim(),
        amount: parseFloat(amount),
        category,
        date: parsedDate.toISOString(),
        isRecurring,
        userId: user.uid,
      };

      const result = await addTransaction(transactionData);

      if (result?.success) {
        Alert.alert(
          t("addIncome.success.title"),
          t("addIncome.success.message"),
          [{ text: "OK", onPress: () => navigation.goBack() }],
        );
      } else {
        Alert.alert(
          t("addIncome.error.title"),
          result?.error || t("addIncome.error.generic"),
        );
      }
    } catch (error) {
      console.error("Erro ao salvar receita:", error);
      Alert.alert(t("addIncome.error.title"), t("addIncome.error.save"));
    } finally {
      setLoading(false);
    }
  };

  // -----------------------------
  // Estados de carregamento
  // -----------------------------
  if (!initialized || authLoading) {
    return (
      <View style={styles.center}>
        <Text style={{ color: colors.text }}>{t("addIncome.loading")}</Text>
      </View>
    );
  }

  if (!user) {
    navigation.replace("Login");
    return null;
  }

  // -----------------------------
  // Render
  // -----------------------------
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.form}>
          <Input
            label={t("addIncome.form.description.label")}
            value={description}
            onChangeText={setDescription}
            placeholder={t("addIncome.form.description.placeholder")}
            error={descriptionError}
            leftIcon={
              <Text style={styles.iconText}>
                <MaterialCommunityIcons
                  name="file-document-edit-outline"
                  size={24}
                  color={colors.textSecondary}
                />
              </Text>
            }
          />

          <Input
            label={t("addIncome.form.amount.label")}
            value={amount}
            onChangeText={setAmount}
            placeholder={t("addIncome.form.amount.placeholder")}
            keyboardType="numeric"
            error={amountError}
            leftIcon={
              <Text style={styles.iconText}>
                <MaterialCommunityIcons
                  name="currency-usd"
                  size={24}
                  color={colors.textSecondary}
                />
              </Text>
            }
          />

          <Input
            label={t("addIncome.form.date.label")}
            value={isoToBR(date)}
            onChangeText={(text) => setDate(brToISO(text))}
            placeholder={t("addIncome.form.date.placeholder")}
            leftIcon={
              <Text style={styles.iconText}>
                <MaterialCommunityIcons
                  name="calendar"
                  size={24}
                  color={colors.textSecondary}
                />
              </Text>
            }
          />

          {/* Categorias */}
          <View style={styles.categorySection}>
            <Text style={styles.label}>
              {t("addIncome.form.category.label")}
            </Text>

            <View style={styles.categoryGrid}>
              {INCOME_CATEGORIES.map((cat) => (
                <TouchableOpacity
                  key={cat.id}
                  style={[
                    styles.categoryCard,
                    category === cat.id && styles.categoryCardSelected,
                    { borderColor: cat.color },
                  ]}
                  onPress={() => setCategory(cat.id)}
                >
                  <Text style={styles.categoryIcon}>{cat.icon}</Text>
                  <Text
                    style={[
                      styles.categoryName,
                      category === cat.id && styles.categoryNameSelected,
                    ]}
                  >
                    {cat.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {categoryError && (
              <Text style={styles.errorTextSmall}>{categoryError}</Text>
            )}
          </View>

          {/* Recorrente */}
          <TouchableOpacity
            style={styles.checkboxContainer}
            onPress={() => setIsRecurring(!isRecurring)}
          >
            <View
              style={[styles.checkbox, isRecurring && styles.checkboxChecked]}
            >
              {isRecurring && <Text style={styles.checkmark}>✓</Text>}
            </View>
            <View style={styles.checkboxContent}>
              <Text style={styles.checkboxLabel}>
                {t("addIncome.form.recurring.label")}
              </Text>
              <Text style={styles.checkboxDescription}>
                {t("addIncome.form.recurring.description")}
              </Text>
            </View>
          </TouchableOpacity>
        </View>

        <View style={styles.actions}>
          <Button
            title={t("addIncome.actions.save")}
            onPress={handleSave}
            loading={loading}
          />
          <Button
            title={t("addIncome.actions.cancel")}
            onPress={() => navigation.goBack()}
            variant="outline"
          />
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
    content: {
      padding: 20,
      paddingBottom: 40,
    },
    center: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
    },
    form: {
      marginBottom: 24,
    },
    iconText: {
      fontSize: 20,
    },
    label: {
      fontSize: 14,
      fontWeight: "600",
      color: colors.text,
    },
    categorySection: {
      marginBottom: 16,
    },
    categoryGrid: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: 10,
      marginTop: 8,
    },
    categoryCard: {
      width: "31%",
      aspectRatio: 1,
      backgroundColor: colors.card,
      borderRadius: 12,
      alignItems: "center",
      justifyContent: "center",
      borderWidth: 2,
    },
    categoryCardSelected: {
      borderWidth: 3,
      backgroundColor: colors.success + "10",
    },
    categoryIcon: {
      fontSize: 28,
    },
    categoryName: {
      fontSize: 11,
      color: colors.textSecondary,
    },
    categoryNameSelected: {
      color: colors.success,
    },
    checkboxContainer: {
      flexDirection: "row",
      backgroundColor: colors.card,
      borderRadius: 12,
      padding: 16,
      gap: 12,
    },
    checkbox: {
      width: 24,
      height: 24,
      borderWidth: 2,
      borderRadius: 6,
      alignItems: "center",
      justifyContent: "center",
      borderColor: colors.border,
    },
    checkboxChecked: {
      backgroundColor: colors.primary,
      borderColor: colors.primary,
    },
    checkmark: {
      color: colors.card,
      fontWeight: "bold",
    },
    checkboxLabel: {
      fontSize: 16,
      color: colors.text,
    },
    checkboxDescription: {
      fontSize: 13,
      color: colors.textSecondary,
    },
    errorTextSmall: {
      fontSize: 12,
      color: colors.error,
      marginTop: 4,
    },
    actions: {
      gap: 12,
    },
  });

export default AddIncomeScreen;
