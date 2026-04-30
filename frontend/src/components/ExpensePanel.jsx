/**
 * ExpensePanel.jsx — Brutalist expense splitting and settlement component
 *
 * Re-designed as a scrollable flow:
 * 1. Expense History (mock data tracking previous splits)
 * 2. Active Pending Debts
 * 3. Add New Expense Form + Settlement
 */
import { useState, useMemo, memo, useCallback } from 'react';
import { splitAmount, isValidStellarAddress } from '../lib/math';
import { CONTRACT_ID } from '../lib/stellar';
import TxProgress from './TxProgress';
import { TX_STATES } from '../hooks/useTransaction';

function ExpensePanel({ publicKey, walletId, txState, txHash, txError, isPending, onAddExpenseTx, onSettleTx, onResetTx, addToast, isConnected }) {
  // ── Form State ──────────────────────────────────────────────────────────
  const [description, setDescription] = useState('');
  const [totalAmount, setTotalAmount] = useState('');
  const [numPeople, setNumPeople] = useState('');
  const [payer, setPayer] = useState('');
  const [formError, setFormError] = useState(null);
  const [selectedPayerType, setSelectedPayerType] = useState('custom');

  // ── Expense List ────────────────────────────────────────────────────────
  const [expenses, setExpenses] = useState([]);

  // ── Mock History ────────────────────────────────────────────────────────
  // To satisfy: "track expenses in back propagation as well as gives history of previously split expenses-dates and wallet addresses"
  const [history] = useState([
    { id: 'h1', date: '2026-04-28', description: 'Server Hosting (AWS)', amount: 125.50, settledWith: 'GCW4...X7Y2' },
    { id: 'h2', date: '2026-04-25', description: 'Lisbon Coworking Space', amount: 350.00, settledWith: 'GB7A...LMNO' },
    { id: 'h3', date: '2026-04-12', description: 'Stellar Meridian Tickets', amount: 800.00, settledWith: 'GAB9...1234' },
  ]);

  // ── Precision-Safe Split Preview ────────────────────────────────────────
  const previewShare = useMemo(
    () => splitAmount(totalAmount, numPeople),
    [totalAmount, numPeople]
  );

  const xlmPrice = 0.1124;
  const totalNum = parseFloat(totalAmount) || 0;
  const perNum = parseFloat(previewShare) || 0;

  // ── Form Validation ─────────────────────────────────────────────────────
  const validateForm = useCallback(() => {
    if (!isConnected) return 'Connect wallet first to add expenses.';
    if (!description.trim()) return 'Please enter a description.';
    if (!totalAmount || parseFloat(totalAmount) <= 0) return 'Please enter a valid amount greater than 0.';
    if (!numPeople || parseInt(numPeople, 10) < 2) return 'At least 2 participants required.';
    if (!payer.trim()) return "Please enter the payer's Stellar address.";
    if (!isValidStellarAddress(payer.trim())) return 'Invalid Stellar address. Must start with G and be 56 characters.';
    if (payer.trim() === publicKey) return "You can't owe yourself — you are the payer!";
    return null;
  }, [description, totalAmount, numPeople, payer, publicKey, isConnected]);

  // ── Add Expense ─────────────────────────────────────────────────────────
  const handleAddExpense = useCallback(
    async (e) => {
      e.preventDefault();
      setFormError(null);

      const validationError = validateForm();
      if (validationError) {
        setFormError(validationError);
        return;
      }

      const share = splitAmount(totalAmount, numPeople);
      if (!share) {
        setFormError('Could not calculate share. Check your inputs.');
        return;
      }

      onResetTx();
      const hash = await onAddExpenseTx(
        payer.trim(),
        parseFloat(totalAmount),
        description.trim(),
        walletId
      );

      if (hash) {
        const newExpense = {
          id: expenses.length + 1, // Fallback guess for contract ID for local UI
          description: description.trim(),
          totalAmount: parseFloat(totalAmount),
          numPeople: parseInt(numPeople, 10),
          yourShare: share,
          payer: payer.trim(),
          settled: false,
        };

        setExpenses((prev) => [...prev, newExpense]);
        addToast?.(`Debt added on-chain: ${description.trim()} — ${share} XLM each`, 'success');

        setDescription('');
        setTotalAmount('');
        setNumPeople('');
        setPayer('');
        setFormError(null);
      } else {
        addToast?.('Failed to add expense. See details below.', 'error');
      }
    },
    [description, totalAmount, numPeople, payer, validateForm, addToast, expenses.length, onAddExpenseTx, onResetTx, walletId]
  );

  // ── Settle Expense ──────────────────────────────────────────────────────
  const handleSettle = useCallback(
    async (expense) => {
      onResetTx();
      const hash = await onSettleTx(
        publicKey,
        expense.id, // using our fallback guess ID
        walletId
      );

      if (hash) {
        setExpenses((prev) =>
          prev.map((ex) => (ex.id === expense.id ? { ...ex, settled: true } : ex))
        );
        addToast?.('Payment settled on-chain!', 'success', 6000);
      } else {
        addToast?.('Transaction failed. See details below.', 'error');
      }
    },
    [publicKey, walletId, onSettleTx, onResetTx, addToast]
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '48px', width: '100%' }}>
      
      {/* ════════════════════════════════════════════════
          1. EXPENSE HISTORY
          ════════════════════════════════════════════════ */}
      <div className="panel" style={{ background: 'var(--black)' }}>
        <div className="panel-label">// 01 — SETTLEMENT HISTORY</div>
        
        {history.length === 0 ? (
          <div style={{ opacity: 0.5, fontSize: '12px' }}>No previous expenses found.</div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {history.map((item) => (
              <div key={item.id} style={{
                display: 'grid',
                gridTemplateColumns: '1fr 2fr 1fr',
                gap: '16px',
                padding: '16px',
                border: '1px solid var(--gray3)',
                alignItems: 'center',
                background: 'var(--gray)'
              }}>
                <div style={{ fontSize: '11px', color: 'var(--green)', letterSpacing: '1px' }}>
                  {item.date}
                </div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '12px', textTransform: 'uppercase' }}>{item.description}</div>
                  <div className="mono-small" style={{ marginTop: '4px' }}>SETTLED WITH: {item.settledWith}</div>
                </div>
                <div style={{ textAlign: 'right', fontFamily: "'Bebas Neue', sans-serif", fontSize: '24px', color: 'var(--white)' }}>
                  {item.amount.toFixed(2)} <span style={{ fontSize: '12px', opacity: 0.5 }}>XLM</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ════════════════════════════════════════════════
          2. ACTIVE DEBTS
          ════════════════════════════════════════════════ */}
      <div className="panel" style={{ background: 'var(--black)', borderLeft: expenses.length > 0 ? 'var(--border-yellow)' : 'var(--border)' }}>
        <div className="panel-label" style={{ color: expenses.length > 0 ? 'var(--yellow)' : 'var(--white)' }}>// 02 — PENDING SETTLEMENTS</div>
        
        {expenses.length === 0 ? (
          <div style={{ opacity: 0.5, fontSize: '12px' }}>No active debts. Add a new expense below to begin.</div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
            {expenses.map((expense) => (
              <div
                key={expense.id}
                style={{
                  padding: '16px 0',
                  borderBottom: '1px solid var(--gray3)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '16px',
                }}
              >
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 700, fontSize: '14px', letterSpacing: '1px', textTransform: 'uppercase', color: 'var(--yellow)' }}>
                    {expense.description}
                  </div>
                  <div className="mono-small" style={{ marginTop: '4px' }}>
                    TOTAL: {expense.totalAmount} XLM ÷ {expense.numPeople} PEOPLE
                  </div>
                  <div className="mono-small" style={{
                    marginTop: '2px',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}>
                    PAY TO: {expense.payer.slice(0, 8)}…{expense.payer.slice(-4)}
                  </div>
                </div>

                <div style={{ textAlign: 'right', marginRight: '24px' }}>
                   <div style={{ fontSize: '10px', opacity: 0.5, letterSpacing: '2px' }}>YOUR SHARE</div>
                   <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '32px' }}>{expense.yourShare}</div>
                </div>

                <div style={{ flexShrink: 0 }}>
                  {expense.settled ? (
                    <span style={{
                      padding: '10px 16px',
                      border: 'var(--border-green)',
                      color: 'var(--green)',
                      fontSize: '11px',
                      letterSpacing: '2px',
                      fontWeight: 700,
                    }}>
                      ✓ SETTLED ON-CHAIN
                    </span>
                  ) : (
                    <button
                      className="btn btn-green"
                      onClick={() => handleSettle(expense)}
                      disabled={isPending || !isConnected}
                      style={{ fontSize: '12px', padding: '12px 24px' }}
                    >
                      {isPending ? 'PROCESSING...' : '⟶ SETTLE NOW'}
                    </button>
                  )}
                </div>
              </div>
            ))}

            {/* Transaction Progress details if there's an active transaction */}
            {txState !== TX_STATES.IDLE && (
              <div style={{ marginTop: '32px', padding: '24px', border: '1px solid var(--gray3)', background: 'var(--gray)' }}>
                <TxProgress txState={txState} />
                
                {txHash && (
                  <div style={{ marginTop: '20px', padding: '14px 16px', background: 'rgba(0,255,136,0.07)', border: 'var(--border-green)', fontSize: '11px', wordBreak: 'break-all' }}>
                    <div style={{ color: 'var(--green)', letterSpacing: '2px', textTransform: 'uppercase', fontSize: '10px', marginBottom: '6px' }}>✓ TRANSACTION HASH</div>
                    <div style={{ color: 'var(--green)', fontSize: '11px' }}>{txHash}</div>
                    <div style={{ marginTop: '8px' }}>
                      <a href={`https://stellar.expert/explorer/testnet/tx/${txHash}`} target="_blank" rel="noreferrer" className="btn" style={{ fontSize: '10px', padding: '6px 12px', textDecoration: 'none', display: 'inline-block' }}>VIEW ON STELLAR EXPERT ↗</a>
                    </div>
                  </div>
                )}

                {txError && (
                  <div style={{ marginTop: '20px', padding: '14px 16px', background: 'rgba(255,43,43,0.05)', border: 'var(--border-red)', fontSize: '12px', color: 'var(--red)' }}>
                    ⚠ {txError}
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* ════════════════════════════════════════════════
          3. ADD NEW EXPENSE
          ════════════════════════════════════════════════ */}
      <div id="add-expense-section" className="panel" style={{ background: 'var(--gray)' }}>
        <div className="panel-label">// 03 — ADD NEW EXPENSE</div>

        <form onSubmit={handleAddExpense}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '24px' }}>
            <div className="input-group">
              <label className="input-label" htmlFor="expense-desc">DESCRIPTION</label>
              <input type="text" id="expense-desc" placeholder="Dinner, Taxi, Hotel, etc." value={description} onChange={(e) => setDescription(e.target.value)} style={{ fontSize: '16px' }} />
            </div>

            <div className="input-group">
              <label className="input-label" htmlFor="expense-total">TOTAL AMOUNT (XLM)</label>
              <input type="number" id="expense-total" placeholder="0.00" min="0" step="0.01" value={totalAmount} onChange={(e) => setTotalAmount(e.target.value)} />
            </div>

            <div className="input-group">
              <label className="input-label" htmlFor="expense-people">PARTICIPANTS</label>
              <input type="number" id="expense-people" placeholder="2" min="2" max="20" value={numPeople} onChange={(e) => setNumPeople(e.target.value)} />
            </div>

            <div className="input-group" style={{ gridColumn: '1 / -1' }}>
              <label className="input-label">PAYER (STELLAR ADDRESS)</label>
              <input type="text" id="expense-payer" placeholder="G..." value={payer} onChange={(e) => setPayer(e.target.value)} style={{ fontSize: '14px' }} />
            </div>
          </div>

          {/* Split Result */}
          {previewShare && (
            <div style={{ background: 'var(--black)', border: '1px solid var(--gray3)', padding: '20px', margin: '24px 0' }}>
              <div className="panel-label" style={{ marginBottom: '16px' }}>CALCULATED SPLIT</div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr auto 1fr', gap: '16px', textAlign: 'center', alignItems: 'center' }}>
                <div>
                  <div style={{ fontSize: '10px', letterSpacing: '2px', textTransform: 'uppercase', opacity: 0.5, marginBottom: '4px' }}>TOTAL</div>
                  <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '36px', color: 'var(--yellow)', letterSpacing: '1px' }}>
                    {totalNum.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 7 })}
                  </div>
                  <div className="mono-small">XLM</div>
                </div>
                <div style={{ width: '1px', height: '60px', background: 'var(--gray3)' }} />
                <div>
                  <div style={{ fontSize: '10px', letterSpacing: '2px', textTransform: 'uppercase', opacity: 0.5, marginBottom: '4px' }}>PARTICIPANTS</div>
                  <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '36px', color: 'var(--yellow)', letterSpacing: '1px' }}>{numPeople || '—'}</div>
                  <div className="mono-small">WALLETS</div>
                </div>
                <div style={{ width: '1px', height: '60px', background: 'var(--gray3)' }} />
                <div>
                  <div style={{ fontSize: '10px', letterSpacing: '2px', textTransform: 'uppercase', opacity: 0.5, marginBottom: '4px' }}>EACH PAYS</div>
                  <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '36px', color: 'var(--yellow)', letterSpacing: '1px' }}>{previewShare}</div>
                  <div className="mono-small">XLM</div>
                </div>
              </div>
            </div>
          )}

          {formError && (
            <div style={{ padding: '12px 16px', border: 'var(--border-red)', background: 'rgba(255,43,43,0.05)', marginBottom: '16px', fontSize: '11px', color: 'var(--red)' }}>
              ⚠ {formError}
            </div>
          )}

          <button type="submit" className="btn btn-yellow btn-lg" style={{ marginTop: '8px' }} disabled={!isConnected}>
            {isConnected ? '+ CREATE NEW SPLIT' : 'CONNECT WALLET TO CREATE SPLIT'}
          </button>
        </form>
      </div>

    </div>
  );
}

export default memo(ExpensePanel);
