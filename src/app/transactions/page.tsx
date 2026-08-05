'use client';

import { Box, Typography, Card, CardContent, Chip } from '@mui/material';
import { SwapHoriz as TransactionsIcon } from '@mui/icons-material';
import AppLayout from '@/components/Layout/AppLayout';

export default function TransactionsPage() {
  return (
    <AppLayout>
      <Box>
        <Typography variant="h4" sx={{ mb: 1 }}>
          Transactions
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
          Create, approve, and track treasury transactions.
        </Typography>
        <Card>
          <CardContent sx={{ p: 6, textAlign: 'center' }}>
            <TransactionsIcon sx={{ fontSize: 64, color: 'primary.light', mb: 2, opacity: 0.4 }} />
            <Typography variant="h5" sx={{ mb: 1 }}>
              Transaction Management
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Send payments, track transaction lifecycles, and view Stellar transaction hashes.
            </Typography>
            <Chip label="Coming in Phase 12" variant="outlined" />
          </CardContent>
        </Card>
      </Box>
    </AppLayout>
  );
}
