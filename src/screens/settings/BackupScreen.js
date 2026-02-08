import React, { useEffect, useState, useMemo } from 'react';
import { useTheme } from '../../context/ThemeContext';
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
} from 'react-native';
import { backupStore } from '../../store/backupStore';
import usePremiumStore from '../../store/premiumStore'; // ← CORRIGIDO

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
    importBackupJSON,
  } = backupStore();

  const { isPremium } = usePremiumStore();
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    loadSettings();
    loadBackups();
  }, []);

  const handleCreateBackup = async () => {
    setCreating(true);
    try {
      await createBackup(false, isPremium);
      Alert.alert('Sucesso', 'Backup criado com sucesso!');
    } catch (error) {
      Alert.alert('Erro', 'Falha ao criar backup: ' + error.message);
    } finally {
      setCreating(false);
    }
  };

  const handleRestoreBackup = (backupId) => {
    Alert.alert(
      'Confirmar Restauração',
      'Isso irá substituir todos os seus dados atuais. Deseja continuar?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Restaurar',
          style: 'destructive',
          onPress: async () => {
            try {
              await restoreBackup(backupId);
              Alert.alert('Sucesso', 'Dados restaurados com sucesso!', [
                {
                  text: 'OK',
                  onPress: () => navigation.goBack(),
                },
              ]);
            } catch (error) {
              Alert.alert('Erro', 'Falha ao restaurar backup: ' + error.message);
            }
          },
        },
      ]
    );
  };

  const handleDeleteBackup = (backupId) => {
    Alert.alert(
      'Confirmar Exclusão',
      'Tem certeza que deseja excluir este backup?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteBackup(backupId);
              Alert.alert('Sucesso', 'Backup excluído com sucesso!');
            } catch (error) {
              Alert.alert('Erro', 'Falha ao excluir backup: ' + error.message);
            }
          },
        },
      ]
    );
  };

  const handleExportJSON = async () => {
    if (!isPremium) {
      Alert.alert(
        'Recurso Premium',
        'A exportação de dados está disponível apenas para usuários Premium.',
        [
          { text: 'Cancelar', style: 'cancel' },
          {
            text: 'Upgrade',
            onPress: () => navigation.navigate('Premium'),
          },
        ]
      );
      return;
    }

    try {
      const jsonData = await exportBackupJSON();
      await Share.share({
        message: jsonData,
        title: 'Backup - Controle Financeiro',
      });
    } catch (error) {
      Alert.alert('Erro', 'Falha ao exportar dados: ' + error.message);
    }
  };

  const formatDate = (dateString) => {
  if (!dateString) return 'Data indisponível';

  const date = new Date(dateString);
  if (isNaN(date.getTime())) return 'Data inválida';

  return date.toLocaleString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};


  const getBackupSize = (backup) => {
    const count =
      (backup.data.transactions?.length || 0) +
      (backup.data.goals?.length || 0) +
      (backup.data.budgets?.length || 0);
    return `${count} itens`;
  };

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Backup e Restauração</Text>
        <Text style={styles.headerSubtitle}>
          Mantenha seus dados seguros
        </Text>
      </View>

      {/* Backup Automático */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Backup Automático</Text>
          <Switch
            value={autoBackupEnabled}
            onValueChange={toggleAutoBackup}
            trackColor={{ false: '#ccc', true: '#4CAF50' }}
            thumbColor="#fff"
          />
        </View>
        <Text style={styles.sectionDescription}>
          Cria backup na nuvem automaticamente quando você adiciona ou edita dados
        </Text>
        {lastBackup && (
          <Text style={styles.lastBackup}>
            Último backup: {formatDate(lastBackup)}
          </Text>
        )}
      </View>

      {/* Ações Rápidas */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Ações Rápidas</Text>
        
        <TouchableOpacity
          onPress={handleCreateBackup}
  disabled={creating || loading}
  style={[styles.actionButton, styles.primaryButton, (creating || loading) && { opacity: 0.6 }]}
>
          {creating ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <>
              <Text style={styles.actionButtonIcon}>☁️</Text>
              <View style={styles.actionButtonText}>
                <Text style={styles.actionButtonTitle}>Criar Backup Agora</Text>
                <Text style={styles.actionButtonSubtitle}>
                  Salvar na nuvem
                </Text>
              </View>
            </>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionButton, styles.secondaryButton]}
          onPress={handleExportJSON}
        >
          <Text style={styles.actionButtonIcon}>📥</Text>
          <View style={styles.actionButtonText}>
            <Text style={styles.actionButtonTitle}>Exportar Dados</Text>
            <Text style={styles.actionButtonSubtitle}>
              {isPremium ? 'Baixar arquivo JSON' : 'Premium apenas'}
            </Text>
          </View>
          {!isPremium && <Text style={styles.premiumBadge}>Premium</Text>}
        </TouchableOpacity>
      </View>

      {/* Lista de Backups */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Backups Salvos</Text>
        
        {loading ? (
          <ActivityIndicator size="large" color="#2196F3" style={styles.loader} />
        ) : backups.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateIcon}>📦</Text>
            <Text style={styles.emptyStateText}>Nenhum backup disponível</Text>
            <Text style={styles.emptyStateSubtext}>
              Crie seu primeiro backup para proteger seus dados
            </Text>
          </View>
        ) : (
          backups.map((backup) => (
            <View key={backup.id} style={styles.backupCard}>
              <View style={styles.backupHeader}>
                <View style={styles.backupInfo}>
                  <Text style={styles.backupDate}>
                    {formatDate(backup.timestamp)}
                  </Text>
                  <Text style={styles.backupSize}>
                    {getBackupSize(backup)}
                  </Text>
                </View>
                {backup.isAutomatic && (
                  <View style={styles.autoTag}>
                    <Text style={styles.autoTagText}>Auto</Text>
                  </View>
                )}
              </View>

              <View style={styles.backupActions}>
                <TouchableOpacity
                  style={[styles.backupButton, styles.restoreButton]}
                  onPress={() => handleRestoreBackup(backup.id)}
                >
                  <Text style={styles.backupButtonText}>🔄 Restaurar</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.backupButton, styles.deleteButton]}
                  onPress={() => handleDeleteBackup(backup.id)}
                >
                  <Text style={styles.backupButtonText}>🗑️ Excluir</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))
        )}
      </View>

      {/* Informações */}
      <View style={styles.infoSection}>
        <Text style={styles.infoTitle}>ℹ️ Sobre Backups</Text>
        <Text style={styles.infoText}>
          • Backups são salvos na nuvem {'\n'}
          • Incluem transações, metas e orçamentos{'\n'}
          • Usuários gratuitos: até 3 backups{'\n'}
          • Premium: backups ilimitados{'\n'}
          • Restauração substitui dados atuais
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
    color: '#fff',
    marginBottom: 5,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#fff',
    opacity: 0.9,
  },
  section: {
    backgroundColor: colors.card,
    padding: 20,
    marginTop: 15,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
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
    lineHeight: 20,
  },
  lastBackup: {
    fontSize: 12,
    color: colors.success,
    marginTop: 10,
    fontWeight: '500',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  primaryButton: {
    backgroundColor: colors.success,
  },
  secondaryButton: {
    backgroundColor: colors.primary,
  },
  actionButtonIcon: {
    fontSize: 30,
    marginRight: 15,
  },
  actionButtonText: {
    flex: 1,
  },
  actionButtonTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 2,
  },
  actionButtonSubtitle: {
    fontSize: 12,
    color: '#fff',
    opacity: 0.8,
  },
  premiumBadge: {
    backgroundColor: 'rgba(255,255,255,0.3)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
    fontSize: 11,
    fontWeight: 'bold',
    color: '#fff',
  },
  loader: {
    marginVertical: 30,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyStateIcon: {
    fontSize: 60,
    marginBottom: 15,
  },
  emptyStateText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textSecondary,
    marginBottom: 5,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: colors.textTertiary,
    textAlign: 'center',
  },
  backupCard: {
    backgroundColor: colors.background,
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: colors.border,
  },
  backupHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  backupInfo: {
    flex: 1,
  },
  backupDate: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  backupSize: {
    fontSize: 13,
    color: colors.textSecondary,
  },
  autoTag: {
    backgroundColor: colors.success,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  autoTagText: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#fff',
  },
  backupActions: {
    flexDirection: 'row',
    gap: 10,
  },
  backupButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  restoreButton: {
    backgroundColor: colors.primary,
  },
  deleteButton: {
    backgroundColor: colors.error,
  },
  backupButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
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

export default BackupScreen;