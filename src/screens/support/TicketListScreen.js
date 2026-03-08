import React, { useEffect, useState,useMemo } from 'react';
import { useTheme } from '../../context/ThemeContext';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import useSupportStore from '../../store/supportStore';
import { t } from '../../i18n';

const TicketListScreen = ({ route, navigation }) => {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const { filter = 'all' } = route.params || {};
  const { tickets, loadTickets, loading } = useSupportStore();
  const [selectedFilter, setSelectedFilter] = useState(filter);

  useEffect(() => {
    loadTickets();
  }, [loadTickets]);

  const filters = [
    { value: 'all', label: 'Todos', icon: '📋' },
    { value: 'open', label: 'Abertos', icon: '🟢' },
    { value: 'in_progress', label: 'Em Andamento', icon: '🟡' },
    { value: 'resolved', label: 'Resolvidos', icon: '🔵' },
    { value: 'closed', label: 'Fechados', icon: '⚪' },
  ];

  const filteredTickets = tickets.filter(ticket => {
    if (selectedFilter === 'all') return true;
    if (selectedFilter === 'open') return ticket.status === 'open' || ticket.status === 'in_progress';
    return ticket.status === selectedFilter;
  });

  const getStatusInfo = (status) => {
    const statusMap = {
      open: { label: t('ticketListScreen.status.open'), color: colors.success },
      in_progress: { label: t('ticketListScreen.status.in_progress'), color: colors.warning },
      resolved: { label: t('ticketListScreen.status.resolved'), color: colors.primary },
      closed: { label: t('ticketListScreen.status.closed'), color: '#9E9E9E' },
    };
    return statusMap[status] || statusMap.open;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return t('ticketListScreen.date.today');
    if (diffDays === 1) return t('ticketListScreen.date.yesterday');
    if (diffDays < 7) return t('ticketListScreen.date.daysAgo', { count: diffDays });
    
    return date.toLocaleDateString('pt-BR');
  };

  const renderTicket = ({ item }) => {
    const statusInfo = getStatusInfo(item.status);
    const lastMessage = item.messages && item.messages.length > 0 ? item.messages[item.messages.length - 1] : null;
    const unreadCount = item.messages ? item.messages.filter(m => !m.read && m.sender === 'support').length : 0;

    return (
      <TouchableOpacity
        style={styles.ticketCard}
        onPress={() => navigation.navigate('TicketDetails', { ticketId: item.id })}
        activeOpacity={0.7}
      >
        <View style={styles.ticketHeader}>
          <View style={styles.ticketHeaderLeft}>
            <View style={[styles.statusDot, { backgroundColor: statusInfo.color }]} />
            <View style={styles.ticketInfo}>
              <Text style={styles.ticketSubject} numberOfLines={1}>
                {item.subject}
              </Text>
              <Text style={styles.ticketCategory}>📁 {item.category}</Text>
            </View>
          </View>
          {unreadCount > 0 && item.status !== 'closed' && (
            <View style={styles.unreadBadge}>
              <Text style={styles.unreadText}>{unreadCount}</Text>
            </View>
          )}
        </View>

        <Text style={styles.lastMessage} numberOfLines={2}>
          {lastMessage?.text || t('ticketListScreen.noMessages')}
        </Text>

        <View style={styles.ticketFooter}>
          <View style={[styles.statusBadge, { backgroundColor: statusInfo.color }]}>
            <Text style={styles.statusText}>{statusInfo.label}</Text>
          </View>
          <Text style={styles.ticketDate}>{formatDate(item.updatedAt)}</Text>
        </View>

        {item.rating && (
          <View style={styles.ratingBadge}>
            <Text style={styles.ratingText}>
              {Array(item.rating).fill('⭐').join('')}
            </Text>
          </View>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>{t('ticketListScreen.header.title')}</Text>
        <Text style={styles.headerSubtitle}>
         {t('ticketListScreen.header.subtitle', { count: filteredTickets.length })}
        </Text>
      </View>

      {/* Filtros */}
      <View style={styles.filtersContainer}>
        {filters.map(filter => (
          <TouchableOpacity
            key={filter.value}
            style={[
              styles.filterChip,
              selectedFilter === filter.value && styles.filterChipActive
            ]}
            onPress={() => setSelectedFilter(filter.value)}
          >
            <Text style={styles.filterIcon}>{filter.icon}</Text>
            <Text style={[
              styles.filterText,
              selectedFilter === filter.value && styles.filterTextActive
            ]}>
              {t(`ticketListScreen.filters.${filter.value}`)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Lista de Tickets */}
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#2196F3" />
          <Text style={styles.loadingText}>{t('ticketListScreen.loading.text')}</Text>
        </View>
      ) : filteredTickets.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyIcon}>📭</Text>
          <Text style={styles.emptyText}>{t('ticketListScreen.empty.title')}</Text>
          <Text style={styles.emptySubtext}>
            {selectedFilter === 'all' 
              ? t('ticketListScreen.empty.allSubtitle')
              : t('ticketListScreen.empty.filteredSubtitle', { filter: filters.find(f => f.value === selectedFilter)?.label.toLowerCase() })
            }
          </Text>
          {selectedFilter === 'all' && (
            <TouchableOpacity
              style={styles.createButton}
              onPress={() => navigation.navigate('CreateTicket')}
            >
              <Text style={styles.createButtonText}>{t('ticketListScreen.actions.create')}</Text>
            </TouchableOpacity>
          )}
        </View>
      ) : (
        <FlatList
          data={filteredTickets}
          renderItem={renderTicket}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
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
    color: '#fff',
    marginBottom: 5,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#fff',
    opacity: 0.9,
  },
  filtersContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 15,
    backgroundColor: colors.card,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    gap: 8,
  },
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 5,
  },
  filterChipActive: {
    backgroundColor: colors.primary,
  },
  filterIcon: {
    fontSize: 14,
  },
  filterText: {
    fontSize: 13,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  filterTextActive: {
    color: '#fff',
  },
  listContent: {
    padding: 15,
    paddingBottom: 30,
  },
  ticketCard: {
    backgroundColor: colors.card,
    borderRadius: 10,
    padding: 15,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  ticketHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  ticketHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    flex: 1,
  },
  statusDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginTop: 5,
    marginRight: 10,
  },
  ticketInfo: {
    flex: 1,
  },
  ticketSubject: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  ticketCategory: {
    fontSize: 13,
    color: colors.textSecondary,
  },
  unreadBadge: {
    backgroundColor: colors.error,
    borderRadius: 12,
    minWidth: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 6,
  },
  unreadText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  lastMessage: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
    marginBottom: 10,
  },
  ticketFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: 'bold',
  },
  ticketDate: {
    fontSize: 12,
    color: colors.textTertiary,
  },
  ratingBadge: {
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  ratingText: {
    fontSize: 14,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  loadingText: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 15,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
    paddingHorizontal: 40,
  },
  emptyIcon: {
    fontSize: 80,
    marginBottom: 20,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.textSecondary,
    marginBottom: 8,
    textAlign: 'center',
  },
  emptySubtext: {
    fontSize: 14,
    color: colors.textTertiary,
    textAlign: 'center',
    marginBottom: 20,
  },
  createButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 20,
  },
  createButtonText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '600',
  },
});

export default TicketListScreen;