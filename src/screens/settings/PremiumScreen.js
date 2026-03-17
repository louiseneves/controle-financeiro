/**
 * Tela de Upgrade Premium
 */

import React, { useEffect, useState, useMemo } from "react";
import { useTheme } from "../../context/ThemeContext";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from "react-native";
import { Button } from "../../components/ui";
import { COLORS, formatCurrency } from "../../utils";
import usePremiumStore from "../../store/premiumStore";
import { t } from "../../i18n";
import {
  MaterialCommunityIcons,
  Feather,
  MaterialIcons,
} from "@expo/vector-icons";

const PremiumScreen = ({ navigation }) => {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const {
    isPremium,
    subscriptionType,
    expirationDate,
    activatePremium,
    cancelPremium,
    loadPremiumStatus,
  } = usePremiumStore();
  const [selectedPlan, setSelectedPlan] = useState("yearly");

  useEffect(() => {
    loadPremiumStatus();
  }, []);

  const plans = [
    {
      id: "monthly",
      name: t("premium.plans.monthly"),
      price: 9.9,
      period: t("premium.plans.month"),
      savings: null,
    },
    {
      id: "yearly",
      name: t("premium.plans.yearly"),
      price: 89.9,
      period: t("premium.plans.year"),
      savings: t("premium.plans.discount"),
      pricePerMonth: 7.49,
    },
  ];

  const features = [
    {
      icon: (
        <MaterialCommunityIcons
          name="chart-box"
          size={28}
          color={colors.text}
        />
      ),
      title: t("premium.features.advancedReports.title"),
      description: t("premium.features.advancedReports.description"),
    },
    {
      icon: (
        <MaterialCommunityIcons
          name="chart-line"
          size={28}
          color={colors.text}
        />
      ),
      title: t("premium.features.futureProjections.title"),
      description: t("premium.features.futureProjections.description"),
    },
    {
      icon: (
        <MaterialCommunityIcons
          name="file-document"
          size={28}
          color={colors.text}
        />
      ),
      title: t("premium.features.exportPdf.title"),
      description: t("premium.features.exportPdf.description"),
    },
    {
      icon: (
        <MaterialCommunityIcons
          name="file-excel"
          size={28}
          color={colors.text}
        />
      ),
      title: t("premium.features.exportExcel.title"),
      description: t("premium.features.exportExcel.description"),
    },
    {
      icon: (
        <MaterialCommunityIcons name="calendar" size={28} color={colors.text} />
      ),
      title: t("premium.features.yearlyReports.title"),
      description: t("premium.features.yearlyReports.description"),
    },
    {
      icon: (
        <MaterialCommunityIcons name="reload" size={28} color={colors.text} />
      ),
      title: t("premium.features.periodComparison.title"),
      description: t("premium.features.periodComparison.description"),
    },
    {
      icon: <Feather name="target" size={28} color={colors.text} />,
      title: t("premium.features.unlimitedGoals.title"),
      description: t("premium.features.unlimitedGoals.description"),
    },
    {
      icon: (
        <MaterialCommunityIcons name="cloud" size={28} color={colors.text} />
      ),
      title: t("premium.features.unlimitedBackup.title"),
      description: t("premium.features.unlimitedBackup.description"),
    },
    {
      icon: (
        <MaterialCommunityIcons name="rocket" size={28} color={colors.text} />
      ),
      title: t("premium.features.earlyAccess.title"),
      description: t("premium.features.earlyAccess.description"),
    },
  ];

  const selectedPlanData = useMemo(() => {
    return plans.find((p) => p.id === selectedPlan);
  }, [selectedPlan]);

  const handleSubscribe = async () => {
    if (!selectedPlanData) {
      Alert.alert(
        t("premium.alerts.errorTitle"),
        t("premium.alerts.invalidPlan"),
      );
      return;
    }

    Alert.alert(
      t("premium.alerts.confirmTitle"),
      t("premium.alerts.confirmMessage", {
        plan: selectedPlanData.name,
        price: formatCurrency(selectedPlanData.price),
      }),
      [
        { text: t("premium.buttons.cancel"), style: "cancel" },
        {
          text: t("premium.buttons.confirmDemo"),
          onPress: async () => {
            const result = await activatePremium(selectedPlan);
            if (result.success) {
              Alert.alert(
                t("premium.alerts.welcomeTitle"),
                <MaterialIcons name="celebration" color={colors.text} />,
                t("premium.alerts.welcomeMessage"),
                [
                  {
                    text: t("premium.alerts.ok"),
                    onPress: () => navigation.goBack(),
                  },
                ],
              );
            }
          },
        },
      ],
    );
  };

  const handleCancelSubscription = () => {
    Alert.alert(
      t("premium.alerts.cancelTitle"),
      t("premium.alerts.cancelMessage"),
      [
        { text: t("premium.buttons.no"), style: "cancel" },
        {
          text: t("premium.buttons.yesCancel"),
          style: "destructive",
          onPress: async () => {
            const result = await cancelPremium();
            if (result.success) {
              Alert.alert(
                t("premium.premiumStatus.canceled"),
                t("premium.premiumStatus.canceledMessage"),
                [
                  {
                    text: t("premium.alerts.ok"),
                    onPress: () => navigation.goBack(),
                  },
                ],
              );
            }
          },
        },
      ],
    );
  };

  if (isPremium) {
    // Usuário já é Premium
    return (
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
      >
        <View style={styles.premiumHeader}>
          <Text style={styles.premiumBadge}>{t("premium.badge")}</Text>
          <Text style={styles.premiumTitle}>
            {t("premium.premiumStatus.title")}
          </Text>
          <Text style={styles.premiumSubtitle}>
            {t("premium.premiumStatus.subtitle")}
          </Text>
        </View>

        <View style={styles.statusCard}>
          <View style={styles.statusRow}>
            <Text style={styles.statusLabel}>
              {t("premium.premiumStatus.plan")}
            </Text>
            <Text style={styles.statusValue}>
              {subscriptionType === "monthly" ? "Mensal" : "Anual"}
            </Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.statusRow}>
            <Text style={styles.statusLabel}>
              {t("premium.premiumStatus.validUntil")}
            </Text>
            <Text style={styles.statusValue}>
              {new Date(expirationDate).toLocaleDateString("pt-BR")}
            </Text>
          </View>
        </View>

        <View style={styles.featuresSection}>
          <Text style={styles.sectionTitle}>
            {t("premium.features.titleAvailable")}
          </Text>
          {features.map((feature, index) => (
            <View key={index} style={styles.featureItem}>
              <Text style={styles.featureIcon}>{feature.icon}</Text>
              <View style={styles.featureContent}>
                <Text style={styles.featureTitle}>{feature.title}</Text>
                <Text style={styles.featureDescription}>
                  {feature.description}
                </Text>
              </View>
              <Text style={styles.featureCheck}>✓</Text>
            </View>
          ))}
        </View>

        <Button
          title={t("premium.buttons.manage")}
          onPress={handleCancelSubscription}
          variant="outline"
          style={styles.manageButton}
        />
      </ScrollView>
    );
  }

  // Usuário não Premium - mostrar planos
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerBadge}> {t("premium.badge")}</Text>
        <Text style={styles.headerTitle}>{t("premium.header.title")}</Text>
        <Text style={styles.headerSubtitle}>
          {t("premium.header.subtitle")}
        </Text>
      </View>

      {/* Planos */}
      <View style={styles.plansSection}>
        <Text style={styles.sectionTitle}>{t("premium.plans.choose")}</Text>
        {plans.map((plan) => (
          <TouchableOpacity
            key={plan.id}
            style={[
              styles.planCard,
              selectedPlan === plan.id && styles.planCardSelected,
            ]}
            onPress={() => setSelectedPlan(plan.id)}
            activeOpacity={0.7}
          >
            {plan.savings && (
              <View style={styles.savingsBadge}>
                <Text style={styles.savingsText}>{plan.savings}</Text>
              </View>
            )}

            <View style={styles.planHeader}>
              <Text style={styles.planName}>{plan.name}</Text>
              <View style={styles.planPrice}>
                <Text style={styles.planPriceValue}>
                  {formatCurrency(plan.price)}
                </Text>
                <Text style={styles.planPricePeriod}>/{plan.period}</Text>
              </View>
              {plan.pricePerMonth && (
                <Text style={styles.planPriceMonth}>
                  {formatCurrency(plan.pricePerMonth)}/
                  {t("premium.plans.month")}
                </Text>
              )}
            </View>

            {selectedPlan === plan.id && (
              <View style={styles.selectedIndicator}>
                <Text style={styles.selectedText}>
                  {" "}
                  {t("premium.plans.selected")}
                </Text>
              </View>
            )}
          </TouchableOpacity>
        ))}
      </View>

      {/* Recursos */}
      <View style={styles.featuresSection}>
        <Text style={styles.sectionTitle}>
          {t("premium.features.titleGain")}
        </Text>
        {features.map((feature, index) => (
          <View key={index} style={styles.featureItem}>
            <Text style={styles.featureIcon}>{feature.icon}</Text>
            <View style={styles.featureContent}>
              <Text style={styles.featureTitle}>{feature.title}</Text>
              <Text style={styles.featureDescription}>
                {feature.description}
              </Text>
            </View>
          </View>
        ))}
      </View>

      {/* Garantia */}
      <View style={styles.guaranteeBox}>
        <Text style={styles.guaranteeIcon}>
          <MaterialCommunityIcons
            name="shield-check"
            size={28}
            color={colors.text}
          />
        </Text>
        <View style={styles.guaranteeContent}>
          <Text style={styles.guaranteeTitle}>
            {t("premium.guarantee.title")}
          </Text>
          <Text style={styles.guaranteeText}>
            {t("premium.guarantee.text")}
          </Text>
        </View>
      </View>

      {/* Botão de Assinatura */}
      <Button
        title={t("premium.buttons.subscribe", {
          price: formatCurrency(selectedPlanData?.price),
        })}
        onPress={handleSubscribe}
        style={styles.subscribeButton}
      />

      <Text style={styles.disclaimer}>
        {t("premium.alerts.demoDisclaimer")}
      </Text>
    </ScrollView>
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
    headerBadge: {
      fontSize: 48,
      marginBottom: 16,
    },
    headerTitle: {
      fontSize: 28,
      fontWeight: "bold",
      color: colors.text,
      marginBottom: 8,
      textAlign: "center",
    },
    headerSubtitle: {
      fontSize: 16,
      color: colors.textSecondary,
      textAlign: "center",
    },
    premiumHeader: {
      alignItems: "center",
      backgroundColor: colors.warning,
      borderRadius: 16,
      padding: 32,
      marginBottom: 24,
    },
    premiumBadge: {
      fontSize: 48,
      marginBottom: 16,
    },
    premiumTitle: {
      fontSize: 28,
      fontWeight: "bold",
      color: colors.card,
      marginBottom: 8,
    },
    premiumSubtitle: {
      fontSize: 16,
      color: colors.card,
      opacity: 0.9,
    },
    statusCard: {
      backgroundColor: colors.card,
      borderRadius: 12,
      padding: 20,
      marginBottom: 24,
      shadowColor: COLORS.black,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
    statusRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      paddingVertical: 12,
    },
    statusLabel: {
      fontSize: 16,
      color: colors.textSecondary,
    },
    statusValue: {
      fontSize: 16,
      fontWeight: "600",
      color: colors.text,
    },
    divider: {
      height: 1,
      backgroundColor: colors.border,
    },
    plansSection: {
      marginBottom: 32,
    },
    sectionTitle: {
      fontSize: 20,
      fontWeight: "600",
      color: colors.text,
      marginBottom: 16,
    },
    planCard: {
      backgroundColor: colors.card,
      borderRadius: 16,
      padding: 20,
      marginBottom: 12,
      borderWidth: 2,
      borderColor: colors.border,
      position: "relative",
      shadowColor: COLORS.black,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
    planCardSelected: {
      borderColor: colors.warning,
      borderWidth: 3,
      backgroundColor: colors.warning + "05",
    },
    savingsBadge: {
      position: "absolute",
      top: -10,
      right: 20,
      backgroundColor: colors.success,
      paddingHorizontal: 12,
      paddingVertical: 4,
      borderRadius: 12,
    },
    savingsText: {
      fontSize: 12,
      fontWeight: "600",
      color: colors.card,
    },
    planHeader: {
      alignItems: "center",
    },
    planName: {
      fontSize: 20,
      fontWeight: "600",
      color: colors.text,
      marginBottom: 12,
    },
    planPrice: {
      flexDirection: "row",
      alignItems: "baseline",
      marginBottom: 4,
    },
    planPriceValue: {
      fontSize: 36,
      fontWeight: "bold",
      color: colors.warning,
    },
    planPricePeriod: {
      fontSize: 18,
      color: colors.textSecondary,
    },
    planPriceMonth: {
      fontSize: 14,
      color: colors.textSecondary,
    },
    selectedIndicator: {
      marginTop: 12,
      backgroundColor: colors.warning,
      paddingVertical: 8,
      borderRadius: 8,
      alignItems: "center",
    },
    selectedText: {
      fontSize: 14,
      fontWeight: "600",
      color: colors.card,
    },
    featuresSection: {
      marginBottom: 24,
    },
    featureItem: {
      flexDirection: "row",
      alignItems: "flex-start",
      backgroundColor: colors.card,
      borderRadius: 12,
      padding: 16,
      marginBottom: 8,
      gap: 12,
    },
    featureIcon: {
      fontSize: 28,
    },
    featureContent: {
      flex: 1,
    },
    featureTitle: {
      fontSize: 16,
      fontWeight: "600",
      color: colors.text,
      marginBottom: 4,
    },
    featureDescription: {
      fontSize: 14,
      color: colors.textSecondary,
    },
    featureCheck: {
      fontSize: 20,
      color: colors.success,
    },
    guaranteeBox: {
      flexDirection: "row",
      backgroundColor: colors.success + "10",
      borderRadius: 12,
      padding: 16,
      marginBottom: 24,
      gap: 12,
    },
    guaranteeIcon: {
      fontSize: 32,
    },
    guaranteeContent: {
      flex: 1,
    },
    guaranteeTitle: {
      fontSize: 16,
      fontWeight: "600",
      color: colors.text,
      marginBottom: 4,
    },
    guaranteeText: {
      fontSize: 14,
      color: colors.textSecondary,
    },
    subscribeButton: {
      marginBottom: 16,
    },
    manageButton: {
      marginTop: 8,
    },
    disclaimer: {
      fontSize: 12,
      color: colors.textSecondary,
      textAlign: "center",
      fontStyle: "italic",
    },
  });

export default PremiumScreen;
