// src/services/BackupService.js

import {
  collection,
  doc,
  addDoc,
  getDoc,
  getDocs,
  setDoc,
  deleteDoc,
  query,
  orderBy,
  limit,
} from 'firebase/firestore';
import { auth, db } from './firebase/config';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CryptoJS from 'crypto-js';
import * as SecureStore from 'expo-secure-store';

const ENCRYPTION_KEY = '353f2e3088866287f900a444aac7a006f730dd25d16aabad26d8f9753f9599cf'; // Mude para uma chave forte em produção

class BackupService {
  userId = null;

  // Inicializar serviço com usuário autenticado
  initialize() {
      const user = auth.currentUser;
      if (!user) throw new Error('Usuário não autenticado');
      this.userId = user.uid;
    }
async getEncryptionKey() {
    let key = await SecureStore.getItemAsync('encryption_key');
    
    if (!key) {
      // Gerar chave única por dispositivo na primeira vez
      key = CryptoJS.lib.WordArray.random(32).toString();
      await SecureStore.setItemAsync('encryption_key', key);
    }
    
    return key;
  }

  // Criptografar dados sensíveis
  async encrypt(data) {
    const key = await this.getEncryptionKey();
    return CryptoJS.AES.encrypt(JSON.stringify(data), key).toString();
  }

  // Descriptografar dados
  decrypt(cipher) {
    return JSON.parse(
      CryptoJS.AES.decrypt(cipher, ENCRYPTION_KEY)
        .toString(CryptoJS.enc.Utf8)
    );
  }

  // Coletar todos os dados do AsyncStorage
  async collectLocalData() {
    const keys = await AsyncStorage.getAllKeys();
    const values = await AsyncStorage.multiGet(keys);

    return Object.fromEntries(
      values.map(([k, v]) => [k, JSON.parse(v)])
    );
  }

  // Coletar dados do Firestore
  async collectFirestoreData() {
    this.initialize();

    const collections = [
      'transactions',
      'goals',
      'investments',
      'offers',
      'tithes',
      'planning',
      'categories',
    ];

    const data = {};

    for (const name of collections) {
      const ref = collection(db, 'users', this.userId, name);
      const snap = await getDocs(ref);

      data[name] = snap.docs.map(d => ({
        id: d.id,
        ...d.data(),
      }));
    }

    return data;
  }

  // Criar backup completo
  async createBackup(manual = false) {
    this.initialize();

    const localData = await this.collectLocalData();
    const firestoreData = await this.collectFirestoreData();

    const encrypted = this.encrypt({
      userPreferences: localData.userPreferences,
      settings: localData.settings,
    });

    const backup = {
      createdAt: new Date().toISOString(),
      manual,
      version: '1.0',
      data: {
        firestore: firestoreData,
        encrypted,
      },
      metadata: {
        totalRecords: Object.values(firestoreData)
          .reduce((a, b) => a + b.length, 0),
      },
    };

    await addDoc(
      collection(db, 'users', this.userId, 'backups'),
      backup
    );

    await AsyncStorage.setItem('lastBackupDate', backup.createdAt);

    return backup;
  }
  // Listar backups disponíveis
  async listBackups(max = 10) {
    this.initialize();

    const ref = collection(db, 'users', this.userId, 'backups');
    const q = query(ref, orderBy('createdAt', 'desc'), limit(max));
    const snap = await getDocs(q);

    return snap.docs.map(d => ({ id: d.id, ...d.data() }));
  }

  async restoreBackup(backupId) {
    this.initialize();

    const ref = doc(db, 'users', this.userId, 'backups', backupId);
    const snap = await getDoc(ref);

    if (!snap.exists()) throw new Error('Backup não encontrado');

    const backup = snap.data();

    for (const [collectionName, records] of Object.entries(
      backup.data.firestore
    )) {
      for (const record of records) {
        const { id, ...data } = record;
        await setDoc(
          doc(db, 'users', this.userId, collectionName, id),
          { ...data, userId: this.userId }
        );
      }
    }

    const decrypted = this.decrypt(backup.data.encrypted);

    if (decrypted.userPreferences) {
      await AsyncStorage.setItem(
        'userPreferences',
        JSON.stringify(decrypted.userPreferences)
      );
    }

    if (decrypted.settings) {
      await AsyncStorage.setItem(
        'settings',
        JSON.stringify(decrypted.settings)
      );
    }

    return { success: true };
  }

  // Excluir backup antigo
  async deleteBackup(id) {
    this.initialize();
    await deleteDoc(doc(db, 'users', this.userId, 'backups', id));
  }
}

export default new BackupService();