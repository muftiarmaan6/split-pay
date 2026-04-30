import { describe, it, expect } from 'vitest';
import { minimizeDebts } from '../lib/debt';

describe('minimizeDebts - Debt Minimization Algorithm', () => {
  it('returns empty array for empty input', () => {
    expect(minimizeDebts([])).toEqual([]);
  });

  it('simplifies a circular debt path (A -> B -> C -> A)', () => {
    const debts = [
      { from: 'A', to: 'B', amount: 10 },
      { from: 'B', to: 'C', amount: 10 },
      { from: 'C', to: 'A', amount: 10 },
    ];
    // Net balances are 0 for everyone, so 0 transactions needed
    expect(minimizeDebts(debts)).toEqual([]);
  });

  it('simplifies a linear debt path (A -> B -> C)', () => {
    const debts = [
      { from: 'A', to: 'B', amount: 10 },
      { from: 'B', to: 'C', amount: 10 },
    ];
    // B is net 0. A owes C 10.
    const result = minimizeDebts(debts);
    expect(result).toHaveLength(1);
    expect(result[0]).toEqual({ from: 'A', to: 'C', amount: '10.0000000' });
  });

  it('minimizes a complex group scenario', () => {
    const debts = [
      { from: 'Alice', to: 'Bob', amount: 20 },
      { from: 'Bob', to: 'Charlie', amount: 30 },
      { from: 'Charlie', to: 'Alice', amount: 10 },
      { from: 'Dave', to: 'Charlie', amount: 15 },
    ];
    // Balances:
    // Alice: -20 + 10 = -10 (owes 10)
    // Bob: +20 - 30 = -10 (owes 10)
    // Charlie: +30 - 10 + 15 = +35 (owed 35)
    // Dave: -15 (owes 15)
    // Debtors: Dave(15), Alice(10), Bob(10)
    // Creditor: Charlie(35)
    // Minimized should be 3 transactions directly to Charlie.

    const result = minimizeDebts(debts);
    expect(result).toHaveLength(3);
    
    // Sort results to ensure deterministic matching in assertions
    const sortedResult = result.sort((a, b) => b.amount.localeCompare(a.amount));
    
    expect(sortedResult).toEqual([
      { from: 'Dave', to: 'Charlie', amount: '15.0000000' },
      { from: 'Alice', to: 'Charlie', amount: '10.0000000' },
      { from: 'Bob', to: 'Charlie', amount: '10.0000000' },
    ]);
  });

  it('handles precision correctly for decimal XLM amounts', () => {
    const debts = [
      { from: 'User1', to: 'User2', amount: 33.3333333 },
      { from: 'User2', to: 'User3', amount: 33.3333333 },
    ];
    const result = minimizeDebts(debts);
    expect(result).toHaveLength(1);
    expect(result[0]).toEqual({ from: 'User1', to: 'User3', amount: '33.3333333' });
  });
});
