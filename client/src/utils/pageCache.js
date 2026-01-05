const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

export function getCached(key) {
  const raw = localStorage.getItem(key);
  if (!raw) return null;

  try {
    const parsed = JSON.parse(raw);
    if (Date.now() > parsed.expiresAt) {
      localStorage.removeItem(key);
      return null;
    }
    return parsed.data;
  } catch {
    return null;
  }
}

export function setCached(key, data) {
  localStorage.setItem(
    key,
    JSON.stringify({
      data,
      expiresAt: Date.now() + CACHE_TTL
    })
  );
}
