'use client';

import { Box, Grid, Card, CardContent, Typography, alpha, useTheme, LinearProgress } from '@mui/material';
import { TrendingUp as ForecastIcon, ShowChart as ChartIcon } from '@mui/icons-material';
import AppLayout from '@/components/Layout/AppLayout';

const FORECAST_MONTHS = ['Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan'];
const PROJECTED_OUTFLOW = [195000, 210000, 205000, 220000, 190000, 185000];
const PROJECTED_INFLOW = [400000, 380000, 420000, 390000, 450000, 410000];
const PROJECTED_BALANCE = [2894000, 2864000, 3079000, 3249000, 3509000, 3734000];

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(amount);
}

export default function ForecastingPage() {
  const theme = useTheme();
  const maxBalance = Math.max(...PROJECTED_BALANCE);

  return (
    <AppLayout>
      <Box>
        <Typography variant="h4" sx={{ mb: 1 }}>Financial Forecasting</Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
          Projected treasury performance based on historical trends and scheduled payouts.
        </Typography>

        {/* KPI Cards */}
        <Grid container spacing={2} sx={{ mb: 4 }}>
          {[
            { label: 'Projected Balance (Jan)', value: formatCurrency(3734000), change: '+31%', color: theme.palette.success.main },
            { label: 'Avg Monthly Outflow', value: formatCurrency(200833), change: '+4.2%', color: theme.palette.warning.main },
            { label: 'Forecast Confidence', value: '87%', change: 'High', color: theme.palette.info.main },
          ].map((kpi) => (
            <Grid size={{ xs: 12, sm: 4 }} key={kpi.label}>
              <Card>
                <CardContent sx={{ p: 2.5, textAlign: 'center' }}>
                  <Typography variant="h5" sx={{ fontWeight: 700, color: kpi.color }}>{kpi.value}</Typography>
                  <Typography variant="caption" color="text.secondary">{kpi.label}</Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        <Grid container spacing={3}>
          {/* Balance Projection Chart */}
          <Grid size={{ xs: 12, lg: 8 }}>
            <Card>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" sx={{ mb: 3 }}>Projected Treasury Balance</Typography>
                <Box sx={{ display: 'flex', alignItems: 'flex-end', gap: 2, height: 240, px: 2 }}>
                  {PROJECTED_BALANCE.map((bal, i) => {
                    const heightPct = (bal / maxBalance) * 100;
                    return (
                      <Box key={i} sx={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-end', height: '100%' }}>
                        <Typography variant="caption" sx={{ mb: 0.5, fontWeight: 600 }}>
                          {formatCurrency(bal)}
                        </Typography>
                        <Box sx={{
                          width: '100%', maxWidth: 60, height: `${heightPct}%`, minHeight: 4,
                          borderRadius: '4px 4px 0 0',
                          background: i >= FORECAST_MONTHS.length - 3
                            ? `linear-gradient(180deg, ${alpha(theme.palette.secondary.main, 0.7)}, ${alpha(theme.palette.primary.main, 0.3)})`
                            : `linear-gradient(180deg, ${theme.palette.primary.main}, ${alpha(theme.palette.primary.main, 0.3)})`,
                          border: i >= FORECAST_MONTHS.length - 3 ? `1px dashed ${theme.palette.secondary.main}` : 'none',
                        }} />
                        <Typography variant="caption" sx={{ mt: 1, fontWeight: i >= FORECAST_MONTHS.length - 3 ? 600 : 400 }}>
                          {FORECAST_MONTHS[i]}
                        </Typography>
                        {i >= FORECAST_MONTHS.length - 3 && (
                          <Typography variant="caption" sx={{ fontSize: '0.6rem', color: 'secondary.main' }}>
                            (forecast)
                          </Typography>
                        )}
                      </Box>
                    );
                  })}
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Cash Flow Summary */}
          <Grid size={{ xs: 12, lg: 4 }}>
            <Card>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" sx={{ mb: 3 }}>Cash Flow Projection</Typography>
                {FORECAST_MONTHS.map((month, i) => (
                  <Box key={month} sx={{ mb: 2 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                      <Typography variant="body2" sx={{ fontWeight: 500 }}>{month}</Typography>
                      <Typography variant="caption" sx={{ fontWeight: 600 }}>
                        {formatCurrency(PROJECTED_INFLOW[i] - PROJECTED_OUTFLOW[i])}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', gap: 0.5 }}>
                      <Box sx={{ flex: PROJECTED_INFLOW[i] / (PROJECTED_INFLOW[i] + PROJECTED_OUTFLOW[i]),
                        height: 6, borderRadius: 3, bgcolor: theme.palette.success.main }} />
                      <Box sx={{ flex: PROJECTED_OUTFLOW[i] / (PROJECTED_INFLOW[i] + PROJECTED_OUTFLOW[i]),
                        height: 6, borderRadius: 3, bgcolor: theme.palette.error.main }} />
                    </Box>
                  </Box>
                ))}
                <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: 'success.main' }} />
                    <Typography variant="caption">Inflow</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: 'error.main' }} />
                    <Typography variant="caption">Outflow</Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </AppLayout>
  );
}
