'use client';

import { Box, Typography, Card, CardContent, Chip } from '@mui/material';
import { Gavel as PoliciesIcon } from '@mui/icons-material';
import AppLayout from '@/components/Layout/AppLayout';

export default function PoliciesPage() {
  return (
    <AppLayout>
      <Box>
        <Typography variant="h4" sx={{ mb: 1 }}>
          Spending Policies
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
          Configure spending limits, approval thresholds, and treasury policies.
        </Typography>
        <Card>
          <CardContent sx={{ p: 6, textAlign: 'center' }}>
            <PoliciesIcon sx={{ fontSize: 64, color: 'primary.light', mb: 2, opacity: 0.4 }} />
            <Typography variant="h5" sx={{ mb: 1 }}>
              Policy Engine
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Define spending limits, approval thresholds, department budgets, and enforce organizational financial policies.
            </Typography>
            <Chip label="Coming in Phase 11" variant="outlined" />
          </CardContent>
        </Card>
      </Box>
    </AppLayout>
  );
}
