'use client';

import { create } from 'zustand';
import type {
  TreasuryAccount,
  TreasuryTransaction,
  SpendingPolicy,
  GovernanceProposal,
  ScheduledPayout,
  BatchDisbursement,
  AuditEntry,
  Notification,
  DashboardData,
} from '@/types';
import {
  mockTreasuries,
  mockTransactions,
  mockPolicies,
  mockProposals,
  mockPayouts,
  mockBatches,
  mockAuditEntries,
  mockNotifications,
  mockDashboard,
} from '@/data/mockData';

interface TreasuryState {
  // Data
  treasuries: TreasuryAccount[];
  transactions: TreasuryTransaction[];
  policies: SpendingPolicy[];
  proposals: GovernanceProposal[];
  payouts: ScheduledPayout[];
  batches: BatchDisbursement[];
  auditEntries: AuditEntry[];
  notifications: Notification[];
  dashboard: DashboardData;

  // UI state
  isLoading: boolean;
  walletConnected: boolean;
  walletAddress: string | null;

  // Actions
  initialize: () => void;
  connectWallet: (address: string) => void;
  disconnectWallet: () => void;
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;

  // Selector helpers
  getPendingApprovalsCount: () => number;
  getUnreadNotificationsCount: () => number;
}

export const useTreasuryStore = create<TreasuryState>((set, get) => ({
  // Initial state
  treasuries: [],
  transactions: [],
  policies: [],
  proposals: [],
  payouts: [],
  batches: [],
  auditEntries: [],
  notifications: [],
  dashboard: mockDashboard,
  isLoading: false,
  walletConnected: false,
  walletAddress: null,

  // Actions
  initialize: () => {
    set({ isLoading: true });
    // Simulate data loading
    setTimeout(() => {
      set({
        treasuries: mockTreasuries,
        transactions: mockTransactions,
        policies: mockPolicies,
        proposals: mockProposals,
        payouts: mockPayouts,
        batches: mockBatches,
        auditEntries: mockAuditEntries,
        notifications: mockNotifications,
        isLoading: false,
      });
    }, 600);
  },

  connectWallet: (address: string) => {
    set({
      walletConnected: true,
      walletAddress: address,
    });
  },

  disconnectWallet: () => {
    set({
      walletConnected: false,
      walletAddress: null,
    });
  },

  markNotificationRead: (id: string) => {
    set((state) => ({
      notifications: state.notifications.map((n) =>
        n.id === id ? { ...n, isRead: true } : n
      ),
    }));
  },

  markAllNotificationsRead: () => {
    set((state) => ({
      notifications: state.notifications.map((n) => ({ ...n, isRead: true })),
    }));
  },

  // Selectors
  getPendingApprovalsCount: () => {
    const state = get();
    const pendingTxs = state.transactions.filter(
      (t) => t.status === 'PendingApproval'
    ).length;
    const pendingProps = state.proposals.filter(
      (p) => p.status === 'Submitted' || p.status === 'UnderReview'
    ).length;
    const pendingBatches = state.batches.filter(
      (b) => b.status === 'PendingApproval'
    ).length;
    return pendingTxs + pendingProps + pendingBatches;
  },

  getUnreadNotificationsCount: () => {
    return get().notifications.filter((n) => !n.isRead).length;
  },
}));
