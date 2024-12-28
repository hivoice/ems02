import { openDB, IDBPDatabase } from 'idb';
import { DB_CONFIG, type HRMSSchema } from './config';

let dbInstance: Promise<IDBPDatabase<HRMSSchema>> | null = null;

export async function getDB(): Promise<IDBPDatabase<HRMSSchema>> {
  if (!dbInstance) {
    dbInstance = openDB<HRMSSchema>(DB_CONFIG.name, DB_CONFIG.version, {
      upgrade(db) {
        // Create stores if they don't exist
        for (const [storeName, config] of Object.entries(DB_CONFIG.stores)) {
          if (!db.objectStoreNames.contains(storeName)) {
            const store = db.createObjectStore(storeName, { 
              keyPath: config.keyPath 
            });
            
            // Create indexes
            config.indexes.forEach(({ name, keyPath, options }) => {
              store.createIndex(name, keyPath, options);
            });
          }
        }
      },
      blocked() {
        console.log('データベースがブロックされています - 古いバージョンが開いています');
        dbInstance = null;
      },
      blocking() {
        console.log('データベースをブロックしています - 新しいバージョンが開こうとしています');
        dbInstance = null;
      },
      terminated() {
        console.log('データベース接続が予期せず終了しました');
        dbInstance = null;
      }
    });
  }
  return dbInstance;
}

export async function closeDB(): Promise<void> {
  if (dbInstance) {
    const db = await dbInstance;
    db.close();
    dbInstance = null;
  }
}

export async function deleteDB(): Promise<void> {
  await closeDB();
  await indexedDB.deleteDatabase(DB_CONFIG.name);
}