import { databases } from '../libs/appwrite.js';

const DATABASE_ID = process.env.APPWRITE_DATABASE_ID || 'prm-db';
const COLLECTION_ID = 'tasks';

export const createTask = async (data) => {
  try {
    const doc = await databases.createDocument(DATABASE_ID, COLLECTION_ID, 'unique()', data);
    return doc;
  } catch (error) {
    throw error;
  }
};

export const findTaskById = async (id) => {
  try {
    const doc = await databases.getDocument(DATABASE_ID, COLLECTION_ID, id);
    return doc;
  } catch (error) {
    throw error;
  }
};

export const findTasksByProject = async (projectId) => {
  try {
    const docs = await databases.listDocuments(DATABASE_ID, COLLECTION_ID, [
      `project=${projectId}`
    ]);
    return docs.documents;
  } catch (error) {
    throw error;
  }
};

export const updateTask = async (id, updates) => {
  try {
    const doc = await databases.updateDocument(DATABASE_ID, COLLECTION_ID, id, updates);
    return doc;
  } catch (error) {
    throw error;
  }
};

export const deleteTask = async (id) => {
  try {
    await databases.deleteDocument(DATABASE_ID, COLLECTION_ID, id);
    return true;
  } catch (error) {
    throw error;
  }
};

export default {
  create: createTask,
  findById: findTaskById,
  findByProject: findTasksByProject,
  update: updateTask,
  delete: deleteTask
};
