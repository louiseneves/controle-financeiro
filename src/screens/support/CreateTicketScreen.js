import React, { useState,useMemo } from 'react';
import { useTheme } from '../../context/ThemeContext';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import useSupportStore from '../../store/supportStore';

const CreateTicketScreen = ({ navigation }) => {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const { createTicket, loading } = useSupportStore();
  
  const [formData, setFormData] = useState({
    subject: '',
    category: 'Geral',
    priority: 'medium',
    description: '',
  });

  const categories = [
    'Geral',
    'Conta',
    'Transações',
    'Backup',
    'Premium',
    'Metas',
    'Orçamento',
    'Dízimo',
    'Relatórios',
    'Outro',
  ];

  const priorities = [
    { value: 'low', label: 'Baixa', color: colors.success },
    { value: 'medium', label: 'Média', color: colors.warning },
    { value: 'high', label: 'Alta', color: colors.error },
  ];

  const handleSubmit = async () => {
    // Validações
    if (!formData.subject.trim()) {
      Alert.alert('Erro', 'Por favor, informe o assunto');
      return;
    }

    if (!formData.description.trim()) {
      Alert.alert('Erro', 'Por favor, descreva seu problema ou dúvida');
      return;
    }

    if (formData.description.length < 20) {
      Alert.alert('Erro', 'A descrição deve ter pelo menos 20 caracteres');
      return;
    }

    // Criar ticket
    const result = await createTicket(formData);

    if (result.success) {
      Alert.alert(
        'Ticket Criado! ✅',
        'Recebemos sua solicitação. Nossa equipe responderá em breve.',
        [
          {
            text: 'Ver Ticket',
            onPress: () => {
              navigation.replace('TicketDetails', { ticketId: result.ticket.id });
            },
          },
          {
            text: 'OK',
            onPress: () => navigation.goBack(),
          },
        ]
      );
    } else {
      Alert.alert('Erro', 'Não foi possível criar o ticket. Tente novamente.');
    }
  };

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Enviar Ticket</Text>
        <Text style={styles.headerSubtitle}>
          Descreva seu problema ou dúvida
        </Text>
      </View>

      <View style={styles.form}>
        {/* Assunto */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Assunto *</Text>
          <TextInput
            style={styles.input}
            placeholder="Ex: Problema ao adicionar receita"
            value={formData.subject}
            onChangeText={(text) => setFormData({ ...formData, subject: text })}
            placeholderTextColor={colors.placeholder}
          />
        </View>

        {/* Categoria */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Categoria *</Text>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            style={styles.categoriesScroll}
          >
            {categories.map(category => (
              <TouchableOpacity
                key={category}
                style={[
                  styles.categoryButton,
                  formData.category === category && styles.categoryButtonActive
                ]}
                onPress={() => setFormData({ ...formData, category })}
              >
                <Text style={[
                  styles.categoryButtonText,
                  formData.category === category && styles.categoryButtonTextActive
                ]}>
                  {category}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Prioridade */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Prioridade</Text>
          <View style={styles.priorityContainer}>
            {priorities.map(priority => (
              <TouchableOpacity
                key={priority.value}
                style={[
                  styles.priorityButton,
                  formData.priority === priority.value && {
                    backgroundColor: priority.color,
                    borderColor: priority.color,
                  }
                ]}
                onPress={() => setFormData({ ...formData, priority: priority.value })}
              >
                <Text style={[
                  styles.priorityButtonText,
                  formData.priority === priority.value && styles.priorityButtonTextActive
                ]}>
                  {priority.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Descrição */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Descrição *</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Descreva detalhadamente seu problema ou dúvida..."
            value={formData.description}
            onChangeText={(text) => setFormData({ ...formData, description: text })}
            multiline
            numberOfLines={8}
            textAlignVertical="top"
            placeholderTextColor={colors.placeholder}
          />
          <Text style={styles.charCount}>
            {formData.description.length} caracteres (mínimo 20)
          </Text>
        </View>

        {/* Dicas */}
        <View style={styles.tipsContainer}>
          <Text style={styles.tipsTitle}>💡 Dicas para um bom ticket:</Text>
          <Text style={styles.tipsText}>
            • Seja específico sobre o problema{'\n'}
            • Informe quando o erro ocorreu{'\n'}
            • Descreva os passos para reproduzir{'\n'}
            • Inclua mensagens de erro, se houver
          </Text>
        </View>

        {/* Botão Enviar */}
        <TouchableOpacity
          style={[styles.submitButton, loading && styles.submitButtonDisabled]}
          onPress={handleSubmit}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.submitButtonText}>Enviar Ticket</Text>
          )}
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const createStyles = (colors) =>
  StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    backgroundColor: colors.primary,
    padding: 20,
    paddingTop: 40,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 5,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#fff',
    opacity: 0.9,
  },
  form: {
    padding: 20,
  },
  inputGroup: {
    marginBottom: 25,
  },
  label: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 10,
  },
  input: {
    backgroundColor: colors.card,
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 12,
    fontSize: 15,
    color: colors.text,
    borderWidth: 1,
    borderColor: colors.border,
  },
  textArea: {
    minHeight: 150,
    paddingTop: 12,
  },
  charCount: {
    fontSize: 12,
    color: colors.textTertiary,
    marginTop: 5,
    textAlign: 'right',
  },
  categoriesScroll: {
    marginHorizontal: -5,
  },
  categoryButton: {
    backgroundColor: colors.card,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    marginHorizontal: 5,
    borderWidth: 1,
    borderColor: colors.border,
  },
  categoryButtonActive: {
    backgroundColor: colors.primary,
    bordercolor: colors.primary,
  },
  categoryButtonText: {
    fontSize: 14,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  categoryButtonTextActive: {
    color: '#fff',
  },
  priorityContainer: {
    flexDirection: 'row',
    gap: 10,
  },
  priorityButton: {
    flex: 1,
    backgroundColor: colors.card,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  priorityButtonText: {
    fontSize: 14,
    color: colors.textSecondary,
    fontWeight: '600',
  },
  priorityButtonTextActive: {
    color: '#fff',
  },
  tipsContainer: {
    backgroundColor: '#E3F2FD',
    padding: 15,
    borderRadius: 10,
    marginBottom: 25,
    borderWidth: 1,
    bordercolor: colors.primary,
  },
  tipsTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1976D2',
    marginBottom: 8,
  },
  tipsText: {
    fontSize: 13,
    color: '#1565C0',
    lineHeight: 20,
  },
  submitButton: {
    backgroundColor: colors.success,
    paddingVertical: 16,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 30,
  },
  submitButtonDisabled: {
    opacity: 0.6,
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
});

export default CreateTicketScreen;