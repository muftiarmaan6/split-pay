import { describe, it, expect, beforeEach } from 'vitest';

// Inline the cache functions for testing in jsdom environment
const store = {};

function setCache(key, value, ttlSeconds = 30) {
  store[key] = {
    value,
    expiresAt: Date.now() + ttlSeconds * 1000,
  };
}

function getCache(key) {
  const entry = store[key];
  if (!entry) return null;
  if (Date.now() > entry.expiresAt) {
    delete store[key];
    return null;
  }
  return entry.value;
}

describe('Cache Utility', () => {
  beforeEach(() => {
    // Clear cache store before each test
    Object.keys(store).forEach(k => delete store[k]);
  });

  it('stores and retrieves a cached value', () => {
    setCache('balance_G123', '10000.00', 30);
    expect(getCache('balance_G123')).toBe('10000.00');
  });

  it('returns null for an expired cache entry', () => {
    setCache('balance_G456', '500.00', -1); // already expired
    expect(getCache('balance_G456')).toBeNull();
  });

  it('returns null for a missing cache key', () => {
    expect(getCache('nonexistent_key')).toBeNull();
  });

  it('isolates different cache keys', () => {
    setCache('user_A', '100.00', 30);
    setCache('user_B', '200.00', 30);
    expect(getCache('user_A')).toBe('100.00');
    expect(getCache('user_B')).toBe('200.00');
  });
});
