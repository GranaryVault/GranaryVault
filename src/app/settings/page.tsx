'use client';

import { Box, Typography, Card, CardContent, Chip } from '@mui/material';
import { Settings as SettingsIcon } from '@mui/icons-material';
import AppLayout from '@/components/Layout/AppLayout';

export default function SettingsPage() {
  return (
    <AppLayout>
      <Box>
        <Typography variant="h4" sx={{ mb: 1 }}>
          Settings
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
          Manage organization, roles, integrations, and platform configuration.
        </Typography>
        <Card>
          <CardContent sx={{ p: 6, textAlign: 'center' }}>
            <SettingsIcon sx={{ fontSize: 64, color: 'primary.light', mb: 2, opacity: 0.4 }} />
            <Typography variant="h5" sx={{ mb: 1 }}>
              Platform Configuration
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Role-based access control, webhook integrations, notification preferences, and wallet management.
            </Typography>
            <Chip label="Coming in Phases 10, 19, 20" variant="outlined" />
          </CardContent>
        </Card>
      </Box>
    </AppLayout>
  );
}
