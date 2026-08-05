'use client';

import { Box, Typography } from '@mui/material';
import AppLayout from '@/components/Layout/AppLayout';
import RoleManager from '@/components/Access/RoleManager';
import PermissionMatrix from '@/components/Access/PermissionMatrix';

export default function SettingsPage() {
  return (
    <AppLayout>
      <Box>
        <Typography variant="h4" sx={{ mb: 1 }}>
          Settings & Access Control
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
          Manage organization members, roles, permissions, and platform configuration.
        </Typography>

        <Box sx={{ mb: 4 }}>
          <RoleManager />
        </Box>

        <Box sx={{ mb: 4 }}>
          <PermissionMatrix />
        </Box>
      </Box>
    </AppLayout>
  );
}
