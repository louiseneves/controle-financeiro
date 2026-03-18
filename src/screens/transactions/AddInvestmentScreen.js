/**
 * Tela de Adicionar Investimento
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
import { INVESTMENT_CATEGORIES } from "../../utils";
import useAuthStore from "../../store/authStore";
import useTransactionStore from "../../store/transactionStore";
import { isoToBR, brToISO } from "../../utils/helpers/formatters";
import { t } from "../../i18n";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { MaterialIcons } from "@expo/vector-icons";

const AddInvestmentScreen = ({ navigation }) => {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const { user } = useAuthStore();
  const { addTransaction } = useTransactionStore();

  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [profitability, setProfitability] = useState(""); // Rentabilidade % ao ano
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);

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
      setDescriptionError(t("addInvestment.form.description.required"));
      isValid = false;
    }

    if (!amount || parseFloat(amount) <= 0) {
      setAmountError(t("addInvestment.form.amount.invalid"));
      isValid = false;
    }

    if (!category) {
      setCategoryError(t("addInvestment.form.category.required"));
      isValid = false;
    }

    return isValid;
  };

  // Salvar investimento
  const handleSave = async () => {
    if (!validateFields()) return;

    if (!user?.uid) {
      Alert.alert(
        t("addInvestment.alerts.sessionExpired.title"),
        t("addInvestment.alerts.sessionExpired.message"),
      );
      navigation.replace("Login");
      return;
    }

    try {
      setLoading(true);

      // Conversão segura da data
      const parsedDate = new Date(`${date}T00:00:00`);

      if (isNaN(parsedDate.getTime())) {
        Alert.alert(
          t("addInvestment.error.title"),
          t("addInvestment.form.date.invalid"),
        );
        return;
      }

      const transactionData = {
        type: "investimento",
        description: description.trim(),
        amount: parseFloat(amount),
        category,
        profitability: profitability ? parseFloat(profitability) : 0,
        date: parsedDate.toISOString(),
        userId: user.uid,
      };

      const result = await addTransaction(transactionData);

      if (result.success) {
        Alert.alert(
          t("addInvestment.success.title"),
          <MaterialCommunityIcons
            name="checkbox-marked"
            size={24}
            color={colors.success}
          />,
          t("addInvestment.success.message"),
          [
            {
              text: "OK",
              onPress: () => navigation.goBack(),
            },
          ],
        );
      } else {
        Alert.alert(
          t("addInvestment.error.title"),
          result.error || t("addInvestment.error.genric"),
        );
      }
    } catch (error) {
      console.error("Erro ao salvar investimento:", error);
      Alert.alert(
        t("addInvestment.error.title"),
        t("addInvestment.error.save"),
      );
    } finally {
      setLoading(false);
    }
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
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerIcon}>
            <MaterialCommunityIcons
              name="chart-line"
              size={24}
              color={colors.textSecondary}
            />
          </Text>
          <Text style={styles.headerTitle}>{t("addInvestment.title")}</Text>
          <Text style={styles.headerSubtitle}>
            {t("addInvestment.subtitle")}
          </Text>
        </View>

        {/* Formulário */}
        <View style={styles.form}>
          <Input
            label={t("addInvestment.form.description.label")}
            value={description}
            onChangeText={setDescription}
            placeholder={t("addInvestment.form.description.placeholder")}
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
            label={t("addInvestment.form.amount.label")}
            value={amount}
            onChangeText={setAmount}
            placeholder={t("addInvestment.form.amount.placeholder")}
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
            label={t("addInvestment.form.profitability.label")}
            value={profitability}
            onChangeText={setProfitability}
            placeholder={t("addInvestment.form.profitability.placeholder")}
            keyboardType="numeric"
            leftIcon={
              <MaterialCommunityIcons
                name="chart-bar"
                size={24}
                color={colors.textSecondary}
              />
            }
          />

          <Input
            label={t("addInvestment.form.date.label")}
            value={isoToBR(date)}
            onChangeText={(text) => setDate(brToISO(text))}
            placeholder={t("addInvestment.form.date.placeholder")}
            leftIcon={
              <MaterialCommunityIcons
                name="calendar"
                size={24}
                color={colors.textSecondary}
              />
            }
          />

          {/* Tipo de Investimento */}
          <View style={styles.categorySection}>
            <Text style={styles.label}>
              {t("addInvestment.form.category.label")}{" "}
              {categoryError && <Text style={styles.errorText}>*</Text>}
            </Text>
            <View style={styles.categoryGrid}>
              {INVESTMENT_CATEGORIES.map((cat) => (
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
            </View>
            {categoryError && (
              <Text style={styles.errorTextSmall}>{categoryError}</Text>
            )}
          </View>

          {/* Info sobre rentabilidade */}
          {profitability && parseFloat(profitability) > 0 && (
            <View style={styles.infoBox}>
              <Text style={styles.infoIcon}>💡</Text>
              <Text style={styles.infoText}>
                {t("addInvestment.info.estimatedReturn", {
                  profitability,
                  value: `R$ ${((parseFloat(amount) * parseFloat(profitability)) / 100).toFixed(2)}`,
                })}
              </Text>
            </View>
          )}
        </View>

        {/* Botões */}
        <View style={styles.actions}>
          <Button
            title={t("addInvestment.actions.save")}
            onPress={handleSave}
            loading={loading}
            style={styles.saveButton}
          />

          <Button
            title={t("addInvestment.actions.cancel")}
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
      marginBottom: 32,
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
      fontSize: 16,
      color: colors.textSecondary,
      textAlign: "center",
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
      backgroundColor: colors.investment + "10",
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
      color: colors.investment,
      fontWeight: "600",
    },
    infoBox: {
      flexDirection: "row",
      backgroundColor: colors.investment + "10",
      borderRadius: 8,
      padding: 12,
      marginTop: 8,
    },
    infoIcon: {
      fontSize: 20,
      marginRight: 8,
    },
    infoText: {
      flex: 1,
      fontSize: 13,
      color: colors.text,
      lineHeight: 18,
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

export default AddInvestmentScreen;
