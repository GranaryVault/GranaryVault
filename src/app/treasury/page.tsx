'use client';

import { Box, Typography, Card, CardContent, Chip } from '@mui/material';
import { AccountBalance as TreasuryIcon } from '@mui/icons-material';
import AppLayout from '@/components/Layout/AppLayout';

export default function TreasuryPage() {
  return (
    <AppLayout>
      <Box>
        <Typography variant="h4" sx={{ mb: 1 }}>
          Treasury
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
          Multi-signature treasury management and asset allocation.
        </Typography>
        <Card>
          <CardContent sx={{ p: 6, textAlign: 'center' }}>
            <TreasuryIcon sx={{ fontSize: 64, color: 'primary.light', mb: 2, opacity: 0.4 }} />
            <Typography variant="h5" sx={{ mb: 1 }}>
              Treasury Management
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Configure multi-signature wallets, manage asset allocation, and monitor treasury health.
            </Typography>
            <Chip label="Coming in Phase 7" variant="outlined" />
          </CardContent>
        </Card>
      </Box>
    </AppLayout>
  );
}
