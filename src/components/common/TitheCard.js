/**
 * Card de Dízimo
 */

import React, { useMemo } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { calculateTithe } from "../../utils";
import { useTheme } from "../../context/ThemeContext";
import useSettingsStore from "../../store/settingsStore";
import { t } from "../../i18n";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";

const TitheCard = ({ income, paidTithe, onPress }) => {
  const { colors } = useTheme();
  const formatCurrency = useSettingsStore((state) => state.formatCurrency);
  const styles = useMemo(() => createStyles(colors), [colors]);
  const expectedTithe = calculateTithe(income);
  const remaining = Math.max(0, expectedTithe - paidTithe);
  const percentage = expectedTithe > 0 ? (paidTithe / expectedTithe) * 100 : 0;
  const isPaid = paidTithe >= expectedTithe;

  return (
    <TouchableOpacity
      style={[styles.container, isPaid && styles.containerPaid]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <MaterialCommunityIcons
            name="cross"
            size={24}
            color={colors.investment}
          />
          <Text style={styles.title}>{t("titheCard.title")}</Text>
        </View>
        {isPaid && (
          <Text style={styles.badge}>
            <MaterialCommunityIcons
              name="check"
              size={16}
              color={colors.card}
            />
            {t("titheCard.paidBadge")}
          </Text>
        )}
      </View>

      <View style={styles.content}>
        <View style={styles.row}>
          <Text style={styles.label}>{t("titheCard.expected")}</Text>
          <Text style={styles.value}>{formatCurrency(expectedTithe)}</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>{t("titheCard.paid")}</Text>
          <Text style={[styles.value, { color: colors.success }]}>
            {formatCurrency(paidTithe)}
          </Text>
        </View>

        {!isPaid && (
          <View style={styles.row}>
            <Text style={styles.label}>{t("titheCard.remaining")}</Text>
            <Text style={[styles.value, { color: colors.warning }]}>
              {formatCurrency(remaining)}
            </Text>
          </View>
        )}
      </View>

      {/* Barra de progresso */}
      <View style={styles.progressContainer}>
        <View style={styles.progressBar}>
          <View
            style={[
              styles.progressFill,
              {
                width: `${Math.min(percentage, 100)}%`,
                backgroundColor: isPaid ? colors.success : colors.warning,
              },
            ]}
          />
        </View>
        <Text style={styles.progressText}>{Math.round(percentage)}%</Text>
      </View>

      {!isPaid && (
        <Text style={styles.actionText}>{t("titheCard.action")}</Text>
      )}
    </TouchableOpacity>
  );
};

const createStyles = (colors) =>
  StyleSheet.create({
    container: {
      backgroundColor: colors.card,
      borderRadius: 16,
      padding: 20,
      marginBottom: 20,
      borderWidth: 2,
      borderColor: colors.transaction,
      shadowColor: colors.shadow,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
    containerPaid: {
      backgroundColor: colors.success + "10",
      borderColor: colors.success,
    },
    header: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 16,
    },
    titleContainer: {
      flexDirection: "row",
      alignItems: "center",
      gap: 8,
    },
    icon: {
      fontSize: 24,
    },
    title: {
      fontSize: 18,
      fontWeight: "600",
      color: colors.text,
    },
    badge: {
      backgroundColor: colors.success,
      color: colors.card,
      fontSize: 12,
      fontWeight: "600",
      paddingHorizontal: 12,
      paddingVertical: 4,
      borderRadius: 12,
    },
    content: {
      gap: 12,
      marginBottom: 16,
    },
    row: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },
    label: {
      fontSize: 14,
      color: colors.textSecondary,
    },
    value: {
      fontSize: 16,
      fontWeight: "600",
      color: colors.text,
    },
    progressContainer: {
      flexDirection: "row",
      alignItems: "center",
      gap: 12,
      marginBottom: 8,
    },
    progressBar: {
      flex: 1,
      height: 8,
      backgroundColor: colors.modeSelectorBg,
      borderRadius: 4,
      overflow: "hidden",
    },
    progressFill: {
      height: "100%",
      borderRadius: 4,
    },
    progressText: {
      fontSize: 14,
      fontWeight: "600",
      color: colors.text,
      minWidth: 40,
      textAlign: "right",
    },
    actionText: {
      fontSize: 12,
      color: colors.primary,
      textAlign: "center",
      fontWeight: "600",
    },
  });

export default TitheCard;
