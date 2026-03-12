/**
 * Atalhos Rápidos
 */

import React, { useMemo } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { COLORS } from "../../utils";
import { useTheme } from "../../context/ThemeContext";
import { t } from "../../i18n";
import { MaterialIcons, MaterialCommunityIcons } from "@expo/vector-icons";

const QuickActions = ({ onPress }) => {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const actions = [
    {
      id: "receita",
      title: t("quickActions.income"),
      icon: <MaterialIcons name="add" size={24} color={colors.text} />,
      color: colors.success,
    },
    {
      id: "despesa",
      title: t("quickActions.expense"),
      icon: <MaterialIcons name="remove" size={24} color={colors.text} />,
      color: colors.error,
    },
    {
      id: "investimento",
      title: t("quickActions.investment"),
      icon: <MaterialIcons name="trending-up" size={24} color={colors.text} />,
      color: colors.investment,
    },
    {
      id: "oferta",
      title: t("quickActions.offer"),
      icon: (
        <MaterialCommunityIcons
          name="hands-pray"
          size={24}
          color={colors.text}
        />
      ),
      color: colors.offer,
    },
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{t("quickActions.title")}</Text>

      <View style={styles.grid}>
        {actions.map((action) => (
          <TouchableOpacity
            key={action.id}
            style={[styles.actionCard, { borderColor: action.color }]}
            onPress={() => onPress(action.id)}
            activeOpacity={0.7}
          >
            <Text style={styles.actionIcon}>{action.icon}</Text>
            <Text style={styles.actionTitle}>{action.title}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const createStyles = (colors) =>
  StyleSheet.create({
    container: {
      marginBottom: 24,
    },
    title: {
      fontSize: 18,
      fontWeight: "600",
      color: colors.text,
      marginBottom: 12,
    },
    grid: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: 12,
    },
    actionCard: {
      flex: 1,
      minWidth: "47%",
      backgroundColor: colors.card,
      borderRadius: 12,
      padding: 16,
      alignItems: "center",
      borderWidth: 2,
      shadowColor: COLORS.black,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
    actionIcon: {
      fontSize: 32,
      marginBottom: 8,
    },
    actionTitle: {
      fontSize: 14,
      fontWeight: "600",
      color: colors.text,
    },
  });

export default QuickActions;
