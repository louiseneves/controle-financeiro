import React, { useEffect } from 'react';
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

const SupportScreen = ({ navigation }) => {
  const { tickets, loadTickets } = useSupportStore();

  useEffect(() => {
    loadTickets();
  }, []);

  const openTickets = tickets.filter(t => t.status === 'open' || t.status === 'in_progress');
  const closedTickets = tickets.filter(t => t.status === 'resolved' || t.status === 'closed');

  const handleOpenLink = (url, name) => {
    Linking.canOpenURL(url).then(supported => {
      if (supported) {
        Linking.openURL(url);
      } else {
        Alert.alert('Erro', `Não foi possível abrir ${name}`);
      }
    });
  };

  const socialLinks = [
    {
      name: 'WhatsApp',
      icon: '💬',
      color: '#25D366',
      url: 'https://wa.me/5511999999999',
      description: 'Suporte rápido',
    },
    {
      name: 'Instagram',
      icon: '📷',
      color: '#E4405F',
      url: 'https://instagram.com/controlefinanceiro',
      description: 'Dicas e novidades',
    },
    {
      name: 'YouTube',
      icon: '▶️',
      color: '#FF0000',
      url: 'https://youtube.com/@controlefinanceiro',
      description: 'Tutoriais em vídeo',
    },
    {
      name: 'Email',
      icon: '📧',
      color: '#0088CC',
      url: 'mailto:suporte@controlefinanceiro.com',
      description: 'suporte@controlefinanceiro.com',
    },
  ];

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Central de Suporte</Text>
        <Text style={styles.headerSubtitle}>
          Como podemos ajudar você?
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
            <Text style={styles.optionTitle}>Central de Ajuda (FAQ)</Text>
            <Text style={styles.optionSubtitle}>
              Respostas rápidas para perguntas comuns
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
            <Text style={styles.optionTitle}>Enviar Ticket</Text>
            <Text style={styles.optionSubtitle}>
              Fale diretamente com nossa equipe
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
            <Text style={styles.optionTitle}>Tutoriais</Text>
            <Text style={styles.optionSubtitle}>
              Aprenda a usar todas as funcionalidades
            </Text>
          </View>
          <Text style={styles.optionArrow}>›</Text>
        </TouchableOpacity>
      </View>

      {/* Meus Tickets */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Meus Tickets</Text>
          {openTickets.length > 0 && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{openTickets.length}</Text>
            </View>
          )}
        </View>

        {tickets.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyIcon}>📭</Text>
            <Text style={styles.emptyText}>Nenhum ticket aberto</Text>
            <Text style={styles.emptySubtext}>
              Envie um ticket se precisar de ajuda
            </Text>
          </View>
        ) : (
          <>
            {/* Tickets Abertos */}
            {openTickets.length > 0 && (
              <>
                <Text style={styles.subsectionTitle}>Abertos</Text>
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
                          {ticket.status === 'open' ? 'Aberto' : 'Em Andamento'}
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
                      Ver todos ({openTickets.length})
                    </Text>
                  </TouchableOpacity>
                )}
              </>
            )}

            {/* Tickets Fechados (últimos 2) */}
            {closedTickets.length > 0 && (
              <>
                <Text style={[styles.subsectionTitle, { marginTop: 20 }]}>
                  Resolvidos Recentemente
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
                        <Text style={styles.statusText}>Resolvido</Text>
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

      {/* Redes Sociais */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Siga-nos nas Redes Sociais</Text>
        <Text style={styles.sectionDescription}>
          Fique por dentro de novidades, dicas e atualizações
        </Text>

        <View style={styles.socialGrid}>
          {socialLinks.map((social, index) => (
            <TouchableOpacity
              key={index}
              style={[styles.socialCard, { borderLeftColor: social.color }]}
              onPress={() => handleOpenLink(social.url, social.name)}
              activeOpacity={0.7}
            >
              <Text style={styles.socialIcon}>{social.icon}</Text>
              <View style={styles.socialInfo}>
                <Text style={styles.socialName}>{social.name}</Text>
                <Text style={styles.socialDescription}>{social.description}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Contato Rápido */}
      <View style={styles.contactSection}>
        <Text style={styles.contactTitle}>📞 Precisa de ajuda imediata?</Text>
        <Text style={styles.contactText}>
          Nossa equipe está disponível de segunda a sexta, das 9h às 18h.
        </Text>
        <View style={styles.contactButtons}>
          <TouchableOpacity
            style={styles.contactButton}
            onPress={() => handleOpenLink('https://wa.me/5511999999999', 'WhatsApp')}
          >
            <Text style={styles.contactButtonText}>💬 WhatsApp</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.contactButton}
            onPress={() => handleOpenLink('mailto:suporte@controlefinanceiro.com', 'Email')}
          >
            <Text style={styles.contactButtonText}>📧 Email</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Informações Adicionais */}
      <View style={styles.infoSection}>
        <Text style={styles.infoTitle}>ℹ️ Informações</Text>
        <Text style={styles.infoText}>
          • Tempo médio de resposta: 24 horas{'\n'}
          • Suporte disponível em português{'\n'}
          • Todas as conversas são confidenciais{'\n'}
          • Usuários Premium têm atendimento prioritário
        </Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#2196F3',
    padding: 20,
    paddingTop: 40,
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
  section: {
    backgroundColor: '#fff',
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
    color: '#333',
    marginBottom: 10,
  },
  sectionDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 15,
    lineHeight: 20,
  },
  badge: {
    backgroundColor: '#f44336',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 2,
    marginLeft: 10,
  },
  badgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  subsectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
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
    backgroundColor: '#E3F2FD',
    borderWidth: 1,
    borderColor: '#2196F3',
  },
  secondaryCard: {
    backgroundColor: '#F3E5F5',
    borderWidth: 1,
    borderColor: '#9C27B0',
  },
  tertiaryCard: {
    backgroundColor: '#FFF3E0',
    borderWidth: 1,
    borderColor: '#FF9800',
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
    color: '#333',
    marginBottom: 3,
  },
  optionSubtitle: {
    fontSize: 13,
    color: '#666',
  },
  optionArrow: {
    fontSize: 24,
    color: '#999',
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
    color: '#666',
    marginBottom: 5,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#999',
  },
  ticketCard: {
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#e0e0e0',
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
    color: '#333',
    flex: 1,
    marginRight: 10,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusopen: {
    backgroundColor: '#4CAF50',
  },
  statusin_progress: {
    backgroundColor: '#FF9800',
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
    color: '#666',
    marginBottom: 4,
  },
  ticketDate: {
    fontSize: 12,
    color: '#999',
  },
  viewAllButton: {
    alignItems: 'center',
    paddingVertical: 10,
    marginTop: 5,
  },
  viewAllText: {
    color: '#2196F3',
    fontSize: 14,
    fontWeight: '600',
  },
  socialGrid: {
    gap: 12,
  },
  socialCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f9f9f9',
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
    color: '#333',
    marginBottom: 3,
  },
  socialDescription: {
    fontSize: 13,
    color: '#666',
  },
  contactSection: {
    backgroundColor: '#E8F5E9',
    padding: 20,
    margin: 15,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#4CAF50',
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
    backgroundColor: '#4CAF50',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  contactButtonText: {
    color: '#fff',
    fontSize: 14,
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