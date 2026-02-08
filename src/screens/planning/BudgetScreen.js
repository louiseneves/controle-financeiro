/**
 * Tela de Planejamento Mensal (Orçamento)
 */

import React, {useEffect, useState, useMemo} from 'react';
import { useTheme } from '../../context/ThemeContext';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
  Alert,
} from 'react-native';
import {Button} from '../../components/ui';
import {COLORS, EXPENSE_CATEGORIES} from '../../utils';
import useAuthStore from '../../store/authStore';
import useBudgetStore from '../../store/budgetStore';
import useTransactionStore from '../../store/transactionStore';
import { formatMonthYear } from '../../utils/helpers/formatters';
import useSettingsStore from '../../store/settingsStore';

const BudgetScreen = ({navigation}) => {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const {user} = useAuthStore();
  const {budgets, loadBudgets, getCurrentMonthBudget} = useBudgetStore();
  const { getCurrentMonthTransactions } = useTransactionStore();
  const formatCurrency = useSettingsStore(state => state.formatCurrency);
  
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    if (user?.uid) {
      loadBudgets(user.uid);
    }
  }, [user]);

  const currentBudget = getCurrentMonthBudget();
  const monthTransactions = getCurrentMonthTransactions();

  const onRefresh = async () => {
    setRefreshing(true);
    if (user?.uid) {
      await loadBudgets(user.uid);
    }
    setRefreshing(false);
  };

  // Calcular gastos por categoria
  const getSpentByCategory = category => {
    return monthTransactions
      .filter(t => t.type === 'despesa' && t.category === category)
      .reduce((sum, t) => sum + t.amount, 0);
  };

  // Calcular totais
  const calculateTotals = () => {
    if (!currentBudget || !currentBudget.categories) {
      return {totalBudget: 0, totalSpent: 0, remaining: 0};
    }

    const totalBudget = Object.values(currentBudget.categories).reduce(
      (sum, amount) => sum + amount,
      0,
    );

    const totalSpent = Object.keys(currentBudget.categories).reduce(
      (sum, category) => sum + getSpentByCategory(category),
      0,
    );

    const remaining = totalBudget - totalSpent;

    return {totalBudget, totalSpent, remaining};
  };

  const totals = calculateTotals();

  const handleCreateBudget = () => {
    navigation.navigate('CreateBudget');
  };

  const handleEditBudget = () => {
    if (currentBudget) {
      navigation.navigate('EditBudget', {budget: currentBudget});
    }
  };

  const getCurrentMonth = () => {
  return formatMonthYear(new Date());
};


  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.content}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Orçamento Mensal</Text>
          <Text style={styles.headerSubtitle}>{getCurrentMonth()}</Text>
        </View>

        {currentBudget ? (
          <>
            {/* Resumo Total */}
            <View style={styles.summaryCard}>
              <View style={styles.summaryHeader}>
                <Text style={styles.summaryLabel}>Orçamento Total</Text>
                <TouchableOpacity onPress={handleEditBudget}>
                  <Text style={styles.editButton}>✏️ Editar</Text>
                </TouchableOpacity>
              </View>

              <Text style={styles.summaryAmount}>
                {formatCurrency(totals.totalBudget)}
              </Text>

              <View style={styles.summaryDetails}>
                <View style={styles.summaryItem}>
                  <Text style={styles.summaryItemLabel}>Gasto</Text>
                  <Text style={[styles.summaryItemValue, {color: colors.error}]}>
                    {formatCurrency(totals.totalSpent)}
                  </Text>
                </View>

                <View style={styles.summaryDivider} />

                <View style={styles.summaryItem}>
                  <Text style={styles.summaryItemLabel}>Disponível</Text>
                  <Text
                    style={[
                      styles.summaryItemValue,
                      {color: totals.remaining >= 0 ? colors.success : colors.error},
                    ]}>
                    {formatCurrency(totals.remaining)}
                  </Text>
                </View>
              </View>

              {/* Barra de progresso total */}
              <View style={styles.totalProgress}>
                <View style={styles.progressBar}>
                  <View
                    style={[
                      styles.progressFill,
                      {
                        width: `${Math.min(
                          (totals.totalSpent / totals.totalBudget) * 100,
                          100,
                        )}%`,
                        backgroundColor:
                          totals.totalSpent > totals.totalBudget
                            ? colors.error
                            : totals.totalSpent > totals.totalBudget * 0.8
                            ? colors.warning
                            : colors.success,
                      },
                    ]}
                  />
                </View>
                <Text style={styles.progressPercentage}>
                  {((totals.totalSpent / totals.totalBudget) * 100).toFixed(0)}%
                </Text>
              </View>
            </View>

            {/* Orçamento por Categoria */}
            <View style={styles.categoriesSection}>
              <Text style={styles.sectionTitle}>Orçamento por Categoria</Text>

              {Object.entries(currentBudget.categories).map(
                ([category, budgetAmount]) => {
                  const spent = getSpentByCategory(category);
                  const remaining = budgetAmount - spent;
                  const percentage = (spent / budgetAmount) * 100;

                  const categoryInfo = EXPENSE_CATEGORIES.find(c => c.id === category);

                  return (
                    <View key={category} style={styles.categoryCard}>
                      <View style={styles.categoryHeader}>
                        <View style={styles.categoryTitleRow}>
                          <Text style={styles.categoryIcon}>
                            {categoryInfo?.icon || '📦'}
                          </Text>
                          <Text style={styles.categoryName}>
                            {categoryInfo?.name || category}
                          </Text>
                        </View>
                        {percentage >= 100 && (
                          <View style={styles.alertBadge}>
                            <Text style={styles.alertText}>⚠️ Limite</Text>
                          </View>
                        )}
                      </View>

                      <View style={styles.categoryAmounts}>
                        <Text style={styles.categorySpent}>
                          {formatCurrency(spent)}
                        </Text>
                        <Text style={styles.categoryBudget}>
                          de {formatCurrency(budgetAmount)}
                        </Text>
                      </View>

                      <View style={styles.categoryProgress}>
                        <View style={styles.progressBar}>
                          <View
                            style={[
                              styles.progressFill,
                              {
                                width: `${Math.min(percentage, 100)}%`,
                                backgroundColor:
                                  percentage >= 100
                                    ? colors.error
                                    : percentage >= 80
                                    ? colors.warning
                                    : colors.success,
                              },
                            ]}
                          />
                        </View>
                        <Text style={styles.categoryPercentage}>
                          {percentage.toFixed(0)}%
                        </Text>
                      </View>

                      <View style={styles.categoryFooter}>
                        <Text
                          style={[
                            styles.categoryRemaining,
                            {color: remaining >= 0 ? colors.success : colors.error},
                          ]}>
                          {remaining >= 0 ? 'Disponível: ' : 'Excedido: '}
                          {formatCurrency(Math.abs(remaining))}
                        </Text>
                      </View>

                      {/* Sugestão de economia */}
                      {percentage >= 80 && percentage < 100 && (
                        <View style={styles.suggestionBox}>
                          <Text style={styles.suggestionIcon}>💡</Text>
                          <Text style={styles.suggestionText}>
                            Você está próximo do limite! Considere reduzir gastos nesta
                            categoria.
                          </Text>
                        </View>
                      )}

                      {percentage >= 100 && (
                        <View style={[styles.suggestionBox, {backgroundColor: colors.error + '10'}]}>
                          <Text style={styles.suggestionIcon}>🚨</Text>
                          <Text style={styles.suggestionText}>
                            Você ultrapassou o orçamento desta categoria em{' '}
                            {formatCurrency(Math.abs(remaining))}!
                          </Text>
                        </View>
                      )}
                    </View>
                  );
                },
              )}
            </View>
          </>
        ) : (
          // Estado vazio
          <View style={styles.emptyState}>
            <Text style={styles.emptyIcon}>📊</Text>
            <Text style={styles.emptyText}>Sem orçamento para este mês</Text>
            <Text style={styles.emptySubtext}>
              Crie um orçamento mensal para acompanhar seus gastos
            </Text>
          </View>
        )}
      </ScrollView>

      {/* Botão de ação */}
      <View style={styles.footer}>
        <Button
          title={currentBudget ? 'Editar Orçamento' : 'Criar Orçamento'}
          onPress={currentBudget ? handleEditBudget : handleCreateBudget}
          leftIcon={<Text style={styles.buttonIcon}>
            {currentBudget ? '✏️' : '📊'}
          </Text>}
        />
      </View>
    </View>
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
    paddingBottom: 100,
  },
  header: {
    alignItems: 'center',
    marginBottom: 24,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 16,
    color: colors.textSecondary,
  },
  summaryCard: {
    backgroundColor: colors.primary,
    borderRadius: 16,
    padding: 24,
    marginBottom: 24,
    shadowColor: COLORS.black,
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  summaryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  summaryLabel: {
    fontSize: 14,
    color: colors.card,
    opacity: 0.9,
  },
  editButton: {
    fontSize: 14,
    color: colors.card,
    fontWeight: '600',
  },
  summaryAmount: {
    fontSize: 36,
    fontWeight: 'bold',
    color: colors.card,
    marginBottom: 20,
  },
  summaryDetails: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 16,
  },
  summaryItem: {
    flex: 1,
    alignItems: 'center',
  },
  summaryItemLabel: {
    fontSize: 13,
    color: colors.card,
    opacity: 0.8,
    marginBottom: 4,
  },
  summaryItemValue: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.card,
  },
  summaryDivider: {
    width: 1,
    height: 40,
    backgroundColor: colors.card,
    opacity: 0.3,
  },
  totalProgress: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  progressBar: {
    flex: 1,
    height: 8,
    backgroundColor: colors.card + '30',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  progressPercentage: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.card,
    minWidth: 40,
    textAlign: 'right',
  },
  categoriesSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 12,
  },
  categoryCard: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: COLORS.black,
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  categoryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  categoryTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  categoryIcon: {
    fontSize: 24,
  },
  categoryName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  alertBadge: {
    backgroundColor: colors.error,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  alertText: {
    fontSize: 11,
    color: colors.card,
    fontWeight: '600',
  },
  categoryAmounts: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    marginBottom: 8,
  },
  categorySpent: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,
  },
  categoryBudget: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  categoryProgress: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 8,
  },
  categoryPercentage: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.text,
    minWidth: 40,
    textAlign: 'right',
  },
  categoryFooter: {
    marginTop: 4,
  },
  categoryRemaining: {
    fontSize: 14,
    fontWeight: '600',
  },
  suggestionBox: {
    flexDirection: 'row',
    backgroundColor: colors.warning + '10',
    borderRadius: 8,
    padding: 12,
    marginTop: 12,
    gap: 8,
  },
  suggestionIcon: {
    fontSize: 16,
  },
  suggestionText: {
    flex: 1,
    fontSize: 13,
    color: colors.text,
    lineHeight: 18,
  },
  emptyState: {
    alignItems: 'center',
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
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
    backgroundColor: colors.card,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  buttonIcon: {
    fontSize: 20,
    marginRight: 8,
  },
});

export default BudgetScreen;