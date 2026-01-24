/**
 * Tela de Metas Financeiras
 */

import React, {useEffect, useState} from 'react';
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
import {COLORS, formatCurrency, formatDate} from '../../utils';
import useAuthStore from '../../store/authStore';
import useGoalsStore from '../../store/goalsStore';

const GoalsScreen = ({navigation}) => {
  const {user} = useAuthStore();
  const {goals, loadGoals, deleteGoal} = useGoalsStore();
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    if (user?.uid) {
      loadGoals(user.uid);
    }
  }, [user]);

  const onRefresh = async () => {
    setRefreshing(true);
    if (user?.uid) {
      await loadGoals(user.uid);
    }
    setRefreshing(false);
  };

  const handleAddGoal = () => {
    navigation.navigate('AddGoal');
  };

  const handleGoalPress = goal => {
    navigation.navigate('GoalDetail', {goal});
  };

  const handleDeleteGoal = goalId => {
    Alert.alert(
      'Excluir Meta',
      'Tem certeza que deseja excluir esta meta?',
      [
        {text: 'Cancelar', style: 'cancel'},
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: async () => {
            const result = await deleteGoal(goalId);
            if (result.success) {
              Alert.alert('Sucesso! ✅', 'Meta excluída com sucesso!');
            }
          },
        },
      ],
    );
  };

  const calculateProgress = goal => {
    const current = goal.currentAmount || 0;
    const target = goal.targetAmount || 1;
    return Math.min((current / target) * 100, 100);
  };

  const getDaysRemaining = deadline => {
    const today = new Date();
    const deadlineDate = new Date(deadline);
    const diff = deadlineDate - today;
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
    return days;
  };

  // Separar metas ativas e concluídas
  const activeGoals = goals.filter(g => {
    const progress = calculateProgress(g);
    return progress < 100;
  });

  const completedGoals = goals.filter(g => {
    const progress = calculateProgress(g);
    return progress >= 100;
  });

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.content}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }>
        {/* Resumo */}
        {goals.length > 0 && (
          <View style={styles.summaryCard}>
            <View style={styles.summaryRow}>
              <View style={styles.summaryItem}>
                <Text style={styles.summaryLabel}>Metas Ativas</Text>
                <Text style={styles.summaryValue}>{activeGoals.length}</Text>
              </View>
              <View style={styles.summaryDivider} />
              <View style={styles.summaryItem}>
                <Text style={styles.summaryLabel}>Concluídas</Text>
                <Text style={[styles.summaryValue, {color: COLORS.success}]}>
                  {completedGoals.length}
                </Text>
              </View>
            </View>
          </View>
        )}

        {/* Metas Ativas */}
        {activeGoals.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Metas Ativas</Text>
            {activeGoals.map(goal => {
              const progress = calculateProgress(goal);
              const daysRemaining = getDaysRemaining(goal.deadline);
              const current = goal.currentAmount || 0;

              return (
                <TouchableOpacity
                  key={goal.id}
                  style={styles.goalCard}
                  onPress={() => handleGoalPress(goal)}
                  activeOpacity={0.7}>
                  <View style={styles.goalHeader}>
                    <Text style={styles.goalIcon}>{goal.icon || '🎯'}</Text>
                    <View style={styles.goalInfo}>
                      <Text style={styles.goalTitle}>{goal.title}</Text>
                      <Text style={styles.goalDeadline}>
                        {daysRemaining > 0
                          ? `${daysRemaining} dias restantes`
                          : daysRemaining === 0
                          ? 'Hoje é o prazo!'
                          : `Atrasado ${Math.abs(daysRemaining)} dias`}
                      </Text>
                    </View>
                  </View>

                  <View style={styles.goalProgress}>
                    <View style={styles.progressHeader}>
                      <Text style={styles.progressLabel}>Progresso</Text>
                      <Text style={styles.progressPercentage}>
                        {progress.toFixed(0)}%
                      </Text>
                    </View>
                    <View style={styles.progressBar}>
                      <View
                        style={[
                          styles.progressFill,
                          {width: `${progress}%`, backgroundColor: COLORS.primary},
                        ]}
                      />
                    </View>
                    <View style={styles.progressAmounts}>
                      <Text style={styles.progressCurrent}>
                        {formatCurrency(current)}
                      </Text>
                      <Text style={styles.progressTarget}>
                        de {formatCurrency(goal.targetAmount)}
                      </Text>
                    </View>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        )}

        {/* Metas Concluídas */}
        {completedGoals.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Metas Concluídas 🎉</Text>
            {completedGoals.map(goal => {
              const current = goal.currentAmount || 0;

              return (
                <TouchableOpacity
                  key={goal.id}
                  style={[styles.goalCard, styles.goalCardCompleted]}
                  onPress={() => handleGoalPress(goal)}
                  activeOpacity={0.7}>
                  <View style={styles.goalHeader}>
                    <Text style={styles.goalIcon}>✅</Text>
                    <View style={styles.goalInfo}>
                      <Text style={styles.goalTitle}>{goal.title}</Text>
                      <Text style={[styles.goalDeadline, {color: COLORS.success}]}>
                        Meta alcançada!
                      </Text>
                    </View>
                  </View>

                  <View style={styles.completedBadge}>
                    <Text style={styles.completedText}>
                      {formatCurrency(current)} / {formatCurrency(goal.targetAmount)}
                    </Text>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        )}

        {/* Estado vazio */}
        {goals.length === 0 && (
          <View style={styles.emptyState}>
            <Text style={styles.emptyIcon}>🎯</Text>
            <Text style={styles.emptyText}>Nenhuma meta criada</Text>
            <Text style={styles.emptySubtext}>
              Defina metas financeiras e acompanhe seu progresso
            </Text>
          </View>
        )}
      </ScrollView>

      {/* Botão Adicionar */}
      <View style={styles.footer}>
        <Button
          title="Criar Nova Meta"
          onPress={handleAddGoal}
          leftIcon={<Text style={styles.buttonIcon}>🎯</Text>}
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
    backgroundColor: COLORS.primary,
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    shadowColor: COLORS.black,
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  summaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  summaryItem: {
    flex: 1,
    alignItems: 'center',
  },
  summaryLabel: {
    fontSize: 14,
    color: COLORS.white,
    opacity: 0.9,
    marginBottom: 8,
  },
  summaryValue: {
    fontSize: 32,
    fontWeight: 'bold',
    color: COLORS.white,
  },
  summaryDivider: {
    width: 1,
    height: 50,
    backgroundColor: COLORS.white,
    opacity: 0.3,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 12,
  },
  goalCard: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 20,
    marginBottom: 12,
    shadowColor: COLORS.black,
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  goalCardCompleted: {
    backgroundColor: COLORS.success + '10',
    borderWidth: 2,
    borderColor: COLORS.success,
  },
  goalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  goalIcon: {
    fontSize: 32,
    marginRight: 12,
  },
  goalInfo: {
    flex: 1,
  },
  goalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 4,
  },
  goalDeadline: {
    fontSize: 14,
    color: COLORS.textLight,
  },
  goalProgress: {
    gap: 8,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  progressLabel: {
    fontSize: 14,
    color: COLORS.textLight,
  },
  progressPercentage: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.primary,
  },
  progressBar: {
    height: 10,
    backgroundColor: COLORS.gray200,
    borderRadius: 5,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 5,
  },
  progressAmounts: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  progressCurrent: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  progressTarget: {
    fontSize: 14,
    color: COLORS.textLight,
  },
  completedBadge: {
    backgroundColor: COLORS.success + '20',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  completedText: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.success,
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

export default GoalsScreen;