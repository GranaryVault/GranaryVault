'use client';

import { Box, Typography, Card, CardContent, Chip } from '@mui/material';
import { Schedule as PayoutsIcon } from '@mui/icons-material';
import AppLayout from '@/components/Layout/AppLayout';

export default function PayoutsPage() {
  return (
    <AppLayout>
      <Box>
        <Typography variant="h4" sx={{ mb: 1 }}>
          Scheduled Payouts
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
          Schedule future payments, configure recurring disbursements, and manage payment calendars.
        </Typography>
        <Card>
          <CardContent sx={{ p: 6, textAlign: 'center' }}>
            <PayoutsIcon sx={{ fontSize: 64, color: 'primary.light', mb: 2, opacity: 0.4 }} />
            <Typography variant="h5" sx={{ mb: 1 }}>
              Automated Scheduling
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Payroll, vendor payments, grants, contributor compensation, and treasury distributions.
            </Typography>
            <Chip label="Coming in Phase 13" variant="outlined" />
          </CardContent>
        </Card>
      </Box>
    </AppLayout>
  );
}
