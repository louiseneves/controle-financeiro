/**
 * Tela de Listagem de Investimentos
 */

import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
} from 'react-native';
import {Button} from '../../components/ui';
import {COLORS, formatCurrency, formatDate} from '../../utils';
import useAuthStore from '../../store/authStore';
import useTransactionStore from '../../store/transactionStore';

const InvestmentsListScreen = ({navigation}) => {
  const {user} = useAuthStore();
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
  const totalInvested = investments.reduce((sum, inv) => sum + inv.amount, 0);

  // Calcular rendimento estimado
  const calculateEstimatedProfit = investment => {
    if (!investment.profitability) return 0;
    
    const startDate = new Date(investment.date);
    const now = new Date();
    const monthsDiff = (now.getFullYear() - startDate.getFullYear()) * 12 + 
                       (now.getMonth() - startDate.getMonth());
    
    const yearlyProfit = (investment.amount * investment.profitability) / 100;
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
          <Text style={styles.summaryLabel}>Total Investido</Text>
          <Text style={styles.summaryAmount}>
            {formatCurrency(totalInvested)}
          </Text>

          <View style={styles.divider} />

          <View style={styles.summaryRow}>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryItemLabel}>Rendimento Estimado</Text>
              <Text style={[styles.summaryItemValue, {color: COLORS.success}]}>
                {formatCurrency(totalEstimatedProfit)}
              </Text>
            </View>

            <View style={styles.summaryItem}>
              <Text style={styles.summaryItemLabel}>Patrimônio Total</Text>
              <Text style={[styles.summaryItemValue, {color: COLORS.investment}]}>
                {formatCurrency(totalInvested + totalEstimatedProfit)}
              </Text>
            </View>
          </View>
        </View>

        {/* Lista de Investimentos */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>
              Meus Investimentos ({investments.length})
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
                        {investment.category}
                      </Text>
                      <Text style={styles.investmentDate}>
                        Aplicado em {formatDate(investment.date)}
                      </Text>
                    </View>
                  </View>

                  <View style={styles.investmentDetails}>
                    <View style={styles.detailRow}>
                      <Text style={styles.detailLabel}>Investido:</Text>
                      <Text style={styles.detailValue}>
                        {formatCurrency(investment.amount)}
                      </Text>
                    </View>

                    {investment.profitability > 0 && (
                      <>
                        <View style={styles.detailRow}>
                          <Text style={styles.detailLabel}>Rentabilidade:</Text>
                          <Text style={styles.detailValue}>
                            {investment.profitability}% a.a.
                          </Text>
                        </View>

                        <View style={styles.detailRow}>
                          <Text style={styles.detailLabel}>Rendimento:</Text>
                          <Text style={[styles.detailValue, {color: COLORS.success}]}>
                            + {formatCurrency(estimatedProfit)}
                          </Text>
                        </View>

                        <View style={styles.highlightRow}>
                          <Text style={styles.highlightLabel}>Valor Atual:</Text>
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
              <Text style={styles.emptyText}>Nenhum investimento registrado</Text>
              <Text style={styles.emptySubtext}>
                Comece a investir e acompanhe seus rendimentos
              </Text>
            </View>
          )}
        </View>
      </ScrollView>

      {/* Botão Adicionar */}
      <View style={styles.footer}>
        <Button
          title="Adicionar Investimento"
          onPress={() => navigation.navigate('AddInvestment')}
          leftIcon={<Text style={styles.buttonIcon}>📈</Text>}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    padding: 20,
    paddingBottom: 100,
  },
  summaryCard: {
    backgroundColor: COLORS.investment,
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
    color: COLORS.white,
    opacity: 0.9,
    marginBottom: 8,
  },
  summaryAmount: {
    fontSize: 36,
    fontWeight: 'bold',
    color: COLORS.white,
    marginBottom: 20,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.white,
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
    color: COLORS.white,
    opacity: 0.8,
    marginBottom: 4,
  },
  summaryItemValue: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.white,
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
    color: COLORS.text,
  },
  investmentCard: {
    backgroundColor: COLORS.white,
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
    color: COLORS.text,
    marginBottom: 4,
  },
  investmentCategory: {
    fontSize: 14,
    color: COLORS.textLight,
    marginBottom: 2,
  },
  investmentDate: {
    fontSize: 12,
    color: COLORS.gray400,
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
    color: COLORS.textLight,
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text,
  },
  highlightRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: COLORS.investment + '10',
    padding: 12,
    borderRadius: 8,
    marginTop: 8,
  },
  highlightLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.text,
  },
  highlightValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.investment,
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
    textAlign: 'center',
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
    backgroundColor: COLORS.white,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  buttonIcon: {
    fontSize: 20,
    marginRight: 8,
  },
});

export default InvestmentsListScreen;