import { openDB } from 'idb';
import type { DBSchema } from 'idb';

interface HRMSSchema extends DBSchema {
  users: {
    key: string;
    value: {
      id: string;
      email: string;
      password: string;
      role: 'admin' | 'employee';
      created_at: string;
      updated_at: string;
    };
    indexes: { 'by-email': string };
  };
}

export const db = openDB<HRMSSchema>('hrms', 1, {
  upgrade(db) {
    const userStore = db.createObjectStore('users', { keyPath: 'id' });
    userStore.createIndex('by-email', 'email', { unique: true });
  },
});