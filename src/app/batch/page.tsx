'use client';

import { Box, Typography, Card, CardContent, Chip } from '@mui/material';
import { Groups as BatchIcon } from '@mui/icons-material';
import AppLayout from '@/components/Layout/AppLayout';

export default function BatchPage() {
  return (
    <AppLayout>
      <Box>
        <Typography variant="h4" sx={{ mb: 1 }}>
          Batch Disbursement
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
          Upload recipients, validate addresses, and execute batch disbursements.
        </Typography>
        <Card>
          <CardContent sx={{ p: 6, textAlign: 'center' }}>
            <BatchIcon sx={{ fontSize: 64, color: 'primary.light', mb: 2, opacity: 0.4 }} />
            <Typography variant="h5" sx={{ mb: 1 }}>
              Batch Payment Engine
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Payroll, grant programs, DAO contributor rewards, and treasury distributions at scale.
            </Typography>
            <Chip label="Coming in Phase 14" variant="outlined" />
          </CardContent>
        </Card>
      </Box>
    </AppLayout>
  );
}
