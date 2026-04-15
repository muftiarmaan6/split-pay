**SplitPay** is a premium, blockchain-based expense splitting application built on the **Stellar Network**. It allows users to seamlessly split bills, calculate shares, and settle debts directly using XLM on the Stellar Testnet.

🔗 **Live Demo**: [https://split-pay-eta.vercel.app/](https://split-pay-eta.vercel.app/)

---

## ⚪️ Level 1 & 🟡 Level 2 (White & Yellow Belt Submission)

This project is a successful submission for both the **Stellar Level 1 (White Belt)** and **Level 2 (Yellow Belt)** milestones. It implements core fundamentals, comprehensive error handling, multi-wallet support, and sets up Soroban contract architecture.

### 🎯 Overview
In this level, I have built a fully functional Stellar dApp that:
- ✅ Connects natively to **multiple wallets** via StellarWalletsKit (Freighter, xBull, Albedo).
- ✅ Fetches and displays real-time **XLM Balances** from the Stellar Testnet.
- ✅ Employs a **LIVE Soroban Smart Contract** on Testnet to verify and mark debts as settled.
- ✅ Streams **Real-Time Blockchain Events** directly into the UI upon payments.
- ✅ Detects unsupported wallets and **Insufficient Funds**, displaying robust error handling.

---

## 🔗 Verifiable On-Chain Data

To fulfill Level 2 Submission Requirements, the live Smart Contract details are transparently listed below:

- **Deployed Contract Address:** `CBQYYD4Q2Q5S7YF7B6VEXOQ7E54O5PBM4TNYTFXL6A52Q7X75BHTO4X3`
- **Example Contract Call Hash:** `6a09f3ed1b7ef3c4...` (Viewable on Stellar Expert via the UI)

| Wallet Connected & Balance | Transaction Success & Feedback |
|:---:|:---:|
| ![Wallet Connected](./public/screenshots/connected.png) | ![Transaction Success](./public/screenshots/success.png) |

---

## 🚀 Key Features

- **Multi-Wallet Support**: Powered by `StellarWalletsKit`, letting users connect their preferred Stellar ecosystem wallet.
- **Dynamic Split Logic**: Input a total bill and the number of people; the app instantly calculates your precise share.
- **Soroban Smart Contracts**: Debts are validated by `invokeHostFunction` payloads piped into our native `mark_settled` contract.
- **Event Streaming**: UI polls Soroban RPC to synchronize Ledger events actively emitted by the Smart Contract.
- **Robust Error Handling**: Real-time checking for un-funded accounts, declined transactions, and Horizon network issues.
- **Premium Dark UI**: Built with a modern, glassmorphic aesthetic using Tailwind CSS.

---

## 🛠️ Tech Stack

- **Framework**: [React](https://reactjs.org/) + [Vite](https://vitejs.dev/)
- **Blockchain**: [Stellar Network](https://www.stellar.org/) (Testnet)
- **API/SDK**: [@stellar/stellar-sdk](https://www.npmjs.com/package/@stellar/stellar-sdk), [@stellar/freighter-api](https://www.npmjs.com/package/@stellar/freighter-api)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)

---

## 🏗️ System Architecture & Design

SplitPay follows a decentralized client-side architecture that interacts directly with the Stellar blockchain through the Horizon API and the Freighter wallet provider.

### 🧩 Core Components
1. **Frontend Layer**: A responsive React SPA styled with Tailwind CSS, responsible for UI/UX and calculation logic.
2. **Provider Layer (Freighter)**: Handles secure wallet connection and transaction signing without exposing private keys.
3. **Blockchain Layer (Stellar)**: The source of truth for balances and the settlement ledger for all payments.

### 🔄 Data Flow
```mermaid
graph TD
    User((User)) -->|Connect Wallet| Freighter{Freighter Extension}
    User -->|Enter Bill Data| App[React Frontend]
    App -->|Calculate Share| Logic[Split Logic]
    Logic -->|Create XDR| SDK[Stellar SDK]
    SDK -->|Request Signature| Freighter
    Freighter -->|Signed Transaction| SDK
    SDK -->|Submit| Horizon[Stellar Horizon API]
    Horizon -->|Success/Hash| App
    Horizon -->|Update Balance| App
```

---

## 🔧 Local Setup

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd split-pay
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Install Freighter Wallet**:
   Ensure you have the [Freighter browser extension](https://www.freighter.app/) installed and set to **Testnet**.

4. **Run the development server**:
   ```bash
   npm run dev
   ```

5. **Open the app**:
   Navigate to `http://localhost:5173`.

---

## ✅ Submission Checklist Status

- [x] Public GitHub repository
- [x] Comprehensive README.md
- [x] Setup instructions included
- [x] Screenshots of connected state & balance
- [x] Screenshots of successful transaction & verification

---

*Built with ❤️ for the Rise In Stellar Program.*
