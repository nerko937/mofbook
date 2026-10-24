import path from 'path';

import { db, sqlite } from '@/db/client';
import * as schema from '@/db/schema';
import type { BetterSQLite3Database } from 'drizzle-orm/better-sqlite3';
import { migrate } from 'drizzle-orm/better-sqlite3/migrator';

const migrationsFolder = path.join(__dirname, '../src/db/drizzle');

function testDb(): BetterSQLite3Database<typeof schema> {
  return db as unknown as BetterSQLite3Database<typeof schema>;
}

export function setupTestDB() {
  beforeAll(() => {
    migrate(testDb(), { migrationsFolder });
  });

  afterEach(() => {
    const sqliteDb = sqlite as unknown as import('better-sqlite3').Database;
    const tables = sqliteDb
      .prepare(
        `SELECT name FROM sqlite_master WHERE type = 'table' AND name NOT LIKE 'sqlite_%' AND name != '__drizzle_migrations'`,
      )
      .all() as { name: string }[];

    for (const { name } of tables) {
      sqliteDb.prepare(`DELETE FROM ${name}`).run();
    }
  });
}
