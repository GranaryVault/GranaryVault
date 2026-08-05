'use client';

import { useEffect, useState } from 'react';
import {
  Box, Grid, Card, CardContent, Typography, Button, Chip, alpha, useTheme,
  Dialog, DialogTitle, DialogContent, DialogActions, TextField, Select,
  MenuItem, FormControl, InputLabel, IconButton, Switch, FormControlLabel,
} from '@mui/material';
import {
  Add as AddIcon, Schedule as ScheduleIcon, Pause as PauseIcon,
  PlayArrow as PlayIcon, Cancel as CancelIcon, CalendarMonth as CalendarIcon,
} from '@mui/icons-material';
import AppLayout from '@/components/Layout/AppLayout';
import { useTreasuryStore } from '@/store/treasuryStore';
import { shortenAddress } from '@/lib/stellar';
import type { PayoutFrequency } from '@/types';

const FREQ_LABELS: Record<PayoutFrequency, string> = {
  Once: 'One-time', Daily: 'Daily', Weekly: 'Weekly', BiWeekly: 'Bi-Weekly',
  Monthly: 'Monthly', Quarterly: 'Quarterly', Yearly: 'Yearly',
};
const CAT_COLORS: Record<string, string> = {
  Payroll: '#7C5CFC', Vendor: '#3B82F6', Grant: '#06D6A0',
  Contributor: '#F59E0B', Distribution: '#EC4899',
};

function formatCurrency(amount: number, currency?: string): string {
  const cur = currency || 'USD';
  if (['USD', 'EUR', 'GBP'].includes(cur)) return new Intl.NumberFormat('en-US', { style: 'currency', currency: cur, maximumFractionDigits: 0 }).format(amount);
  return `${amount.toLocaleString('en-US')} ${cur}`;
}

export default function PayoutsPage() {
  const theme = useTheme();
  const { payouts, isLoading, initialize } = useTreasuryStore();
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => { if (payouts.length === 0) initialize(); }, [payouts.length, initialize]);

  return (
    <AppLayout>
      <Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1, flexWrap: 'wrap', gap: 2 }}>
          <Box>
            <Typography variant="h4">Scheduled Payouts</Typography>
            <Typography variant="body1" color="text.secondary">Schedule future payments and manage recurring disbursements.</Typography>
          </Box>
          <Button variant="contained" startIcon={<AddIcon />} onClick={() => setDialogOpen(true)}
            sx={{ borderRadius: 2.5, textTransform: 'none' }}>
            Schedule Payout
          </Button>
        </Box>

        <Grid container spacing={3} sx={{ mt: 2 }}>
          {payouts.map((payout) => (
            <Grid size={{ xs: 12, md: 6 }} key={payout.id}>
              <Card sx={{ '&:hover': { borderColor: alpha(theme.palette.primary.main, 0.3) } }}>
                <CardContent sx={{ p: 3 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                      <Box sx={{ width: 42, height: 42, borderRadius: 2,
                        bgcolor: alpha(CAT_COLORS[payout.category] || '#7C5CFC', 0.12),
                        display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <ScheduleIcon sx={{ color: CAT_COLORS[payout.category] || 'primary.light' }} />
                      </Box>
                      <Box>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>{payout.name}</Typography>
                        <Typography variant="caption" color="text.secondary">
                          {payout.description}
                        </Typography>
                      </Box>
                    </Box>
                    <Box sx={{ textAlign: 'right' }}>
                      <Chip label={payout.category} size="small"
                        sx={{ fontSize: '0.7rem', bgcolor: alpha(CAT_COLORS[payout.category] || '#7C5CFC', 0.1),
                          color: CAT_COLORS[payout.category] || 'primary.light', mb: 0.5 }} />
                      <Box>
                        {payout.isPaused ? (
                          <Chip icon={<PauseIcon />} label="Paused" size="small" color="warning" variant="outlined" sx={{ fontSize: '0.7rem' }} />
                        ) : (
                          <Chip icon={<PlayIcon />} label="Active" size="small" color="success" variant="outlined" sx={{ fontSize: '0.7rem' }} />
                        )}
                      </Box>
                    </Box>
                  </Box>

                  <Typography variant="h5" sx={{ fontWeight: 700, mb: 1 }}>
                    {formatCurrency(payout.amount, payout.currency)}
                  </Typography>

                  <Grid container spacing={2} sx={{ mb: 2 }}>
                    <Grid size={6}>
                      <Typography variant="caption" color="text.secondary">Frequency</Typography>
                      <Typography variant="body2" sx={{ fontWeight: 500 }}>{FREQ_LABELS[payout.frequency]}</Typography>
                    </Grid>
                    <Grid size={6}>
                      <Typography variant="caption" color="text.secondary">Next Execution</Typography>
                      <Typography variant="body2" sx={{ fontWeight: 500 }}>
                        {new Date(payout.nextExecutionDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </Typography>
                    </Grid>
                    <Grid size={6}>
                      <Typography variant="caption" color="text.secondary">Recipient</Typography>
                      <Typography variant="body2" sx={{ fontFamily: 'monospace', fontWeight: 500 }}>
                        {shortenAddress(payout.recipientAddress)}
                      </Typography>
                    </Grid>
                    <Grid size={6}>
                      <Typography variant="caption" color="text.secondary">Last Executed</Typography>
                      <Typography variant="body2" sx={{ fontWeight: 500 }}>
                        {payout.lastExecutedAt
                          ? new Date(payout.lastExecutedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
                          : 'Never'}
                      </Typography>
                    </Grid>
                  </Grid>

                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Button size="small" variant="outlined" color="warning"
                      startIcon={payout.isPaused ? <PlayIcon /> : <PauseIcon />}
                      sx={{ borderRadius: 2, textTransform: 'none', fontSize: '0.75rem' }}>
                      {payout.isPaused ? 'Resume' : 'Pause'}
                    </Button>
                    <Button size="small" variant="outlined" color="error"
                      startIcon={<CancelIcon />}
                      sx={{ borderRadius: 2, textTransform: 'none', fontSize: '0.75rem' }}>
                      Cancel
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Schedule Dialog */}
        <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="sm" fullWidth>
          <DialogTitle>Schedule New Payout</DialogTitle>
          <DialogContent>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
              <TextField label="Payout Name" size="small" fullWidth />
              <TextField label="Recipient Address" size="small" fullWidth placeholder="GABC..." />
              <TextField label="Amount" size="small" type="number" fullWidth />
              <FormControl fullWidth size="small"><InputLabel>Frequency</InputLabel>
                <Select defaultValue="Monthly" label="Frequency">
                  {Object.entries(FREQ_LABELS).map(([k, v]) => <MenuItem key={k} value={k}>{v}</MenuItem>)}
                </Select>
              </FormControl>
              <FormControl fullWidth size="small"><InputLabel>Category</InputLabel>
                <Select defaultValue="Payroll" label="Category">
                  {Object.keys(CAT_COLORS).map((c) => <MenuItem key={c} value={c}>{c}</MenuItem>)}
                </Select>
              </FormControl>
              <TextField label="Description" size="small" fullWidth multiline rows={2} />
            </Box>
          </DialogContent>
          <DialogActions sx={{ p: 2.5 }}>
            <Button onClick={() => setDialogOpen(false)} sx={{ textTransform: 'none' }}>Cancel</Button>
            <Button variant="contained" onClick={() => setDialogOpen(false)}
              sx={{ textTransform: 'none', borderRadius: 2.5 }}>Schedule</Button>
          </DialogActions>
        </Dialog>
      </Box>
    </AppLayout>
  );
}
