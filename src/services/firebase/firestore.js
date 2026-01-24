/**
 * Helpers para Firestore (Firebase Web SDK v12)
 * Funções para CRUD (Create, Read, Update, Delete)
 */

import {
  collection,
  doc,
  addDoc,
  getDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  serverTimestamp,
  onSnapshot,
} from 'firebase/firestore';
import {db, COLLECTIONS} from './config';

/**
 * Adicionar documento
 * @param {string} collectionName - Nome da coleção
 * @param {object} data - Dados a serem salvos
 * @returns {Promise<string>} - ID do documento criado
 */
export const addDocument = async (collectionName, data) => {
  try {
    const documentData = {
      ...data,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };

    const docRef = await addDoc(collection(db, collectionName), documentData);

    console.log(`✅ Documento criado em ${collectionName}: ${docRef.id}`);
    return docRef.id;
  } catch (error) {
    console.error(`❌ Erro ao criar documento em ${collectionName}:`, error);
    throw error;
  }
};

/**
 * Obter documento por ID
 * @param {string} collectionName - Nome da coleção
 * @param {string} docId - ID do documento
 * @returns {Promise<object|null>} - Dados do documento ou null
 */
export const getDocument = async (collectionName, docId) => {
  try {
    const docRef = doc(db, collectionName, docId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      console.log(`✅ Documento encontrado em ${collectionName}: ${docId}`);
      return {id: docSnap.id, ...docSnap.data()};
    } else {
      console.log(`⚠️ Documento não encontrado em ${collectionName}: ${docId}`);
      return null;
    }
  } catch (error) {
    console.error(`❌ Erro ao buscar documento em ${collectionName}:`, error);
    throw error;
  }
};

/**
 * Obter todos os documentos de uma coleção
 * @param {string} collectionName - Nome da coleção
 * @param {object} filters - Filtros opcionais {field, operator, value}
 * @param {object} order - Ordenação opcional {field, direction}
 * @param {number} limitCount - Limite de documentos (opcional)
 * @returns {Promise<array>} - Array de documentos
 */
export const getDocuments = async (
  collectionName,
  filters = null,
  order = null,
  limitCount = null,
) => {
  try {
    const collectionRef = collection(db, collectionName);
    let q = collectionRef;

    const constraints = [];

    // Aplicar filtros
    if (filters) {
      if (Array.isArray(filters)) {
        filters.forEach(filter => {
          constraints.push(where(filter.field, filter.operator, filter.value));
        });
      } else {
        constraints.push(
          where(filters.field, filters.operator, filters.value),
        );
      }
    }

    // Aplicar ordenação
    if (order) {
      constraints.push(orderBy(order.field, order.direction || 'asc'));
    }

    // Aplicar limite
    if (limitCount) {
      constraints.push(limit(limitCount));
    }

    if (constraints.length > 0) {
      q = query(collectionRef, ...constraints);
    }

    const snapshot = await getDocs(q);
    const documents = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));

    console.log(
      `✅ ${documents.length} documentos encontrados em ${collectionName}`,
    );
    return documents;
  } catch (error) {
    console.error(`❌ Erro ao buscar documentos em ${collectionName}:`, error);
    throw error;
  }
};

/**
 * Atualizar documento
 * @param {string} collectionName - Nome da coleção
 * @param {string} docId - ID do documento
 * @param {object} data - Dados a serem atualizados
 * @returns {Promise<boolean>} - true se atualizou com sucesso
 */
export const updateDocument = async (collectionName, docId, data) => {
  try {
    const docRef = doc(db, collectionName, docId);
    const updateData = {
      ...data,
      updatedAt: serverTimestamp(),
    };

    await updateDoc(docRef, updateData);

    console.log(`✅ Documento atualizado em ${collectionName}: ${docId}`);
    return true;
  } catch (error) {
    console.error(
      `❌ Erro ao atualizar documento em ${collectionName}:`,
      error,
    );
    throw error;
  }
};

/**
 * Deletar documento
 * @param {string} collectionName - Nome da coleção
 * @param {string} docId - ID do documento
 * @returns {Promise<boolean>} - true se deletou com sucesso
 */
export const deleteDocument = async (collectionName, docId) => {
  try {
    const docRef = doc(db, collectionName, docId);
    await deleteDoc(docRef);

    console.log(`✅ Documento deletado de ${collectionName}: ${docId}`);
    return true;
  } catch (error) {
    console.error(`❌ Erro ao deletar documento de ${collectionName}:`, error);
    throw error;
  }
};

/**
 * Listener em tempo real para um documento
 * @param {string} collectionName - Nome da coleção
 * @param {string} docId - ID do documento
 * @param {function} callback - Função chamada quando há alteração
 * @returns {function} - Função para cancelar o listener
 */
export const listenToDocument = (collectionName, docId, callback) => {
  const docRef = doc(db, collectionName, docId);

  const unsubscribe = onSnapshot(
    docRef,
    docSnap => {
      if (docSnap.exists()) {
        callback({id: docSnap.id, ...docSnap.data()});
      } else {
        callback(null);
      }
    },
    error => {
      console.error(`❌ Erro no listener de ${collectionName}:`, error);
    },
  );

  return unsubscribe;
};

/**
 * Listener em tempo real para coleção
 * @param {string} collectionName - Nome da coleção
 * @param {function} callback - Função chamada quando há alteração
 * @param {object} filters - Filtros opcionais
 * @returns {function} - Função para cancelar o listener
 */
export const listenToCollection = (collectionName, callback, filters = null) => {
  const collectionRef = collection(db, collectionName);
  let q = collectionRef;

  if (filters) {
    const constraints = [];
    if (Array.isArray(filters)) {
      filters.forEach(filter => {
        constraints.push(where(filter.field, filter.operator, filter.value));
      });
    } else {
      constraints.push(where(filters.field, filters.operator, filters.value));
    }
    q = query(collectionRef, ...constraints);
  }

  const unsubscribe = onSnapshot(
    q,
    snapshot => {
      const documents = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      callback(documents);
    },
    error => {
      console.error(`❌ Erro no listener de ${collectionName}:`, error);
    },
  );

  return unsubscribe;
};

/**
 * Fazer backup de todos os dados do usuário
 * @param {string} userId - ID do usuário
 * @returns {Promise<object>} - Objeto com todos os dados
 */
export const backupUserData = async userId => {
  try {
    const backup = {};

    // Buscar todas as transações
    backup.transactions = await getDocuments(COLLECTIONS.TRANSACTIONS, {
      field: 'userId',
      operator: '==',
      value: userId,
    });

    // Buscar todas as metas
    backup.goals = await getDocuments(COLLECTIONS.GOALS, {
      field: 'userId',
      operator: '==',
      value: userId,
    });

    // Buscar todos os investimentos
    backup.investments = await getDocuments(COLLECTIONS.INVESTMENTS, {
      field: 'userId',
      operator: '==',
      value: userId,
    });

    // Buscar todas as ofertas
    backup.offers = await getDocuments(COLLECTIONS.OFFERS, {
      field: 'userId',
      operator: '==',
      value: userId,
    });

    console.log('✅ Backup completo realizado');
    return backup;
  } catch (error) {
    console.error('❌ Erro ao fazer backup:', error);
    throw error;
  }
};

export default {
  addDocument,
  getDocument,
  getDocuments,
  updateDocument,
  deleteDocument,
  listenToDocument,
  listenToCollection,
  backupUserData,
};