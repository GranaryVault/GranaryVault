'use client';

import { useEffect, useState } from 'react';
import {
  Box, Grid, Card, CardContent, Typography, Button, Chip, alpha, useTheme,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Dialog, DialogTitle, DialogContent, DialogActions, TextField, Select,
  MenuItem, FormControl, InputLabel, Tabs, Tab, LinearProgress,
} from '@mui/material';
import {
  Add as AddIcon, Send as SendIcon, OpenInNew as OpenIcon,
  ContentCopy as CopyIcon, FilterList as FilterIcon,
} from '@mui/icons-material';
import AppLayout from '@/components/Layout/AppLayout';
import { useTreasuryStore } from '@/store/treasuryStore';
import { shortenAddress, getExplorerTxUrl } from '@/lib/stellar';

const STATUS_COLORS: Record<string, string> = {
  Completed: '#06D6A0', Draft: '#9393B8', PendingApproval: '#F59E0B',
  Approved: '#3B82F6', Executing: '#8B5CF6', Failed: '#EF4444', Rejected: '#EF4444',
};

function formatCurrency(amount: number, currency?: string): string {
  const cur = currency || 'USD';
  if (['USD', 'EUR', 'GBP'].includes(cur)) return new Intl.NumberFormat('en-US', { style: 'currency', currency: cur, maximumFractionDigits: 0 }).format(amount);
  return `${amount.toLocaleString('en-US')} ${cur}`;
}

export default function TransactionsPage() {
  const theme = useTheme();
  const { transactions, isLoading, initialize } = useTreasuryStore();
  const [tab, setTab] = useState(0);
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => { if (transactions.length === 0) initialize(); }, [transactions.length, initialize]);

  const filtered = tab === 0 ? transactions : transactions.filter((t) =>
    tab === 1 ? t.status === 'PendingApproval' : t.status === 'Completed');

  return (
    <AppLayout>
      <Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1, flexWrap: 'wrap', gap: 2 }}>
          <Box>
            <Typography variant="h4">Transactions</Typography>
            <Typography variant="body1" color="text.secondary">Create, approve, and track treasury transactions.</Typography>
          </Box>
          <Button variant="contained" startIcon={<SendIcon />} onClick={() => setDialogOpen(true)}
            sx={{ borderRadius: 2.5, textTransform: 'none' }}>
            New Payment
          </Button>
        </Box>

        {/* Summary Cards */}
        <Grid container spacing={2} sx={{ mt: 2, mb: 3 }}>
          {[
            { label: 'Total', value: transactions.length, color: 'primary.main' },
            { label: 'Pending', value: transactions.filter((t) => t.status === 'PendingApproval').length, color: 'warning.main' },
            { label: 'Completed', value: transactions.filter((t) => t.status === 'Completed').length, color: 'success.main' },
            { label: 'Failed', value: transactions.filter((t) => t.status === 'Failed').length, color: 'error.main' },
          ].map((s) => (
            <Grid size={{ xs: 6, md: 3 }} key={s.label}>
              <Card>
                <CardContent sx={{ p: 2, textAlign: 'center' }}>
                  <Typography variant="h5" sx={{ fontWeight: 700, color: s.color }}>{s.value}</Typography>
                  <Typography variant="caption" color="text.secondary">{s.label}</Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Tabs */}
        <Tabs value={tab} onChange={(_, v) => setTab(v)} sx={{ mb: 3 }}>
          <Tab label="All" /><Tab label="Pending" /><Tab label="Completed" />
        </Tabs>

        {/* Transactions Table */}
        <Card>
          <CardContent sx={{ p: 0 }}>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Transaction</TableCell>
                    <TableCell>Type</TableCell>
                    <TableCell>Amount</TableCell>
                    <TableCell>Recipient</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell align="right">Approvals</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filtered.map((tx) => {
                    const statusColor = STATUS_COLORS[tx.status] || '#9393B8';
                    return (
                      <TableRow key={tx.id} hover>
                        <TableCell>
                          <Typography variant="body2" sx={{ fontWeight: 500 }}>{tx.memo || tx.type}</Typography>
                          <Typography variant="caption" color="text.secondary">{tx.id}</Typography>
                        </TableCell>
                        <TableCell><Chip label={tx.type} size="small" variant="outlined" sx={{ fontSize: '0.7rem' }} /></TableCell>
                        <TableCell sx={{ fontWeight: 600 }}>{formatCurrency(tx.amount, tx.currency)}</TableCell>
                        <TableCell>
                          <Typography variant="caption" sx={{ fontFamily: 'monospace' }}>
                            {shortenAddress(tx.toAddress)}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: statusColor }} />
                            <Typography variant="caption" sx={{ fontWeight: 500 }}>{tx.status === 'PendingApproval' ? 'Pending' : tx.status}</Typography>
                          </Box>
                        </TableCell>
                        <TableCell align="right">
                          <Chip
                            label={`${tx.approvals.filter((a) => a.status === 'Approved').length}/${tx.requiredApprovals}`}
                            size="small"
                            sx={{
                              fontSize: '0.7rem', fontWeight: 600,
                              bgcolor: tx.approvals.filter((a) => a.status === 'Approved').length >= tx.requiredApprovals
                                ? alpha('#06D6A0', 0.1) : alpha('#F59E0B', 0.1),
                              color: tx.approvals.filter((a) => a.status === 'Approved').length >= tx.requiredApprovals
                                ? 'success.main' : 'warning.main',
                            }}
                          />
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>

        {/* New Payment Dialog */}
        <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="sm" fullWidth>
          <DialogTitle>New Treasury Payment</DialogTitle>
          <DialogContent>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
              <FormControl fullWidth size="small"><InputLabel>Treasury</InputLabel>
                <Select defaultValue="treasury-1" label="Treasury">
                  <MenuItem value="treasury-1">Main Operations Treasury</MenuItem>
                  <MenuItem value="treasury-2">R&D Department Fund</MenuItem>
                  <MenuItem value="treasury-3">Grant Distribution Fund</MenuItem>
                </Select>
              </FormControl>
              <TextField label="Recipient Address" size="small" fullWidth placeholder="GABC..." />
              <TextField label="Amount" size="small" type="number" fullWidth />
              <FormControl fullWidth size="small"><InputLabel>Asset</InputLabel>
                <Select defaultValue="USDC" label="Asset">
                  <MenuItem value="USDC">USDC</MenuItem><MenuItem value="XLM">XLM (Native)</MenuItem>
                </Select>
              </FormControl>
              <TextField label="Memo (optional)" size="small" fullWidth multiline rows={2} />
            </Box>
          </DialogContent>
          <DialogActions sx={{ p: 2.5 }}>
            <Button onClick={() => setDialogOpen(false)} sx={{ textTransform: 'none' }}>Cancel</Button>
            <Button variant="contained" onClick={() => setDialogOpen(false)}
              sx={{ textTransform: 'none', borderRadius: 2.5 }}>
              Submit for Approval
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </AppLayout>
  );
}
