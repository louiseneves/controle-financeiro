/**
 * Tela de Histórico de Transações
 */

import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import {COLORS, formatCurrency, formatDate} from '../../utils';
import useAuthStore from '../../store/authStore';
import useTransactionStore from '../../store/transactionStore';
import TransactionItem from '../../components/common/TransactionItem';

const HistoryScreen = ({navigation}) => {
  const {user} = useAuthStore();
  const {transactions, loadTransactions} = useTransactionStore();
  
  const [refreshing, setRefreshing] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [selectedType, setSelectedType] = useState('all'); // all, receita, despesa, investimento, oferta
  const [sortBy, setSortBy] = useState('date_desc'); // date_desc, date_asc, amount_desc, amount_asc

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
    if (selectedType !== 'all') {
      filtered = filtered.filter(t => t.type === selectedType);
    }

    // Filtro de busca
    if (searchText.trim()) {
      const search = searchText.toLowerCase();
      filtered = filtered.filter(
        t =>
          t.description.toLowerCase().includes(search) ||
          t.category.toLowerCase().includes(search),
      );
    }

    // Ordenação
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'date_desc':
          return new Date(b.date) - new Date(a.date);
        case 'date_asc':
          return new Date(a.date) - new Date(b.date);
        case 'amount_desc':
          return b.amount - a.amount;
        case 'amount_asc':
          return a.amount - b.amount;
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
      .filter(t => t.type === 'receita')
      .reduce((sum, t) => sum + t.amount, 0);

    const expense = filteredTransactions
      .filter(t => t.type === 'despesa')
      .reduce((sum, t) => sum + t.amount, 0);

    const investment = filteredTransactions
      .filter(t => t.type === 'investimento')
      .reduce((sum, t) => sum + t.amount, 0);

    const offer = filteredTransactions
      .filter(t => t.type === 'oferta')
      .reduce((sum, t) => sum + t.amount, 0);

    return {income, expense, investment, offer};
  };

  const totals = calculateTotals();

  const typeFilters = [
    {id: 'all', label: 'Todas', icon: '📋'},
    {id: 'receita', label: 'Receitas', icon: '💰', color: COLORS.success},
    {id: 'despesa', label: 'Despesas', icon: '💸', color: COLORS.error},
    {id: 'investimento', label: 'Investimentos', icon: '📈', color: COLORS.investment},
    {id: 'oferta', label: 'Ofertas', icon: '🙏', color: COLORS.offer},
  ];

  return (
    <View style={styles.container}>
      {/* Barra de busca */}
      <View style={styles.searchBar}>
        <Text style={styles.searchIcon}>🔍</Text>
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar por descrição ou categoria..."
          value={searchText}
          onChangeText={setSearchText}
          placeholderTextColor={COLORS.gray400}
        />
        {searchText.length > 0 && (
          <TouchableOpacity onPress={() => setSearchText('')}>
            <Text style={styles.clearIcon}>✕</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Filtros de tipo */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.filtersContainer}
        contentContainerStyle={styles.filtersContent}>
        {typeFilters.map(filter => (
          <TouchableOpacity
            key={filter.id}
            style={[
              styles.filterChip,
              selectedType === filter.id && styles.filterChipActive,
              selectedType === filter.id &&
                filter.color && {backgroundColor: filter.color + '20'},
            ]}
            onPress={() => setSelectedType(filter.id)}
            activeOpacity={0.7}>
            <Text style={styles.filterIcon}>{filter.icon}</Text>
            <Text
              style={[
                styles.filterLabel,
                selectedType === filter.id && styles.filterLabelActive,
                selectedType === filter.id &&
                  filter.color && {color: filter.color},
              ]}>
              {filter.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Ordenação */}
      <View style={styles.sortContainer}>
        <Text style={styles.sortLabel}>Ordenar:</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.sortButtons}>
          <TouchableOpacity
            style={[
              styles.sortButton,
              sortBy === 'date_desc' && styles.sortButtonActive,
            ]}
            onPress={() => setSortBy('date_desc')}>
            <Text
              style={[
                styles.sortButtonText,
                sortBy === 'date_desc' && styles.sortButtonTextActive,
              ]}>
              Mais recentes
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.sortButton,
              sortBy === 'date_asc' && styles.sortButtonActive,
            ]}
            onPress={() => setSortBy('date_asc')}>
            <Text
              style={[
                styles.sortButtonText,
                sortBy === 'date_asc' && styles.sortButtonTextActive,
              ]}>
              Mais antigas
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.sortButton,
              sortBy === 'amount_desc' && styles.sortButtonActive,
            ]}
            onPress={() => setSortBy('amount_desc')}>
            <Text
              style={[
                styles.sortButtonText,
                sortBy === 'amount_desc' && styles.sortButtonTextActive,
              ]}>
              Maior valor
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.sortButton,
              sortBy === 'amount_asc' && styles.sortButtonActive,
            ]}
            onPress={() => setSortBy('amount_asc')}>
            <Text
              style={[
                styles.sortButtonText,
                sortBy === 'amount_asc' && styles.sortButtonTextActive,
              ]}>
              Menor valor
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </View>

      {/* Resumo dos filtrados */}
      {selectedType !== 'all' && (
        <View style={styles.summaryBar}>
          <Text style={styles.summaryText}>
            {filteredTransactions.length} transaç{filteredTransactions.length === 1 ? 'ão' : 'ões'}
          </Text>
          <Text style={styles.summaryAmount}>
            Total: {formatCurrency(
              selectedType === 'receita' ? totals.income :
              selectedType === 'despesa' ? totals.expense :
              selectedType === 'investimento' ? totals.investment :
              totals.offer
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
        }>
        {filteredTransactions.length > 0 ? (
          filteredTransactions.map(transaction => (
            <TransactionItem
              key={transaction.id}
              transaction={transaction}
              onPress={() =>
                navigation.navigate('TransactionsTab', {
                  screen: 'TransactionDetail',
                  params: {transaction},
                })
              }
            />
          ))
        ) : (
          <View style={styles.emptyState}>
            <Text style={styles.emptyIcon}>📭</Text>
            <Text style={styles.emptyText}>
              {searchText
                ? 'Nenhuma transação encontrada'
                : 'Nenhuma transação nesta categoria'}
            </Text>
            <Text style={styles.emptySubtext}>
              {searchText
                ? 'Tente buscar por outro termo'
                : 'Adicione transações para vê-las aqui'}
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    margin: 16,
    marginBottom: 8,
    paddingHorizontal: 16,
    borderRadius: 12,
    shadowColor: COLORS.black,
    shadowOffset: {width: 0, height: 2},
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
    color: COLORS.text,
  },
  clearIcon: {
    fontSize: 20,
    color: COLORS.gray400,
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
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: COLORS.border,
    gap: 6,
  },
  filterChipActive: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.primary + '10',
  },
  filterIcon: {
    fontSize: 18,
  },
  filterLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.textLight,
  },
  filterLabelActive: {
    color: COLORS.primary,
  },
  sortContainer: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  sortLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 8,
  },
  sortButtons: {
    gap: 8,
  },
  sortButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: COLORS.gray200,
  },
  sortButtonActive: {
    backgroundColor: COLORS.primary,
  },
  sortButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.textLight,
  },
  sortButtonTextActive: {
    color: COLORS.white,
  },
  summaryBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    marginHorizontal: 16,
    marginBottom: 8,
    padding: 12,
    borderRadius: 8,
  },
  summaryText: {
    fontSize: 14,
    color: COLORS.textLight,
  },
  summaryAmount: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.primary,
  },
  listContainer: {
    flex: 1,
  },
  listContent: {
    padding: 16,
    paddingTop: 8,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 60,
    backgroundColor: COLORS.white,
    borderRadius: 12,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: COLORS.textLight,
  },
});

export default HistoryScreen;