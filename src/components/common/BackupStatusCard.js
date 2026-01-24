// src/components/common/BackupStatusCard.js
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation } from '@react-navigation/native';
import { useBackupStore } from '../../store/backupStore';

const BackupStatusCard = () => {
  const navigation = useNavigation();

  const {
    lastBackupDate,
    loading,
    error,
  } = useBackupStore(state => ({
    lastBackupDate: state.lastBackupDate,
    loading: state.loading,
    error: state.error,
  }));

  const getTimeSinceBackup = () => {
    if (!lastBackupDate) return null;

    const now = new Date();
    const backupDate = new Date(lastBackupDate);
    const diffMs = now - backupDate;
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);

    if (diffDays > 0) {
      return `${diffDays} dia${diffDays > 1 ? 's' : ''} atrás`;
    } else if (diffHours > 0) {
      return `${diffHours} hora${diffHours > 1 ? 's' : ''} atrás`;
    } else {
      return 'Agora mesmo';
    }
  };

  const getBackupStatus = () => {
    if (error) {
      return {
        icon: 'alert-circle',
        color: '#F44336',
        text: 'Erro no backup',
        subtitle: error,
      };
    }

    if (!lastBackupDate) {
      return {
        icon: 'cloud-alert',
        color: '#FF9800',
        text: 'Nenhum backup',
        subtitle: 'Toque para criar o primeiro backup',
      };
    }

    const now = new Date();
    const backupDate = new Date(lastBackupDate);
    const diffHours = (now - backupDate) / (1000 * 60 * 60);

    if (diffHours > 168) {
      return {
        icon: 'alert',
        color: '#F44336',
        text: 'Backup desatualizado',
        subtitle: getTimeSinceBackup(),
      };
    }

    if (diffHours > 48) {
      return {
        icon: 'clock-alert',
        color: '#FF9800',
        text: 'Backup antigo',
        subtitle: getTimeSinceBackup(),
      };
    }

    return {
      icon: 'shield-check',
      color: '#4CAF50',
      text: 'Backup atualizado',
      subtitle: getTimeSinceBackup(),
    };
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator color="#2196F3" />
      </View>
    );
  }

  const status = getBackupStatus();

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => navigation.navigate('Backup')}
      activeOpacity={0.7}
    >
      <View style={styles.iconContainer}>
        <Icon name={status.icon} size={28} color={status.color} />
      </View>

      <View style={styles.content}>
        <Text style={styles.title}>{status.text}</Text>
        <Text style={styles.subtitle}>{status.subtitle}</Text>
      </View>

      <Icon name="chevron-right" size={24} color="#ccc" />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    marginHorizontal: 20,
    marginVertical: 10,
    padding: 15,
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  iconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
});

export default BackupStatusCard;

