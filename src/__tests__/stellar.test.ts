import { describe, it, expect } from 'vitest';
import { shortenAddress, getExplorerTxUrl, getExplorerAccountUrl } from '@/lib/stellar';

describe('Stellar Utilities', () => {
  describe('shortenAddress', () => {
    it('shortens a Stellar public key', () => {
      const key = 'GA5ZSEJYB37JRC5AVCILMXV4K3FN2L3CJY2Z2KFR3UNJF7BJGXQF3CEI';
      const result = shortenAddress(key);
      expect(result).toBe('GA5ZSE...3CEI');
    });

    it('returns the original string if shorter than 12 chars', () => {
      expect(shortenAddress('GABC')).toBe('GABC');
    });

    it('handles empty string', () => {
      expect(shortenAddress('')).toBe('');
    });
  });

  describe('getExplorerTxUrl', () => {
    it('generates correct Testnet explorer URL', () => {
      const url = getExplorerTxUrl('abc123def456');
      expect(url).toContain('stellar.expert');
      expect(url).toContain('testnet');
      expect(url).toContain('abc123def456');
    });
  });

  describe('getExplorerAccountUrl', () => {
    it('generates correct Testnet account URL', () => {
      const url = getExplorerAccountUrl('GABC123XYZ');
      expect(url).toContain('stellar.expert');
      expect(url).toContain('testnet');
      expect(url).toContain('account');
      expect(url).toContain('GABC123XYZ');
    });
  });
});
