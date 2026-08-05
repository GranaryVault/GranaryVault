'use client';

import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Chip,
  alpha,
  useTheme,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  LinearProgress,
} from '@mui/material';
import {
  Language as GlobeIcon,
  CurrencyExchange as FxIcon,
  TrendingUp as RateIcon,
} from '@mui/icons-material';

const FX_RATES = [
  { pair: 'USD / EUR', rate: 0.92, change: '+0.3%', color: '#06D6A0' },
  { pair: 'USD / GBP', rate: 0.79, change: '-0.1%', color: '#EF4444' },
  { pair: 'USD / JPY', rate: 148.5, change: '+0.8%', color: '#06D6A0' },
  { pair: 'USD / BRL', rate: 5.47, change: '-1.2%', color: '#EF4444' },
  { pair: 'XLM / USD', rate: 0.12, change: '+2.1%', color: '#06D6A0' },
  { pair: 'USDC / EUR', rate: 0.92, change: '+0.3%', color: '#06D6A0' },
];

const CROSS_BORDER_TXS = [
  { id: 'cb-1', from: 'US (USDC)', to: 'Germany (EUR)', amount: 15000, fee: '0.1%', eta: '3-5 sec', status: 'Completed' },
  { id: 'cb-2', from: 'US (USDC)', to: 'Brazil (BRL)', amount: 28000, fee: '0.2%', eta: '3-5 sec', status: 'Completed' },
  { id: 'cb-3', from: 'US (XLM)', to: 'Japan (JPY)', amount: 45000, fee: '0.01%', eta: '3-5 sec', status: 'Completed' },
];

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(amount);
}

export default function CrossBorderPanel() {
  const theme = useTheme();

  return (
    <Box>
      {/* FX Rate Cards */}
      <Typography variant="h6" sx={{ mb: 2 }}>Cross-Border & FX</Typography>

      <Grid container spacing={2} sx={{ mb: 3 }}>
        {FX_RATES.map((rate) => (
          <Grid size={{ xs: 6, sm: 4, md: 2 }} key={rate.pair}>
            <Card
              sx={{
                '&:hover': { borderColor: alpha(theme.palette.primary.main, 0.3) },
              }}
            >
              <CardContent sx={{ p: 2, textAlign: 'center' }}>
                <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>
                  {rate.pair}
                </Typography>
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 0.5 }}>
                  {rate.rate.toFixed(rate.rate < 1 ? 4 : 2)}
                </Typography>
                <Chip
                  label={rate.change}
                  size="small"
                  sx={{
                    fontSize: '0.65rem',
                    height: 20,
                    fontWeight: 600,
                    bgcolor: alpha(rate.color, 0.1),
                    color: rate.color,
                  }}
                />
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Cross-Border Transactions */}
      <Card>
        <CardContent sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
            <GlobeIcon sx={{ color: 'primary.light' }} />
            <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
              Recent Cross-Border Payments
            </Typography>
          </Box>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Stellar enables near-instant cross-border settlement at a fraction of traditional costs.
            All transactions settle in 3-5 seconds with fees typically under 0.01%.
          </Typography>

          <TableContainer>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Route</TableCell>
                  <TableCell align="right">Amount</TableCell>
                  <TableCell align="center">Fee</TableCell>
                  <TableCell align="center">Settlement</TableCell>
                  <TableCell align="right">Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {CROSS_BORDER_TXS.map((tx) => (
                  <TableRow key={tx.id} hover>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <FxIcon sx={{ fontSize: '1rem', color: 'primary.light' }} />
                        <Box>
                          <Typography variant="body2" sx={{ fontWeight: 500 }}>
                            {tx.from} → {tx.to}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell align="right" sx={{ fontWeight: 600 }}>
                      {formatCurrency(tx.amount)}
                    </TableCell>
                    <TableCell align="center">
                      <Chip label={tx.fee} size="small" color="success" variant="outlined" sx={{ fontSize: '0.65rem', height: 20 }} />
                    </TableCell>
                    <TableCell align="center">
                      <Chip label={tx.eta} size="small" variant="outlined" sx={{ fontSize: '0.65rem', height: 20, borderColor: alpha('#06D6A0', 0.5), color: 'success.light' }} />
                    </TableCell>
                    <TableCell align="right">
                      <Chip label={tx.status} size="small" color="success" sx={{ fontSize: '0.65rem', height: 20 }} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>
    </Box>
  );
}
