/**
 * Tela de Upgrade Premium
 */

import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import {Button} from '../../components/ui';
import {COLORS, formatCurrency} from '../../utils';
import usePremiumStore from '../../store/premiumStore';

const PremiumScreen = ({navigation}) => {
  const {isPremium, subscriptionType, expirationDate, activatePremium, cancelPremium, loadPremiumStatus} = usePremiumStore();
  const [selectedPlan, setSelectedPlan] = useState('yearly');

  useEffect(() => {
    loadPremiumStatus();
  }, []);

  const plans = [
    {
      id: 'monthly',
      name: 'Mensal',
      price: 9.90,
      period: 'mês',
      savings: null,
    },
    {
      id: 'yearly',
      name: 'Anual',
      price: 89.90,
      period: 'ano',
      savings: '25% de desconto',
      pricePerMonth: 7.49,
    },
  ];

  const features = [
    {icon: '📊', title: 'Relatórios Avançados', description: 'Análises detalhadas e comparativos'},
    {icon: '📈', title: 'Projeções Futuras', description: 'Previsões baseadas em seus dados'},
    {icon: '📄', title: 'Exportar PDF', description: 'Salve seus relatórios em PDF'},
    {icon: '📑', title: 'Exportar Excel', description: 'Exporte dados para planilhas'},
    {icon: '📅', title: 'Relatórios Anuais', description: 'Visão completa do ano'},
    {icon: '🔄', title: 'Comparativo de Períodos', description: 'Compare meses e anos'},
    {icon: '🎯', title: 'Metas Ilimitadas', description: 'Crie quantas metas quiser'},
    {icon: '☁️', title: 'Backup Ilimitado', description: 'Seus dados sempre seguros'},
    {icon: '🚀', title: 'Novos Recursos', description: 'Acesso antecipado a novidades'},
  ];

  const handleSubscribe = async () => {
    Alert.alert(
      'Confirmar Assinatura',
      `Você está prestes a assinar o plano ${plans.find(p => p.id === selectedPlan)?.name} por ${formatCurrency(plans.find(p => p.id === selectedPlan)?.price)}.

      NOTA: Este é um modo de demonstração. Em produção, você será redirecionado para o Google Play para confirmar a compra.`,
      [
        {text: 'Cancelar', style: 'cancel'},
        {
          text: 'Assinar (Demo)',
          onPress: async () => {
            const result = await activatePremium(selectedPlan);
            if (result.success) {
              Alert.alert(
                'Bem-vindo ao Premium! 🎉',
                'Você agora tem acesso a todos os recursos premium!',
                [
                  {
                    text: 'OK',
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
      'Cancelar Assinatura',
      'Tem certeza que deseja cancelar sua assinatura Premium? Você perderá acesso aos recursos premium.',
      [
        {text: 'Não', style: 'cancel'},
        {
          text: 'Sim, Cancelar',
          style: 'destructive',
          onPress: async () => {
            const result = await cancelPremium();
            if (result.success) {
              Alert.alert('Assinatura Cancelada', 'Sua assinatura Premium foi cancelada.');
            }
          },
        },
      ],
    );
  };

  if (isPremium) {
    // Usuário já é Premium
    return (
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        <View style={styles.premiumHeader}>
          <Text style={styles.premiumBadge}>⭐ PREMIUM</Text>
          <Text style={styles.premiumTitle}>Você é Premium!</Text>
          <Text style={styles.premiumSubtitle}>
            Aproveite todos os recursos exclusivos
          </Text>
        </View>

        <View style={styles.statusCard}>
          <View style={styles.statusRow}>
            <Text style={styles.statusLabel}>Plano:</Text>
            <Text style={styles.statusValue}>
              {subscriptionType === 'monthly' ? 'Mensal' : 'Anual'}
            </Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.statusRow}>
            <Text style={styles.statusLabel}>Válido até:</Text>
            <Text style={styles.statusValue}>
              {new Date(expirationDate).toLocaleDateString('pt-BR')}
            </Text>
          </View>
        </View>

        <View style={styles.featuresSection}>
          <Text style={styles.sectionTitle}>Recursos Disponíveis</Text>
          {features.map((feature, index) => (
            <View key={index} style={styles.featureItem}>
              <Text style={styles.featureIcon}>{feature.icon}</Text>
              <View style={styles.featureContent}>
                <Text style={styles.featureTitle}>{feature.title}</Text>
                <Text style={styles.featureDescription}>{feature.description}</Text>
              </View>
              <Text style={styles.featureCheck}>✓</Text>
            </View>
          ))}
        </View>

        <Button
          title="Gerenciar Assinatura"
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
        <Text style={styles.headerBadge}>⭐ PREMIUM</Text>
        <Text style={styles.headerTitle}>Desbloqueie Todo o Potencial</Text>
        <Text style={styles.headerSubtitle}>
          Recursos avançados para quem quer ir além
        </Text>
      </View>

      {/* Planos */}
      <View style={styles.plansSection}>
        <Text style={styles.sectionTitle}>Escolha seu Plano</Text>
        {plans.map(plan => (
          <TouchableOpacity
            key={plan.id}
            style={[
              styles.planCard,
              selectedPlan === plan.id && styles.planCardSelected,
            ]}
            onPress={() => setSelectedPlan(plan.id)}
            activeOpacity={0.7}>
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
                  {formatCurrency(plan.pricePerMonth)}/mês
                </Text>
              )}
            </View>

            {selectedPlan === plan.id && (
              <View style={styles.selectedIndicator}>
                <Text style={styles.selectedText}>✓ Selecionado</Text>
              </View>
            )}
          </TouchableOpacity>
        ))}
      </View>

      {/* Recursos */}
      <View style={styles.featuresSection}>
        <Text style={styles.sectionTitle}>O que você ganha</Text>
        {features.map((feature, index) => (
          <View key={index} style={styles.featureItem}>
            <Text style={styles.featureIcon}>{feature.icon}</Text>
            <View style={styles.featureContent}>
              <Text style={styles.featureTitle}>{feature.title}</Text>
              <Text style={styles.featureDescription}>{feature.description}</Text>
            </View>
          </View>
        ))}
      </View>

      {/* Garantia */}
      <View style={styles.guaranteeBox}>
        <Text style={styles.guaranteeIcon}>🛡️</Text>
        <View style={styles.guaranteeContent}>
          <Text style={styles.guaranteeTitle}>Garantia de 7 dias</Text>
          <Text style={styles.guaranteeText}>
            Não gostou? Devolveremos seu dinheiro, sem perguntas.
          </Text>
        </View>
      </View>

      {/* Botão de Assinatura */}
      <Button
        title={`Assinar por ${formatCurrency(plans.find(p => p.id === selectedPlan)?.price)}`}
        onPress={handleSubscribe}
        style={styles.subscribeButton}
      />

      <Text style={styles.disclaimer}>
        * Modo de demonstração. Em produção, a cobrança será feita via Google Play.
      </Text>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  headerBadge: {
    fontSize: 48,
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 8,
    textAlign: 'center',
  },
  headerSubtitle: {
    fontSize: 16,
    color: COLORS.textLight,
    textAlign: 'center',
  },
  premiumHeader: {
    alignItems: 'center',
    backgroundColor: COLORS.warning,
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
    fontWeight: 'bold',
    color: COLORS.white,
    marginBottom: 8,
  },
  premiumSubtitle: {
    fontSize: 16,
    color: COLORS.white,
    opacity: 0.9,
  },
  statusCard: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 20,
    marginBottom: 24,
    shadowColor: COLORS.black,
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statusRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
  },
  statusLabel: {
    fontSize: 16,
    color: COLORS.textLight,
  },
  statusValue: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.border,
  },
  plansSection: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 16,
  },
  planCard: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 20,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: COLORS.border,
    position: 'relative',
    shadowColor: COLORS.black,
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  planCardSelected: {
    borderColor: COLORS.warning,
    borderWidth: 3,
    backgroundColor: COLORS.warning + '05',
  },
  savingsBadge: {
    position: 'absolute',
    top: -10,
    right: 20,
    backgroundColor: COLORS.success,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  savingsText: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.white,
  },
  planHeader: {
    alignItems: 'center',
  },
  planName: {
    fontSize: 20,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 12,
  },
  planPrice: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 4,
  },
  planPriceValue: {
    fontSize: 36,
    fontWeight: 'bold',
    color: COLORS.warning,
  },
  planPricePeriod: {
    fontSize: 18,
    color: COLORS.textLight,
  },
  planPriceMonth: {
    fontSize: 14,
    color: COLORS.textLight,
  },
  selectedIndicator: {
    marginTop: 12,
    backgroundColor: COLORS.warning,
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: 'center',
  },
  selectedText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.white,
  },
  featuresSection: {
    marginBottom: 24,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: COLORS.white,
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
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 4,
  },
  featureDescription: {
    fontSize: 14,
    color: COLORS.textLight,
  },
  featureCheck: {
    fontSize: 20,
    color: COLORS.success,
  },
  guaranteeBox: {
    flexDirection: 'row',
    backgroundColor: COLORS.success + '10',
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
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 4,
  },
  guaranteeText: {
    fontSize: 14,
    color: COLORS.textLight,
  },
  subscribeButton: {
    marginBottom: 16,
  },
  manageButton: {
    marginTop: 8,
  },
  disclaimer: {
    fontSize: 12,
    color: COLORS.textLight,
    textAlign: 'center',
    fontStyle: 'italic',
  },
});

export default PremiumScreen;