// src/screens/support/ContactScreen.js
import React, { useState, useMemo } from "react";
import { useTheme } from "../../context/ThemeContext";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import SupportService from "../../services/SupportService";
import useAuthStore from "../../store/authStore";
import { t } from "../../i18n";

const ContactScreen = ({ navigation }) => {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const user = useAuthStore((state) => state.user);

  const [formData, setFormData] = useState({
    name: user?.displayName || "",
    email: user?.email || "",
    subject: "",
    category: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);

  const categories = SupportService.getContactCategories();

  const handleSubmit = async () => {
    // Validação
    if (!formData.name.trim()) {
      Alert.alert(t("contact.errors.warningTitle"), t("contact.errors.name"));
      return;
    }
    if (!formData.email.trim()) {
      Alert.alert(t("contact.errors.warningTitle"), t("contact.errors.email"));
      return;
    }
    if (!formData.subject.trim()) {
      Alert.alert(
        t("contact.errors.warningTitle"),
        t("contact.errors.subject"),
      );
      return;
    }
    if (!formData.category) {
      Alert.alert(
        t("contact.errors.warningTitle"),
        t("contact.errors.category"),
      );
      return;
    }
    if (!formData.message.trim()) {
      Alert.alert(
        t("contact.errors.warningTitle"),
        t("contact.errors.message"),
      );
      return;
    }

    try {
      setLoading(true);

      const result = await SupportService.createSupportTicket({
        name: formData.name,
        email: formData.email,
        subject: formData.subject,
        category: formData.category,
        message: formData.message,
        priority: "medium",
      });

      if (result.success) {
        Alert.alert(
          t("contact.successTitle"),
          <MaterialCommunityIcons
            name="checkbox-marked"
            size={24}
            color={colors.text}
          />,
          `${t("contact.successMessage", { ticket: result.ticketId })}`,
          [
            {
              text: "OK",
              onPress: () => navigation.goBack(),
            },
          ],
        );

        // Limpar formulário
        setFormData({
          ...formData,
          subject: "",
          category: "",
          message: "",
        });
      }
    } catch (error) {
      Alert.alert(t("contact.errors.errorTitle"), t("contact.errors.send"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <MaterialCommunityIcons
            name="arrow-left"
            size={24}
            color={colors.text}
          />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t("contact.title")}</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Info */}
        <View style={styles.infoCard}>
          <MaterialCommunityIcons
            name="message-text"
            size={32}
            color="#2196F3"
          />
          <Text style={styles.infoTitle}>{t("contact.helpTitle")}</Text>
          <Text style={styles.infoText}>{t("contact.helpdDescription")}</Text>
        </View>

        {/* Formulário */}
        <View style={styles.form}>
          {/* Nome */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>{t("contact.form.name")}</Text>
            <View style={styles.inputContainer}>
              <MaterialCommunityIcons
                name="account"
                size={20}
                color={colors.textSecondary}
              />
              <TextInput
                style={styles.input}
                value={formData.name}
                onChangeText={(text) =>
                  setFormData({ ...formData, name: text })
                }
                placeholder={t("contact.placeholder.name")}
                placeholderTextColor={colors.placeholder}
              />
            </View>
          </View>

          {/* Email */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>{t("contact.form.email")}</Text>
            <View style={styles.inputContainer}>
              <MaterialCommunityIcons
                name="email"
                size={20}
                color={colors.textSecondary}
              />
              <TextInput
                style={styles.input}
                value={formData.email}
                onChangeText={(text) =>
                  setFormData({ ...formData, email: text })
                }
                placeholder={t("contact.placeholder.email")}
                keyboardType="email-address"
                autoCapitalize="none"
                placeholderTextColor={colors.placeholder}
              />
            </View>
          </View>

          {/* Categoria */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>{t("contact.form.category")}</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.categoriesScroll}
            >
              {categories.map((cat) => (
                <TouchableOpacity
                  key={cat.id}
                  style={[
                    styles.categoryChip,
                    formData.category === cat.id && styles.categoryChipActive,
                  ]}
                  onPress={() => setFormData({ ...formData, category: cat.id })}
                >
                  <MaterialCommunityIcons
                    name={cat.icon}
                    size={18}
                    color={
                      formData.category === cat.id
                        ? colors.white
                        : colors.textSecondary
                    }
                  />
                  <Text
                    style={[
                      styles.categoryLabel,
                      formData.category === cat.id &&
                        styles.categoryLabelActive,
                    ]}
                  >
                    {cat.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          {/* Assunto */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>{t("contact.form.subject")}</Text>
            <View style={styles.inputContainer}>
              <MaterialCommunityIcons
                name="text"
                size={20}
                color={colors.textSecondary}
              />
              <TextInput
                style={styles.input}
                value={formData.subject}
                onChangeText={(text) =>
                  setFormData({ ...formData, subject: text })
                }
                placeholder={t("contact.placeholder.subject")}
                placeholderTextColor={colors.placeholder}
              />
            </View>
          </View>

          {/* Mensagem */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>{t("contact.form.message")}</Text>
            <View style={[styles.inputContainer, styles.textAreaContainer]}>
              <TextInput
                style={[styles.input, styles.textArea]}
                value={formData.message}
                onChangeText={(text) =>
                  setFormData({ ...formData, message: text })
                }
                placeholder={t("contact.placeholder.message")}
                placeholderTextColor={colors.placeholder}
                multiline
                numberOfLines={6}
                textAlignVertical="top"
              />
            </View>
          </View>

          {/* Botão Enviar */}
          <TouchableOpacity
            style={[
              styles.submitButton,
              loading && styles.submitButtonDisabled,
            ]}
            onPress={handleSubmit}
            disabled={loading}
          >
            {loading ? (
              <>
                <MaterialCommunityIcons name="loading" size={20} color="#fff" />
                <Text style={styles.submitButtonText}>
                  {t("contact.sending")}
                </Text>
              </>
            ) : (
              <>
                <MaterialCommunityIcons name="send" size={20} color="#fff" />
                <Text style={styles.submitButtonText}>{t("contact.send")}</Text>
              </>
            )}
          </TouchableOpacity>
        </View>

        {/* Informações adicionais */}
        <View style={styles.additionalInfo}>
          <View style={styles.infoRow}>
            <MaterialCommunityIcons
              name="clock-outline"
              size={20}
              color="#666"
            />
            <Text style={styles.infoRowText}>
              {t("contact.info.responseTime")}
            </Text>
          </View>
          <View style={styles.infoRow}>
            <MaterialCommunityIcons
              name="shield-check"
              size={20}
              color="#666"
            />
            <Text style={styles.infoRowText}>{t("contact.info.security")}</Text>
          </View>
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
    header: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      padding: 20,
      backgroundColor: colors.card,
      borderBottomWidth: 1,
      borderBottomColor: "#eee",
    },
    headerTitle: {
      fontSize: 18,
      fontWeight: "bold",
      color: colors.text,
    },
    content: {
      flex: 1,
    },
    infoCard: {
      backgroundColor: colors.card,
      margin: 20,
      padding: 25,
      borderRadius: 12,
      alignItems: "center",
      elevation: 2,
      shadowcolor: colors.text,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
    },
    infoTitle: {
      fontSize: 18,
      fontWeight: "bold",
      color: colors.text,
      marginTop: 10,
    },
    infoText: {
      fontSize: 14,
      color: colors.textSecondary,
      marginTop: 8,
      textAlign: "center",
    },
    form: {
      paddingHorizontal: 20,
    },
    inputGroup: {
      marginBottom: 20,
    },
    label: {
      fontSize: 14,
      fontWeight: "600",
      color: colors.text,
      marginBottom: 8,
    },
    inputContainer: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: colors.card,
      borderRadius: 10,
      paddingHorizontal: 15,
      elevation: 2,
      shadowcolor: colors.text,
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.1,
      shadowRadius: 2,
    },
    input: {
      flex: 1,
      paddingVertical: 12,
      paddingLeft: 10,
      fontSize: 15,
      color: colors.text,
    },
    textAreaContainer: {
      alignItems: "flex-start",
      paddingVertical: 12,
    },
    textArea: {
      minHeight: 120,
      paddingTop: 0,
    },
    categoriesScroll: {
      marginTop: 5,
    },
    categoryChip: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: colors.card,
      paddingHorizontal: 16,
      paddingVertical: 10,
      borderRadius: 20,
      marginRight: 10,
      borderWidth: 1,
      borderColor: colors.border,
    },
    categoryChipActive: {
      backgroundColor: colors.primary,
      bordercolor: colors.primary,
    },
    categoryLabel: {
      fontSize: 13,
      color: colors.textSecondary,
      marginLeft: 6,
      fontWeight: "500",
    },
    categoryLabelActive: {
      color: "#fff",
    },
    submitButton: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: colors.primary,
      padding: 16,
      borderRadius: 10,
      marginTop: 10,
    },
    submitButtonDisabled: {
      backgroundColor: "#ccc",
    },
    submitButtonText: {
      color: "#fff",
      fontSize: 16,
      fontWeight: "600",
      marginLeft: 8,
    },
    additionalInfo: {
      padding: 20,
      marginTop: 10,
    },
    infoRow: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 12,
    },
    infoRowText: {
      fontSize: 14,
      color: colors.textSecondary,
      marginLeft: 10,
    },
  });

export default ContactScreen;
