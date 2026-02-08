// src/components/common/BackupStatusCard.js
import React, {useMemo} from 'react';
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
import { useTheme } from '../../context/ThemeContext';

const BackupStatusCard = () => {
  const { colors } = useTheme();
    const styles = useMemo(() => createStyles(colors), [colors]);
  const navigation = useNavigation();

const {
  lastBackup,
  loading,
  error,
} = useBackupStore(state => ({
  lastBackup: state.lastBackup,
  loading: state.loading,
  error: state.error,
}));


  const getTimeSinceBackup = () => {
  if (!lastBackup) return null;

  const backupDate = new Date(lastBackup);
  if (isNaN(backupDate.getTime())) return 'Data inválida';

  const now = new Date();
  const diffMs = now - backupDate;
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffHours / 24);

  if (diffDays > 0) {
    return `${diffDays} dia${diffDays > 1 ? 's' : ''} atrás`;
  }

  if (diffHours > 0) {
    return `${diffHours} hora${diffHours > 1 ? 's' : ''} atrás`;
  }

  return 'Agora mesmo';
};


  const getBackupStatus = () => {
    if (error) {
      return {
        icon: 'alert-circle',
        color: colors.error,
        text: 'Erro no backup',
        subtitle: error,
      };
    }

    if (!lastBackup) {
  return {
    icon: 'cloud-alert',
    color: colors.warning,
    text: 'Nenhum backup',
    subtitle: 'Toque para criar o primeiro backup',
  };
}

const backupDate = new Date(lastBackup);
const diffHours = (new Date() - backupDate) / (1000 * 60 * 60);


    if (diffHours > 168) {
      return {
        icon: 'alert',
        color: colors.error,
        text: 'Backup desatualizado',
        subtitle: getTimeSinceBackup(),
      };
    }

    if (diffHours > 48) {
      return {
        icon: 'clock-alert',
        color: colors.warning,
        text: 'Backup antigo',
        subtitle: getTimeSinceBackup(),
      };
    }

    return {
      icon: 'shield-check',
      color: colors.success,
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

const createStyles = (colors) =>
  StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    marginHorizontal: 20,
    marginVertical: 10,
    padding: 15,
    borderRadius: 12,
    elevation: 2,
    shadowColor: colors.text,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  iconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: colors.background,
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
    color: colors.text,
  },
  subtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 2,
  },
});

export default BackupStatusCard;

