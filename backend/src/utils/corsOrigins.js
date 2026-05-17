/**
 * CORS pour dev local + déploiement Vercel (tous sous-domaines *.vercel.app).
 * CORS_ORIGIN : URLs séparées par des virgules (ex. https://mon-site.vercel.app)
 * CORS_ALLOW_VERCEL : "true" par défaut en production Render
 */

function parseList() {
  return (process.env.CORS_ORIGIN || 'http://localhost:5173')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);
}

export function isOriginAllowed(origin) {
  if (!origin) return true;

  const list = parseList();
  if (list.includes('*')) return true;
  if (list.includes(origin)) return true;

  const allowVercel =
    process.env.CORS_ALLOW_VERCEL === 'true' ||
    (process.env.CORS_ALLOW_VERCEL !== 'false' && process.env.NODE_ENV === 'production');

  if (allowVercel && /^https:\/\/[a-z0-9][a-z0-9-]*\.vercel\.app$/i.test(origin)) {
    return true;
  }

  return false;
}

export function corsOriginCallback(origin, callback) {
  if (isOriginAllowed(origin)) {
    callback(null, true);
  } else {
    console.warn('[CORS] Origine refusée:', origin);
    callback(new Error('Not allowed by CORS'));
  }
}

export function getCorsOptions() {
  return {
    origin: corsOriginCallback,
    credentials: true,
  };
}
