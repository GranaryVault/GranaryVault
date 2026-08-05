'use client';

import { useState } from 'react';
import { Box, Typography, Tabs, Tab } from '@mui/material';
import AppLayout from '@/components/Layout/AppLayout';
import RoleManager from '@/components/Access/RoleManager';
import PermissionMatrix from '@/components/Access/PermissionMatrix';
import NotificationsPanel from '@/components/Settings/NotificationsPanel';
import WebhooksPanel from '@/components/Settings/WebhooksPanel';

export default function SettingsPage() {
  const [tab, setTab] = useState(0);

  return (
    <AppLayout>
      <Box>
        <Typography variant="h4" sx={{ mb: 1 }}>
          Settings & Configuration
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
          Manage organization members, roles, notifications, integrations, and platform settings.
        </Typography>

        <Tabs value={tab} onChange={(_, v) => setTab(v)} sx={{ mb: 3 }}>
          <Tab label="Access Control" />
          <Tab label="Notifications" />
          <Tab label="Webhooks" />
        </Tabs>

        {tab === 0 && (
          <Box>
            <Box sx={{ mb: 4 }}><RoleManager /></Box>
            <Box><PermissionMatrix /></Box>
          </Box>
        )}
        {tab === 1 && <NotificationsPanel />}
        {tab === 2 && <WebhooksPanel />}
      </Box>
    </AppLayout>
  );
}
