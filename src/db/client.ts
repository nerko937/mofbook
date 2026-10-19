import { openDatabaseSync } from 'expo-sqlite';
import { drizzle } from 'drizzle-orm/expo-sqlite';

// export const expoDb = openDatabaseSync('app.db', { enableChangeListener: true });
export const expoDb = openDatabaseSync(':memory:')
export const db = drizzle(expoDb);
