import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import { query, isMemoryMode } from '../config/db.js';
import { initMemoryStore, replaceRoadsInMemory, store } from '../data/memoryStore.js';
import { loadRoadSegments } from '../services/tarikiDatasetLoader.js';
import { runMigrations } from './migrate.js';
import {
  DEMO_ADMIN_EMAIL,
  DEMO_ADMIN_PASSWORD,
  DEMO_USER_EMAIL,
  DEMO_USER_PASSWORD,
} from '../config/demoCredentials.js';
import { logSystem } from '../utils/logger.js';

const DEFAULT_DAY = () => process.env.TARIKI_DEFAULT_DAY || 'monday';

async function roadSegmentCount() {
  const result = await query('SELECT COUNT(*) FROM road_segments');
  const raw = result.rows[0]?.count ?? result.rows[0]?.n ?? '0';
  return parseInt(String(raw), 10) || 0;
}

async function upsertRoadSegments(roads) {
  for (const road of roads) {
    await query(
      `INSERT INTO road_segments (id, name, coordinates, status, speed_kmh, congestion_level)
       VALUES ($1, $2, $3, $4, $5, $6)
       ON CONFLICT (id) DO UPDATE SET
         name = EXCLUDED.name,
         coordinates = EXCLUDED.coordinates,
         status = EXCLUDED.status,
         speed_kmh = EXCLUDED.speed_kmh,
         congestion_level = EXCLUDED.congestion_level`,
      [
        road.id,
        road.name,
        JSON.stringify(road.coordinates),
        road.status,
        road.speed_kmh,
        road.congestion_level,
      ]
    );
  }
}

async function ensureDemoUsers() {
  const hash = await bcrypt.hash(DEMO_ADMIN_PASSWORD, 10);
  const userHash = await bcrypt.hash(DEMO_USER_PASSWORD, 10);

  await query(
    `INSERT INTO admins (email, password_hash, name)
     VALUES ($1, $2, $3)
     ON CONFLICT (email) DO UPDATE SET password_hash = EXCLUDED.password_hash, name = EXCLUDED.name`,
    [DEMO_ADMIN_EMAIL, hash, 'Kalil (admin)']
  );

  await query(
    `INSERT INTO users (email, password_hash, name, role)
     VALUES ($1, $2, $3, $4)
     ON CONFLICT (email) DO UPDATE SET
       password_hash = EXCLUDED.password_hash,
       name = EXCLUDED.name,
       role = EXCLUDED.role`,
    [DEMO_ADMIN_EMAIL, hash, 'Kalil (admin)', 'admin']
  );

  await query(
    `INSERT INTO users (email, password_hash, name, role)
     VALUES ($1, $2, $3, $4)
     ON CONFLICT (email) DO UPDATE SET
       password_hash = EXCLUDED.password_hash,
       name = EXCLUDED.name,
       role = EXCLUDED.role`,
    [DEMO_USER_EMAIL, userHash, 'KPL (conducteur)', 'user']
  );
}

async function ensureDemoIncidents(roads) {
  const existing = await query('SELECT COUNT(*) FROM incidents');
  const count = parseInt(String(existing.rows[0]?.count ?? '0'), 10);
  if (count > 0) return;

  const r0 = roads[0];
  const r1 = roads[1] || roads[0];
  if (!r0) return;

  const mid0 = r0.coordinates[Math.floor(r0.coordinates.length / 2)];
  const mid1 = r1.coordinates[Math.floor(r1.coordinates.length / 2)];

  const samples = [
    {
      type: 'accident',
      title: `Collision — ${r0.name}`,
      description: `Incident signalé sur ${r0.name} — Casablanca`,
      latitude: mid0[1],
      longitude: mid0[0],
      severity: 'high',
      road_segment_id: r0.id,
    },
    {
      type: 'jam',
      title: `Embouteillage — ${r1.name}`,
      description: `Incident signalé sur ${r1.name} — Casablanca`,
      latitude: mid1[1],
      longitude: mid1[0],
      severity: 'medium',
      road_segment_id: r1.id,
    },
  ];

  for (const inc of samples) {
    await query(
      `INSERT INTO incidents (type, title, description, latitude, longitude, severity, road_segment_id)
       VALUES ($1, $2, $3, $4, $5, $6, $7)`,
      [inc.type, inc.title, inc.description, inc.latitude, inc.longitude, inc.severity, inc.road_segment_id]
    );
  }
}

export async function bootstrapDatabase(pgPool = null) {
  const day = DEFAULT_DAY();
  const roads = loadRoadSegments(day);

  if (isMemoryMode() || !pgPool) {
    await initMemoryStore();
    replaceRoadsInMemory(roads);
    console.log(`[Bootstrap] Mémoire — ${roads.length} segments (${day}), ${store.users.length} comptes`);
    return { mode: 'memory', segments: roads.length, day };
  }

  await runMigrations(pgPool);

  let segments = await roadSegmentCount();
  if (segments === 0) {
    await upsertRoadSegments(roads);
    segments = roads.length;
    await logSystem('info', 'bootstrap', `Dataset ${day} chargé (${segments} segments)`);
  }

  await ensureDemoUsers();
  await ensureDemoIncidents(roads);

  console.log(`[Bootstrap] PostgreSQL — ${segments} segments, comptes démo prêts`);
  return { mode: 'postgresql', segments, day };
}
