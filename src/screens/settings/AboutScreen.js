import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Linking,
  Image,
} from 'react-native';
import useSettingsStore from '../../store/settingsStore';

const AboutScreen = () => {
  const { getTheme } = useSettingsStore();
  const theme = getTheme();

  const openLink = (url) => {
    Linking.openURL(url);
  };

  const libraries = [
    { name: 'React Native', version: '0.81.5', license: 'MIT' },
    { name: 'React Navigation', version: '7.1.25', license: 'MIT' },
    { name: 'Zustand', version: '5.0.9', license: 'MIT' },
    { name: 'Firebase', version: '12.7.0', license: 'Apache 2.0' },
    { name: 'Gifted Charts', version: '1.4.70', license: 'MIT' },
    { name: 'AsyncStorage', version: '2.2.0', license: 'MIT' },
  ];

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.background }]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: theme.primary }]}>
        <Text style={styles.headerTitle}>Sobre o App</Text>
        <Text style={styles.headerSubtitle}>v1.0.0</Text>
      </View>

      {/* Logo/Ícone */}
      <View style={[styles.logoSection, { backgroundColor: theme.card }]}>
        <Image source={require('../../assets/icons/logo.png')} style={styles.logoIcon} />
        <Text style={[styles.appName, { color: theme.text }]}>
          Controle Financeiro
        </Text>
        <Text style={[styles.appTagline, { color: theme.textSecondary }]}>
          Organize suas finanças com inteligência
        </Text>
      </View>

      {/* Descrição */}
      <View style={[styles.section, { backgroundColor: theme.card }]}>
        <Text style={[styles.sectionTitle, { color: theme.text }]}>
          📖 Sobre
        </Text>
        <Text style={[styles.description, { color: theme.textSecondary }]}>
          O Controle Financeiro é um aplicativo completo para gestão de suas
          finanças pessoais. Com ele você pode controlar receitas, despesas,
          investimentos, definir metas, criar orçamentos e muito mais.
        </Text>
      </View>

      {/* Funcionalidades */}
      <View style={[styles.section, { backgroundColor: theme.card }]}>
        <Text style={[styles.sectionTitle, { color: theme.text }]}>
          ✨ Funcionalidades
        </Text>
        <View style={styles.featuresList}>
          {[
            'Controle de receitas e despesas',
            'Gestão de investimentos',
            'Calculadora de dízimo e ofertas',
            'Metas financeiras',
            'Orçamento mensal',
            'Relatórios detalhados',
            'Backup em nuvem',
            'Sistema Premium',
            'Suporte completo',
            'Modo escuro',
            'Múltiplas moedas',
          ].map((feature, index) => (
            <View key={index} style={styles.featureItem}>
              <Text style={[styles.featureBullet, { color: theme.primary }]}>
                •
              </Text>
              <Text style={[styles.featureText, { color: theme.textSecondary }]}>
                {feature}
              </Text>
            </View>
          ))}
        </View>
      </View>

      {/* Bibliotecas */}
      <View style={[styles.section, { backgroundColor: theme.card }]}>
        <Text style={[styles.sectionTitle, { color: theme.text }]}>
          📚 Bibliotecas de Código Aberto
        </Text>
        {libraries.map((lib, index) => (
          <View
            key={index}
            style={[styles.libraryItem, { borderBottomColor: theme.border }]}
          >
            <View style={styles.libraryInfo}>
              <Text style={[styles.libraryName, { color: theme.text }]}>
                {lib.name}
              </Text>
              <Text style={[styles.libraryVersion, { color: theme.textSecondary }]}>
                v{lib.version} • {lib.license}
              </Text>
            </View>
          </View>
        ))}
      </View>

      {/* Desenvolvedor */}
      <View style={[styles.section, { backgroundColor: theme.card }]}>
        <Text style={[styles.sectionTitle, { color: theme.text }]}>
          👨‍💻 Desenvolvedor
        </Text>
        <Text style={[styles.developer, { color: theme.textSecondary }]}>
          Desenvolvido com ❤️ por Louise
        </Text>
        <Text style={[styles.developer, { color: theme.textSecondary }]}>
          © 2026 Todos os direitos reservados
        </Text>
      </View>

      {/* Links */}
      <View style={[styles.section, { backgroundColor: theme.card }]}>
        <Text style={[styles.sectionTitle, { color: theme.text }]}>
          🔗 Links Úteis
        </Text>
        
        <TouchableOpacity
          style={[styles.linkButton, { borderColor: theme.border }]}
          onPress={() => openLink('https://controlefinanceiro.com/privacy')}
        >
          <Text style={[styles.linkText, { color: theme.primary }]}>
            Política de Privacidade
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.linkButton, { borderColor: theme.border }]}
          onPress={() => openLink('https://controlefinanceiro.com/terms')}
        >
          <Text style={[styles.linkText, { color: theme.primary }]}>
            Termos de Uso
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.linkButton, { borderColor: theme.border }]}
          onPress={() => openLink('https://github.com/louiseneves/controle-financeiro')}
        >
          <Text style={[styles.linkText, { color: theme.primary }]}>
            Código Fonte (GitHub)
          </Text>
        </TouchableOpacity>
      </View>

      {/* Rodapé */}
      <View style={styles.footer}>
        <Text style={[styles.footerText, { color: theme.textSecondary }]}>
          Feito com React Native 🚀
        </Text>
        <Text style={[styles.footerText, { color: theme.textSecondary }]}>
          Build 2024.01.001
        </Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 20,
    paddingTop: 40,
    alignItems: 'center',
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
  logoSection: {
    alignItems: 'center',
    paddingVertical: 30,
    marginTop: 15,
  },
  logoIcon: {
    fontSize: 80,
    marginBottom: 15,
  },
  appName: {
    fontSize: 24,
    fontWeight: 'bold',
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
    fontWeight: 'bold',
    marginBottom: 15,
  },
  description: {
    fontSize: 15,
    lineHeight: 24,
  },
  featuresList: {
    gap: 8,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
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
    fontWeight: '500',
  },
  libraryVersion: {
    fontSize: 13,
  },
  developer: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 5,
  },
  linkButton: {
    paddingVertical: 15,
    borderBottomWidth: 1,
  },
  linkText: {
    fontSize: 15,
    fontWeight: '500',
  },
  footer: {
    alignItems: 'center',
    paddingVertical: 30,
    gap: 5,
  },
  footerText: {
    fontSize: 12,
  },
});

export default AboutScreen;