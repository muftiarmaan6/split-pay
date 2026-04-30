import { describe, it, expect } from 'vitest';
import { splitAmount, toStroops, fromStroops, formatXLM, truncateKey, isValidStellarAddress } from '../lib/math';

describe('splitAmount — Precision-Safe Split Logic', () => {
  it('splits a bill evenly among people', () => {
    expect(splitAmount(100, 4)).toBe('25.0000000');
  });

  it('returns null when total is 0', () => {
    expect(splitAmount(0, 4)).toBeNull();
  });

  it('returns null when people is 0', () => {
    expect(splitAmount(100, 0)).toBeNull();
  });

  it('handles non-terminating decimals using integer arithmetic', () => {
    // 10 / 3 = 3.3333333... but in stroops: floor(100000000 / 3) = 33333333 → 3.3333333
    expect(splitAmount(10, 3)).toBe('3.3333333');
  });

  it('returns null for negative people count', () => {
    expect(splitAmount(100, -1)).toBeNull();
  });

  it('returns null for negative amounts', () => {
    expect(splitAmount(-50, 2)).toBeNull();
  });

  it('handles string inputs correctly', () => {
    expect(splitAmount('100', '5')).toBe('20.0000000');
  });

  it('produces precision-safe results for small amounts', () => {
    // 0.0000001 XLM (1 stroop) ÷ 1 person = 1 stroop
    expect(splitAmount('0.0000001', 1)).toBe('0.0000001');
  });

  it('handles large amounts', () => {
    expect(splitAmount('1000000', 3)).toBe('333333.3333333');
  });
});

describe('toStroops / fromStroops — Conversion', () => {
  it('converts XLM to stroops correctly', () => {
    expect(toStroops(1)).toBe(10000000);
    expect(toStroops('10.5')).toBe(105000000);
  });

  it('converts stroops back to XLM string', () => {
    expect(fromStroops(10000000)).toBe('1.0000000');
    expect(fromStroops(33333333)).toBe('3.3333333');
  });

  it('round-trips correctly', () => {
    expect(fromStroops(toStroops('42.1234567'))).toBe('42.1234567');
  });
});

describe('formatXLM', () => {
  it('formats to 2 decimal places', () => {
    expect(formatXLM('10000.123456')).toBe('10000.12');
    expect(formatXLM('5')).toBe('5.00');
  });

  it('handles invalid input', () => {
    expect(formatXLM('notanumber')).toBe('0.00');
  });
});

describe('truncateKey', () => {
  it('truncates a long Stellar key', () => {
    const key = 'GBWX3AABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890ABCDEFGHIJK5678';
    expect(truncateKey(key)).toBe('GBWX…5678');
  });

  it('returns empty string for null', () => {
    expect(truncateKey(null)).toBe('');
    expect(truncateKey('')).toBe('');
  });

  it('returns short keys unchanged', () => {
    expect(truncateKey('GABC')).toBe('GABC');
  });
});

describe('isValidStellarAddress', () => {
  it('validates a correct address', () => {
    const validAddr = 'G' + 'A'.repeat(55);
    expect(isValidStellarAddress(validAddr)).toBe(true);
  });

  it('rejects invalid addresses', () => {
    expect(isValidStellarAddress('not-an-address')).toBe(false);
    expect(isValidStellarAddress('')).toBe(false);
    expect(isValidStellarAddress(null)).toBe(false);
  });
});
