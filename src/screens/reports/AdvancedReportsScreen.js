/**
 * Tela de Relatórios Avançados (Premium)
 */

import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Dimensions,
} from 'react-native';
import {Button} from '../../components/ui';
import {COLORS, formatCurrency, formatMonthYear} from '../../utils';
import usePremiumStore from '../../store/premiumStore';
import useTransactionStore from '../../store/transactionStore';
import useAuthStore from '../../store/authStore';
import { LineChart } from 'react-native-gifted-charts';

const screenWidth = Dimensions.get('window').width;

const AdvancedReportsScreen = ({navigation}) => {
  const {user} = useAuthStore();
  const {isPremium, hasAccess} = usePremiumStore();
  const {transactions, loadTransactions} = useTransactionStore();
  
  const [selectedView, setSelectedView] = useState('yearly'); // yearly, comparison, projection

  useEffect(() => {
    if (user?.uid) {
      loadTransactions(user.uid);
    }
  }, [user]);

  // Verificar acesso premium
  if (!hasAccess('advanced_reports')) {
    return (
      <View style={styles.container}>
        <View style={styles.lockedContainer}>
          <Text style={styles.lockedIcon}>🔒</Text>
          <Text style={styles.lockedTitle}>Recurso Premium</Text>
          <Text style={styles.lockedText}>
            Os relatórios avançados estão disponíveis apenas para assinantes Premium.
          </Text>
          
          <View style={styles.premiumFeatures}>
            <Text style={styles.premiumFeaturesTitle}>Com Premium você terá:</Text>
            <Text style={styles.premiumFeature}>📊 Relatórios anuais completos</Text>
            <Text style={styles.premiumFeature}>🔄 Comparativo entre períodos</Text>
            <Text style={styles.premiumFeature}>📈 Projeções futuras</Text>
            <Text style={styles.premiumFeature}>📄 Exportação em PDF</Text>
            <Text style={styles.premiumFeature}>📑 Exportação em Excel</Text>
          </View>

          <Button
            title="Assinar Premium"
            onPress={() => navigation.navigate('ProfileTab', {screen: 'Premium'})}
            style={styles.upgradeButton}
          />
        </View>
      </View>
    );
  }

  // Calcular dados anuais
  const getYearlyData = () => {
    const now = new Date();
    const currentYear = now.getFullYear();
    const monthlyData = [];

    for (let month = 0; month < 12; month++) {
      const monthTransactions = transactions.filter(t => {
        const date = new Date(t.date);
        return date.getFullYear() === currentYear && date.getMonth() === month;
      });

      const income = monthTransactions
        .filter(t => t.type === 'receita')
        .reduce((sum, t) => sum + t.amount, 0);

      const expense = monthTransactions
        .filter(t => t.type === 'despesa')
        .reduce((sum, t) => sum + t.amount, 0);

      monthlyData.push({
        month: month + 1,
        monthName: new Date(currentYear, month).toLocaleDateString('pt-BR', {month: 'short'}),
        income,
        expense,
        balance: income - expense,
      });
    }

    return monthlyData;
  };

  // Calcular projeção
  const getProjection = () => {
    const yearlyData = getYearlyData();
    const lastThreeMonths = yearlyData.slice(-3);
    
    const avgIncome = lastThreeMonths.reduce((sum, m) => sum + m.income, 0) / 3;
    const avgExpense = lastThreeMonths.reduce((sum, m) => sum + m.expense, 0) / 3;

    return {
      nextMonthIncome: avgIncome,
      nextMonthExpense: avgExpense,
      nextMonthBalance: avgIncome - avgExpense,
      projectedYearEnd: avgIncome * 12 - avgExpense * 12,
    };
  };

  const yearlyData = getYearlyData();
  const projection = getProjection();

  const totalYearIncome = yearlyData.reduce((sum, m) => sum + m.income, 0);
  const totalYearExpense = yearlyData.reduce((sum, m) => sum + m.expense, 0);
  const totalYearBalance = totalYearIncome - totalYearExpense;

  const handleExportPDF = () => {
    Alert.alert('Exportar PDF', 'Funcionalidade de exportação em PDF (em desenvolvimento)');
  };

  const handleExportExcel = () => {
    Alert.alert('Exportar Excel', 'Funcionalidade de exportação em Excel (em desenvolvimento)');
  };

  const views = [
    {id: 'yearly', label: 'Anual'},
    {id: 'comparison', label: 'Comparativo'},
    {id: 'projection', label: 'Projeção'},
  ];

  const incomeLineData = yearlyData.map(item => ({
  value: item.income,
  label: item.monthName,
}));

const expenseLineData = yearlyData.map(item => ({
  value: item.expense,
}));

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Header Premium */}
      <View style={styles.premiumBadge}>
        <Text style={styles.premiumText}>⭐ PREMIUM</Text>
      </View>

      {/* Seletor de visualização */}
      <View style={styles.viewSelector}>
        {views.map(view => (
          <TouchableOpacity
            key={view.id}
            style={[
              styles.viewButton,
              selectedView === view.id && styles.viewButtonActive,
            ]}
            onPress={() => setSelectedView(view.id)}
            activeOpacity={0.7}>
            <Text
              style={[
                styles.viewButtonText,
                selectedView === view.id && styles.viewButtonTextActive,
              ]}>
              {view.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {selectedView === 'yearly' && (
        <>
          {/* Resumo Anual */}
          <View style={styles.summaryCard}>
            <Text style={styles.cardTitle}>Resumo do Ano</Text>
            
            <View style={styles.summaryRow}>
              <View style={styles.summaryItem}>
                <Text style={styles.summaryLabel}>Receitas</Text>
                <Text style={[styles.summaryValue, {color: COLORS.success}]}>
                  {formatCurrency(totalYearIncome)}
                </Text>
              </View>

              <View style={styles.summaryItem}>
                <Text style={styles.summaryLabel}>Despesas</Text>
                <Text style={[styles.summaryValue, {color: COLORS.error}]}>
                  {formatCurrency(totalYearExpense)}
                </Text>
              </View>
            </View>

            <View style={styles.balanceRow}>
              <Text style={styles.balanceLabel}>Saldo Anual</Text>
              <Text
                style={[
                  styles.balanceValue,
                  {color: totalYearBalance >= 0 ? COLORS.success : COLORS.error},
                ]}>
                {formatCurrency(totalYearBalance)}
              </Text>
            </View>
          </View>

          {/* Gráfico de Linha */}
<View style={styles.chartCard}>
  <Text style={styles.cardTitle}>Evolução Mensal</Text>

  <LineChart
    data={incomeLineData}
    data2={expenseLineData}
    width={screenWidth - 80}
    height={220}

    spacing={32}
    thickness={3}
    thickness2={3}

    color={COLORS.success}
    color2={COLORS.error}

    hideRules
    hideYAxisText
    yAxisColor={COLORS.gray200}
    xAxisColor={COLORS.gray200}

    xAxisLabelTextStyle={{
      fontSize: 10,
      color: COLORS.text,
    }}

    isAnimated
    animationDuration={800}

    curved
    curved2
  />

  {/* Legenda — MANTIDA */}
  <View style={styles.legend}>
    <View style={styles.legendItem}>
      <View style={[styles.legendDot, {backgroundColor: COLORS.success}]} />
      <Text style={styles.legendLabel}>Receitas</Text>
    </View>

    <View style={styles.legendItem}>
      <View style={[styles.legendDot, {backgroundColor: COLORS.error}]} />
      <Text style={styles.legendLabel}>Despesas</Text>
    </View>
  </View>
</View>

        </>
      )}

      {selectedView === 'comparison' && (
        <View style={styles.comparisonCard}>
          <Text style={styles.cardTitle}>Comparativo Mensal</Text>
          
          {yearlyData.map((month, index) => (
            <View key={index} style={styles.comparisonRow}>
              <Text style={styles.comparisonMonth}>{month.monthName}</Text>
              <View style={styles.comparisonBars}>
                <View style={styles.comparisonBar}>
                  <View
                    style={[
                      styles.comparisonBarFill,
                      {
                        width: `${(month.income / Math.max(totalYearIncome / 12, 1)) * 100}%`,
                        backgroundColor: COLORS.success,
                      },
                    ]}
                  />
                </View>
                <View style={styles.comparisonBar}>
                  <View
                    style={[
                      styles.comparisonBarFill,
                      {
                        width: `${(month.expense / Math.max(totalYearExpense / 12, 1)) * 100}%`,
                        backgroundColor: COLORS.error,
                      },
                    ]}
                  />
                </View>
              </View>
              <Text
                style={[
                  styles.comparisonBalance,
                  {color: month.balance >= 0 ? COLORS.success : COLORS.error},
                ]}>
                {formatCurrency(month.balance)}
              </Text>
            </View>
          ))}
        </View>
      )}

      {selectedView === 'projection' && (
        <>
          <View style={styles.projectionCard}>
            <Text style={styles.cardTitle}>Projeção Próximo Mês</Text>
            
            <View style={styles.projectionItem}>
              <Text style={styles.projectionLabel}>Receitas Previstas</Text>
              <Text style={[styles.projectionValue, {color: COLORS.success}]}>
                {formatCurrency(projection.nextMonthIncome)}
              </Text>
            </View>

            <View style={styles.projectionItem}>
              <Text style={styles.projectionLabel}>Despesas Previstas</Text>
              <Text style={[styles.projectionValue, {color: COLORS.error}]}>
                {formatCurrency(projection.nextMonthExpense)}
              </Text>
            </View>

            <View style={styles.projectionHighlight}>
              <Text style={styles.projectionHighlightLabel}>Saldo Previsto</Text>
              <Text
                style={[
                  styles.projectionHighlightValue,
                  {color: projection.nextMonthBalance >= 0 ? COLORS.success : COLORS.error},
                ]}>
                {formatCurrency(projection.nextMonthBalance)}
              </Text>
            </View>
          </View>

          <View style={styles.infoBox}>
            <Text style={styles.infoIcon}>💡</Text>
            <Text style={styles.infoText}>
              Projeção baseada na média dos últimos 3 meses. Mantenha seus registros
              atualizados para previsões mais precisas.
            </Text>
          </View>
        </>
      )}

      {/* Botões de Exportação */}
      <View style={styles.exportSection}>
        <Text style={styles.sectionTitle}>Exportar Relatório</Text>
        
        <View style={styles.exportButtons}>
          <TouchableOpacity style={styles.exportButton} onPress={handleExportPDF}>
            <Text style={styles.exportIcon}>📄</Text>
            <Text style={styles.exportText}>PDF</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.exportButton} onPress={handleExportExcel}>
            <Text style={styles.exportIcon}>📑</Text>
            <Text style={styles.exportText}>Excel</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  lockedContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  lockedIcon: {
    fontSize: 80,
    marginBottom: 24,
  },
  lockedTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 12,
  },
  lockedText: {
    fontSize: 16,
    color: COLORS.textLight,
    textAlign: 'center',
    marginBottom: 32,
  },
  premiumFeatures: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 20,
    marginBottom: 32,
    width: '100%',
  },
  premiumFeaturesTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 16,
  },
  premiumFeature: {
    fontSize: 15,
    color: COLORS.text,
    marginBottom: 12,
  },
  upgradeButton: {
    width: '100%',
  },
  premiumBadge: {
    backgroundColor: COLORS.warning,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    alignSelf: 'center',
    marginBottom: 24,
  },
  premiumText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.white,
  },
  viewSelector: {
    flexDirection: 'row',
    backgroundColor: COLORS.gray200,
    borderRadius: 12,
    padding: 4,
    marginBottom: 24,
  },
  viewButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  viewButtonActive: {
    backgroundColor: COLORS.white,
  },
  viewButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.textLight,
  },
  viewButtonTextActive: {
    color: COLORS.primary,
  },
  summaryCard: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: COLORS.black,
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 16,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  summaryItem: {
    alignItems: 'center',
  },
  summaryLabel: {
    fontSize: 14,
    color: COLORS.textLight,
    marginBottom: 8,
  },
  summaryValue: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  balanceRow: {
    backgroundColor: COLORS.gray100,
    padding: 16,
    borderRadius: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  balanceLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
  },
  balanceValue: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  chartCard: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: COLORS.black,
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  legend: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 24,
    marginTop: 16,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  legendDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  legendLabel: {
    fontSize: 14,
    color: COLORS.text,
  },
  comparisonCard: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: COLORS.black,
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  comparisonRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 12,
  },
  comparisonMonth: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text,
    width: 40,
  },
  comparisonBars: {
    flex: 1,
    gap: 4,
  },
  comparisonBar: {
    height: 8,
    backgroundColor: COLORS.gray200,
    borderRadius: 4,
    overflow: 'hidden',
  },
  comparisonBarFill: {
    height: '100%',
    borderRadius: 4,
  },
  comparisonBalance: {
    fontSize: 14,
    fontWeight: '600',
    width: 80,
    textAlign: 'right',
  },
  projectionCard: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: COLORS.black,
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  projectionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
  },
  projectionLabel: {
    fontSize: 16,
    color: COLORS.textLight,
  },
  projectionValue: {
    fontSize: 18,
    fontWeight: '600',
  },
  projectionHighlight: {
    backgroundColor: COLORS.gray100,
    padding: 16,
    borderRadius: 12,
    marginTop: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  projectionHighlightLabel: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.text,
  },
  projectionHighlightValue: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  infoBox: {
    flexDirection: 'row',
    backgroundColor: COLORS.info + '10',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    gap: 12,
  },
  infoIcon: {
    fontSize: 20,
  },
  infoText: {
    flex: 1,
    fontSize: 14,
    color: COLORS.text,
    lineHeight: 20,
  },
  exportSection: {
    marginTop: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 16,
  },
  exportButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  exportButton: {
    flex: 1,
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    shadowColor: COLORS.black,
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  exportIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  exportText: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
  },
});

export default AdvancedReportsScreen;