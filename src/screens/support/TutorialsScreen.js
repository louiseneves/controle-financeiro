import React, { useState, useMemo } from "react";
import { useTheme } from "../../context/ThemeContext";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { t } from "../../i18n";
import { MaterialIcons, Feather } from "@expo/vector-icons";

const { width } = Dimensions.get("window");

const TutorialsScreen = () => {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const [expandedId, setExpandedId] = useState(null);

  const tutorials = t("tutorialsScreen.categories", { returnObjects: true });
  const toggleExpanded = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>
          {t("tutorialsScreen.header.title")}
        </Text>
        <Text style={styles.headerSubtitle}>
          {t("tutorialsScreen.header.subtitle")}
        </Text>
      </View>

      <ScrollView style={styles.content}>
        {tutorials.map((category) => (
          <View key={category.id} style={styles.categorySection}>
            <TouchableOpacity
              style={[
                styles.categoryHeader,
                { borderLeftColor: category.color },
              ]}
              onPress={() => toggleExpanded(category.id)}
              activeOpacity={0.7}
            >
              <View style={styles.categoryHeaderLeft}>
                <Text style={styles.categoryIcon}>{category.icon}</Text>
                <View>
                  <Text style={styles.categoryTitle}>{category.category}</Text>
                  <Text style={styles.categoryCount}>
                    {category.items.length} tutoriais
                  </Text>
                </View>
              </View>
              <Text style={styles.expandIcon}>
                {expandedId === category.id ? (
                  <MaterialIcons
                    name="arrow-drop-down"
                    size={20}
                    color={colors.text}
                  />
                ) : (
                  <MaterialIcons
                    name="arrow-right"
                    size={20}
                    color={colors.text}
                  />
                )}
              </Text>
            </TouchableOpacity>

            {expandedId === category.id && (
              <View style={styles.tutorialsContainer}>
                {category.items.map((tutorial, index) => (
                  <View key={index} style={styles.tutorialCard}>
                    <Text style={styles.tutorialTitle}>{tutorial.title}</Text>
                    <View style={styles.stepsContainer}>
                      {tutorial.steps.map((step, stepIndex) => (
                        <View key={stepIndex} style={styles.stepRow}>
                          {step.startsWith(
                            <MaterialIcons
                              name="check-circle"
                              size={16}
                              color={colors.text}
                            />,
                          ) ||
                          step.startsWith(
                            <MaterialIcons
                              name="edit"
                              size={16}
                              color={colors.text}
                            />,
                          ) ||
                          step.startsWith(
                            <Feather
                              name="target"
                              size={16}
                              color={colors.text}
                            />,
                          ) ||
                          step.startsWith(
                            <MaterialIcons
                              name="attach-money"
                              size={16}
                              color={colors.text}
                            />,
                          ) ||
                          step.startsWith(
                            <MaterialIcons
                              name="bar-chart"
                              size={16}
                              color={colors.text}
                            />,
                          ) ||
                          step.startsWith(
                            <MaterialIcons
                              name="warning"
                              size={16}
                              color={colors.text}
                            />,
                          ) ||
                          step.startsWith(
                            <MaterialIcons
                              name="cloud"
                              size={16}
                              color={colors.text}
                            />,
                          ) ||
                          step.startsWith(
                            <MaterialIcons
                              name="phone-android"
                              size={16}
                              color={colors.text}
                            />,
                          ) ||
                          step.startsWith(
                            <MaterialIcons
                              name="credit-card"
                              size={16}
                              color={colors.text}
                            />,
                          ) ||
                          step.startsWith(
                            <MaterialIcons
                              name="refresh"
                              size={16}
                              color={colors.text}
                            />,
                          ) ||
                          step.startsWith(
                            <MaterialIcons
                              name="search"
                              size={16}
                              color={colors.text}
                            />,
                          ) ||
                          step.startsWith(
                            <MaterialIcons
                              name="star"
                              size={16}
                              color={colors.text}
                            />,
                          ) ||
                          step.startsWith(
                            <MaterialIcons
                              name="calendar-month"
                              size={16}
                              color={colors.text}
                            />,
                          ) ? (
                            <Text style={styles.stepText}>{step}</Text>
                          ) : (
                            <>
                              <View
                                style={[
                                  styles.stepBullet,
                                  { backgroundColor: category.color },
                                ]}
                              />
                              <Text style={styles.stepText}>{step}</Text>
                            </>
                          )}
                        </View>
                      ))}
                    </View>
                  </View>
                ))}
              </View>
            )}
          </View>
        ))}

        {/* Rodapé */}
        <View style={styles.footer}>
          <Text style={styles.footerTitle}>
            {t("tutorialsScreen.footer.title")}
          </Text>
          <Text style={styles.footerText}>
            {t("tutorialsScreen.footer.text")}
          </Text>
        </View>
      </ScrollView>
    </View>
  );
};

const createStyles = (colors) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    header: {
      backgroundColor: colors.primary,
      padding: 20,
      paddingTop: 40,
    },
    headerTitle: {
      fontSize: 24,
      fontWeight: "bold",
      color: "#fff",
      marginBottom: 5,
    },
    headerSubtitle: {
      fontSize: 14,
      color: "#fff",
      opacity: 0.9,
    },
    content: {
      flex: 1,
    },
    categorySection: {
      marginTop: 15,
    },
    categoryHeader: {
      backgroundColor: colors.card,
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      padding: 20,
      borderLeftWidth: 4,
    },
    categoryHeaderLeft: {
      flexDirection: "row",
      alignItems: "center",
      flex: 1,
    },
    categoryIcon: {
      fontSize: 32,
      marginRight: 15,
    },
    categoryTitle: {
      fontSize: 18,
      fontWeight: "bold",
      color: colors.text,
      marginBottom: 2,
    },
    categoryCount: {
      fontSize: 13,
      color: colors.textSecondary,
    },
    expandIcon: {
      fontSize: 16,
      color: colors.textTertiary,
      marginLeft: 10,
    },
    tutorialsContainer: {
      backgroundColor: colors.backgroundSecondary,
      paddingHorizontal: 15,
      paddingVertical: 10,
    },
    tutorialCard: {
      backgroundColor: colors.card,
      borderRadius: 10,
      padding: 15,
      marginBottom: 12,
      borderWidth: 1,
      borderColor: colors.border,
    },
    tutorialTitle: {
      fontSize: 16,
      fontWeight: "600",
      color: colors.text,
      marginBottom: 12,
    },
    stepsContainer: {
      gap: 8,
    },
    stepRow: {
      flexDirection: "row",
      alignItems: "flex-start",
    },
    stepBullet: {
      width: 6,
      height: 6,
      borderRadius: 3,
      marginTop: 7,
      marginRight: 10,
    },
    stepText: {
      flex: 1,
      fontSize: 14,
      color: colors.textSecondary,
      lineHeight: 20,
    },
    footer: {
      backgroundColor: "#E3F2FD",
      padding: 20,
      margin: 15,
      marginBottom: 30,
      borderRadius: 10,
      borderWidth: 1,
      bordercolor: colors.primary,
    },
    footerTitle: {
      fontSize: 16,
      fontWeight: "bold",
      color: "#1976D2",
      marginBottom: 8,
    },
    footerText: {
      fontSize: 14,
      color: "#1565C0",
      lineHeight: 20,
    },
  });

export default TutorialsScreen;
