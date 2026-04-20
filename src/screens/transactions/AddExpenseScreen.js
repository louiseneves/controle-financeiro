/**
 * Tela de Adicionar Despesa
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
import { EXPENSE_CATEGORIES } from "../../utils";
import useAuthStore from "../../store/authStore";
import useTransactionStore from "../../store/transactionStore";
import {
  parseISODateOnly,
  isoToBR,
  brToISO,
} from "../../utils/helpers/formatters";
import { t } from "../../i18n";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { MaterialIcons } from "@expo/vector-icons";

const AddExpenseScreen = ({ navigation }) => {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const { user } = useAuthStore();
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

  // Validar campos
  const validateFields = () => {
    let isValid = true;

    setDescriptionError("");
    setAmountError("");
    setCategoryError("");

    if (!description.trim()) {
      setDescriptionError(t("addExpense.form.description.required"));
      isValid = false;
    }

    if (!amount || parseFloat(amount) <= 0) {
      setAmountError(t("addExpense.form.amount.invalid"));
      isValid = false;
    }

    if (!category) {
      setCategoryError(t("addExpense.form.category.required"));
      isValid = false;
    }

    return isValid;
  };

  // ==================== SAVE ====================
  const handleSave = async () => {
    if (!validateFields()) return;

    if (!user?.uid) {
      Alert.alert(
        t("addExpense.alerts.sessionExpired.title"),
        t("addExpense.alerts.sessionExpired.message"),
      );
      return;
    }

    try {
      setLoading(true);

      const parsedDate = parseISODateOnly(date);

      if (!parsedDate) {
        Alert.alert(t("addExpense.error.title"), t("addExpense.date.invalid"));
        return;
      }

      const transactionData = {
        type: "despesa",
        description: description.trim(),
        amount: parseFloat(amount),
        category,
        date: parsedDate.toISOString(),
        isRecurring,
        userId: user.uid,
      };

      const result = await addTransaction(transactionData);

      if (result.success) {
        // ✅ CORRIGIDO: Remove o ícone, apenas strings
        Alert.alert(
          t("addExpense.alerts.success.title"),
          t("addExpense.alerts.success.message"), // ✅ Apenas STRING
          [{ text: "OK", onPress: () => navigation.goBack() }],
        );
      } else {
        Alert.alert(
          t("addExpense.alerts.error.title"),
          result.error || t("addExpense.alerts.error.generic"),
        );
      }
    } catch (error) {
      console.error("Erro ao salvar despesa:", error);
      Alert.alert(
        t("addExpense.alerts.error.title"),
        t("addExpense.alerts.error.save"),
      );
    } finally {
      setLoading(false);
    }
  };

  // ==================== UI ====================
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.form}>
          <Input
            label={t("addExpense.form.description.label")}
            value={description}
            onChangeText={setDescription}
            placeholder={t("addExpense.form.description.placeholder")}
            error={descriptionError}
            leftIcon={
              <MaterialCommunityIcons
                name="file-document-edit-outline"
                size={24}
                color={colors.textSecondary}
              />
            }
          />

          <Input
            label={t("addExpense.form.amount.label")}
            value={amount}
            onChangeText={setAmount}
            placeholder={t("addExpense.form.amount.placeholder")}
            keyboardType="numeric"
            error={amountError}
            leftIcon={
              <MaterialCommunityIcons
                name="currency-usd"
                size={24}
                color={colors.textSecondary}
              />
            }
          />

          <Input
            label={t("addExpense.form.date.label")}
            value={isoToBR(date)}
            onChangeText={(text) => setDate(brToISO(text))}
            placeholder={t("addExpense.form.date.placeholder")}
            leftIcon={
              <MaterialCommunityIcons
                name="calendar"
                size={24}
                color={colors.textSecondary}
              />
            }
          />

          {/* Categorias */}
          <View style={styles.categorySection}>
            <Text style={styles.label}>
              {t("addExpense.form.category.label")}{" "}
              {categoryError && <Text style={styles.errorText}>*</Text>}
            </Text>
            <ScrollView
              style={styles.categoryScrollContainer}
              contentContainerStyle={styles.categoryGrid}
              showsVerticalScrollIndicator={true}
              nestedScrollEnabled={true}
              scrollEnabled={true}
            >
              {EXPENSE_CATEGORIES.map((cat) => (
                <TouchableOpacity
                  key={cat.id}
                  style={[
                    styles.categoryCard,
                    category === cat.id && styles.categoryCardSelected,
                    { borderColor: cat.color },
                  ]}
                  onPress={() => setCategory(cat.id)}
                  activeOpacity={0.7}
                >
                  <MaterialIcons name={cat.icon} size={40} color={cat.color} />
                  <Text
                    style={[
                      styles.categoryName,
                      category === cat.id && styles.categoryNameSelected,
                    ]}
                    numberOfLines={2}
                  >
                    {cat.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
            {categoryError && (
              <Text style={styles.errorTextSmall}>{categoryError}</Text>
            )}
          </View>

          {/* Despesa Recorrente */}
          <TouchableOpacity
            style={styles.checkboxContainer}
            onPress={() => setIsRecurring(!isRecurring)}
            activeOpacity={0.7}
          >
            <View
              style={[styles.checkbox, isRecurring && styles.checkboxChecked]}
            >
              {isRecurring && <Text style={styles.checkmark}>✓</Text>}
            </View>
            <View style={styles.checkboxContent}>
              <Text style={styles.checkboxLabel}>
                {t("addExpense.form.recurring.label")}
              </Text>
              <Text style={styles.checkboxDescription}>
                {t("addExpense.form.recurring.description")}
              </Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Botões */}
        <View style={styles.actions}>
          <Button
            title={t("addExpense.actions.save")}
            onPress={handleSave}
            loading={loading}
            style={styles.saveButton}
          />

          <Button
            title={t("addExpense.actions.cancel")}
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
      marginBottom: 12,
    },
    categorySection: {
      marginBottom: 16,
    },
    categoryScrollContainer: {
      maxHeight: 300,
    },
    categoryGrid: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: 10,
    },
    categoryCard: {
      width: "31%",
      aspectRatio: 1,
      backgroundColor: colors.card,
      borderRadius: 12,
      padding: 12,
      alignItems: "center",
      justifyContent: "center",
      borderWidth: 2,
      borderColor: colors.border,
    },
    categoryCardSelected: {
      borderWidth: 3,
      backgroundColor: colors.error + "10",
    },
    categoryIcon: {
      fontSize: 28,
      marginBottom: 6,
    },
    categoryName: {
      fontSize: 11,
      color: colors.textSecondary,
      textAlign: "center",
      fontWeight: "500",
    },
    categoryNameSelected: {
      color: colors.error,
      fontWeight: "600",
    },
    checkboxContainer: {
      flexDirection: "row",
      alignItems: "flex-start",
      backgroundColor: colors.card,
      borderRadius: 12,
      padding: 16,
      gap: 12,
    },
    checkbox: {
      width: 24,
      height: 24,
      borderRadius: 6,
      borderWidth: 2,
      borderColor: colors.border,
      alignItems: "center",
      justifyContent: "center",
    },
    checkboxChecked: {
      backgroundColor: colors.primary,
      borderColor: colors.primary,
    },
    checkmark: {
      color: colors.card,
      fontSize: 16,
      fontWeight: "bold",
    },
    checkboxContent: {
      flex: 1,
    },
    checkboxLabel: {
      fontSize: 16,
      fontWeight: "600",
      color: colors.text,
      marginBottom: 4,
    },
    checkboxDescription: {
      fontSize: 13,
      color: colors.textSecondary,
    },
    errorText: {
      color: colors.error,
      fontSize: 14,
    },
    errorTextSmall: {
      fontSize: 12,
      color: colors.error,
      marginTop: 4,
      marginLeft: 4,
    },
    actions: {
      gap: 12,
    },
    saveButton: {
      marginBottom: 12,
    },
  });

export default AddExpenseScreen;
