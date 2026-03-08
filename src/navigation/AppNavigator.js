/**
 * App Navigator
 * Gerencia a navegação entre Auth e Main
 */

import React, {useEffect, useState} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {View, ActivityIndicator, StyleSheet} from 'react-native';
import AuthNavigator from './AuthNavigator';
import TabNavigator from './TabNavigator';
import useAuthStore from '../store/authStore';
import usePremiumStore from '../store/premiumStore';
import {COLORS} from '../utils';

const AppNavigator = () => {
  const {user, loading, initializeAuth} = useAuthStore();
  const {loadPremiumStatus} = usePremiumStore();

  useEffect(() => {
    // Inicializar listener de autenticação
    const unsubscribe = initializeAuth();

    // Carregar status premium
    loadPremiumStatus();

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, []);

  // ✅ Mostrar loading enquanto verifica autenticação (sem setTimeout desnecessário)
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  return (
    <NavigationContainer>
      {user ? (
        // Usuário autenticado - mostrar TabNavigator
        <TabNavigator />
      ) : (
        // Usuário não autenticado - mostrar telas de Auth
        <AuthNavigator />
      )}
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.white,
  },
});

export default AppNavigator;