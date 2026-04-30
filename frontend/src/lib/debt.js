/**
 * debt.js — Debt Minimization Algorithm
 * 
 * Takes a list of raw debt obligations and computes a minimized
 * set of transactions to settle all balances.
 */
import { splitAmount } from './math';

/**
 * Minimizes the number of transactions required to settle a set of debts.
 * 
 * @param {Array<{from: string, to: string, amount: number}>} debts - List of current debts
 * @returns {Array<{from: string, to: string, amount: string}>} - Minimized list of transactions (amounts formatted to 7 decimals)
 */
export function minimizeDebts(debts) {
  if (!debts || debts.length === 0) return [];

  // 1. Compute net balances for each participant
  const balances = {};
  
  for (const debt of debts) {
    if (!balances[debt.from]) balances[debt.from] = 0;
    if (!balances[debt.to]) balances[debt.to] = 0;
    
    balances[debt.from] -= debt.amount;
    balances[debt.to] += debt.amount;
  }

  // 2. Separate into debtors and creditors
  const debtors = [];
  const creditors = [];

  for (const [person, balance] of Object.entries(balances)) {
    // Round to avoid tiny floating point leftovers
    const roundedBalance = Math.round(balance * 10000000) / 10000000;
    if (roundedBalance < 0) {
      debtors.push({ person, amount: -roundedBalance });
    } else if (roundedBalance > 0) {
      creditors.push({ person, amount: roundedBalance });
    }
  }

  // Sort by largest amounts first to minimize transaction count
  debtors.sort((a, b) => b.amount - a.amount);
  creditors.sort((a, b) => b.amount - a.amount);

  const transactions = [];
  let i = 0; // debtors index
  let j = 0; // creditors index

  // 3. Greedily match debtors and creditors
  while (i < debtors.length && j < creditors.length) {
    const debtor = debtors[i];
    const creditor = creditors[j];

    const minAmount = Math.min(debtor.amount, creditor.amount);

    // Format to 7 decimals for XLM precision
    const formattedAmount = minAmount.toFixed(7);
    
    // Only push if amount > 0
    if (parseFloat(formattedAmount) > 0) {
      transactions.push({
        from: debtor.person,
        to: creditor.person,
        amount: formattedAmount,
      });
    }

    debtor.amount -= minAmount;
    creditor.amount -= minAmount;

    // Move to next if settled (allowing tiny floating point tolerance)
    if (debtor.amount < 0.0000001) i++;
    if (creditor.amount < 0.0000001) j++;
  }

  return transactions;
}
