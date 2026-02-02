import { databases } from '../libs/appwrite.js';

const DATABASE_ID = process.env.APPWRITE_DATABASE_ID || 'prm-db';
const COLLECTION_ID = 'activities';

export const createActivity = async (data) => {
  try {
    const doc = await databases.createDocument(DATABASE_ID, COLLECTION_ID, 'unique()', data);
    return doc;
  } catch (error) {
    throw error;
  }
};

export default {
  create: createActivity
};
