# 🗺️ SplitX — Master Plan

> Single source of truth for the SplitX dApp: git commit strategy, project mind map, and belt progression logic.

---

## 🧠 Mind Map

### 💡 Idea
SplitX is a blockchain-based expense splitting app that allows users to split bills and settle debts using XLM on the Stellar network. Think **Splitwise**, but trustless, transparent, and on-chain.

### 🚀 Core Features
- Wallet connection & disconnection (Freighter → StellarWalletsKit)
- Live XLM balance display (Horizon API)
- Add & split expenses across participants
- Automatic debt calculation ("who owes whom")
- Send XLM to settle debts (Stellar Testnet → Mainnet)
- Soroban smart contract integration (L2+)
- Expense history & dashboard (L3)
- Group expenses & auto-settlement (L4)

### 🎨 Design System
| Token | Hex | Usage |
|---|---|---|
| `background` | `#0a0a0f` | Page background |
| `card` | `#15151e` | Component cards |
| `primary` | `#6366f1` | Indigo — primary actions |
| `secondary` | `#8b5cf6` | Violet — gradients, highlights |
| `accent` | `#f43f5e` | Rose — alerts, debt amounts |
| `text` | `#f8fafc` | Primary text |
| `textMuted` | `#94a3b8` | Muted / helper text |

**Principles:** Dark-first · Glassmorphism accents · Micro-animations · Inter typography

---

## 🥋 Belt Progression

### ⚪️ Level 1 — White Belt (Core MVP) ✅ COMPLETE
**Goal:** Basic frontend with wallet, expense tracking, and XLM settlement.

| Task | Status |
|---|---|
| Project setup (Vite + React + Tailwind) | ✅ |
| Wallet connect (Freighter) | ✅ |
| Wallet disconnect | ✅ |
| XLM balance fetch from Horizon API | ✅ |
| Expense input UI | ✅ |
| Debt calculation logic | ✅ |
| XLM transaction send | ✅ |
| Transaction feedback UI (hash + status) | ✅ |

**Completion Note:** Level 1 is fully shipped. Brave browser wallet detection issue resolved via `isConnected` polling + SDK migration to `getAddress`. 5 commits merged post-MVP. UI rebranded to sleek black/purple minimalist palette.

---

### 🟡 Level 2 — Yellow Belt (Smart Contract Integration)
**Goal:** Multi-wallet support and Soroban contract on testnet.

| Task | Status |
|---|---|
| Migrate to StellarWalletsKit (multi-wallet) | ⏳ |
| Deploy Soroban expense tracker contract | ⏳ |
| Write expenses to contract state (on-chain) | ⏳ |
| Read & resolve debts from contract | ⏳ |
| Robust error handling (wallet missing, rejected tx, insufficient funds) | ⏳ |
| Pending → confirmed tx status polling | ⏳ |

---

### 🟠 Level 3 — Orange Belt (Dashboard & Analytics)
**Goal:** Summary dashboard, expense history, and unit tests.

| Task | Status |
|---|---|
| Summary dashboard (totals, net debt/credit) | ⏳ |
| Paginated expense history | ⏳ |
| Debt minimization algorithm | ⏳ |
| Loading skeletons / spinners | ⏳ |
| Horizon API response caching | ⏳ |
| Unit tests (≥3): debt calc, tx build, minimization | ⏳ |

---

### 🟢 Level 4 — Green Belt (Production Grade)
**Goal:** Group system, auto-settlement, CI/CD, and mobile UI.

| Task | Status |
|---|---|
| Named group system with member management | ⏳ |
| Auto-settlement Soroban contract | ⏳ |
| Real-time activity feed (event subscriptions) | ⏳ |
| Fully responsive / PWA-ready mobile UI | ⏳ |
| GitHub Actions → Vercel CI/CD pipeline | ⏳ |

---

## 🔀 Git Strategy

### Commit Convention
All commits follow **Conventional Commits** format:

```
<type>(<optional scope>): <short description>

Types:
  feat     → new feature
  fix      → bug fix
  refactor → code restructure (no behavior change)
  docs     → documentation only
  ui       → styling / visual changes
  test     → adding or updating tests
  chore    → build scripts, config, tooling
  init     → project initialization
```

### Commit History (Level 1)

| Hash | Type | Message |
|---|---|---|
| `b4c196c` | `init` | setup React + Tailwind project |
| `981e2e7` | `feat` | implement wallet connect and disconnect |
| `240e9b9` | `docs` | add PRD and update mind.md with project scope |
| `49d2cd3` | `ui` | implement sleek black and purple palette, rebranding, and minimalist animations |
| `03665fd` | `feat` | fetch and display testnet XLM balance using Friendbot |
| `c724222` | `feat` | complete level 1 frontend with expense tracking, debt calculation, and XLM transactions |
| `9c86872` | `fix` | resolve Freighter wallet detection issue in Brave browser by verifying isConnected stat and delaying execution |
| `11c451d` | `fix` | default wallet state to connected to circumvent brave shields blocking passive detection |
| `3e4cb4a` | `refactor` | simplify wallet connection logic to core functions |
| `a8a5caa` | `fix` | remove setAllowed blocker that fails prematurely on new wallet connections |
| `5c0835d` | `fix` | update freighter SDK method from deprecated getPublicKey to getAddress |
| `131ad84` | `fix` | import isConnected which was stripping reference error catch |

### Branching Strategy
```
main          ← always deployable, merged from feature branches
└── feat/     ← new features (e.g. feat/soroban-contract)
└── fix/      ← bug fixes    (e.g. fix/wallet-detection)
└── refactor/ ← restructures (e.g. refactor/debt-calc)
```

### Commit Rules per Belt
- **White Belt (L1):** Minimum 5 meaningful commits — ✅ achieved (12 commits)
- **Yellow Belt (L2):** Smart contract deploy commit + integration commits required
- **Orange Belt (L3):** Test coverage commits + performance commits required
- **Green Belt (L4):** CI/CD config commit + final production deploy commit required

---

## 🧱 Next Steps

1. **Start Level 2:** Migrate wallet to `StellarWalletsKit` 
2. Write a Soroban Rust contract for expense/debt storage
3. Deploy contract to Stellar Testnet using `stellar-cli`
4. Connect frontend to contract via `@stellar/stellar-sdk` Soroban calls
5. Add error boundary components for robust UX

---

## 🔗 Key Resources

| Resource | URL |
|---|---|
| Stellar Developer Docs | https://developers.stellar.org |
| Freighter API Docs | https://docs.freighter.app |
| Horizon Testnet | https://horizon-testnet.stellar.org |
| Soroban Docs | https://soroban.stellar.org |
| StellarWalletsKit | https://stellarwalletskit.dev |
| Stellar Laboratory | https://laboratory.stellar.org |
| Friendbot (Testnet Faucet) | https://friendbot.stellar.org |