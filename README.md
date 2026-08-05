# GranaryVault

> **Stellar-native treasury management and financial governance platform.**

GranaryVault empowers organizations, DAOs, nonprofits, grant programs, and institutions to securely manage digital assets, enforce financial policies, automate treasury operations, and maintain complete transparency through Soroban smart contracts on the Stellar network.

**Live Demo:** _[Deploy to Vercel and add link here]_  
**Demo Video:** _[Upload 2-min walkthrough and add link here]_  
**Contract Address (Testnet):** _[Deploy with `soroban contract deploy` and add address here]_  
**Contract Interaction TX Hash:** _[Call contract from frontend and add hash here]_

---

## Features

| Feature | Description |
|---------|-------------|
| **Treasury Dashboard** | Live on-chain balances, asset allocation, pending approvals, financial summaries, treasury health indicators |
| **Multi-Signature Treasury** | Configurable multi-sig wallets with signer thresholds, weighted approvals, signer membership management |
| **Role-Based Access Control** | 7 roles (Owner → Viewer), 14-permission matrix, member management with role assignment |
| **Spending Policies** | Spending limits, approval thresholds, department budgets, high-value restrictions with auto-validation |
| **Treasury Transactions** | Real Stellar Testnet payments, lifecycle tracking (7 statuses), tx hashes, explorer links |
| **Scheduled Payouts** | Calendar view, recurring payments (7 frequencies), pause/resume/cancel, payroll/vendor/grant categories |
| **Batch Disbursement** | CSV upload, recipient validation, batch execution, per-recipient status tracking, progress bars |
| **Governance Proposals** | Full lifecycle: Draft → Submitted → Under Review → Approved/Rejected → Executed → Archived |
| **Financial Reporting** | 6 report types: balances, spending, allocation, department, grants, payment history |
| **Treasury Analytics** | Spending trend charts, department budget utilization, category breakdown, KPI cards |
| **Audit Trail** | Immutable activity log: timestamps, users, actions, categories, amounts, filterable + searchable |
| **Notifications & Alerts** | 8 notification types, configurable preferences toggle, read/unread state |
| **Webhooks & Integrations** | 7 event types, endpoint management, delivery log with retry, event subscription |
| **Financial Forecasting** | 6-month projected balances, cash flow analysis, confidence scoring |
| **Live Event Streaming** | SSE-based real-time updates, live indicator in sidebar, automatic dashboard refresh |
| **Soroban Smart Contracts** | On-chain treasury governance: signers, thresholds, approvals, freeze/unfreeze, audit events, comprehensive tests |

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| **Framework** | Next.js 16 (App Router) + TypeScript |
| **UI** | Material UI v9 (dark/light theme) |
| **State** | Zustand |
| **Testing** | Vitest + Testing Library (13 frontend tests) |
| **Blockchain** | Stellar + Soroban Smart Contracts (Rust, 3 tests) |
| **Wallet** | Freighter Browser Extension + StellarWalletsKit |
| **CI/CD** | GitHub Actions (frontend lint/build + contract build/test) |
| **Deployment** | Vercel / Netlify (frontend), Stellar Testnet (contract) |

---

## Smart Contract Overview

The `GranaryVaultTreasury` Soroban contract manages on-chain treasury governance:

```
contracts/treasury/src/lib.rs
```

**Contract Functions:**

| Function | Description | Auth |
|----------|-------------|------|
| `initialize(owner, threshold)` | Initialize treasury with owner and approval threshold | Owner |
| `add_signer(address, name, weight, role)` | Add a signer to the treasury | Owner |
| `remove_signer(address)` | Remove a signer | Owner |
| `update_threshold(new_threshold)` | Change approval threshold | Owner |
| `create_transaction(signer, to, amount, asset, memo)` | Create a pending transaction | Signer |
| `approve_transaction(signer, tx_id)` | Approve a transaction (auto-executes if threshold met) | Signer |
| `freeze()` / `unfreeze()` | Emergency pause/unpause | Owner |
| `get_owner()` / `get_signers()` / `get_threshold()` | Read-only queries | Public |

**Events Emitted:** `init`, `signer:added`, `signer:removed`, `threshold:updated`, `tx:created`, `tx:approved`, `tx:executed`, `freeze`, `unfreeze`

**Contract Tests (3):** `test_initialize`, `test_add_signer`, `test_threshold_update`

---

## Setup Instructions

### Prerequisites

- Node.js 20+
- Rust toolchain (for Soroban contracts)
- Freighter browser extension
- Stellar Testnet funded account ([Stellar Friendbot](https://laboratory.stellar.org/#account-creator?network=test))

### Local Development

```bash
# Clone the repository
git clone https://github.com/GranaryVault/GranaryVault.git
cd GranaryVault

# Install frontend dependencies
npm install

# Copy environment config
cp .env.example .env.local

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Environment Variables

See `.env.example` for all available variables:

| Variable | Description | Default |
|----------|-------------|---------|
| `NEXT_PUBLIC_STELLAR_NETWORK` | `TESTNET` or `PUBLIC` | `TESTNET` |
| `NEXT_PUBLIC_HORIZON_URL` | Horizon API endpoint | `https://horizon-testnet.stellar.org` |
| `NEXT_PUBLIC_SOROBAN_RPC_URL` | Soroban RPC endpoint | `https://soroban-testnet.stellar.org` |
| `NEXT_PUBLIC_TREASURY_CONTRACT_ID` | Deployed contract address | _(set after deployment)_ |
| `NEXT_PUBLIC_LOG_LEVEL` | Logging verbosity | `debug` |

**Mainnet Migration:** Change `NEXT_PUBLIC_STELLAR_NETWORK` to `PUBLIC` and update the URL variables. No code changes needed.

---

## Build Instructions

```bash
# Production build
npm run build

# Start production server
npm start
```

---

## Testing Instructions

### Frontend Tests (Vitest)

```bash
# Run all frontend tests
npm test

# Watch mode
npm run test:watch
```

**13 passing tests across 2 test files:**
- `src/__tests__/stellar.test.ts` — Stellar utilities: address shortening, explorer URLs (5 tests)
- `src/__tests__/types.test.ts` — Mock data validation: treasuries, transactions, dashboard (8 tests)

### Smart Contract Tests (Cargo)

```bash
cd contracts/treasury
cargo test
```

**3 passing tests:** `test_initialize`, `test_add_signer`, `test_threshold_update`

---

## Deployment Guide

### Frontend (Vercel)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

### Smart Contract (Stellar Testnet)

```bash
# Install Soroban CLI
cargo install --locked soroban-cli

# Build the contract
cd contracts/treasury
cargo build --target wasm32-unknown-unknown --release

# Deploy to Testnet
soroban contract deploy \
  --wasm target/wasm32-unknown-unknown/release/granaryvault_treasury.wasm \
  --source YOUR_SECRET_KEY \
  --network testnet

# Copy the contract ID and set it in .env.local:
# NEXT_PUBLIC_TREASURY_CONTRACT_ID=CDEF...

# Verify deployment
soroban contract invoke \
  --id YOUR_CONTRACT_ID \
  --source YOUR_SECRET_KEY \
  --network testnet \
  -- initialize --owner YOUR_PUBLIC_KEY --threshold 3
```

---

## Wallet Usage Instructions

### Connect with Freighter

1. Install the [Freighter browser extension](https://www.freighter.app/)
2. Create or import a Stellar Testnet account
3. Fund your account using the [Stellar Friendbot](https://laboratory.stellar.org/#account-creator?network=test)
4. Click **Connect Wallet** in the GranaryVault header
5. Approve the connection in the Freighter popup

### Send a Testnet Payment

1. Navigate to **Transactions**
2. Click **Send Payment**
3. Enter destination address, amount, and optional memo
4. Click **Send Payment** — Freighter will prompt you to sign
5. After confirmation, view the transaction hash and explorer link

### View Live Balance

Your on-chain XLM and asset balances appear automatically in the **Live On-Chain Balance** card on the Dashboard and Treasury pages. Balances refresh every 15 seconds.

---

## Contract Interaction Examples

```typescript
// From the browser console (with Freighter connected):

// 1. Initialize treasury (requires owner signature)
// Uses the useContract() hook internally:
// const { invoke } = useContract();
// await invoke({ contractId: 'CDEF...', method: 'initialize', args: [ownerKey, 3] });

// 2. Add a signer
// await invoke({ contractId: 'CDEF...', method: 'add_signer', args: [signerKey, 'Alice', 2, 'Treasurer'] });

// 3. Create a transaction
// await invoke({ contractId: 'CDEF...', method: 'create_transaction', args: [signerKey, destKey, '100', 'XLM', 'Payment memo'] });

// 4. Query signers (read-only, no auth needed)
// const { query } = useContract();
// const signers = await query({ contractId: 'CDEF...', method: 'get_signers' });
```

---

## CI/CD Pipeline

GitHub Actions workflow (`.github/workflows/ci.yml`) runs on every push and PR:

| Job | Steps |
|-----|-------|
| **Frontend** | `npm ci` → `npm run lint` → `npm run build` |
| **Contracts** | Install Soroban CLI → `cargo build --release` → `cargo test` |

---

## Project Structure

```
GranaryVault/
├── src/
│   ├── app/                  # Next.js App Router (14 routes)
│   ├── components/           # Reusable components (Layout, Treasury, Access, Settings, Transactions, Payouts)
│   ├── context/              # WalletContext (Freighter + session persistence)
│   ├── hooks/                # useContract, useLiveBalance, useRealtimeEvents
│   ├── lib/                  # stellar.ts (tx building), stellarKit.ts (multi-wallet), logger.ts
│   ├── store/                # Zustand treasury store
│   ├── types/                # 20+ TypeScript interfaces
│   ├── data/                 # Mock data (7 entity types)
│   ├── theme/                # MUI dark/light theme
│   └── __tests__/            # Vitest test files
├── contracts/treasury/       # Soroban smart contract (Rust)
├── .github/workflows/ci.yml  # CI/CD pipeline
├── .env.example              # Environment configuration template
├── vitest.config.ts          # Test configuration
└── README.md                 # This file
```

---

## License

MIT

---

## Credits

Built with:
- [Stellar](https://stellar.org/) — blockchain network
- [Soroban](https://soroban.stellar.org/) — smart contract platform
- [Freighter](https://www.freighter.app/) — Stellar wallet
- [StellarWalletsKit](https://github.com/Creit-Tech/Stellar-Wallets-Kit) — multi-wallet support
- [Next.js](https://nextjs.org/) — React framework
- [Material UI](https://mui.com/) — component library
- [Zustand](https://zustand.docs.pmnd.rs/) — state management
- [Vitest](https://vitest.dev/) — testing framework
