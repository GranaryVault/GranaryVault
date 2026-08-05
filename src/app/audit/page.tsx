'use client';

import { useEffect, useState } from 'react';
import {
  Box, Typography, Card, CardContent, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, Chip, alpha, useTheme,
  TextField, Select, MenuItem, FormControl, InputLabel, Button,
} from '@mui/material';
import {
  Receipt as AuditIcon, FilterList as FilterIcon, Download as ExportIcon,
  Search as SearchIcon,
} from '@mui/icons-material';
import AppLayout from '@/components/Layout/AppLayout';
import { useTreasuryStore } from '@/store/treasuryStore';
import type { AuditEntry } from '@/types';

const CATEGORY_COLORS: Record<string, string> = {
  Treasury: '#7C5CFC', Transaction: '#3B82F6', Approval: '#06D6A0',
  Role: '#F59E0B', Policy: '#EC4899', Proposal: '#8B5CF6', Governance: '#9393B8',
};

function timeAgo(dateString: string): string {
  const diffMs = Date.now() - new Date(dateString).getTime();
  const mins = Math.floor(diffMs / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

export default function AuditPage() {
  const theme = useTheme();
  const { auditEntries, isLoading, initialize } = useTreasuryStore();
  const [filter, setFilter] = useState('All');

  useEffect(() => { if (auditEntries.length === 0) initialize(); }, [auditEntries.length, initialize]);

  const categories = ['All', ...new Set(auditEntries.map((e) => e.category))];
  const filtered = filter === 'All' ? auditEntries : auditEntries.filter((e) => e.category === filter);

  return (
    <AppLayout>
      <Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1, flexWrap: 'wrap', gap: 2 }}>
          <Box>
            <Typography variant="h4">Audit Trail</Typography>
            <Typography variant="body1" color="text.secondary">
              Immutable tracking of all treasury actions, approvals, and governance decisions.
            </Typography>
          </Box>
          <Button variant="outlined" startIcon={<ExportIcon />}
            sx={{ borderRadius: 2.5, textTransform: 'none' }}>Export Log</Button>
        </Box>

        {/* Filters */}
        <Card sx={{ mt: 3, mb: 3 }}>
          <CardContent sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
            <TextField size="small" placeholder="Search audit entries..."
              slotProps={{ input: { startAdornment: <SearchIcon sx={{ color: 'text.secondary', mr: 1, fontSize: '1.1rem' }} /> } }}
              sx={{ minWidth: 250 }} />
            <FormControl size="small" sx={{ minWidth: 150 }}>
              <InputLabel>Category</InputLabel>
              <Select value={filter} label="Category" onChange={(e) => setFilter(e.target.value)}>
                {categories.map((c) => <MenuItem key={c} value={c}>{c}</MenuItem>)}
              </Select>
            </FormControl>
            <Typography variant="caption" color="text.secondary" sx={{ ml: 'auto' }}>
              {filtered.length} entries
            </Typography>
          </CardContent>
        </Card>

        {/* Audit Table */}
        <Card>
          <CardContent sx={{ p: 0 }}>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ width: 160 }}>Timestamp</TableCell>
                    <TableCell>User</TableCell>
                    <TableCell>Action</TableCell>
                    <TableCell>Category</TableCell>
                    <TableCell align="right">Amount</TableCell>
                    <TableCell>Details</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filtered.map((entry) => (
                    <TableRow key={entry.id} hover>
                      <TableCell>
                        <Typography variant="caption" sx={{ fontWeight: 500, display: 'block' }}>
                          {new Date(entry.timestamp).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {new Date(entry.timestamp).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" sx={{ fontWeight: 500 }}>{entry.userName}</Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">{entry.action}</Typography>
                      </TableCell>
                      <TableCell>
                        <Chip label={entry.category} size="small"
                          sx={{ fontSize: '0.7rem', fontWeight: 600,
                            bgcolor: alpha(CATEGORY_COLORS[entry.category] || '#9393B8', 0.1),
                            color: CATEGORY_COLORS[entry.category] || '#9393B8' }} />
                      </TableCell>
                      <TableCell align="right">
                        {entry.assetAmount && (
                          <Typography variant="body2" sx={{ fontWeight: 600 }}>
                            {entry.assetAmount.toLocaleString('en-US')} {entry.assetCurrency || ''}
                          </Typography>
                        )}
                      </TableCell>
                      <TableCell>
                        <Typography variant="caption" color="text.secondary">{entry.details}</Typography>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>
      </Box>
    </AppLayout>
  );
}
