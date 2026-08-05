'use client';

import {
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
  Skeleton,
  alpha,
  useTheme,
  LinearProgress,
} from '@mui/material';
import {
  AccountBalanceWallet as WalletIcon,
  Error as ErrorIcon,
  Refresh as RefreshIcon,
} from '@mui/icons-material';
import { useLiveBalance } from '@/hooks/useLiveBalance';
import { useWallet } from '@/context/WalletContext';

export default function LiveBalanceCard() {
  const theme = useTheme();
  const { isConnected, publicKey } = useWallet();
  const { balances, xlmBalance, customAssets, isLoading, error, lastFetched, refresh } = useLiveBalance(15000);

  if (!isConnected) {
    return (
      <Card sx={{ opacity: 0.5 }}>
        <CardContent sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <WalletIcon sx={{ color: 'text.secondary' }} />
          <Typography variant="body2" color="text.secondary">
            Connect wallet to view live balance
          </Typography>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent sx={{ p: 2.5 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1.5 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <WalletIcon sx={{ color: 'primary.light', fontSize: '1.25rem' }} />
            <Typography variant="body2" sx={{ fontWeight: 600 }}>
              Live On-Chain Balance
            </Typography>
          </Box>
          {lastFetched && (
            <Typography variant="caption" color="text.secondary">
              Updated {Math.round((Date.now() - lastFetched) / 1000)}s ago
            </Typography>
          )}
        </Box>

        {isLoading && balances.length === 0 ? (
          <Box>
            <Skeleton variant="text" width="60%" height={36} />
            <Skeleton variant="text" width="40%" height={20} />
          </Box>
        ) : error ? (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <ErrorIcon sx={{ color: 'error.main', fontSize: '1rem' }} />
            <Typography variant="body2" color="error.main">
              {error}
            </Typography>
          </Box>
        ) : balances.length === 0 ? (
          <Typography variant="body2" color="text.secondary">
            No assets found on this account
          </Typography>
        ) : (
          <>
            {xlmBalance && (
              <Box sx={{ mb: 1.5 }}>
                <Typography variant="h5" sx={{ fontWeight: 700 }}>
                  {parseFloat(xlmBalance.balance).toFixed(2)} XLM
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Native asset
                </Typography>
              </Box>
            )}
            {customAssets.map((asset) => {
              const code = 'asset_code' in asset ? asset.asset_code : 'Unknown';
              const balance = parseFloat(asset.balance);
              return (
                <Box key={code} sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                  <Typography variant="body2" sx={{ fontWeight: 500 }}>
                    {balance.toFixed(2)} {code}
                  </Typography>
                  <Chip label="Custom Asset" size="small" variant="outlined"
                    sx={{ fontSize: '0.6rem', height: 20 }} />
                </Box>
              );
            })}
            {balances.length > 1 && (
              <Box sx={{ mt: 1, pt: 1, borderTop: `1px solid ${theme.palette.divider}` }}>
                <Typography variant="caption" color="text.secondary">
                  {balances.length} asset{balances.length > 1 ? 's' : ''} total
                </Typography>
              </Box>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}
