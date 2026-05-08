/**
 * Tela de Adicionar Meta
 */

import React, { useState, useMemo } from "react";
import { useTheme } from "../../context/ThemeContext";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  TouchableOpacity,
} from "react-native";
import { Button, Input } from "../../components/ui";
import useAuthStore from "../../store/authStore";
import useGoalsStore from "../../store/goalsStore";
import { t } from "../../i18n";
import {
  MaterialCommunityIcons,
  Feather,
  FontAwesome6,
} from "@expo/vector-icons";

// ✅ CORRIGIDO: ícones como objetos com name/library em vez de JSX
const ICONS = [
  { key: "target", library: "Feather", name: "target" },
  { key: "home", library: "Feather", name: "home" },
  { key: "car", library: "MaterialCommunityIcons", name: "car" },
  { key: "airplane", library: "MaterialCommunityIcons", name: "airplane" },
  { key: "ring", library: "MaterialCommunityIcons", name: "ring" },
  { key: "graduation-cap", library: "FontAwesome6", name: "graduation-cap" },
  {
    key: "currency-usd",
    library: "MaterialCommunityIcons",
    name: "currency-usd",
  },
  { key: "beach", library: "MaterialCommunityIcons", name: "beach" },
  { key: "gamepad", library: "MaterialCommunityIcons", name: "gamepad" },
  { key: "cellphone", library: "MaterialCommunityIcons", name: "cellphone" },
  { key: "laptop", library: "MaterialCommunityIcons", name: "laptop" },
  { key: "guitar", library: "FontAwesome6", name: "guitar" },
];

// ✅ Renderiza o ícone certo com base na library
const GoalIcon = ({ icon, size = 24, color }) => {
  if (icon.library === "Feather") {
    return <Feather name={icon.name} size={size} color={color} />;
  }
  if (icon.library === "FontAwesome6") {
    return <FontAwesome6 name={icon.name} size={size} color={color} />;
  }
  return <MaterialCommunityIcons name={icon.name} size={size} color={color} />;
};

// ✅ Máscara de data DD/MM/YYYY
const maskDate = (value) => {
  const digits = value.replace(/\D/g, "").slice(0, 8);
  if (digits.length <= 2) return digits;
  if (digits.length <= 4) return `${digits.slice(0, 2)}/${digits.slice(2)}`;
  return `${digits.slice(0, 2)}/${digits.slice(2, 4)}/${digits.slice(4)}`;
};

const AddGoalScreen = ({ navigation }) => {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const { user } = useAuthStore();
  const { addGoal } = useGoalsStore();

  const [title, setTitle] = useState("");
  const [targetAmount, setTargetAmount] = useState("");
  const [currentAmount, setCurrentAmount] = useState("");
  const [deadlineBR, setDeadlineBR] = useState("");
  const [deadlineISO, setDeadlineISO] = useState("");

  // ✅ CORRIGIDO: selectedIcon é a key string, não JSX
  const [selectedIconKey, setSelectedIconKey] = useState("target");

  const [titleError, setTitleError] = useState("");
  const [targetAmountError, setTargetAmountError] = useState("");
  const [deadlineError, setDeadlineError] = useState("");
  const [loading, setLoading] = useState(false);

  const selectedIcon = ICONS.find((i) => i.key === selectedIconKey) || ICONS[0];

  // ✅ Handler de data com máscara automática
  const handleDateChange = (value) => {
    const masked = maskDate(value);
    setDeadlineBR(masked);

    const digits = masked.replace(/\D/g, "");
    if (digits.length === 8) {
      const day = digits.slice(0, 2);
      const month = digits.slice(2, 4);
      const year = digits.slice(4, 8);
      setDeadlineISO(`${year}-${month}-${day}`);
    } else {
      setDeadlineISO("");
    }
  };

  // Validar campos
  const validateFields = () => {
    let isValid = true;

    setTitleError("");
    setTargetAmountError("");
    setDeadlineError("");

    if (!title.trim()) {
      setTitleError(t("addGoal.errors.titleRequired"));
      isValid = false;
    }

    if (!targetAmount || parseFloat(targetAmount) <= 0) {
      setTargetAmountError(t("addGoal.errors.targetAmountInvalid"));
      isValid = false;
    }

    if (!deadlineISO) {
      setDeadlineError(t("addGoal.errors.deadlineInvalid"));
      isValid = false;
    } else {
      const deadlineDate = new Date(`${deadlineISO}T00:00:00`);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (deadlineDate < today) {
        setDeadlineError(t("addGoal.errors.deadlineFuture"));
        isValid = false;
      }
    }

    return isValid;
  };

  // Salvar meta
  const handleSave = async () => {
    if (!validateFields()) return;

    try {
      setLoading(true);

      const goalData = {
        title: title.trim(),
        targetAmount: parseFloat(targetAmount),
        currentAmount: currentAmount ? parseFloat(currentAmount) : 0,
        deadline: deadlineISO,
        // ✅ CORRIGIDO: salva apenas strings, não JSX
        iconName: selectedIcon.name,
        iconLibrary: selectedIcon.library,
        userId: user.uid,
      };

      const result = await addGoal(goalData);

      if (result.success) {
        Alert.alert(t("addGoal.successTitle"), t("addGoal.success"), [
          {
            text: "OK",
            onPress: () => navigation.goBack(),
          },
        ]);
      } else {
        Alert.alert(
          t("addGoal.error"),
          result.error || t("addGoal.errorGeneric"),
        );
      }
    } catch (error) {
      console.error("Erro ao salvar meta:", error);
      Alert.alert(t("addGoal.error"), t("addGoal.errorGeneric"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerIconWrapper}>
            <GoalIcon icon={selectedIcon} size={48} color={colors.primary} />
          </View>
          <Text style={styles.headerTitle}>{t("addGoal.title")}</Text>
          <Text style={styles.headerSubtitle}>{t("addGoal.subtitle")}</Text>
        </View>

        {/* Formulário */}
        <View style={styles.form}>
          <Input
            label={t("addGoal.fields.title")}
            value={title}
            onChangeText={(v) => {
              setTitle(v);
              if (titleError) setTitleError("");
            }}
            placeholder={t("addGoal.placeholders.title")}
            error={titleError}
            leftIcon={
              <MaterialCommunityIcons
                name="file-document-edit-outline"
                size={24}
                color={colors.textSecondary}
              />
            }
          />

          <Input
            label={t("addGoal.fields.targetAmount")}
            value={targetAmount}
            onChangeText={(v) => {
              setTargetAmount(v);
              if (targetAmountError) setTargetAmountError("");
            }}
            placeholder="0,00"
            keyboardType="numeric"
            error={targetAmountError}
            leftIcon={
              <MaterialCommunityIcons
                name="currency-usd"
                size={24}
                color={colors.textSecondary}
              />
            }
          />

          <Input
            label={t("addGoal.fields.initialAmount")}
            value={currentAmount}
            onChangeText={setCurrentAmount}
            placeholder="0,00"
            keyboardType="numeric"
            leftIcon={
              <MaterialCommunityIcons
                name="cash"
                size={24}
                color={colors.textSecondary}
              />
            }
          />

          <Input
            label={t("addGoal.fields.deadline")}
            value={deadlineBR}
            onChangeText={(v) => {
              handleDateChange(v);
              if (deadlineError) setDeadlineError("");
            }}
            placeholder={t("addGoal.placeholders.date")}
            keyboardType="numeric"
            error={deadlineError}
            leftIcon={
              <MaterialCommunityIcons
                name="calendar"
                size={24}
                color={colors.textSecondary}
              />
            }
          />

          {/* Seletor de Ícone */}
          <View style={styles.iconSection}>
            <Text style={styles.label}>{t("addGoal.fields.icon")}</Text>
            <View style={styles.iconGrid}>
              {/* ✅ CORRIGIDO: key é string, comparação é por key */}
              {ICONS.map((icon) => (
                <TouchableOpacity
                  key={icon.key}
                  style={[
                    styles.iconButton,
                    selectedIconKey === icon.key && styles.iconButtonSelected,
                  ]}
                  onPress={() => setSelectedIconKey(icon.key)}
                  activeOpacity={0.7}
                >
                  <GoalIcon
                    icon={icon}
                    size={24}
                    color={
                      selectedIconKey === icon.key
                        ? colors.primary
                        : colors.textSecondary
                    }
                  />
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Preview */}
          {targetAmount && parseFloat(targetAmount) > 0 && (
            <View style={styles.previewCard}>
              <Text style={styles.previewLabel}>{t("addGoal.preview")}</Text>
              <View style={styles.preview}>
                <View style={styles.previewIconWrapper}>
                  <GoalIcon
                    icon={selectedIcon}
                    size={32}
                    color={colors.primary}
                  />
                </View>
                <View style={styles.previewInfo}>
                  <Text style={styles.previewTitle}>
                    {title || t("addGoal.previewDefault")}
                  </Text>
                  <Text style={styles.previewAmount}>
                    R$ {parseFloat(targetAmount).toFixed(2)}
                  </Text>
                </View>
              </View>
            </View>
          )}
        </View>

        {/* Botões */}
        <View style={styles.actions}>
          <Button
            title={t("addGoal.actions.create")}
            onPress={handleSave}
            loading={loading}
            style={styles.saveButton}
          />

          {/* ✅ CORRIGIDO: chave de i18n que existe */}
          <Button
            title={t("addGoal.actions.cancel") || "Cancelar"}
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
    header: {
      alignItems: "center",
      marginBottom: 32,
    },
    headerIconWrapper: {
      width: 80,
      height: 80,
      borderRadius: 40,
      backgroundColor: colors.primary + "15",
      alignItems: "center",
      justifyContent: "center",
      marginBottom: 16,
    },
    headerTitle: {
      fontSize: 24,
      fontWeight: "bold",
      color: colors.text,
      marginBottom: 8,
    },
    headerSubtitle: {
      fontSize: 16,
      color: colors.textSecondary,
      textAlign: "center",
    },
    form: {
      marginBottom: 24,
    },
    label: {
      fontSize: 14,
      fontWeight: "600",
      color: colors.text,
      marginBottom: 12,
    },
    iconSection: {
      marginBottom: 16,
    },
    iconGrid: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: 10,
    },
    iconButton: {
      width: 56,
      height: 56,
      backgroundColor: colors.card,
      borderRadius: 12,
      alignItems: "center",
      justifyContent: "center",
      borderWidth: 2,
      borderColor: colors.border,
    },
    iconButtonSelected: {
      borderColor: colors.primary,
      borderWidth: 3,
      backgroundColor: colors.primary + "10",
    },
    previewCard: {
      backgroundColor: colors.card,
      borderRadius: 12,
      padding: 16,
      marginTop: 8,
    },
    previewLabel: {
      fontSize: 13,
      color: colors.textSecondary,
      marginBottom: 12,
    },
    preview: {
      flexDirection: "row",
      alignItems: "center",
      gap: 16,
    },
    previewIconWrapper: {
      width: 52,
      height: 52,
      borderRadius: 26,
      backgroundColor: colors.primary + "15",
      alignItems: "center",
      justifyContent: "center",
    },
    previewInfo: {
      flex: 1,
    },
    previewTitle: {
      fontSize: 16,
      fontWeight: "600",
      color: colors.text,
      marginBottom: 4,
    },
    previewAmount: {
      fontSize: 20,
      fontWeight: "bold",
      color: colors.primary,
    },
    actions: {
      gap: 12,
    },
    saveButton: {
      marginBottom: 12,
    },
  });

export default AddGoalScreen;
