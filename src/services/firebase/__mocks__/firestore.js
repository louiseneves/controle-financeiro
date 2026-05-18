export const addDocument = jest.fn();
export const updateDocument = jest.fn();
export const deleteDocument = jest.fn();
export const getDocuments = jest.fn(() => []);
export const subscribeToCollection = jest.fn();

export default {
  addDocument,
  updateDocument,
  deleteDocument,
  getDocuments,
  subscribeToCollection,
};
