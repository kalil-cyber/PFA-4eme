/** Migration douce odevia → tariki (évite déconnexions après rebrand) */
const MIGRATIONS = [
  ['odevia_token', 'tariki_token'],
  ['odevia_user', 'tariki_user'],
  ['odevia_theme', 'tariki_theme'],
];

export function migrateLegacyStorage() {
  try {
    for (const [oldKey, newKey] of MIGRATIONS) {
      const val = localStorage.getItem(oldKey);
      if (val && !localStorage.getItem(newKey)) {
        localStorage.setItem(newKey, val);
      }
    }
  } catch {
    // quota / private mode
  }
}

export function safeJsonParse(str, fallback = null) {
  try {
    return JSON.parse(str);
  } catch {
    return fallback;
  }
}
