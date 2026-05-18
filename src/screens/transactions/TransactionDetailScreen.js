/**
 * Tela de Detalhes/Edição de Transação
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

import {
  INCOME_CATEGORIES,
  EXPENSE_CATEGORIES,
  INVESTMENT_CATEGORIES,
  OFFER_CATEGORIES,
  formatDate,
} from "../../utils";

import useTransactionStore from "../../store/transactionStore";
import useSettingsStore from "../../store/settingsStore";

import { t } from "../../i18n";

import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";

import useAuthStore from "../../store/authStore";

const TransactionDetailScreen = ({ navigation, route }) => {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

  const { transaction, returnTo } = route.params || {};

  const user = useAuthStore((state) => state.user);
  const currentUserId = user?.uid;

  const formatCurrency = useSettingsStore((state) => state.formatCurrency);

  const { updateTransaction, deleteTransaction } = useTransactionStore();

  /* ==================== PROTEÇÃO ==================== */

  if (!transaction) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>{t("transactionDetail.notFound")}</Text>
      </View>
    );
  }

  /* ==================== STATES ==================== */

  const [isEditing, setIsEditing] = useState(false);

  const [description, setDescription] = useState(transaction.description);

  const [amount, setAmount] = useState(transaction.amount.toString());

  const [category, setCategory] = useState(transaction.category);

  const initialDateISO = transaction.date
    ? transaction.date.substring(0, 10)
    : "";

  const [date, setDate] = useState(initialDateISO);

  const [isRecurring, setIsRecurring] = useState(
    transaction.isRecurring || false,
  );

  const [profitability, setProfitability] = useState(
    transaction.profitability?.toString() || "",
  );

  const [descriptionError, setDescriptionError] = useState("");
  const [amountError, setAmountError] = useState("");
  const [categoryError, setCategoryError] = useState("");
  const [profitabilityError, setProfitabilityError] = useState("");

  const [loading, setLoading] = useState(false);

  /* ==================== HELPERS ==================== */

  const getCategories = () => {
    switch (transaction.type) {
      case "receita":
        return INCOME_CATEGORIES;

      case "despesa":
        return EXPENSE_CATEGORIES;

      case "investimento":
        return INVESTMENT_CATEGORIES;

      case "oferta":
        return OFFER_CATEGORIES;

      default:
        return [];
    }
  };

  const categories = getCategories();

  const getCategoryName = () => {
    return (
      categories.find((c) => c.id === transaction.category)?.name ||
      transaction.category
    );
  };

  const getTypeColor = () => {
    const map = {
      receita: colors.income,
      despesa: colors.expense,
      investimento: colors.investment,
      oferta: colors.offer,
    };

    return map[transaction.type] || colors.textSecondary;
  };

  const typeColor = getTypeColor();

  /* ==================== VALIDATION ==================== */

  const validateFields = () => {
    let isValid = true;

    setDescriptionError("");
    setAmountError("");
    setCategoryError("");
    setProfitabilityError("");

    if (!description.trim()) {
      setDescriptionError(
        t("transactionDetail.validation.descriptionRequired"),
      );

      isValid = false;
    }

    if (!amount || parseFloat(amount) <= 0) {
      setAmountError(t("transactionDetail.validation.amountInvalid"));

      isValid = false;
    }

    if (!category) {
      setCategoryError(t("transactionDetail.validation.categoryRequired"));

      isValid = false;
    }

    if (transaction.type === "investimento") {
      if (profitability && parseFloat(profitability) < 0) {
        setProfitabilityError(
          t("transactionDetail.validation.profitabilityInvalid"),
        );

        isValid = false;
      }
    }

    return isValid;
  };

  // Função de retorno reutilizável:
  const handleGoBack = () => {
    if (returnTo === "HomeTab") {
      navigation.getParent()?.navigate("HomeTab");
    } else if (returnTo === "ReportsTab") {
      navigation.getParent()?.navigate("ReportsTab", {
        screen: "History",
      });
    } else {
      // padrão: volta para lista de transações
      navigation.navigate("TransactionsList");
    }
  };

  /* ==================== SAVE ==================== */

  const handleSave = async () => {
    if (!validateFields()) return;

    try {
      setLoading(true);

      const updatedData = {
        description: description.trim(),
        amount: parseFloat(amount),
        category,
        date: `${date}T00:00:00.000Z`,
        isRecurring,
      };

      if (transaction.type === "investimento") {
        updatedData.profitability = profitability
          ? parseFloat(profitability)
          : 0;
      }

      const result = await updateTransaction(transaction.id, updatedData);

      if (result.success) {
        Alert.alert(
          t("transactionDetail.successTitle"),
          t("transactionDetail.updateSuccess"),
          [
            {
              text: "OK",
              onPress: () => {
                setIsEditing(false);
                handleGoBack();
              },
            },
          ],
        );
      } else {
        Alert.alert(
          t("transactionDetail.errorTitle"),
          result.error || t("transactionDetail.updateError"),
        );
      }
    } catch (error) {
      console.error("❌ Erro ao atualizar:", error);

      Alert.alert(
        t("transactionDetail.errorTitle"),
        t("transactionDetail.updateFailed"),
      );
    } finally {
      setLoading(false);
    }
  };

  /* ==================== DELETE ==================== */

  const handleDelete = () => {
    if (transaction.userId !== currentUserId) {
      Alert.alert("Erro", "Você não tem permissão para deletar esta transação");

      return;
    }

    Alert.alert(
      t("transactionDetail.deleteConfirmTitle"),
      t("transactionDetail.deleteConfirm"),
      [
        {
          text: t("transactionDetail.cancelButton"),
          style: "cancel",
        },
        {
          text: t("transactionDetail.deleteButtonAction"),
          style: "destructive",

          onPress: async () => {
            try {
              setLoading(true);

              const result = await deleteTransaction(transaction.id);

              if (result.success) {
                Alert.alert(
                  t("transactionDetail.successTitle"),
                  t("transactionDetail.deleteSuccess"),
                  [
                    {
                      text: "OK",
                      onPress: () => handleGoBack(),
                    },
                  ],
                );
              } else {
                Alert.alert(
                  t("transactionDetail.errorTitle"),
                  result.error || t("transactionDetail.deleteError"),
                );
              }
            } catch (error) {
              console.error("❌ Erro ao deletar:", error);

              Alert.alert(
                t("transactionDetail.errorTitle"),
                t("transactionDetail.deleteFailed"),
              );
            } finally {
              setLoading(false);
            }
          },
        },
      ],
    );
  };

  /* ==================== RENDER ==================== */

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* HEADER */}

        <View style={[styles.header, { backgroundColor: typeColor + "20" }]}>
          <Text style={styles.typeLabel}>
            {(transaction?.type || "TRANSAÇÃO").toUpperCase()}
          </Text>

          {!isEditing && (
            <Text style={[styles.headerAmount, { color: typeColor }]}>
              {formatCurrency(transaction.amount)}
            </Text>
          )}
        </View>

        {/* ==================== EDIT ==================== */}

        {isEditing ? (
          <View style={styles.form}>
            <Input
              label={t("transactionDetail.descriptionLabel")}
              value={description}
              onChangeText={setDescription}
              placeholder={t("transactionDetail.descriptionLabel")}
              error={descriptionError}
              leftIcon={
                <MaterialCommunityIcons
                  name="file-document-edit-outline"
                  size={22}
                  color={colors.textSecondary}
                />
              }
            />

            <Input
              label={t("transactionDetail.amountLabel")}
              value={amount}
              onChangeText={setAmount}
              placeholder="0,00"
              keyboardType="numeric"
              error={amountError}
              leftIcon={
                <MaterialCommunityIcons
                  name="currency-usd"
                  size={22}
                  color={colors.textSecondary}
                />
              }
            />

            <Input
              label={t("transactionDetail.dateLabel")}
              type="date"
              value={date}
              onChangeDate={(iso) => setDate(iso)}
              placeholder={t("transactionDetail.placeholders.date")}
              leftIcon={
                <MaterialCommunityIcons
                  name="calendar"
                  size={22}
                  color={colors.textSecondary}
                />
              }
            />

            {/* RENTABILIDADE */}

            {transaction.type === "investimento" && (
              <Input
                label={t("transactionDetail.profitabilityLabel")}
                placeholder="0.00"
                value={profitability}
                onChangeText={setProfitability}
                keyboardType="decimal-pad"
                error={profitabilityError}
              />
            )}

            {/* CATEGORIAS */}

            <View style={styles.categorySection}>
              <Text style={styles.label}>
                {t("transactionDetail.categoryLabel")}
              </Text>

              <ScrollView
                style={styles.categoryScrollContainer}
                contentContainerStyle={styles.categoryGrid}
                nestedScrollEnabled
                showsVerticalScrollIndicator={false}
              >
                {categories.map((cat) => (
                  <TouchableOpacity
                    key={cat.id}
                    style={[
                      styles.categoryCard,
                      {
                        borderColor: cat.color,
                      },

                      category === cat.id && {
                        borderWidth: 3,
                        backgroundColor: cat.color + "15",
                      },
                    ]}
                    onPress={() => setCategory(cat.id)}
                  >
                    <MaterialIcons
                      name={cat.icon}
                      size={38}
                      color={cat.color}
                    />

                    <Text
                      style={[
                        styles.categoryName,

                        category === cat.id && {
                          color: cat.color,
                          fontWeight: "700",
                        },
                      ]}
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

            {/* RECORRENTE */}

            {(transaction.type === "receita" ||
              transaction.type === "despesa") && (
              <TouchableOpacity
                style={styles.checkboxContainer}
                onPress={() => setIsRecurring(!isRecurring)}
                activeOpacity={0.7}
              >
                <View
                  style={[
                    styles.checkbox,

                    isRecurring && styles.checkboxChecked,
                  ]}
                >
                  {isRecurring && <Text style={styles.checkmark}>✓</Text>}
                </View>

                <View style={styles.checkboxContent}>
                  <Text style={styles.checkboxLabel}>
                    {transaction.type === "receita"
                      ? t("transactionDetail.recurringIncome") ||
                        "Receita recorrente"
                      : t("transactionDetail.recurringExpense") ||
                        "Despesa recorrente"}
                  </Text>

                  <Text style={styles.checkboxDescription}>
                    {t("transactionDetail.recurringDescription")}
                  </Text>
                </View>
              </TouchableOpacity>
            )}

            {/* ACTIONS */}

            <View style={styles.actions}>
              <Button
                title={t("transactionDetail.saveButton")}
                onPress={handleSave}
                loading={loading}
                style={styles.saveButton}
              />

              <Button
                title={t("transactionDetail.cancelButton")}
                variant="outline"
                onPress={() => {
                  setIsEditing(false);

                  setDescription(transaction.description);

                  setAmount(transaction.amount.toString());

                  setCategory(transaction.category);

                  setDate(initialDateISO);

                  setIsRecurring(transaction.isRecurring || false);

                  setProfitability(transaction.profitability?.toString() || "");
                }}
              />
            </View>
          </View>
        ) : (
          /* ==================== DETAILS ==================== */

          <View style={styles.details}>
            <View style={styles.detailCard}>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>
                  {t("transactionDetail.descriptionLabel")}
                </Text>

                <Text style={styles.detailValue}>
                  {transaction.description}
                </Text>
              </View>

              <View style={styles.divider} />

              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>
                  {t("transactionDetail.categoryLabel")}
                </Text>

                <Text style={styles.detailValue}>{getCategoryName()}</Text>
              </View>

              <View style={styles.divider} />

              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>
                  {t("transactionDetail.dateLabel")}
                </Text>

                <Text style={styles.detailValue}>
                  {formatDate(transaction.date)}
                </Text>
              </View>

              {/* RENTABILIDADE */}

              {transaction.type === "investimento" && (
                <>
                  <View style={styles.divider} />

                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>
                      {t("transactionDetail.profitabilityLabel")}
                    </Text>

                    <Text
                      style={[
                        styles.detailValue,
                        {
                          color: colors.success,
                        },
                      ]}
                    >
                      {transaction.profitability || 0}%
                    </Text>
                  </View>
                </>
              )}

              {/* RECORRENTE */}

              {(transaction.type === "receita" ||
                transaction.type === "despesa") && (
                <>
                  <View style={styles.divider} />

                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>
                      {transaction.type === "receita"
                        ? t("transactionDetail.recurringIncome") ||
                          "Receita recorrente"
                        : t("transactionDetail.recurringExpense") ||
                          "Despesa recorrente"}
                    </Text>

                    <Text style={styles.detailValue}>
                      {transaction.isRecurring
                        ? t("transactionDetail.yesText")
                        : t("transactionDetail.noText")}
                    </Text>
                  </View>
                </>
              )}
            </View>

            {/* BOTÕES */}

            <View style={styles.actions}>
              <Button
                title={t("transactionDetail.editButton")}
                onPress={() => setIsEditing(true)}
                style={styles.editButton}
              />

              <Button
                title={t("transactionDetail.deleteButton")}
                variant="error"
                onPress={handleDelete}
                loading={loading}
              />
            </View>
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

    content: {
      paddingBottom: 40,
    },

    header: {
      padding: 24,
      alignItems: "center",
      marginBottom: 24,
    },

    typeLabel: {
      fontSize: 14,
      fontWeight: "600",
      color: colors.textSecondary,
      marginBottom: 8,
    },

    headerAmount: {
      fontSize: 36,
      fontWeight: "bold",
    },

    form: {
      padding: 20,
    },

    label: {
      fontSize: 14,
      fontWeight: "600",
      color: colors.text,
      marginBottom: 12,
    },

    categorySection: {
      marginBottom: 24,
    },

    categoryScrollContainer: {
      maxHeight: 320,
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

      borderRadius: 14,

      alignItems: "center",
      justifyContent: "center",

      borderWidth: 2,
    },

    categoryName: {
      fontSize: 11,
      color: colors.textSecondary,
      marginTop: 8,
      textAlign: "center",
      paddingHorizontal: 4,
    },

    checkboxContainer: {
      flexDirection: "row",
      alignItems: "flex-start",

      backgroundColor: colors.card,

      borderRadius: 12,

      padding: 16,

      gap: 12,

      marginBottom: 24,
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
      color: "#FFFFFF",
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

    details: {
      padding: 20,
    },

    detailCard: {
      backgroundColor: colors.card,

      borderRadius: 16,

      padding: 20,

      marginBottom: 24,

      shadowColor: colors.shadow,
      shadowOffset: {
        width: 0,
        height: 2,
      },

      shadowOpacity: 0.1,
      shadowRadius: 4,

      elevation: 3,
    },

    detailRow: {
      paddingVertical: 12,
    },

    detailLabel: {
      fontSize: 14,
      color: colors.textSecondary,
      marginBottom: 6,
    },

    detailValue: {
      fontSize: 16,
      fontWeight: "600",
      color: colors.text,
    },

    divider: {
      height: 1,
      backgroundColor: colors.border,
    },

    actions: {
      gap: 12,
    },

    saveButton: {
      marginBottom: 12,
    },

    editButton: {
      marginBottom: 12,
    },

    errorText: {
      color: colors.error,
      fontSize: 14,
      textAlign: "center",
      marginTop: 40,
    },

    errorTextSmall: {
      fontSize: 12,
      color: colors.error,
      marginTop: 4,
      marginLeft: 4,
    },
  });

export default TransactionDetailScreen;
