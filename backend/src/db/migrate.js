import fs from 'fs';
import path from 'path';
import { fileURLToPath, pathToFileURL } from 'url';
import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const isCli =
  process.argv[1] && pathToFileURL(path.resolve(process.argv[1])).href === import.meta.url;

export async function runMigrations(pool) {
  const sqlPath = path.join(__dirname, 'init.sql');
  const sql = fs.readFileSync(sqlPath, 'utf8');
  await pool.query(sql);
}

async function main() {
  const connectionString =
    process.env.DATABASE_URL || 'postgresql://tariki:tariki_secret@localhost:5433/tariki_traffic';

  const pool = new pg.Pool({ connectionString });
  try {
    await runMigrations(pool);
    console.log('✅ Schéma PostgreSQL Tariki appliqué (init.sql)');
  } finally {
    await pool.end();
  }
}

if (isCli) {
  main().catch((err) => {
    console.error('Migration failed:', err.message);
    process.exit(1);
  });
}
