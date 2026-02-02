import { databases } from '../libs/appwrite.js';

const DATABASE_ID = process.env.APPWRITE_DATABASE_ID || 'prm-db';
const COLLECTION_ID = 'verifications';

export const createVerification = async (data) => {
  try {
    const doc = await databases.createDocument(DATABASE_ID, COLLECTION_ID, 'unique()', data);
    return doc;
  } catch (error) {
    throw error;
  }
};

export const findVerificationByUserId = async (userId) => {
  try {
    const docs = await databases.listDocuments(DATABASE_ID, COLLECTION_ID, [
      `userId=${userId}`
    ]);
    return docs.documents[0] || null;
  } catch (error) {
    throw error;
  }
};

export const findVerificationByToken = async (token) => {
  try {
    const docs = await databases.listDocuments(DATABASE_ID, COLLECTION_ID, [
      `token=${token}`
    ]);
    return docs.documents[0] || null;
  } catch (error) {
    throw error;
  }
};

export const deleteVerification = async (id) => {
  try {
    await databases.deleteDocument(DATABASE_ID, COLLECTION_ID, id);
    return true;
  } catch (error) {
    throw error;
  }
};

export const Verification = {
  create: createVerification,
  findOne: findVerificationByUserId,
  findByToken: findVerificationByToken,
  findByIdAndDelete: deleteVerification
};