import api from "./axios";

const CACHE_KEY = "subjects_cache";
const CACHE_TTL = 10 * 60 * 1000; // 10 minutes

export async function getSubjects() {
  const cached = localStorage.getItem(CACHE_KEY);

  if (cached) {
    try {
      const parsed = JSON.parse(cached);
      if (Date.now() < parsed.expiresAt) {
        return parsed.data;
      }
    } catch {
      localStorage.removeItem(CACHE_KEY);
    }
  }

  const res = await api.get("/schedule");

  localStorage.setItem(
    CACHE_KEY,
    JSON.stringify({
      data: res.data,
      expiresAt: Date.now() + CACHE_TTL
    })
  );

  return res.data;
}

export function clearSubjectsCache() {
  localStorage.removeItem(CACHE_KEY);
}
