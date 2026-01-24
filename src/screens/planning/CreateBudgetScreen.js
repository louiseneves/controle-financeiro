/**
 * Tela de Criar/Editar Orçamento
 */

import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  TouchableOpacity,
} from 'react-native';
import {Button, Input} from '../../components/ui';
import {COLORS, EXPENSE_CATEGORIES, formatCurrency} from '../../utils';
import useAuthStore from '../../store/authStore';
import useBudgetStore from '../../store/budgetStore';

const CreateBudgetScreen = ({navigation, route}) => {
  const {user} = useAuthStore();
  const {addBudget, updateBudget} = useBudgetStore();
  
  const existingBudget = route.params?.budget;
  const isEditing = !!existingBudget;

  const [categoryBudgets, setCategoryBudgets] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isEditing && existingBudget.categories) {
      setCategoryBudgets(existingBudget.categories);
    }
  }, [isEditing, existingBudget]);

  const handleAmountChange = (category, value) => {
    setCategoryBudgets(prev => ({
      ...prev,
      [category]: value ? parseFloat(value) : 0,
    }));
  };

  const calculateTotal = () => {
    return Object.values(categoryBudgets).reduce((sum, amount) => sum + (amount || 0), 0);
  };

  const handleSave = async () => {
    const total = calculateTotal();

    if (total === 0) {
      Alert.alert('Erro', 'Defina pelo menos um orçamento de categoria');
      return;
    }

    // Filtrar apenas categorias com valor > 0
    const filteredBudgets = Object.entries(categoryBudgets)
      .filter(([_, amount]) => amount > 0)
      .reduce((obj, [key, value]) => {
        obj[key] = value;
        return obj;
      }, {});

    try {
      setLoading(true);

      const now = new Date();
      const month = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;

      const budgetData = {
        month,
        categories: filteredBudgets,
        userId: user.uid,
      };

      let result;
      if (isEditing) {
        result = await updateBudget(existingBudget.id, budgetData);
      } else {
        result = await addBudget(budgetData);
      }

      if (result.success) {
        Alert.alert(
          'Sucesso! ✅',
          isEditing ? 'Orçamento atualizado!' : 'Orçamento criado!',
          [
            {
              text: 'OK',
              onPress: () => navigation.goBack(),
            },
          ],
        );
      } else {
        Alert.alert('Erro', result.error || 'Erro ao salvar orçamento');
      }
    } catch (error) {
      console.error('Erro ao salvar:', error);
      Alert.alert('Erro', 'Não foi possível salvar o orçamento');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickFill = () => {
    Alert.alert(
      'Preenchimento Rápido',
      'Escolha uma opção:',
      [
        {
          text: 'Distribuir Igualmente',
          onPress: () => {
            const equalAmount = 500; // R$ 500 por categoria
            const budgets = {};
            EXPENSE_CATEGORIES.forEach(cat => {
              budgets[cat.id] = equalAmount;
            });
            setCategoryBudgets(budgets);
          },
        },
        {
          text: 'Valores Sugeridos',
          onPress: () => {
            // Sugestões baseadas em prioridades
            const suggestions = {
              alimentacao: 800,
              moradia: 1200,
              transporte: 400,
              saude: 300,
              contas: 500,
              mercado: 600,
              combustivel: 300,
              telefone: 150,
            };
            setCategoryBudgets(suggestions);
          },
        },
        {text: 'Cancelar', style: 'cancel'},
      ],
    );
  };

  const totalBudget = calculateTotal();

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled">
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerIcon}>📊</Text>
          <Text style={styles.headerTitle}>
            {isEditing ? 'Editar Orçamento' : 'Criar Orçamento Mensal'}
          </Text>
          <Text style={styles.headerSubtitle}>
            Defina limites de gastos por categoria
          </Text>
        </View>

        {/* Total */}
        <View style={styles.totalCard}>
          <Text style={styles.totalLabel}>Orçamento Total</Text>
          <Text style={styles.totalAmount}>{formatCurrency(totalBudget)}</Text>
          
          <TouchableOpacity style={styles.quickFillButton} onPress={handleQuickFill}>
            <Text style={styles.quickFillText}>⚡ Preenchimento Rápido</Text>
          </TouchableOpacity>
        </View>

        {/* Categorias */}
        <View style={styles.categoriesSection}>
          <Text style={styles.sectionTitle}>Orçamento por Categoria</Text>

          {EXPENSE_CATEGORIES.map(category => (
            <View key={category.id} style={styles.categoryInput}>
              <View style={styles.categoryHeader}>
                <Text style={styles.categoryIcon}>{category.icon}</Text>
                <Text style={styles.categoryName}>{category.name}</Text>
              </View>
              
              <Input
                value={categoryBudgets[category.id]?.toString() || ''}
                onChangeText={value => handleAmountChange(category.id, value)}
                placeholder="0,00"
                keyboardType="numeric"
                leftIcon={<Text style={styles.inputIcon}>R$</Text>}
                style={styles.input}
              />
            </View>
          ))}
        </View>

        {/* Dica */}
        <View style={styles.tipBox}>
          <Text style={styles.tipIcon}>💡</Text>
          <View style={styles.tipContent}>
            <Text style={styles.tipTitle}>Dica</Text>
            <Text style={styles.tipText}>
              Uma regra comum é: 50% para necessidades, 30% para desejos e 20%
              para poupança e investimentos.
            </Text>
          </View>
        </View>

        {/* Botões */}
        <View style={styles.actions}>
          <Button
            title={isEditing ? 'Salvar Alterações' : 'Criar Orçamento'}
            onPress={handleSave}
            loading={loading}
            disabled={totalBudget === 0}
            style={styles.saveButton}
          />

          <Button
            title="Cancelar"
            onPress={() => navigation.goBack()}
            variant="outline"
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
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
  headerSubtitle: {
    fontSize: 16,
    color: COLORS.textLight,
    textAlign: 'center',
  },
  totalCard: {
    backgroundColor: COLORS.primary,
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    marginBottom: 24,
    shadowColor: COLORS.black,
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  totalLabel: {
    fontSize: 14,
    color: COLORS.white,
    opacity: 0.9,
    marginBottom: 8,
  },
  totalAmount: {
    fontSize: 36,
    fontWeight: 'bold',
    color: COLORS.white,
    marginBottom: 16,
  },
  quickFillButton: {
    backgroundColor: COLORS.white + '20',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  quickFillText: {
    fontSize: 14,
    color: COLORS.white,
    fontWeight: '600',
  },
  categoriesSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 16,
  },
  categoryInput: {
    marginBottom: 16,
  },
  categoryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 8,
  },
  categoryIcon: {
    fontSize: 24,
  },
  categoryName: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
  },
  input: {
    marginBottom: 0,
  },
  inputIcon: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.textLight,
  },
  tipBox: {
    flexDirection: 'row',
    backgroundColor: COLORS.info + '10',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    gap: 12,
  },
  tipIcon: {
    fontSize: 24,
  },
  tipContent: {
    flex: 1,
  },
  tipTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 4,
  },
  tipText: {
    fontSize: 14,
    color: COLORS.textLight,
    lineHeight: 20,
  },
  actions: {
    gap: 12,
  },
  saveButton: {
    marginBottom: 12,
  },
});

export default CreateBudgetScreen;