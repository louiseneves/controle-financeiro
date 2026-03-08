import React, { useEffect,useMemo } from 'react';
import { useTheme } from '../../context/ThemeContext';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Linking,
  Alert,
} from 'react-native';
import useSupportStore from '../../store/supportStore';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import {t} from '../../i18n';

const SupportScreen = ({ navigation }) => {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const { tickets, loadTickets } = useSupportStore();

  useEffect(() => {
    loadTickets();
  }, [loadTickets]);

  const openTickets = tickets.filter(t => t.status === 'open' || t.status === 'in_progress');
  const closedTickets = tickets.filter(t => t.status === 'resolved' || t.status === 'closed');

  const handleOpenLink = (url, name) => {
    Linking.canOpenURL(url).then(supported => {
      if (supported) {
        Linking.openURL(url);
      } else {
        Alert.alert(t('supportScreen.contact.errorTitle'), t('supportScreen.contact.errorOpenLink', { name }));
      }
    });
  };

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>{t('supportScreen.header.title')}</Text>
        <Text style={styles.headerSubtitle}>
          {t('supportScreen.header.subtitle')}
        </Text>
      </View>

      {/* Opções de Ajuda */}
      <View style={styles.section}>
        <TouchableOpacity
          style={[styles.optionCard, styles.primaryCard]}
          onPress={() => navigation.navigate('FAQ')}
        >
          <Text style={styles.optionIcon}>❓</Text>
          <View style={styles.optionContent}>
            <Text style={styles.optionTitle}>{t('supportScreen.options.faq.title')}</Text>
            <Text style={styles.optionSubtitle}>
              {t('supportScreen.options.faq.subtitle')}
            </Text>
          </View>
          <Text style={styles.optionArrow}>›</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.optionCard, styles.secondaryCard]}
          onPress={() => navigation.navigate('CreateTicket')}
        >
          <Text style={styles.optionIcon}>✉️</Text>
          <View style={styles.optionContent}>
            <Text style={styles.optionTitle}>{t('supportScreen.options.ticket.title')}</Text>
            <Text style={styles.optionSubtitle}>
              {t('supportScreen.options.ticket.subtitle')}
            </Text>
          </View>
          <Text style={styles.optionArrow}>›</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.optionCard, styles.tertiaryCard]}
          onPress={() => navigation.navigate('Tutorials')}
        >
          <Text style={styles.optionIcon}>📚</Text>
          <View style={styles.optionContent}>
            <Text style={styles.optionTitle}>{t('supportScreen.options.tutorials.title')}</Text>
            <Text style={styles.optionSubtitle}>
              {t('supportScreen.options.tutorials.subtitle')}
            </Text>
          </View>
          <Text style={styles.optionArrow}>›</Text>
        </TouchableOpacity>
      </View>

      {/* Meus Tickets */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>{t('supportScreen.myTickets.title')}</Text>
          {openTickets.length > 0 && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{openTickets.length}</Text>
            </View>
          )}
        </View>

        {tickets.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyIcon}>📭</Text>
            <Text style={styles.emptyText}>{t('supportScreen.myTickets.emptyTitle')}</Text>
            <Text style={styles.emptySubtext}>
              {t('supportScreen.myTickets.emptySubtitle')}
            </Text>
          </View>
        ) : (
          <>
            {/* Tickets Abertos */}
            {openTickets.length > 0 && (
              <>
                <Text style={styles.subsectionTitle}>{t('supportScreen.myTickets.open')}</Text>
                {openTickets.slice(0, 3).map(ticket => (
                  <TouchableOpacity
                    key={ticket.id}
                    style={styles.ticketCard}
                    onPress={() => navigation.navigate('TicketDetails', { ticketId: ticket.id })}
                  >
                    <View style={styles.ticketHeader}>
                      <Text style={styles.ticketSubject} numberOfLines={1}>
                        {ticket.subject}
                      </Text>
                      <View style={[styles.statusBadge, styles[`status${ticket.status}`]]}>
                        <Text style={styles.statusText}>
                          {t(`supportScreen.ticketStatus.${ticket.status}`)}
                        </Text>
                      </View>
                    </View>
                    <Text style={styles.ticketCategory}>📁 {ticket.category}</Text>
                    <Text style={styles.ticketDate}>
                      {new Date(ticket.createdAt).toLocaleDateString('pt-BR')}
                    </Text>
                  </TouchableOpacity>
                ))}
                {openTickets.length > 3 && (
                  <TouchableOpacity
                    style={styles.viewAllButton}
                    onPress={() => navigation.navigate('TicketList', { filter: 'open' })}
                  >
                    <Text style={styles.viewAllText}>
                      {t('supportScreen.myTickets.viewAll')} ({openTickets.length})
                    </Text>
                  </TouchableOpacity>
                )}
              </>
            )}

            {/* Tickets Fechados (últimos 2) */}
            {closedTickets.length > 0 && (
              <>
                <Text style={[styles.subsectionTitle, { marginTop: 20 }]}>
                  {t('supportScreen.myTickets.recentlyResolved')}
                </Text>
                {closedTickets.slice(0, 2).map(ticket => (
                  <TouchableOpacity
                    key={ticket.id}
                    style={[styles.ticketCard, styles.closedTicket]}
                    onPress={() => navigation.navigate('TicketDetails', { ticketId: ticket.id })}
                  >
                    <View style={styles.ticketHeader}>
                      <Text style={styles.ticketSubject} numberOfLines={1}>
                        {ticket.subject}
                      </Text>
                      <View style={[styles.statusBadge, styles.statusresolved]}>
                        <Text style={styles.statusText}>{t('supportScreen.ticketStatus.resolved')}</Text>
                      </View>
                    </View>
                    <Text style={styles.ticketCategory}>📁 {ticket.category}</Text>
                    <Text style={styles.ticketDate}>
                      {new Date(ticket.createdAt).toLocaleDateString('pt-BR')}
                    </Text>
                  </TouchableOpacity>
                ))}
              </>
            )}
          </>
        )}
      </View>

      {/* Contato Rápido */}
      <View style={styles.contactSection}>
        <Text style={styles.contactTitle}>{t('supportScreen.contact.title')}</Text>
        <Text style={styles.contactText}>
          {t('supportScreen.contact.description')}
        </Text>
        <View style={styles.contactButtons}>
          <TouchableOpacity
            style={styles.contactButton}
            onPress={() => handleOpenLink('https://wa.me/5511999999999', 'WhatsApp')}
          >
            <MaterialCommunityIcons name="whatsapp" size={16} color={colors.onPrimary} />
            <Text style={styles.contactButtonText}> {t('supportScreen.contact.whatsapp')}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.contactButton}
            onPress={() => handleOpenLink('mailto:suporte@controlefinanceiro.com', 'Email')}
          >
            <MaterialIcons name="email" size={16} color={colors.onPrimary} />
            <Text style={styles.contactButtonText}> {t('supportScreen.contact.email')}</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Informações Adicionais */}
      <View style={styles.infoSection}>
        <Text style={styles.infoTitle}>{t('supportScreen.info.title')}</Text>
        <Text style={styles.infoText}>
          {t('supportScreen.info.text')}
        </Text>
      </View>
    </ScrollView>
  );
};

const createStyles = (colors) =>
  StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    backgroundColor: colors.primary,
    padding: 20,
    paddingTop: 40,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.onPrimary,
    marginBottom: 5,
  },
  headerSubtitle: {
    fontSize: 14,
    color: colors.onPrimary,
    opacity: 0.9,
  },
  section: {
    backgroundColor: colors.card,
    padding: 20,
    marginTop: 15,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 10,
  },
  sectionDescription: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 15,
    lineHeight: 20,
  },
  badge: {
    backgroundColor: colors.error,
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 2,
    marginLeft: 10,
  },
  badgeText: {
    color: colors.onPrimary,
    fontSize: 12,
    fontWeight: 'bold',
  },
  subsectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textSecondary,
    marginBottom: 10,
    textTransform: 'uppercase',
  },
  optionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderRadius: 10,
    marginBottom: 12,
  },
  primaryCard: {
    backgroundColor: colors.supportCards.primary,
    borderWidth: 1,
    borderColor: colors.primary,
  },
  secondaryCard: {
    backgroundColor: colors.supportCards.secondary,
    borderWidth: 1,
    borderColor: colors.secondary,
  },
  tertiaryCard: {
    backgroundColor: colors.supportCards.tertiary,
    borderWidth: 1,
    borderColor: colors.warning,
  },
  optionIcon: {
    fontSize: 32,
    marginRight: 15,
  },
  optionContent: {
    flex: 1,
  },
  optionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 3,
  },
  optionSubtitle: {
    fontSize: 13,
    color: colors.textSecondary,
  },
  optionArrow: {
    fontSize: 24,
    color: colors.textTertiary,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyIcon: {
    fontSize: 60,
    marginBottom: 15,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textSecondary,
    marginBottom: 5,
  },
  emptySubtext: {
    fontSize: 14,
    color: colors.textTertiary,
  },
  ticketCard: {
    backgroundColor: colors.background,
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: colors.border,
  },
  closedTicket: {
    opacity: 0.7,
  },
  ticketHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  ticketSubject: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.text,
    flex: 1,
    marginRight: 10,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusopen: {
    backgroundColor: colors.success,
  },
  statusin_progress: {
    backgroundColor: colors.warning,
  },
  statusresolved: {
    backgroundColor: '#9E9E9E',
  },
  statusclosed: {
    backgroundColor: '#9E9E9E',
  },
  statusText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: 'bold',
  },
  ticketCategory: {
    fontSize: 13,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  ticketDate: {
    fontSize: 12,
    color: colors.textTertiary,
  },
  viewAllButton: {
    alignItems: 'center',
    paddingVertical: 10,
    marginTop: 5,
  },
  viewAllText: {
    color: colors.primary,
    fontSize: 14,
    fontWeight: '600',
  },
  socialGrid: {
    gap: 12,
  },
  socialCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background,
    padding: 15,
    borderRadius: 10,
    borderLeftWidth: 4,
  },
  socialIcon: {
    fontSize: 28,
    marginRight: 15,
  },
  socialInfo: {
    flex: 1,
  },
  socialName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 3,
  },
  socialDescription: {
    fontSize: 13,
    color: colors.textSecondary,
  },
  contactSection: {
    backgroundColor: '#E8F5E9',
    padding: 20,
    margin: 15,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.success,
  },
  contactTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2E7D32',
    marginBottom: 10,
  },
  contactText: {
    fontSize: 14,
    color: '#388E3C',
    lineHeight: 20,
    marginBottom: 15,
  },
  contactButtons: {
    flexDirection: 'row',
    gap: 10,
  },
  contactButton: {
  flex: 1,
  flexDirection: 'row',
  gap: 8,
  backgroundColor: colors.success,
  paddingVertical: 12,
  borderRadius: 8,
  alignItems: 'center',
  justifyContent: 'center',
},

  contactButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  infoSection: {
    backgroundColor: '#FFF3E0',
    padding: 20,
    margin: 15,
    marginBottom: 30,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#FFE0B2',
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#E65100',
    marginBottom: 10,
  },
  infoText: {
    fontSize: 14,
    color: '#BF360C',
    lineHeight: 22,
  },
});

export default SupportScreen;