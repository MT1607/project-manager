import { databases } from '../libs/appwrite.js';

const DATABASE_ID = process.env.APPWRITE_DATABASE_ID || 'prm-db';
const COLLECTION_ID = 'users';

export const createUser = async (userData) => {
  try {
    const user = await databases.createDocument(DATABASE_ID, COLLECTION_ID, 'unique()', userData);
    return user;
  } catch (error) {
    throw error;
  }
};

export const findUserByEmail = async (email) => {
  try {
    const users = await databases.listDocuments(DATABASE_ID, COLLECTION_ID, [
      `email=${email}`
    ]);
    return users.documents[0] || null;
  } catch (error) {
    throw error;
  }
};

export const findUserById = async (id) => {
  try {
    const user = await databases.getDocument(DATABASE_ID, COLLECTION_ID, id);
    return user;
  } catch (error) {
    throw error;
  }
};

export const updateUser = async (id, updates) => {
  try {
    const user = await databases.updateDocument(DATABASE_ID, COLLECTION_ID, id, updates);
    return user;
  } catch (error) {
    throw error;
  }
};

export const deleteUser = async (id) => {
  try {
    await databases.deleteDocument(DATABASE_ID, COLLECTION_ID, id);
    return true;
  } catch (error) {
    throw error;
  }
};

export default {
  createUser,
  findUserByEmail,
  findUserById,
  updateUser,
  deleteUser
};