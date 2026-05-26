/**
 * Tela de Detalhes da Meta
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
import { COLORS, formatDate } from "../../utils";
import useGoalsStore from "../../store/goalsStore";
import useSettingsStore from "../../store/settingsStore";
import usePremiumStore from "../../store/premiumStore";
import { t } from "../../i18n";
import {
  Feather,
  MaterialCommunityIcons,
  FontAwesome6,
} from "@expo/vector-icons";

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

const GoalIcon = ({ icon, size = 24, color }) => {
  if (!icon) return <Feather name="target" size={size} color={color} />;
  if (icon.library === "Feather")
    return <Feather name={icon.name} size={size} color={color} />;
  if (icon.library === "FontAwesome6")
    return <FontAwesome6 name={icon.name} size={size} color={color} />;
  return <MaterialCommunityIcons name={icon.name} size={size} color={color} />;
};

const maskDate = (value) => {
  const digits = value.replace(/\D/g, "").slice(0, 8);
  if (digits.length <= 2) return digits;
  if (digits.length <= 4) return `${digits.slice(0, 2)}/${digits.slice(2)}`;
  return `${digits.slice(0, 2)}/${digits.slice(2, 4)}/${digits.slice(4)}`;
};

const isoToBR = (iso) => {
  if (!iso || typeof iso !== "string") return "";

  const parts = iso.split("-");

  if (parts.length !== 3) return "";

  const [year, month, day] = parts;

  return `${day}/${month}/${year}`;
};

const GoalDetailScreen = ({ navigation, route }) => {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const formatCurrency = useSettingsStore((state) => state.formatCurrency);
  const { isPremium } = usePremiumStore();
  const { goal } = route.params || {};

  if (!goal) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>{t("goalDetail.notFound")}</Text>
      </View>
    );
  }

  const { addToGoal, updateGoal, deleteGoal } = useGoalsStore();

  const initialIcon =
    ICONS.find(
      (i) => i.name === goal.iconName && i.library === goal.iconLibrary,
    ) || ICONS[0];

  // Estados de edição
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(goal.title);
  const [editTargetAmount, setEditTargetAmount] = useState(
    goal.targetAmount?.toString() || "",
  );
  const [editDeadlineBR, setEditDeadlineBR] = useState(isoToBR(goal.deadline));
  const [editDeadlineISO, setEditDeadlineISO] = useState(goal.deadline || "");
  const [editIconKey, setEditIconKey] = useState(initialIcon.key);
  const [titleError, setTitleError] = useState("");
  const [targetAmountError, setTargetAmountError] = useState("");
  const [deadlineError, setDeadlineError] = useState("");

  // Estados de adicionar valor
  const [addAmount, setAddAmount] = useState("");

  // ✅ NOVO: Estados de retirar valor
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [withdrawError, setWithdrawError] = useState("");
  const [showWithdraw, setShowWithdraw] = useState(false);

  const [loading, setLoading] = useState(false);

  const currentAmount = Number(goal.currentAmount || 0);
  const targetAmount = Number(goal.targetAmount || 0);
  const progress =
    targetAmount > 0 ? Math.min((currentAmount / targetAmount) * 100, 100) : 0;
  const remaining = Math.max(targetAmount - currentAmount, 0);
  const isCompleted = progress >= 100;

  const selectedEditIcon = ICONS.find((i) => i.key === editIconKey) || ICONS[0];

  const parseCurrency = (value) => {
  if (!value) return 0;

  return parseFloat(
    value
      .replace(/\s/g, "")
      .replace(/\./g, "")
      .replace(",", "."),
  );
};

  const getDaysRemaining = () => {
    const today = new Date();
    const deadlineDate = new Date(goal.deadline);
    const diff = deadlineDate - today;
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  };

  const daysRemaining = getDaysRemaining();

  const handleEditPress = () => {
    if (!isCompleted) {
      setIsEditing(true);
      return;
    }

    if (!isPremium) {
      Alert.alert(
        t("premium.edit.editCompletedPremiumTitle"),
        t("premium.edit.editCompletedPremiumMessage"),
        [
          {
            text: t("premium.edit.editCompletedPremiumCancel"),
            style: "cancel",
          },
          {
            text: t("premium.edit.editCompletedPremiumAction"),
            onPress: () => navigation.navigate("Premium"),
          },
        ],
      );
      return;
    }

    Alert.alert(
      t("premium.edit.editCompletedWarningTitle"),
      t("premium.edit.editCompletedWarningMessage"),
      [
        { text: t("premium.edit.editCompletedWarningCancel"), style: "cancel" },
        {
          text: t("premium.edit.editCompletedWarningAction"),
          onPress: () => setIsEditing(true),
        },
      ],
    );
  };

  const handleDateChange = (value) => {
    const masked = maskDate(value);
    setEditDeadlineBR(masked);
    const digits = masked.replace(/\D/g, "");
    if (digits.length === 8) {
      const day = digits.slice(0, 2);
      const month = digits.slice(2, 4);
      const year = digits.slice(4, 8);
      setEditDeadlineISO(`${year}-${month}-${day}`);
    } else {
      setEditDeadlineISO("");
    }
  };

  const validateEditFields = () => {
    let isValid = true;
    setTitleError("");
    setTargetAmountError("");
    setDeadlineError("");

    if (!editTitle.trim()) {
      setTitleError(t("addGoal.errors.titleRequired"));
      isValid = false;
    }
    if (!editTargetAmount || parseFloat(editTargetAmount) <= 0) {
      setTargetAmountError(t("addGoal.errors.targetAmountInvalid"));
      isValid = false;
    }
    if (!editDeadlineISO) {
      setDeadlineError(t("addGoal.errors.deadlineInvalid"));
      isValid = false;
    } else {
      const deadlineDate = new Date(`${editDeadlineISO}T00:00:00`);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (deadlineDate < today) {
        setDeadlineError(t("addGoal.errors.deadlineFuture"));
        isValid = false;
      }
    }

    return isValid;
  };

  const handleSave = async () => {
    if (!validateEditFields()) return;

    try {
      setLoading(true);

      const updatedData = {
        title: editTitle.trim(),
        targetAmount: parseFloat(editTargetAmount),
        deadline: editDeadlineISO,
        iconName: selectedEditIcon.name,
        iconLibrary: selectedEditIcon.library,
        updatedAt: new Date().toISOString(),
      };

      const result = await updateGoal(goal.id, updatedData);

      if (result.success) {
        Alert.alert(
          t("goalDetail.successTitle") || "Sucesso!",
          t("goalDetail.updateSuccess") || "Meta atualizada com sucesso!",
          [
            {
              text: "OK",
              onPress: () => {
                setIsEditing(false);
                navigation.goBack();
              },
            },
          ],
        );
      } else {
        Alert.alert(
          t("goalDetail.alerts.error"),
          result.error ||
            t("goalDetail.alerts.updateError") ||
            "Erro ao atualizar meta",
        );
      }
    } catch (error) {
      console.error("Erro ao editar meta:", error);
      Alert.alert(
        t("goalDetail.alerts.error"),
        t("goalDetail.alerts.updateError") || "Erro ao atualizar meta",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleCancelEdit = () => {
    setEditTitle(goal.title);
    setEditTargetAmount(goal.targetAmount?.toString() || "");
    setEditDeadlineBR(isoToBR(goal.deadline));
    setEditDeadlineISO(goal.deadline || "");
    setEditIconKey(initialIcon.key);
    setTitleError("");
    setTargetAmountError("");
    setDeadlineError("");
    setIsEditing(false);
  };

  const handleAddAmount = async () => {
    const amount = parseCurrency(addAmount);
    if (!amount || amount <= 0) {
      Alert.alert(t("goalDetail.alerts.invalidValue"));
      return;
    }

    try {
      setLoading(true);
      const result = await addToGoal(goal.id, amount);

      if (result.success) {
        Alert.alert(
          t("goalDetail.alerts.successAdd", { amount: formatCurrency(amount) }),
          "",
          [
            {
              text: "OK",
              onPress: () => {
                setAddAmount("");
                navigation.goBack();
              },
            },
          ],
        );
      } else {
        Alert.alert(
          t("goalDetail.alerts.error"),
          result.error || t("goalDetail.alerts.addError"),
        );
      }
    } catch (error) {
      console.error("Erro:", error);
      Alert.alert(
        t("goalDetail.alerts.error"),
        t("goalDetail.alerts.addError"),
      );
    } finally {
      setLoading(false);
    }
  };

  // ✅ NOVO: Retirar valor da meta
  const handleWithdraw = async () => {
    const amount = parseCurrency(withdrawAmount);

    setWithdrawError("");

    if (!amount || amount <= 0) {
      setWithdrawError(t("goalDetail.alerts.invalidValue"));
      return;
    }

    if (amount > currentAmount) {
      setWithdrawError(
        t("goalDetail.alerts.withdrawExceeds") ||
          `Valor máximo disponível: ${formatCurrency(currentAmount)}`,
      );
      return;
    }

    Alert.alert(
      t("goalDetail.withdrawConfirmTitle") || "Retirar da Meta",
      t("goalDetail.withdrawConfirmMessage", {
        amount: formatCurrency(amount),
        remaining: formatCurrency(currentAmount - amount),
      }) ||
        `Retirar ${formatCurrency(amount)} da meta?\n\nSaldo restante: ${formatCurrency(currentAmount - amount)}`,
      [
        { text: t("goalDetail.alerts.cancel") || "Cancelar", style: "cancel" },
        {
          text: t("goalDetail.withdrawConfirm") || "Retirar",
          style: "destructive",
          onPress: async () => {
            try {
              setLoading(true);
              // Passa valor negativo para subtrair do progresso
              const result = await addToGoal(goal.id, -amount);

              if (result.success) {
                Alert.alert(
                  t("goalDetail.alerts.successTitle") || "Sucesso!",
                  t("goalDetail.alerts.withdrawSuccess", {
                    amount: formatCurrency(amount),
                  }) || `${formatCurrency(amount)} retirado da meta!`,
                  [
                    {
                      text: "OK",
                      onPress: () => {
                        setWithdrawAmount("");
                        setShowWithdraw(false);
                        navigation.goBack();
                      },
                    },
                  ],
                );
              } else {
                Alert.alert(
                  t("goalDetail.alerts.error"),
                  result.error ||
                    t("goalDetail.alerts.withdrawError") ||
                    "Erro ao retirar valor",
                );
              }
            } catch (error) {
              console.error("Erro ao retirar:", error);
              Alert.alert(
                t("goalDetail.alerts.error"),
                t("goalDetail.alerts.withdrawError") || "Erro ao retirar valor",
              );
            } finally {
              setLoading(false);
            }
          },
        },
      ],
    );
  };

  const handleDelete = () => {
    Alert.alert(
      t("goalDetail.deleteConfirmTitle"),
      t("goalDetail.deleteConfirmMessage"),
      [
        { text: t("goalDetail.alerts.cancel") || "Cancelar", style: "cancel" },
        {
          text: t("goalDetail.delete"),
          style: "destructive",
          onPress: async () => {
            const result = await deleteGoal(goal.id);
            if (result.success) {
              Alert.alert(t("goalDetail.alerts.deleteSuccess"), "", [
                { text: "OK", onPress: () => navigation.goBack() },
              ]);
            }
          },
        },
      ],
    );
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
            <GoalIcon
              icon={isEditing ? selectedEditIcon : initialIcon}
              size={48}
              color={colors.primary}
            />
          </View>
          <Text style={styles.headerTitle}>{goal.title}</Text>

          {!isEditing &&
            (isCompleted ? (
              <View style={styles.completedBadge}>
                <MaterialCommunityIcons
                  name="check"
                  size={16}
                  color={colors.card}
                />
                <Text style={styles.completedText}>
                  {t("goalDetail.completed")}
                </Text>
              </View>
            ) : (
              <Text style={styles.headerDeadline}>
                {daysRemaining > 0
                  ? t("goalDetail.daysRemaining", { count: daysRemaining })
                  : daysRemaining === 0
                    ? t("goalDetail.todayDeadline")
                    : t("goalDetail.late", { count: Math.abs(daysRemaining) })}
              </Text>
            ))}
        </View>

        {isEditing ? (
          // Modo Edição
          <View style={styles.form}>
            <Input
              label={t("addGoal.fields.title")}
              value={editTitle}
              onChangeText={(v) => {
                setEditTitle(v);
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
              value={editTargetAmount}
              onChangeText={(v) => {
                setEditTargetAmount(v);
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
              label={t("addGoal.fields.deadline")}
              value={editDeadlineBR}
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

            {/* Seletor de ícone */}
            <View style={styles.iconSection}>
              <Text style={styles.label}>{t("addGoal.fields.icon")}</Text>
              <View style={styles.iconGrid}>
                {ICONS.map((icon) => (
                  <TouchableOpacity
                    key={icon.key}
                    style={[
                      styles.iconButton,
                      editIconKey === icon.key && styles.iconButtonSelected,
                    ]}
                    onPress={() => setEditIconKey(icon.key)}
                    activeOpacity={0.7}
                  >
                    <GoalIcon
                      icon={icon}
                      size={24}
                      color={
                        editIconKey === icon.key
                          ? colors.primary
                          : colors.textSecondary
                      }
                    />
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.actions}>
              <Button
                title={t("transactionDetail.saveButton")}
                onPress={handleSave}
                loading={loading}
                style={styles.saveButton}
              />
              <Button
                title={t("transactionDetail.cancelButton")}
                onPress={handleCancelEdit}
                variant="outline"
              />
            </View>
          </View>
        ) : (
          // Modo Visualização
          <>
            {/* Progress */}
            <View style={styles.progressCard}>
              <View style={styles.progressHeader}>
                <Text style={styles.progressLabel}>
                  {t("goalDetail.progress")}
                </Text>
                <Text style={styles.progressPercentage}>
                  {progress.toFixed(0)}%
                </Text>
              </View>
              <View style={styles.progressBar}>
                <View
                  style={[
                    styles.progressFill,
                    {
                      width: `${progress}%`,
                      backgroundColor: isCompleted
                        ? colors.success
                        : colors.primary,
                    },
                  ]}
                />
              </View>
              <View style={styles.progressAmounts}>
                <View>
                  <Text style={styles.amountLabel}>
                    {t("goalDetail.amounts.current")}
                  </Text>
                  <Text style={styles.amountValue}>
                    {formatCurrency(currentAmount)}
                  </Text>
                </View>
                <View style={styles.amountDivider} />
                <View>
                  <Text style={styles.amountLabel}>
                    {t("goalDetail.amounts.target")}
                  </Text>
                  <Text style={styles.amountValue}>
                    {formatCurrency(goal.targetAmount)}
                  </Text>
                </View>
                <View style={styles.amountDivider} />
                <View>
                  <Text style={styles.amountLabel}>
                    {t("goalDetail.amounts.remaining")}
                  </Text>
                  <Text style={[styles.amountValue, { color: colors.warning }]}>
                    {formatCurrency(remaining)}
                  </Text>
                </View>
              </View>
            </View>

            {/* Detalhes */}
            <View style={styles.detailsCard}>
              <Text style={styles.detailsTitle}>{t("goalDetail.details")}</Text>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>
                  {t("goalDetail.createdAt")}
                </Text>
                <Text style={styles.detailValue}>
                  {formatDate(goal.createdAt?.toDate?.() || goal.createdAt)}
                </Text>
              </View>
              <View style={styles.divider} />
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>
                  {t("goalDetail.deadline")}
                </Text>
                <Text style={styles.detailValue}>
                  {formatDate(goal.deadline)}
                </Text>
              </View>
              <View style={styles.divider} />
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>
                  {t("goalDetail.targetAmount")}
                </Text>
                <Text style={styles.detailValue}>
                  {formatCurrency(goal.targetAmount)}
                </Text>
              </View>
            </View>

            {/* Adicionar Valor — só para metas não concluídas */}
            {!isCompleted && (
              <View style={styles.addCard}>
                <Text style={styles.addTitle}>{t("goalDetail.addTitle")}</Text>
                <Input
                  label={t("goalDetail.addLabel")}
                  value={addAmount}
                  onChangeText={setAddAmount}
                  placeholder="0,00"
                  keyboardType="numeric"
                  leftIcon={
                    <MaterialCommunityIcons
                      name="currency-usd"
                      size={24}
                      color={colors.textSecondary}
                    />
                  }
                />
                <Button
                  title={t("goalDetail.addTitle")}
                  onPress={handleAddAmount}
                  loading={loading}
                  disabled={!addAmount || parseCurrency(addAmount) <= 0}
                />
              </View>
            )}

            {/* ✅ NOVO: Retirar Valor — só se tiver saldo */}
            {currentAmount > 0 && (
              <View style={styles.withdrawCard}>
                {/* Cabeçalho colapsável */}
                <TouchableOpacity
                  style={styles.withdrawHeader}
                  onPress={() => {
                    setShowWithdraw(!showWithdraw);
                    setWithdrawAmount("");
                    setWithdrawError("");
                  }}
                  activeOpacity={0.7}
                >
                  <View style={styles.withdrawHeaderLeft}>
                    <MaterialCommunityIcons
                      name="bank-minus"
                      size={20}
                      color={colors.warning}
                    />
                    <Text style={styles.withdrawTitle}>
                      {t("goalDetail.withdrawTitle") || "Retirar da Meta"}
                    </Text>
                  </View>
                  <MaterialCommunityIcons
                    name={showWithdraw ? "chevron-up" : "chevron-down"}
                    size={20}
                    color={colors.textSecondary}
                  />
                </TouchableOpacity>

                {/* Formulário expansível */}
                {showWithdraw && (
                  <View style={styles.withdrawForm}>
                    <Text style={styles.withdrawAvailable}>
                      {t("goalDetail.withdrawAvailable") || "Disponível:"}{" "}
                      <Text
                        style={{ color: colors.success, fontWeight: "600" }}
                      >
                        {formatCurrency(currentAmount)}
                      </Text>
                    </Text>

                    <Input
                      label={t("goalDetail.withdrawLabel") || "Valor a retirar"}
                      value={withdrawAmount}
                      onChangeText={(v) => {
                        setWithdrawAmount(v);
                        if (withdrawError) setWithdrawError("");
                      }}
                      placeholder="0,00"
                      keyboardType="numeric"
                      error={withdrawError}
                      leftIcon={
                        <MaterialCommunityIcons
                          name="minus-circle-outline"
                          size={24}
                          color={colors.warning}
                        />
                      }
                    />

                    <Button
                      title={
                        t("goalDetail.withdrawButton") || "Confirmar Retirada"
                      }
                      onPress={handleWithdraw}
                      loading={loading}
                      disabled={!withdrawAmount || parseCurrency(withdrawAmount) <= 0}
                      variant="outline"
                      style={styles.withdrawButton}
                    />
                  </View>
                )}
              </View>
            )}

            {/* Botões de ação */}
            <View style={styles.actions}>
              <TouchableOpacity
                style={[
                  styles.editButton,
                  {
                    backgroundColor:
                      isCompleted && !isPremium
                        ? colors.textSecondary
                        : colors.primary,
                  },
                ]}
                onPress={handleEditPress}
                activeOpacity={0.8}
              >
                <MaterialCommunityIcons
                  name={isCompleted && !isPremium ? "lock" : "pencil"}
                  size={18}
                  color={colors.text}
                />
                <Text style={styles.editButtonText}>
                  {t("goalDetail.edit") || "Editar Meta"}
                  {isCompleted && !isPremium ? "  ⭐ Premium" : ""}
                </Text>
              </TouchableOpacity>

              <Button
                title={t("goalDetail.delete")}
                onPress={handleDelete}
                variant="error"
                style={styles.deleteButton}
              />
            </View>
          </>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const createStyles = (colors) =>
  StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background },
    content: { padding: 20, paddingBottom: 40 },
    header: { alignItems: "center", marginBottom: 24 },
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
      textAlign: "center",
    },
    headerDeadline: { fontSize: 16, color: colors.textSecondary },
    completedBadge: {
      flexDirection: "row",
      alignItems: "center",
      gap: 6,
      backgroundColor: colors.success,
      paddingHorizontal: 20,
      paddingVertical: 8,
      borderRadius: 20,
    },
    completedText: { color: colors.card, fontSize: 16, fontWeight: "600" },
    progressCard: {
      backgroundColor: colors.card,
      borderRadius: 16,
      padding: 20,
      marginBottom: 16,
      shadowColor: COLORS.black,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
    progressHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 12,
    },
    progressLabel: { fontSize: 16, fontWeight: "600", color: colors.text },
    progressPercentage: {
      fontSize: 24,
      fontWeight: "bold",
      color: colors.primary,
    },
    progressBar: {
      height: 12,
      backgroundColor: COLORS.gray200,
      borderRadius: 6,
      overflow: "hidden",
      marginBottom: 16,
    },
    progressFill: { height: "100%", borderRadius: 6 },
    progressAmounts: {
      flexDirection: "row",
      justifyContent: "space-around",
      alignItems: "center",
    },
    amountLabel: {
      fontSize: 13,
      color: colors.textSecondary,
      marginBottom: 4,
      textAlign: "center",
    },
    amountValue: {
      fontSize: 16,
      fontWeight: "600",
      color: colors.text,
      textAlign: "center",
    },
    amountDivider: { width: 1, height: 40, backgroundColor: colors.border },
    detailsCard: {
      backgroundColor: colors.card,
      borderRadius: 16,
      padding: 20,
      marginBottom: 16,
      shadowColor: COLORS.black,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
    detailsTitle: {
      fontSize: 18,
      fontWeight: "600",
      color: colors.text,
      marginBottom: 16,
    },
    detailRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingVertical: 12,
    },
    detailLabel: { fontSize: 15, color: colors.textSecondary },
    detailValue: { fontSize: 15, fontWeight: "600", color: colors.text },
    divider: { height: 1, backgroundColor: colors.border },
    addCard: {
      backgroundColor: colors.card,
      borderRadius: 16,
      padding: 20,
      marginBottom: 16,
      shadowColor: COLORS.black,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
    addTitle: {
      fontSize: 18,
      fontWeight: "600",
      color: colors.text,
      marginBottom: 16,
    },
    // ✅ NOVO: estilos do card de retirada
    withdrawCard: {
      backgroundColor: colors.card,
      borderRadius: 16,
      padding: 20,
      marginBottom: 16,
      shadowColor: COLORS.black,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
    withdrawHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },
    withdrawHeaderLeft: {
      flexDirection: "row",
      alignItems: "center",
      gap: 8,
    },
    withdrawTitle: {
      fontSize: 18,
      fontWeight: "600",
      color: colors.text,
    },
    withdrawForm: {
      marginTop: 16,
    },
    withdrawAvailable: {
      fontSize: 14,
      color: colors.textSecondary,
      marginBottom: 12,
    },
    withdrawButton: {
      marginTop: 4,
    },
    form: { marginBottom: 8 },
    label: {
      fontSize: 14,
      fontWeight: "600",
      color: colors.text,
      marginBottom: 12,
    },
    iconSection: { marginBottom: 24 },
    iconGrid: { flexDirection: "row", flexWrap: "wrap", gap: 10 },
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
    actions: { gap: 12, marginTop: 8 },
    editButton: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: 8,
      paddingVertical: 14,
      borderRadius: 12,
    },
    editButtonText: { fontSize: 16, fontWeight: "600", color: colors.text },
    saveButton: { marginBottom: 4 },
    deleteButton: { marginTop: 4 },
    errorText: {
      fontSize: 16,
      color: colors.error,
      textAlign: "center",
      paddingHorizontal: 20,
      paddingVertical: 40,
    },
  });

export default GoalDetailScreen;
