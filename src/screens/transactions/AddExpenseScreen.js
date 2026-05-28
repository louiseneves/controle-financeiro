/**
 * Tela de Adicionar Despesa (REFATORADA)
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
import useSettingsStore from "../../store/settingsStore";

import { t } from "../../i18n";
import { getLocalDate, parseCurrencyInput } from "../../utils/helpers/formatters";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { MaterialIcons } from "@expo/vector-icons";

const AddExpenseScreen = ({ navigation }) => {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

  const { user } = useAuthStore();
  const { addTransaction } = useTransactionStore();

  const language = useSettingsStore((state) => state.language);

  /* ================= STATE ================= */

  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [date, setDate] = useState(getLocalDate()); // 👈 agora simples (string livre)
  const [isRecurring, setIsRecurring] = useState(false);

  const [loading, setLoading] = useState(false);

  const [errors, setErrors] = useState({
    description: "",
    amount: "",
    category: "",
  });

  /* ================= VALIDATION ================= */

  const validate = () => {
    const newErrors = {
      description: "",
      amount: "",
      category: "",
    };

    let valid = true;

    if (!description.trim()) {
      newErrors.description = t("addExpense.form.description.required");
      valid = false;
    }

    if (!amount || parseCurrencyInput(amount) <= 0) {
      newErrors.amount = t("addExpense.form.amount.invalid");
      valid = false;
    }

    if (!category) {
      newErrors.category = t("addExpense.form.category.required");
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  /* ================= SAVE ================= */

  const handleSave = async () => {
    if (!validate()) return;

    if (!user?.uid) {
      Alert.alert(
        t("addExpense.alerts.sessionExpired.title"),
        t("addExpense.alerts.sessionExpired.message"),
      );
      return;
    }

    try {
      setLoading(true);

      const isoDate = date;

      if (!isoDate) {
        Alert.alert(
          t("addExpense.alerts.error.title"),
          t("addExpense.date.invalid"),
        );
        return;
      }

      const transactionData = {
        type: "despesa",
        description: description.trim(),
        amount: parseCurrencyInput(amount),
        category,
        date: isoDate, // 👈 SEM timezone bug
        isRecurring,
        userId: user.uid,
      };

      const result = await addTransaction(transactionData);

      if (result.success) {
        Alert.alert(
          t("addExpense.alerts.success.title"),
          t("addExpense.alerts.success.message"),
          [{ text: "OK", onPress: () => navigation.goBack() }],
        );
      } else {
        Alert.alert(
          t("addExpense.alerts.error.title"),
          result.error || t("addExpense.alerts.error.generic"),
        );
      }
    } catch (error) {
      console.error(error);

      Alert.alert(
        t("addExpense.alerts.error.title"),
        t("addExpense.alerts.error.save"),
      );
    } finally {
      setLoading(false);
    }
  };

  /* ================= UI ================= */

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.form}>
          {/* DESCRIÇÃO */}
          <Input
            label={t("addExpense.form.description.label")}
            value={description}
            onChangeText={setDescription}
            placeholder={t("addExpense.form.description.placeholder")}
            error={errors.description}
            leftIcon={
              <MaterialCommunityIcons
                name="file-document-edit-outline"
                size={22}
                color={colors.textSecondary}
              />
            }
          />

          {/* VALOR */}
          <Input
            label={t("addExpense.form.amount.label")}
            value={amount}
            onChangeText={setAmount}
            placeholder={t("addExpense.form.amount.placeholder")}
            keyboardType="numeric"
            error={errors.amount}
            leftIcon={
              <MaterialCommunityIcons
                name="currency-usd"
                size={22}
                color={colors.textSecondary}
              />
            }
          />

          {/* DATA (GLOBAL, SEM LÓGICA NA TELA) */}
          <Input
            label={t("addExpense.form.date.label")}
            type="date" // 👈 MAGIA AQUI
            value={date}
            onChangeDate={setDate}
            placeholder={t("addExpense.form.date.placeholder")}
            leftIcon={
              <MaterialCommunityIcons
                name="calendar"
                size={22}
                color={colors.textSecondary}
              />
            }
          />

          {/* CATEGORIAS */}
          <View style={styles.categorySection}>
            <Text style={styles.label}>
              {t("addExpense.form.category.label")}
            </Text>

            <ScrollView
              style={styles.categoryScroll}
              contentContainerStyle={styles.categoryGrid}
              nestedScrollEnabled
            >
              {EXPENSE_CATEGORIES.map((cat) => (
                <TouchableOpacity
                  key={cat.id}
                  style={[
                    styles.categoryCard,
                    category === cat.id && styles.categorySelected,
                    { borderColor: cat.color },
                  ]}
                  onPress={() => setCategory(cat.id)}
                >
                  <MaterialIcons name={cat.icon} size={34} color={cat.color} />

                  <Text style={styles.categoryText}>{cat.name}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            {!!errors.category && (
              <Text style={styles.errorText}>{errors.category}</Text>
            )}
          </View>

          {/* RECORRENTE */}
          <TouchableOpacity
            style={styles.checkbox}
            onPress={() => setIsRecurring(!isRecurring)}
          >
            <View style={[styles.box, isRecurring && styles.boxActive]}>
              {isRecurring && <Text style={styles.check}>✓</Text>}
            </View>

            <Text style={styles.checkboxText}>
              {t("addExpense.form.recurring.label")}
            </Text>
          </TouchableOpacity>
        </View>

        {/* AÇÕES */}
        <View style={styles.actions}>
          <Button
            title={t("addExpense.actions.save")}
            onPress={handleSave}
            loading={loading}
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

/* ================= STYLES ================= */

const createStyles = (colors) =>
  StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background },

    content: {
      padding: 20,
    },

    form: {
      gap: 12,
    },

    label: {
      fontSize: 14,
      fontWeight: "600",
      color: colors.text,
      marginBottom: 10,
    },

    categorySection: {
      marginTop: 10,
    },

    categoryScroll: {
      maxHeight: 280,
    },

    categoryGrid: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: 10,
    },

    categoryCard: {
      width: "30%",
      padding: 10,
      borderWidth: 2,
      borderRadius: 12,
      alignItems: "center",
      backgroundColor: colors.card,
    },

    categorySelected: {
      backgroundColor: colors.error + "10",
    },

    categoryText: {
      fontSize: 11,
      textAlign: "center",
      marginTop: 5,
      color: colors.text,
    },

    checkbox: {
      flexDirection: "row",
      alignItems: "center",
      marginTop: 20,
      gap: 10,
    },

    box: {
      width: 22,
      height: 22,
      borderWidth: 2,
      borderColor: colors.border,
      borderRadius: 4,
      alignItems: "center",
      justifyContent: "center",
    },

    boxActive: {
      backgroundColor: colors.primary,
      borderColor: colors.primary,
    },

    check: {
      color: "#fff",
      fontWeight: "bold",
    },

    checkboxText: {
      color: colors.text,
    },

    actions: {
      marginTop: 20,
      gap: 10,
    },

    errorText: {
      color: colors.error,
      marginTop: 6,
      fontSize: 12,
    },
  });

export default AddExpenseScreen;
