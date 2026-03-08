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
import {t} from '../../i18n';
import usePremiumStore from '../../store/premiumStore';

const CreateTicketScreen = ({ navigation }) => {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const { createTicket, loading } = useSupportStore();
  const { isPremium } = usePremiumStore();
  
  const [formData, setFormData] = useState({
    subject: '',
    category: 'general',
    priority: 'medium',
    description: '',
  });

  const categories = [
    t('supportCreateTicket.categories.general'),
    t('supportCreateTicket.categories.account'),
    t('supportCreateTicket.categories.transactions'),
    t('supportCreateTicket.categories.backup'),
    t('supportCreateTicket.categories.premium'),
    t('supportCreateTicket.categories.goals'),
    t('supportCreateTicket.categories.budget'),
    t('supportCreateTicket.categories.tithe'),
    t('supportCreateTicket.categories.reports'),
    t('supportCreateTicket.categories.other'),
];


  const priorities = [
    { value: 'low', label: t('supportCreateTicket.priorities.low'), color: colors.success },
    { value: 'medium', label: t('supportCreateTicket.priorities.medium'), color: colors.warning },
    { value: 'high', label: t('supportCreateTicket.priorities.high'), color: colors.error },
  ];

  const handleSubmit = async () => {
    // Validações
    if (!formData.subject.trim()) {
      Alert.alert(t('supportCreateTicket.alerts.error'), t('supportCreateTicket.alerts.subjectRequired'));
      return;
    }

    if (!formData.description.trim()) {
      Alert.alert(t('supportCreateTicket.alerts.error'), t('supportCreateTicket.alerts.descriptionRequired'));
      return;
    }

    if (formData.description.length < 20) {
      Alert.alert(t('supportCreateTicket.alerts.error'), t('supportCreateTicket.alerts.descriptionMin'));
      return;
    }

    // limite de tickets para não-premium
    if (!isPremium) {
      const store = useSupportStore.getState();
      if (store.tickets.filter(t => t.status !== 'closed').length >= 3) {
        Alert.alert(
          t('premium.limitTitle'),
          t('premium.supportLimit'),
          [
            { text: t('common.ok') },
            { text: t('premium.upgrade'), onPress: () => navigation.navigate('UpgradePremium') },
          ]
        );
        return;
      }
    }

    // Criar ticket
    const result = await createTicket(formData);

    if (result.success) {
      Alert.alert(
        t('supportCreateTicket.alerts.successTitle'),
        t('supportCreateTicket.alerts.successMessage'),
        [
          {
            text: t('supportCreateTicket.actions.viewTicket'),
            onPress: () => {
              navigation.replace('TicketDetails', { ticketId: result.ticket.id });
            },
          },
          {
            text: t('supportCreateTicket.actions.ok'),
            onPress: () => navigation.goBack(),
          },
        ]
      );
    } else {
      Alert.alert(t('supportCreateTicket.alerts.error'), t('supportCreateTicket.alerts.createError'));
    }
  };

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>{t('supportCreateTicket.header.title')}</Text>
        <Text style={styles.headerSubtitle}>
          {t('supportCreateTicket.header.subtitle')}
        </Text>
      </View>

      <View style={styles.form}>
        {/* Assunto */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>{t('supportCreateTicket.form.subject')}</Text>
          <TextInput
            style={styles.input}
            placeholder={t('supportCreateTicket.form.subjectPlaceholder')}
            value={formData.subject}
            onChangeText={(text) => setFormData({ ...formData, subject: text })}
            placeholderTextColor={colors.placeholder}
          />
        </View>

        {/* Categoria */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>{t('supportCreateTicket.form.category')}</Text>
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
          <Text style={styles.label}>{t('supportCreateTicket.form.priority')}</Text>
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
          <Text style={styles.label}>{t('supportCreateTicket.form.description')}</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder={t('supportCreateTicket.form.descriptionPlaceholder')}
            value={formData.description}
            onChangeText={(text) => setFormData({ ...formData, description: text })}
            multiline
            numberOfLines={8}
            textAlignVertical="top"
            placeholderTextColor={colors.placeholder}
          />
          <Text style={styles.charCount}>
            {t('supportCreateTicket.form.charCount', { count: formData.description.length })}
          </Text>
        </View>

        {/* Dicas */}
        <View style={styles.tipsContainer}>
          <Text style={styles.tipsTitle}>{t('supportCreateTicket.tips.title')}</Text>
          <Text style={styles.tipsText}>
            {t('supportCreateTicket.tips.items')}
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
            <Text style={styles.submitButtonText}>{t('supportCreateTicket.actions.submit')}</Text>
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