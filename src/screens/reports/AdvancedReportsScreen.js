/**
 * Tela de Relatórios Avançados (Premium)
 */

import React, { useState, useEffect, useMemo } from "react";

import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Dimensions,
} from "react-native";

import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";

import { LineChart } from "react-native-gifted-charts";

import { useTheme } from "../../context/ThemeContext";

import { Button } from "../../components/ui";

import { COLORS } from "../../utils";

import usePremiumStore from "../../store/premiumStore";
import useTransactionStore from "../../store/transactionStore";
import useAuthStore from "../../store/authStore";
import useSettingsStore from "../../store/settingsStore";

import { t } from "../../i18n";

const screenWidth = Dimensions.get("window").width;

const AdvancedReportsScreen = ({ navigation }) => {
  const { colors } = useTheme();

  const styles = useMemo(() => createStyles(colors), [colors]);

  const { user } = useAuthStore();

  const { hasAccess } = usePremiumStore();

  const { transactions = [], loadTransactions } = useTransactionStore();

  const formatCurrency = useSettingsStore((state) => state.formatCurrency);

  const [selectedView, setSelectedView] = useState("yearly");
  const [selectedMonth1, setSelectedMonth1] = useState(0);

  const [selectedMonth2, setSelectedMonth2] = useState(1);

  useEffect(() => {
    if (user?.uid) {
      loadTransactions(user.uid);
    }
  }, [user?.uid]);

  // =========================
  // PREMIUM LOCK
  // =========================

  if (!hasAccess("advanced_reports")) {
    return (
      <View style={styles.container}>
        <View style={styles.lockedContainer}>
          <View style={styles.lockedIcon}>
            <MaterialCommunityIcons
              name="lock"
              size={72}
              color={colors.textSecondary}
            />
          </View>

          <Text style={styles.lockedTitle}>
            {t("advancedReports.premium.title")}
          </Text>

          <Text style={styles.lockedText}>
            {t("advancedReports.premium.description")}
          </Text>

          <View style={styles.premiumFeatures}>
            <Text style={styles.premiumFeaturesTitle}>
              {t("advancedReports.premium.benefitsTitle")}
            </Text>

            {[
              {
                icon: "chart-bar",
                text: t("advancedReports.premium.benefits.yearly"),
              },
              {
                icon: "swap-horizontal",
                text: t("advancedReports.premium.benefits.comparison"),
              },
              {
                icon: "chart-line",
                text: t("advancedReports.premium.benefits.projection"),
              },
              {
                icon: "file-pdf-box",
                text: t("advancedReports.premium.benefits.pdf"),
              },
              {
                icon: "file-excel",
                text: t("advancedReports.premium.benefits.excel"),
              },
            ].map((item) => (
              <View key={item.icon} style={styles.premiumFeature}>
                <MaterialCommunityIcons
                  name={item.icon}
                  size={22}
                  color={colors.primary}
                />

                <Text style={styles.premiumFeatureText}>{item.text}</Text>
              </View>
            ))}
          </View>

          <Button
            title={t("advancedReports.premium.subscribe")}
            onPress={() =>
              navigation.navigate("ProfileTab", {
                screen: "Premium",
              })
            }
            style={styles.upgradeButton}
          />
        </View>
      </View>
    );
  }

  // =========================
  // YEARLY DATA
  // =========================

  const yearlyData = useMemo(() => {
    const currentYear = new Date().getFullYear();

    return Array.from({ length: 12 }, (_, month) => {
      const monthTransactions = transactions.filter((t) => {
        const date = new Date(t.date);

        return date.getFullYear() === currentYear && date.getMonth() === month;
      });

      const income = monthTransactions
        .filter((t) => t.type === "receita")
        .reduce((sum, t) => sum + Number(t.amount || 0), 0);

      const expense = monthTransactions
        .filter((t) => t.type === "despesa")
        .reduce((sum, t) => sum + Number(t.amount || 0), 0);

      return {
        month: month + 1,

        monthName: new Date(currentYear, month).toLocaleDateString("pt-BR", {
          month: "short",
        }),

        income,
        expense,

        balance: income - expense,
      };
    });
  }, [transactions]);

  // =========================
  // PROJECTION
  // =========================

  const projection = useMemo(() => {
    const currentMonth = new Date().getMonth();

    // Apenas meses com movimentação
    const validMonths = yearlyData.filter(
      (month) => month.income > 0 || month.expense > 0,
    );

    // Últimos 3 meses válidos
    const lastThreeMonths = validMonths.slice(-3);

    const divisor = lastThreeMonths.length || 1;

    // Médias
    const avgIncome =
      lastThreeMonths.reduce((sum, m) => sum + m.income, 0) / divisor;

    const avgExpense =
      lastThreeMonths.reduce((sum, m) => sum + m.expense, 0) / divisor;

    const avgBalance = avgIncome - avgExpense;

    // Totais já realizados no ano
    const currentIncome = yearlyData.reduce((sum, m) => sum + m.income, 0);

    const currentExpense = yearlyData.reduce((sum, m) => sum + m.expense, 0);

    const currentBalance = currentIncome - currentExpense;

    // Quantos meses faltam
    const remainingMonths = 11 - currentMonth;

    // Projeção futura
    const projectedIncome = currentIncome + avgIncome * remainingMonths;

    const projectedExpense = currentExpense + avgExpense * remainingMonths;

    const projectedBalance = projectedIncome - projectedExpense;

    return {
      nextMonthIncome: avgIncome,

      nextMonthExpense: avgExpense,

      nextMonthBalance: avgBalance,

      projectedYearIncome: projectedIncome,

      projectedYearExpense: projectedExpense,

      projectedYearBalance: projectedBalance,

      remainingMonths,
    };
  }, [yearlyData]);

  // =========================
  // COMPARISON
  // =========================

  const month1Data = yearlyData[selectedMonth1];

  const month2Data = yearlyData[selectedMonth2];

  const calculatePercentage = (current, previous) => {
    if (previous === 0) {
      return current > 0 ? 100 : 0;
    }

    return ((current - previous) / Math.abs(previous)) * 100;
  };

  const incomeDifference = calculatePercentage(
    month2Data.income,
    month1Data.income,
  );

  const expenseDifference = calculatePercentage(
    month2Data.expense,
    month1Data.expense,
  );

  const balanceDifference = calculatePercentage(
    month2Data.balance,
    month1Data.balance,
  );

  // =========================
  // TOTALS
  // =========================

  const totalYearIncome = yearlyData.reduce((sum, m) => sum + m.income, 0);

  const totalYearExpense = yearlyData.reduce((sum, m) => sum + m.expense, 0);

  const totalYearBalance = totalYearIncome - totalYearExpense;

  // =========================
  // EXPORT
  // =========================

  const handleExportPDF = () => {
    Alert.alert(
      t("advancedReports.export.alerts.pdfTitle"),
      t("advancedReports.export.alerts.pdfMessage"),
    );
  };

  const handleExportExcel = () => {
    Alert.alert(
      t("advancedReports.export.alerts.excelTitle"),
      t("advancedReports.export.alerts.excelMessage"),
    );
  };

  // =========================
  // VIEWS
  // =========================

  const views = [
    {
      id: "yearly",
      label: t("advancedReports.views.yearly"),
    },
    {
      id: "comparison",
      label: t("advancedReports.views.comparison"),
    },
    {
      id: "projection",
      label: t("advancedReports.views.projection"),
    },
  ];

  // =========================
  // CHART DATA
  // =========================

  const incomeLineData = yearlyData.map((item) => ({
    value: item.income,
    label: item.monthName,
  }));

  const expenseLineData = yearlyData.map((item) => ({
    value: item.expense,
  }));

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      {/* PREMIUM BADGE */}

      <View style={styles.premiumBadge}>
        <MaterialIcons
          name="workspace-premium"
          size={20}
          color={colors.text}
          style={styles.premiumIcon}
        />

        <Text style={styles.premiumText}>{t("advancedReports.badge")}</Text>
      </View>

      {/* VIEW SELECTOR */}

      <View style={styles.viewSelector}>
        {views.map((view) => (
          <TouchableOpacity
            key={view.id}
            style={[
              styles.viewButton,

              selectedView === view.id && styles.viewButtonActive,
            ]}
            onPress={() => setSelectedView(view.id)}
            activeOpacity={0.7}
          >
            <Text
              style={[
                styles.viewButtonText,

                selectedView === view.id && styles.viewButtonTextActive,
              ]}
            >
              {view.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* YEARLY */}

      {selectedView === "yearly" && (
        <>
          <View style={styles.summaryCard}>
            <Text style={styles.cardTitle}>
              {t("advancedReports.yearly.summary")}
            </Text>

            <View style={styles.summaryRow}>
              <View style={styles.summaryItem}>
                <Text style={styles.summaryLabel}>
                  {t("advancedReports.yearly.income")}
                </Text>

                <Text
                  style={[
                    styles.summaryValue,
                    {
                      color: colors.success,
                    },
                  ]}
                >
                  {formatCurrency(totalYearIncome)}
                </Text>
              </View>

              <View style={styles.summaryItem}>
                <Text style={styles.summaryLabel}>
                  {t("advancedReports.yearly.expense")}
                </Text>

                <Text
                  style={[
                    styles.summaryValue,
                    {
                      color: colors.error,
                    },
                  ]}
                >
                  {formatCurrency(totalYearExpense)}
                </Text>
              </View>
            </View>

            <View style={styles.balanceRow}>
              <Text style={styles.balanceLabel}>
                {t("advancedReports.yearly.balance")}
              </Text>

              <Text
                style={[
                  styles.balanceValue,
                  {
                    color:
                      totalYearBalance >= 0 ? colors.success : colors.error,
                  },
                ]}
              >
                {formatCurrency(totalYearBalance)}
              </Text>
            </View>
            {/* ✅ Média mensal */}
            {(() => {
              const monthsWithData =
                yearlyData.filter((m) => m.income > 0 || m.expense > 0)
                  .length || 1;
              const avgIncome = totalYearIncome / monthsWithData;
              const avgExpense = totalYearExpense / monthsWithData;
              return (
                <View style={styles.avgRow}>
                  <Text style={styles.avgTitle}>
                    {t("advancedReports.yearly.monthlyAverage") ||
                      "Média Mensal"}
                  </Text>
                  <View style={styles.avgItems}>
                    <View style={styles.avgItem}>
                      <Text style={styles.avgLabel}>
                        {t("advancedReports.yearly.income")}
                      </Text>
                      <Text
                        style={[styles.avgValue, { color: colors.success }]}
                      >
                        {formatCurrency(avgIncome)}
                      </Text>
                    </View>
                    <View style={styles.avgItem}>
                      <Text style={styles.avgLabel}>
                        {t("advancedReports.yearly.expense")}
                      </Text>
                      <Text style={[styles.avgValue, { color: colors.error }]}>
                        {formatCurrency(avgExpense)}
                      </Text>
                    </View>
                  </View>
                </View>
              );
            })()}
          </View>

          {/* CHART */}

          <View style={styles.chartCard}>
            <Text style={styles.cardTitle}>
              {t("advancedReports.yearly.evolution")}
            </Text>

            <LineChart
              adjustToWidth
              data={incomeLineData}
              data2={expenseLineData}
              width={screenWidth - 100}
              xAxisLength={screenWidth - 100}
              height={220}
              spacing={24}
              initialSpacing={10}
              thickness={3}
              thickness2={3}
              color={colors.success}
              color2={colors.error}
              hideRules
              hideYAxisText
              yAxisColor={COLORS.gray200}
              xAxisColor={COLORS.gray200}
              xAxisLabelTextStyle={{
                fontSize: 10,
                color: colors.text,
              }}
              isAnimated
              animationDuration={800}
              curved
              curved2
              areaChart
              startFillColor={colors.success}
              endFillColor={colors.success}
              startFillColor2={colors.error}
              endFillColor2={colors.error}
              startOpacity={0.15}
              endOpacity={0.02}
            />

            <View style={styles.legend}>
              <View style={styles.legendItem}>
                <View
                  style={[
                    styles.legendDot,
                    {
                      backgroundColor: colors.success,
                    },
                  ]}
                />

                <Text style={styles.legendLabel}>
                  {t("advancedReports.yearly.income")}
                </Text>
              </View>

              <View style={styles.legendItem}>
                <View
                  style={[
                    styles.legendDot,
                    {
                      backgroundColor: colors.error,
                    },
                  ]}
                />

                <Text style={styles.legendLabel}>
                  {t("advancedReports.yearly.expense")}
                </Text>
              </View>
            </View>
          </View>
        </>
      )}

      {/* COMPARISON */}

      {selectedView === "comparison" && (
        <View style={styles.comparisonCard}>
          <Text style={styles.cardTitle}>
            {t("advancedReports.comparison.title")}
          </Text>

          {/* PERIOD */}

          <View style={styles.comparePeriodContainer}>
            <Text style={styles.comparePeriod}>
              {month1Data.monthName} → {month2Data.monthName}
            </Text>
          </View>

          {/* SELECTORS */}

          <View style={styles.monthSelectors}>
            {/* MONTH 1 */}

            <View style={styles.monthSelector}>
              <Text style={styles.monthSelectorLabel}>
                {t("advancedReports.comparison.month1")}
              </Text>

              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {yearlyData.map((month, index) => (
                  <TouchableOpacity
                    key={index}
                    style={[
                      styles.monthChip,

                      selectedMonth1 === index && styles.monthChipActive,
                    ]}
                    onPress={() => {
                      if (index !== selectedMonth2) {
                        setSelectedMonth1(index);
                      }
                    }}
                    activeOpacity={0.7}
                  >
                    <Text
                      style={[
                        styles.monthChipText,

                        selectedMonth1 === index && styles.monthChipTextActive,
                      ]}
                    >
                      {month.monthName}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>

            {/* MONTH 2 */}

            <View style={styles.monthSelector}>
              <Text style={styles.monthSelectorLabel}>
                {t("advancedReports.comparison.month2")}
              </Text>

              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {yearlyData.map((month, index) => (
                  <TouchableOpacity
                    key={index}
                    style={[
                      styles.monthChip,

                      selectedMonth2 === index && styles.monthChipActive,
                    ]}
                    onPress={() => {
                      if (index !== selectedMonth1) {
                        setSelectedMonth2(index);
                      }
                    }}
                    activeOpacity={0.7}
                  >
                    <Text
                      style={[
                        styles.monthChipText,

                        selectedMonth2 === index && styles.monthChipTextActive,
                      ]}
                    >
                      {month.monthName}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          </View>

          {/* COMPARISON GRID */}

          <View style={styles.compareGrid}>
            {/* INCOME */}

            <View style={styles.compareItem}>
              <View style={styles.compareHeader}>
                <Text style={styles.compareTitle}>
                  {t("advancedReports.yearly.income")}
                </Text>

                <MaterialCommunityIcons
                  name={incomeDifference >= 0 ? "trending-up" : "trending-down"}
                  size={20}
                  color={incomeDifference >= 0 ? colors.success : colors.error}
                />
              </View>

              <Text
                style={[
                  styles.compareValue,
                  {
                    color: colors.success,
                  },
                ]}
              >
                {formatCurrency(month2Data.income)}
              </Text>

              <Text style={styles.compareSubtext}>
                vs {month1Data.monthName}
              </Text>

              <Text
                style={[
                  styles.compareDifference,
                  {
                    color:
                      incomeDifference >= 0 ? colors.success : colors.error,
                  },
                ]}
              >
                {incomeDifference >= 0 ? "+" : ""}
                {incomeDifference.toFixed(1)}%
              </Text>
            </View>

            {/* EXPENSE */}

            <View style={styles.compareItem}>
              <View style={styles.compareHeader}>
                <Text style={styles.compareTitle}>
                  {t("advancedReports.yearly.expense")}
                </Text>

                <MaterialCommunityIcons
                  name={
                    expenseDifference <= 0 ? "trending-down" : "trending-up"
                  }
                  size={20}
                  color={expenseDifference <= 0 ? colors.success : colors.error}
                />
              </View>

              <Text
                style={[
                  styles.compareValue,
                  {
                    color: colors.error,
                  },
                ]}
              >
                {formatCurrency(month2Data.expense)}
              </Text>

              <Text style={styles.compareSubtext}>
                vs {month1Data.monthName}
              </Text>

              <Text
                style={[
                  styles.compareDifference,
                  {
                    color:
                      expenseDifference <= 0 ? colors.success : colors.error,
                  },
                ]}
              >
                {expenseDifference >= 0 ? "+" : ""}
                {expenseDifference.toFixed(1)}%
              </Text>
            </View>

            {/* BALANCE */}

            <View style={styles.compareItem}>
              <View style={styles.compareHeader}>
                <Text style={styles.compareTitle}>
                  {t("advancedReports.yearly.balance")}
                </Text>

                <MaterialCommunityIcons
                  name={
                    balanceDifference >= 0 ? "trending-up" : "trending-down"
                  }
                  size={20}
                  color={balanceDifference >= 0 ? colors.success : colors.error}
                />
              </View>

              <Text
                style={[
                  styles.compareBalance,
                  {
                    color:
                      month2Data.balance >= 0 ? colors.success : colors.error,
                  },
                ]}
              >
                {formatCurrency(month2Data.balance)}
              </Text>

              <Text style={styles.compareSubtext}>
                vs {month1Data.monthName}
              </Text>

              <Text
                style={[
                  styles.compareDifference,
                  {
                    color:
                      balanceDifference >= 0 ? colors.success : colors.error,
                  },
                ]}
              >
                {balanceDifference >= 0 ? "+" : ""}
                {balanceDifference.toFixed(1)}%
              </Text>
            </View>
          </View>
        </View>
      )}
      {/* PROJECTION */}

      {selectedView === "projection" && (
        <>
          <View style={styles.projectionCard}>
            <Text style={styles.cardTitle}>
              {t("advancedReports.projection.title")}
            </Text>

            <View style={styles.projectionItem}>
              <Text style={styles.projectionLabel}>
                {t("advancedReports.projection.income")}
              </Text>

              <Text
                style={[
                  styles.projectionValue,
                  {
                    color: colors.success,
                  },
                ]}
              >
                {formatCurrency(projection.nextMonthIncome)}
              </Text>
            </View>

            <View style={styles.projectionItem}>
              <Text style={styles.projectionLabel}>
                {t("advancedReports.projection.expense")}
              </Text>

              <Text
                style={[
                  styles.projectionValue,
                  {
                    color: colors.error,
                  },
                ]}
              >
                {formatCurrency(projection.nextMonthExpense)}
              </Text>
            </View>

            <View style={styles.projectionHighlight}>
              <Text style={styles.projectionHighlightLabel}>
                {t("advancedReports.projection.balance")}
              </Text>

              <Text
                style={[
                  styles.projectionHighlightValue,
                  {
                    color:
                      projection.nextMonthBalance >= 0
                        ? colors.success
                        : colors.error,
                  },
                ]}
              >
                {formatCurrency(projection.nextMonthBalance)}
              </Text>
            </View>
            <View style={styles.projectionYearCard}>
              <Text style={styles.projectionYearTitle}>
                {t("advancedReports.projection.yearEnd")}
              </Text>

              <View style={styles.projectionYearRow}>
                <Text style={styles.projectionYearLabel}>
                  {t("advancedReports.projection.projectedIncome")}
                </Text>

                <Text
                  style={[
                    styles.projectionYearValue,
                    { color: colors.success },
                  ]}
                >
                  {formatCurrency(projection.projectedYearIncome)}
                </Text>
              </View>

              <View style={styles.projectionYearRow}>
                <Text style={styles.projectionYearLabel}>
                  {t("advancedReports.projection.projectedExpense")}
                </Text>

                <Text
                  style={[styles.projectionYearValue, { color: colors.error }]}
                >
                  {formatCurrency(projection.projectedYearExpense)}
                </Text>
              </View>

              <View style={styles.projectionYearDivider} />

              <View style={styles.projectionYearRow}>
                <Text style={styles.projectionYearBalanceLabel}>
                  {t("advancedReports.projection.projectedBalance")}
                </Text>

                <Text
                  style={[
                    styles.projectionYearBalance,
                    {
                      color:
                        projection.projectedYearBalance >= 0
                          ? colors.success
                          : colors.error,
                    },
                  ]}
                >
                  {formatCurrency(projection.projectedYearBalance)}
                </Text>
              </View>

              <Text style={styles.remainingMonthsText}>
                {t("advancedReports.projection.basedOn", {
                  count: projection.remainingMonths,
                })}
              </Text>
            </View>
          </View>

          <View style={styles.infoBox}>
            <MaterialCommunityIcons
              name="lightbulb-on"
              size={24}
              color={colors.warning}
            />

            <Text style={styles.infoText}>
              {t("advancedReports.projection.info")}
            </Text>
          </View>
        </>
      )}

      {/* EXPORT */}

      <View style={styles.exportSection}>
        <Text style={styles.sectionTitle}>
          {t("advancedReports.export.title")}
        </Text>

        <View style={styles.exportButtons}>
          <TouchableOpacity
            style={styles.exportButton}
            onPress={handleExportPDF}
            activeOpacity={0.7}
          >
            <MaterialCommunityIcons
              name="file-pdf-box"
              size={32}
              color={colors.error}
              style={styles.exportIcon}
            />

            <Text style={styles.exportText}>
              {t("advancedReports.export.pdf")}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.exportButton}
            onPress={handleExportExcel}
            activeOpacity={0.7}
          >
            <MaterialCommunityIcons
              name="file-excel"
              size={32}
              color={colors.success}
              style={styles.exportIcon}
            />

            <Text style={styles.exportText}>
              {t("advancedReports.export.excel")}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
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

    lockedContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      padding: 40,
    },

    lockedIcon: {
      marginBottom: 24,
    },

    lockedTitle: {
      fontSize: 24,
      fontWeight: "bold",
      color: colors.text,
      marginBottom: 12,
      textAlign: "center",
    },

    lockedText: {
      fontSize: 16,
      color: colors.textSecondary,
      textAlign: "center",
      marginBottom: 32,
      lineHeight: 24,
    },

    premiumFeatures: {
      backgroundColor: colors.card,
      borderRadius: 16,
      padding: 20,
      marginBottom: 32,
      width: "100%",
    },

    premiumFeaturesTitle: {
      fontSize: 16,
      fontWeight: "700",
      color: colors.text,
      marginBottom: 16,
    },

    premiumFeature: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 14,
    },

    premiumFeatureText: {
      flex: 1,
      fontSize: 15,
      color: colors.text,
      marginLeft: 12,
    },

    upgradeButton: {
      width: "100%",
    },

    premiumBadge: {
      flexDirection: "row",
      alignItems: "center",
      alignSelf: "center",
      backgroundColor: colors.warning,
      paddingHorizontal: 16,
      paddingVertical: 8,
      borderRadius: 999,
      marginBottom: 24,
    },

    premiumIcon: {
      marginRight: 8,
    },

    premiumText: {
      fontSize: 14,
      fontWeight: "700",
      color: colors.text,
    },

    viewSelector: {
      flexDirection: "row",
      backgroundColor: colors.modeSelectorBg,
      borderRadius: 14,
      padding: 4,
      marginBottom: 24,
    },

    viewButton: {
      flex: 1,
      paddingVertical: 12,
      borderRadius: 10,
      alignItems: "center",
    },

    viewButtonActive: {
      backgroundColor: colors.card,
    },

    viewButtonText: {
      fontSize: 14,
      fontWeight: "600",
      color: colors.textSecondary,
    },

    viewButtonTextActive: {
      color: colors.primary,
    },

    summaryCard: {
      backgroundColor: colors.card,
      borderRadius: 20,
      padding: 20,
      marginBottom: 20,
    },

    cardTitle: {
      fontSize: 18,
      fontWeight: "700",
      color: colors.text,
      marginBottom: 16,
    },

    summaryRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginBottom: 20,
      gap: 12,
    },

    summaryItem: {
      flex: 1,
      alignItems: "center",
    },

    summaryLabel: {
      fontSize: 14,
      color: colors.textSecondary,
      marginBottom: 8,
      textAlign: "center",
    },

    summaryValue: {
      fontSize: 20,
      fontWeight: "bold",
    },

    balanceRow: {
      backgroundColor: colors.modeSelectorBg,
      padding: 16,
      borderRadius: 14,
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },

    balanceLabel: {
      fontSize: 16,
      fontWeight: "600",
      color: colors.text,
    },

    balanceValue: {
      fontSize: 24,
      fontWeight: "bold",
    },
    avgRow: {
      marginTop: 16,
      paddingTop: 16,
      borderTopWidth: 1,
      borderTopColor: colors.border,
    },
    avgTitle: {
      fontSize: 14,
      fontWeight: "600",
      color: colors.textSecondary,
      marginBottom: 12,
    },
    avgItems: {
      flexDirection: "row",
      gap: 12,
    },
    avgItem: {
      flex: 1,
      backgroundColor: colors.modeSelectorBg,
      borderRadius: 10,
      padding: 12,
      alignItems: "center",
    },
    avgLabel: {
      fontSize: 12,
      color: colors.textSecondary,
      marginBottom: 4,
    },
    avgValue: {
      fontSize: 16,
      fontWeight: "bold",
    },
    chartCard: {
      backgroundColor: colors.card,
      borderRadius: 20,
      padding: 20,
      marginBottom: 20,
    },

    legend: {
      flexDirection: "row",
      justifyContent: "center",
      gap: 24,
      marginTop: 16,
    },

    legendItem: {
      flexDirection: "row",
      alignItems: "center",
      gap: 8,
    },

    legendDot: {
      width: 12,
      height: 12,
      borderRadius: 999,
    },

    legendLabel: {
      fontSize: 14,
      color: colors.text,
    },

    comparisonCard: {
      backgroundColor: colors.card,
      borderRadius: 20,
      padding: 20,
      marginBottom: 20,
    },

    comparePeriodContainer: {
      alignItems: "center",
      marginBottom: 24,
    },

    comparePeriod: {
      fontSize: 16,
      fontWeight: "700",
      color: colors.primary,
      textTransform: "capitalize",
    },

    monthSelectors: {
      gap: 16,
      marginBottom: 24,
    },

    monthSelector: {
      gap: 10,
    },

    monthSelectorLabel: {
      fontSize: 14,
      fontWeight: "600",
      color: colors.textSecondary,
    },

    monthChip: {
      backgroundColor: colors.modeSelectorBg,
      paddingHorizontal: 14,
      paddingVertical: 10,
      borderRadius: 999,
      marginRight: 10,
    },

    monthChipActive: {
      backgroundColor: colors.primary,
    },

    monthChipText: {
      color: colors.text,
      fontSize: 13,
      fontWeight: "600",
      textTransform: "capitalize",
    },

    monthChipTextActive: {
      color: colors.buttonText || "#FFF",
    },

    compareGrid: {
      gap: 16,
    },

    compareItem: {
      backgroundColor: colors.modeSelectorBg,
      borderRadius: 18,
      padding: 18,
    },

    compareHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 10,
    },

    compareTitle: {
      fontSize: 14,
      color: colors.textSecondary,
    },

    compareValue: {
      fontSize: 22,
      fontWeight: "bold",
      marginBottom: 6,
    },

    compareBalance: {
      fontSize: 28,
      fontWeight: "bold",
      marginBottom: 6,
    },

    compareSubtext: {
      fontSize: 13,
      color: colors.textSecondary,
      marginBottom: 10,
      textTransform: "capitalize",
    },

    compareDifference: {
      fontSize: 16,
      fontWeight: "700",
    },
    projectionCard: {
      backgroundColor: colors.card,
      borderRadius: 20,
      padding: 20,
      marginBottom: 20,
    },

    projectionItem: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingVertical: 12,
    },

    projectionLabel: {
      fontSize: 16,
      color: colors.textSecondary,
    },

    projectionValue: {
      fontSize: 18,
      fontWeight: "700",
    },

    projectionHighlight: {
      backgroundColor: colors.modeSelectorBg,
      padding: 16,
      borderRadius: 14,
      marginTop: 12,
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },

    projectionHighlightLabel: {
      fontSize: 18,
      fontWeight: "700",
      color: colors.text,
    },

    projectionHighlightValue: {
      fontSize: 24,
      fontWeight: "bold",
    },

    projectionYearCard: {
      marginTop: 20,
      backgroundColor: colors.modeSelectorBg,
      borderRadius: 16,
      padding: 16,
    },

    projectionYearTitle: {
      fontSize: 16,
      fontWeight: "700",
      color: colors.text,
      marginBottom: 16,
    },

    projectionYearRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 12,
    },

    projectionYearLabel: {
      fontSize: 14,
      color: colors.textSecondary,
    },

    projectionYearValue: {
      fontSize: 16,
      fontWeight: "700",
    },

    projectionYearDivider: {
      height: 1,
      backgroundColor: colors.border,
      marginVertical: 14,
    },

    projectionYearBalanceLabel: {
      fontSize: 16,
      fontWeight: "700",
      color: colors.text,
    },

    projectionYearBalance: {
      fontSize: 22,
      fontWeight: "bold",
    },

    remainingMonthsText: {
      marginTop: 14,
      fontSize: 12,
      color: colors.textSecondary,
      textAlign: "center",
    },

    infoBox: {
      flexDirection: "row",
      backgroundColor: `${colors.info}10`,
      borderRadius: 14,
      padding: 16,
      marginBottom: 20,
      gap: 12,
    },

    infoText: {
      flex: 1,
      fontSize: 14,
      color: colors.text,
      lineHeight: 22,
    },

    exportSection: {
      marginTop: 8,
    },

    sectionTitle: {
      fontSize: 18,
      fontWeight: "700",
      color: colors.text,
      marginBottom: 16,
    },

    exportButtons: {
      flexDirection: "row",
      gap: 12,
    },

    exportButton: {
      flex: 1,
      backgroundColor: colors.card,
      borderRadius: 16,
      padding: 20,
      alignItems: "center",
    },

    exportIcon: {
      marginBottom: 10,
    },

    exportText: {
      fontSize: 16,
      fontWeight: "700",
      color: colors.text,
    },
  });

export default AdvancedReportsScreen;
