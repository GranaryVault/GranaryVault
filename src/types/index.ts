// ── Core treasury types ────────────────────────────────────────────────────────

export type TreasuryRole =
  | 'Owner'
  | 'Administrator'
  | 'Treasurer'
  | 'FinanceManager'
  | 'Approver'
  | 'Auditor'
  | 'Viewer';

export type TransactionStatus =
  | 'Draft'
  | 'PendingApproval'
  | 'Approved'
  | 'Executing'
  | 'Completed'
  | 'Failed'
  | 'Rejected';

export type ProposalStatus =
  | 'Draft'
  | 'Submitted'
  | 'UnderReview'
  | 'Approved'
  | 'Rejected'
  | 'Executed'
  | 'Archived';

export type PayoutFrequency = 'Once' | 'Daily' | 'Weekly' | 'BiWeekly' | 'Monthly' | 'Quarterly' | 'Yearly';

export type BatchStatus = 'Uploading' | 'Validating' | 'PendingApproval' | 'Processing' | 'Completed' | 'PartiallyFailed' | 'Failed';

export type NotificationType =
  | 'ApprovalRequired'
  | 'PaymentCompleted'
  | 'TransactionFailed'
  | 'BudgetThreshold'
  | 'PolicyViolation'
  | 'ProposalUpdate'
  | 'ScheduledPayout'
  | 'TreasuryActivity';

// ── Treasury ───────────────────────────────────────────────────────────────────

export interface TreasuryAccount {
  id: string;
  name: string;
  stellarAddress: string;
  balance: number;
  currency: string;
  assetType: 'native' | 'credit';
  assetCode?: string;
  assetIssuer?: string;
  signers: Signer[];
  threshold: number;
  createdAt: string;
  updatedAt: string;
}

export interface Signer {
  id: string;
  name: string;
  stellarPublicKey: string;
  role: TreasuryRole;
  weight: number;
  addedAt: string;
}

// ── Transactions ───────────────────────────────────────────────────────────────

export interface TreasuryTransaction {
  id: string;
  treasuryId: string;
  type: 'Payment' | 'Transfer' | 'Distribution' | 'Expense';
  fromAddress: string;
  toAddress: string;
  amount: number;
  currency: string;
  assetCode?: string;
  memo?: string;
  status: TransactionStatus;
  approvals: Approval[];
  requiredApprovals: number;
  stellarTxHash?: string;
  stellarExplorerUrl?: string;
  scheduledFor?: string;
  category?: string;
  tags?: string[];
  createdAt: string;
  updatedAt: string;
  completedAt?: string;
}

export interface Approval {
  id: string;
  transactionId: string;
  signerId: string;
  signerName: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  comment?: string;
  timestamp?: string;
}

// ── Policies ───────────────────────────────────────────────────────────────────

export interface SpendingPolicy {
  id: string;
  name: string;
  description: string;
  type: 'SpendingLimit' | 'ApprovalThreshold' | 'DepartmentBudget' | 'HighValueRestriction';
  rules: PolicyRule[];
  isActive: boolean;
  appliesTo: string[]; // treasury account IDs
  createdAt: string;
  updatedAt: string;
}

export interface PolicyRule {
  field: string;
  operator: 'lt' | 'lte' | 'gt' | 'gte' | 'eq';
  value: number | string;
  action: 'Block' | 'RequireApproval' | 'Notify';
}

export interface DepartmentBudget {
  id: string;
  department: string;
  allocatedAmount: number;
  spentAmount: number;
  currency: string;
  period: string; // e.g., "Q3 2026"
  policyId: string;
}

// ── Proposals ──────────────────────────────────────────────────────────────────

export interface GovernanceProposal {
  id: string;
  title: string;
  description: string;
  proposerId: string;
  proposerName: string;
  type: 'TreasuryAction' | 'PolicyChange' | 'BudgetAllocation' | 'SignerChange' | 'Other';
  status: ProposalStatus;
  votes: ProposalVote[];
  requiredApprovals: number;
  treasuryAction?: {
    transactionId?: string;
    amount?: number;
    recipient?: string;
    description?: string;
  };
  createdAt: string;
  updatedAt: string;
  executedAt?: string;
}

export interface ProposalVote {
  id: string;
  voterId: string;
  voterName: string;
  decision: 'Approve' | 'Reject' | 'Abstain';
  comment?: string;
  timestamp: string;
}

// ── Scheduled Payouts ──────────────────────────────────────────────────────────

export interface ScheduledPayout {
  id: string;
  name: string;
  description: string;
  treasuryId: string;
  recipientAddress: string;
  recipientName: string;
  amount: number;
  currency: string;
  frequency: PayoutFrequency;
  nextExecutionDate: string;
  endDate?: string;
  isActive: boolean;
  isPaused: boolean;
  category: string; // Payroll, Vendor, Grant, Contributor, Distribution
  createdAt: string;
  lastExecutedAt?: string;
}

// ── Batch Disbursement ─────────────────────────────────────────────────────────

export interface BatchDisbursement {
  id: string;
  name: string;
  treasuryId: string;
  status: BatchStatus;
  totalAmount: number;
  currency: string;
  totalRecipients: number;
  completedRecipients: number;
  failedRecipients: number;
  recipients: BatchRecipient[];
  createdAt: string;
  startedAt?: string;
  completedAt?: string;
}

export interface BatchRecipient {
  id: string;
  name: string;
  stellarAddress: string;
  amount: number;
  status: 'Pending' | 'Valid' | 'Invalid' | 'Processing' | 'Completed' | 'Failed';
  errorMessage?: string;
  txHash?: string;
}

// ── Audit ──────────────────────────────────────────────────────────────────────

export interface AuditEntry {
  id: string;
  timestamp: string;
  userId: string;
  userName: string;
  action: string;
  category: 'Treasury' | 'Transaction' | 'Approval' | 'Role' | 'Policy' | 'Proposal' | 'Governance';
  referenceId?: string;
  referenceType?: string;
  details: string;
  treasuryId?: string;
  assetAmount?: number;
  assetCurrency?: string;
}

// ── Notifications ──────────────────────────────────────────────────────────────

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  isRead: boolean;
  referenceId?: string;
  referenceType?: string;
  createdAt: string;
}

// ── Analytics ──────────────────────────────────────────────────────────────────

export interface TreasuryMetric {
  id: string;
  label: string;
  value: number;
  change: number; // percentage
  currency?: string;
  period: string;
}

export interface SpendingTrend {
  month: string;
  totalOutflow: number;
  totalInflow: number;
  categories: { name: string; amount: number }[];
}

// ── Dashboard ──────────────────────────────────────────────────────────────────

export interface DashboardData {
  metrics: {
    totalBalance: number;
    totalBalanceChange: number;
    monthlyOutflow: number;
    monthlyOutflowChange: number;
    pendingApprovals: number;
    pendingUrgent: number;
    completedThisMonth: number;
    completedChange: number;
  };
  recentActivity: {
    id: string;
    action: string;
    amount?: number;
    currency?: string;
    status: string;
    timestamp: string;
  }[];
  pendingItems: {
    id: string;
    title: string;
    amount?: number;
    currency?: string;
    approvalsCurrent: number;
    approvalsRequired: number;
    type: 'Proposal' | 'Transaction' | 'Policy' | 'Batch';
  }[];
}
