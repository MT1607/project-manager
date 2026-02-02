import { databases } from '../libs/appwrite.js';

const DATABASE_ID = process.env.APPWRITE_DATABASE_ID || 'prm-db';
const COLLECTION_ID = 'licenses';

export const createLicense = async (data) => {
  try {
    const doc = await databases.createDocument(DATABASE_ID, COLLECTION_ID, 'unique()', data);
    return doc;
  } catch (error) {
    throw error;
  }
};

export const findLicenseByUserId = async (userId) => {
  try {
    const docs = await databases.listDocuments(DATABASE_ID, COLLECTION_ID, [
      `userId=${userId}`
    ]);
    return docs.documents[0] || null;
  } catch (error) {
    throw error;
  }
};

export default {
  create: createLicense,
  findOne: findLicenseByUserId
};
