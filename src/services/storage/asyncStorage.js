/**
 * Service para gerenciar AsyncStorage
 * Facilita salvar e recuperar dados localmente
 */

import AsyncStorage from '@react-native-async-storage/async-storage';

// Chaves para armazenamento
export const STORAGE_KEYS = {
  USER_DATA: '@user_data',
  TRANSACTIONS: '@transactions',
  CATEGORIES: '@categories',
  GOALS: '@goals',
  LAST_BACKUP: '@last_backup',
  PREMIUM_STATUS: '@premium_status',
  SUPPORT_TICKETS: '@support_tickets',
  SETTINGS: '@settings',
};

/**
 * Salvar dados
 * @param {string} key - Chave do storage
 * @param {any} value - Valor a ser salvo
 * @returns {Promise<boolean>} - true se salvou com sucesso
 */
export const saveData = async (key, value) => {
  try {
    const jsonValue = JSON.stringify(value);
    await AsyncStorage.setItem(key, jsonValue);
    console.log(`✅ Dados salvos: ${key}`);
    return true;
  } catch (error) {
    console.error(`❌ Erro ao salvar ${key}:`, error);
    return false;
  }
};

/**
 * Recuperar dados
 * @param {string} key - Chave do storage
 * @returns {Promise<any|null>} - Dados recuperados ou null
 */
export const getData = async key => {
  try {
    const jsonValue = await AsyncStorage.getItem(key);
    if (jsonValue !== null) {
      console.log(`✅ Dados recuperados: ${key}`);
      return JSON.parse(jsonValue);
    }
    console.log(`⚠️ Nenhum dado encontrado para: ${key}`);
    return null;
  } catch (error) {
    console.error(`❌ Erro ao recuperar ${key}:`, error);
    return null;
  }
};

/**
 * Remover dados
 * @param {string} key - Chave do storage
 * @returns {Promise<boolean>} - true se removeu com sucesso
 */
export const removeData = async key => {
  try {
    await AsyncStorage.removeItem(key);
    console.log(`✅ Dados removidos: ${key}`);
    return true;
  } catch (error) {
    console.error(`❌ Erro ao remover ${key}:`, error);
    return false;
  }
};

/**
 * Limpar todos os dados do storage
 * @returns {Promise<boolean>} - true se limpou com sucesso
 */
export const clearAll = async () => {
  try {
    await AsyncStorage.clear();
    console.log('✅ Todos os dados foram limpos');
    return true;
  } catch (error) {
    console.error('❌ Erro ao limpar dados:', error);
    return false;
  }
};

/**
 * Obter todas as chaves armazenadas
 * @returns {Promise<string[]>} - Array com todas as chaves
 */
export const getAllKeys = async () => {
  try {
    const keys = await AsyncStorage.getAllKeys();
    console.log('✅ Chaves encontradas:', keys);
    return keys;
  } catch (error) {
    console.error('❌ Erro ao buscar chaves:', error);
    return [];
  }
};

/**
 * Salvar múltiplos itens de uma vez
 * @param {Array<[string, any]>} items - Array de pares [chave, valor]
 * @returns {Promise<boolean>}
 */
export const saveMultiple = async items => {
  try {
    const pairs = items.map(([key, value]) => [key, JSON.stringify(value)]);
    await AsyncStorage.multiSet(pairs);
    console.log('✅ Múltiplos dados salvos');
    return true;
  } catch (error) {
    console.error('❌ Erro ao salvar múltiplos dados:', error);
    return false;
  }
};

/**
 * Recuperar múltiplos itens de uma vez
 * @param {string[]} keys - Array de chaves
 * @returns {Promise<Object>} - Objeto com os dados recuperados
 */
export const getMultiple = async keys => {
  try {
    const pairs = await AsyncStorage.multiGet(keys);
    const result = {};
    pairs.forEach(([key, value]) => {
      if (value !== null) {
        result[key] = JSON.parse(value);
      }
    });
    console.log('✅ Múltiplos dados recuperados');
    return result;
  } catch (error) {
    console.error('❌ Erro ao recuperar múltiplos dados:', error);
    return {};
  }
};

// Exportar todas as funções
export default {
  saveData,
  getData,
  removeData,
  clearAll,
  getAllKeys,
  saveMultiple,
  getMultiple,
  STORAGE_KEYS,
};