'use client';

import { Box, Typography, Card, CardContent, Chip } from '@mui/material';
import { Receipt as AuditIcon } from '@mui/icons-material';
import AppLayout from '@/components/Layout/AppLayout';

export default function AuditPage() {
  return (
    <AppLayout>
      <Box>
        <Typography variant="h4" sx={{ mb: 1 }}>
          Audit Trail
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
          Immutable tracking of all treasury actions, approvals, and governance decisions.
        </Typography>
        <Card>
          <CardContent sx={{ p: 6, textAlign: 'center' }}>
            <AuditIcon sx={{ fontSize: 64, color: 'primary.light', mb: 2, opacity: 0.4 }} />
            <Typography variant="h5" sx={{ mb: 1 }}>
              Immutable Audit Records
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Every action is timestamped and tracked: approvals, role changes, policy updates, and treasury operations.
            </Typography>
            <Chip label="Coming in Phase 18" variant="outlined" />
          </CardContent>
        </Card>
      </Box>
    </AppLayout>
  );
}
