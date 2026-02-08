/**
 * Tela de Adicionar Despesa
 */

import React, {useState,useMemo} from 'react';
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
import { EXPENSE_CATEGORIES} from '../../utils';
import useAuthStore from '../../store/authStore';
import useTransactionStore from '../../store/transactionStore';
import { parseISODateOnly, isoToBR, brToISO } from '../../utils/helpers/formatters';


const AddExpenseScreen = ({navigation}) => {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const {user} = useAuthStore();
  const {addTransaction} = useTransactionStore();

  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [isRecurring, setIsRecurring] = useState(false);

  const [descriptionError, setDescriptionError] = useState('');
  const [amountError, setAmountError] = useState('');
  const [categoryError, setCategoryError] = useState('');
  const [loading, setLoading] = useState(false);

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

// ==================== SAVE ====================
  const handleSave = async () => {
    if (!validateFields()) return;

    if (!user?.uid) {
      Alert.alert('Sessão expirada', 'Faça login novamente.');
      return;
    }

    try {
      setLoading(true);

      const parsedDate = parseISODateOnly(date);

      if (!parsedDate) {
        Alert.alert('Erro', 'Data inválida');
        return;
      }

      const transactionData = {
        type: 'despesa',
        description: description.trim(),
        amount: parseFloat(amount),
        category,
        date: parsedDate.toISOString(),
        isRecurring,
        userId: user.uid,
      };

      const result = await addTransaction(transactionData);

      if (result.success) {
        Alert.alert('Sucesso! ✅', 'Despesa adicionada com sucesso!', [
          { text: 'OK', onPress: () => navigation.goBack() },
        ]);
      } else {
        Alert.alert('Erro', result.error || 'Erro ao adicionar despesa');
      }
    } catch (error) {
      console.error('Erro ao salvar despesa:', error);
      Alert.alert('Erro', 'Não foi possível adicionar a despesa');
    } finally {
      setLoading(false);
    }
  };

  // ==================== UI ====================
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.form}>
          <Input
            label="Descrição"
            value={description}
            onChangeText={setDescription}
            placeholder="Ex: Supermercado, Conta de luz..."
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
            leftIcon={<Text style={styles.iconText}>💸</Text>}
          />

          <Input
            label="Data"
            value={isoToBR(date)}
            onChangeText={(text) => setDate(brToISO(text))}
            placeholder="DD/MM/AAAA"
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
              {EXPENSE_CATEGORIES.map(cat => (
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

          {/* Despesa Recorrente */}
          <TouchableOpacity
            style={styles.checkboxContainer}
            onPress={() => setIsRecurring(!isRecurring)}
            activeOpacity={0.7}>
            <View style={[styles.checkbox, isRecurring && styles.checkboxChecked]}>
              {isRecurring && <Text style={styles.checkmark}>✓</Text>}
            </View>
            <View style={styles.checkboxContent}>
              <Text style={styles.checkboxLabel}>Despesa recorrente</Text>
              <Text style={styles.checkboxDescription}>
                Marque se essa despesa se repete mensalmente
              </Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Botões */}
        <View style={styles.actions}>
          <Button
            title="Salvar Despesa"
            onPress={handleSave}
            loading={loading}
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

const createStyles = (colors) =>
  StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  form: {
    marginBottom: 24,
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
    backgroundColor: colors.error + '10',
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
    color: colors.error,
    fontWeight: '600',
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    gap: 12,
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
  actions: {
    gap: 12,
  },
  saveButton: {
    marginBottom: 12,
  },
});

export default AddExpenseScreen;