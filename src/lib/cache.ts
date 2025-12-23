const cache = new Map<string, unknown>();

export function getCache<T>(key: string): T | null {
  const cached = cache.get(key);
  if (cached) {
    return cached as T;
  }
  return null;
}

export function setCache<T>(key: string, data: T) {
  cache.set(key, data);
}
