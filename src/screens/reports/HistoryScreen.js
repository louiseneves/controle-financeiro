/**
 * Tela de Histórico de Transações
 */

import React, { useState, useEffect, useMemo } from "react";
import { useTheme } from "../../context/ThemeContext";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
  TextInput,
} from "react-native";
import { COLORS } from "../../utils";
import useAuthStore from "../../store/authStore";
import useTransactionStore from "../../store/transactionStore";
import TransactionItem from "../../components/common/TransactionItem";
import useSettingsStore from "../../store/settingsStore";
import { t } from "../../i18n";
import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";

const HistoryScreen = ({ navigation }) => {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const { user } = useAuthStore();
  const { transactions, loadTransactions } = useTransactionStore();
  const formatCurrency = useSettingsStore((state) => state.formatCurrency);
  const [refreshing, setRefreshing] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [selectedType, setSelectedType] = useState("all"); // all, receita, despesa, investimento, oferta
  const [sortBy, setSortBy] = useState("date_desc"); // date_desc, date_asc, amount_desc, amount_asc

  useEffect(() => {
    if (user?.uid) {
      loadTransactions(user.uid);
    }
  }, [user]);

  const onRefresh = async () => {
    setRefreshing(true);
    if (user?.uid) {
      await loadTransactions(user.uid);
    }
    setRefreshing(false);
  };

  // Filtrar transações
  const getFilteredTransactions = () => {
    let filtered = [...transactions];

    // Filtro de tipo
    if (selectedType !== "all") {
      filtered = filtered.filter((t) => t.type === selectedType);
    }

    // Filtro de busca
    if (searchText.trim()) {
      const search = searchText.toLowerCase();
      filtered = filtered.filter(
        (t) =>
          t.description.toLowerCase().includes(search) ||
          (t.category || "").toLowerCase().includes(search),
      );
    }

    // Ordenação
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "date_desc":
          // ✅ Validar datas antes de comparar
          return new Date(b.date || 0) - new Date(a.date || 0);
        case "date_asc":
          return new Date(a.date || 0) - new Date(b.date || 0);
        case "amount_desc":
          return Number(b.amount || 0) - Number(a.amount || 0);
        case "amount_asc":
          return Number(a.amount || 0) - Number(b.amount || 0);
        case "desc_asc":
          return (a.description || "").localeCompare(
            b.description || "",
            undefined,
            {
              sensitivity: "base",
            },
          );
        default:
          return 0;
      }
    });

    return filtered;
  };

  const filteredTransactions = getFilteredTransactions();

  // Calcular totais dos filtrados
  const calculateTotals = () => {
    const income = filteredTransactions
      .filter((t) => t.type === "receita")
      .reduce((sum, t) => sum + Number(t.amount || 0), 0);

    const expense = filteredTransactions
      .filter((t) => t.type === "despesa")
      .reduce((sum, t) => sum + Number(t.amount || 0), 0);

    const investment = filteredTransactions
      .filter((t) => t.type === "investimento")
      .reduce((sum, t) => sum + Number(t.amount || 0), 0);

    const offer = filteredTransactions
      .filter((t) => t.type === "oferta")
      .reduce((sum, t) => sum + Number(t.amount || 0), 0);

    return { income, expense, investment, offer };
  };

  const totals = calculateTotals();

  const typeFilters = [
    {
      id: "all",
      label: t("history.filters.all"),
      icon: (
        <MaterialCommunityIcons
          name="file-document"
          size={24}
          color={colors.textSecondary}
        />
      ),
    },
    {
      id: "receita",
      label: t("history.filters.receita"),
      icon: (
        <MaterialCommunityIcons
          name="plus"
          size={24}
          color={colors.textSecondary}
        />
      ),
      color: colors.success,
    },
    {
      id: "despesa",
      label: t("history.filters.despesa"),
      icon: (
        <MaterialCommunityIcons
          name="currency-usd"
          size={24}
          color={colors.textSecondary}
        />
      ),
      color: colors.error,
    },
    {
      id: "investimento",
      label: t("history.filters.investimento"),
      icon: (
        <MaterialCommunityIcons
          name="chart-bar"
          size={24}
          color={colors.textSecondary}
        />
      ),
      color: colors.investment,
    },
    {
      id: "oferta",
      label: t("history.filters.oferta"),
      icon: (
        <MaterialCommunityIcons
          name="hands-pray"
          size={24}
          color={colors.textSecondary}
        />
      ),
      color: colors.offer,
    },
  ];

  return (
    <View style={styles.container}>
      {/* Barra de busca */}
      <View style={styles.searchBar}>
        <Text style={styles.searchIcon}>
          <MaterialIcons name="search" size={24} color={colors.textSecondary} />
        </Text>
        <TextInput
          style={styles.searchInput}
          placeholder={t("history.searchPlaceholder")}
          value={searchText}
          onChangeText={setSearchText}
          // ✅ Usar cor do tema em vez de cor fixa
          placeholderTextColor={colors.placeholder}
        />
        {searchText.length > 0 && (
          <TouchableOpacity onPress={() => setSearchText("")}>
            <Text style={styles.clearIcon}>✕</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Filtros de tipo */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.filtersContainer}
        contentContainerStyle={styles.filtersContent}
      >
        {typeFilters.map((filter) => (
          <TouchableOpacity
            key={filter.id}
            style={[
              styles.filterChip,
              selectedType === filter.id && styles.filterChipActive,
              selectedType === filter.id &&
                filter.color && { backgroundColor: filter.color + "20" },
            ]}
            onPress={() => setSelectedType(filter.id)}
            activeOpacity={0.7}
          >
            <Text style={styles.filterIcon}>{filter.icon}</Text>
            <Text
              style={[
                styles.filterLabel,
                selectedType === filter.id && styles.filterLabelActive,
                selectedType === filter.id &&
                  filter.color && { color: filter.color },
              ]}
            >
              {filter.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Ordenação */}
      <View style={styles.sortContainer}>
        <Text style={styles.sortLabel}>{t("history.sort.label")}</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.sortButtons}
        >
          <TouchableOpacity
            style={[
              styles.sortButton,
              sortBy === "date_desc" && styles.sortButtonActive,
            ]}
            onPress={() => setSortBy("date_desc")}
          >
            <Text
              style={[
                styles.sortButtonText,
                sortBy === "date_desc" && styles.sortButtonTextActive,
              ]}
            >
              {t("history.sort.dateDesc")}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.sortButton,
              sortBy === "date_asc" && styles.sortButtonActive,
            ]}
            onPress={() => setSortBy("date_asc")}
          >
            <Text
              style={[
                styles.sortButtonText,
                sortBy === "date_asc" && styles.sortButtonTextActive,
              ]}
            >
              {t("history.sort.dateAsc")}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.sortButton,
              sortBy === "amount_desc" && styles.sortButtonActive,
            ]}
            onPress={() => setSortBy("amount_desc")}
          >
            <Text
              style={[
                styles.sortButtonText,
                sortBy === "amount_desc" && styles.sortButtonTextActive,
              ]}
            >
              {t("history.sort.amountDesc")}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.sortButton,
              sortBy === "amount_asc" && styles.sortButtonActive,
            ]}
            onPress={() => setSortBy("amount_asc")}
          >
            <Text
              style={[
                styles.sortButtonText,
                sortBy === "amount_asc" && styles.sortButtonTextActive,
              ]}
            >
              {t("history.sort.amountAsc")}
            </Text>
          </TouchableOpacity>
          {/* ✅ NOVO: botão A-Z */}
          <TouchableOpacity
            style={[
              styles.sortButton,
              sortBy === "desc_asc" && styles.sortButtonActive,
            ]}
            onPress={() => setSortBy("desc_asc")}
          >
            <Text
              style={[
                styles.sortButtonText,
                sortBy === "desc_asc" && styles.sortButtonTextActive,
              ]}
            >
              {t("history.sort.descAsc")}
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </View>

      {/* Resumo dos filtrados */}
      {selectedType !== "all" && (
        <View style={styles.summaryBar}>
          <Text style={styles.summaryText}>
            {filteredTransactions.length === 0
              ? t("history.empty.notFound")
              : filteredTransactions.length === 1
                ? t("history.summary.transactions_one", { count: 1 })
                : t("history.summary.transactions_other", {
                    count: filteredTransactions.length,
                  })}
          </Text>
          <Text style={styles.summaryAmount}>
            {t("history.summary.total")}{" "}
            {formatCurrency(
              selectedType === "receita"
                ? totals.income
                : selectedType === "despesa"
                  ? totals.expense
                  : selectedType === "investimento"
                    ? totals.investment
                    : totals.offer,
            )}
          </Text>
        </View>
      )}

      {/* Lista de transações */}
      <ScrollView
        style={styles.listContainer}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {filteredTransactions.length > 0 ? (
          filteredTransactions.map((transaction) => (
            <TransactionItem
              key={transaction.id}
              transaction={transaction}
              onPress={() =>
                navigation.navigate("TransactionsTab", {
                  screen: "TransactionDetail",
                  params: { transaction },
                })
              }
            />
          ))
        ) : (
          <View style={styles.emptyState}>
            <Text style={styles.emptyIcon}>
              <MaterialCommunityIcons
                name="mailbox-open"
                size={24}
                color={colors.textSecondary}
              />
            </Text>
            <Text style={styles.emptyText}>
              {searchText
                ? t("history.empty.notFound", { term: searchText })
                : t("history.empty.noCategory")}
            </Text>
            <Text style={styles.emptySubtext}>
              {searchText
                ? t("history.empty.tryAnother", { term: searchText })
                : t("history.empty.addTransactions")}
            </Text>
          </View>
        )}
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
    searchBar: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: colors.card,
      margin: 16,
      marginBottom: 8,
      paddingHorizontal: 16,
      borderRadius: 12,
      shadowColor: colors.shadow,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
    searchIcon: {
      fontSize: 20,
      marginRight: 8,
    },
    searchInput: {
      flex: 1,
      paddingVertical: 12,
      fontSize: 16,
      color: colors.text,
    },
    clearIcon: {
      fontSize: 20,
      color: colors.textSecondary,
      padding: 4,
    },
    filtersContainer: {
      maxHeight: 60,
      marginBottom: 8,
    },
    filtersContent: {
      paddingHorizontal: 16,
      gap: 8,
    },
    filterChip: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: colors.card,
      paddingHorizontal: 16,
      paddingVertical: 8,
      borderRadius: 20,
      borderWidth: 2,
      borderColor: colors.border,
      gap: 6,
    },
    filterChipActive: {
      borderColor: colors.primary,
      backgroundColor: colors.primary + "10",
    },
    filterIcon: {
      fontSize: 18,
    },
    filterLabel: {
      fontSize: 14,
      fontWeight: "600",
      color: colors.textSecondary,
    },
    filterLabelActive: {
      color: colors.primary,
    },
    sortContainer: {
      paddingHorizontal: 16,
      paddingVertical: 8,
    },
    sortLabel: {
      fontSize: 14,
      fontWeight: "600",
      color: colors.text,
      marginBottom: 8,
    },
    sortButtons: {
      gap: 8,
    },
    sortButton: {
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 16,
      backgroundColor: colors.modeSelectorBg,
    },
    sortButtonActive: {
      backgroundColor: colors.primary,
    },
    sortButtonText: {
      fontSize: 13,
      fontWeight: "600",
      color: colors.textSecondary,
    },
    sortButtonTextActive: {
      color: colors.card,
    },
    summaryBar: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      backgroundColor: colors.card,
      marginHorizontal: 16,
      marginBottom: 8,
      padding: 12,
      borderRadius: 8,
    },
    summaryText: {
      fontSize: 14,
      color: colors.textSecondary,
    },
    summaryAmount: {
      fontSize: 16,
      fontWeight: "600",
      color: colors.primary,
    },
    listContainer: {
      flex: 1,
    },
    listContent: {
      padding: 16,
      paddingTop: 8,
    },
    emptyState: {
      alignItems: "center",
      paddingVertical: 60,
      backgroundColor: colors.card,
      borderRadius: 12,
    },
    emptyIcon: {
      fontSize: 64,
      marginBottom: 16,
    },
    emptyText: {
      fontSize: 18,
      fontWeight: "600",
      color: colors.text,
      marginBottom: 8,
    },
    emptySubtext: {
      fontSize: 14,
      color: colors.textSecondary,
    },
  });

export default HistoryScreen;
