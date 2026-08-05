'use client';

import { Box, Grid, Card, CardContent, Typography, Button, Chip, alpha } from '@mui/material';
import {
  AccountBalance as TreasuryIcon,
  TrendingUp as TrendingIcon,
  HourglassEmpty as PendingIcon,
  CheckCircle as CompletedIcon,
  Schedule as ScheduleIcon,
  ArrowForward as ArrowIcon,
} from '@mui/icons-material';
import AppLayout from '@/components/Layout/AppLayout';

const metrics = [
  {
    label: 'Total Treasury Balance',
    value: '$2,847,350',
    change: '+4.75%',
    icon: <TreasuryIcon />,
    color: 'primary',
  },
  {
    label: 'Monthly Outflow',
    value: '$184,200',
    change: '-2.3%',
    icon: <TrendingIcon />,
    color: 'secondary',
  },
  {
    label: 'Pending Approvals',
    value: '12',
    change: '3 urgent',
    icon: <PendingIcon />,
    color: 'warning',
  },
  {
    label: 'Completed This Month',
    value: '147',
    change: '+12%',
    icon: <CompletedIcon />,
    color: 'success',
  },
];

const recentActivity = [
  { action: 'Payment sent to 0x1234...abcd', amount: '$12,500', status: 'Completed', time: '10 min ago' },
  { action: 'Proposal #42 created', amount: '', status: 'Under Review', time: '1 hour ago' },
  { action: 'Batch disbursement (24 txs)', amount: '$48,200', status: 'Processing', time: '3 hours ago' },
  { action: 'Policy "Travel Budget" updated', amount: '', status: 'Active', time: '5 hours ago' },
];

const pendingItems = [
  { title: 'Proposal #41 — Marketing Budget Q3', amount: '$85,000', approvals: '2 of 3', color: 'warning' as const },
  { title: 'Payment to Acme Corp', amount: '$22,400', approvals: '1 of 2', color: 'error' as const },
  { title: 'Grant Distribution — Batch 7', amount: '$150,000', approvals: '2 of 4', color: 'warning' as const },
];

export default function DashboardPage() {
  return (
    <AppLayout>
      <Box>
        <Typography variant="h4" sx={{ mb: 1 }}>
          Dashboard
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
          Welcome back. Here&apos;s your treasury overview.
        </Typography>

        {/* Metrics Grid */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          {metrics.map((metric) => (
            <Grid size={{ xs: 12, sm: 6, lg: 3 }} key={metric.label}>
              <Card>
                <CardContent sx={{ p: 3 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                    <Box
                      sx={{
                        width: 44,
                        height: 44,
                        borderRadius: 2.5,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        bgcolor: alpha(
                          metric.color === 'primary'
                            ? '#7C5CFC'
                            : metric.color === 'secondary'
                              ? '#06D6A0'
                              : metric.color === 'warning'
                                ? '#F59E0B'
                                : '#06D6A0',
                          0.12
                        ),
                      }}
                    >
                      <Box
                        sx={{
                          color: `${metric.color}.main`,
                          display: 'flex',
                        }}
                      >
                        {metric.icon}
                      </Box>
                    </Box>
                    <Chip
                      label={metric.change}
                      size="small"
                      sx={{
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        bgcolor: alpha(
                          metric.change.startsWith('+') ? '#06D6A0' : '#EF4444',
                          0.1
                        ),
                        color: metric.change.startsWith('+') ? 'success.main' : 'error.main',
                      }}
                    />
                  </Box>
                  <Typography variant="h4" sx={{ fontWeight: 700, mb: 0.5 }}>
                    {metric.value}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {metric.label}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        <Grid container spacing={3}>
          {/* Recent Activity */}
          <Grid size={{ xs: 12, lg: 7 }}>
            <Card>
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                  <Typography variant="h6">Recent Activity</Typography>
                  <Button endIcon={<ArrowIcon />} size="small" sx={{ textTransform: 'none' }}>
                    View All
                  </Button>
                </Box>
                {recentActivity.map((item, i) => (
                  <Box
                    key={i}
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      py: 1.5,
                      borderBottom: i < recentActivity.length - 1 ? '1px solid' : 'none',
                      borderColor: 'divider',
                    }}
                  >
                    <Box>
                      <Typography variant="body2" sx={{ fontWeight: 500 }}>
                        {item.action}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {item.time}
                      </Typography>
                    </Box>
                    <Box sx={{ textAlign: 'right' }}>
                      {item.amount && (
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                          {item.amount}
                        </Typography>
                      )}
                      <Chip
                        label={item.status}
                        size="small"
                        sx={{
                          fontSize: '0.7rem',
                          height: 22,
                          bgcolor:
                            item.status === 'Completed'
                              ? alpha('#06D6A0', 0.1)
                              : item.status === 'Processing'
                                ? alpha('#3B82F6', 0.1)
                                : alpha('#F59E0B', 0.1),
                          color:
                            item.status === 'Completed'
                              ? 'success.main'
                              : item.status === 'Processing'
                                ? 'info.main'
                                : 'warning.main',
                        }}
                      />
                    </Box>
                  </Box>
                ))}
              </CardContent>
            </Card>
          </Grid>

          {/* Pending Approvals */}
          <Grid size={{ xs: 12, lg: 5 }}>
            <Card>
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                  <Typography variant="h6">Pending Approvals</Typography>
                  <ScheduleIcon color="warning" />
                </Box>
                {pendingItems.map((item, i) => (
                  <Box
                    key={i}
                    sx={{
                      p: 2,
                      mb: 1.5,
                      borderRadius: 2,
                      border: '1px solid',
                      borderColor: 'divider',
                      '&:hover': {
                        borderColor: alpha('#7C5CFC', 0.3),
                        bgcolor: alpha('#7C5CFC', 0.03),
                      },
                      cursor: 'pointer',
                    }}
                  >
                    <Typography variant="body2" sx={{ fontWeight: 600, mb: 0.5 }}>
                      {item.title}
                    </Typography>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography variant="caption" color="text.secondary">
                        {item.amount} · {item.approvals} approvals
                      </Typography>
                      <Button size="small" sx={{ textTransform: 'none', fontSize: '0.75rem' }}>
                        Review
                      </Button>
                    </Box>
                  </Box>
                ))}
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </AppLayout>
  );
}
