/**
 * Tela de Calculadora de Dízimo
 */

import React, { useState, useEffect, useMemo } from "react";
import { useTheme } from "../../context/ThemeContext";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
  TouchableOpacity,
} from "react-native";
import { Button, Input } from "../../components/ui";
import { calculateTithe, formatDate, formatMonthYear } from "../../utils";
import useAuthStore from "../../store/authStore";
import useTransactionStore from "../../store/transactionStore";
import useSettingsStore from "../../store/settingsStore";
import { t } from "../../i18n";
import { MaterialCommunityIcons } from "@expo/vector-icons";

const TitheCalculatorScreen = ({ navigation }) => {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const { user } = useAuthStore();
  const formatCurrency = useSettingsStore((state) => state.formatCurrency);
  const { getCurrentMonthTransactions, addTransaction } = useTransactionStore();

  const [customAmount, setCustomAmount] = useState("");
  const [selectedMode, setSelectedMode] = useState("month"); // 'month' ou 'custom'
  const [selectedReceipts, setSelectedReceipts] = useState([]);
  const [extraAmount, setExtraAmount] = useState(""); // ✅ NOVO: valor extra
  const [loading, setLoading] = useState(false);

  // Calcular receitas do mês
  const monthTransactions = getCurrentMonthTransactions();
  const allMonthIncomes = monthTransactions.filter((t) => t.type === "receita");
  const monthIncome = monthTransactions
    .filter((t) => t.type === "receita")
    .reduce((sum, t) => sum + Number(t.amount || 0), 0);

  // Calcular receitas SELECIONADAS
  const selectedIncome = allMonthIncomes
    .filter((t) => selectedReceipts.includes(t.id))
    .reduce((sum, t) => sum + Number(t.amount || 0), 0);

  // ✅ NOVO: Valor extra convertido
  const extra = parseFloat(extraAmount) || 0;

  // Usar modo personalizado ou modo mensal
  const calculatedIncome =
    selectedMode === "custom" ? selectedIncome + extra : monthIncome;
  const monthTithe = calculateTithe(calculatedIncome);

  // Calcular dízimo pago
  const paidTithe = monthTransactions
    .filter((t) => t.type === "oferta" && t.category === "dizimo")
    .reduce((sum, t) => sum + Number(t.amount || 0), 0);

  const remaining = Math.max(0, monthTithe - paidTithe);

  // Histórico de dízimos
  const titheHistory = monthTransactions
    .filter((t) => t.type === "oferta" && t.category === "dizimo")
    .sort((a, b) => new Date(b.date || 0) - new Date(a.date || 0));

  // Toggle de seleção de receita
  const toggleReceiptSelection = (receiptId) => {
    setSelectedReceipts((prev) =>
      prev.includes(receiptId)
        ? prev.filter((id) => id !== receiptId)
        : [...prev, receiptId],
    );
  };

  // Registrar dízimo
  const handleRegisterTithe = async (amount, description) => {
    try {
      setLoading(true);

      const transactionData = {
        type: "oferta",
        description,
        amount,
        category: "dizimo",
        date: new Date().toISOString(),
        userId: user.uid,
      };

      const result = await addTransaction(transactionData);

      if (result.success) {
        Alert.alert(t("tithe.successTitle"), t("tithe.successMessage"), [
          {
            text: "OK",
            onPress: () => {
              setCustomAmount("");
              setSelectedReceipts([]);
              setExtraAmount(""); // ✅ NOVO: limpar valor extra
              navigation.goBack();
            },
          },
        ]);
      } else {
        Alert.alert(
          t("tithe.errorTitle"),
          result.error || t("tithe.errorGeneric"),
        );
      }
    } catch (error) {
      console.error(t("tithe.errorGeneric"), error);
      Alert.alert(t("tithe.errorTitle"), t("tithe.errorSave"));
    } finally {
      setLoading(false);
    }
  };

  // Registrar dízimo do mês
  const handleRegisterMonthTithe = () => {
    if (monthTithe === 0) {
      Alert.alert(
        t("tithe.warningNoIncomeTitle"),
        t("tithe.warningNoIncomeMessage"),
      );
      return;
    }

    const amountToRegister = remaining > 0 ? remaining : monthTithe;

    Alert.alert(
      t("tithe.confirmTitle"),
      t("tithe.confirmMessage", {
        amount: formatCurrency(amountToRegister),
        monthYear: formatMonthYear(new Date()),
      }),
      [
        { text: t("tithe.cancelButton"), style: "cancel" },
        {
          text: t("tithe.confirmButton"),
          onPress: () =>
            handleRegisterTithe(
              amountToRegister,
              t("tithe.confirmDescription", {
                monthYear: formatMonthYear(new Date()),
              }),
            ),
        },
      ],
    );
  };

  // Registrar dízimo personalizado
  const handleRegisterCustomTithe = () => {
    // ✅ ATUALIZADO: aceita seleção OU valor extra
    if (selectedReceipts.length === 0 && extra === 0) {
      Alert.alert(
        t("tithe.warningNoReceiptsTitle"),
        t("tithe.warningNoReceiptsMessage"),
      );
      return;
    }

    if (monthTithe === 0) {
      Alert.alert(
        t("tithe.warningNoIncomeTitle"),
        t("tithe.warningNoIncomeMessage"),
      );
      return;
    }

    Alert.alert(
      t("tithe.confirmTitle"),
      t("tithe.confirmMessage", {
        amount: formatCurrency(monthTithe),
        monthYear: formatMonthYear(new Date()),
      }),
      [
        { text: t("tithe.cancelButton"), style: "cancel" },
        {
          text: t("tithe.confirmButton"),
          onPress: () =>
            handleRegisterTithe(
              monthTithe,
              t("tithe.confirmDescription", {
                monthYear: formatMonthYear(new Date()),
              }),
            ),
        },
      ],
    );
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerIcon}>
          <MaterialCommunityIcons name="cross" size={48} color={colors.tithe} />
        </Text>
        <Text style={styles.headerTitle}>{t("tithe.header")}</Text>
        <Text style={styles.headerSubtitle}>{t("tithe.verse")}</Text>
      </View>

      {/* Seletor de modo */}
      <View style={styles.modeSelector}>
        <TouchableOpacity
          style={[
            styles.modeButton,
            selectedMode === "month" && styles.modeButtonActive,
          ]}
          onPress={() => {
            setSelectedMode("month");
            setSelectedReceipts([]);
            setExtraAmount(""); // ✅ NOVO: limpar ao trocar de modo
          }}
          activeOpacity={0.7}
        >
          <Text
            style={[
              styles.modeButtonText,
              selectedMode === "month" && styles.modeButtonTextActive,
            ]}
          >
            {t("tithe.modeMonth")}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.modeButton,
            selectedMode === "custom" && styles.modeButtonActive,
          ]}
          onPress={() => setSelectedMode("custom")}
          activeOpacity={0.7}
        >
          <Text
            style={[
              styles.modeButtonText,
              selectedMode === "custom" && styles.modeButtonTextActive,
            ]}
          >
            {t("tithe.modeCustom")}
          </Text>
        </TouchableOpacity>
      </View>

      {selectedMode === "month" ? (
        // Modo: Dízimo do Mês
        <>
          {/* Card de cálculo */}
          <View style={styles.calculationCard}>
            <Text style={styles.cardTitle}>{t("tithe.calculationAuto")}</Text>

            <View style={styles.calculationRow}>
              <Text style={styles.calculationLabel}>
                {t("tithe.monthIncome")}
              </Text>
              <Text style={styles.calculationValue}>
                {formatCurrency(monthIncome)}
              </Text>
            </View>

            <View style={styles.divider} />

            <View style={styles.calculationRow}>
              <Text style={styles.calculationLabel}>
                {t("tithe.tithePercent")}
              </Text>
              <Text style={[styles.calculationValue, { color: colors.tithe }]}>
                {formatCurrency(monthTithe)}
              </Text>
            </View>

            <View style={styles.divider} />

            <View style={styles.calculationRow}>
              <Text style={styles.calculationLabel}>{t("tithe.returned")}</Text>
              <Text
                style={[styles.calculationValue, { color: colors.success }]}
              >
                {formatCurrency(paidTithe)}
              </Text>
            </View>

            <View style={styles.divider} />

            <View style={styles.calculationRow}>
              <Text style={[styles.calculationLabel, { fontWeight: "bold" }]}>
                {t("tithe.remaining")}
              </Text>
              <Text
                style={[
                  styles.calculationValue,
                  {
                    fontWeight: "bold",
                    fontSize: 20,
                    color: remaining > 0 ? colors.warning : colors.success,
                  },
                ]}
              >
                {formatCurrency(remaining)}
              </Text>
            </View>

            {remaining === 0 && monthTithe > 0 && (
              <View style={styles.paidBadge}>
                <Text style={styles.paidText}>
                  <MaterialCommunityIcons
                    name="check"
                    size={24}
                    color={colors.success}
                  />
                  {t("tithe.returnedBadge")}
                </Text>
              </View>
            )}
          </View>

          {/* Botão registrar */}
          {remaining > 0 && (
            <Button
              title={t("tithe.registerAmount", {
                amount: formatCurrency(remaining),
              })}
              onPress={handleRegisterMonthTithe}
              loading={loading}
              style={styles.registerButton}
            />
          )}

          {monthIncome === 0 && (
            <View style={styles.emptyState}>
              <Text style={styles.emptyIcon}>
                <MaterialCommunityIcons
                  name="file-document-edit-outline"
                  size={48}
                  color={colors.textSecondary}
                />
              </Text>
              <Text style={styles.emptyText}>{t("tithe.emptyState")}</Text>
            </View>
          )}
        </>
      ) : (
        // Modo: Personalizado
        <>
          <View style={styles.customCard}>
            <Text style={styles.cardTitle}>{t("tithe.customCard")}</Text>
            <Text style={styles.cardSubtitle}>
              {t("tithe.customCardSubtitle")}
            </Text>

            {/* Lista de receitas para selecionar */}
            {allMonthIncomes.length === 0 ? (
              <View style={styles.emptyState}>
                <MaterialCommunityIcons
                  name="file-document-edit-outline"
                  size={48}
                  color={colors.textSecondary}
                />
                <Text style={styles.emptyText}>{t("tithe.emptyState")}</Text>
              </View>
            ) : (
              <>
                {allMonthIncomes.map((income) => {
                  const isSelected = selectedReceipts.includes(income.id);
                  return (
                    <TouchableOpacity
                      key={income.id}
                      style={[
                        styles.receiptItem,
                        isSelected && styles.receiptItemSelected,
                      ]}
                      onPress={() => toggleReceiptSelection(income.id)}
                      activeOpacity={0.7}
                    >
                      <View style={styles.receiptInfo}>
                        <Text style={styles.receiptDescription}>
                          {income.description}
                        </Text>
                        <Text style={styles.receiptDate}>
                          {formatDate(income.date)}
                        </Text>
                      </View>
                      <View style={styles.receiptRight}>
                        <Text
                          style={[
                            styles.receiptAmount,
                            isSelected && { color: colors.tithe },
                          ]}
                        >
                          {formatCurrency(Number(income.amount))}
                        </Text>
                        <MaterialCommunityIcons
                          name={
                            isSelected
                              ? "checkbox-marked-circle"
                              : "checkbox-blank-circle-outline"
                          }
                          size={24}
                          color={
                            isSelected ? colors.tithe : colors.textSecondary
                          }
                        />
                      </View>
                    </TouchableOpacity>
                  );
                })}
              </>
            )}

            {/* ✅ NOVO: Campo de valor extra */}
            <View style={styles.extraAmountSection}>
              <Text style={styles.extraAmountLabel}>
                {t("tithe.extraAmountLabel")}
              </Text>
              <Input
                value={extraAmount}
                onChangeText={setExtraAmount}
                placeholder="0,00"
                keyboardType="numeric"
                leftIcon={
                  <MaterialCommunityIcons
                    name="plus-circle-outline"
                    size={24}
                    color={colors.textSecondary}
                  />
                }
              />
            </View>

            {/* ✅ ATUALIZADO: Resultado com breakdown */}
            {(selectedReceipts.length > 0 || extra > 0) && (
              <View style={styles.resultCard}>
                <View>
                  <Text style={styles.resultLabel}>
                    {t("tithe.tithePercent")}
                  </Text>
                  {selectedReceipts.length > 0 && (
                    <Text style={styles.resultSublabel}>
                      {selectedReceipts.length} receita(s):{" "}
                      {formatCurrency(selectedIncome)}
                    </Text>
                  )}
                  {extra > 0 && (
                    <Text style={styles.resultSublabel}>
                      + Extra: {formatCurrency(extra)}
                    </Text>
                  )}
                </View>
                <Text style={styles.resultValue}>
                  {formatCurrency(monthTithe)}
                </Text>
              </View>
            )}

            <Button
              title={t("tithe.registerButton")}
              onPress={handleRegisterCustomTithe}
              loading={loading}
              // ✅ ATUALIZADO: habilita se tiver seleção OU valor extra
              disabled={selectedReceipts.length === 0 && extra === 0}
              style={styles.registerButton}
            />
          </View>
        </>
      )}

      {/* Histórico */}
      {titheHistory.length > 0 && (
        <View style={styles.historySection}>
          <Text style={styles.sectionTitle}>{t("tithe.historyTitle")}</Text>
          {titheHistory.map((tithe, index) => (
            <View key={tithe.id || index} style={styles.historyItem}>
              <View>
                <Text style={styles.historyDescription}>
                  {tithe.description}
                </Text>
                <Text style={styles.historyDate}>{formatDate(tithe.date)}</Text>
              </View>
              <Text style={styles.historyAmount}>
                {formatCurrency(tithe.amount)}
              </Text>
            </View>
          ))}
        </View>
      )}
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
    header: {
      alignItems: "center",
      marginBottom: 24,
    },
    headerIcon: {
      fontSize: 64,
      marginBottom: 16,
    },
    headerTitle: {
      fontSize: 24,
      fontWeight: "bold",
      color: colors.text,
      marginBottom: 8,
    },
    headerSubtitle: {
      fontSize: 14,
      color: colors.textSecondary,
      textAlign: "center",
      fontStyle: "italic",
    },
    modeSelector: {
      flexDirection: "row",
      backgroundColor: colors.modeSelectorBg,
      borderRadius: 12,
      padding: 4,
      marginBottom: 24,
    },
    modeButton: {
      flex: 1,
      paddingVertical: 12,
      borderRadius: 8,
      alignItems: "center",
    },
    modeButtonActive: {
      backgroundColor: colors.card,
    },
    modeButtonText: {
      fontSize: 14,
      fontWeight: "600",
      color: colors.textSecondary,
    },
    modeButtonTextActive: {
      color: colors.primary,
    },
    calculationCard: {
      backgroundColor: colors.card,
      borderRadius: 16,
      padding: 20,
      marginBottom: 20,
      shadowColor: colors.shadow,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
    cardTitle: {
      fontSize: 18,
      fontWeight: "600",
      color: colors.text,
      marginBottom: 16,
    },
    cardSubtitle: {
      fontSize: 14,
      color: colors.textSecondary,
      marginBottom: 16,
    },
    calculationRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingVertical: 12,
    },
    calculationLabel: {
      fontSize: 16,
      color: colors.text,
    },
    calculationValue: {
      fontSize: 16,
      fontWeight: "600",
      color: colors.text,
    },
    divider: {
      height: 1,
      backgroundColor: colors.border,
    },
    paidBadge: {
      backgroundColor: colors.success + "20",
      borderRadius: 8,
      padding: 12,
      marginTop: 16,
      alignItems: "center",
    },
    paidText: {
      fontSize: 16,
      fontWeight: "600",
      color: colors.success,
    },
    customCard: {
      backgroundColor: colors.card,
      borderRadius: 16,
      padding: 20,
      marginBottom: 20,
      shadowColor: colors.shadow,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
    iconText: {
      fontSize: 20,
    },
    // ✅ NOVO: estilos de receitas selecionáveis
    receiptItem: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: 12,
      padding: 14,
      marginBottom: 10,
    },
    receiptItemSelected: {
      borderColor: colors.tithe,
      backgroundColor: colors.tithe + "10",
    },
    receiptInfo: {
      flex: 1,
      marginRight: 12,
    },
    receiptDescription: {
      fontSize: 15,
      fontWeight: "600",
      color: colors.text,
      marginBottom: 2,
    },
    receiptDate: {
      fontSize: 13,
      color: colors.textSecondary,
    },
    receiptRight: {
      alignItems: "flex-end",
      gap: 4,
    },
    receiptAmount: {
      fontSize: 15,
      fontWeight: "bold",
      color: colors.text,
    },
    // ✅ NOVO: seção de valor extra
    extraAmountSection: {
      marginTop: 16,
      marginBottom: 4,
    },
    extraAmountLabel: {
      fontSize: 14,
      fontWeight: "600",
      color: colors.textSecondary,
      marginBottom: 8,
    },
    resultCard: {
      backgroundColor: colors.tithe + "10",
      borderRadius: 12,
      padding: 16,
      marginBottom: 16,
      marginTop: 8,
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },
    resultLabel: {
      fontSize: 16,
      fontWeight: "600",
      color: colors.text,
    },
    // ✅ NOVO: sublabel do resultado
    resultSublabel: {
      fontSize: 12,
      color: colors.textSecondary,
      marginTop: 2,
    },
    resultValue: {
      fontSize: 24,
      fontWeight: "bold",
      color: colors.tithe,
    },
    registerButton: {
      marginTop: 8,
    },
    emptyState: {
      alignItems: "center",
      paddingVertical: 40,
      borderRadius: 12,
    },
    emptyIcon: {
      fontSize: 48,
      marginBottom: 12,
    },
    emptyText: {
      fontSize: 14,
      color: colors.textSecondary,
      textAlign: "center",
      paddingHorizontal: 20,
      marginTop: 12,
    },
    historySection: {
      marginTop: 24,
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: "600",
      color: colors.text,
      marginBottom: 12,
    },
    historyItem: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      backgroundColor: colors.card,
      borderRadius: 12,
      padding: 16,
      marginBottom: 8,
      shadowColor: colors.shadow,
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.05,
      shadowRadius: 2,
      elevation: 2,
    },
    historyDescription: {
      fontSize: 16,
      fontWeight: "600",
      color: colors.text,
      marginBottom: 4,
    },
    historyDate: {
      fontSize: 13,
      color: colors.textSecondary,
    },
    historyAmount: {
      fontSize: 16,
      fontWeight: "bold",
      color: colors.transaction?.tithe || colors.primary,
    },
  });

export default TitheCalculatorScreen;
