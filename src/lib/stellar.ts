import { Networks } from 'stellar-sdk';

export const STELLAR_NETWORK = 'TESTNET' as const;

export const NETWORK_PASSPHRASE = Networks.TESTNET;

export const NETWORK_URL = 'https://soroban-testnet.stellar.org';

export const EXPLORER_BASE_URL = 'https://stellar.expert/explorer/testnet';

export function getExplorerTxUrl(txHash: string): string {
  return `${EXPLORER_BASE_URL}/tx/${txHash}`;
}

export function getExplorerAccountUrl(address: string): string {
  return `${EXPLORER_BASE_URL}/account/${address}`;
}

export function shortenAddress(address: string): string {
  if (!address || address.length < 12) return address;
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}
