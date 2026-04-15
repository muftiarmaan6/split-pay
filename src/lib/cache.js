// Simple localStorage-based cache with TTL (time-to-live)

/**
 * Store a value in the cache with a TTL in seconds.
 * @param {string} key
 * @param {*} value
 * @param {number} ttlSeconds
 */
export function setCache(key, value, ttlSeconds = 30) {
  const entry = {
    value,
    expiresAt: Date.now() + ttlSeconds * 1000,
  };
  try {
    localStorage.setItem(`splitpay_cache_${key}`, JSON.stringify(entry));
  } catch {
    // localStorage may be unavailable (private browsing, full storage, etc.)
  }
}

/**
 * Retrieve a cached value. Returns null if missing or expired.
 * @param {string} key
 * @returns {*|null}
 */
export function getCache(key) {
  try {
    const raw = localStorage.getItem(`splitpay_cache_${key}`);
    if (!raw) return null;
    const entry = JSON.parse(raw);
    if (Date.now() > entry.expiresAt) {
      localStorage.removeItem(`splitpay_cache_${key}`);
      return null;
    }
    return entry.value;
  } catch {
    return null;
  }
}

/**
 * Clear all SplitPay cache entries.
 */
export function clearCache() {
  try {
    const keys = Object.keys(localStorage).filter(k => k.startsWith('splitpay_cache_'));
    keys.forEach(k => localStorage.removeItem(k));
  } catch {
    // ignore
  }
}
