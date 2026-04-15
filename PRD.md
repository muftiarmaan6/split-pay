# 📄 Product Requirements Document (PRD)
## SplitX — Decentralized Expense Splitting on Stellar

**Version:** 1.0.0
**Author:** Mufti Armaan
**Date:** April 2026
**Status:** Active Development

---

## 1. 🧠 Executive Summary

SplitX is a decentralized expense-splitting platform built on the Stellar blockchain. It allows groups of users to log shared expenses, automatically calculate who owes whom, and settle debts on-chain using XLM — without relying on banks, intermediaries, or centralized services. Think Splitwise, but trustless, transparent, and powered by a programmable blockchain.

---

## 2. 🎯 Problem Statement

Managing shared expenses in groups (travel, housing, dining) is inherently messy:
- **Centralized platforms** (Splitwise, Venmo) require trust in a third party.
- **Manual payments** are error-prone and create friction.
- **Cross-border settlements** are slow and expensive via traditional rails.
- **No automation**: Users must manually trigger payments even when debts are clear.

SplitX eliminates these problems by anchoring expense data and settlements on the Stellar network.

---

## 3. 👤 Target Users

| Persona | Description |
|---|---|
| **Travelers** | Groups splitting hotels, transport, meals abroad |
| **Roommates** | Monthly recurring expense splits (rent, groceries, utilities) |
| **Event Organizers** | Splitting event costs among attendees |
| **Crypto-native users** | Prefer trustless on-chain settlement to bank transfers |
| **Developers / Hackathon participants** | Exploring Stellar/Soroban ecosystem |

---

## 4. 🏆 Goals & Success Metrics

### Product Goals
- Provide a smooth UX for creating, viewing, and settling shared expenses
- Enable real XLM settlement on Stellar Testnet (and eventually Mainnet)
- Automate settlements using Soroban smart contracts

### Key Metrics
| Metric | Target |
|---|---|
| Time to create + split an expense | < 30 seconds |
| Wallet connect → balance visible | < 5 seconds |
| Transaction settlement time | < 6 seconds (Stellar finality) |
| Mobile responsiveness score | 95+ on Lighthouse |
| Test coverage (L3) | ≥ 3 passing unit tests |

---

## 5. 🚀 Feature Requirements by Level

### ⚪️ Level 1 — Core MVP

| Feature | Priority | Description |
|---|---|---|
| Freighter Wallet Connect | P0 | Allow user to connect via Freighter extension |
| Wallet Disconnect | P0 | Allow user to disconnect and clear session |
| XLM Balance Display | P0 | Fetch and display user's testnet XLM balance |
| Add Expense | P0 | Input expense amount, description, participants |
| Debt Calculation | P0 | Calculate "who owes whom" from expense list |
| Send XLM (Settle Debt) | P0 | Submit a payment transaction on Stellar Testnet |
| Transaction Feedback | P0 | Show success/failure + transaction hash link |

**Acceptance Criteria — Level 1:**
- User can connect Freighter wallet and see their public key truncated in the navbar
- User can view their live XLM balance pulled from Horizon API
- User can add an expense with a description, amount (XLM), and at least one participant
- Debt calculation is accurate and displayed in a readable list
- User can initiate an XLM payment to settle a debt; feedback is shown with tx hash

---

### 🟡 Level 2 — Smart Contract Integration

| Feature | Priority | Description |
|---|---|---|
| StellarWalletsKit | P1 | Multi-wallet support (Freighter, WalletConnect, etc.) |
| Soroban Contract Deployment | P1 | Deploy expense tracker contract to testnet |
| On-chain Expense Storage | P1 | Write expenses to Soroban contract state |
| On-chain Debt Tracking | P1 | Read and resolve debts from contract |
| Robust Error Handling | P1 | Handle: wallet missing, tx rejected, insufficient funds |
| Pending Tx Status | P1 | Poll and display pending → confirmed state |

---

### 🟠 Level 3 — Dashboard & Analytics

| Feature | Priority | Description |
|---|---|---|
| Summary Dashboard | P2 | Total expenses, net debt, net credit cards |
| Expense History | P2 | Paginated list of past expenses |
| Debt Minimization Algorithm | P2 | Reduce number of transactions to settle all debts |
| Loading States | P2 | Skeleton loaders / spinners throughout app |
| Response Caching | P2 | Cache Horizon requests to reduce API calls |
| Unit Tests (≥3) | P2 | Cover debt calc, tx build, and minimization logic |

---

### 🟢 Level 4 — Production Grade

| Feature | Priority | Description |
|---|---|---|
| Group Expense System | P3 | Named groups with member management |
| Auto-Settlement Contract | P3 | Soroban contract auto-pays debts on threshold |
| Real-time Activity Feed | P3 | Live feed of payments using event subscriptions |
| Mobile Responsive UI | P3 | Fully responsive layout, PWA-ready |
| CI/CD Pipeline | P3 | GitHub Actions → Vercel auto-deploy on push |

---

## 6. 🧰 Technical Architecture

```
┌─────────────────────────────────────────────────────────┐
│                     Frontend (Vite + React)              │
│                                                         │
│  ┌──────────┐  ┌──────────────┐  ┌──────────────────┐  │
│  │  Navbar  │  │ ExpensePanel │  │  BalanceCard      │  │
│  │ (Wallet) │  │  (L1: Input) │  │  (Horizon API)    │  │
│  └──────────┘  └──────────────┘  └──────────────────┘  │
│                                                         │
│  ┌──────────────────┐  ┌───────────────────────────┐   │
│  │ DebtCalculator   │  │ TransactionFeedback        │   │
│  │ (L1: Algorithm)  │  │ (Status + Hash)            │   │
│  └──────────────────┘  └───────────────────────────┘   │
└───────────────────────────┬─────────────────────────────┘
                            │
         ┌──────────────────▼──────────────────┐
         │        Stellar SDK (stellar-sdk)     │
         │  - Horizon Server (testnet)          │
         │  - TransactionBuilder                │
         │  - Asset (XLM native)                │
         └──────────────────┬──────────────────┘
                            │
         ┌──────────────────▼──────────────────┐
         │      Stellar Testnet (Horizon API)   │
         │  https://horizon-testnet.stellar.org │
         └──────────────────┬──────────────────┘
                            │
         ┌──────────────────▼──────────────────┐
         │       Soroban Smart Contracts        │
         │  (L2+) Expense + Settlement Logic    │
         └─────────────────────────────────────┘
```

### Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | React 18, Vite 6, Tailwind CSS 3 |
| **Blockchain** | Stellar Testnet → Mainnet |
| **Wallet** | Freighter API → StellarWalletsKit (L2) |
| **Smart Contracts** | Soroban (Rust-based) |
| **Stellar SDK** | `@stellar/stellar-sdk` |
| **Deployment** | Vercel |
| **CI/CD** | GitHub Actions (L4) |
| **Version Control** | Git / GitHub |

---

## 7. 🎨 Design System

### Color Palette
| Token | Hex | Usage |
|---|---|---|
| `background` | `#0a0a0f` | Page background |
| `card` | `#15151e` | Component cards |
| `primary` | `#6366f1` | Indigo — primary actions, branding |
| `secondary` | `#8b5cf6` | Violet — gradients, highlights |
| `accent` | `#f43f5e` | Rose — alerts, debt amounts |
| `text` | `#f8fafc` | Primary text |
| `textMuted` | `#94a3b8` | Secondary / helper text |

### Design Principles
- **Dark-first**: All UIs use the dark color palette
- **Glassmorphism accents**: Subtle frosted glass on modals/cards
- **Micro-animations**: Hover transitions, loading pulses
- **Typography**: Inter / System sans-serif — clean, readable
- **Accessible**: High contrast ratios, readable font sizes

---

## 8. 🔌 API & Integration Specs

### Freighter API
```js
import { isAllowed, requestAccess, getPublicKey, signTransaction } from '@stellar/freighter-api';
```

### Stellar Horizon (Balance)
```
GET https://horizon-testnet.stellar.org/accounts/{publicKey}
→ response.balances.find(b => b.asset_type === 'native').balance
```

### XLM Payment Transaction
```js
const tx = new TransactionBuilder(sourceAccount, { fee, networkPassphrase })
  .addOperation(Operation.payment({ destination, asset: Asset.native(), amount }))
  .setTimeout(30)
  .build();

const signed = await signTransaction(tx.toXDR(), { network: 'TESTNET' });
await server.submitTransaction(TransactionBuilder.fromXDR(signed, Networks.TESTNET));
```

---

## 9. 🧪 Testing Plan

| Test | Type | Level |
|---|---|---|
| Debt calculation (2-person split) | Unit | L3 |
| Debt minimization algorithm | Unit | L3 |
| Transaction builder (fee, destination) | Unit | L3 |
| Wallet connection flow | Integration | L3 |
| Full settle-debt flow | E2E | L4 |

---

## 10. 🚦 Risk Register

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| Freighter not installed | High | Medium | Show install prompt with link |
| Tx rejected by user | Medium | Low | Catch error, show clear message |
| Insufficient XLM balance | Medium | Medium | Check balance before tx submission |
| Horizon rate limits | Low | Medium | Add caching + retry logic (L3) |
| Soroban contract bugs | Medium | High | Local testing with `stellar-cli` before deploy |
| Testnet faucet unavailable | Low | Low | Use alternate faucet (friendbot) |

---

## 11. 🗓 Development Roadmap Summary

```
April 2026   ────────── Level 1 ──────────→  Core MVP & Wallet
May 2026     ────────── Level 2 ──────────→  Smart Contract
June 2026    ────────── Level 3 ──────────→  Dashboard & Tests
July 2026    ────────── Level 4 ──────────→  Production & CI/CD
```

---

## 12. 🔗 Resources

- [Stellar Developer Docs](https://developers.stellar.org)
- [Freighter API Docs](https://docs.freighter.app)
- [Horizon Testnet](https://horizon-testnet.stellar.org)
- [Soroban Docs](https://soroban.stellar.org)
- [StellarWalletsKit](https://stellarwalletskit.dev)
- [Stellar Laboratory](https://laboratory.stellar.org)
- [Friendbot (Testnet Faucet)](https://friendbot.stellar.org)

---

*This PRD is a living document and will be updated as development progresses.*
