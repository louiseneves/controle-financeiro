/**
 * Tela de Detalhes/Edição de Transação
 */

import React, {useState, useEffect,useMemo} from 'react';
import { useTheme } from '../../context/ThemeContext';
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
import {
  COLORS,
  INCOME_CATEGORIES,
  EXPENSE_CATEGORIES,
  INVESTMENT_CATEGORIES,
  OFFER_CATEGORIES,
  formatDate,
} from '../../utils';
import useTransactionStore from '../../store/transactionStore';
import useSettingsStore from '../../store/settingsStore';

const TransactionDetailScreen = ({navigation, route}) => {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const {transaction} = route.params;
  const formatCurrency = useSettingsStore(state => state.formatCurrency);
  const {updateTransaction, deleteTransaction} = useTransactionStore();

  const [isEditing, setIsEditing] = useState(false);
  const [description, setDescription] = useState(transaction.description);
  const [amount, setAmount] = useState(transaction.amount.toString());
  const [category, setCategory] = useState(transaction.category);
  const [date, setDate] = useState(transaction.date.split('T')[0]);
  const [isRecurring, setIsRecurring] = useState(transaction.isRecurring || false);

  const [descriptionError, setDescriptionError] = useState('');
  const [amountError, setAmountError] = useState('');
  const [categoryError, setCategoryError] = useState('');
  const [loading, setLoading] = useState(false);

  // Obter categorias baseado no tipo
  const getCategories = () => {
    switch (transaction.type) {
      case 'receita':
        return INCOME_CATEGORIES;
      case 'despesa':
        return EXPENSE_CATEGORIES;
      case 'investimento':
        return INVESTMENT_CATEGORIES;
      case 'oferta':
        return OFFER_CATEGORIES;
      default:
        return [];
    }
  };

  const categories = getCategories();

  // Obter cor do tipo
  const getTypeColor = () => {
    switch (transaction.type) {
      case 'receita':
        return colors.success;
      case 'despesa':
        return colors.error;
      case 'investimento':
        return colors.investment;
      case 'oferta':
        return colors.offer;
      default:
        return COLORS.gray500;
    }
  };

  const typeColor = getTypeColor();

  // Validar campos
  const validateFields = () => {
    let isValid = true;

    setDescriptionError('');
    setAmountError('');
    setCategoryError('');

    if (!description.trim()) {
      setDescriptionError('Descrição é obrigatória');
      isValid = false;
    }

    if (!amount || parseFloat(amount) <= 0) {
      setAmountError('Valor deve ser maior que zero');
      isValid = false;
    }

    if (!category) {
      setCategoryError('Selecione uma categoria');
      isValid = false;
    }

    return isValid;
  };

  // Salvar edição
  const handleSave = async () => {
    if (!validateFields()) return;

    try {
      setLoading(true);

      const updatedData = {
        description: description.trim(),
        amount: parseFloat(amount),
        category,
        date: new Date(date).toISOString(),
        isRecurring,
      };

      const result = await updateTransaction(transaction.id, updatedData);

      if (result.success) {
        Alert.alert('Sucesso! ✅', 'Transação atualizada com sucesso!', [
          {
            text: 'OK',
            onPress: () => {
              setIsEditing(false);
              navigation.goBack();
            },
          },
        ]);
      } else {
        Alert.alert('Erro', result.error || 'Erro ao atualizar transação');
      }
    } catch (error) {
      console.error('Erro ao salvar:', error);
      Alert.alert('Erro', 'Não foi possível atualizar a transação');
    } finally {
      setLoading(false);
    }
  };

  // Deletar transação
  const handleDelete = () => {
    Alert.alert(
      'Excluir Transação',
      'Tem certeza que deseja excluir esta transação? Esta ação não pode ser desfeita.',
      [
        {text: 'Cancelar', style: 'cancel'},
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: async () => {
            try {
              setLoading(true);
              const result = await deleteTransaction(transaction.id);

              if (result.success) {
                Alert.alert('Sucesso! ✅', 'Transação excluída com sucesso!', [
                  {
                    text: 'OK',
                    onPress: () => navigation.goBack(),
                  },
                ]);
              } else {
                Alert.alert('Erro', result.error || 'Erro ao excluir transação');
              }
            } catch (error) {
              console.error('Erro ao excluir:', error);
              Alert.alert('Erro', 'Não foi possível excluir a transação');
            } finally {
              setLoading(false);
            }
          },
        },
      ],
    );
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled">
        {/* Header com info do tipo */}
        <View style={[styles.header, {backgroundColor: typeColor + '20'}]}>
          <Text style={styles.typeLabel}>
            {transaction.type.toUpperCase()}
          </Text>
          {!isEditing && (
            <Text style={[styles.headerAmount, {color: typeColor}]}>
              {formatCurrency(transaction.amount)}
            </Text>
          )}
        </View>

        {isEditing ? (
          // Modo de Edição
          <View style={styles.form}>
            <Input
              label="Descrição"
              value={description}
              onChangeText={setDescription}
              placeholder="Descrição"
              error={descriptionError}
              leftIcon={<Text style={styles.iconText}>📝</Text>}
            />

            <Input
              label="Valor "
              value={amount}
              onChangeText={setAmount}
              placeholder="0,00"
              keyboardType="numeric"
              error={amountError}
              leftIcon={<Text style={styles.iconText}>💰</Text>}
            />

            <Input
              label="Data"
              value={date}
              onChangeText={setDate}
              placeholder="YYYY-MM-DD"
              leftIcon={<Text style={styles.iconText}>📅</Text>}
            />

            {/* Categorias */}
            <View style={styles.categorySection}>
              <Text style={styles.label}>
                Categoria {categoryError && <Text style={styles.errorText}>*</Text>}
              </Text>
              <ScrollView 
                style={styles.categoryScrollContainer}
                contentContainerStyle={styles.categoryGrid}
                showsVerticalScrollIndicator={true}>
                {categories.map(cat => (
                  <TouchableOpacity
                    key={cat.id}
                    style={[
                      styles.categoryCard,
                      category === cat.id && styles.categoryCardSelected,
                      {borderColor: cat.color},
                    ]}
                    onPress={() => setCategory(cat.id)}
                    activeOpacity={0.7}>
                    <Text style={styles.categoryIcon}>{cat.icon}</Text>
                    <Text
                      style={[
                        styles.categoryName,
                        category === cat.id && styles.categoryNameSelected,
                      ]}
                      numberOfLines={2}>
                      {cat.name}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
              {categoryError && (
                <Text style={styles.errorTextSmall}>{categoryError}</Text>
              )}
            </View>

            {/* Recorrente */}
            <TouchableOpacity
              style={styles.checkboxContainer}
              onPress={() => setIsRecurring(!isRecurring)}
              activeOpacity={0.7}>
              <View style={[styles.checkbox, isRecurring && styles.checkboxChecked]}>
                {isRecurring && <Text style={styles.checkmark}>✓</Text>}
              </View>
              <View style={styles.checkboxContent}>
                <Text style={styles.checkboxLabel}>Transação recorrente</Text>
                <Text style={styles.checkboxDescription}>
                  Marque se essa transação se repete mensalmente
                </Text>
              </View>
            </TouchableOpacity>

            {/* Botões de edição */}
            <View style={styles.actions}>
              <Button
                title="Salvar Alterações"
                onPress={handleSave}
                loading={loading}
                style={styles.saveButton}
              />
              <Button
                title="Cancelar"
                onPress={() => {
                  setIsEditing(false);
                  // Resetar valores
                  setDescription(transaction.description);
                  setAmount(transaction.amount.toString());
                  setCategory(transaction.category);
                  setDate(transaction.date.split('T')[0]);
                  setIsRecurring(transaction.isRecurring || false);
                }}
                variant="outline"
              />
            </View>
          </View>
        ) : (
          // Modo de Visualização
          <View style={styles.details}>
            <View style={styles.detailCard}>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Descrição</Text>
                <Text style={styles.detailValue}>{transaction.description}</Text>
              </View>

              <View style={styles.divider} />

              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Categoria</Text>
                <Text style={styles.detailValue}>{transaction.category}</Text>
              </View>

              <View style={styles.divider} />

              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Data</Text>
                <Text style={styles.detailValue}>
                  {formatDate(transaction.date)}
                </Text>
              </View>

              <View style={styles.divider} />

              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Recorrente</Text>
                <Text style={styles.detailValue}>
                  {transaction.isRecurring ? 'Sim' : 'Não'}
                </Text>
              </View>
            </View>

            {/* Botões de ação */}
            <View style={styles.actions}>
              <Button
                title="Editar Transação"
                onPress={() => setIsEditing(true)}
                variant="primary"
                style={styles.editButton}
              />
              <Button
                title="Excluir Transação"
                onPress={handleDelete}
                variant="error"
                loading={loading}
              />
            </View>
          </View>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const createStyles = (colors) =>
  StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    paddingBottom: 40,
  },
  header: {
    padding: 24,
    alignItems: 'center',
    marginBottom: 24,
  },
  typeLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textSecondary,
    marginBottom: 8,
  },
  headerAmount: {
    fontSize: 36,
    fontWeight: 'bold',
  },
  form: {
    padding: 20,
  },
  iconText: {
    fontSize: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 12,
  },
  categorySection: {
    marginBottom: 16,
  },
  categoryScrollContainer: {
    maxHeight: 300,
  },
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  categoryCard: {
    width: '31%',
    aspectRatio: 1,
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: colors.border,
  },
  categoryCardSelected: {
    borderWidth: 3,
  },
  categoryIcon: {
    fontSize: 28,
    marginBottom: 6,
  },
  categoryName: {
    fontSize: 11,
    color: colors.textSecondary,
    textAlign: 'center',
    fontWeight: '500',
  },
  categoryNameSelected: {
    fontWeight: '600',
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    gap: 12,
    marginBottom: 24,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxChecked: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  checkmark: {
    color: colors.card,
    fontSize: 16,
    fontWeight: 'bold',
  },
  checkboxContent: {
    flex: 1,
  },
  checkboxLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  checkboxDescription: {
    fontSize: 13,
    color: colors.textSecondary,
  },
  errorText: {
    color: colors.error,
    fontSize: 14,
  },
  errorTextSmall: {
    fontSize: 12,
    color: colors.error,
    marginTop: 4,
    marginLeft: 4,
  },
  details: {
    padding: 20,
  },
  detailCard: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    shadowColor: COLORS.black,
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  detailRow: {
    paddingVertical: 12,
  },
  detailLabel: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 6,
  },
  detailValue: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
  },
  actions: {
    gap: 12,
  },
  saveButton: {
    marginBottom: 12,
  },
  editButton: {
    marginBottom: 12,
  },
});

export default TransactionDetailScreen;