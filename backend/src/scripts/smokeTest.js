/**
 * Test rapide des endpoints critiques Kalil Protein — node src/scripts/smokeTest.js
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
  console.log('Smoke test Kalil Protein API\n');

  const health = await req('GET', '/api/health');
  console.log(health.ok ? 'OK' : 'KO', 'GET /api/health', health.data.service);

  const products = await req('GET', '/api/products');
  console.log(products.ok ? 'OK' : 'KO', 'GET /api/products', `(${products.data?.products?.length ?? 0} produits)`);

  const newsletter = await req('POST', '/api/newsletter', { email: 'client@example.com' });
  console.log(newsletter.ok ? 'OK' : 'KO', 'POST /api/newsletter');

  const order = await req('POST', '/api/orders', {
    customer: {
      name: 'Client Test',
      phone: '0600000000',
      city: 'Casablanca',
      address: 'Maarif',
    },
    items: [{ productId: 'kp-whey-vanilla', quantity: 1 }],
  });
  console.log(order.ok ? 'OK' : 'KO', 'POST /api/orders', order.data?.order?.reference || '');

  const failed = [health, products, newsletter, order].filter((r) => !r.ok);
  console.log(failed.length ? `\n${failed.length} echec(s)` : '\nTous les tests OK');
  process.exit(failed.length ? 1 : 0);
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
