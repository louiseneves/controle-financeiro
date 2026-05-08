/**
 * Tela de Planejamento Mensal (Orçamento)
 */

import React, { useEffect, useState, useMemo } from "react";
import { useTheme } from "../../context/ThemeContext";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
  Alert,
} from "react-native";
import { Button } from "../../components/ui";
import { COLORS, EXPENSE_CATEGORIES } from "../../utils";
import useAuthStore from "../../store/authStore";
import useBudgetStore from "../../store/budgetStore";
import useTransactionStore from "../../store/transactionStore";
import { formatMonthYear } from "../../utils/helpers/formatters";
import useSettingsStore from "../../store/settingsStore";
import { t } from "../../i18n";
import {
  MaterialCommunityIcons,
  FontAwesome6,
  MaterialIcons,
} from "@expo/vector-icons";

const BudgetScreen = ({ navigation }) => {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

  const { user } = useAuthStore();
  const { budgets, loadBudgets, getCurrentMonthBudget, deleteBudget } =
    useBudgetStore();

  const { getCurrentMonthTransactions } = useTransactionStore();
  const formatCurrency = useSettingsStore((state) => state.formatCurrency);

  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    if (user?.uid) {
      loadBudgets(user.uid);
    }
  }, [user]);

  const currentBudget = getCurrentMonthBudget();
  const monthTransactions = getCurrentMonthTransactions();

  const onRefresh = async () => {
    setRefreshing(true);
    if (user?.uid) {
      await loadBudgets(user.uid);
    }
    setRefreshing(false);
  };

  // ========================
  // 📊 GASTOS POR CATEGORIA
  // ========================
  const getSpentByCategory = (category) => {
    return monthTransactions
      .filter((t) => t.type === "despesa" && t.category === category)
      .reduce((sum, t) => sum + Number(t.amount || 0), 0);
  };

  // ========================
  // 📊 TOTAIS
  // ========================
  const calculateTotals = () => {
    if (!currentBudget || !currentBudget.categories) {
      return { totalBudget: 0, totalSpent: 0, remaining: 0 };
    }

    const totalBudget = Object.values(currentBudget.categories).reduce(
      (sum, amount) => sum + amount,
      0,
    );

    const totalSpent = Object.keys(currentBudget.categories).reduce(
      (sum, category) => sum + getSpentByCategory(category),
      0,
    );

    return {
      totalBudget,
      totalSpent,
      remaining: totalBudget - totalSpent,
    };
  };

  const totals = calculateTotals();

  // ========================
  // 🎯 AÇÕES
  // ========================

  const handleCreateBudget = () => {
    if (currentBudget) {
      Alert.alert(
        t("budgetOverview.alreadyExistsTitle"),
        t("budgetOverview.alreadyExistsMessage"),
      );
      return;
    }

    navigation.navigate("CreateBudget");
  };

  const handleEditBudget = () => {
    if (currentBudget) {
      navigation.navigate("EditBudget", { budget: currentBudget });
    }
  };

  const handleDeleteBudget = () => {
    if (!currentBudget) return;

    Alert.alert(
      t("budgetOverview.deleteTitle"),
      t("budgetOverview.deleteMessage"),
      [
        { text: t("budgetOverview.cancel"), style: "cancel" },
        {
          text: t("budgetOverview.delete"),
          style: "destructive",
          onPress: async () => {
            const result = await deleteBudget(currentBudget.id);

            if (result.success) {
              Alert.alert(
                t("budgetOverview.deleteSuccess"),
                t("budgetOverview.deleted"),
              );
            } else {
              Alert.alert(t("budgetOverview.error"), result.error);
            }
          },
        },
      ],
    );
  };

  const getCurrentMonth = () => formatMonthYear(new Date());

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.content}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* HEADER */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>{t("budgetOverview.title")}</Text>
          <Text style={styles.headerSubtitle}>{getCurrentMonth()}</Text>
        </View>

        {currentBudget ? (
          <>
            {/* RESUMO */}
            <View style={styles.summaryCard}>
              <View style={styles.summaryHeader}>
                <Text style={styles.summaryLabel}>
                  {t("budgetOverview.total")}
                </Text>

                <View style={{ flexDirection: "row", gap: 12 }}>
                  <TouchableOpacity onPress={handleEditBudget}>
                    <MaterialCommunityIcons
                      name="pencil"
                      size={18}
                      color={colors.text}
                    />
                  </TouchableOpacity>

                  <TouchableOpacity onPress={handleDeleteBudget}>
                    <MaterialCommunityIcons
                      name="delete-outline"
                      size={18}
                      color={colors.error}
                    />
                  </TouchableOpacity>
                </View>
              </View>

              <Text style={styles.summaryAmount}>
                {formatCurrency(totals.totalBudget)}
              </Text>

              <View style={styles.summaryDetails}>
                <View style={styles.summaryItem}>
                  <Text style={styles.summaryItemLabel}>
                    {t("budgetOverview.summary.spent")}
                  </Text>
                  <Text
                    style={[styles.summaryItemValue, { color: colors.error }]}
                  >
                    {formatCurrency(totals.totalSpent)}
                  </Text>
                </View>

                <View style={styles.summaryDivider} />

                <View style={styles.summaryItem}>
                  <Text style={styles.summaryItemLabel}>
                    {t("budgetOverview.summary.available")}
                  </Text>
                  <Text
                    style={[
                      styles.summaryItemValue,
                      {
                        color:
                          totals.remaining >= 0 ? colors.success : colors.error,
                      },
                    ]}
                  >
                    {formatCurrency(totals.remaining)}
                  </Text>
                </View>
              </View>

              {/* PROGRESSO */}
              <View style={styles.totalProgress}>
                <View style={styles.progressBar}>
                  <View
                    style={[
                      styles.progressFill,
                      {
                        width: `${
                          totals.totalBudget > 0
                            ? Math.min(
                                (totals.totalSpent / totals.totalBudget) * 100,
                                100,
                              )
                            : 0
                        }%`,
                        backgroundColor:
                          totals.totalSpent > totals.totalBudget
                            ? colors.error
                            : totals.totalSpent > totals.totalBudget * 0.8
                              ? colors.warning
                              : colors.success,
                      },
                    ]}
                  />
                </View>
                <Text style={styles.progressPercentage}>
                  {totals.totalBudget > 0
                    ? ((totals.totalSpent / totals.totalBudget) * 100).toFixed(
                        0,
                      )
                    : "0"}
                  %
                </Text>
              </View>
            </View>

            {/* CATEGORIAS */}
            <View style={styles.categoriesSection}>
              <Text style={styles.sectionTitle}>
                {t("budgetOverview.category.title")}
              </Text>

              {Object.entries(currentBudget.categories).map(
                ([category, budgetAmount]) => {
                  const spent = getSpentByCategory(category);
                  const remaining = budgetAmount - spent;
                  const percentage =
                    budgetAmount > 0 ? (spent / budgetAmount) * 100 : 0;

                  const categoryInfo = EXPENSE_CATEGORIES.find(
                    (c) => c.id === category,
                  );

                  return (
                    <View key={category} style={styles.categoryCard}>
                      <View style={styles.categoryHeader}>
                        <View style={styles.categoryTitleRow}>
                          <MaterialIcons
                            name={categoryInfo?.icon || "category"}
                            size={24}
                            color={colors.text}
                          />
                          <Text style={styles.categoryName}>
                            {categoryInfo?.name || category}
                          </Text>
                        </View>
                      </View>

                      <View style={styles.categoryAmounts}>
                        <Text style={styles.categorySpent}>
                          {formatCurrency(spent)}
                        </Text>
                        <Text style={styles.categoryBudget}>
                          {t("budgetOverview.category.of", {
                            amount: formatCurrency(budgetAmount),
                          })}
                        </Text>
                      </View>

                      <View style={styles.categoryProgress}>
                        <View style={styles.progressBar}>
                          <View
                            style={[
                              styles.progressFill,
                              {
                                width: `${Math.min(percentage, 100)}%`,
                                backgroundColor:
                                  percentage >= 100
                                    ? colors.error
                                    : percentage >= 80
                                      ? colors.warning
                                      : colors.success,
                              },
                            ]}
                          />
                        </View>
                        <Text style={styles.categoryPercentage}>
                          {percentage.toFixed(0)}%
                        </Text>
                      </View>

                      <Text
                        style={[
                          styles.categoryRemaining,
                          {
                            color:
                              remaining >= 0 ? colors.success : colors.error,
                          },
                        ]}
                      >
                        {remaining >= 0
                          ? t("budgetOverview.category.available", {
                              amount: formatCurrency(remaining),
                            })
                          : t("budgetOverview.category.exceeded", {
                              amount: formatCurrency(Math.abs(remaining)),
                            })}
                      </Text>
                    </View>
                  );
                },
              )}
            </View>
          </>
        ) : (
          <View style={styles.emptyState}>
            <MaterialCommunityIcons
              name="chart-bar"
              size={48}
              color={colors.textSecondary}
            />
            <Text style={styles.emptyText}>
              {t("budgetOverview.empty.title")}
            </Text>
            <Text style={styles.emptySubtext}>
              {t("budgetOverview.empty.subtitle")}
            </Text>
          </View>
        )}
      </ScrollView>

      {/* BOTÃO */}
      <View style={styles.footer}>
        <Button
          title={
            currentBudget
              ? t("budgetOverview.actions.edit")
              : t("budgetOverview.actions.create")
          }
          onPress={currentBudget ? handleEditBudget : handleCreateBudget}
        />
      </View>
    </View>
  );
};

const createStyles = (colors) =>
  StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background },
    content: { padding: 20, paddingBottom: 100 },
    header: { alignItems: "center", marginBottom: 24 },
    headerTitle: { fontSize: 24, fontWeight: "bold", color: colors.text },
    headerSubtitle: { fontSize: 16, color: colors.textSecondary },

    summaryCard: {
      backgroundColor: colors.primary,
      borderRadius: 16,
      padding: 24,
      marginBottom: 24,
    },

    summaryHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 12,
    },

    summaryLabel: { color: colors.text },
    summaryAmount: { fontSize: 36, color: colors.text },

    summaryDetails: {
      flexDirection: "row",
      justifyContent: "space-around",
      marginBottom: 16,
    },

    summaryItem: { alignItems: "center" },
    summaryItemLabel: { color: colors.textSecondary },
    summaryItemValue: { fontSize: 18, fontWeight: "bold" },
    progressPercentage: { color: colors.text },
    summaryDivider: { width: 1, backgroundColor: colors.card },

    totalProgress: { flexDirection: "row", alignItems: "center", gap: 10 },
    progressBar: {
      flex: 1,
      height: 8,
      backgroundColor: "#ccc",
      borderRadius: 4,
    },
    progressFill: { height: "100%", borderRadius: 4 },

    categoriesSection: { marginBottom: 24 },
    sectionTitle: { fontSize: 18, color: colors.text },

    categoryCard: {
      backgroundColor: colors.card,
      padding: 16,
      marginBottom: 12,
      borderRadius: 12,
      marginTop: 12,
    },

    categoryName: { color: colors.text },
    categorySpent: { fontSize: 18, fontWeight: "bold", color: colors.text },
    categoryBudget: { color: colors.textSecondary },
    categoryPercentage: { color: colors.text },

    categoryRemaining: { marginTop: 4 },

    emptyState: { alignItems: "center", padding: 60 },
    emptyText: { fontSize: 18, color: colors.text },
    emptySubtext: { color: colors.textSecondary },

    footer: {
      position: "absolute",
      bottom: 0,
      left: 0,
      right: 0,
      padding: 20,
      backgroundColor: colors.card,
    },
  });

export default BudgetScreen;
