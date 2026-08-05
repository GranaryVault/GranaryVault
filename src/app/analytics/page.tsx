'use client';

import { Box, Typography, Card, CardContent, Chip } from '@mui/material';
import { BarChart as AnalyticsIcon } from '@mui/icons-material';
import AppLayout from '@/components/Layout/AppLayout';

export default function AnalyticsPage() {
  return (
    <AppLayout>
      <Box>
        <Typography variant="h4" sx={{ mb: 1 }}>
          Treasury Analytics
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
          Interactive dashboards for spending trends, budget utilization, and treasury intelligence.
        </Typography>
        <Card>
          <CardContent sx={{ p: 6, textAlign: 'center' }}>
            <AnalyticsIcon sx={{ fontSize: 64, color: 'primary.light', mb: 2, opacity: 0.4 }} />
            <Typography variant="h5" sx={{ mb: 1 }}>
              Treasury Intelligence
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Spending trends, treasury growth, budget utilization, payment volume, and department performance.
            </Typography>
            <Chip label="Coming in Phase 17" variant="outlined" />
          </CardContent>
        </Card>
      </Box>
    </AppLayout>
  );
}
