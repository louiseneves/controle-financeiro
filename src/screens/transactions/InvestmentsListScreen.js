/**
 * Tela de Listagem de Investimentos
 */

import React, {useEffect, useState,useMemo} from 'react';
import { useTheme } from '../../context/ThemeContext';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
} from 'react-native';
import {Button} from '../../components/ui';
import {COLORS, formatDate, INVESTMENT_CATEGORIES} from '../../utils';
import useAuthStore from '../../store/authStore';
import useTransactionStore from '../../store/transactionStore';
import useSettingsStore from '../../store/settingsStore';
import { t } from '../../i18n';

const InvestmentsListScreen = ({navigation}) => {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const {user} = useAuthStore();
  const formatCurrency = useSettingsStore(state => state.formatCurrency);
  const {transactions, loadTransactions} = useTransactionStore();
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    if (user?.uid) {
      loadTransactions(user.uid);
    }
  }, [user]);

  // Filtrar apenas investimentos
  const investments = transactions.filter(t => t.type === 'investimento');

  // Calcular totais
  const totalInvested = investments.reduce((sum, inv) => sum + Number(inv.amount || 0), 0);

  // Calcular rendimento estimado
  const calculateEstimatedProfit = investment => {
    if (!investment.profitability || !investment.date) return 0;
    
    const startDate = new Date(investment.date);
    // ✅ Validar se a data é válida
    if (isNaN(startDate.getTime())) return 0;
    
    const now = new Date();
    const monthsDiff = (now.getFullYear() - startDate.getFullYear()) * 12 + 
                       (now.getMonth() - startDate.getMonth());
    
    const yearlyProfit = (Number(investment.amount || 0) * investment.profitability) / 100;
    const monthlyProfit = yearlyProfit / 12;
    
    return monthlyProfit * monthsDiff;
  };

  const totalEstimatedProfit = investments.reduce(
    (sum, inv) => sum + calculateEstimatedProfit(inv),
    0,
  );

  const onRefresh = async () => {
    setRefreshing(true);
    if (user?.uid) {
      await loadTransactions(user.uid);
    }
    setRefreshing(false);
  };

  const handleInvestmentPress = investment => {
    navigation.navigate('TransactionDetail', {transaction: investment});
  };

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.content}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }>
        {/* Resumo */}
        <View style={styles.summaryCard}>
          <Text style={styles.summaryLabel}>{t('investmentsList.totalInvested')}</Text>
          <Text style={styles.summaryAmount}>
            {formatCurrency(totalInvested)}
          </Text>

          <View style={styles.divider} />

          <View style={styles.summaryRow}>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryItemLabel}>{t('investmentsList.estimatedReturn')}</Text>
              <Text style={[styles.summaryItemValue, {color: colors.success}]}>
                {formatCurrency(totalEstimatedProfit)}
              </Text>
            </View>

            <View style={styles.summaryItem}>
              <Text style={styles.summaryItemLabel}>{t('investmentsList.totalAssets')}</Text>
              <Text style={[styles.summaryItemValue, {color: colors.investment}]}>
                {formatCurrency(totalInvested + totalEstimatedProfit)}
              </Text>
            </View>
          </View>
        </View>

        {/* Lista de Investimentos */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>
              {t('investmentsList.myInvestments', {count: investments.length})} ({investments.length})
            </Text>
          </View>

          {investments.length > 0 ? (
            investments.map(investment => {
              const estimatedProfit = calculateEstimatedProfit(investment);
              const currentValue = investment.amount + estimatedProfit;

              return (
                <TouchableOpacity
                  key={investment.id}
                  style={styles.investmentCard}
                  onPress={() => handleInvestmentPress(investment)}
                  activeOpacity={0.7}>
                  <View style={styles.investmentHeader}>
                    <Text style={styles.investmentIcon}>📊</Text>
                    <View style={styles.investmentInfo}>
                      <Text style={styles.investmentDescription}>
                        {investment.description}
                      </Text>
                      <Text style={styles.investmentCategory}>
                        {INVESTMENT_CATEGORIES.find(c => c.id === investment.category)?.name || investment.category}
                      </Text>
                      <Text style={styles.investmentDate}>
                        {t('investmentsList.appliedOn', {date: formatDate(investment.date)})}
                      </Text>
                    </View>
                  </View>

                  <View style={styles.investmentDetails}>
                    <View style={styles.detailRow}>
                      <Text style={styles.detailLabel}>{t('investmentsList.invested')}</Text>
                      <Text style={styles.detailValue}>
                        {formatCurrency(investment.amount)}
                      </Text>
                    </View>

                    {investment.profitability > 0 && (
                      <>
                        <View style={styles.detailRow}>
                          <Text style={styles.detailLabel}>{t('investmentsList.profitability')}</Text>
                          <Text style={styles.detailValue}>
                            {investment.profitability}{t('investmentsList.perYear')}
                          </Text>
                        </View>

                        <View style={styles.detailRow}>
                          <Text style={styles.detailLabel}>{t('investmentsList.earnings')}</Text>
                          <Text style={[styles.detailValue, {color: colors.success}]}>
                            + {formatCurrency(estimatedProfit)}
                          </Text>
                        </View>

                        <View style={styles.highlightRow}>
                          <Text style={styles.highlightLabel}>{t('investmentsList.currentValue')}</Text>
                          <Text style={styles.highlightValue}>
                            {formatCurrency(currentValue)}
                          </Text>
                        </View>
                      </>
                    )}
                  </View>
                </TouchableOpacity>
              );
            })
          ) : (
            <View style={styles.emptyState}>
              <Text style={styles.emptyIcon}>📈</Text>
              <Text style={styles.emptyText}>{t('investmentsList.noInvestments')}</Text>
              <Text style={styles.emptySubtext}>
                {t('investmentsList.emptySubtext')}
              </Text>
            </View>
          )}
        </View>
      </ScrollView>

      {/* Botão Adicionar */}
      <View style={styles.footer}>
        <Button
          title={t('investmentsList.addButton')}
          onPress={() => navigation.navigate('AddInvestment')}
          leftIcon={<Text style={styles.buttonIcon}>📈</Text>}
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
  summaryCard: {
    backgroundColor: colors.investment,
    borderRadius: 16,
    padding: 24,
    marginBottom: 24,
    shadowColor: COLORS.black,
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  summaryLabel: {
    fontSize: 14,
    color: colors.card,
    opacity: 0.9,
    marginBottom: 8,
  },
  summaryAmount: {
    fontSize: 36,
    fontWeight: 'bold',
    color: colors.card,
    marginBottom: 20,
  },
  divider: {
    height: 1,
    backgroundColor: colors.card,
    opacity: 0.3,
    marginBottom: 16,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  summaryItem: {
    flex: 1,
  },
  summaryItemLabel: {
    fontSize: 12,
    color: colors.card,
    opacity: 0.8,
    marginBottom: 4,
  },
  summaryItemValue: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.card,
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
  },
  investmentCard: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: COLORS.black,
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  investmentHeader: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  investmentIcon: {
    fontSize: 32,
    marginRight: 12,
  },
  investmentInfo: {
    flex: 1,
  },
  investmentDescription: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  investmentCategory: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 2,
  },
  investmentDate: {
    fontSize: 12,
    // ✅ Usar cor do tema em vez de cor fixa
    color: colors.textTertiary,
  },
  investmentDetails: {
    gap: 8,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  detailLabel: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
  },
  highlightRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.investment + '10',
    padding: 12,
    borderRadius: 8,
    marginTop: 8,
  },
  highlightLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.text,
  },
  highlightValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.investment,
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

export default InvestmentsListScreen;