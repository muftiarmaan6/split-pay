import { describe, it, expect } from 'vitest';

// Pure split logic function (extracted from ExpensePanel.jsx)
function calcShare(total, people) {
  const t = parseFloat(total);
  const p = parseInt(people, 10);
  if (!t || !p || p < 1) return null;
  return parseFloat((t / p).toFixed(7));
}

describe('calcShare — Split Logic', () => {
  it('splits a bill evenly among people', () => {
    expect(calcShare(100, 4)).toBe(25);
  });

  it('returns null when total amount is 0', () => {
    expect(calcShare(0, 4)).toBeNull();
  });

  it('returns null when number of people is 0', () => {
    expect(calcShare(100, 0)).toBeNull();
  });

  it('handles decimal amounts correctly', () => {
    expect(calcShare(10, 3)).toBe(3.3333333);
  });

  it('returns null for negative people count', () => {
    expect(calcShare(100, -1)).toBeNull();
  });
});
