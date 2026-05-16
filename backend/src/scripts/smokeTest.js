/**
 * Test rapide des endpoints critiques — node src/scripts/smokeTest.js
 */
const BASE = process.env.API_URL || 'http://localhost:4000';

async function req(method, path, body, token) {
  const headers = { 'Content-Type': 'application/json' };
  if (token) headers.Authorization = `Bearer ${token}`;
  const res = await fetch(`${BASE}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });
  const data = await res.json().catch(() => ({}));
  return { ok: res.ok, status: res.status, data };
}

async function run() {
  console.log('🧪 Smoke test Tariki API\n');

  const health = await req('GET', '/api/health');
  console.log(health.ok ? '✅' : '❌', 'GET /api/health', health.data.mode, `(${health.data.road_segments} segments)`);

  const login = await req('POST', '/api/auth/login', {
    email: 'kalil@gmail.com',
    password: '0000',
    accessCode: '0000',
  });
  console.log(login.ok ? '✅' : '❌', 'POST /api/auth/login');
  const token = login.data.token;

  const roads = await req('GET', '/api/traffic/roads', null, token);
  console.log(roads.ok ? '✅' : '❌', 'GET /api/traffic/roads', `(${roads.data?.length ?? 0} routes)`);

  const insights = await req('GET', '/api/predictions/insights', null, token);
  console.log(insights.ok ? '✅' : '❌', 'GET /api/predictions/insights');

  const weather = await req('GET', '/api/discover/weather');
  console.log(weather.ok ? '✅' : '❌', 'GET /api/discover/weather');

  const chat = await req('POST', '/api/chat/message', { message: 'Où est la congestion ?' });
  console.log(chat.ok ? '✅' : '❌', 'POST /api/chat/message');

  const route = await req('POST', '/api/routes/optimize', {
    origin: { lat: 33.5731, lng: -7.5898 },
    destination: { lat: 33.595, lng: -7.62 },
  });
  console.log(route.ok ? '✅' : '❌', 'POST /api/routes/optimize');

  const failed = [health, login, roads, insights, weather, chat, route].filter((r) => !r.ok);
  console.log(failed.length ? `\n❌ ${failed.length} échec(s)` : '\n✅ Tous les tests OK');
  process.exit(failed.length ? 1 : 0);
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
