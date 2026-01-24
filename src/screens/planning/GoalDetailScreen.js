/**
 * Tela de Detalhes da Meta
 */

import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import {Button, Input} from '../../components/ui';
import {COLORS, formatCurrency, formatDate} from '../../utils';
import useGoalsStore from '../../store/goalsStore';

const GoalDetailScreen = ({navigation, route}) => {
  const {goal} = route.params;
  const {addToGoal, deleteGoal} = useGoalsStore();
  
  const [addAmount, setAddAmount] = useState('');
  const [loading, setLoading] = useState(false);

  const currentAmount = goal.currentAmount || 0;
  const progress = Math.min((currentAmount / goal.targetAmount) * 100, 100);
  const remaining = Math.max(goal.targetAmount - currentAmount, 0);

  const getDaysRemaining = () => {
    const today = new Date();
    const deadlineDate = new Date(goal.deadline);
    const diff = deadlineDate - today;
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
    return days;
  };

  const daysRemaining = getDaysRemaining();

  const handleAddAmount = async () => {
    const amount = parseFloat(addAmount);

    if (!amount || amount <= 0) {
      Alert.alert('Erro', 'Digite um valor válido');
      return;
    }

    try {
      setLoading(true);
      const result = await addToGoal(goal.id, amount);

      if (result.success) {
        Alert.alert('Sucesso! ✅', `${formatCurrency(amount)} adicionado à meta!`, [
          {
            text: 'OK',
            onPress: () => {
              setAddAmount('');
              navigation.goBack();
            },
          },
        ]);
      } else {
        Alert.alert('Erro', result.error || 'Erro ao adicionar valor');
      }
    } catch (error) {
      console.error('Erro:', error);
      Alert.alert('Erro', 'Não foi possível adicionar o valor');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = () => {
    Alert.alert(
      'Excluir Meta',
      'Tem certeza que deseja excluir esta meta?',
      [
        {text: 'Cancelar', style: 'cancel'},
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: async () => {
            const result = await deleteGoal(goal.id);
            if (result.success) {
              Alert.alert('Sucesso! ✅', 'Meta excluída com sucesso!', [
                {text: 'OK', onPress: () => navigation.goBack()},
              ]);
            }
          },
        },
      ],
    );
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerIcon}>{goal.icon || '🎯'}</Text>
        <Text style={styles.headerTitle}>{goal.title}</Text>
        
        {progress >= 100 ? (
          <View style={styles.completedBadge}>
            <Text style={styles.completedText}>✓ Meta Alcançada!</Text>
          </View>
        ) : (
          <Text style={styles.headerDeadline}>
            {daysRemaining > 0
              ? `${daysRemaining} dias restantes`
              : daysRemaining === 0
              ? 'Hoje é o prazo!'
              : `Atrasado ${Math.abs(daysRemaining)} dias`}
          </Text>
        )}
      </View>

      {/* Progress */}
      <View style={styles.progressCard}>
        <View style={styles.progressHeader}>
          <Text style={styles.progressLabel}>Progresso</Text>
          <Text style={styles.progressPercentage}>{progress.toFixed(0)}%</Text>
        </View>

        <View style={styles.progressBar}>
          <View
            style={[
              styles.progressFill,
              {
                width: `${progress}%`,
                backgroundColor: progress >= 100 ? COLORS.success : COLORS.primary,
              },
            ]}
          />
        </View>

        <View style={styles.progressAmounts}>
          <View>
            <Text style={styles.amountLabel}>Atual</Text>
            <Text style={styles.amountValue}>{formatCurrency(currentAmount)}</Text>
          </View>
          <View style={styles.amountDivider} />
          <View>
            <Text style={styles.amountLabel}>Meta</Text>
            <Text style={styles.amountValue}>{formatCurrency(goal.targetAmount)}</Text>
          </View>
          <View style={styles.amountDivider} />
          <View>
            <Text style={styles.amountLabel}>Faltam</Text>
            <Text style={[styles.amountValue, {color: COLORS.warning}]}>
              {formatCurrency(remaining)}
            </Text>
          </View>
        </View>
      </View>

      {/* Detalhes */}
      <View style={styles.detailsCard}>
        <Text style={styles.detailsTitle}>Detalhes</Text>
        
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Data de Criação:</Text>
          <Text style={styles.detailValue}>
            {formatDate(goal.createdAt?.toDate?.() || goal.createdAt)}
          </Text>
        </View>

        <View style={styles.divider} />

        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Data Limite:</Text>
          <Text style={styles.detailValue}>{formatDate(goal.deadline)}</Text>
        </View>

        <View style={styles.divider} />

        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Valor Alvo:</Text>
          <Text style={styles.detailValue}>
            {formatCurrency(goal.targetAmount)}
          </Text>
        </View>
      </View>

      {/* Adicionar Valor */}
      {progress < 100 && (
        <View style={styles.addCard}>
          <Text style={styles.addTitle}>Adicionar à Meta</Text>
          
          <Input
            label="Valor (R$)"
            value={addAmount}
            onChangeText={setAddAmount}
            placeholder="0,00"
            keyboardType="numeric"
            leftIcon={<Text style={styles.iconText}>💰</Text>}
          />

          <Button
            title="Adicionar Valor"
            onPress={handleAddAmount}
            loading={loading}
            disabled={!addAmount || parseFloat(addAmount) <= 0}
          />
        </View>
      )}

      {/* Botão Excluir */}
      <Button
        title="Excluir Meta"
        onPress={handleDelete}
        variant="error"
        style={styles.deleteButton}
      />
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
    textAlign: 'center',
  },
  headerDeadline: {
    fontSize: 16,
    color: COLORS.textLight,
  },
  completedBadge: {
    backgroundColor: COLORS.success,
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
  },
  completedText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: '600',
  },
  progressCard: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: COLORS.black,
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  progressLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
  },
  progressPercentage: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  progressBar: {
    height: 12,
    backgroundColor: COLORS.gray200,
    borderRadius: 6,
    overflow: 'hidden',
    marginBottom: 16,
  },
  progressFill: {
    height: '100%',
    borderRadius: 6,
  },
  progressAmounts: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  amountLabel: {
    fontSize: 13,
    color: COLORS.textLight,
    marginBottom: 4,
    textAlign: 'center',
  },
  amountValue: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
    textAlign: 'center',
  },
  amountDivider: {
    width: 1,
    height: 40,
    backgroundColor: COLORS.border,
  },
  detailsCard: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: COLORS.black,
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  detailsTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 16,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  detailLabel: {
    fontSize: 15,
    color: COLORS.textLight,
  },
  detailValue: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.text,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.border,
  },
  addCard: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: COLORS.black,
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  addTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 16,
  },
  iconText: {
    fontSize: 20,
  },
  deleteButton: {
    marginTop: 8,
  },
});

export default GoalDetailScreen;