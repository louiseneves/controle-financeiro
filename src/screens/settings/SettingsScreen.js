import React, { useEffect, useState,useMemo } from 'react';
import { useTheme } from '../../context/ThemeContext';
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
import { t } from '../../i18n';


const SettingsScreen = ({ navigation }) => {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
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
  };

  const handleResetSettings = () => {
    Alert.alert(
      t('settings.resetConfirmTitle'),
      t('settings.resetConfirmMessage'),
      [
        { text: t('settings.cancel'), style: 'cancel' },
        {
          style: 'destructive',
          onPress: async () => {
            await resetSettings();
            Alert.alert(t('settings.successTitle'), t('settings.resetSuccessMessage'));
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
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView>
        {/* Header */}
        <View style={[styles.header, { backgroundColor: colors.primary }]}>
          <Text style={styles.headerTitle}>{t('settings.title')}</Text>
          <Text style={styles.headerSubtitle}>
            {t('settings.subtitle')}
          </Text>
        </View>

        {/* Aparência */}
        <View style={[styles.section, { backgroundColor: colors.card }]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            {t('settings.appearance')}
          </Text>

          <View style={[styles.settingRow, { borderBottomColor: colors.border }]}>
            <View style={styles.settingInfo}>
              <Text style={[styles.settingLabel, { color: colors.text }]}>
                {t('settings.darkMode')}
              </Text>
              <Text style={[styles.settingDescription, { color: colors.textSecondary }]}>
                {t('settings.darkModeDesc')}
              </Text>
            </View>
            <Switch
              value={darkMode}
              onValueChange={handleToggleDarkMode}
              trackColor={{
                false: colors.border,
                true: colors.primary,
              }}
              thumbColor={colors.card}
            />
          </View>
        </View>

        {/* Região e Moeda */}
        <View style={[styles.section, { backgroundColor: colors.card }]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            {t('settings.regionCurrency')}
          </Text>

          <TouchableOpacity
            style={[styles.settingRow, { borderBottomColor: colors.border }]}
            onPress={() => setShowCurrencyModal(true)}
          >
            <View style={styles.settingInfo}>
              <Text style={[styles.settingLabel, { color: colors.text }]}>
                {t('settings.currency')}
              </Text>
              <Text style={[styles.settingDescription, { color: colors.textSecondary }]}>
                {currentCurrency?.name}
              </Text>
            </View>
            <Text style={[styles.settingValue, { color: colors.primary }]}>
              {currentCurrency?.symbol}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.settingRow, { borderBottomColor: colors.border }]}
            onPress={() => setShowLanguageModal(true)}
          >
            <View style={styles.settingInfo}>
              <Text style={[styles.settingLabel, { color: colors.text }]}>
                {t('settings.language')}
              </Text>
              <Text style={[styles.settingDescription, { color: colors.textSecondary }]}>
                {currentLanguage?.name}
              </Text>
            </View>
            <Text style={styles.settingValue}>
              {currentLanguage?.flag}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Notificações */}
        <View style={[styles.section, { backgroundColor: colors.card }]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            {t('settings.notifications')}
          </Text>

          <View style={[styles.settingRow, { borderBottomColor: colors.border }]}>
            <View style={styles.settingInfo}>
              <Text style={[styles.settingLabel, { color: colors.text }]}>
                {t('settings.notificationsEnabled')}
              </Text>
              <Text style={[styles.settingDescription, { color: colors.textSecondary }]}>
                {t('settings.notificationsEnabledDesc')}
              </Text>
            </View>
            <Switch
              value={notifications.enabled}
              onValueChange={(value) => updateNotifications({ enabled: value })}
              trackColor={{
    false: colors.border,
    true: colors.primary,
  }}
  thumbColor={colors.card}
            />
          </View>

          {notifications.enabled && (
            <>
              <View style={[styles.settingRow, { borderBottomColor: colors.border }]}>
                <View style={styles.settingInfo}>
                  <Text style={[styles.settingLabel, { color: colors.text }]}>
                    {t('settings.bills')}
                  </Text>
                  <Text style={[styles.settingDescription, { color: colors.textSecondary }]}>
                    {t('settings.billsDesc')}
                  </Text>
                </View>
                <Switch
                  value={notifications.bills}
                  onValueChange={(value) => updateNotifications({ bills: value })}
                  trackColor={{
    false: colors.border,
    true: colors.primary,
  }}
  thumbColor={colors.card}
                />
              </View>

              <View style={[styles.settingRow, { borderBottomColor: colors.border }]}>
                <View style={styles.settingInfo}>
                  <Text style={[styles.settingLabel, { color: colors.text }]}>
                    {t('settings.tithe')}
                  </Text>
                  <Text style={[styles.settingDescription, { color: colors.textSecondary }]}>
                    {t('settings.titheDesc')}
                  </Text>
                </View>
                <Switch
                  value={notifications.tithe}
                  onValueChange={(value) => updateNotifications({ tithe: value })}
                  trackColor={{
    false: colors.border,
    true: colors.primary,
  }}
  thumbColor={colors.card}
                />
              </View>

              <View style={[styles.settingRow, { borderBottomColor: colors.border }]}>
                <View style={styles.settingInfo}>
                  <Text style={[styles.settingLabel, { color: colors.text }]}>
                    {t('settings.goals')}
                  </Text>
                  <Text style={[styles.settingDescription, { color: colors.textSecondary }]}>
                    {t('settings.goalsDesc')}
                  </Text>
                </View>
                <Switch
                  value={notifications.goals}
                  onValueChange={(value) => updateNotifications({ goals: value })}
                  trackColor={{
    false: colors.border,
    true: colors.primary,
  }}
  thumbColor={colors.card}
                />
              </View>

              <View style={[styles.settingRow, { borderBottomColor: colors.border }]}>
                <View style={styles.settingInfo}>
                  <Text style={[styles.settingLabel, { color: colors.text }]}>
                    {t('settings.daily')}
                  </Text>
                  <Text style={[styles.settingDescription, { color: colors.textSecondary }]}>
                    {t('settings.dailyDesc')}
                  </Text>
                </View>
                <Switch
                  value={notifications.dailyReminder}
                  onValueChange={(value) => updateNotifications({ dailyReminder: value })}
                  trackColor={{
    false: colors.border,
    true: colors.primary,
  }}
  thumbColor={colors.card}
                />
              </View>

              <TouchableOpacity
                style={[styles.settingRow, { borderBottomColor: 'transparent' }]}
                onPress={() => setShowTimeModal(true)}
              >
                <View style={styles.settingInfo}>
                  <Text style={[styles.settingLabel, { color: colors.text }]}>
                    {t('settings.notificationTime')}
                  </Text>
                  <Text style={[styles.settingDescription, { color: colors.textSecondary }]}>
                    {t('settings.notificationTimeDesc')}
                  </Text>
                </View>
                <Text style={[styles.settingValue, { color: colors.primary }]}>
                  {notifications.time}
                </Text>
              </TouchableOpacity>
            </>
          )}
        </View>

        {/* Outros */}
        <View style={[styles.section, { backgroundColor: colors.card }]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
             {t('settings.others')}
          </Text>

          <TouchableOpacity
            style={[styles.settingRow, { borderBottomColor: colors.border }]}
            onPress={() => navigation.navigate('About')}
          >
            <View style={styles.settingInfo}>
              <Text style={[styles.settingLabel, { color: colors.text }]}>
                {t('settings.about')}
              </Text>
              <Text style={[styles.settingDescription, { color: colors.textSecondary }]}>
                {t('settings.aboutDesc')}
              </Text>
            </View>
            <Text style={[styles.settingArrow, { color: colors.textSecondary }]}>›</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.settingRow, { borderBottomColor: 'transparent' }]}
            onPress={handleResetSettings}
          >
            <View style={styles.settingInfo}>
              <Text style={[styles.settingLabel, { color: colors.errorLight }]}>
                {t('settings.reset')}
              </Text>
              <Text style={[styles.settingDescription, { color: colors.textSecondary }]}>
                {t('settings.resetDesc')}
              </Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Informações */}
        <View style={[styles.infoSection, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Text style={[styles.infoText, { color: colors.textSecondary }]}>
            {t('settings.footer')}
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
          <View style={[styles.modalContent, { backgroundColor: colors.card }]}>
            <Text style={[styles.modalTitle, { color: colors.text }]}>
              {t('settings.selectCurrency')}
            </Text>
            <ScrollView>
              {availableCurrencies.map((curr) => (
                <TouchableOpacity
                  key={curr.code}
                  style={[
                    styles.modalOption,
                    { borderBottomColor: colors.border },
                    currency === curr.code && { backgroundColor: colors.primary + '20' }
                  ]}
                  onPress={() => handleSelectCurrency(curr.code)}
                >
                  <Text style={[styles.modalOptionText, { color: colors.text }]}>
                    {curr.symbol} {curr.name}
                  </Text>
                  {currency === curr.code && (
                    <Text style={{ color: colors.primary }}>✓</Text>
                  )}
                </TouchableOpacity>
              ))}
            </ScrollView>
            <TouchableOpacity
              style={[styles.modalCloseButton, { backgroundColor: colors.border }]}
              onPress={() => setShowCurrencyModal(false)}
            >
              <Text style={[styles.modalCloseText, { color: colors.text }]}>
                {t('settings.close')}
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
          <View style={[styles.modalContent, { backgroundColor: colors.card }]}>
            <Text style={[styles.modalTitle, { color: colors.text }]}>
              {t('settings.selectLanguage')}
            </Text>
            <ScrollView>
              {availableLanguages.map((lang) => (
                <TouchableOpacity
                  key={lang.code}
                  style={[
                    styles.modalOption,
                    { borderBottomColor: colors.border },
                    language === lang.code && { backgroundColor: colors.primary + '20' }
                  ]}
                  onPress={() => handleSelectLanguage(lang.code)}
                >
                  <Text style={[styles.modalOptionText, { color: colors.text }]}>
                    {lang.flag} {lang.name}
                  </Text>
                  {language === lang.code && (
                    <Text style={{ color: colors.primary }}>✓</Text>
                  )}
                </TouchableOpacity>
              ))}
            </ScrollView>
            <TouchableOpacity
              style={[styles.modalCloseButton, { backgroundColor: colors.border }]}
              onPress={() => setShowLanguageModal(false)}
            >
              <Text style={[styles.modalCloseText, { color: colors.text }]}>
                {t('settings.close')}
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
    <View style={[styles.modalContent, { backgroundColor: colors.card }]}>
      <Text style={[styles.modalTitle, { color: colors.text }]}>
        {t('settings.timeTitle')}
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
        style={[styles.modalCloseButton, { backgroundColor: colors.primary }]}
        onPress={handleSaveTime}
      >
        <Text style={{ color: '#fff', fontWeight: '600' }}>
          {t('settings.saveTitle')}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.modalCloseButton, { backgroundColor: colors.border }]}
        onPress={() => setShowTimeModal(false)}
      >
        <Text style={[styles.modalCloseText, { color: colors.text }]}>
          {t('settings.cancel')}
        </Text>
      </TouchableOpacity>
    </View>
  </View>
</Modal>

    </View>
  );
};

const createStyles = (colors) =>
  StyleSheet.create({
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