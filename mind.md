🧠 SplitX Project Mind Map

📌 Idea

SplitX is a blockchain-based expense splitting app that allows users to split bills and settle debts using XLM on Stellar.

🚀 Features
	•	Wallet connection
	•	Balance display
	•	Add expense
	•	Debt calculation
	•	Send XLM (settle debt)
	•	Smart contract integration
	•	Expense history
	•	Dashboard
	•	Real-time updates

🥋 Levels Progress

⚪️ Level 1
	•	[x] Project setup (Vite + React + Tailwind)
	•	[x] Wallet connect
	•	[x] Wallet disconnect
	•	[x] Balance fetch
	•	[x] Expense input UI
	•	[x] Debt calculation logic
	•	[x] XLM transaction send
	•	[x] Transaction feedback UI

🟡 Level 2
	•	[x] Multi-wallet support
	•	[x] Contract deployed
	•	[x] Contract interaction
	•	[x] Debt tracking on-chain
	•	[x] Error handling
	•	[x] Real-time event handling added

🟠 Level 3
	•	[x] Loading states (4-step transaction progress indicator)
	•	[x] Balance caching (localStorage, 30s TTL)
	•	[x] Unit tests added (16 tests across 3 files — Vitest)
	•	[x] README complete with test output and docs
	•	[x] Demo video recorded (Loom — 1 min)
	•	[x] 5 meaningful git commits

🟢 Level 4
	•	[ ] Group expenses
	•	[ ] Auto-settlement
	•	[ ] Real-time feed
	•	[ ] CI/CD
	•	[ ] Mobile UI

📊 Current Status

Level 3 (Orange Belt) is COMPLETE.
- Built TxProgress — a 4-step visual stepper (Preparing → Signing → Submitting → Confirmed).
- Implemented localStorage TTL caching for XLM balance (30 second cache with background revalidation).
- Added Vitest test suite: 16 tests passing across splitLogic, cache, and formatting utilities.
- Updated README with full Orange Belt documentation including test output snippet and caching code examples.
- 5 Git commits logged for this belt.

🧱 Next Steps

Proceed to Level 4 (Green Belt): Group expenses, auto-settlement logic, CI/CD pipeline.

