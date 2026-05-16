/** Chemin du portail admin (non exposé dans l’UI publique). Ex. /tariki-ops */
export const ADMIN_BASE = (import.meta.env.VITE_ADMIN_BASE || '/admin').replace(/\/$/, '') || '/admin';

export function adminPath(segment = '') {
  const base = ADMIN_BASE.startsWith('/') ? ADMIN_BASE : `/${ADMIN_BASE}`;
  if (!segment) return base;
  return `${base}/${segment.replace(/^\//, '')}`;
}

export const LOGIN_PATH = adminPath('login');
