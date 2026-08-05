'use client';

import { useEffect, useState } from 'react';
import {
  Box, Grid, Card, CardContent, Typography, Button, Chip, alpha, useTheme,
  Dialog, DialogTitle, DialogContent, DialogActions, TextField, Select, MenuItem,
  FormControl, InputLabel, IconButton, List, ListItem, LinearProgress,
} from '@mui/material';
import {
  Add as AddIcon, Gavel as PolicyIcon, Delete as DeleteIcon,
  TrendingUp as BudgetIcon, Shield as ShieldIcon,
} from '@mui/icons-material';
import AppLayout from '@/components/Layout/AppLayout';
import { useTreasuryStore } from '@/store/treasuryStore';
import type { SpendingPolicy, PolicyRule, DepartmentBudget } from '@/types';

const POLICY_TYPE_LABELS: Record<string, string> = {
  SpendingLimit: 'Spending Limit',
  ApprovalThreshold: 'Approval Threshold',
  DepartmentBudget: 'Department Budget',
  HighValueRestriction: 'High Value Restriction',
};

const MOCK_BUDGETS: DepartmentBudget[] = [
  { id: 'bud-1', department: 'Marketing', allocatedAmount: 250000, spentAmount: 195000, currency: 'USDC', period: 'Q3 2026', policyId: 'policy-3' },
  { id: 'bud-2', department: 'Engineering', allocatedAmount: 500000, spentAmount: 320000, currency: 'USDC', period: 'Q3 2026', policyId: 'policy-1' },
  { id: 'bud-3', department: 'Operations', allocatedAmount: 150000, spentAmount: 98000, currency: 'USDC', period: 'Q3 2026', policyId: 'policy-1' },
  { id: 'bud-4', department: 'R&D', allocatedAmount: 300000, spentAmount: 210000, currency: 'USDC', period: 'Q3 2026', policyId: 'policy-1' },
];

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(amount);
}

export default function PoliciesPage() {
  const theme = useTheme();
  const { policies, isLoading, initialize } = useTreasuryStore();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [newPolicyName, setNewPolicyName] = useState('');
  const [newPolicyType, setNewPolicyType] = useState<string>('SpendingLimit');
  const [newPolicyDesc, setNewPolicyDesc] = useState('');

  useEffect(() => {
    if (policies.length === 0) initialize();
  }, [policies.length, initialize]);

  return (
    <AppLayout>
      <Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1, flexWrap: 'wrap', gap: 2 }}>
          <Box>
            <Typography variant="h4">Spending Policies</Typography>
            <Typography variant="body1" color="text.secondary">
              Configure spending limits, approval thresholds, and department budgets.
            </Typography>
          </Box>
          <Button variant="contained" startIcon={<AddIcon />} onClick={() => setDialogOpen(true)}
            sx={{ borderRadius: 2.5, textTransform: 'none' }}>
            New Policy
          </Button>
        </Box>

        {/* Active Policies */}
        <Typography variant="h6" sx={{ mt: 3, mb: 2 }}>Active Policies</Typography>
        <Grid container spacing={3} sx={{ mb: 4 }}>
          {policies.map((policy) => (
            <Grid size={{ xs: 12, md: 6 }} key={policy.id}>
              <Card sx={{ '&:hover': { borderColor: alpha(theme.palette.primary.main, 0.3) } }}>
                <CardContent sx={{ p: 3 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                      <Box sx={{ width: 40, height: 40, borderRadius: 2, bgcolor: alpha(theme.palette.primary.main, 0.12),
                        display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <PolicyIcon sx={{ color: 'primary.light' }} />
                      </Box>
                      <Box>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>{policy.name}</Typography>
                        <Typography variant="caption" color="text.secondary">
                          {POLICY_TYPE_LABELS[policy.type] || policy.type}
                        </Typography>
                      </Box>
                    </Box>
                    <Chip label="Active" size="small" color="success" variant="outlined" sx={{ fontSize: '0.7rem' }} />
                  </Box>
                  <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 2 }}>
                    {policy.description}
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {policy.rules.map((rule, i) => (
                      <Chip key={i}
                        label={`${rule.field} ${rule.operator} ${rule.value} → ${rule.action}`}
                        size="small"
                        sx={{ fontSize: '0.7rem', bgcolor: alpha(theme.palette.warning.main, 0.08), color: 'warning.light' }}
                      />
                    ))}
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Department Budgets */}
        <Typography variant="h6" sx={{ mb: 2 }}>Department Budgets</Typography>
        <Grid container spacing={3}>
          {MOCK_BUDGETS.map((budget) => {
            const pct = Math.round((budget.spentAmount / budget.allocatedAmount) * 100);
            const isOver = pct > 90;
            const isWarn = pct > 75;
            return (
              <Grid size={{ xs: 12, sm: 6, lg: 3 }} key={budget.id}>
                <Card>
                  <CardContent sx={{ p: 2.5 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
                      <BudgetIcon sx={{ color: isOver ? 'error.main' : isWarn ? 'warning.main' : 'primary.light', fontSize: '1.25rem' }} />
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>{budget.department}</Typography>
                    </Box>
                    <Typography variant="h6" sx={{ fontWeight: 700, mb: 0.5 }}>
                      {formatCurrency(budget.spentAmount)} / {formatCurrency(budget.allocatedAmount)}
                    </Typography>
                    <LinearProgress
                      variant="determinate"
                      value={Math.min(pct, 100)}
                      sx={{
                        height: 6, borderRadius: 3, mb: 1,
                        bgcolor: alpha(theme.palette.primary.main, 0.1),
                        '& .MuiLinearProgress-bar': {
                          borderRadius: 3,
                          bgcolor: isOver ? 'error.main' : isWarn ? 'warning.main' : 'primary.main',
                        },
                      }}
                    />
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="caption" color="text.secondary">{budget.period}</Typography>
                      <Typography variant="caption" sx={{ fontWeight: 600, color: isOver ? 'error.main' : isWarn ? 'warning.main' : 'success.main' }}>
                        {pct}%
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            );
          })}
        </Grid>

        {/* New Policy Dialog */}
        <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="sm" fullWidth>
          <DialogTitle>Create Spending Policy</DialogTitle>
          <DialogContent>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
              <TextField label="Policy Name" value={newPolicyName}
                onChange={(e) => setNewPolicyName(e.target.value)} fullWidth />
              <FormControl fullWidth>
                <InputLabel>Policy Type</InputLabel>
                <Select value={newPolicyType} label="Policy Type"
                  onChange={(e) => setNewPolicyType(e.target.value)}>
                  {Object.entries(POLICY_TYPE_LABELS).map(([k, v]) => (
                    <MenuItem key={k} value={k}>{v}</MenuItem>
                  ))}
                </Select>
              </FormControl>
              <TextField label="Description" value={newPolicyDesc}
                onChange={(e) => setNewPolicyDesc(e.target.value)} multiline rows={3} fullWidth />
            </Box>
          </DialogContent>
          <DialogActions sx={{ p: 2.5 }}>
            <Button onClick={() => setDialogOpen(false)} sx={{ textTransform: 'none' }}>Cancel</Button>
            <Button variant="contained" disabled={!newPolicyName.trim()}
              onClick={() => setDialogOpen(false)} sx={{ textTransform: 'none', borderRadius: 2.5 }}>
              Create Policy
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </AppLayout>
  );
}
