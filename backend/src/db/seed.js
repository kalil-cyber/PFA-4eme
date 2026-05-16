import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import { query } from '../config/db.js';
import {
  DEMO_ADMIN_EMAIL,
  DEMO_ADMIN_PASSWORD,
  DEMO_USER_EMAIL,
  DEMO_USER_PASSWORD,
  DEMO_ADMIN_ACCESS_CODE,
} from '../config/demoCredentials.js';
import { ROAD_SEGMENTS } from '../data/roads.js';

dotenv.config();

function incidentFromRoad(road, type, title, severity) {
  const mid = road.coordinates[Math.floor(road.coordinates.length / 2)];
  return {
    type,
    title,
    description: `Incident signalé sur ${road.name} — Casablanca`,
    latitude: mid[1],
    longitude: mid[0],
    severity,
    road_segment_id: road.id,
  };
}

const INCIDENTS = (() => {
  const roads = ROAD_SEGMENTS;
  if (roads.length < 3) return [];
  return [
    incidentFromRoad(roads[0], 'accident', `Collision — ${roads[0].name}`, 'high'),
    incidentFromRoad(roads[1], 'jam', `Embouteillage — ${roads[1].name}`, 'medium'),
    incidentFromRoad(roads[2], 'road_closed', `Travaux — ${roads[2].name}`, 'low'),
  ];
})();

async function seed() {
  console.log('🌱 Seeding Tariki database (Casablanca dataset)...');

  const hash = await bcrypt.hash(DEMO_ADMIN_PASSWORD, 10);
  const userHash = await bcrypt.hash(DEMO_USER_PASSWORD, 10);
  await query(
    `INSERT INTO admins (email, password_hash, name)
     VALUES ($1, $2, $3)
     ON CONFLICT (email) DO UPDATE SET password_hash = EXCLUDED.password_hash, name = EXCLUDED.name`,
    [DEMO_ADMIN_EMAIL, hash, 'Administrateur Tariki']
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

  for (const road of ROAD_SEGMENTS) {
    await query(
      `INSERT INTO road_segments (id, name, coordinates, status, speed_kmh, congestion_level)
       VALUES ($1, $2, $3, $4, $5, $6)
       ON CONFLICT (id) DO UPDATE SET
         name = EXCLUDED.name,
         coordinates = EXCLUDED.coordinates,
         status = EXCLUDED.status,
         speed_kmh = EXCLUDED.speed_kmh,
         congestion_level = EXCLUDED.congestion_level`,
      [road.id, road.name, JSON.stringify(road.coordinates), road.status, road.speed_kmh, road.congestion_level]
    );
  }

  const existing = await query('SELECT COUNT(*) FROM incidents');
  if (parseInt(existing.rows[0].count, 10) === 0) {
    for (const inc of INCIDENTS) {
      await query(
        `INSERT INTO incidents (type, title, description, latitude, longitude, severity, road_segment_id)
         VALUES ($1, $2, $3, $4, $5, $6, $7)`,
        [inc.type, inc.title, inc.description, inc.latitude, inc.longitude, inc.severity, inc.road_segment_id]
      );
    }
  }

  const fluid = ROAD_SEGMENTS.filter((r) => r.status === 'fluid').length;
  const moderate = ROAD_SEGMENTS.filter((r) => r.status === 'moderate').length;
  const congested = ROAD_SEGMENTS.filter((r) => r.status === 'congested').length;
  const avgSpeed =
    ROAD_SEGMENTS.reduce((s, r) => s + r.speed_kmh, 0) / (ROAD_SEGMENTS.length || 1);

  await query(
    `INSERT INTO traffic_stats (fluid_count, moderate_count, congested_count, active_incidents, avg_speed_kmh)
     VALUES ($1, $2, $3, $4, $5)`,
    [fluid, moderate, congested, INCIDENTS.length, avgSpeed]
  );

  console.log(`✅ Seed completed — ${ROAD_SEGMENTS.length} segments Casablanca`);
  console.log('\n📋 Comptes démo (équipe) :');
  console.log(`   Admin    : ${DEMO_ADMIN_EMAIL} / ${DEMO_ADMIN_PASSWORD}`);
  console.log(`   Conducteur : ${DEMO_USER_EMAIL} / ${DEMO_USER_PASSWORD}`);
  console.log(`   Code admin : ${DEMO_ADMIN_ACCESS_CODE} (ADMIN_ACCESS_CODE dans backend/.env)`);
  console.log('   Connexion : http://localhost:5173/connexion\n');
  process.exit(0);
}

seed().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
