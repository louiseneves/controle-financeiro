import React, { useMemo } from "react";
import { useTheme } from "../../context/ThemeContext";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Linking,
  Image,
} from "react-native";
import useSettingsStore from "../../store/settingsStore";
import { t } from "../../i18n";
import { MaterialCommunityIcons } from "@expo/vector-icons";

const AboutScreen = () => {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const { getTheme } = useSettingsStore();
  const theme = getTheme();

  const openLink = (url) => {
    Linking.openURL(url);
  };

  const libraries = [
    { name: "React Native", version: "0.81.5", license: "MIT" },
    { name: "React Navigation", version: "7.1.25", license: "MIT" },
    { name: "Zustand", version: "5.0.9", license: "MIT" },
    { name: "Firebase", version: "12.7.0", license: "Apache 2.0" },
    { name: "Gifted Charts", version: "1.4.70", license: "MIT" },
    { name: "AsyncStorage", version: "2.2.0", license: "MIT" },
  ];

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      {/* Header */}
      <View style={[styles.header, { backgroundColor: colors.primary }]}>
        <Text style={styles.headerTitle}>{t("about.header.title")}</Text>
        <Text style={styles.headerSubtitle}>{t("about.header.version")}</Text>
      </View>

      {/* Logo/Ícone */}
      <View style={[styles.logoSection, { backgroundColor: colors.card }]}>
        <Image
          source={require("../../assets/icons/logo.png")}
          style={styles.logoIcon}
        />
        <Text style={[styles.appName, { color: colors.text }]}>
          {t("about.app.name")}
        </Text>
        <Text style={[styles.appTagline, { color: colors.textSecondary }]}>
          {t("about.app.tagline")}
        </Text>
      </View>

      {/* Descrição */}
      <View style={[styles.section, { backgroundColor: colors.card }]}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>
          <MaterialCommunityIcons
            name="book-open"
            size={20}
            color={colors.text}
          />{" "}
          {t("about.sections.about")}
        </Text>
        <Text style={[styles.description, { color: colors.textSecondary }]}>
          {t("about.description")}
        </Text>
      </View>

      {/* Funcionalidades */}
      <View style={[styles.section, { backgroundColor: colors.card }]}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>
          <MaterialCommunityIcons
            name="star-four-points-outline"
            size={20}
            color={colors.text}
          />
          {t("about.sections.features")}
        </Text>
        <View style={styles.featuresList}>
          {t("about.features", { returnObjects: true }).map(
            (feature, index) => (
              <View key={index} style={styles.featureItem}>
                <Text style={[styles.featureBullet, { color: colors.primary }]}>
                  •
                </Text>
                <Text style={styles.featureText}>{feature}</Text>
              </View>
            ),
          )}
        </View>
      </View>

      {/* Bibliotecas */}
      <View style={[styles.section, { backgroundColor: colors.card }]}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>
          <MaterialCommunityIcons
            name="bookmark-multiple-outline"
            size={20}
            color={colors.text}
          />
          {t("about.sections.libraries")}
        </Text>
        {libraries.map((lib, index) => (
          <View
            key={index}
            style={[styles.libraryItem, { borderBottomColor: colors.border }]}
          >
            <View style={styles.libraryInfo}>
              <Text style={[styles.libraryName, { color: colors.text }]}>
                {lib.name}
              </Text>
              <Text
                style={[styles.libraryVersion, { color: colors.textSecondary }]}
              >
                v{lib.version} • {lib.license}
              </Text>
            </View>
          </View>
        ))}
      </View>

      {/* Desenvolvedor */}
      <View style={[styles.section, { backgroundColor: colors.card }]}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>
          <MaterialCommunityIcons
            name="laptop-account"
            size={20}
            color={colors.text}
          />
          {t("about.sections.developer")}
        </Text>
        <View style={styles.developerSection}>
          {/* "Desenvolvido com ❤️ por Louise" */}
          <View style={styles.madeByRow}>
            <Text style={[styles.text, { color: colors.textSecondary }]}>
              {t("about.developer.madeByPrefix")}
            </Text>

            <MaterialCommunityIcons
              name="heart"
              size={16}
              color={colors.error} // Vermelho
            />

            <Text style={[styles.text, { color: colors.textSecondary }]}>
              {t("about.developer.madeByAuthor")}
            </Text>
          </View>

          <Text style={[styles.rights, { color: colors.textTertiary }]}>
            {t("about.developer.rights")}
          </Text>
        </View>
      </View>

      {/* Links */}
      <View style={[styles.section, { backgroundColor: colors.card }]}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>
          <MaterialCommunityIcons
            name="link-variant"
            size={20}
            color={colors.text}
          />
          {t("about.sections.links")}
        </Text>

        <TouchableOpacity
          style={[styles.linkButton, { borderColor: colors.border }]}
          onPress={() => openLink("https://controlefinanceiro.com/privacy")}
        >
          <Text style={[styles.linkText, { color: colors.primary }]}>
            {t("about.links.privacy")}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.linkButton, { borderColor: colors.border }]}
          onPress={() => openLink("https://controlefinanceiro.com/terms")}
        >
          <Text style={[styles.linkText, { color: colors.primary }]}>
            {t("about.links.terms")}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.linkButton, { borderColor: colors.border }]}
          onPress={() =>
            openLink("https://github.com/louiseneves/controle-financeiro")
          }
        >
          <Text style={[styles.linkText, { color: colors.primary }]}>
            {t("about.links.source")}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Rodapé */}
      <View style={styles.footer}>
        <Text style={[styles.footerText, { color: colors.textSecondary }]}>
          {t("about.footer.madeWith")}{" "}
          <MaterialCommunityIcons
            name="rocket-launch"
            size={14}
            color={colors.primary}
          />
        </Text>
        <Text style={[styles.footerText, { color: colors.textSecondary }]}>
          {t("about.footer.build")}
        </Text>
      </View>
    </ScrollView>
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
      alignItems: "center",
    },
    headerTitle: {
      fontSize: 24,
      fontWeight: "bold",
      color: colors.onPrimary,
      marginBottom: 5,
    },
    headerSubtitle: {
      fontSize: 14,
      color: colors.onPrimary + "CC", // 80% de opacidade
      opacity: 0.9,
    },
    logoSection: {
      alignItems: "center",
      paddingVertical: 30,
      marginTop: 15,
    },
    logoIcon: {
      fontSize: 80,
      marginBottom: 15,
      width: 125,
      height: 125,
    },
    appName: {
      fontSize: 24,
      fontWeight: "bold",
      marginBottom: 5,
    },
    appTagline: {
      fontSize: 14,
    },
    section: {
      marginTop: 15,
      padding: 20,
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: "bold",
      marginBottom: 15,
    },
    developerSection: {
      alignItems: "center",
      marginVertical: 24,
    },
    madeByRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: 4, // ← Espaçamento entre elementos
      marginBottom: 8,
    },
    text: {
      fontSize: 14,
      fontWeight: "500",
    },
    rights: {
      fontSize: 12,
    },
    description: {
      fontSize: 15,
      lineHeight: 24,
    },
    featuresList: {
      gap: 8,
    },
    featureItem: {
      flexDirection: "row",
      alignItems: "flex-start",
    },
    featureBullet: {
      fontSize: 20,
      marginRight: 10,
      marginTop: -2,
    },
    featureText: {
      flex: 1,
      fontSize: 14,
      lineHeight: 22,
    },
    libraryItem: {
      paddingVertical: 12,
      borderBottomWidth: 1,
    },
    libraryInfo: {
      gap: 4,
    },
    libraryName: {
      fontSize: 15,
      fontWeight: "500",
    },
    libraryVersion: {
      fontSize: 13,
    },
    developer: {
      fontSize: 14,
      textAlign: "center",
      marginBottom: 5,
    },
    linkButton: {
      paddingVertical: 15,
      borderBottomWidth: 1,
    },
    linkText: {
      fontSize: 15,
      fontWeight: "500",
    },
    footer: {
      alignItems: "center",
      paddingVertical: 30,
      gap: 5,
    },
    footerText: {
      fontSize: 12,
    },
  });

export default AboutScreen;
