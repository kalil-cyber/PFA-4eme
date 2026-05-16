import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import {
  DEMO_ADMIN_EMAIL,
  DEMO_ADMIN_PASSWORD,
  DEMO_USER_EMAIL,
  DEMO_USER_PASSWORD,
} from '../config/demoCredentials.js';
import { ROAD_SEGMENTS } from './roads.js';
import { initAllSegmentHistories } from './simulatedHistory.js';

export const store = {
  admins: [],
  users: [],
  roads: ROAD_SEGMENTS.map((r) => ({
    ...r,
    updated_at: new Date().toISOString(),
  })),
  incidents: [],
  logs: [],
  stats: [],
  segmentHistories: {},
};

export async function initMemoryStore() {
  const hash = await bcrypt.hash(DEMO_ADMIN_PASSWORD, 10);
  const demoUserHash = await bcrypt.hash(DEMO_USER_PASSWORD, 10);
  const adminId = uuidv4();
  store.admins = [
    {
      id: adminId,
      email: DEMO_ADMIN_EMAIL,
      password_hash: hash,
      name: 'Kalil (admin)',
    },
  ];
  store.users = [
    {
      id: adminId,
      email: DEMO_ADMIN_EMAIL,
      password_hash: hash,
      name: 'Kalil (admin)',
      role: 'admin',
      created_at: new Date().toISOString(),
    },
    {
      id: uuidv4(),
      email: DEMO_USER_EMAIL,
      password_hash: demoUserHash,
      name: 'KPL (conducteur)',
      role: 'user',
      created_at: new Date().toISOString(),
    },
  ];

  const r0 = store.roads[0];
  const r1 = store.roads[1] || store.roads[0];
  const mid0 = r0?.coordinates?.[1] || [-7.5898, 33.5731];
  const mid1 = r1?.coordinates?.[1] || mid0;

  store.incidents = [
    {
      id: uuidv4(),
      type: 'accident',
      title: `Collision — ${r0?.name || 'Casablanca'}`,
      description: 'Deux véhicules impliqués, circulation ralentie',
      latitude: mid0[1],
      longitude: mid0[0],
      severity: 'high',
      status: 'active',
      road_segment_id: r0?.id,
      created_at: new Date().toISOString(),
      resolved_at: null,
    },
    {
      id: uuidv4(),
      type: 'jam',
      title: `Embouteillage — ${r1?.name || 'Casablanca'}`,
      description: 'Pic de trafic — données Waze',
      latitude: mid1[1],
      longitude: mid1[0],
      severity: 'medium',
      status: 'active',
      road_segment_id: r1?.id,
      created_at: new Date().toISOString(),
      resolved_at: null,
    },
  ];

  store.segmentHistories = initAllSegmentHistories(store.roads);

  for (let i = 23; i >= 0; i--) {
    const t = new Date(Date.now() - i * 5 * 60 * 1000);
    store.stats.push({
      fluid_count: 2 + (i % 3),
      moderate_count: 2 + (i % 2),
      congested_count: 1 + (i % 2),
      active_incidents: 2,
      avg_speed_kmh: 35 + (i % 15),
      recorded_at: t.toISOString(),
    });
  }
}

export function useMemory() {
  return process.env.USE_MEMORY === 'true';
}

export function replaceRoadsInMemory(roads) {
  store.roads = roads.map((r) => ({
    ...r,
    coordinates:
      typeof r.coordinates === 'string' ? JSON.parse(r.coordinates) : r.coordinates,
    updated_at: new Date().toISOString(),
  }));
  store.segmentHistories = initAllSegmentHistories(store.roads);
}

function sortRoads(list) {
  return [...list].sort((a, b) => a.name.localeCompare(b.name));
}

function sortIncidents(list) {
  return [...list].sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
}

function aggregateStats() {
  const fluid = store.roads.filter((r) => r.status === 'fluid').length;
  const moderate = store.roads.filter((r) => r.status === 'moderate').length;
  const congested = store.roads.filter((r) => r.status === 'congested').length;
  const avg =
    store.roads.reduce((s, r) => s + r.speed_kmh, 0) / (store.roads.length || 1);
  const avgCong =
    store.roads.reduce((s, r) => s + r.congestion_level, 0) / (store.roads.length || 1);
  return {
    fluid: String(fluid),
    moderate: String(moderate),
    congested: String(congested),
    avg_speed: String(avg),
    avg_congestion: String(avgCong),
  };
}

export const memory = {
  query: async (text, params = []) => {
    const sql = text.replace(/\s+/g, ' ').trim().toLowerCase();

    if (sql === 'select 1' || sql.startsWith('select 1')) {
      return { rows: [{ '?column?': 1 }] };
    }

    if (sql.includes('from admins where email')) {
      return { rows: store.admins.filter((a) => a.email === params[0]) };
    }

    if (sql.includes('from users where email')) {
      return { rows: store.users.filter((u) => u.email === params[0]) };
    }

    if (sql.includes('insert into users')) {
      const email = params[1];
      const existingIdx = store.users.findIndex((u) => u.email === email);
      const user = {
        id: existingIdx >= 0 ? store.users[existingIdx].id : params[0],
        email,
        password_hash: params[2],
        name: params[3],
        role: params[4],
        created_at: store.users[existingIdx]?.created_at || new Date().toISOString(),
      };
      if (existingIdx >= 0) store.users[existingIdx] = user;
      else store.users.push(user);
      return { rows: [user] };
    }

    if (sql.includes('insert into admins')) {
      const email = params[0];
      const existingIdx = store.admins.findIndex((a) => a.email === email);
      const admin = {
        id: existingIdx >= 0 ? store.admins[existingIdx].id : uuidv4(),
        email,
        password_hash: params[1],
        name: params[2],
      };
      if (existingIdx >= 0) store.admins[existingIdx] = admin;
      else store.admins.push(admin);
      return { rows: [admin] };
    }

    if (sql.includes('insert into road_segments')) {
      const road = {
        id: params[0],
        name: params[1],
        coordinates:
          typeof params[2] === 'string' ? JSON.parse(params[2]) : params[2],
        status: params[3],
        speed_kmh: params[4],
        congestion_level: params[5],
        updated_at: new Date().toISOString(),
      };
      const idx = store.roads.findIndex((r) => r.id === road.id);
      if (idx >= 0) store.roads[idx] = road;
      else store.roads.push(road);
      return { rows: [road] };
    }

    if (sql.includes('select id, congestion_level from road_segments')) {
      return { rows: store.roads.map((r) => ({ id: r.id, congestion_level: r.congestion_level })) };
    }

    if (sql.includes('filter (where status') || sql.includes('count(*) filter')) {
      return { rows: [aggregateStats()] };
    }

    if (sql.includes('from road_segments')) {
      if (sql.includes('count(*)')) {
        return { rows: [{ count: String(store.roads.length) }] };
      }
      if (sql.includes('where id =')) {
        return { rows: store.roads.filter((r) => r.id === params[0]) };
      }
      let list = [...store.roads];
      if (sql.includes('order by congestion_level desc')) {
        list.sort((a, b) => b.congestion_level - a.congestion_level);
      } else if (sql.includes('order by name')) {
        list = sortRoads(list);
      }
      return { rows: list };
    }

    if (sql.includes('update road_segments set')) {
      const id = params[3];
      const idx = store.roads.findIndex((r) => r.id === id);
      if (idx >= 0) {
        store.roads[idx] = {
          ...store.roads[idx],
          congestion_level: params[0],
          status: params[1],
          speed_kmh: params[2],
          updated_at: new Date().toISOString(),
        };
      }
      return { rows: [] };
    }

    if (sql.includes('from incidents')) {
      let list = [...store.incidents];

      if (sql.includes("where status = 'active'")) {
        list = list.filter((i) => i.status === 'active');
      } else if (sql.includes('where status = $1')) {
        list = list.filter((i) => i.status === params[0]);
      } else if (sql.includes('where id = $1')) {
        return { rows: list.filter((i) => i.id === params[0]) };
      }

      if (sql.includes('count(*)')) {
        return { rows: [{ count: String(list.length) }] };
      }

      return { rows: sortIncidents(list) };
    }

    if (sql.includes('insert into incidents')) {
      const inc = {
        id: uuidv4(),
        type: params[0],
        title: params[1],
        description: params[2],
        latitude: params[3],
        longitude: params[4],
        severity: params[5],
        status: 'active',
        road_segment_id: params[6],
        created_at: new Date().toISOString(),
        resolved_at: null,
      };
      store.incidents.unshift(inc);
      return { rows: [inc] };
    }

    if (sql.includes('update incidents set')) {
      const id = params[params.length - 1];
      const idx = store.incidents.findIndex((i) => i.id === id);
      if (idx < 0) return { rows: [] };

      const inc = { ...store.incidents[idx] };

      if (params.length === 2 && sql.includes('status = $1')) {
        inc.status = params[0];
        if (params[0] === 'resolved') inc.resolved_at = new Date().toISOString();
      } else {
        let pi = 0;
        if (sql.includes('status =')) {
          inc.status = params[pi++];
          if (inc.status === 'resolved') inc.resolved_at = new Date().toISOString();
        }
        if (sql.includes('title =')) inc.title = params[pi++];
        if (sql.includes('description =')) inc.description = params[pi++];
        if (sql.includes('severity =')) inc.severity = params[pi++];
      }

      store.incidents[idx] = inc;
      return { rows: [inc] };
    }

    if (sql.includes('delete from incidents')) {
      const removed = store.incidents.find((i) => i.id === params[0]);
      store.incidents = store.incidents.filter((i) => i.id !== params[0]);
      return { rows: removed ? [removed] : [] };
    }

    if (sql.includes('insert into system_logs')) {
      const log = {
        id: uuidv4(),
        level: params[0],
        source: params[1],
        message: params[2],
        metadata: params[3],
        created_at: new Date().toISOString(),
      };
      store.logs.unshift(log);
      if (store.logs.length > 500) store.logs.length = 500;
      return { rows: [log] };
    }

    if (sql.includes('from system_logs')) {
      let logs = [...store.logs];
      if (sql.includes('where level = $1')) {
        logs = logs.filter((l) => l.level === params[0]);
        const limit = params[1] || 50;
        return { rows: logs.slice(0, limit) };
      }
      const limit = params[params.length - 1] || 50;
      return { rows: logs.slice(0, limit) };
    }

    if (sql.includes('insert into traffic_stats')) {
      const stat = {
        fluid_count: Number(params[0]) || 0,
        moderate_count: Number(params[1]) || 0,
        congested_count: Number(params[2]) || 0,
        active_incidents: Number(params[3]) || 0,
        avg_speed_kmh: Number(params[4]) || 0,
        recorded_at: new Date().toISOString(),
      };
      store.stats.push(stat);
      if (store.stats.length > 48) store.stats.shift();
      return { rows: [stat] };
    }

    if (sql.includes('from traffic_stats')) {
      const limit = sql.includes('limit 24') ? 24 : store.stats.length;
      return { rows: store.stats.slice(-limit) };
    }

    return { rows: [] };
  },
};
