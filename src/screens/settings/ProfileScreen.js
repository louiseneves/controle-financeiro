/**
 * Tela de Perfil
 */

import React, {useMemo} from 'react';
import { useTheme } from '../../context/ThemeContext';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import Entypo from '@expo/vector-icons/Entypo';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import {Button} from '../../components/ui';
import {COLORS, getInitials} from '../../utils';
import useAuthStore from '../../store/authStore';

const ProfileScreen = ({navigation}) => {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const {user, logout} = useAuthStore();

  const handleEditProfile = () => {
    navigation.navigate('EditProfile');
  };

  const handleLogout = () => {
    Alert.alert(
      'Sair da Conta',
      'Tem certeza que deseja sair?',
      [
        {text: 'Cancelar', style: 'cancel'},
        {
          text: 'Sair',
          style: 'destructive',
          onPress: async () => {
            const result = await logout();
            if (result.success) {
              console.log('Logout realizado');
            }
          },
        },
      ],
    );
  };

  // Opções do menu
  const menuOptions = [
    {
      id: 'edit',
      title: 'Editar Perfil',
      icon: <Entypo name="edit" size={24} color="black" />,
      onPress: handleEditProfile,
    },
    {
      id: 'goals',
      title: 'Metas Financeiras',
      icon: <MaterialCommunityIcons name="bullseye-arrow" size={24} color="black" />,
      onPress: () => navigation.navigate('Planning', {
        screen: 'Goals',
      }),
    },
    {
      id: 'budget',
      title: 'Orçamento Mensal',
      icon: <MaterialIcons name="pie-chart" size={24} color="black" />,
      onPress: () => navigation.navigate('Planning', {
  screen: 'Budget',
}),
    },
    {
      id: 'settings',
      title: 'Configurações',
      icon: <MaterialIcons name="settings" size={24} color="black" />,
      onPress: () => navigation.navigate('Settings'),
    },
    {
      id: 'backup',
      title: 'Backup de Dados',
      icon: <MaterialIcons name="backup" size={24} color="black" />,
      onPress: () => navigation.navigate('Backup'),
    },
    {
      id: 'premium',
      title: 'Upgrade Premium',
      icon: <MaterialIcons name="star" size={24} color="#FFD700" />,
      onPress: () => navigation.navigate('Premium'),
      highlight: true,
    },
    {
      id: 'support',
      title: 'Suporte',
      icon: <MaterialIcons name="headset-mic" size={24} color="black" />,
      onPress: () => navigation.navigate('Support'),
    },
  ];

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Header com Avatar */}
      <View style={styles.header}>
        <View style={styles.avatarContainer}>
          {user?.photoURL ? (
            <Text>Foto do usuário</Text>
          ) : (
            <View style={styles.avatarPlaceholder}>
              <Text style={styles.avatarText}>
                {getInitials(user?.displayName || user?.email || 'U')}
              </Text>
            </View>
          )}
          <TouchableOpacity
            style={styles.editAvatarButton}
            onPress={() => console.log('Editar foto')}>
            <Text style={styles.editAvatarIcon}><Entypo name="camera" size={24} color="black" /></Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.userName}>
          {user?.displayName || 'Usuário'}
        </Text>
        <Text style={styles.userEmail}>{user?.email}</Text>
      </View>

      {/* Informações do usuário */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Informações da Conta</Text>
        
        <View style={styles.infoCard}>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Nome</Text>
            <Text style={styles.infoValue}>
              {user?.displayName || 'Não informado'}
            </Text>
          </View>
          
          <View style={styles.infoDivider} />
          
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Email</Text>
            <Text style={styles.infoValue}>{user?.email}</Text>
          </View>
          
          <View style={styles.infoDivider} />
          
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>ID do Usuário</Text>
            <Text style={styles.infoValue} numberOfLines={1}>
              {user?.uid}
            </Text>
          </View>
        </View>
      </View>

      {/* Menu de opções */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Menu</Text>
        
        {menuOptions.map((option, index) => (
          <TouchableOpacity
            key={option.id}
            style={[
              styles.menuItem,
              option.highlight && styles.menuItemHighlight,
              index === menuOptions.length - 1 && styles.menuItemLast,
            ]}
            onPress={option.onPress}>
            <Text style={styles.menuIcon}>{option.icon}</Text>
            <Text
              style={[
                styles.menuTitle,
                option.highlight && styles.menuTitleHighlight,
              ]}>
              {option.title}
            </Text>
            <Text style={styles.menuArrow}>›</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Botão Sair */}
      <Button
        title="Sair da Conta"
        onPress={handleLogout}
        variant="error"
        style={styles.logoutButton}
      />

      {/* Versão do app */}
      <Text style={styles.versionText}>Versão 1.0.0</Text>
    </ScrollView>
  );
};

const createStyles = (colors) =>
  StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  avatarPlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 36,
    fontWeight: 'bold',
    color: colors.card,
  },
  editAvatarButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: colors.card,
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: COLORS.black,
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  editAvatarIcon: {
    fontSize: 18,
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 12,
  },
  infoCard: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    shadowColor: COLORS.black,
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  infoRow: {
    paddingVertical: 12,
  },
  infoLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 16,
    color: colors.text,
    fontWeight: '500',
  },
  infoDivider: {
    height: 1,
    backgroundColor: colors.border,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    padding: 16,
    borderTopWidth: 1,
    borderColor: colors.border,
  },
  menuItemHighlight: {
    backgroundColor: colors.warning + '10',
  },
  menuItemLast: {
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
  },
  menuIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  menuTitle: {
    flex: 1,
    fontSize: 16,
    color: colors.text,
    fontWeight: '500',
  },
  menuTitleHighlight: {
    color: colors.warning,
    fontWeight: '600',
  },
  menuArrow: {
    fontSize: 24,
    color: colors.textSecondary,
  },
  logoutButton: {
    marginTop: 8,
    marginBottom: 24,
  },
  versionText: {
    textAlign: 'center',
    fontSize: 12,
    color: colors.textSecondary,
  },
});

export default ProfileScreen;