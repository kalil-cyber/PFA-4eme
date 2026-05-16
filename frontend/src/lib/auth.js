const TOKEN_KEY = 'tariki_token';
const USER_KEY = 'tariki_user';

export function getToken() {
  return localStorage.getItem(TOKEN_KEY) || localStorage.getItem('odevia_token');
}

export function getStoredUser() {
  try {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function decodeJwtPayload(token) {
  try {
    const part = token.split('.')[1];
    if (!part) return null;
    const json = atob(part.replace(/-/g, '+').replace(/_/g, '/'));
    return JSON.parse(json);
  } catch {
    return null;
  }
}

export function isTokenValid(token = getToken()) {
  if (!token) return false;
  const payload = decodeJwtPayload(token);
  if (!payload?.exp) return false;
  return payload.exp * 1000 > Date.now() + 5000;
}

export function isAdminSession(token = getToken()) {
  if (!isTokenValid(token)) return false;
  const payload = decodeJwtPayload(token);
  if (payload?.role === 'admin') return true;
  return getStoredUser()?.role === 'admin';
}

export function getSessionRole(token = getToken()) {
  const payload = decodeJwtPayload(token);
  return payload?.role || getStoredUser()?.role || null;
}

export function setSession(token, user) {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

export function clearSession() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
  localStorage.removeItem('odevia_token');
}

export function postLoginPath(role) {
  if (role === 'admin') {
    const base = import.meta.env.VITE_ADMIN_BASE || '/admin';
    return base.startsWith('/') ? base : `/${base}`;
  }
  return '/driver';
}
