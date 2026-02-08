/**
 * Tela de Edição de Perfil
 */

import React, {useState, useEffect,useMemo} from 'react';
import { useTheme } from '../../context/ThemeContext';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  TouchableOpacity,
} from 'react-native';
import {Button, Input} from '../../components/ui';
import { getInitials} from '../../utils';
import useAuthStore from '../../store/authStore';
import {updateProfile} from 'firebase/auth';
import {auth} from '../../services/firebase/config';

const EditProfileScreen = ({navigation}) => {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  // ✅ selector correto
  const user = useAuthStore(state => state.user);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [nameError, setNameError] = useState('');
  const [loading, setLoading] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    setName(user?.displayName || '');
    setEmail(user?.email || '');
  }, [user]);

  useEffect(() => {
    const changed = name !== (user?.displayName || '');
    setHasChanges(changed);
  }, [name, user]);

  const validateFields = () => {
    setNameError('');

    if (!name) {
      setNameError('Nome é obrigatório');
      return false;
    }

    if (name.length < 3) {
      setNameError('Nome deve ter no mínimo 3 caracteres');
      return false;
    }

    return true;
  };

  const handleSave = async () => {
    if (!validateFields()) return;

    try {
      setLoading(true);

      const currentUser = auth.currentUser;

      if (!currentUser) return;

      await updateProfile(currentUser, {
        displayName: name,
      });

      // ✅ atualização direta (ok para apps pequenos)
      useAuthStore.setState(state => ({
        user: {
          ...state.user,
          displayName: name,
        },
      }));

      Alert.alert('Sucesso! ✅', 'Perfil atualizado com sucesso!', [
        {text: 'OK', onPress: () => navigation.goBack()},
      ]);
    } catch (error) {
      console.error('Erro ao atualizar perfil:', error);
      Alert.alert('Erro', 'Não foi possível atualizar o perfil');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    if (hasChanges) {
      Alert.alert(
        'Descartar alterações?',
        'Você tem alterações não salvas. Deseja descartá-las?',
        [
          {text: 'Continuar editando', style: 'cancel'},
          {
            text: 'Descartar',
            style: 'destructive',
            onPress: () => navigation.goBack(),
          },
        ],
      );
    } else {
      navigation.goBack();
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled">
        {/* Avatar */}
        <View style={styles.avatarSection}>
          <View style={styles.avatarContainer}>
            <View style={styles.avatarPlaceholder}>
              <Text style={styles.avatarText}>
                {getInitials(name || user?.email || 'U')}
              </Text>
            </View>
          </View>

          <TouchableOpacity
            style={styles.changePhotoButton}
            onPress={() =>
              Alert.alert('Info', 'Funcionalidade em desenvolvimento')
            }>
            <Text style={styles.changePhotoText}>Alterar foto</Text>
          </TouchableOpacity>
        </View>

        {/* Form */}
        <View style={styles.form}>
          <Input
            label="Nome Completo"
            value={name}
            onChangeText={setName}
            error={nameError}
          />

          <Input label="Email" value={email} editable={false} />

          <View style={styles.infoBox}>
            <Text style={styles.infoText}>
              O email não pode ser alterado.
            </Text>
          </View>
        </View>

        {/* Actions */}
        <View style={styles.actions}>
          <Button
            title="Salvar Alterações"
            onPress={handleSave}
            loading={loading}
            disabled={!hasChanges}
          />
          <Button title="Cancelar" variant="outline" onPress={handleCancel} />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const createStyles = (colors) =>
  StyleSheet.create({
  container: {flex: 1, backgroundColor: colors.background},
  content: {padding: 20, paddingBottom: 40},
  avatarSection: {alignItems: 'center', marginBottom: 32},
  avatarContainer: {marginBottom: 16},
  avatarPlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {fontSize: 36, fontWeight: 'bold', color: colors.card},
  changePhotoButton: {paddingVertical: 8},
  changePhotoText: {color: colors.primary, fontWeight: '600'},
  form: {marginBottom: 24},
  infoBox: {
    backgroundColor: colors.info + '10',
    borderRadius: 8,
    padding: 12,
    marginTop: 8,
  },
  infoText: {fontSize: 13, color: colors.textSecondary},
  actions: {gap: 12},
});

export default EditProfileScreen;
