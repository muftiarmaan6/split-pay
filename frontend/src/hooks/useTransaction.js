/**
 * useTransaction — Strict state machine hook for transaction lifecycle
 *
 * States: IDLE → PREPARING → SIGNING → SUBMITTING → CONFIRMED | ERROR
 *
 * Uses stellar.js for building/submitting and wallet.js for signing.
 */
import { useState, useCallback } from 'react';
import { buildSettlementTx, buildAddExpenseTx, submitSignedTx } from '../lib/stellar';
import { signTransaction } from '../lib/wallet';

// Transaction state constants
export const TX_STATES = {
  IDLE: 'IDLE',
  PREPARING: 'PREPARING',
  SIGNING: 'SIGNING',
  SUBMITTING: 'SUBMITTING',
  CONFIRMED: 'CONFIRMED',
  ERROR: 'ERROR',
};

export default function useTransaction() {
  const [txState, setTxState] = useState(TX_STATES.IDLE);
  const [txHash, setTxHash] = useState(null);
  const [txError, setTxError] = useState(null);

  const _handleTransactionFlow = async (transactionPromise, walletId) => {
    setTxHash(null);
    setTxError(null);

    try {
      // ── Step 1: PREPARING ─────────────────────────────────────────
      setTxState(TX_STATES.PREPARING);
      const transaction = await transactionPromise;

      // ── Step 2: SIGNING ───────────────────────────────────────────
      setTxState(TX_STATES.SIGNING);
      const signedXdr = await signTransaction(
        transaction.toXDR(),
        walletId || 'freighter'
      );

      // ── Step 3: SUBMITTING ────────────────────────────────────────
      setTxState(TX_STATES.SUBMITTING);
      const result = await submitSignedTx(signedXdr);

      // ── Step 4: CONFIRMED ─────────────────────────────────────────
      setTxState(TX_STATES.CONFIRMED);
      setTxHash(result.hash);
      return result.hash;
    } catch (err) {
      setTxState(TX_STATES.ERROR);

      // Parse error for user-friendly messages
      let message;
      if (err.message?.includes('rejected') || err.message?.includes('cancelled')) {
        message = 'Transaction was rejected by the wallet.';
      } else if (err.message?.includes('insufficient')) {
        message = 'Insufficient XLM balance to complete this transaction.';
      } else if (err.response?.data?.extras) {
        message = `Network error: ${err.response.data.title || 'Transaction failed'}`;
      } else {
        message = err.message || 'Transaction failed. Please try again.';
      }

      setTxError(message);
      return null;
    }
  };

  /**
   * Execute the add_expense transaction lifecycle.
   */
  const executeAddExpense = useCallback(
    async (payerKey, amountXLM, description, walletId) => {
      return await _handleTransactionFlow(
        buildAddExpenseTx(payerKey, amountXLM, description),
        walletId
      );
    },
    []
  );

  /**
   * Execute the settle_expense_onchain transaction lifecycle.
   */
  const executeSettlement = useCallback(
    async (publicKey, expenseId, walletId) => {
      return await _handleTransactionFlow(
        buildSettlementTx(publicKey, expenseId),
        walletId
      );
    },
    []
  );

  /**
   * Reset the transaction state machine back to IDLE.
   */
  const reset = useCallback(() => {
    setTxState(TX_STATES.IDLE);
    setTxHash(null);
    setTxError(null);
  }, []);

  return {
    txState,
    txHash,
    txError,
    executeAddExpense,
    executeSettlement,
    reset,
    isPending:
      txState === TX_STATES.PREPARING ||
      txState === TX_STATES.SIGNING ||
      txState === TX_STATES.SUBMITTING,
  };
}
