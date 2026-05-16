import { query } from '../config/db.js';

export async function logSystem(level, source, message, metadata = {}) {
  const entry = {
    level,
    source,
    message,
    metadata,
    timestamp: new Date().toISOString(),
  };

  console.log(`[${level.toUpperCase()}] [${source}] ${message}`);

  try {
    await query(
      'INSERT INTO system_logs (level, source, message, metadata) VALUES ($1, $2, $3, $4)',
      [level, source, message, JSON.stringify(metadata)]
    );
  } catch {
    // DB may be unavailable during startup
  }

  return entry;
}
