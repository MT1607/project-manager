import { Client, Databases, Users, Account } from 'node-appwrite';

const client = new Client()
  .setEndpoint(process.env.APPWRITE_ENDPOINT)
  .setProject(process.env.APPWRITE_PROJECT_ID)
  .setKey(process.env.APPWRITE_APIKEY);

export const databases = new Databases(client);
export const users = new Users(client);
export const account = new Account(client);

export default client;