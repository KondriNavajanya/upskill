const CACHE_TTL_MS = 60 * 1000;

const cache = new Map();

export const readCache = (key) => {
  const entry = cache.get(key);

  if (!entry) {
    return null;
  }

  if (Date.now() > entry.expiresAt) {
    cache.delete(key);
    return null;
  }

  return entry.data;
};

export const writeCache = (key, data, ttlMs = CACHE_TTL_MS) => {
  cache.set(key, {
    data,
    expiresAt: Date.now() + ttlMs
  });
};

export const clearProblemCache = () => {
  cache.clear();
};
