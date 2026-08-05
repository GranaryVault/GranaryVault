'use client';

import { Box, Grid, Card, CardContent, Typography, alpha, useTheme, LinearProgress } from '@mui/material';
import {
  TrendingUp as TrendIcon, BarChart as ChartIcon, PieChart as PieIcon,
  AccountBalance as BalanceIcon,
} from '@mui/icons-material';
import AppLayout from '@/components/Layout/AppLayout';
import { mockSpendingTrends } from '@/data/mockData';

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(amount);
}

export default function AnalyticsPage() {
  const theme = useTheme();
  const maxOutflow = Math.max(...mockSpendingTrends.map((t) => t.totalOutflow));

  const deptPerformance = [
    { name: 'Engineering', budget: 500000, spent: 320000, color: '#7C5CFC' },
    { name: 'Marketing', budget: 250000, spent: 195000, color: '#06D6A0' },
    { name: 'R&D', budget: 300000, spent: 210000, color: '#3B82F6' },
    { name: 'Operations', budget: 150000, spent: 98000, color: '#F59E0B' },
    { name: 'Grants', budget: 200000, spent: 135000, color: '#EC4899' },
  ];

  return (
    <AppLayout>
      <Box>
        <Typography variant="h4" sx={{ mb: 1 }}>Treasury Analytics</Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
          Interactive dashboards for spending trends, budget utilization, and treasury intelligence.
        </Typography>

        {/* KPI Cards */}
        <Grid container spacing={2} sx={{ mb: 4 }}>
          {[
            { label: 'Total Inflow (Jul)', value: formatCurrency(380000), change: '+8.2%', icon: <TrendIcon />, color: theme.palette.success.main },
            { label: 'Total Outflow (Jul)', value: formatCurrency(184200), change: '-4.1%', icon: <ChartIcon />, color: theme.palette.primary.main },
            { label: 'Avg Payment Size', value: formatCurrency(1250), change: '+2.5%', icon: <PieIcon />, color: theme.palette.warning.main },
            { label: 'Treasury Growth', value: '+4.75%', change: 'MoM', icon: <BalanceIcon />, color: theme.palette.info.main },
          ].map((kpi) => (
            <Grid size={{ xs: 12, sm: 6, lg: 3 }} key={kpi.label}>
              <Card>
                <CardContent sx={{ p: 2.5 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Box sx={{ color: kpi.color }}>{kpi.icon}</Box>
                    <Typography variant="caption" sx={{ color: kpi.color, fontWeight: 600 }}>{kpi.change}</Typography>
                  </Box>
                  <Typography variant="h5" sx={{ fontWeight: 700 }}>{kpi.value}</Typography>
                  <Typography variant="caption" color="text.secondary">{kpi.label}</Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        <Grid container spacing={3}>
          {/* Spending Trends Bar Chart (CSS) */}
          <Grid size={{ xs: 12, lg: 7 }}>
            <Card>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" sx={{ mb: 3 }}>Monthly Spending Trends</Typography>
                <Box sx={{ display: 'flex', alignItems: 'flex-end', gap: 2, height: 240, px: 2 }}>
                  {mockSpendingTrends.map((trend) => {
                    const heightPct = (trend.totalOutflow / maxOutflow) * 100;
                    return (
                      <Box key={trend.month} sx={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100%', justifyContent: 'flex-end' }}>
                        <Typography variant="caption" sx={{ mb: 0.5, fontWeight: 600 }}>
                          {formatCurrency(trend.totalOutflow)}
                        </Typography>
                        <Box sx={{ width: '100%', maxWidth: 60, height: `${heightPct}%`, minHeight: 4,
                          borderRadius: '4px 4px 0 0',
                          background: `linear-gradient(180deg, ${theme.palette.primary.main}, ${alpha(theme.palette.primary.main, 0.3)})`,
                          transition: 'height 0.3s ease' }} />
                        <Typography variant="caption" sx={{ mt: 1 }}>{trend.month}</Typography>
                      </Box>
                    );
                  })}
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Department Performance */}
          <Grid size={{ xs: 12, lg: 5 }}>
            <Card>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" sx={{ mb: 3 }}>Department Budget Utilization</Typography>
                {deptPerformance.map((dept) => {
                  const pct = Math.round((dept.spent / dept.budget) * 100);
                  return (
                    <Box key={dept.name} sx={{ mb: 2.5 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                        <Typography variant="body2" sx={{ fontWeight: 500 }}>{dept.name}</Typography>
                        <Typography variant="caption" sx={{ fontWeight: 600, color: pct > 90 ? 'error.main' : pct > 75 ? 'warning.main' : 'text.secondary' }}>
                          {formatCurrency(dept.spent)} / {formatCurrency(dept.budget)} ({pct}%)
                        </Typography>
                      </Box>
                      <LinearProgress variant="determinate" value={Math.min(pct, 100)}
                        sx={{ height: 8, borderRadius: 4, bgcolor: alpha(dept.color, 0.1),
                          '& .MuiLinearProgress-bar': { borderRadius: 4, bgcolor: dept.color } }} />
                    </Box>
                  );
                })}
              </CardContent>
            </Card>
          </Grid>

          {/* Category Breakdown */}
          <Grid size={{ xs: 12 }}>
            <Card>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" sx={{ mb: 3 }}>Spending by Category — July 2026</Typography>
                <Grid container spacing={2}>
                  {[
                    { name: 'Payroll', amount: 95000, pct: 52, color: '#7C5CFC' },
                    { name: 'Vendor Payments', amount: 38000, pct: 21, color: '#3B82F6' },
                    { name: 'Grants', amount: 51200, pct: 27, color: '#06D6A0' },
                  ].map((cat) => (
                    <Grid size={{ xs: 12, sm: 4 }} key={cat.name}>
                      <Box sx={{ textAlign: 'center' }}>
                        <Typography variant="h5" sx={{ fontWeight: 700, color: cat.color }}>{cat.pct}%</Typography>
                        <Typography variant="body2" sx={{ fontWeight: 500 }}>{cat.name}</Typography>
                        <Typography variant="caption" color="text.secondary">{formatCurrency(cat.amount)}</Typography>
                      </Box>
                    </Grid>
                  ))}
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </AppLayout>
  );
}
