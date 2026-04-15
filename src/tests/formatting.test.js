import { describe, it, expect } from 'vitest';

// Utility functions used in the app
function formatKey(key) {
  if (!key) return '';
  if (key.length <= 9) return key;
  return `${key.slice(0, 5)}...${key.slice(-4)}`;
}

function formatBalance(balance) {
  const num = parseFloat(balance);
  if (isNaN(num)) return '0.00';
  return num.toFixed(2);
}

function isValidStellarAddress(address) {
  return typeof address === 'string' && address.startsWith('G') && address.length === 56;
}

describe('Formatting Utilities', () => {
  it('truncates a long Stellar public key', () => {
    const key = 'GBWX3AABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890ABCDEFGHIJK5678';
    expect(formatKey(key)).toBe('GBWX3...5678');
  });

  it('returns empty string for null/undefined key', () => {
    expect(formatKey('')).toBe('');
    expect(formatKey(null)).toBe('');
  });

  it('returns full key if it is too short to truncate', () => {
    expect(formatKey('GABC')).toBe('GABC');
  });

  it('formats a balance to 2 decimal places', () => {
    expect(formatBalance('10000.123456')).toBe('10000.12');
    expect(formatBalance('5')).toBe('5.00');
  });

  it('handles invalid balance input gracefully', () => {
    expect(formatBalance('notanumber')).toBe('0.00');
  });

  it('validates a correct Stellar address', () => {
    const validAddr = 'G' + 'A'.repeat(55); // 56 chars starting with G
    expect(isValidStellarAddress(validAddr)).toBe(true);
  });

  it('rejects an invalid Stellar address', () => {
    expect(isValidStellarAddress('not-an-address')).toBe(false);
    expect(isValidStellarAddress('')).toBe(false);
  });
});
