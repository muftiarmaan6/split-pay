# 💸 SplitPay — Decentralized Expense Splitting

**SplitPay** is a premium, blockchain-based expense splitting application built on the **Stellar Network**. It allows users to seamlessly split bills, calculate shares, and settle debts directly using XLM on the Stellar Testnet.

---

## ⚪️ Level 1 - White Belt Submission (Rise In)

This project is a successful submission for the **Stellar Level 1 – White Belt** milestone. It implements all core fundamentals of Stellar development: wallet integration, balance management, and testnet transactions.

### 🎯 Overview
In this level, I have built a fully functional Stellar dApp that:
- ✅ Connects to the **Freighter Wallet**.
- ✅ Fetches and displays real-time **XLM Balances** from the Stellar Testnet.
- ✅ Executes **Native XLM Transactions** to settle shared expenses.
- ✅ Provides immediate **Transaction Feedback** (hashes and success states).
- ✅ Follows modern development standards with a sleek, responsive UI.

---

## 📸 Screenshots

| Wallet Connected & Balance | Transaction Success & Feedback |
|:---:|:---:|
| ![Wallet Connected](./public/screenshots/connected.png) | ![Transaction Success](./public/screenshots/success.png) |

---

## 🚀 Key Features

- **Freighter Wallet Integration**: Securely connect and disconnect your Stellar wallet.
- **Dynamic Split Logic**: Input a total bill and the number of people; the app instantly calculates your precise share.
- **One-Click Settlement**: Pay the calculated share directly to the person who covered the bill with a single transaction.
- **Stellar Expert Links**: Every transaction includes a direct link to view the details on the Stellar Expert explorer.
- **Premium Dark UI**: Built with a modern, glassmorphic aesthetic using Tailwind CSS.

---

## 🛠️ Tech Stack

- **Framework**: [React](https://reactjs.org/) + [Vite](https://vitejs.dev/)
- **Blockchain**: [Stellar Network](https://www.stellar.org/) (Testnet)
- **API/SDK**: [@stellar/stellar-sdk](https://www.npmjs.com/package/@stellar/stellar-sdk), [@stellar/freighter-api](https://www.npmjs.com/package/@stellar/freighter-api)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)

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
