'use client';

import {
  Box, Typography, Card, CardContent, Switch, FormControlLabel,
  Divider, Chip, alpha, useTheme, List, ListItem, ListItemText,
  ListItemSecondaryAction, IconButton, Button,
} from '@mui/material';
import { useState } from 'react';
import {
  NotificationsActive as NotifIcon, Delete as DeleteIcon,
  CheckCircle as ReadIcon,
} from '@mui/icons-material';
import type { Notification } from '@/types';

const MOCK_NOTIFS: Notification[] = [
  { id: 'n1', type: 'ApprovalRequired', title: 'Approval Needed', message: 'Transaction $22,400 to Acme Corp needs approval', isRead: false, referenceId: 'tx-2', referenceType: 'Transaction', createdAt: '2026-08-05T07:00:00Z' },
  { id: 'n2', type: 'ProposalUpdate', title: 'Proposal Under Review', message: '"Marketing Budget Q3" is now under review', isRead: false, referenceId: 'prop-1', referenceType: 'Proposal', createdAt: '2026-08-02T11:00:00Z' },
  { id: 'n3', type: 'PaymentCompleted', title: 'Payment Completed', message: 'Cloud Services $12,500 has been completed', isRead: false, referenceId: 'tx-1', referenceType: 'Transaction', createdAt: '2026-08-04T10:00:00Z' },
  { id: 'n4', type: 'BudgetThreshold', title: 'Budget Alert', message: 'Marketing department at 78% of Q3 budget', isRead: true, referenceId: 'policy-3', referenceType: 'Policy', createdAt: '2026-08-03T08:00:00Z' },
];

export default function NotificationsPanel() {
  const theme = useTheme();
  const [prefs, setPrefs] = useState({
    approvals: true, payments: true, failed: true,
    budget: true, policy: false, proposals: true,
    payouts: true, activity: false,
  });

  const toggle = (key: keyof typeof prefs) => setPrefs({ ...prefs, [key]: !prefs[key] });

  return (
    <Box>
      <Card sx={{ mb: 3 }}>
        <CardContent sx={{ p: 3 }}>
          <Typography variant="h6" sx={{ mb: 1 }}>Notification Preferences</Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Configure which treasury events trigger notifications.
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            {[
              { key: 'approvals' as const, label: 'Pending Approvals' },
              { key: 'payments' as const, label: 'Completed Payments' },
              { key: 'failed' as const, label: 'Failed Transactions' },
              { key: 'budget' as const, label: 'Budget Thresholds' },
              { key: 'policy' as const, label: 'Policy Violations' },
              { key: 'proposals' as const, label: 'Proposal Updates' },
              { key: 'payouts' as const, label: 'Scheduled Payouts' },
              { key: 'activity' as const, label: 'Treasury Activity' },
            ].map(({ key, label }) => (
              <FormControlLabel key={key}
                control={<Switch checked={prefs[key]} onChange={() => toggle(key)} size="small" />}
                label={<Typography variant="body2">{label}</Typography>}
              />
            ))}
          </Box>
        </CardContent>
      </Card>

      <Card>
        <CardContent sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h6">Recent Notifications</Typography>
            <Button size="small" sx={{ textTransform: 'none' }}>Mark All Read</Button>
          </Box>
          <List disablePadding>
            {MOCK_NOTIFS.map((notif) => (
              <ListItem key={notif.id}
                sx={{ borderRadius: 2, mb: 1, bgcolor: notif.isRead ? 'transparent' : alpha(theme.palette.primary.main, 0.04),
                  border: `1px solid ${theme.palette.divider}` }}>
                <ListItemText
                  primary={notif.title}
                  secondary={notif.message}
                  slotProps={{
                    primary: { sx: { fontWeight: notif.isRead ? 400 : 600, fontSize: '0.875rem' } },
                    secondary: { sx: { fontSize: '0.75rem' } },
                  }}
                />
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  {!notif.isRead && <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: 'primary.main' }} />}
                  <Typography variant="caption" color="text.secondary" sx={{ minWidth: 50, textAlign: 'right' }}>
                    {(() => { const d = new Date(notif.createdAt); return `${d.getMonth()+1}/${d.getDate()}`; })()}
                  </Typography>
                  <IconButton size="small"><DeleteIcon fontSize="small" /></IconButton>
                </Box>
              </ListItem>
            ))}
          </List>
        </CardContent>
      </Card>
    </Box>
  );
}
