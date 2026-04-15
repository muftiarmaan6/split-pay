# 💸 SplitPay — Stellar Expense Splitter

A decentralized, blockchain-powered bill splitting dApp built on the **Stellar Network (Testnet)**. Users connect their wallets, calculate their share of a group expense, and settle debts on-chain using **XLM** — all within a sleek, premium dark UI.

🔗 **Live Demo**: [https://split-pay-eta.vercel.app/](https://split-pay-eta.vercel.app/)  
📦 **Repository**: [github.com/muftiarmaan6/split-pay](https://github.com/muftiarmaan6/split-pay)

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React 19 + Vite 8 |
| **Styling** | Tailwind CSS 3 |
| **Blockchain** | Stellar Testnet (Horizon + Soroban RPC) |
| **SDK** | `@stellar/stellar-sdk` v15 |
| **Wallet** | `@stellar/freighter-api` v6 + StellarWalletsKit |
| **Smart Contract** | Soroban (Rust) |
| **Deployment** | Vercel |

---

## 🔧 Setup Instructions (Run Locally)

```bash
# 1. Clone the repository
git clone https://github.com/muftiarmaan6/split-pay.git
cd split-pay

# 2. Install dependencies
npm install

# 3. Start the development server
npm run dev
```

### Prerequisites
- **Node.js** v18+
- **Freighter Wallet** browser extension ([download here](https://www.freighter.app/)) — switch it to **Testnet** mode
- Fund your testnet wallet via [Stellar Friendbot](https://friendbot.stellar.org/?addr=YOUR_PUBLIC_KEY)

After running `npm run dev`, open **http://localhost:5173** in your browser.

---

# ⚪️ Level 1 — White Belt Submission

### 👉 Overview

The White Belt milestone demonstrates mastery of Stellar fundamentals: wallet connectivity, balance display, and on-chain transactions. SplitPay satisfies every Level 1 requirement as a **Split Bill Calculator** dApp.

### ✅ Requirements Checklist

| # | Requirement | Status | Evidence |
|---|------------|--------|----------|
| 1 | **Wallet Setup** — Freighter on Stellar Testnet | ✅ Done | Freighter extension configured for Testnet |
| 2 | **Wallet Connect** — Connect functionality | ✅ Done | "Connect Wallet" button in Navbar |
| 3 | **Wallet Disconnect** — Disconnect functionality | ✅ Done | "Disconnect" button appears after connection |
| 4 | **Balance Fetch** — Retrieve XLM balance | ✅ Done | Horizon API `loadAccount()` fetches native balance |
| 5 | **Balance Display** — Show balance in UI | ✅ Done | Large balance card: "AVAILABLE BALANCE — 10000.00 XLM" |
| 6 | **Send XLM Transaction** — On Stellar Testnet | ✅ Done | Sends calculated share to the payer's address |
| 7 | **Transaction Feedback** — Success/failure + hash | ✅ Done | Green "Payment Sent!" banner with clickable Tx Hash |
| 8 | **Development Standards** — Clean code, error handling | ✅ Done | Component-based architecture with try/catch flows |

### 📸 Screenshots

| Wallet Connected & Balance Displayed | Successful Transaction & Hash |
|:---:|:---:|
| <img width="450" alt="Wallet connected showing 10000 XLM balance" src="./public/connected.png"> | <img width="450" alt="Payment Sent with transaction hash" src="./public/success.png"> |

**Screenshot 1 (left):** Wallet is connected, the public key is displayed in the navbar, and the XLM balance (`10,000.00 XLM`) is clearly rendered.

**Screenshot 2 (right):** After settling a debt, the UI shows a green "Payment Sent!" confirmation with the full transaction hash: `043d8aa90ea51d8995ce68bd928f12c460a857ebbb333d061ce93cffe25d6877`.

🔍 **Verify on Stellar Explorer:** [View Transaction on Stellar Expert](https://stellar.expert/explorer/testnet/tx/043d8aa90ea51d8995ce68bd928f12c460a857ebbb333d061ce93cffe25d6877)

---

# 🟡 Level 2 — Yellow Belt Submission

### 👉 Overview

Building on the White Belt, Level 2 introduces **multi-wallet support** via StellarWalletsKit, **smart contract deployment** on Soroban, **real-time event listening**, and **robust error handling** with 3+ error types.

### ✅ Requirements Checklist

| # | Requirement | Status | Evidence |
|---|------------|--------|----------|
| 1 | **3 Error Types Handled** | ✅ Done | See [Error Handling](#-error-handling-3-types) section below |
| 2 | **Contract Deployed on Testnet** | ✅ Done | `CDLZFC3SYJYDZT7K67VZ75HPJVIEUVNIXF47ZG2FB2RMQQVU2HHGCYSC` |
| 3 | **Contract Called from Frontend** | ✅ Done | `invokeHostFunction` via `StellarSdk.Contract.call()` |
| 4 | **Transaction Status Visible** | ✅ Done | Pending → Success/Fail states rendered in UI |
| 5 | **2+ Meaningful Commits** | ✅ Done | 10+ commits in git history |
| 6 | **Multi-wallet + Contract + Events** | ✅ Done | SWK modal + Soroban RPC event polling |

### 🔗 Verifiable On-Chain Data

| Item | Value |
|------|-------|
| **Deployed Contract Address** | `CDLZFC3SYJYDZT7K67VZ75HPJVIEUVNIXF47ZG2FB2RMQQVU2HHGCYSC` |
| **Transaction Hash (Contract Call)** | `043d8aa90ea51d8995ce68bd928f12c460a857ebbb333d061ce93cffe25d6877` |
| **Network** | Stellar Testnet |
| **Verify Transaction** | [View on Stellar Expert](https://stellar.expert/explorer/testnet/tx/043d8aa90ea51d8995ce68bd928f12c460a857ebbb333d061ce93cffe25d6877) |
| **Verify Contract** | [View on Stellar Expert](https://stellar.expert/explorer/testnet/contract/CDLZFC3SYJYDZT7K67VZ75HPJVIEUVNIXF47ZG2FB2RMQQVU2HHGCYSC) |

### 📸 Screenshot: Wallet Options Available

| Multi-Wallet Selection Modal (StellarWalletsKit) |
|:---:|
| <img width="450" alt="Wallet options showing Freighter, xBull, and Albedo" src="./public/wallet-modal.png"> |

The modal above is powered by `StellarWalletsKit` and displays all available wallet options (Freighter, xBull Wallet, Albedo) when the user clicks "Connect Wallet".

### 🛡️ Error Handling (3 Types)

SplitPay handles the following error scenarios gracefully in the UI:

| # | Error Type | How It's Triggered | UI Response |
|---|-----------|-------------------|-------------|
| 1 | **Wallet Not Found / Rejected** | User cancels the wallet signing prompt | Displays: *"Signing rejected"* in red error banner |
| 2 | **Insufficient Balance** | User tries to settle a debt exceeding their XLM balance | Displays: *"Horizon Error: ... Ensure you have enough XLM"* |
| 3 | **Network / Horizon Error** | Soroban RPC or Horizon API is unreachable or returns a server error | Displays: *"Transaction failed or was rejected by user."* |

All errors are caught in a `try/catch` block inside `handleSettle()` in [`ExpensePanel.jsx`](./src/components/ExpensePanel.jsx) and rendered as a red feedback card with an error icon.

### 🔄 Smart Contract Architecture

The Soroban smart contract is written in Rust and located at [`contracts/split_pay/src/lib.rs`](./contracts/split_pay/src/lib.rs).

**Contract functions:**
- `add_expense(payer, amount, description)` → Stores a new expense on-chain and emits an `ExpenseAdded` event.
- `mark_settled(expense_id, payer)` → Marks an expense as settled and emits an `ExpenseSettled` event.

**Frontend integration flow:**
```
User clicks "Settle" 
  → Build Soroban invokeHostFunction transaction
  → sorobanServer.prepareTransaction()
  → StellarWalletsKit signs the XDR
  → sorobanServer.sendTransaction()  
  → UI displays Tx Hash + "Payment Sent!"
```

### 📡 Real-Time Event Listening

The frontend polls the Soroban RPC server every 5 seconds to fetch contract events:

```javascript
const { events } = await sorobanServer.getEvents({
  startLedger,
  filters: [{ contractIds: [CONTRACT_ID] }]
});
```

When events are detected, a live green notification badge appears in the "My Debts (On-Chain)" section, displaying the event type and ledger number.

### 🔀 Transaction Status Tracking

| State | UI Indicator |
|-------|-------------|
| **Idle** | "Settle" button is enabled |
| **Pending** | Button text changes to "Signing…" and is disabled |
| **Success** | Green banner: "Payment Sent!" with clickable Tx Hash |
| **Failed** | Red banner with specific error message |

---

## 🏗️ System Architecture

```mermaid
graph TD
    User((User)) -->|Click Connect| SWK[StellarWalletsKit Modal]
    SWK -->|Select Wallet| Wallet{Freighter / xBull / Albedo}
    User -->|Enter Bill Data| App[React Frontend]
    App -->|Calculate Share| Logic[Split Logic Engine]
    Logic -->|Build Soroban TX| SDK[Stellar SDK]
    SDK -->|Prepare TX| Soroban[Soroban RPC Server]
    Soroban -->|Return Prepared TX| SDK
    SDK -->|Request Signature| Wallet
    Wallet -->|Signed XDR| SDK
    SDK -->|Submit TX| Soroban
    Soroban -->|Tx Hash / Status| App
    App -->|Poll Events| Soroban
    Soroban -->|Live Events| App
```

---

## 📁 Project Structure

```
split-pay/
├── contracts/
│   └── split_pay/
│       ├── Cargo.toml
│       └── src/
│           └── lib.rs            # Soroban smart contract (Rust)
├── public/
│   ├── connected.png             # Screenshot: wallet + balance
│   ├── success.png               # Screenshot: transaction success
│   └── wallet-modal.png          # Screenshot: wallet options modal
├── src/
│   ├── components/
│   │   ├── Navbar.jsx            # Wallet connect/disconnect via SWK
│   │   └── ExpensePanel.jsx      # Bill splitting + Soroban contract calls
│   ├── lib/
│   │   └── swk.js                # StellarWalletsKit initialization
│   ├── App.jsx                   # Root component
│   └── index.css                 # Tailwind + custom styles
├── mind.md                       # Development journal
├── README.md                     # This file
└── package.json
```

---

## ✅ Final Submission Checklist

### White Belt (Level 1)
- [x] Public GitHub repository
- [x] README with project description
- [x] README with setup instructions
- [x] Screenshot: Wallet connected state
- [x] Screenshot: Balance displayed
- [x] Screenshot: Successful testnet transaction
- [x] Screenshot: Transaction result shown to user

### Yellow Belt (Level 2)
- [x] Public GitHub repository
- [x] README with setup instructions
- [x] 2+ meaningful commits (10+ total)
- [x] Live demo link: [split-pay-eta.vercel.app](https://split-pay-eta.vercel.app/)
- [x] Screenshot: Wallet options available (StellarWalletsKit)
- [x] Deployed contract address: `CDLZFC3SYJYDZT7K67VZ75HPJVIEUVNIXF47ZG2FB2RMQQVU2HHGCYSC`
- [x] Transaction hash of contract call: [`043d8aa...25d6877`](https://stellar.expert/explorer/testnet/tx/043d8aa90ea51d8995ce68bd928f12c460a857ebbb333d061ce93cffe25d6877)

---

*Built with ❤️ for the [Rise In Stellar Program](https://www.risein.com/).*
