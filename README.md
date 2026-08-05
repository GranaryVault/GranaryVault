# GranaryVault

> **Stellar-native treasury management and financial governance platform.**

GranaryVault empowers organizations, DAOs, nonprofits, grant programs, and institutions to securely manage digital assets, enforce financial policies, automate treasury operations, and maintain complete transparency through Soroban smart contracts on the Stellar network.

---

## Features

| Feature | Description |
|---------|-------------|
| **Treasury Dashboard** | Real-time balances, asset allocation, pending approvals, and financial summaries |
| **Multi-Signature Treasury** | Configurable multi-sig wallets with signer thresholds and role-based weights |
| **Role-Based Access Control** | Granular permissions — Owner, Admin, Treasurer, Finance Manager, Approver, Auditor, Viewer |
| **Spending Policies** | Configurable limits, approval thresholds, department budgets with automatic validation |
| **Treasury Transactions** | Payment creation, lifecycle tracking, Stellar transaction hashes, and explorer links |
| **Scheduled Payouts** | Recurring payments for payroll, vendors, grants with pause/cancel |
| **Batch Disbursement** | CSV upload, recipient validation, batch execution with progress tracking |
| **Governance Proposals** | Full lifecycle: Draft → Review → Approve/Reject → Execute → Archive |
| **Financial Reporting** | Balance reports, spending summaries, asset allocation, department reports |
| **Treasury Analytics** | Spending trends, budget utilization, department performance dashboards |
| **Audit Trail** | Immutable activity log with timestamps, actors, categories, and amounts |
| **Notifications & Alerts** | Configurable alerts for approvals, payments, budgets, and policy violations |
| **Webhooks** | Real-time event delivery with retry mechanisms for enterprise integrations |
| **Soroban Contracts** | On-chain treasury governance: signers, thresholds, approvals, and audit events |

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| **Framework** | Next.js 16 (App Router) |
| **Language** | TypeScript |
| **UI** | Material UI v9 |
| **State** | Zustand |
| **Blockchain** | Stellar + Soroban Smart Contracts (Rust) |
| **Wallet** | Freighter Browser Extension |
| **CI/CD** | GitHub Actions |

---

## Getting Started

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Smart Contracts

```bash
# Install Soroban CLI
cargo install --locked soroban-cli

# Build contract
cd contracts/treasury
cargo build --target wasm32-unknown-unknown --release

# Run tests
cargo test
```

---

## Project Structure

```
GranaryVault/
├── src/
│   ├── app/                  # Next.js App Router pages
│   │   ├── page.tsx          # Dashboard
│   │   ├── treasury/         # Treasury management
│   │   ├── transactions/     # Transaction management
│   │   ├── proposals/        # Governance proposals
│   │   ├── policies/         # Spending policies
│   │   ├── payouts/          # Scheduled payouts
│   │   ├── batch/            # Batch disbursement
│   │   ├── reports/          # Financial reports
│   │   ├── analytics/        # Treasury analytics
│   │   ├── audit/            # Audit trail
│   │   └── settings/         # RBAC, notifications, webhooks
│   ├── components/
│   │   ├── Layout/           # App shell (sidebar, header, nav)
│   │   ├── Treasury/         # Treasury-specific components
│   │   ├── Access/           # RBAC components
│   │   └── Settings/         # Settings panels
│   ├── context/              # React contexts (wallet)
│   ├── hooks/                # Custom hooks (contract interaction)
│   ├── lib/                  # Utilities (Stellar config)
│   ├── store/                # Zustand stores
│   ├── types/                # TypeScript type definitions
│   ├── data/                 # Mock data
│   └── theme/                # MUI theme configuration
└── contracts/
    └── treasury/             # Soroban smart contract (Rust)
```

---

## Architecture

GranaryVault follows a modular, production-ready architecture:

- **Presentation Layer**: Next.js pages + MUI components, Zustand for client state
- **Business Logic Layer**: Custom hooks, context providers, utility functions
- **Blockchain Layer**: Soroban smart contracts for on-chain governance, Freighter for signing
- **Integration Layer**: Webhooks for external system connectivity

---

## Phase Status

| Phase | Feature | Status |
|-------|---------|--------|
| 1 | Project Scaffolding | ✅ |
| 2 | Theme & Design System | ✅ |
| 3 | Navigation & Routing | ✅ |
| 4 | Page Shells | ✅ |
| 5 | Types & Mock Data | ✅ |
| 6 | Wallet Integration | ✅ |
| 7 | Treasury Dashboard | ✅ |
| 8 | Activity & Approvals | ✅ |
| 9 | Multi-Signature Config | ✅ |
| 10 | Role-Based Access Control | ✅ |
| 11 | Spending Policies | ✅ |
| 12 | Treasury Transactions | ✅ |
| 13 | Scheduled Payouts | ✅ |
| 14 | Batch Disbursement | ✅ |
| 15 | Governance Proposals | ✅ |
| 16 | Financial Reporting | ✅ |
| 17 | Treasury Analytics | ✅ |
| 18 | Audit Trail | ✅ |
| 19 | Notifications & Alerts | ✅ |
| 20 | Webhooks & Integrations | ✅ |
| 21 | Soroban Smart Contracts | ✅ |
| 22 | Contract Frontend Integration | ✅ |
| 23 | Multi-Account Management | ✅ |
| 24 | Testing & CI/CD | ✅ |
| 25 | Final Polish & Documentation | ✅ |

---

## License

MIT
