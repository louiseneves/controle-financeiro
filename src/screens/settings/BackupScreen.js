import React, { useEffect, useState, useMemo } from "react";
import { useTheme } from "../../context/ThemeContext";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Switch,
  Share,
} from "react-native";

import { useBackupStore } from "../../store/backupStore";
import usePremiumStore from "../../store/premiumStore";
import { t } from "../../i18n";

import {
  MaterialCommunityIcons,
  FontAwesome5,
  FontAwesome6,
} from "@expo/vector-icons";

const BackupScreen = ({ navigation }) => {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

  const {
    backups,
    loading,
    autoBackupEnabled,
    lastBackup,
    loadSettings,
    loadBackups,
    createBackup,
    restoreBackup,
    deleteBackup,
    toggleAutoBackup,
    exportBackupJSON,
  } = useBackupStore();

  const { isPremium } = usePremiumStore();

  const [creating, setCreating] = useState(false);

  // ================= INIT =================
  useEffect(() => {
    loadSettings();
    loadBackups();
  }, []);

  // ================= ACTIONS =================

  const handleCreateBackup = async () => {
    setCreating(true);

    try {
      await createBackup(false, isPremium);

      Alert.alert(t("backup.alerts.success"), t("backup.alerts.created"));
    } catch (error) {
      if (error.message === "BACKUP_LIMIT") {
        Alert.alert(
          t("premium.alerts.limitTitle"),
          t("premium.alerts.backupLimit", { limit: 3 }),
          [
            { text: t("premium.alerts.ok") },
            {
              text: t("premium.buttons.upgrade"),
              onPress: () => navigation.navigate("Premium"),
            },
          ],
        );
        return;
      }

      Alert.alert(t("backup.alerts.error"), error.message);
    } finally {
      setCreating(false);
    }
  };

  const handleRestoreBackup = (backupId) => {
    Alert.alert(
      t("backup.alerts.confirmRestoreTitle"),
      t("backup.alerts.confirmRestoreMessage"),
      [
        { text: t("backup.alerts.cancel"), style: "cancel" },
        {
          text: t("backup.alerts.restore"),
          style: "destructive",
          onPress: async () => {
            try {
              await restoreBackup(backupId);

              Alert.alert(
                t("backup.alerts.success"),
                t("backup.alerts.restored"),
                [
                  {
                    text: t("backup.alerts.ok"),
                    onPress: () => navigation.goBack(),
                  },
                ],
              );
            } catch (error) {
              Alert.alert(t("backup.alerts.error"), error.message);
            }
          },
        },
      ],
    );
  };

  const handleDeleteBackup = (backupId) => {
    Alert.alert(
      t("backup.alerts.confirmDeleteTitle"),
      t("backup.alerts.confirmDeleteMessage"),
      [
        { text: t("backup.alerts.cancel"), style: "cancel" },
        {
          text: t("backup.alerts.delete"),
          style: "destructive",
          onPress: async () => {
            try {
              await deleteBackup(backupId);
              Alert.alert(
                t("backup.alerts.success"),
                t("backup.alerts.deleted"),
              );
            } catch (error) {
              Alert.alert(t("backup.alerts.error"), error.message);
            }
          },
        },
      ],
    );
  };

  const handleExportJSON = async () => {
    if (!isPremium) {
      Alert.alert(
        t("backup.alerts.premiumTitle"),
        t("backup.alerts.premiumMessage"),
        [
          { text: t("backup.alerts.cancel"), style: "cancel" },
          {
            text: t("backup.alerts.upgrade"),
            onPress: () => navigation.navigate("Premium"),
          },
        ],
      );
      return;
    }

    try {
      const jsonData = await exportBackupJSON();

      await Share.share({
        message: jsonData,
        title: t("backup.alerts.backupTitle"),
      });
    } catch (error) {
      Alert.alert(t("backup.alerts.error"), error.message);
    }
  };

  // ================= HELPERS =================

  const formatDate = (dateString) => {
    if (!dateString) return t("misc.unavailable");

    const date = new Date(dateString);
    if (isNaN(date.getTime())) return t("misc.invalidDate");

    return date.toLocaleString("pt-BR");
  };

  const getBackupSize = (backup) => {
    const count =
      (backup.data?.transactions?.length || 0) +
      (backup.data?.goals?.length || 0) +
      (backup.data?.budgets?.length || 0);

    return t(
      count === 1 ? "backup.misc.items_one" : "backup.misc.items_other",
      { count },
    );
  };

  // ================= UI =================

  return (
    <ScrollView style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>{t("backup.header.title")}</Text>
        <Text style={styles.headerSubtitle}>{t("backup.header.subtitle")}</Text>
      </View>

      {/* AUTO BACKUP */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <View>
            <Text style={styles.sectionTitle}>{t("backup.auto.title")}</Text>
            {!isPremium && <Text style={styles.premiumLabel}>⭐ Premium</Text>}
          </View>

          <Switch
            value={autoBackupEnabled && isPremium}
            onValueChange={(value) => {
              if (!isPremium) {
                Alert.alert(
                  t("premium.alerts.limitTitle"),
                  t("backup.alerts.autoBackupPremiumMessage") ||
                    "O backup automático é exclusivo para usuários Premium.",
                  [
                    { text: "Agora não", style: "cancel" },
                    {
                      text: "Ver Premium",
                      onPress: () => navigation.navigate("Premium"),
                    },
                  ],
                );
                return;
              }
              toggleAutoBackup(value);
            }}
          />
        </View>

        <Text style={styles.sectionDescription}>
          {t("backup.auto.description")}
        </Text>

        {lastBackup && (
          <Text style={styles.lastBackup}>
            {t("backup.auto.last")} {formatDate(lastBackup)}
          </Text>
        )}
      </View>

      {/* ACTIONS */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>
          {t("backup.quickActions.title")}
        </Text>

        {/* CREATE */}
        <TouchableOpacity
          onPress={handleCreateBackup}
          disabled={creating || loading}
          style={styles.primaryButton}
        >
          {creating ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>
              {t("backup.quickActions.create")}
            </Text>
          )}
        </TouchableOpacity>

        {/* EXPORT */}
        <TouchableOpacity
          style={styles.secondaryButton}
          onPress={handleExportJSON}
        >
          <Text style={styles.buttonText}>
            {t("backup.quickActions.export")}
          </Text>
          {!isPremium && <Text style={styles.premiumBadge}>Premium</Text>}
        </TouchableOpacity>
      </View>

      {/* LIST */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{t("backup.list.title")}</Text>

        {loading ? (
          <ActivityIndicator style={{ marginTop: 20 }} />
        ) : backups.length === 0 ? (
          <View style={styles.emptyState}>
            <FontAwesome5
              name="box-open"
              size={48}
              color={colors.textSecondary}
            />
            <Text style={styles.emptyText}>{t("backup.list.emptyTitle")}</Text>
          </View>
        ) : (
          backups.map((backup) => (
            <View key={backup.id} style={styles.card}>
              {/* ✅ Indicador Auto */}
              <View style={styles.cardHeader}>
                <Text style={styles.date}>{formatDate(backup.timestamp)}</Text>
                {backup.isAutomatic && (
                  <View style={styles.autoBadge}>
                    <Text style={styles.autoBadgeText}>
                      {t("backup.list.auto")}
                    </Text>
                  </View>
                )}
              </View>

              <Text style={styles.size}>{getBackupSize(backup)}</Text>

              <View style={styles.actions}>
                <TouchableOpacity
                  onPress={() => {
                    if (!isPremium) {
                      Alert.alert(
                        t("premium.alerts.limitTitle"),
                        t("backup.alerts.restorePremiumMessage") ||
                          "A restauração de backup é exclusiva para usuários Premium.",
                        [
                          { text: "Agora não", style: "cancel" },
                          {
                            text: "Ver Premium",
                            onPress: () => navigation.navigate("Premium"),
                          },
                        ],
                      );
                      return;
                    }
                    handleRestoreBackup(backup.id);
                  }}
                >
                  <Text
                    style={[
                      styles.restore,
                      !isPremium && { color: colors.textSecondary },
                    ]}
                  >
                    {t("backup.list.restore")} {!isPremium ? "⭐" : ""}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleDeleteBackup(backup.id)}>
                  <Text style={styles.delete}>{t("backup.list.delete")}</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))
        )}
      </View>
    </ScrollView>
  );
};

// ================= STYLES =================

const createStyles = (colors) =>
  StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background },

    header: {
      backgroundColor: colors.primary,
      padding: 20,
    },

    headerTitle: {
      fontSize: 22,
      fontWeight: "bold",
      color: "#fff",
    },

    headerSubtitle: {
      color: "#fff",
      opacity: 0.8,
    },

    section: {
      backgroundColor: colors.card,
      padding: 20,
      marginTop: 10,
    },

    sectionHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },

    sectionTitle: {
      fontSize: 16,
      fontWeight: "bold",
      color: colors.text,
    },

    sectionDescription: {
      fontSize: 13,
      color: colors.textSecondary,
      marginTop: 5,
    },

    lastBackup: {
      marginTop: 10,
      color: colors.success,
      fontSize: 12,
    },

    primaryButton: {
      backgroundColor: colors.success,
      padding: 15,
      borderRadius: 10,
      marginTop: 10,
    },

    secondaryButton: {
      backgroundColor: colors.primary,
      padding: 15,
      borderRadius: 10,
      marginTop: 10,
    },

    buttonText: {
      color: "#fff",
      fontWeight: "bold",
      textAlign: "center",
    },

    premiumBadge: {
      position: "absolute",
      right: 10,
      top: 10,
      color: "#fff",
      fontSize: 10,
    },

    emptyState: {
      alignItems: "center",
      padding: 30,
    },

    emptyText: {
      marginTop: 10,
      color: colors.textSecondary,
    },

    card: {
      backgroundColor: colors.background,
      padding: 15,
      borderRadius: 10,
      marginTop: 10,
    },

    date: {
      fontWeight: "bold",
      color: colors.text,
    },

    size: {
      color: colors.textSecondary,
      marginBottom: 10,
    },

    cardHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 4,
    },
    autoBadge: {
      backgroundColor: colors.primary + "20",
      paddingHorizontal: 8,
      paddingVertical: 2,
      borderRadius: 10,
    },
    autoBadgeText: {
      fontSize: 11,
      color: colors.primary,
      fontWeight: "600",
    },

    premiumLabel: {
      fontSize: 11,
      color: colors.warning,
      fontWeight: "600",
      marginTop: 2,
    },

    actions: {
      flexDirection: "row",
      justifyContent: "space-between",
    },

    restore: {
      color: colors.primary,
      fontWeight: "600",
    },

    delete: {
      color: colors.error,
      fontWeight: "600",
    },
  });

export default BackupScreen;
