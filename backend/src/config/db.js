import pg from 'pg';
import dotenv from 'dotenv';
import { memory, useMemory } from '../data/memoryStore.js';
import { bootstrapDatabase } from '../db/bootstrap.js';

dotenv.config();

let pool = null;
let memoryMode = useMemory();

if (!memoryMode) {
  pool = new pg.Pool({
    connectionString:
      process.env.DATABASE_URL || 'postgresql://tariki:tariki_secret@localhost:5433/tariki_traffic',
  });
  pool.on('error', (err) => {
    console.error('[DB] Unexpected error:', err.message);
  });
}

export async function initDb() {
  if (memoryMode) {
    await bootstrapDatabase(null);
    return;
  }

  try {
    await pool.query('SELECT 1');
    await bootstrapDatabase(pool);
    console.log('[DB] PostgreSQL connecté et initialisé');
  } catch (err) {
    console.warn('[DB] PostgreSQL indisponible, bascule en mode mémoire:', err.message);
    memoryMode = true;
    pool = null;
    await bootstrapDatabase(null);
  }
}

export function isMemoryMode() {
  return memoryMode;
}

export async function query(text, params) {
  if (memoryMode) return memory.query(text, params);

  const start = Date.now();
  const res = await pool.query(text, params);
  const duration = Date.now() - start;
  if (process.env.NODE_ENV !== 'production' && duration > 100) {
    console.log(`[DB] slow query (${duration}ms):`, text.slice(0, 80));
  }
  return res;
}

export default pool;
