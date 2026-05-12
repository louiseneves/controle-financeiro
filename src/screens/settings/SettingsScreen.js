import React, { useEffect, useState, useMemo } from "react";
import { useTheme } from "../../context/ThemeContext";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert,
  Modal,
} from "react-native";

import { Platform } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";

import {
  MaterialCommunityIcons,
  FontAwesome6,
  MaterialIcons,
} from "@expo/vector-icons";

import useSettingsStore from "../../store/settingsStore";
import { t } from "../../i18n";

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
  const [showTitheDateModal, setShowTitheDateModal] = useState(false);

  const [selectedTime, setSelectedTime] = useState(new Date());

  const [titheDay, setTitheDay] = useState(notifications?.titheDay || 5);

  const [titheMonth, setTitheMonth] = useState(notifications?.titheMonth || 1);

  useEffect(() => {
    loadSettings();
  }, []);

  useEffect(() => {
    if (!notifications?.time) return;

    const [hour, minute] = notifications.time.split(":");

    const date = new Date();

    date.setHours(Number(hour));
    date.setMinutes(Number(minute));
    date.setSeconds(0);

    setSelectedTime(date);
  }, [notifications?.time]);

  useEffect(() => {
    if (notifications?.titheDay) {
      setTitheDay(notifications.titheDay);
    }

    if (notifications?.titheMonth) {
      setTitheMonth(notifications.titheMonth);
    }
  }, [notifications]);

  const currentCurrency = availableCurrencies.find((c) => c.code === currency);

  const currentLanguage = availableLanguages.find((l) => l.code === language);

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

  const handleSaveTime = async () => {
    const hours = selectedTime.getHours().toString().padStart(2, "0");

    const minutes = selectedTime.getMinutes().toString().padStart(2, "0");

    const formattedTime = `${hours}:${minutes}`;

    await setNotificationTime(formattedTime);

    setShowTimeModal(false);
  };

  const handleSaveTitheDate = async () => {
    await updateNotifications({
      titheDay,
      titheMonth,
    });

    setShowTitheDateModal(false);
  };

  const handleResetSettings = () => {
    Alert.alert(
      t("settings.resetConfirmTitle"),
      t("settings.resetConfirmDesc"),
      [
        {
          text: t("settings.cancel"),
          style: "cancel",
        },
        {
          text: t("settings.reset"),
          style: "destructive",

          onPress: async () => {
            await resetSettings();

            Alert.alert(
              t("settings.successTitle"),
              t("settings.resetSuccessMessage"),
            );
          },
        },
      ],
    );
  };

  const months = [
    "Janeiro",
    "Fevereiro",
    "Março",
    "Abril",
    "Maio",
    "Junho",
    "Julho",
    "Agosto",
    "Setembro",
    "Outubro",
    "Novembro",
    "Dezembro",
  ];

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: colors.background,
        },
      ]}
    >
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* HEADER */}

        <View
          style={[
            styles.header,
            {
              backgroundColor: colors.primary,
            },
          ]}
        >
          <Text style={styles.headerTitle}>{t("settings.title")}</Text>

          <Text style={styles.headerSubtitle}>{t("settings.subtitle")}</Text>
        </View>

        {/* APARÊNCIA */}

        <View
          style={[
            styles.section,
            {
              backgroundColor: colors.card,
            },
          ]}
        >
          <MaterialCommunityIcons
            name="palette"
            size={20}
            color={colors.text}
            style={styles.sectionIcon}
          />

          <Text
            style={[
              styles.sectionTitle,
              {
                color: colors.text,
              },
            ]}
          >
            {t("settings.appearance")}
          </Text>

          <View
            style={[
              styles.settingRow,
              {
                borderBottomColor: colors.border,
              },
            ]}
          >
            <View style={styles.settingInfo}>
              <Text
                style={[
                  styles.settingLabel,
                  {
                    color: colors.text,
                  },
                ]}
              >
                {t("settings.darkMode")}
              </Text>

              <Text
                style={[
                  styles.settingDescription,
                  {
                    color: colors.textSecondary,
                  },
                ]}
              >
                {t("settings.darkModeDesc")}
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

        {/* REGIÃO */}

        <View
          style={[
            styles.section,
            {
              backgroundColor: colors.card,
            },
          ]}
        >
          <FontAwesome6
            name="globe"
            size={20}
            color={colors.text}
            style={styles.sectionIcon}
          />

          <Text
            style={[
              styles.sectionTitle,
              {
                color: colors.text,
              },
            ]}
          >
            {t("settings.regionCurrency")}
          </Text>

          <TouchableOpacity
            style={[
              styles.settingRow,
              {
                borderBottomColor: colors.border,
              },
            ]}
            onPress={() => setShowCurrencyModal(true)}
          >
            <View style={styles.settingInfo}>
              <Text
                style={[
                  styles.settingLabel,
                  {
                    color: colors.text,
                  },
                ]}
              >
                {t("settings.currency")}
              </Text>

              <Text
                style={[
                  styles.settingDescription,
                  {
                    color: colors.textSecondary,
                  },
                ]}
              >
                {currentCurrency?.name}
              </Text>
            </View>

            <Text
              style={[
                styles.settingValue,
                {
                  color: colors.primary,
                },
              ]}
            >
              {currentCurrency?.symbol}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.settingRow,
              {
                borderBottomColor: "transparent",
              },
            ]}
            onPress={() => setShowLanguageModal(true)}
          >
            <View style={styles.settingInfo}>
              <Text
                style={[
                  styles.settingLabel,
                  {
                    color: colors.text,
                  },
                ]}
              >
                {t("settings.language")}
              </Text>

              <Text
                style={[
                  styles.settingDescription,
                  {
                    color: colors.textSecondary,
                  },
                ]}
              >
                {currentLanguage?.name}
              </Text>
            </View>

            <Text style={styles.settingValue}>{currentLanguage?.flag}</Text>
          </TouchableOpacity>
        </View>

        {/* NOTIFICAÇÕES */}

        <View
          style={[
            styles.section,
            {
              backgroundColor: colors.card,
            },
          ]}
        >
          <MaterialIcons
            name="notifications"
            size={20}
            color={colors.text}
            style={styles.sectionIcon}
          />

          <Text
            style={[
              styles.sectionTitle,
              {
                color: colors.text,
              },
            ]}
          >
            {t("settings.notifications")}
          </Text>

          {/* ENABLE */}

          <View
            style={[
              styles.settingRow,
              {
                borderBottomColor: colors.border,
              },
            ]}
          >
            <View style={styles.settingInfo}>
              <Text
                style={[
                  styles.settingLabel,
                  {
                    color: colors.text,
                  },
                ]}
              >
                {t("settings.notificationsEnabled")}
              </Text>

              <Text
                style={[
                  styles.settingDescription,
                  {
                    color: colors.textSecondary,
                  },
                ]}
              >
                {t("settings.notificationsEnabledDesc")}
              </Text>
            </View>

            <Switch
              value={notifications.enabled}
              onValueChange={(value) =>
                updateNotifications({
                  enabled: value,
                })
              }
              trackColor={{
                false: colors.border,
                true: colors.primary,
              }}
              thumbColor={colors.card}
            />
          </View>

          {notifications.enabled && (
            <>
              {/* BILLS */}

              <View
                style={[
                  styles.settingRow,
                  {
                    borderBottomColor: colors.border,
                  },
                ]}
              >
                <View style={styles.settingInfo}>
                  <Text
                    style={[
                      styles.settingLabel,
                      {
                        color: colors.text,
                      },
                    ]}
                  >
                    {t("settings.bills")}
                  </Text>

                  <Text
                    style={[
                      styles.settingDescription,
                      {
                        color: colors.textSecondary,
                      },
                    ]}
                  >
                    {t("settings.billsDesc")}
                  </Text>
                </View>

                <Switch
                  value={notifications.bills}
                  onValueChange={(value) =>
                    updateNotifications({
                      bills: value,
                    })
                  }
                  trackColor={{
                    false: colors.border,
                    true: colors.primary,
                  }}
                  thumbColor={colors.card}
                />
              </View>

              {/* TITHE */}

              <View
                style={[
                  styles.settingRow,
                  {
                    borderBottomColor: colors.border,
                  },
                ]}
              >
                <View style={styles.settingInfo}>
                  <Text
                    style={[
                      styles.settingLabel,
                      {
                        color: colors.text,
                      },
                    ]}
                  >
                    {t("settings.tithe")}
                  </Text>

                  <Text
                    style={[
                      styles.settingDescription,
                      {
                        color: colors.textSecondary,
                      },
                    ]}
                  >
                    {t("settings.titheDesc")}
                  </Text>
                </View>

                <Switch
                  value={notifications.tithe}
                  onValueChange={(value) =>
                    updateNotifications({
                      tithe: value,
                    })
                  }
                  trackColor={{
                    false: colors.border,
                    true: colors.primary,
                  }}
                  thumbColor={colors.card}
                />
              </View>

              {/* DATA DÍZIMO */}

              {notifications.tithe && (
                <TouchableOpacity
                  style={[
                    styles.settingRow,
                    {
                      borderBottomColor: colors.border,
                    },
                  ]}
                  onPress={() => setShowTitheDateModal(true)}
                >
                  <View style={styles.settingInfo}>
                    <Text
                      style={[
                        styles.settingLabel,
                        {
                          color: colors.text,
                        },
                      ]}
                    >
                      Data do lembrete de dízimo
                    </Text>

                    <Text
                      style={[
                        styles.settingDescription,
                        {
                          color: colors.textSecondary,
                        },
                      ]}
                    >
                      Dia {titheDay} de {months[titheMonth - 1]}
                    </Text>
                  </View>

                  <Text
                    style={[
                      styles.settingArrow,
                      {
                        color: colors.textSecondary,
                      },
                    ]}
                  >
                    ›
                  </Text>
                </TouchableOpacity>
              )}

              {/* GOALS */}

              <View
                style={[
                  styles.settingRow,
                  {
                    borderBottomColor: colors.border,
                  },
                ]}
              >
                <View style={styles.settingInfo}>
                  <Text
                    style={[
                      styles.settingLabel,
                      {
                        color: colors.text,
                      },
                    ]}
                  >
                    {t("settings.goals")}
                  </Text>

                  <Text
                    style={[
                      styles.settingDescription,
                      {
                        color: colors.textSecondary,
                      },
                    ]}
                  >
                    {t("settings.goalsDesc")}
                  </Text>
                </View>

                <Switch
                  value={notifications.goals}
                  onValueChange={(value) =>
                    updateNotifications({
                      goals: value,
                    })
                  }
                  trackColor={{
                    false: colors.border,
                    true: colors.primary,
                  }}
                  thumbColor={colors.card}
                />
              </View>

              {/* DAILY */}

              <View
                style={[
                  styles.settingRow,
                  {
                    borderBottomColor: colors.border,
                  },
                ]}
              >
                <View style={styles.settingInfo}>
                  <Text
                    style={[
                      styles.settingLabel,
                      {
                        color: colors.text,
                      },
                    ]}
                  >
                    {t("settings.daily")}
                  </Text>

                  <Text
                    style={[
                      styles.settingDescription,
                      {
                        color: colors.textSecondary,
                      },
                    ]}
                  >
                    {t("settings.dailyDesc")}
                  </Text>
                </View>

                <Switch
                  value={notifications.dailyReminder}
                  onValueChange={(value) =>
                    updateNotifications({
                      dailyReminder: value,
                    })
                  }
                  trackColor={{
                    false: colors.border,
                    true: colors.primary,
                  }}
                  thumbColor={colors.card}
                />
              </View>

              {/* HORÁRIO */}

              <TouchableOpacity
                style={[
                  styles.settingRow,
                  {
                    borderBottomColor: "transparent",
                  },
                ]}
                onPress={() => setShowTimeModal(true)}
              >
                <View style={styles.settingInfo}>
                  <Text
                    style={[
                      styles.settingLabel,
                      {
                        color: colors.text,
                      },
                    ]}
                  >
                    {t("settings.notificationTime")}
                  </Text>

                  <Text
                    style={[
                      styles.settingDescription,
                      {
                        color: colors.textSecondary,
                      },
                    ]}
                  >
                    {t("settings.notificationTimeDesc")}
                  </Text>
                </View>

                <Text
                  style={[
                    styles.settingValue,
                    {
                      color: colors.primary,
                    },
                  ]}
                >
                  {notifications.time}
                </Text>
              </TouchableOpacity>
            </>
          )}
        </View>

        {/* OUTROS */}

        <View
          style={[
            styles.section,
            {
              backgroundColor: colors.card,
            },
          ]}
        >
          <MaterialCommunityIcons
            name="cog"
            size={20}
            color={colors.text}
            style={styles.sectionIcon}
          />

          <Text
            style={[
              styles.sectionTitle,
              {
                color: colors.text,
              },
            ]}
          >
            {t("settings.others")}
          </Text>

          <TouchableOpacity
            style={[
              styles.settingRow,
              {
                borderBottomColor: colors.border,
              },
            ]}
            onPress={() => navigation.navigate("About")}
          >
            <View style={styles.settingInfo}>
              <Text
                style={[
                  styles.settingLabel,
                  {
                    color: colors.text,
                  },
                ]}
              >
                {t("settings.about")}
              </Text>

              <Text
                style={[
                  styles.settingDescription,
                  {
                    color: colors.textSecondary,
                  },
                ]}
              >
                {t("settings.aboutDesc")}
              </Text>
            </View>

            <Text
              style={[
                styles.settingArrow,
                {
                  color: colors.textSecondary,
                },
              ]}
            >
              ›
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.settingRow,
              {
                borderBottomColor: "transparent",
              },
            ]}
            onPress={handleResetSettings}
          >
            <View style={styles.settingInfo}>
              <Text
                style={[
                  styles.settingLabel,
                  {
                    color: colors.errorLight,
                  },
                ]}
              >
                {t("settings.reset")}
              </Text>

              <Text
                style={[
                  styles.settingDescription,
                  {
                    color: colors.textSecondary,
                  },
                ]}
              >
                {t("settings.resetDesc")}
              </Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* FOOTER */}

        <View style={styles.footer}>
          <Text
            style={[
              styles.footerText,
              {
                color: colors.textTertiary,
              },
            ]}
          >
            {t("settings.footer.appName")}
          </Text>

          <View style={styles.footerRow}>
            <Text
              style={[
                styles.footerText,
                {
                  color: colors.textTertiary,
                },
              ]}
            >
              {t("settings.footer.madeWithPrefix")}
            </Text>

            <MaterialCommunityIcons
              name="heart"
              size={14}
              color={colors.error}
              style={{
                marginHorizontal: 4,
              }}
            />

            <Text
              style={[
                styles.footerText,
                {
                  color: colors.textTertiary,
                },
              ]}
            >
              {t("settings.footer.madeWithSuffix")}
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* MODAL MOEDA */}

      <Modal
        visible={showCurrencyModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowCurrencyModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View
            style={[
              styles.modalContent,
              {
                backgroundColor: colors.card,
              },
            ]}
          >
            <Text
              style={[
                styles.modalTitle,
                {
                  color: colors.text,
                },
              ]}
            >
              {t("settings.selectCurrency")}
            </Text>

            <ScrollView>
              {availableCurrencies.map((curr) => (
                <TouchableOpacity
                  key={curr.code}
                  style={[
                    styles.modalOption,
                    {
                      borderBottomColor: colors.border,
                    },
                    currency === curr.code && {
                      backgroundColor: colors.primary + "20",
                    },
                  ]}
                  onPress={() => handleSelectCurrency(curr.code)}
                >
                  <Text
                    style={[
                      styles.modalOptionText,
                      {
                        color: colors.text,
                      },
                    ]}
                  >
                    {curr.symbol} {curr.name}
                  </Text>

                  {currency === curr.code && (
                    <Text
                      style={{
                        color: colors.primary,
                      }}
                    >
                      ✓
                    </Text>
                  )}
                </TouchableOpacity>
              ))}
            </ScrollView>

            <TouchableOpacity
              style={[
                styles.modalCloseButton,
                {
                  backgroundColor: colors.border,
                },
              ]}
              onPress={() => setShowCurrencyModal(false)}
            >
              <Text
                style={[
                  styles.modalCloseText,
                  {
                    color: colors.text,
                  },
                ]}
              >
                {t("settings.close")}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* MODAL IDIOMA */}

      <Modal
        visible={showLanguageModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowLanguageModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View
            style={[
              styles.modalContent,
              {
                backgroundColor: colors.card,
              },
            ]}
          >
            <Text
              style={[
                styles.modalTitle,
                {
                  color: colors.text,
                },
              ]}
            >
              {t("settings.selectLanguage")}
            </Text>

            <ScrollView>
              {availableLanguages.map((lang) => (
                <TouchableOpacity
                  key={lang.code}
                  style={[
                    styles.modalOption,
                    {
                      borderBottomColor: colors.border,
                    },
                    language === lang.code && {
                      backgroundColor: colors.primary + "20",
                    },
                  ]}
                  onPress={() => handleSelectLanguage(lang.code)}
                >
                  <Text
                    style={[
                      styles.modalOptionText,
                      {
                        color: colors.text,
                      },
                    ]}
                  >
                    {lang.flag} {lang.name}
                  </Text>

                  {language === lang.code && (
                    <Text
                      style={{
                        color: colors.primary,
                      }}
                    >
                      ✓
                    </Text>
                  )}
                </TouchableOpacity>
              ))}
            </ScrollView>

            <TouchableOpacity
              style={[
                styles.modalCloseButton,
                {
                  backgroundColor: colors.border,
                },
              ]}
              onPress={() => setShowLanguageModal(false)}
            >
              <Text
                style={[
                  styles.modalCloseText,
                  {
                    color: colors.text,
                  },
                ]}
              >
                {t("settings.close")}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* MODAL HORÁRIO */}

      <Modal
        visible={showTimeModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowTimeModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View
            style={[
              styles.modalContent,
              {
                backgroundColor: colors.card,
              },
            ]}
          >
            <Text
              style={[
                styles.modalTitle,
                {
                  color: colors.text,
                },
              ]}
            >
              {t("settings.timeTitle")}
            </Text>

            <View
              style={{
                paddingHorizontal: 20,
              }}
            >
              <DateTimePicker
                value={selectedTime}
                mode="time"
                is24Hour
                display={Platform.OS === "ios" ? "spinner" : "default"}
                onChange={(event, date) => {
                  if (Platform.OS === "android") {
                    if (event.type === "set" && date) {
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
              style={[
                styles.modalCloseButton,
                {
                  backgroundColor: colors.primary,
                },
              ]}
              onPress={handleSaveTime}
            >
              <Text
                style={{
                  color: "#fff",
                  fontWeight: "600",
                }}
              >
                {t("settings.saveTitle")}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.modalCloseButton,
                {
                  backgroundColor: colors.border,
                },
              ]}
              onPress={() => setShowTimeModal(false)}
            >
              <Text
                style={[
                  styles.modalCloseText,
                  {
                    color: colors.text,
                  },
                ]}
              >
                {t("settings.cancel")}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* MODAL DÍZIMO */}

      <Modal
        visible={showTitheDateModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowTitheDateModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View
            style={[
              styles.modalContent,
              {
                backgroundColor: colors.card,
              },
            ]}
          >
            <Text
              style={[
                styles.modalTitle,
                {
                  color: colors.text,
                },
              ]}
            >
              Configurar Dízimo
            </Text>

            <ScrollView>
              <Text
                style={[
                  styles.modalSectionTitle,
                  {
                    color: colors.text,
                  },
                ]}
              >
                Escolha o mês
              </Text>

              {months.map((month, index) => (
                <TouchableOpacity
                  key={month}
                  style={[
                    styles.modalOption,
                    {
                      borderBottomColor: colors.border,
                    },
                    titheMonth === index + 1 && {
                      backgroundColor: colors.primary + "20",
                    },
                  ]}
                  onPress={() => setTitheMonth(index + 1)}
                >
                  <Text
                    style={[
                      styles.modalOptionText,
                      {
                        color: colors.text,
                      },
                    ]}
                  >
                    {month}
                  </Text>
                </TouchableOpacity>
              ))}

              <Text
                style={[
                  styles.modalSectionTitle,
                  {
                    color: colors.text,
                  },
                ]}
              >
                Escolha o dia
              </Text>

              {Array.from({ length: 31 }, (_, i) => i + 1).map((day) => (
                <TouchableOpacity
                  key={day}
                  style={[
                    styles.modalOption,
                    {
                      borderBottomColor: colors.border,
                    },
                    titheDay === day && {
                      backgroundColor: colors.primary + "20",
                    },
                  ]}
                  onPress={() => setTitheDay(day)}
                >
                  <Text
                    style={[
                      styles.modalOptionText,
                      {
                        color: colors.text,
                      },
                    ]}
                  >
                    Dia {day}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            <TouchableOpacity
              style={[
                styles.modalCloseButton,
                {
                  backgroundColor: colors.primary,
                },
              ]}
              onPress={handleSaveTitheDate}
            >
              <Text
                style={{
                  color: "#fff",
                  fontWeight: "600",
                }}
              >
                Salvar
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
      fontWeight: "bold",
      color: "#fff",
      marginBottom: 5,
    },

    headerSubtitle: {
      fontSize: 14,
      color: "#fff",
      opacity: 0.9,
    },

    section: {
      marginTop: 15,
      paddingVertical: 10,
    },

    sectionIcon: {
      paddingHorizontal: 20,
      paddingVertical: 10,
    },

    sectionTitle: {
      fontSize: 16,
      fontWeight: "bold",
      paddingHorizontal: 20,
      paddingVertical: 10,
    },

    settingRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
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
      fontWeight: "500",
      marginBottom: 3,
    },

    settingDescription: {
      fontSize: 13,
      lineHeight: 18,
    },

    settingValue: {
      fontSize: 16,
      fontWeight: "600",
    },

    settingArrow: {
      fontSize: 20,
    },

    footer: {
      alignItems: "center",
      paddingVertical: 20,
      marginTop: 40,
    },

    footerRow: {
      flexDirection: "row",
      alignItems: "center",
      marginTop: 4,
    },

    footerText: {
      fontSize: 12,
      textAlign: "center",
    },

    modalOverlay: {
      flex: 1,
      backgroundColor: "rgba(0,0,0,0.5)",
      justifyContent: "flex-end",
    },

    modalContent: {
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
      maxHeight: "80%",
    },

    modalTitle: {
      fontSize: 18,
      fontWeight: "bold",
      padding: 20,
      textAlign: "center",
    },

    modalSectionTitle: {
      fontSize: 16,
      fontWeight: "600",
      paddingHorizontal: 20,
      paddingTop: 10,
      paddingBottom: 5,
    },

    modalOption: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
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
      alignItems: "center",
    },

    modalCloseText: {
      fontSize: 16,
      fontWeight: "600",
    },
  });

export default SettingsScreen;
