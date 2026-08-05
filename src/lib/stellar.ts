import {
  Networks,
  Horizon,
  Asset,
  Operation,
  TransactionBuilder,
  Memo,
  Keypair,
} from '@stellar/stellar-sdk';

// ── Network (env-driven for easy Mainnet migration) ────────────────────────────
const NETWORK_MODE = (typeof process !== 'undefined' && process.env.NEXT_PUBLIC_STELLAR_NETWORK) || 'TESTNET';

export const STELLAR_NETWORK = NETWORK_MODE as 'TESTNET' | 'PUBLIC';

export const NETWORK_PASSPHRASE =
  NETWORK_MODE === 'PUBLIC' ? Networks.PUBLIC : Networks.TESTNET;

export const HORIZON_URL =
  NETWORK_MODE === 'PUBLIC'
    ? 'https://horizon.stellar.org'
    : (typeof process !== 'undefined' && process.env.NEXT_PUBLIC_HORIZON_URL) || 'https://horizon-testnet.stellar.org';

export const SOROBAN_RPC_URL =
  NETWORK_MODE === 'PUBLIC'
    ? 'https://soroban.stellar.org'
    : (typeof process !== 'undefined' && process.env.NEXT_PUBLIC_SOROBAN_RPC_URL) || 'https://soroban-testnet.stellar.org';

export const EXPLORER_BASE_URL =
  NETWORK_MODE === 'PUBLIC'
    ? 'https://stellar.expert/explorer/public'
    : 'https://stellar.expert/explorer/testnet';

// ── Horizon server (lazy) ──────────────────────────────────────────────────────
let horizonServer: Horizon.Server | null = null;
export function getHorizonServer(): Horizon.Server {
  if (!horizonServer) {
    horizonServer = new Horizon.Server(HORIZON_URL);
  }
  return horizonServer;
}

// ── Helpers ────────────────────────────────────────────────────────────────────
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

// ── Transaction building ───────────────────────────────────────────────────────

export interface BuildPaymentTxParams {
  sourcePublicKey: string;
  destinationAddress: string;
  amount: string;
  assetCode?: string;
  assetIssuer?: string;
  memo?: string;
}

/**
 * Build a Stellar payment transaction XDR.
 */
export async function buildPaymentTransaction(
  params: BuildPaymentTxParams
): Promise<string> {
  const server = getHorizonServer();
  const sourceAccount = await server.loadAccount(params.sourcePublicKey);

  let asset: Asset;
  if (params.assetCode && params.assetIssuer) {
    asset = new Asset(params.assetCode, params.assetIssuer);
  } else {
    asset = Asset.native();
  }

  const txBuilder = new TransactionBuilder(sourceAccount, {
    fee: '100',
    networkPassphrase: NETWORK_PASSPHRASE,
  });

  const paymentOp = Operation.payment({
    destination: params.destinationAddress,
    asset,
    amount: params.amount,
  });

  txBuilder.addOperation(paymentOp);

  if (params.memo) {
    txBuilder.addMemo(Memo.text(params.memo));
  }

  const transaction = txBuilder.setTimeout(180).build();
  return transaction.toXDR();
}

/**
 * Submit a signed transaction XDR to the Horizon network.
 */
export async function submitTransaction(
  signedXdr: string
): Promise<Horizon.HorizonApi.SubmitTransactionResponse> {
  const server = getHorizonServer();
  const transaction = TransactionBuilder.fromXDR(
    signedXdr,
    NETWORK_PASSPHRASE
  );
  return server.submitTransaction(transaction);
}

/**
 * Fetch account balances from Horizon.
 */
export async function getAccountBalances(
  publicKey: string
): Promise<Horizon.HorizonApi.BalanceLine[]> {
  const server = getHorizonServer();
  const account = await server.loadAccount(publicKey);
  return account.balances;
}
