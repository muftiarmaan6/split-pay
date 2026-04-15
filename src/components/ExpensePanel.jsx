import { useState } from 'react';
import * as StellarSdk from '@stellar/stellar-sdk';
import { signTransaction } from '@stellar/freighter-api';

const horizonUrl = "https://horizon-testnet.stellar.org";
const server = new StellarSdk.Horizon.Server(horizonUrl);
const networkPassphrase = StellarSdk.Networks.TESTNET;

export default function ExpensePanel({ publicKey }) {
  const [description, setDescription] = useState('');
  const [totalAmount, setTotalAmount] = useState('');
  const [numPeople, setNumPeople] = useState('');
  const [payer, setPayer] = useState('');
  const [expenses, setExpenses] = useState([]);

  const [isTxPending, setIsTxPending] = useState(false);
  const [txHash, setTxHash] = useState(null);
  const [txError, setTxError] = useState(null);

  // Calculate the share for the current user
  const calcShare = (total, people) => {
    const t = parseFloat(total);
    const p = parseInt(people, 10);
    if (!t || !p || p < 1) return null;
    return parseFloat((t / p).toFixed(7));
  };

  const previewShare = calcShare(totalAmount, numPeople);

  const handleAddExpense = (e) => {
    e.preventDefault();
    const share = calcShare(totalAmount, numPeople);
    if (!description || !share || !payer) return;
    if (payer === publicKey) {
      alert("You can't owe yourself — you are the payer!");
      return;
    }

    const newExpense = {
      id: Date.now(),
      description,
      totalAmount: parseFloat(totalAmount),
      numPeople: parseInt(numPeople, 10),
      yourShare: share,
      payer,
      settled: false,
    };

    setExpenses([...expenses, newExpense]);
    setDescription('');
    setTotalAmount('');
    setNumPeople('');
    setPayer('');
  };

  const handleSettle = async (expense) => {
    setIsTxPending(true);
    setTxHash(null);
    setTxError(null);

    try {
      // 1. Load source account
      const sourceAccount = await server.loadAccount(publicKey);

      // 2. Build transaction — send the user's share to the payer
      const fee = await server.fetchBaseFee();
      const transaction = new StellarSdk.TransactionBuilder(sourceAccount, {
        fee: fee.toString(),
        networkPassphrase,
      })
        .addOperation(
          StellarSdk.Operation.payment({
            destination: expense.payer,
            asset: StellarSdk.Asset.native(),
            amount: expense.yourShare.toFixed(7),
          })
        )
        .setTimeout(30)
        .build();

      // 3. Sign with Freighter
      const { signedTxXdr, error: signError } = await signTransaction(
        transaction.toXDR(),
        { networkPassphrase }
      );
      if (signError) throw new Error(signError.message || 'Signing rejected');
      const signedTx = StellarSdk.TransactionBuilder.fromXDR(signedTxXdr, networkPassphrase);

      // 4. Submit to Horizon
      const response = await server.submitTransaction(signedTx);
      setTxHash(response.hash);

      // 5. Mark as settled
      setExpenses(expenses.map((ex) =>
        ex.id === expense.id ? { ...ex, settled: true } : ex
      ));
    } catch (err) {
      console.error(err);
      setTxError('Transaction failed or was rejected.');
    }

    setIsTxPending(false);
  };

  return (
    <div
      className="w-full max-w-2xl mx-auto mt-8 space-y-6 animate-fade-in-up"
      style={{ animationDelay: '200ms', animationFillMode: 'both' }}
    >
      {/* ── Add Expense Form ── */}
      <div className="bg-card rounded-2xl border border-gray-900 shadow-[0_0_20px_rgba(168,85,247,0.1)] p-6">
        <h3 className="text-xl font-bold mb-1">Split a Bill</h3>
        <p className="text-textMuted text-sm mb-5">
          Someone already paid the full bill. Enter the details below and we'll
          calculate your share.
        </p>

        <form onSubmit={handleAddExpense} className="space-y-4">
          {/* Description */}
          <div>
            <label className="block text-xs font-medium text-textMuted mb-1">
              What was it for?
            </label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Dinner, Taxi, Hotel, etc."
              className="w-full bg-black border border-gray-800 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-primary transition-colors"
            />
          </div>

          {/* Total amount + number of people */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-textMuted mb-1">
                Total Bill Amount (XLM)
              </label>
              <input
                type="number"
                step="0.0000001"
                min="0"
                value={totalAmount}
                onChange={(e) => setTotalAmount(e.target.value)}
                placeholder="0.00"
                className="w-full bg-black border border-gray-800 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-primary transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-textMuted mb-1">
                Number of People
              </label>
              <input
                type="number"
                min="2"
                step="1"
                value={numPeople}
                onChange={(e) => setNumPeople(e.target.value)}
                placeholder="e.g. 4"
                className="w-full bg-black border border-gray-800 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-primary transition-colors"
              />
            </div>
          </div>

          {/* Live share preview */}
          {previewShare !== null && (
            <div className="flex items-center gap-3 bg-primary/10 border border-primary/20 rounded-xl px-4 py-3">
              <svg className="w-5 h-5 text-primary flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8"
                  d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 11h.01M12 11h.01M15 11h.01M4 19h16a2 2 0 002-2V7a2 2 0 00-2-2H4a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <span className="text-sm text-textMuted">Your share:</span>
              <span className="text-lg font-extrabold text-primary">{previewShare} XLM</span>
              <span className="text-xs text-textMuted ml-auto">
                ({totalAmount} ÷ {numPeople})
              </span>
            </div>
          )}

          {/* Payer's wallet address */}
          <div>
            <label className="block text-xs font-medium text-textMuted mb-1">
              Who paid? (Their Stellar Public Key)
            </label>
            <input
              type="text"
              value={payer}
              onChange={(e) => setPayer(e.target.value)}
              placeholder="G..."
              className="w-full bg-black border border-gray-800 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-primary transition-colors font-mono text-sm"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-primary hover:bg-secondary text-white font-medium py-3 rounded-lg transition-colors shadow-primary/30 shadow-lg mt-2"
          >
            Add to My Debts
          </button>
        </form>
      </div>

      {/* ── Transaction Feedback ── */}
      {(txHash || txError) && (
        <div
          className={`p-4 rounded-xl border ${
            txHash
              ? 'bg-green-900/20 border-green-500/30 text-green-300'
              : 'bg-red-900/20 border-red-500/30 text-red-300'
          }`}
        >
          <div className="flex items-center gap-2 mb-1">
            {txHash ? (
              <svg className="w-5 h-5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            ) : (
              <svg className="w-5 h-5 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            )}
            <span className="font-semibold">
              {txHash ? 'Payment Sent!' : 'Transaction Failed'}
            </span>
          </div>
          {txHash && (
            <a
              href={`https://stellar.expert/explorer/testnet/tx/${txHash}`}
              target="_blank"
              rel="noreferrer"
              className="text-xs truncate block hover:underline opacity-80 pl-7"
            >
              Tx Hash: {txHash}
            </a>
          )}
          {txError && <p className="text-xs pl-7 opacity-80">{txError}</p>}
        </div>
      )}

      {/* ── Pending Debts List ── */}
      {expenses.length > 0 && (
        <div className="bg-card rounded-2xl border border-gray-900 shadow-[0_0_20px_rgba(168,85,247,0.1)] overflow-hidden">
          <div className="p-6 border-b border-gray-900 flex items-center justify-between">
            <h3 className="text-xl font-bold">My Debts</h3>
            <span className="text-xs text-textMuted">
              {expenses.filter((e) => !e.settled).length} pending
            </span>
          </div>

          <div className="divide-y divide-gray-900">
            {expenses.map((expense) => (
              <div
                key={expense.id}
                className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-black/40"
              >
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-white">{expense.description}</h4>

                  {/* Bill breakdown */}
                  <p className="text-xs text-textMuted mt-1">
                    Total bill:{' '}
                    <span className="text-white font-medium">{expense.totalAmount} XLM</span>
                    {' '}÷{' '}
                    <span className="text-white font-medium">{expense.numPeople} people</span>
                  </p>

                  {/* Payer */}
                  <p className="text-xs text-textMuted font-mono truncate mt-0.5">
                    Pay to: {expense.payer.slice(0, 6)}...{expense.payer.slice(-4)}
                  </p>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto shrink-0">
                  <div className="text-right">
                    <span className="block text-xs text-textMuted mb-0.5">Your share</span>
                    <span className="block text-lg font-extrabold text-primary">
                      {expense.yourShare} XLM
                    </span>
                  </div>

                  {expense.settled ? (
                    <span className="px-4 py-2 rounded-lg bg-green-900/30 text-green-400 text-sm font-semibold border border-green-800/50">
                      Settled ✓
                    </span>
                  ) : (
                    <button
                      onClick={() => handleSettle(expense)}
                      disabled={isTxPending}
                      className="px-5 py-2 rounded-lg bg-white text-black font-semibold hover:bg-gray-200 transition-colors disabled:opacity-50 text-sm"
                    >
                      {isTxPending ? 'Signing…' : 'Settle'}
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
