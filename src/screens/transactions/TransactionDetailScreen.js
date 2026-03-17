/**
 * Tela de Detalhes/Edição de Transação
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
import {
  COLORS,
  INCOME_CATEGORIES,
  EXPENSE_CATEGORIES,
  INVESTMENT_CATEGORIES,
  OFFER_CATEGORIES,
  formatDate,
} from "../../utils";
import useTransactionStore from "../../store/transactionStore";
import useSettingsStore from "../../store/settingsStore";
import { t } from "../../i18n";
import { MaterialCommunityIcons } from "@expo/vector-icons";

const TransactionDetailScreen = ({ navigation, route }) => {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const { transaction } = route.params || {};

  // Protegção contra transaction undefined
  if (!transaction) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>{t("transactionDetail.notFound")}</Text>
      </View>
    );
  }

  const formatCurrency = useSettingsStore((state) => state.formatCurrency);
  const { updateTransaction, deleteTransaction } = useTransactionStore();

  const [isEditing, setIsEditing] = useState(false);
  const [description, setDescription] = useState(transaction.description);
  const [amount, setAmount] = useState(transaction.amount.toString());
  const [category, setCategory] = useState(transaction.category);
  const [date, setDate] = useState(() => {
    if (transaction.date) {
      return transaction.date.split("T")[0];
    }
    return new Date().toISOString().split("T")[0];
  });
  const [isRecurring, setIsRecurring] = useState(
    transaction.isRecurring || false,
  );

  const [descriptionError, setDescriptionError] = useState("");
  const [amountError, setAmountError] = useState("");
  const [categoryError, setCategoryError] = useState("");
  const [loading, setLoading] = useState(false);

  // Obter categorias baseado no tipo
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

  // ✅ Obter nome da categoria
  const getCategoryName = () => {
    const categories = getCategories();
    return (
      categories.find((c) => c.id === transaction.category)?.name ||
      transaction.category
    );
  };

  const categories = getCategories();

  // Obter cor do tipo usando objeto de transações do tema
  const getTypeColor = () => {
    const map = {
      receita: colors.transaction?.income || colors.success,
      despesa: colors.transaction?.expense || colors.error,
      investimento: colors.transaction?.investment || colors.primary,
      oferta: colors.transaction?.offer || colors.warning,
    };
    return map[transaction.type] || colors.textSecondary;
  };

  const typeColor = getTypeColor();

  // Validar campos
  const validateFields = () => {
    let isValid = true;

    setDescriptionError("");
    setAmountError("");
    setCategoryError("");

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

    return isValid;
  };

  // Salvar edição
  const handleSave = async () => {
    if (!validateFields()) return;

    try {
      setLoading(true);

      const updatedData = {
        description: description.trim(),
        amount: parseFloat(amount),
        category,
        date: new Date(date).toISOString(),
        isRecurring,
      };

      const result = await updateTransaction(transaction.id, updatedData);

      if (result.success) {
        Alert.alert(
          t("transactionDetail.successTitle"),
          <MaterialCommunityIcons
            name="checkbox-marked"
            size={24}
            color={colors.text}
          />,
          t("transactionDetail.updateSuccess"),
          [
            {
              text: "OK",
              onPress: () => {
                setIsEditing(false);
                navigation.goBack();
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
      console.error(t("transactionDetail.updateError"), error);
      Alert.alert(
        t("transactionDetail.errorTitle"),
        t("transactionDetail.updateFailed"),
      );
    } finally {
      setLoading(false);
    }
  };

  // Deletar transação
  const handleDelete = () => {
    Alert.alert(
      t("transactionDetail.deleteConfirmTitle"),
      t("transactionDetail.deleteConfirm"),
      [
        { text: t("transactionDetail.cancelButton"), style: "cancel" },
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
                  <MaterialCommunityIcons
                    name="checkbox-marked"
                    size={24}
                    color={colors.text}
                  />,
                  t("transactionDetail.deleteSuccess"),
                  [
                    {
                      text: "OK",
                      onPress: () => navigation.goBack(),
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
              console.error(t("transactionDetail.deleteError"), error);
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

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
      >
        {/* Header com info do tipo */}
        <View style={[styles.header, { backgroundColor: typeColor + "20" }]}>
          <Text style={styles.typeLabel}>
            {/* ✅ Proteger contra transaction.type undefined */}
            {(transaction?.type || "TRANSAÇÃO").toUpperCase()}
          </Text>
          {!isEditing && (
            <Text style={[styles.headerAmount, { color: typeColor }]}>
              {formatCurrency(transaction.amount)}
            </Text>
          )}
        </View>

        {isEditing ? (
          // Modo de Edição
          <View style={styles.form}>
            <Input
              label={t("transactionDetail.descriptionLabel")}
              value={description}
              onChangeText={setDescription}
              placeholder={t("transactionDetail.descriptionLabel")}
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
              label={t("transactionDetail.amountLabel")}
              value={amount}
              onChangeText={setAmount}
              placeholder="0,00"
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
              label={t("transactionDetail.dateLabel")}
              value={date}
              onChangeText={setDate}
              placeholder="YYYY-MM-DD"
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
                {t("transactionDetail.categoryLabel")}{" "}
                {categoryError && <Text style={styles.errorText}>*</Text>}
              </Text>
              <ScrollView
                style={styles.categoryScrollContainer}
                contentContainerStyle={styles.categoryGrid}
                showsVerticalScrollIndicator={true}
                nestedScrollEnabled={true}
                scrollEnabled={true}
              >
                {categories.map((cat) => (
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
                    <Text style={styles.categoryIcon}>{cat.icon}</Text>
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

            {/* Recorrente */}
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
                  {t("transactionDetail.recurringLabel")}
                </Text>
                <Text style={styles.checkboxDescription}>
                  {t("transactionDetail.recurringDescription")}
                </Text>
              </View>
            </TouchableOpacity>

            {/* Botões de edição */}
            <View style={styles.actions}>
              <Button
                title={t("transactionDetail.saveButton")}
                onPress={handleSave}
                loading={loading}
                style={styles.saveButton}
              />
              <Button
                title={t("transactionDetail.cancelButton")}
                onPress={() => {
                  setIsEditing(false);
                  // Resetar valores
                  setDescription(transaction.description);
                  setAmount(transaction.amount.toString());
                  setCategory(transaction.category);
                  setDate(transaction.date.split("T")[0]);
                  setIsRecurring(transaction.isRecurring || false);
                }}
                variant="outline"
              />
            </View>
          </View>
        ) : (
          // Modo de Visualização
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

              <View style={styles.divider} />

              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>
                  {t("transactionDetail.recurringLabel")}
                </Text>
                <Text style={styles.detailValue}>
                  {transaction.isRecurring
                    ? t("transactionDetail.yesText")
                    : t("transactionDetail.noText")}
                </Text>
              </View>
            </View>

            {/* Botões de ação */}
            <View style={styles.actions}>
              <Button
                title={t("transactionDetail.editButton")}
                onPress={() => setIsEditing(true)}
                variant="primary"
                style={styles.editButton}
              />
              <Button
                title={t("transactionDetail.deleteButton")}
                onPress={handleDelete}
                variant="error"
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
      fontWeight: "600",
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
    details: {
      padding: 20,
    },
    detailCard: {
      backgroundColor: colors.card,
      borderRadius: 16,
      padding: 20,
      marginBottom: 24,
      shadowColor: COLORS.black,
      shadowOffset: { width: 0, height: 2 },
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
  });

export default TransactionDetailScreen;
