'use client';

import { Box, Typography, Card, CardContent, Chip } from '@mui/material';
import { HowToVote as ProposalsIcon } from '@mui/icons-material';
import AppLayout from '@/components/Layout/AppLayout';

export default function ProposalsPage() {
  return (
    <AppLayout>
      <Box>
        <Typography variant="h4" sx={{ mb: 1 }}>
          Governance Proposals
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
          Create, review, and execute treasury governance proposals.
        </Typography>
        <Card>
          <CardContent sx={{ p: 6, textAlign: 'center' }}>
            <ProposalsIcon sx={{ fontSize: 64, color: 'primary.light', mb: 2, opacity: 0.4 }} />
            <Typography variant="h5" sx={{ mb: 1 }}>
              Governance Workflow
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Full proposal lifecycle: Draft → Review → Approve → Execute → Archive.
            </Typography>
            <Chip label="Coming in Phase 15" variant="outlined" />
          </CardContent>
        </Card>
      </Box>
    </AppLayout>
  );
}
