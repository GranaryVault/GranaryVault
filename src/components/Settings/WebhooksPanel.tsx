'use client';

import {
  Box, Typography, Card, CardContent, Button, TextField, Chip,
  alpha, useTheme, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, IconButton, Switch, FormControlLabel,
} from '@mui/material';
import { useState } from 'react';
import {
  Add as AddIcon, Delete as DeleteIcon, CheckCircle as SuccessIcon,
  Error as ErrorIcon, Refresh as RetryIcon,
} from '@mui/icons-material';

const MOCK_WEBHOOKS = [
  { id: 'wh-1', url: 'https://api.acme-corp.com/webhooks/granary', events: ['payment.completed', 'proposal.approved'], isActive: true, lastStatus: 'success' as const },
  { id: 'wh-2', url: 'https://hooks.slack.com/services/T.../B.../xxx', events: ['treasury.updated', 'policy.triggered'], isActive: true, lastStatus: 'success' as const },
];

const MOCK_DELIVERIES = [
  { id: 'd1', webhook: 'wh-1', event: 'payment.completed', status: 'delivered', timestamp: '2026-08-05T07:00:00Z', attempts: 1 },
  { id: 'd2', webhook: 'wh-2', event: 'treasury.updated', status: 'delivered', timestamp: '2026-08-04T14:00:00Z', attempts: 1 },
  { id: 'd3', webhook: 'wh-1', event: 'proposal.approved', status: 'failed', timestamp: '2026-08-03T09:00:00Z', attempts: 3 },
];

const AVAILABLE_EVENTS = [
  'payment.completed', 'treasury.updated', 'proposal.approved',
  'proposal.rejected', 'batch.completed', 'policy.triggered',
  'treasury.threshold_exceeded',
];

export default function WebhooksPanel() {
  const theme = useTheme();
  const [showForm, setShowForm] = useState(false);
  const [newUrl, setNewUrl] = useState('');
  const [selectedEvents, setSelectedEvents] = useState<string[]>([]);

  return (
    <Box>
      <Card sx={{ mb: 3 }}>
        <CardContent sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Box>
              <Typography variant="h6">Webhook Endpoints</Typography>
              <Typography variant="body2" color="text.secondary">
                Configure endpoints to receive real-time treasury events.
              </Typography>
            </Box>
            <Button variant="outlined" startIcon={<AddIcon />} onClick={() => setShowForm(!showForm)}
              sx={{ borderRadius: 2.5, textTransform: 'none' }}>
              Add Webhook
            </Button>
          </Box>

          {showForm && (
            <Card variant="outlined" sx={{ mb: 3, p: 2, bgcolor: alpha(theme.palette.primary.main, 0.02) }}>
              <TextField label="Endpoint URL" size="small" value={newUrl}
                onChange={(e) => setNewUrl(e.target.value)} fullWidth sx={{ mb: 2 }}
                placeholder="https://your-api.com/webhooks/granary" />
              <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1 }}>
                Select events to subscribe to:
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 2 }}>
                {AVAILABLE_EVENTS.map((ev) => (
                  <Chip key={ev} label={ev} size="small"
                    variant={selectedEvents.includes(ev) ? 'filled' : 'outlined'}
                    color={selectedEvents.includes(ev) ? 'primary' : 'default'}
                    onClick={() => setSelectedEvents((prev) =>
                      prev.includes(ev) ? prev.filter((e) => e !== ev) : [...prev, ev])}
                    sx={{ cursor: 'pointer' }} />
                ))}
              </Box>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Button variant="contained" size="small" disabled={!newUrl || selectedEvents.length === 0}
                  sx={{ borderRadius: 2, textTransform: 'none' }}>Save Webhook</Button>
                <Button size="small" onClick={() => setShowForm(false)} sx={{ textTransform: 'none' }}>Cancel</Button>
              </Box>
            </Card>
          )}

          <TableContainer>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Endpoint</TableCell>
                  <TableCell>Events</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {MOCK_WEBHOOKS.map((wh) => (
                  <TableRow key={wh.id}>
                    <TableCell>
                      <Typography variant="caption" sx={{ fontFamily: 'monospace' }}>
                        {wh.url.length > 40 ? wh.url.slice(0, 40) + '...' : wh.url}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                        {wh.events.map((e) => (
                          <Chip key={e} label={e} size="small" variant="outlined" sx={{ fontSize: '0.6rem', height: 20 }} />
                        ))}
                      </Box>
                    </TableCell>
                    <TableCell>
                      <FormControlLabel control={<Switch checked={wh.isActive} size="small" />} label="" />
                    </TableCell>
                    <TableCell align="right">
                      <IconButton size="small" color="error"><DeleteIcon fontSize="small" /></IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      {/* Delivery Log */}
      <Card>
        <CardContent sx={{ p: 3 }}>
          <Typography variant="h6" sx={{ mb: 3 }}>Delivery Log</Typography>
          <TableContainer>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Event</TableCell><TableCell>Status</TableCell>
                  <TableCell>Attempts</TableCell><TableCell>Timestamp</TableCell>
                  <TableCell align="right">Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {MOCK_DELIVERIES.map((d) => (
                  <TableRow key={d.id}>
                    <TableCell><Typography variant="caption" sx={{ fontFamily: 'monospace' }}>{d.event}</Typography></TableCell>
                    <TableCell>
                      {d.status === 'delivered' ? (
                        <Chip icon={<SuccessIcon />} label="Delivered" size="small" color="success" sx={{ fontSize: '0.65rem' }} />
                      ) : (
                        <Chip icon={<ErrorIcon />} label="Failed" size="small" color="error" sx={{ fontSize: '0.65rem' }} />
                      )}
                    </TableCell>
                    <TableCell>{d.attempts}</TableCell>
                    <TableCell>
                      <Typography variant="caption">{new Date(d.timestamp).toLocaleDateString()}</Typography>
                    </TableCell>
                    <TableCell align="right">
                      {d.status === 'failed' && (
                        <IconButton size="small" color="warning"><RetryIcon fontSize="small" /></IconButton>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>
    </Box>
  );
}
