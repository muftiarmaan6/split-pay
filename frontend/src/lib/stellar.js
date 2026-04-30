/**
 * stellar.js — Centralized Stellar SDK + Soroban RPC configuration
 *
 * Single source of truth for all blockchain interactions.
 * No other file should instantiate Server objects directly.
 */
import * as StellarSdk from '@stellar/stellar-sdk';

// ─── Network Configuration ──────────────────────────────────────────────────
export const HORIZON_URL = 'https://horizon-testnet.stellar.org';
export const SOROBAN_URL = 'https://soroban-testnet.stellar.org';
export const NETWORK_PASSPHRASE = StellarSdk.Networks.TESTNET;
export const CONTRACT_ID = 'CDLZFC3SYJYDZT7K67VZ75HPJVIEUVNIXF47ZG2FB2RMQQVU2HHGCYSC';

// Native XLM SAC address on Stellar Testnet
export const XLM_SAC_ADDRESS = 'CDLZFC3SYJYDZT7K67VZ75HPJVIEUVNIXF47ZG2FB2RMQQVU2HHGCYSC';

// The SplitPay Soroban contract ID (Needs to be updated after deployment)
export const SPLIT_PAY_CONTRACT_ID = 'CC_PLACEHOLDER_SPLIT_PAY_ID';

// ─── Server Instances (singleton) ───────────────────────────────────────────
export const horizonServer = new StellarSdk.Horizon.Server(HORIZON_URL);
export const sorobanServer = new StellarSdk.rpc.Server(SOROBAN_URL);

// ─── Balance ────────────────────────────────────────────────────────────────
/**
 * Fetch the native XLM balance for a public key via Horizon.
 * @param {string} publicKey - Stellar public key
 * @returns {Promise<{balance: string, raw: string}>}
 */
export async function fetchNativeBalance(publicKey) {
  const account = await horizonServer.loadAccount(publicKey);
  const native = account.balances.find((b) => b.asset_type === 'native');
  if (!native) {
    return { balance: '0.0000000', raw: '0' };
  }
  return {
    balance: native.balance,
    raw: native.balance,
  };
}

// ─── Transaction Building ───────────────────────────────────────────────────
/**
 * Build a Soroban transaction to add an expense on-chain.
 * Calls the SplitPay contract's `add_expense` function.
 *
 * @param {string} payerKey    - The payer's public key (who originally paid)
 * @param {number} amountXLM   - Amount in XLM (will be converted to stroops)
 * @param {string} description - Description of the expense
 * @returns {Promise<Transaction>} Prepared (simulated) transaction
 */
export async function buildAddExpenseTx(payerKey, amountXLM, description) {
  const sourceAccount = await horizonServer.loadAccount(payerKey);
  const contract = new StellarSdk.Contract(SPLIT_PAY_CONTRACT_ID);

  const amountInStroops = Math.floor(amountXLM * 10_000_000).toString();

  const operation = contract.call(
    'add_expense',
    StellarSdk.nativeToScVal(0, { type: 'u64' }), // group_id
    StellarSdk.Address.fromString(payerKey).toScVal(),
    StellarSdk.nativeToScVal(amountInStroops, { type: 'i128' }),
    StellarSdk.nativeToScVal(description, { type: 'string' })
  );

  const fee = await horizonServer.fetchBaseFee();
  let transaction = new StellarSdk.TransactionBuilder(sourceAccount, {
    fee: fee.toString(),
    networkPassphrase: NETWORK_PASSPHRASE,
  })
    .addOperation(operation)
    .setTimeout(30)
    .build();

  // Simulate on Soroban RPC to prepare footprint + resource estimates
  transaction = await sorobanServer.prepareTransaction(transaction);
  return transaction;
}

/**
 * Build a Soroban transaction to settle an expense on-chain.
 * Calls the SplitPay contract's `settle_expense_onchain` function which
 * internally performs an inter-contract call to the SAC.
 *
 * @param {string} publicKey   - The debtor's public key (who is paying)
 * @param {number} expenseId   - The ID of the expense to settle
 * @returns {Promise<Transaction>} Prepared (simulated) transaction
 */
export async function buildSettlementTx(publicKey, expenseId) {
  const sourceAccount = await horizonServer.loadAccount(publicKey);
  const contract = new StellarSdk.Contract(SPLIT_PAY_CONTRACT_ID);

  const operation = contract.call(
    'settle_expense_onchain',
    StellarSdk.nativeToScVal(expenseId, { type: 'u64' }),
    StellarSdk.Address.fromString(publicKey).toScVal(),
    StellarSdk.Address.fromString(XLM_SAC_ADDRESS).toScVal()
  );

  const fee = await horizonServer.fetchBaseFee();
  let transaction = new StellarSdk.TransactionBuilder(sourceAccount, {
    fee: fee.toString(),
    networkPassphrase: NETWORK_PASSPHRASE,
  })
    .addOperation(operation)
    .setTimeout(30)
    .build();

  // Simulate on Soroban RPC to prepare footprint + resource estimates
  transaction = await sorobanServer.prepareTransaction(transaction);
  return transaction;
}

/**
 * Submit a signed transaction XDR to Soroban RPC.
 * @param {string} signedXdr - Signed transaction XDR string
 * @returns {Promise<{hash: string, status: string}>}
 */
export async function submitSignedTx(signedXdr) {
  const signedTx = StellarSdk.TransactionBuilder.fromXDR(
    signedXdr,
    NETWORK_PASSPHRASE
  );
  const response = await sorobanServer.sendTransaction(signedTx);

  if (response.status === 'ERROR') {
    throw new Error(
      `Transaction submission failed: ${response.errorResult?.toString() || 'Unknown error'}`
    );
  }

  return {
    hash: response.hash,
    status: response.status,
  };
}

// ─── Events ─────────────────────────────────────────────────────────────────
/**
 * Fetch contract events from Soroban RPC.
 * @param {string} contractId - Contract ID to filter events for
 * @param {number} [lookbackLedgers=200] - How many ledgers to look back
 * @returns {Promise<Array>} Parsed events
 */
export async function fetchContractEvents(contractId = CONTRACT_ID, lookbackLedgers = 200) {
  const ledger = await sorobanServer.getLatestLedger();
  const startLedger = Math.max(ledger.sequence - lookbackLedgers, 1);

  const { events: raw } = await sorobanServer.getEvents({
    startLedger,
    filters: [{ contractIds: [contractId] }],
  });

  if (!raw?.length) return [];

  return raw.map((e) => {
    let label = 'Event';
    let color = 'gray';

    try {
      const topics = (e.topic || []).map((t) => StellarSdk.scValToNative(t));
      if (topics[0] === 'expense' && topics[1] === 'settled') {
        label = 'Settled';
        color = 'green';
      } else if (topics[0] === 'expense' && topics[1] === 'added') {
        label = 'Added';
        color = 'blue';
      } else if (topics[0] === 'transfer') {
        label = 'Transfer';
        color = 'purple';
      }
    } catch {
      // Fallback to defaults
    }

    return {
      id: e.id,
      label,
      color,
      ledger: e.ledger,
      timestamp: new Date().toISOString(),
    };
  });
}

// ─── Friendbot ──────────────────────────────────────────────────────────────
/**
 * Fund a testnet account via Friendbot.
 * @param {string} publicKey
 * @returns {Promise<void>}
 */
export async function fundWithFriendbot(publicKey) {
  const response = await fetch(
    `https://friendbot.stellar.org?addr=${encodeURIComponent(publicKey)}`
  );
  if (!response.ok) {
    throw new Error('Failed to fund account via Friendbot');
  }
}
