/**
 * Tela de Criar/Editar Orçamento - FINAL (PRODUCTION READY)
 */

import React, { useState, useEffect, useMemo } from "react";
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
import { COLORS, EXPENSE_CATEGORIES, formatMonthYear } from "../../utils";

import useAuthStore from "../../store/authStore";
import useBudgetStore from "../../store/budgetStore";
import useTransactionStore from "../../store/transactionStore";

import { t } from "../../i18n";
import {
  getCurrencyPlaceholder,
  parseCurrencyInput,
  formatCurrency,
} from "../../utils/helpers/formatters";

import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";

const CreateBudgetScreen = ({ navigation, route }) => {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

  const { user } = useAuthStore();
  const { addBudget, updateBudget, budgets } = useBudgetStore();
  const { transactions } = useTransactionStore();

  const existingBudget = route.params?.budget;
  const isEditing = !!existingBudget;

  const [categoryInputs, setCategoryInputs] = useState({});
  const [categoryBudgets, setCategoryBudgets] = useState({});
  const [loading, setLoading] = useState(false);

  const currencyPlaceholder = getCurrencyPlaceholder();
  const MAX_VALUE = 999_999_999.99; // R$ 999 milhões — limite razoável
  // ================================
  // 📅 MÊS ATUAL (single source)
  // ================================
  const currentMonth = useMemo(() => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(
      2,
      "0",
    )}`;
  }, []);

  // ================================
  // 📌 LOAD EDIT DATA
  // ================================
  useEffect(() => {
    if (isEditing && existingBudget?.categories) {
      setCategoryBudgets(existingBudget.categories);

      const formatted = {};
      Object.entries(existingBudget.categories).forEach(([k, v]) => {
        formatted[k] = formatCurrency(v);
      });

      setCategoryInputs(formatted);
    }
  }, [isEditing, existingBudget]);

  // ================================
  // ✏️ INPUT HANDLER
  // ================================
  const handleAmountChange = (category, value) => {
    const numeric = parseCurrencyInput(value) || 0;

    setCategoryInputs((prev) => ({
      ...prev,
      [category]: value,
    }));

    setCategoryBudgets((prev) => ({
      ...prev,
      [category]: numeric,
    }));
  };

  // ================================
  // 📊 TOTAL
  // ================================
  const totalBudget = useMemo(() => {
    return Object.values(categoryBudgets).reduce(
      (sum, val) => sum + Number(val || 0),
      0,
    );
  }, [categoryBudgets]);

  // ================================
  // 🤖 SUGESTÃO INTELIGENTE
  // ================================
  const getSuggestedBudgets = () => {
    // ✅ Usa o mês anterior como base
    const now = new Date();
    const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const lastMonthStr = `${lastMonth.getFullYear()}-${String(lastMonth.getMonth() + 1).padStart(2, "0")}`;

    const expenses = transactions.filter(
      (t) => t.type === "despesa" && t.date?.startsWith(lastMonthStr),
    );

    const grouped = {};
    expenses.forEach((t) => {
      grouped[t.category] = (grouped[t.category] || 0) + Number(t.amount);
    });

    return grouped;
  };
  const handleQuickFill = () => {
    const suggestions = getSuggestedBudgets();

    if (Object.keys(suggestions).length === 0) {
      Alert.alert(
        t("budget.quickFill.title"),
        t("budget.quickFill.emptyLastMonth") ||
          "Você não tem despesas registradas no mês anterior para usar como sugestão.",
      );
      return;
    }

    const inputs = {};
    Object.entries(suggestions).forEach(([k, v]) => {
      inputs[k] = formatCurrency(v);
    });

    setCategoryBudgets(suggestions);
    setCategoryInputs(inputs);
  };

  // ================================
  // 💾 SAVE
  // ================================
  const handleSave = async () => {
    if (totalBudget <= 0) {
      Alert.alert(t("budget.alerts.error"), t("budget.alerts.minRequired"));
      return;
    }

    // Após o check de totalBudget <= 0, adicione:
    if (totalBudget > MAX_VALUE) {
      Alert.alert(t("budget.alerts.error"), t("validation.amountTooHigh"));
      return;
    }

    if (!user?.uid) {
      Alert.alert(
        t("auth.sessionExpired.title"),
        t("auth.sessionExpired.message"),
      );
      return;
    }

    // 🚫 BLOQUEIO: 1 orçamento por mês
    const alreadyExists = budgets.find((b) => b.month === currentMonth);

    if (alreadyExists && !isEditing) {
      Alert.alert(
        t("budget.alreadyExistsTitle"),
        t("budget.alreadyExistsMessage"),
      );
      return;
    }

    const filtered = Object.entries(categoryBudgets)
      .filter(([_, v]) => v > 0)
      .reduce((acc, [k, v]) => {
        acc[k] = v;
        return acc;
      }, {});

    try {
      setLoading(true);

      const payload = {
        month: currentMonth,
        categories: filtered,
        userId: user.uid,
      };

      const result = isEditing
        ? await updateBudget(existingBudget.id, payload)
        : await addBudget(payload);

      if (!result.success) {
        throw new Error(result.error);
      }

      Alert.alert(
        t("budget.alerts.successTitle"),
        isEditing ? t("budget.alerts.updated") : t("budget.alerts.created"),
        [{ text: "OK", onPress: () => navigation.goBack() }],
      );
    } catch (error) {
      console.error("Erro ao salvar orçamento:", error);
      Alert.alert(t("budget.alerts.error"), t("budget.alerts.saveError"));
    } finally {
      setLoading(false);
    }
  };

  // ================================
  // 🧠 UI
  // ================================
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.content}>
        {/* HEADER */}
        <View style={styles.header}>
          <MaterialCommunityIcons
            name="chart-bar"
            size={60}
            color={colors.primary}
          />
          <Text style={styles.title}>
            {isEditing ? t("budget.editTitle") : t("budget.createTitle")}
          </Text>
          <Text style={styles.subtitle}>{formatMonthYear(new Date())}</Text>
        </View>

        {/* TOTAL */}
        <View style={styles.totalCard}>
          <Text style={styles.totalLabel}>{t("budget.total")}</Text>
          <Text style={styles.totalAmount}>{formatCurrency(totalBudget)}</Text>

          <TouchableOpacity onPress={handleQuickFill}>
            <Text style={styles.quickFill}>{t("budget.quickFill.title")}</Text>
          </TouchableOpacity>
        </View>

        {/* CATEGORIAS */}
        {EXPENSE_CATEGORIES.map((cat) => (
          <View key={cat.id} style={styles.category}>
            <View style={styles.categoryHeader}>
              <MaterialIcons name={cat.icon} size={22} color={colors.text} />
              <Text style={styles.categoryName}>{cat.name}</Text>
            </View>

            <Input
              value={categoryInputs[cat.id] || ""}
              onChangeText={(v) => handleAmountChange(cat.id, v)}
              placeholder={currencyPlaceholder}
              keyboardType="numeric"
              onBlur={() => {
                const val = categoryBudgets[cat.id] || 0;
                setCategoryInputs((prev) => ({
                  ...prev,
                  [cat.id]: val ? formatCurrency(val) : "",
                }));
              }}
            />
          </View>
        ))}

        {/* ACTIONS */}
        <View style={styles.actions}>
          <Button
            title={
              isEditing ? t("budget.actions.save") : t("budget.actions.create")
            }
            onPress={handleSave}
            loading={loading}
            disabled={totalBudget <= 0}
          />

          <Button
            title={t("budget.actions.cancel")}
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

    header: {
      alignItems: "center",
      marginBottom: 24,
    },
    title: {
      fontSize: 22,
      fontWeight: "bold",
      color: colors.text,
    },
    subtitle: {
      color: colors.textSecondary,
    },

    totalCard: {
      backgroundColor: colors.primary,
      padding: 20,
      borderRadius: 16,
      alignItems: "center",
      marginBottom: 20,
    },
    totalLabel: {
      color: colors.onPrimary,
    },
    totalAmount: {
      fontSize: 28,
      fontWeight: "bold",
      color: colors.onPrimary,
    },
    quickFill: {
      marginTop: 8,
      color: colors.textSecondary,
      opacity: 0.9,
    },

    category: {
      marginBottom: 16,
    },
    categoryHeader: {
      flexDirection: "row",
      gap: 8,
      marginBottom: 6,
    },
    categoryName: {
      color: colors.text,
    },

    actions: {
      marginTop: 20,
      gap: 12,
    },
  });

export default CreateBudgetScreen;
