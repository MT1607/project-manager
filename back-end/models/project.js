import { databases } from '../libs/appwrite.js';

const DATABASE_ID = process.env.APPWRITE_DATABASE_ID || 'prm-db';
const COLLECTION_ID = 'projects';

export const createProject = async (data) => {
  try {
    const doc = await databases.createDocument(DATABASE_ID, COLLECTION_ID, 'unique()', data);
    return doc;
  } catch (error) {
    throw error;
  }
};

export const findProjectById = async (id) => {
  try {
    const doc = await databases.getDocument(DATABASE_ID, COLLECTION_ID, id);
    return doc;
  } catch (error) {
    throw error;
  }
};

export const findProjectsByWorkspace = async (workspaceId) => {
  try {
    const docs = await databases.listDocuments(DATABASE_ID, COLLECTION_ID, [
      `workspace=${workspaceId}`
    ]);
    return docs.documents;
  } catch (error) {
    throw error;
  }
};

export const updateProject = async (id, updates) => {
  try {
    const doc = await databases.updateDocument(DATABASE_ID, COLLECTION_ID, id, updates);
    return doc;
  } catch (error) {
    throw error;
  }
};

export const deleteProject = async (id) => {
  try {
    await databases.deleteDocument(DATABASE_ID, COLLECTION_ID, id);
    return true;
  } catch (error) {
    throw error;
  }
};

export default {
  create: createProject,
  findById: findProjectById,
  findByWorkspace: findProjectsByWorkspace,
  update: updateProject,
  delete: deleteProject
};
