import { describe, it, expect } from 'vitest';
import { splitAmount } from '../lib/math';

// Tests that validate the split logic used in ExpensePanel
describe('splitAmount — Split Logic (ExpensePanel)', () => {
  it('splits a bill evenly among people', () => {
    expect(splitAmount(100, 4)).toBe('25.0000000');
  });

  it('returns null when total amount is 0', () => {
    expect(splitAmount(0, 4)).toBeNull();
  });

  it('returns null when number of people is 0', () => {
    expect(splitAmount(100, 0)).toBeNull();
  });

  it('handles decimal amounts correctly with precision', () => {
    expect(splitAmount(10, 3)).toBe('3.3333333');
  });

  it('returns null for negative people count', () => {
    expect(splitAmount(100, -1)).toBeNull();
  });

  it('handles string inputs', () => {
    expect(splitAmount('200', '4')).toBe('50.0000000');
  });
});
