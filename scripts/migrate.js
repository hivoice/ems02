import { readFileSync, readdirSync } from 'fs';
import { join } from 'path';
import Database from 'better-sqlite3';

const MIGRATIONS_DIR = join(process.cwd(), 'src', 'lib', 'db', 'migrations');
const DB_PATH = join(process.cwd(), 'hrms.db');

async function migrate() {
  const db = new Database(DB_PATH);
  
  // Create migrations table if it doesn't exist
  db.exec(`
    CREATE TABLE IF NOT EXISTS migrations (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL UNIQUE,
      applied_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // Get all migration files
  const migrations = readdirSync(MIGRATIONS_DIR)
    .filter(file => file.endsWith('.sql'))
    .sort();

  // Get applied migrations
  const appliedMigrations = db.prepare(
    'SELECT name FROM migrations'
  ).all().map(row => row.name);

  // Apply new migrations
  for (const migration of migrations) {
    if (!appliedMigrations.includes(migration)) {
      console.log(`Applying migration: ${migration}`);
      
      const sql = readFileSync(
        join(MIGRATIONS_DIR, migration),
        'utf-8'
      );

      db.transaction(() => {
        db.exec(sql);
        db.prepare(
          'INSERT INTO migrations (name) VALUES (?)'
        ).run(migration);
      })();
    }
  }

  console.log('Migrations completed successfully');
  db.close();
}

migrate().catch(console.error);