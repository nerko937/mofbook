import { openDatabaseSync } from 'expo-sqlite';
import { drizzle } from 'drizzle-orm/expo-sqlite';
import * as schema from '@/db/schema'

// export const sqlite = openDatabaseSync('app.db', { enableChangeListener: true });
export const sqlite = openDatabaseSync(':memory:', { enableChangeListener: true})
export const db = drizzle(sqlite, { schema });
