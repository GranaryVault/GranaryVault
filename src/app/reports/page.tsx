'use client';

import { Box, Typography, Card, CardContent, Chip } from '@mui/material';
import { Assessment as ReportsIcon } from '@mui/icons-material';
import AppLayout from '@/components/Layout/AppLayout';

export default function ReportsPage() {
  return (
    <AppLayout>
      <Box>
        <Typography variant="h4" sx={{ mb: 1 }}>
          Financial Reports
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
          Generate and export comprehensive treasury and financial reports.
        </Typography>
        <Card>
          <CardContent sx={{ p: 6, textAlign: 'center' }}>
            <ReportsIcon sx={{ fontSize: 64, color: 'primary.light', mb: 2, opacity: 0.4 }} />
            <Typography variant="h5" sx={{ mb: 1 }}>
              Financial Reporting
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Treasury balances, spending summaries, payment history, asset allocation, and budget utilization.
            </Typography>
            <Chip label="Coming in Phase 16" variant="outlined" />
          </CardContent>
        </Card>
      </Box>
    </AppLayout>
  );
}
