'use client';

import { useEffect } from 'react';
import { Box, Grid, Card, CardContent, Typography, Button, Chip, alpha, Skeleton } from '@mui/material';
import {
  AccountBalance as TreasuryIcon,
  TrendingUp as TrendingIcon,
  HourglassEmpty as PendingIcon,
  CheckCircle as CompletedIcon,
  Schedule as ScheduleIcon,
  ArrowForward as ArrowIcon,
} from '@mui/icons-material';
import AppLayout from '@/components/Layout/AppLayout';
import LiveBalanceCard from '@/components/Treasury/LiveBalanceCard';
import { useTreasuryStore } from '@/store/treasuryStore';

const ISO_CURRENCIES = ['USD', 'EUR', 'GBP', 'JPY'];

function formatCurrency(amount: number, currency?: string): string {
  const cur = currency || 'USD';
  if (ISO_CURRENCIES.includes(cur)) {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: cur,
      maximumFractionDigits: 0,
    }).format(amount);
  }
  // Non-ISO currencies (USDC, XLM, etc.)
  return `${amount.toLocaleString('en-US')} ${cur}`;
}

function timeAgo(dateString: string): string {
  const now = new Date();
  const date = new Date(dateString);
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  if (diffMins < 60) return `${diffMins} min ago`;
  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
  const diffDays = Math.floor(diffHours / 24);
  return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
}

export default function DashboardPage() {
  const { dashboard, isLoading, initialize } = useTreasuryStore();

  useEffect(() => {
    initialize();
  }, [initialize]);

  const metrics = [
    {
      label: 'Total Treasury Balance',
      value: formatCurrency(dashboard.metrics.totalBalance),
      change: `+${dashboard.metrics.totalBalanceChange}%`,
      icon: <TreasuryIcon />,
      color: 'primary' as const,
    },
    {
      label: 'Monthly Outflow',
      value: formatCurrency(dashboard.metrics.monthlyOutflow),
      change: `${dashboard.metrics.monthlyOutflowChange}%`,
      icon: <TrendingIcon />,
      color: 'secondary' as const,
    },
    {
      label: 'Pending Approvals',
      value: String(dashboard.metrics.pendingApprovals),
      change: `${dashboard.metrics.pendingUrgent} urgent`,
      icon: <PendingIcon />,
      color: 'warning' as const,
    },
    {
      label: 'Completed This Month',
      value: String(dashboard.metrics.completedThisMonth),
      change: `+${dashboard.metrics.completedChange}%`,
      icon: <CompletedIcon />,
      color: 'success' as const,
    },
  ];

  const isPositiveChange = (change: string) => change.startsWith('+');

  return (
    <AppLayout>
      <Box>
        <Typography variant="h4" sx={{ mb: 1 }}>
          Dashboard
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
          Welcome back. Here&apos;s your treasury overview.
        </Typography>

        {isLoading ? (
          <Grid container spacing={3} sx={{ mb: 4 }}>
            {[0, 1, 2, 3].map((i) => (
              <Grid size={{ xs: 12, sm: 6, lg: 3 }} key={i}>
                <Card>
                  <CardContent sx={{ p: 3 }}>
                    <Skeleton variant="rounded" width={44} height={44} sx={{ mb: 2 }} />
                    <Skeleton variant="text" width="60%" height={40} />
                    <Skeleton variant="text" width="40%" height={20} />
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        ) : (
          <>
            {/* Live On-Chain Balance */}
        <Box sx={{ mb: 4 }}>
          <LiveBalanceCard />
        </Box>

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
                          <Box sx={{ color: `${metric.color}.main`, display: 'flex' }}>
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
                              isPositiveChange(metric.change) ? '#06D6A0' : '#EF4444',
                              0.1
                            ),
                            color: isPositiveChange(metric.change) ? 'success.main' : 'error.main',
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
                    {dashboard.recentActivity.map((item, i) => (
                      <Box
                        key={item.id}
                        sx={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          py: 1.5,
                          borderBottom: i < dashboard.recentActivity.length - 1 ? '1px solid' : 'none',
                          borderColor: 'divider',
                        }}
                      >
                        <Box>
                          <Typography variant="body2" sx={{ fontWeight: 500 }}>
                            {item.action}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {timeAgo(item.timestamp)}
                          </Typography>
                        </Box>
                        <Box sx={{ textAlign: 'right' }}>
                          {item.amount && (
                            <Typography variant="body2" sx={{ fontWeight: 600 }}>
                              {formatCurrency(item.amount, item.currency)}
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
                                  : item.status === 'Processing' || item.status === 'Pending Approval'
                                    ? alpha('#3B82F6', 0.1)
                                    : alpha('#F59E0B', 0.1),
                              color:
                                item.status === 'Completed'
                                  ? 'success.main'
                                  : item.status === 'Processing' || item.status === 'Pending Approval'
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
                    {dashboard.pendingItems.map((item, i) => (
                      <Box
                        key={item.id}
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
                          transition: 'all 0.15s ease',
                        }}
                      >
                        <Typography variant="body2" sx={{ fontWeight: 600, mb: 0.5 }}>
                          {item.title}
                        </Typography>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <Typography variant="caption" color="text.secondary">
                            {item.amount ? formatCurrency(item.amount, item.currency) : 'N/A'} · {item.approvalsCurrent} of {item.approvalsRequired} approvals
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
          </>
        )}
      </Box>
    </AppLayout>
  );
}
