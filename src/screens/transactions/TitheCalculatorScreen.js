/**
 * Tela de Calculadora de Dízimo
 */

import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
  TouchableOpacity,
} from 'react-native';
import {Button, Input} from '../../components/ui';
import {
  COLORS,
  formatCurrency,
  calculateTithe,
  formatDate,
  formatMonthYear,
} from '../../utils';
import useAuthStore from '../../store/authStore';
import useTransactionStore from '../../store/transactionStore';

const TitheCalculatorScreen = ({navigation}) => {
  const {user} = useAuthStore();
  const {getCurrentMonthTransactions, addTransaction} = useTransactionStore();

  const [customAmount, setCustomAmount] = useState('');
  const [selectedMode, setSelectedMode] = useState('month'); // 'month' ou 'custom'
  const [loading, setLoading] = useState(false);

  // Calcular receitas do mês
  const monthTransactions = getCurrentMonthTransactions();
  const monthIncome = monthTransactions
    .filter(t => t.type === 'receita')
    .reduce((sum, t) => sum + t.amount, 0);

  const monthTithe = calculateTithe(monthIncome);

  // Calcular dízimo pago
  const paidTithe = monthTransactions
    .filter(t => t.type === 'oferta' && t.category === 'dizimo')
    .reduce((sum, t) => sum + t.amount, 0);

  const remaining = Math.max(0, monthTithe - paidTithe);

  // Histórico de dízimos
  const titheHistory = monthTransactions
    .filter(t => t.type === 'oferta' && t.category === 'dizimo')
    .sort((a, b) => new Date(b.date) - new Date(a.date));

  // Registrar dízimo
  const handleRegisterTithe = async (amount, description) => {
    try {
      setLoading(true);

      const transactionData = {
        type: 'oferta',
        description,
        amount,
        category: 'dizimo',
        date: new Date().toISOString(),
        userId: user.uid,
      };

      const result = await addTransaction(transactionData);

      if (result.success) {
        Alert.alert('Sucesso! ✅', 'Dízimo registrado com sucesso!', [
          {
            text: 'OK',
            onPress: () => {
              setCustomAmount('');
              navigation.goBack();
            },
          },
        ]);
      } else {
        Alert.alert('Erro', result.error || 'Erro ao registrar dízimo');
      }
    } catch (error) {
      console.error('Erro ao registrar dízimo:', error);
      Alert.alert('Erro', 'Não foi possível registrar o dízimo');
    } finally {
      setLoading(false);
    }
  };

  // Registrar dízimo do mês
  const handleRegisterMonthTithe = () => {
    if (monthTithe === 0) {
      Alert.alert('Aviso', 'Você não tem receitas registradas neste mês.');
      return;
    }

    const amountToRegister = remaining > 0 ? remaining : monthTithe;

    Alert.alert(
      'Registrar Dízimo',
      `Registrar ${formatCurrency(amountToRegister)} como dízimo de ${formatMonthYear(new Date())}?`,
      [
        {text: 'Cancelar', style: 'cancel'},
        {
          text: 'Registrar',
          onPress: () =>
            handleRegisterTithe(
              amountToRegister,
              `Dízimo ${formatMonthYear(new Date())}`,
            ),
        },
      ],
    );
  };

  // Registrar valor personalizado
  const handleRegisterCustomTithe = () => {
    const amount = parseFloat(customAmount);

    if (!amount || amount <= 0) {
      Alert.alert('Erro', 'Digite um valor válido');
      return;
    }

    Alert.alert(
      'Registrar Dízimo',
      `Registrar ${formatCurrency(amount)} como dízimo?`,
      [
        {text: 'Cancelar', style: 'cancel'},
        {
          text: 'Registrar',
          onPress: () => handleRegisterTithe(amount, `Dízimo personalizado`),
        },
      ],
    );
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerIcon}>✝️</Text>
        <Text style={styles.headerTitle}>Calculadora de Dízimo</Text>
        <Text style={styles.headerSubtitle}>
          Malaquias 3:10 - "Trazei todos os dízimos"
        </Text>
      </View>

      {/* Seletor de modo */}
      <View style={styles.modeSelector}>
        <TouchableOpacity
          style={[
            styles.modeButton,
            selectedMode === 'month' && styles.modeButtonActive,
          ]}
          onPress={() => setSelectedMode('month')}
          activeOpacity={0.7}>
          <Text
            style={[
              styles.modeButtonText,
              selectedMode === 'month' && styles.modeButtonTextActive,
            ]}>
            Dízimo do Mês
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.modeButton,
            selectedMode === 'custom' && styles.modeButtonActive,
          ]}
          onPress={() => setSelectedMode('custom')}
          activeOpacity={0.7}>
          <Text
            style={[
              styles.modeButtonText,
              selectedMode === 'custom' && styles.modeButtonTextActive,
            ]}>
            Valor Personalizado
          </Text>
        </TouchableOpacity>
      </View>

      {selectedMode === 'month' ? (
        // Modo: Dízimo do Mês
        <>
          {/* Card de cálculo */}
          <View style={styles.calculationCard}>
            <Text style={styles.cardTitle}>Cálculo Automático</Text>
            
            <View style={styles.calculationRow}>
              <Text style={styles.calculationLabel}>Receitas do mês:</Text>
              <Text style={styles.calculationValue}>
                {formatCurrency(monthIncome)}
              </Text>
            </View>

            <View style={styles.divider} />

            <View style={styles.calculationRow}>
              <Text style={styles.calculationLabel}>Dízimo (10%):</Text>
              <Text style={[styles.calculationValue, {color: COLORS.tithe}]}>
                {formatCurrency(monthTithe)}
              </Text>
            </View>

            <View style={styles.divider} />

            <View style={styles.calculationRow}>
              <Text style={styles.calculationLabel}>Devolvido:</Text>
              <Text style={[styles.calculationValue, {color: COLORS.success}]}>
                {formatCurrency(paidTithe)}
              </Text>
            </View>

            <View style={styles.divider} />

            <View style={styles.calculationRow}>
              <Text style={[styles.calculationLabel, {fontWeight: 'bold'}]}>
                Restante:
              </Text>
              <Text
                style={[
                  styles.calculationValue,
                  {
                    fontWeight: 'bold',
                    fontSize: 20,
                    color: remaining > 0 ? COLORS.warning : COLORS.success,
                  },
                ]}>
                {formatCurrency(remaining)}
              </Text>
            </View>

            {remaining === 0 && monthTithe > 0 && (
              <View style={styles.paidBadge}>
                <Text style={styles.paidText}>✓ Dízimo devolvido!</Text>
              </View>
            )}
          </View>

          {/* Botão registrar */}
          {remaining > 0 && (
            <Button
              title={`Registrar ${formatCurrency(remaining)}`}
              onPress={handleRegisterMonthTithe}
              loading={loading}
              style={styles.registerButton}
            />
          )}

          {monthIncome === 0 && (
            <View style={styles.emptyState}>
              <Text style={styles.emptyIcon}>📝</Text>
              <Text style={styles.emptyText}>
                Adicione suas receitas do mês para calcular o dízimo
                automaticamente
              </Text>
            </View>
          )}
        </>
      ) : (
        // Modo: Valor Personalizado
        <>
          <View style={styles.customCard}>
            <Text style={styles.cardTitle}>Calcular Valor Personalizado</Text>
            <Text style={styles.cardSubtitle}>
              Digite o valor da receita para calcular 10%
            </Text>

            <Input
              label="Valor da Receita (R$)"
              value={customAmount}
              onChangeText={setCustomAmount}
              placeholder="0,00"
              keyboardType="numeric"
              leftIcon={<Text style={styles.iconText}>💰</Text>}
            />

            {customAmount && parseFloat(customAmount) > 0 && (
              <View style={styles.resultCard}>
                <Text style={styles.resultLabel}>Dízimo (10%):</Text>
                <Text style={styles.resultValue}>
                  {formatCurrency(calculateTithe(parseFloat(customAmount)))}
                </Text>
              </View>
            )}

            <Button
              title="Registrar Dízimo"
              onPress={handleRegisterCustomTithe}
              loading={loading}
              disabled={!customAmount || parseFloat(customAmount) <= 0}
              style={styles.registerButton}
            />
          </View>
        </>
      )}

      {/* Histórico */}
      {titheHistory.length > 0 && (
        <View style={styles.historySection}>
          <Text style={styles.sectionTitle}>Histórico de Dízimos</Text>
          {titheHistory.map((tithe, index) => (
            <View key={tithe.id || index} style={styles.historyItem}>
              <View>
                <Text style={styles.historyDescription}>
                  {tithe.description}
                </Text>
                <Text style={styles.historyDate}>{formatDate(tithe.date)}</Text>
              </View>
              <Text style={styles.historyAmount}>
                {formatCurrency(tithe.amount)}
              </Text>
            </View>
          ))}
        </View>
      )}
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
  header: {
    alignItems: 'center',
    marginBottom: 24,
  },
  headerIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 14,
    color: COLORS.textLight,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  modeSelector: {
    flexDirection: 'row',
    backgroundColor: COLORS.gray200,
    borderRadius: 12,
    padding: 4,
    marginBottom: 24,
  },
  modeButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  modeButtonActive: {
    backgroundColor: COLORS.white,
  },
  modeButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.textLight,
  },
  modeButtonTextActive: {
    color: COLORS.primary,
  },
  calculationCard: {
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
  cardSubtitle: {
    fontSize: 14,
    color: COLORS.textLight,
    marginBottom: 16,
  },
  calculationRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  calculationLabel: {
    fontSize: 16,
    color: COLORS.text,
  },
  calculationValue: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.border,
  },
  paidBadge: {
    backgroundColor: COLORS.success + '20',
    borderRadius: 8,
    padding: 12,
    marginTop: 16,
    alignItems: 'center',
  },
  paidText: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.success,
  },
  customCard: {
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
  iconText: {
    fontSize: 20,
  },
  resultCard: {
    backgroundColor: COLORS.tithe + '10',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  resultLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
  },
  resultValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.tithe,
  },
  registerButton: {
    marginTop: 8,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 40,
    backgroundColor: COLORS.white,
    borderRadius: 12,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: 12,
  },
  emptyText: {
    fontSize: 14,
    color: COLORS.textLight,
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  historySection: {
    marginTop: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 12,
  },
  historyItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
    shadowColor: COLORS.black,
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  historyDescription: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 4,
  },
  historyDate: {
    fontSize: 13,
    color: COLORS.textLight,
  },
  historyAmount: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.tithe,
  },
});

export default TitheCalculatorScreen;