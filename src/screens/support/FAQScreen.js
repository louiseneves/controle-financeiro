import React, { useEffect, useState, useMemo } from "react";
import { useTheme } from "../../context/ThemeContext";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
} from "react-native";
import useSupportStore from "../../store/supportStore";
import { t } from "../../i18n";
import { MaterialIcons } from "@expo/vector-icons";

const FAQScreen = () => {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const { faqs, loadFAQs } = useSupportStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(
    t("faqScreen.categories.all"),
  );
  const [expandedId, setExpandedId] = useState(null);

  useEffect(() => {
    loadFAQs();
  }, [loadFAQs]);

  // Categorias únicas
  const categories = [
    t("faqScreen.categories.all"),
    ...new Set(faqs.map((faq) => faq.category)),
  ];

  // Filtrar FAQs
  const filteredFAQs = faqs.filter((faq) => {
    const matchesCategory =
      selectedCategory === t("faqScreen.categories.all") ||
      faq.category === selectedCategory;
    const matchesSearch =
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const toggleExpanded = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>{t("faqScreen.title")}</Text>
        <Text style={styles.headerSubtitle}>{t("faqScreen.subtitle")}</Text>
      </View>

      {/* Busca */}
      <View style={styles.searchSection}>
        <TextInput
          style={styles.searchInput}
          placeholder={t("faqScreen.searchPlaceholder")}
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholderTextColor={colors.placeholder}
        />
      </View>

      {/* Categorias */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.categoriesScroll}
        contentContainerStyle={styles.categoriesContainer}
      >
        {categories.map((category) => (
          <TouchableOpacity
            key={category}
            style={[
              styles.categoryChip,
              selectedCategory === category && styles.categoryChipActive,
            ]}
            onPress={() => setSelectedCategory(category)}
          >
            <Text
              style={[
                styles.categoryChipText,
                selectedCategory === category && styles.categoryChipTextActive,
              ]}
            >
              {category}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Lista de FAQs */}
      <ScrollView style={styles.faqList}>
        {filteredFAQs.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyIcon}>
              <MaterialIcons
                name="search"
                size={40}
                color={colors.textSecondary}
              />
            </Text>
            <Text style={styles.emptyText}>{t("faqScreen.empty.title")}</Text>
            <Text style={styles.emptySubtext}>
              {t("faqScreen.empty.subtitle")}
            </Text>
          </View>
        ) : (
          filteredFAQs.map((faq) => (
            <TouchableOpacity
              key={faq.id}
              style={styles.faqCard}
              onPress={() => toggleExpanded(faq.id)}
              activeOpacity={0.7}
            >
              <View style={styles.faqHeader}>
                <View style={styles.faqCategoryBadge}>
                  <Text style={styles.faqCategoryText}>{faq.category}</Text>
                </View>
                <Text style={styles.faqIcon}>
                  {expandedId === faq.id ? (
                    <MaterialIcons
                      name="arrow-drop-down"
                      size={20}
                      color={colors.textTertiary}
                    />
                  ) : (
                    <MaterialIcons
                      name="arrow-right"
                      size={20}
                      color={colors.textTertiary}
                    />
                  )}
                </Text>
              </View>

              <Text style={styles.faqQuestion}>{faq.question}</Text>

              {expandedId === faq.id && (
                <View style={styles.faqAnswerContainer}>
                  <View style={styles.faqAnswerDivider} />
                  <Text style={styles.faqAnswer}>{faq.answer}</Text>
                </View>
              )}
            </TouchableOpacity>
          ))
        )}

        {/* Rodapé */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>{t("faqScreen.footer.title")}</Text>
          <Text style={styles.footerSubtext}>
            {t("faqScreen.footer.subtitle")}
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
      color: colors.onPrimary,
      marginBottom: 5,
    },
    headerSubtitle: {
      fontSize: 14,
      color: colors.onPrimary + "90",
      opacity: 0.9,
    },
    searchSection: {
      backgroundColor: colors.card,
      padding: 15,
      borderBottomWidth: 1,
      borderBottomColor: "#e0e0e0",
    },
    searchInput: {
      backgroundColor: colors.background,
      borderRadius: 20,
      paddingHorizontal: 20,
      paddingVertical: 12,
      fontSize: 15,
      color: colors.text,
    },
    categoriesScroll: {
      backgroundColor: colors.card,
      borderBottomWidth: 1,
      borderBottomColor: "#e0e0e0",
      maxHeight: 60,
    },
    categoriesContainer: {
      paddingHorizontal: 15,
      paddingVertical: 12,
    },
    categoryChip: {
      backgroundColor: colors.background,
      paddingHorizontal: 16,
      paddingVertical: 8,
      borderRadius: 20,
      marginRight: 10,
    },
    categoryChipActive: {
      backgroundColor: colors.primary,
    },
    categoryChipText: {
      fontSize: 14,
      color: colors.textSecondary,
      fontWeight: "500",
    },
    categoryChipTextActive: {
      color: colors.onPrimary,
    },
    faqList: {
      flex: 1,
      padding: 15,
    },
    faqCard: {
      backgroundColor: colors.card,
      borderRadius: 10,
      padding: 15,
      marginBottom: 12,
      borderWidth: 1,
      borderColor: colors.border,
    },
    faqHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 10,
    },
    faqCategoryBadge: {
      backgroundColor: "#E3F2FD",
      paddingHorizontal: 10,
      paddingVertical: 4,
      borderRadius: 12,
    },
    faqCategoryText: {
      fontSize: 11,
      color: colors.primary,
      fontWeight: "600",
    },
    faqIcon: {
      fontSize: 12,
      color: colors.textTertiary,
    },
    faqQuestion: {
      fontSize: 16,
      fontWeight: "600",
      color: colors.text,
      lineHeight: 22,
    },
    faqAnswerContainer: {
      marginTop: 12,
    },
    faqAnswerDivider: {
      height: 1,
      backgroundColor: colors.surface,
      marginBottom: 12,
    },
    faqAnswer: {
      fontSize: 14,
      color: colors.textSecondary,
      lineHeight: 22,
    },
    emptyState: {
      alignItems: "center",
      paddingVertical: 60,
    },
    emptyIcon: {
      fontSize: 60,
      marginBottom: 15,
    },
    emptyText: {
      fontSize: 16,
      fontWeight: "600",
      color: colors.textSecondary,
      marginBottom: 5,
    },
    emptySubtext: {
      fontSize: 14,
      color: colors.textTertiary,
    },
    footer: {
      backgroundColor: "#FFF3E0",
      padding: 20,
      borderRadius: 10,
      marginTop: 20,
      marginBottom: 30,
      alignItems: "center",
    },
    footerText: {
      fontSize: 15,
      fontWeight: "600",
      color: "#E65100",
      marginBottom: 5,
    },
    footerSubtext: {
      fontSize: 13,
      color: "#BF360C",
      textAlign: "center",
    },
  });

export default FAQScreen;
