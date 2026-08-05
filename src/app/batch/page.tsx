'use client';

import { useEffect, useState } from 'react';
import {
  Box, Grid, Card, CardContent, Typography, Button, Chip, alpha, useTheme,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  LinearProgress, Stepper, Step, StepLabel, Dialog, DialogTitle,
  DialogContent, DialogActions, TextField, Select, MenuItem, FormControl, InputLabel,
} from '@mui/material';
import {
  Upload as UploadIcon, Groups as BatchIcon, CheckCircle as CheckIcon,
  Error as ErrorIcon, HourglassEmpty as PendingIcon, Add as AddIcon,
} from '@mui/icons-material';
import AppLayout from '@/components/Layout/AppLayout';
import { useTreasuryStore } from '@/store/treasuryStore';
import { shortenAddress } from '@/lib/stellar';

function formatCurrency(amount: number, currency?: string): string {
  const cur = currency || 'USD';
  if (['USD', 'EUR', 'GBP'].includes(cur)) return new Intl.NumberFormat('en-US', { style: 'currency', currency: cur, maximumFractionDigits: 0 }).format(amount);
  return `${amount.toLocaleString('en-US')} ${cur}`;
}

const MOCK_RECIPIENTS = [
  { id: 'r1', name: 'Contributor A', address: 'GCON...A111', amount: 2500, status: 'Completed' as const },
  { id: 'r2', name: 'Contributor B', address: 'GCON...B222', amount: 1800, status: 'Completed' as const },
  { id: 'r3', name: 'Contributor C', address: 'GCON...C333', amount: 3200, status: 'Processing' as const },
  { id: 'r4', name: 'Contributor D', address: 'GCON...D444', amount: 1500, status: 'Pending' as const },
  { id: 'r5', name: 'Contributor E', address: 'GNVALID...5', amount: 2100, status: 'Invalid' as const },
  { id: 'r6', name: 'Contributor F', address: 'GCON...F666', amount: 1900, status: 'Pending' as const },
];

export default function BatchPage() {
  const theme = useTheme();
  const { batches, isLoading, initialize } = useTreasuryStore();
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => { if (batches.length === 0) initialize(); }, [batches.length, initialize]);

  const completed = MOCK_RECIPIENTS.filter((r) => r.status === 'Completed').length;
  const total = MOCK_RECIPIENTS.length;

  return (
    <AppLayout>
      <Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1, flexWrap: 'wrap', gap: 2 }}>
          <Box>
            <Typography variant="h4">Batch Disbursement</Typography>
            <Typography variant="body1" color="text.secondary">Upload recipients, validate addresses, and execute batch disbursements.</Typography>
          </Box>
          <Button variant="contained" startIcon={<UploadIcon />} onClick={() => setDialogOpen(true)}
            sx={{ borderRadius: 2.5, textTransform: 'none' }}>
            New Batch
          </Button>
        </Box>

        {/* Batch History */}
        <Typography variant="h6" sx={{ mt: 3, mb: 2 }}>Batch History</Typography>
        {batches.map((batch) => (
          <Card key={batch.id} sx={{ mb: 2, '&:hover': { borderColor: alpha(theme.palette.primary.main, 0.3) } }}>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 2 }}>
                <Box>
                  <Typography variant="body2" sx={{ fontWeight: 600, mb: 0.5 }}>{batch.name}</Typography>
                  <Typography variant="caption" color="text.secondary">
                    {batch.totalRecipients} recipients · {formatCurrency(batch.totalAmount, batch.currency)}
                  </Typography>
                </Box>
                <Chip
                  label={batch.status}
                  size="small"
                  sx={{
                    fontWeight: 600, fontSize: '0.7rem',
                    bgcolor: batch.status === 'Completed' ? alpha('#06D6A0', 0.1) :
                      batch.status === 'PendingApproval' ? alpha('#F59E0B', 0.1) : alpha('#3B82F6', 0.1),
                    color: batch.status === 'Completed' ? 'success.main' :
                      batch.status === 'PendingApproval' ? 'warning.main' : 'info.main',
                  }}
                />
              </Box>
              <Box sx={{ mt: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
                <LinearProgress
                  variant="determinate"
                  value={batch.totalRecipients > 0 ? (batch.completedRecipients / batch.totalRecipients) * 100 : 0}
                  sx={{ flex: 1, height: 6, borderRadius: 3, bgcolor: alpha(theme.palette.primary.main, 0.1),
                    '& .MuiLinearProgress-bar': { borderRadius: 3, bgcolor: theme.palette.primary.main } }}
                />
                <Typography variant="caption" sx={{ fontWeight: 600, whiteSpace: 'nowrap' }}>
                  {batch.completedRecipients}/{batch.totalRecipients}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        ))}

        {/* Live Batch Preview */}
        <Typography variant="h6" sx={{ mt: 4, mb: 2 }}>Current Batch Preview</Typography>
        <Card>
          <CardContent sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, flexWrap: 'wrap', gap: 2 }}>
              <Box>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>Contributor Rewards — August 2026</Typography>
                <Typography variant="caption" color="text.secondary">
                  Total: {formatCurrency(MOCK_RECIPIENTS.reduce((s, r) => s + r.amount, 0), 'USDC')} · 6 recipients
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Button size="small" variant="outlined" sx={{ borderRadius: 2, textTransform: 'none', fontSize: '0.75rem' }}>
                  Validate All
                </Button>
                <Button size="small" variant="contained" sx={{ borderRadius: 2, textTransform: 'none', fontSize: '0.75rem' }}>
                  Execute Batch
                </Button>
              </Box>
            </Box>

            <LinearProgress variant="determinate" value={(completed / total) * 100}
              sx={{ height: 6, borderRadius: 3, mb: 3, bgcolor: alpha(theme.palette.primary.main, 0.1),
                '& .MuiLinearProgress-bar': { borderRadius: 3 } }} />

            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Recipient</TableCell>
                    <TableCell>Address</TableCell>
                    <TableCell align="right">Amount</TableCell>
                    <TableCell align="center">Status</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {MOCK_RECIPIENTS.map((r) => (
                    <TableRow key={r.id} hover>
                      <TableCell sx={{ fontWeight: 500 }}>{r.name}</TableCell>
                      <TableCell>
                        <Typography variant="caption" sx={{ fontFamily: 'monospace', color: r.status === 'Invalid' ? 'error.main' : 'text.secondary' }}>
                          {shortenAddress(r.address)}
                        </Typography>
                      </TableCell>
                      <TableCell align="right" sx={{ fontWeight: 600 }}>{formatCurrency(r.amount, 'USDC')}</TableCell>
                      <TableCell align="center">
                        {r.status === 'Completed' ? <CheckIcon sx={{ color: 'success.main', fontSize: '1.1rem' }} /> :
                          r.status === 'Invalid' ? <ErrorIcon sx={{ color: 'error.main', fontSize: '1.1rem' }} /> :
                            r.status === 'Processing' ? <Chip label="Processing" size="small" color="info" sx={{ fontSize: '0.65rem' }} /> :
                              <PendingIcon sx={{ color: alpha(theme.palette.text.secondary, 0.3), fontSize: '1.1rem' }} />}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>

        {/* New Batch Dialog */}
        <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="sm" fullWidth>
          <DialogTitle>Create Batch Disbursement</DialogTitle>
          <DialogContent>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
              <TextField label="Batch Name" size="small" fullWidth />
              <FormControl fullWidth size="small"><InputLabel>Treasury</InputLabel>
                <Select defaultValue="treasury-1" label="Treasury">
                  <MenuItem value="treasury-1">Main Operations Treasury</MenuItem>
                  <MenuItem value="treasury-3">Grant Distribution Fund</MenuItem>
                </Select>
              </FormControl>
              <Box sx={{ border: `1px dashed ${theme.palette.divider}`, borderRadius: 2, p: 4, textAlign: 'center' }}>
                <UploadIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 1, opacity: 0.4 }} />
                <Typography variant="body2" sx={{ mb: 1 }}>Upload CSV with recipient addresses and amounts</Typography>
                <Button variant="outlined" size="small" component="label" sx={{ borderRadius: 2, textTransform: 'none' }}>
                  Choose File
                  <input type="file" accept=".csv" hidden />
                </Button>
              </Box>
            </Box>
          </DialogContent>
          <DialogActions sx={{ p: 2.5 }}>
            <Button onClick={() => setDialogOpen(false)} sx={{ textTransform: 'none' }}>Cancel</Button>
            <Button variant="contained" onClick={() => setDialogOpen(false)}
              sx={{ textTransform: 'none', borderRadius: 2.5 }}>Create Batch</Button>
          </DialogActions>
        </Dialog>
      </Box>
    </AppLayout>
  );
}
