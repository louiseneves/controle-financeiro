/**
 * Item de Transação
 */

import React, { useMemo } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import {
  COLORS,
  formatDate,
  INCOME_CATEGORIES,
  EXPENSE_CATEGORIES,
  INVESTMENT_CATEGORIES,
  OFFER_CATEGORIES,
} from "../../utils";
import { useTheme } from "../../context/ThemeContext";
import useSettingsStore from "../../store/settingsStore";
import { t } from "../../i18n";
import { MaterialIcons } from "@expo/vector-icons";

const TransactionItem = ({ transaction, onPress }) => {
  const { colors } = useTheme();
  const formatCurrency = useSettingsStore((state) => state.formatCurrency);
  const styles = useMemo(() => createStyles(colors), [colors]);
  const getTypeColor = (type) => {
    switch (type) {
      case "receita":
        return colors.success;
      case "despesa":
        return colors.error;
      case "investimento":
        return colors.investment;
      case "oferta":
        return colors.offer;
      default:
        // ✅ Usar cor do tema em vez de cor fixa
        return colors.textSecondary;
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case "receita":
        return <MaterialIcons name="add" size={24} color={colors.text} />;
      case "despesa":
        return <MaterialIcons name="remove" size={24} color={colors.text} />;
      case "investimento":
        return (
          <MaterialIcons name="trending-up" size={24} color={colors.text} />
        );
      case "oferta":
        return (
          <MaterialIcons name="hands-pray" size={24} color={colors.text} />
        );
      default:
        return (
          <MaterialIcons name="currency-usd" size={24} color={colors.text} />
        );
    }
  };

  const getTypeLabel = (type) => {
    switch (type) {
      case "receita":
        return t("transaction.income");
      case "despesa":
        return t("transaction.expense");
      case "investimento":
        return t("transaction.investment");
      case "oferta":
        return t("transaction.offering");
      default:
        return "";
    }
  };

  // ✅ Obter nome da categoria baseado no tipo
  const getCategoryName = () => {
    if (!transaction.category) return "";
    const allCategories = {
      receita: INCOME_CATEGORIES,
      despesa: EXPENSE_CATEGORIES,
      investimento: INVESTMENT_CATEGORIES,
      oferta: OFFER_CATEGORIES,
    };
    const categories = allCategories[transaction.type] || [];
    return (
      categories.find((c) => c.id === transaction.category)?.name ||
      transaction.category
    );
  };

  const typeColor = getTypeColor(transaction.type);
  const isNegative = transaction.type !== "receita";

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View
        style={[styles.iconContainer, { backgroundColor: typeColor + "20" }]}
      >
        <Text style={styles.icon}>{getTypeIcon(transaction.type)}</Text>
      </View>

      <View style={styles.content}>
        <Text style={styles.description} numberOfLines={1}>
          {transaction.description}
        </Text>
        <Text style={styles.category}>
          {getTypeLabel(transaction.type)}
          {transaction.category ? ` • ${getCategoryName()}` : ""}
        </Text>
        <Text style={styles.date}>{formatDate(transaction.date)}</Text>
      </View>

      <View style={styles.amountContainer}>
        <Text style={[styles.amount, { color: typeColor }]}>
          {isNegative ? "- " : "+ "}
          {formatCurrency(transaction.amount)}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const createStyles = (colors) =>
  StyleSheet.create({
    container: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: colors.card,
      borderRadius: 12,
      padding: 12,
      marginBottom: 8,
      shadowColor: COLORS.black,
      shadowOffset: {
        width: 0,
        height: 1,
      },
      shadowOpacity: 0.05,
      shadowRadius: 2,
      elevation: 2,
    },
    iconContainer: {
      width: 48,
      height: 48,
      borderRadius: 24,
      justifyContent: "center",
      alignItems: "center",
      marginRight: 12,
    },
    icon: {
      fontSize: 24,
    },
    content: {
      flex: 1,
    },
    description: {
      fontSize: 16,
      fontWeight: "600",
      color: colors.text,
      marginBottom: 2,
    },
    category: {
      fontSize: 13,
      color: colors.textSecondary,
      marginBottom: 2,
    },
    date: {
      fontSize: 12,
      // ✅ Usar cor do tema em vez de cor fixa
      color: colors.textTertiary,
    },
    amountContainer: {
      alignItems: "flex-end",
    },
    amount: {
      fontSize: 16,
      fontWeight: "bold",
    },
  });

export default TransactionItem;
