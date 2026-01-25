import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert,
  Modal,
} from 'react-native';
import useSettingsStore from '../../store/settingsStore';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Platform } from 'react-native';


const SettingsScreen = ({ navigation }) => {
  const {
  darkMode,
  currency,
  language,
  notifications,
  availableCurrencies,
  availableLanguages,
  loadSettings,
  toggleDarkMode,
  setCurrency,
  setLanguage,
  updateNotifications,
  setNotificationTime,
  resetSettings,
  getTheme,
} = useSettingsStore();


  const [showCurrencyModal, setShowCurrencyModal] = useState(false);
  const [showLanguageModal, setShowLanguageModal] = useState(false);
  const [showTimeModal, setShowTimeModal] = useState(false);
  const [selectedTime, setSelectedTime] = useState(new Date());

useEffect(() => {
  if (!notifications?.time) return;

  const [hour, minute] = notifications.time.split(':');
  const date = new Date();
  date.setHours(Number(hour));
  date.setMinutes(Number(minute));
  date.setSeconds(0);

  setSelectedTime(date);
}, [notifications.time]);


  const theme = getTheme();

  useEffect(() => {
    loadSettings();
  }, []);
  
  const handleToggleDarkMode = async () => {
    await toggleDarkMode();
  };

  const handleSelectCurrency = async (currencyCode) => {
    await setCurrency(currencyCode);
    setShowCurrencyModal(false);
  };

  const handleSelectLanguage = async (languageCode) => {
    await setLanguage(languageCode);
    setShowLanguageModal(false);
    Alert.alert(
      'Idioma Alterado',
      'O idioma será aplicado no próximo reinício do app.'
    );
  };

  const handleResetSettings = () => {
    Alert.alert(
      'Resetar Configurações',
      'Isso irá restaurar todas as configurações padrão. Deseja continuar?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Resetar',
          style: 'destructive',
          onPress: async () => {
            await resetSettings();
            Alert.alert('Sucesso', 'Configurações restauradas!');
          },
        },
      ]
    );
  };

  const currentCurrency = availableCurrencies.find(c => c.code === currency);
  const currentLanguage = availableLanguages.find(l => l.code === language);

  const handleSaveTime = async () => {
  const hours = selectedTime.getHours().toString().padStart(2, '0');
  const minutes = selectedTime.getMinutes().toString().padStart(2, '0');

  const formattedTime = `${hours}:${minutes}`;

  await setNotificationTime(formattedTime);

  setShowTimeModal(false);
};


  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <ScrollView>
        {/* Header */}
        <View style={[styles.header, { backgroundColor: theme.primary }]}>
          <Text style={styles.headerTitle}>Configurações</Text>
          <Text style={styles.headerSubtitle}>
            Personalize seu aplicativo
          </Text>
        </View>

        {/* Aparência */}
        <View style={[styles.section, { backgroundColor: theme.card }]}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>
            🎨 Aparência
          </Text>

          <View style={[styles.settingRow, { borderBottomColor: theme.border }]}>
            <View style={styles.settingInfo}>
              <Text style={[styles.settingLabel, { color: theme.text }]}>
                Modo Escuro
              </Text>
              <Text style={[styles.settingDescription, { color: theme.textSecondary }]}>
                Tema escuro para economizar bateria
              </Text>
            </View>
            <Switch
              value={darkMode}
              onValueChange={handleToggleDarkMode}
              trackColor={{ false: '#ccc', true: theme.primary }}
              thumbColor="#fff"
            />
          </View>
        </View>

        {/* Região e Moeda */}
        <View style={[styles.section, { backgroundColor: theme.card }]}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>
            🌍 Região e Moeda
          </Text>

          <TouchableOpacity
            style={[styles.settingRow, { borderBottomColor: theme.border }]}
            onPress={() => setShowCurrencyModal(true)}
          >
            <View style={styles.settingInfo}>
              <Text style={[styles.settingLabel, { color: theme.text }]}>
                Moeda
              </Text>
              <Text style={[styles.settingDescription, { color: theme.textSecondary }]}>
                {currentCurrency?.name}
              </Text>
            </View>
            <Text style={[styles.settingValue, { color: theme.primary }]}>
              {currentCurrency?.symbol}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.settingRow, { borderBottomColor: theme.border }]}
            onPress={() => setShowLanguageModal(true)}
          >
            <View style={styles.settingInfo}>
              <Text style={[styles.settingLabel, { color: theme.text }]}>
                Idioma
              </Text>
              <Text style={[styles.settingDescription, { color: theme.textSecondary }]}>
                {currentLanguage?.name}
              </Text>
            </View>
            <Text style={styles.settingValue}>
              {currentLanguage?.flag}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Notificações */}
        <View style={[styles.section, { backgroundColor: theme.card }]}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>
            🔔 Notificações
          </Text>

          <View style={[styles.settingRow, { borderBottomColor: theme.border }]}>
            <View style={styles.settingInfo}>
              <Text style={[styles.settingLabel, { color: theme.text }]}>
                Notificações Ativadas
              </Text>
              <Text style={[styles.settingDescription, { color: theme.textSecondary }]}>
                Ativar/desativar todas as notificações
              </Text>
            </View>
            <Switch
              value={notifications.enabled}
              onValueChange={(value) => updateNotifications({ enabled: value })}
              trackColor={{ false: '#ccc', true: theme.primary }}
              thumbColor="#fff"
            />
          </View>

          {notifications.enabled && (
            <>
              <View style={[styles.settingRow, { borderBottomColor: theme.border }]}>
                <View style={styles.settingInfo}>
                  <Text style={[styles.settingLabel, { color: theme.text }]}>
                    Lembrete de Contas
                  </Text>
                  <Text style={[styles.settingDescription, { color: theme.textSecondary }]}>
                    Avisar sobre contas a vencer
                  </Text>
                </View>
                <Switch
                  value={notifications.bills}
                  onValueChange={(value) => updateNotifications({ bills: value })}
                  trackColor={{ false: '#ccc', true: theme.primary }}
                  thumbColor="#fff"
                />
              </View>

              <View style={[styles.settingRow, { borderBottomColor: theme.border }]}>
                <View style={styles.settingInfo}>
                  <Text style={[styles.settingLabel, { color: theme.text }]}>
                    Lembrete de Dízimo
                  </Text>
                  <Text style={[styles.settingDescription, { color: theme.textSecondary }]}>
                    Lembrar de pagar o dízimo mensalmente
                  </Text>
                </View>
                <Switch
                  value={notifications.tithe}
                  onValueChange={(value) => updateNotifications({ tithe: value })}
                  trackColor={{ false: '#ccc', true: theme.primary }}
                  thumbColor="#fff"
                />
              </View>

              <View style={[styles.settingRow, { borderBottomColor: theme.border }]}>
                <View style={styles.settingInfo}>
                  <Text style={[styles.settingLabel, { color: theme.text }]}>
                    Avisos de Metas
                  </Text>
                  <Text style={[styles.settingDescription, { color: theme.textSecondary }]}>
                    Progresso e conquistas de metas
                  </Text>
                </View>
                <Switch
                  value={notifications.goals}
                  onValueChange={(value) => updateNotifications({ goals: value })}
                  trackColor={{ false: '#ccc', true: theme.primary }}
                  thumbColor="#fff"
                />
              </View>

              <View style={[styles.settingRow, { borderBottomColor: theme.border }]}>
                <View style={styles.settingInfo}>
                  <Text style={[styles.settingLabel, { color: theme.text }]}>
                    Lembrete Diário
                  </Text>
                  <Text style={[styles.settingDescription, { color: theme.textSecondary }]}>
                    Lembrar de registrar gastos diários
                  </Text>
                </View>
                <Switch
                  value={notifications.dailyReminder}
                  onValueChange={(value) => updateNotifications({ dailyReminder: value })}
                  trackColor={{ false: '#ccc', true: theme.primary }}
                  thumbColor="#fff"
                />
              </View>

              <TouchableOpacity
                style={[styles.settingRow, { borderBottomColor: 'transparent' }]}
                onPress={() => setShowTimeModal(true)}
              >
                <View style={styles.settingInfo}>
                  <Text style={[styles.settingLabel, { color: theme.text }]}>
                    Horário das Notificações
                  </Text>
                  <Text style={[styles.settingDescription, { color: theme.textSecondary }]}>
                    Definir horário padrão
                  </Text>
                </View>
                <Text style={[styles.settingValue, { color: theme.primary }]}>
                  {notifications.time}
                </Text>
              </TouchableOpacity>
            </>
          )}
        </View>

        {/* Outros */}
        <View style={[styles.section, { backgroundColor: theme.card }]}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>
            ⚙️ Outros
          </Text>

          <TouchableOpacity
            style={[styles.settingRow, { borderBottomColor: theme.border }]}
            onPress={() => navigation.navigate('About')}
          >
            <View style={styles.settingInfo}>
              <Text style={[styles.settingLabel, { color: theme.text }]}>
                Sobre o App
              </Text>
              <Text style={[styles.settingDescription, { color: theme.textSecondary }]}>
                Versão, licenças e créditos
              </Text>
            </View>
            <Text style={[styles.settingArrow, { color: theme.textSecondary }]}>›</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.settingRow, { borderBottomColor: 'transparent' }]}
            onPress={handleResetSettings}
          >
            <View style={styles.settingInfo}>
              <Text style={[styles.settingLabel, { color: theme.danger }]}>
                Resetar Configurações
              </Text>
              <Text style={[styles.settingDescription, { color: theme.textSecondary }]}>
                Restaurar configurações padrão
              </Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Informações */}
        <View style={[styles.infoSection, { backgroundColor: theme.card, borderColor: theme.border }]}>
          <Text style={[styles.infoText, { color: theme.textSecondary }]}>
            Controle Financeiro v1.0.0{'\n'}
            Desenvolvido com ❤️ em React Native
          </Text>
        </View>
      </ScrollView>

      {/* Modal de Moeda */}
      <Modal
        visible={showCurrencyModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowCurrencyModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: theme.card }]}>
            <Text style={[styles.modalTitle, { color: theme.text }]}>
              Selecionar Moeda
            </Text>
            <ScrollView>
              {availableCurrencies.map((curr) => (
                <TouchableOpacity
                  key={curr.code}
                  style={[
                    styles.modalOption,
                    { borderBottomColor: theme.border },
                    currency === curr.code && { backgroundColor: theme.primary + '20' }
                  ]}
                  onPress={() => handleSelectCurrency(curr.code)}
                >
                  <Text style={[styles.modalOptionText, { color: theme.text }]}>
                    {curr.symbol} {curr.name}
                  </Text>
                  {currency === curr.code && (
                    <Text style={{ color: theme.primary }}>✓</Text>
                  )}
                </TouchableOpacity>
              ))}
            </ScrollView>
            <TouchableOpacity
              style={[styles.modalCloseButton, { backgroundColor: theme.border }]}
              onPress={() => setShowCurrencyModal(false)}
            >
              <Text style={[styles.modalCloseText, { color: theme.text }]}>
                Fechar
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Modal de Idioma */}
      <Modal
        visible={showLanguageModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowLanguageModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: theme.card }]}>
            <Text style={[styles.modalTitle, { color: theme.text }]}>
              Selecionar Idioma
            </Text>
            <ScrollView>
              {availableLanguages.map((lang) => (
                <TouchableOpacity
                  key={lang.code}
                  style={[
                    styles.modalOption,
                    { borderBottomColor: theme.border },
                    language === lang.code && { backgroundColor: theme.primary + '20' }
                  ]}
                  onPress={() => handleSelectLanguage(lang.code)}
                >
                  <Text style={[styles.modalOptionText, { color: theme.text }]}>
                    {lang.flag} {lang.name}
                  </Text>
                  {language === lang.code && (
                    <Text style={{ color: theme.primary }}>✓</Text>
                  )}
                </TouchableOpacity>
              ))}
            </ScrollView>
            <TouchableOpacity
              style={[styles.modalCloseButton, { backgroundColor: theme.border }]}
              onPress={() => setShowLanguageModal(false)}
            >
              <Text style={[styles.modalCloseText, { color: theme.text }]}>
                Fechar
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      {/* Modal de Horário */}
<Modal
  visible={showTimeModal}
  transparent
  animationType="slide"
  onRequestClose={() => setShowTimeModal(false)}
>
  <View style={styles.modalOverlay}>
    <View style={[styles.modalContent, { backgroundColor: theme.card }]}>
      <Text style={[styles.modalTitle, { color: theme.text }]}>
        Definir Horário
      </Text>

      <View style={{ paddingHorizontal: 20 }}>
        <DateTimePicker
  value={selectedTime}
  mode="time"
  is24Hour
  display={Platform.OS === 'ios' ? 'spinner' : 'default'}
  onChange={(event, date) => {
    if (Platform.OS === 'android') {
      if (event.type === 'set' && date) {
        setSelectedTime(date);
        setTimeout(handleSaveTime, 100);
      } else {
        setShowTimeModal(false);
      }
    } else if (date) {
      setSelectedTime(date);
    }
  }}
/>

      </View>

      <TouchableOpacity
        style={[styles.modalCloseButton, { backgroundColor: theme.primary }]}
        onPress={handleSaveTime}
      >
        <Text style={{ color: '#fff', fontWeight: '600' }}>
          Salvar Horário
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.modalCloseButton, { backgroundColor: theme.border }]}
        onPress={() => setShowTimeModal(false)}
      >
        <Text style={[styles.modalCloseText, { color: theme.text }]}>
          Cancelar
        </Text>
      </TouchableOpacity>
    </View>
  </View>
</Modal>

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
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
  section: {
    marginTop: 15,
    paddingVertical: 10,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
  },
  settingInfo: {
    flex: 1,
    marginRight: 15,
  },
  settingLabel: {
    fontSize: 15,
    fontWeight: '500',
    marginBottom: 3,
  },
  settingDescription: {
    fontSize: 13,
    lineHeight: 18,
  },
  settingValue: {
    fontSize: 16,
    fontWeight: '600',
  },
  settingArrow: {
    fontSize: 20,
  },
  infoSection: {
    padding: 20,
    margin: 15,
    marginBottom: 30,
    borderRadius: 10,
    borderWidth: 1,
    alignItems: 'center',
  },
  infoText: {
    fontSize: 12,
    textAlign: 'center',
    lineHeight: 18,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '70%',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    padding: 20,
    textAlign: 'center',
  },
  modalOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
  },
  modalOptionText: {
    fontSize: 15,
  },
  modalCloseButton: {
    padding: 15,
    margin: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  modalCloseText: {
    fontSize: 16,
    fontWeight: '600',
  },
});

export default SettingsScreen;