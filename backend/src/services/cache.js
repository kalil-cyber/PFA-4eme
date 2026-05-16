const store = new Map();

export function getCached(key, ttlMs) {
  const entry = store.get(key);
  if (!entry) return null;
  if (Date.now() - entry.at > ttlMs) {
    store.delete(key);
    return null;
  }
  return entry.value;
}

export function setCached(key, value) {
  store.set(key, { at: Date.now(), value });
}
