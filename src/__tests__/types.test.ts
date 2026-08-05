import { describe, it, expect } from 'vitest';
import { mockTreasuries, mockTransactions, mockDashboard } from '@/data/mockData';

describe('Mock Data', () => {
  describe('mockTreasuries', () => {
    it('has at least 2 treasuries', () => {
      expect(mockTreasuries.length).toBeGreaterThanOrEqual(2);
    });

    it('each treasury has required fields', () => {
      mockTreasuries.forEach((t) => {
        expect(t.id).toBeTruthy();
        expect(t.name).toBeTruthy();
        expect(t.stellarAddress).toBeTruthy();
        expect(t.balance).toBeGreaterThan(0);
        expect(t.signers.length).toBeGreaterThan(0);
        expect(t.threshold).toBeGreaterThan(0);
      });
    });

    it('all treasuries have valid signer weights', () => {
      mockTreasuries.forEach((t) => {
        const totalWeight = t.signers.reduce((sum, s) => sum + s.weight, 0);
        expect(totalWeight).toBeGreaterThanOrEqual(t.threshold);
      });
    });
  });

  describe('mockTransactions', () => {
    it('has at least 3 transactions', () => {
      expect(mockTransactions.length).toBeGreaterThanOrEqual(3);
    });

    it('has valid statuses', () => {
      const validStatuses = ['Draft', 'PendingApproval', 'Approved', 'Executing', 'Completed', 'Failed', 'Rejected'];
      mockTransactions.forEach((tx) => {
        expect(validStatuses).toContain(tx.status);
      });
    });
  });

  describe('mockDashboard', () => {
    it('has positive total balance', () => {
      expect(mockDashboard.metrics.totalBalance).toBeGreaterThan(0);
    });

    it('has recent activity', () => {
      expect(mockDashboard.recentActivity.length).toBeGreaterThan(0);
    });

    it('has pending items', () => {
      expect(mockDashboard.pendingItems.length).toBeGreaterThan(0);
    });
  });
});
