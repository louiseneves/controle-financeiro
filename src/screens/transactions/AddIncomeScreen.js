/**
 * Tela de Adicionar Receita
 */

import React, {useState} from 'react';
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
import {COLORS, INCOME_CATEGORIES} from '../../utils';
import useAuthStore from '../../store/authStore';
import useTransactionStore from '../../store/transactionStore';

const AddIncomeScreen = ({navigation}) => {
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

  // Salvar receita
  const handleSave = async () => {
    if (!validateFields()) return;

    try {
      setLoading(true);

      const transactionData = {
        type: 'receita',
        description: description.trim(),
        amount: parseFloat(amount),
        category,
        date: new Date(date).toISOString(),
        isRecurring,
        userId: user.uid,
      };

      const result = await addTransaction(transactionData);

      if (result.success) {
        Alert.alert('Sucesso! ✅', 'Receita adicionada com sucesso!', [
          {
            text: 'OK',
            onPress: () => navigation.goBack(),
          },
        ]);
      } else {
        Alert.alert('Erro', result.error || 'Erro ao adicionar receita');
      }
    } catch (error) {
      console.error('Erro ao salvar receita:', error);
      Alert.alert('Erro', 'Não foi possível adicionar a receita');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled">
        {/* Formulário */}
        <View style={styles.form}>
          <Input
            label="Descrição"
            value={description}
            onChangeText={setDescription}
            placeholder="Ex: Salário, Freelance, Bônus..."
            error={descriptionError}
            leftIcon={<Text style={styles.iconText}>📝</Text>}
          />

          <Input
            label="Valor (R$)"
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
            <View style={styles.categoryGrid}>
              {INCOME_CATEGORIES.map(cat => (
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
            </View>
            {categoryError && (
              <Text style={styles.errorTextSmall}>{categoryError}</Text>
            )}
          </View>

          {/* Receita Recorrente */}
          <TouchableOpacity
            style={styles.checkboxContainer}
            onPress={() => setIsRecurring(!isRecurring)}
            activeOpacity={0.7}>
            <View style={[styles.checkbox, isRecurring && styles.checkboxChecked]}>
              {isRecurring && <Text style={styles.checkmark}>✓</Text>}
            </View>
            <View style={styles.checkboxContent}>
              <Text style={styles.checkboxLabel}>Receita recorrente</Text>
              <Text style={styles.checkboxDescription}>
                Marque se essa receita se repete mensalmente
              </Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Botões */}
        <View style={styles.actions}>
          <Button
            title="Salvar Receita"
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
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
    color: COLORS.text,
    marginBottom: 12,
  },
  categorySection: {
    marginBottom: 16,
  },
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  categoryCard: {
    width: '31%',
    aspectRatio: 1,
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: COLORS.border,
  },
  categoryCardSelected: {
    borderWidth: 3,
    backgroundColor: COLORS.success + '10',
  },
  categoryIcon: {
    fontSize: 28,
    marginBottom: 6,
  },
  categoryName: {
    fontSize: 11,
    color: COLORS.textLight,
    textAlign: 'center',
    fontWeight: '500',
  },
  categoryNameSelected: {
    color: COLORS.success,
    fontWeight: '600',
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 16,
    gap: 12,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: COLORS.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxChecked: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  checkmark: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
  checkboxContent: {
    flex: 1,
  },
  checkboxLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 4,
  },
  checkboxDescription: {
    fontSize: 13,
    color: COLORS.textLight,
  },
  errorText: {
    color: COLORS.error,
    fontSize: 14,
  },
  errorTextSmall: {
    fontSize: 12,
    color: COLORS.error,
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

export default AddIncomeScreen;