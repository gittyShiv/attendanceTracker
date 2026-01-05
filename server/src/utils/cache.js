// Simple TTL cache (RAM only)
const cache = new Map();

function setCache(key, data, ttlMs) {
  cache.set(key, {
    data,
    expiresAt: Date.now() + ttlMs
  });
}

function getCache(key) {
  const entry = cache.get(key);
  if (!entry) return null;

  if (Date.now() > entry.expiresAt) {
    cache.delete(key);
    return null;
  }
  return entry.data;
}

function clearCache(key) {
  cache.delete(key);
}

module.exports = { setCache, getCache, clearCache };
