import {
  StellarWalletsKit,
  Networks,
  allowedWallets,
} from '@creit.tech/stellar-wallets-kit';

// StellarWalletsKit v2.5 accepts config at runtime but types are strict
export const walletKit = new (StellarWalletsKit as unknown as new (config: {
  selectedNetwork: string;
  allowedWallets: unknown;
}) => StellarWalletsKit)({
  selectedNetwork: Networks.TESTNET,
  allowedWallets,
});

export { Networks };
