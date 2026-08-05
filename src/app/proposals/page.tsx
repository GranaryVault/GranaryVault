'use client';

import { useEffect, useState } from 'react';
import {
  Box, Grid, Card, CardContent, Typography, Button, Chip, alpha, useTheme,
  Dialog, DialogTitle, DialogContent, DialogActions, TextField, Select,
  MenuItem, FormControl, InputLabel, LinearProgress, Avatar, AvatarGroup,
  Tooltip, IconButton,
} from '@mui/material';
import {
  Add as AddIcon, HowToVote as ProposalIcon, ThumbUp as ApproveIcon,
  ThumbDown as RejectIcon, Visibility as ViewIcon,
} from '@mui/icons-material';
import AppLayout from '@/components/Layout/AppLayout';
import { useTreasuryStore } from '@/store/treasuryStore';
import type { ProposalStatus, GovernanceProposal } from '@/types';

const STATUS_CONFIG: Record<ProposalStatus, { label: string; color: string }> = {
  Draft: { label: 'Draft', color: '#9393B8' },
  Submitted: { label: 'Submitted', color: '#3B82F6' },
  UnderReview: { label: 'Under Review', color: '#F59E0B' },
  Approved: { label: 'Approved', color: '#06D6A0' },
  Rejected: { label: 'Rejected', color: '#EF4444' },
  Executed: { label: 'Executed', color: '#7C5CFC' },
  Archived: { label: 'Archived', color: '#64748B' },
};

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(amount);
}

export default function ProposalsPage() {
  const theme = useTheme();
  const { proposals, isLoading, initialize } = useTreasuryStore();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedProposal, setSelectedProposal] = useState<GovernanceProposal | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);

  useEffect(() => { if (proposals.length === 0) initialize(); }, [proposals.length, initialize]);

  return (
    <AppLayout>
      <Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1, flexWrap: 'wrap', gap: 2 }}>
          <Box>
            <Typography variant="h4">Governance Proposals</Typography>
            <Typography variant="body1" color="text.secondary">Create, review, and execute treasury governance proposals.</Typography>
          </Box>
          <Button variant="contained" startIcon={<AddIcon />} onClick={() => setDialogOpen(true)}
            sx={{ borderRadius: 2.5, textTransform: 'none' }}>
            New Proposal
          </Button>
        </Box>

        {/* Summary */}
        <Grid container spacing={2} sx={{ mt: 2, mb: 3 }}>
          {[
            { label: 'Total', value: proposals.length, color: 'primary.main' },
            { label: 'Under Review', value: proposals.filter((p) => p.status === 'UnderReview').length, color: 'warning.main' },
            { label: 'Approved', value: proposals.filter((p) => p.status === 'Approved' || p.status === 'Executed').length, color: 'success.main' },
            { label: 'Rejected', value: proposals.filter((p) => p.status === 'Rejected').length, color: 'error.main' },
          ].map((s) => (
            <Grid size={{ xs: 6, md: 3 }} key={s.label}>
              <Card><CardContent sx={{ p: 2, textAlign: 'center' }}>
                <Typography variant="h5" sx={{ fontWeight: 700, color: s.color }}>{s.value}</Typography>
                <Typography variant="caption" color="text.secondary">{s.label}</Typography>
              </CardContent></Card>
            </Grid>
          ))}
        </Grid>

        {/* Proposal Cards */}
        <Grid container spacing={3}>
          {proposals.map((proposal) => {
            const sc = STATUS_CONFIG[proposal.status];
            const approvedVotes = proposal.votes.filter((v) => v.decision === 'Approve').length;
            return (
              <Grid size={{ xs: 12, md: 6 }} key={proposal.id}>
                <Card sx={{ '&:hover': { borderColor: alpha(theme.palette.primary.main, 0.3) }, cursor: 'pointer' }}
                  onClick={() => { setSelectedProposal(proposal); setDetailOpen(true); }}>
                  <CardContent sx={{ p: 3 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <Box sx={{ width: 40, height: 40, borderRadius: 2,
                          bgcolor: alpha(sc.color, 0.12), display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <ProposalIcon sx={{ color: sc.color }} />
                        </Box>
                        <Box>
                          <Typography variant="body2" sx={{ fontWeight: 600 }}>{proposal.title}</Typography>
                          <Typography variant="caption" color="text.secondary">
                            By {proposal.proposerName} · {new Date(proposal.createdAt).toLocaleDateString()}
                          </Typography>
                        </Box>
                      </Box>
                      <Chip label={sc.label} size="small"
                        sx={{ fontWeight: 600, fontSize: '0.7rem', bgcolor: alpha(sc.color, 0.12), color: sc.color }} />
                    </Box>

                    <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 2 }}>
                      {proposal.description.length > 120 ? proposal.description.slice(0, 120) + '...' : proposal.description}
                    </Typography>

                    {proposal.treasuryAction?.amount && (
                      <Chip label={formatCurrency(proposal.treasuryAction.amount)} size="small" variant="outlined"
                        sx={{ mb: 2, fontWeight: 600, fontSize: '0.75rem' }} />
                    )}

                    {/* Voting progress */}
                    <Box sx={{ mb: 1 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                        <Typography variant="caption" color="text.secondary">Approvals</Typography>
                        <Typography variant="caption" sx={{ fontWeight: 600 }}>
                          {approvedVotes}/{proposal.requiredApprovals}
                        </Typography>
                      </Box>
                      <LinearProgress variant="determinate"
                        value={Math.min((approvedVotes / proposal.requiredApprovals) * 100, 100)}
                        sx={{ height: 6, borderRadius: 3, bgcolor: alpha(theme.palette.primary.main, 0.1),
                          '& .MuiLinearProgress-bar': { borderRadius: 3, bgcolor: approvedVotes >= proposal.requiredApprovals ? 'success.main' : 'primary.main' } }} />
                    </Box>

                    {proposal.votes.length > 0 && (
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <AvatarGroup max={4} sx={{ '& .MuiAvatar-root': { width: 24, height: 24, fontSize: '0.625rem' } }}>
                          {proposal.votes.map((v) => (
                            <Tooltip key={v.id} title={`${v.voterName} — ${v.decision}`}>
                              <Avatar sx={{
                                bgcolor: v.decision === 'Approve' ? alpha('#06D6A0', 0.2) :
                                  v.decision === 'Reject' ? alpha('#EF4444', 0.2) : alpha('#9393B8', 0.2),
                                color: v.decision === 'Approve' ? 'success.main' :
                                  v.decision === 'Reject' ? 'error.main' : 'text.secondary',
                              }}>
                                {v.voterName.charAt(0)}
                              </Avatar>
                            </Tooltip>
                          ))}
                        </AvatarGroup>
                        <Typography variant="caption" color="text.secondary">{proposal.votes.length} votes</Typography>
                      </Box>
                    )}
                  </CardContent>
                </Card>
              </Grid>
            );
          })}
        </Grid>

        {/* Proposal Detail Dialog */}
        <Dialog open={detailOpen} onClose={() => setDetailOpen(false)} maxWidth="md" fullWidth>
          {selectedProposal && (
            <>
              <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                {selectedProposal.title}
                <Chip label={STATUS_CONFIG[selectedProposal.status].label} size="small"
                  sx={{ bgcolor: alpha(STATUS_CONFIG[selectedProposal.status].color, 0.12),
                    color: STATUS_CONFIG[selectedProposal.status].color, fontWeight: 600 }} />
              </DialogTitle>
              <DialogContent dividers>
                <Typography variant="body2" sx={{ mb: 2, lineHeight: 1.7 }}>{selectedProposal.description}</Typography>
                {selectedProposal.treasuryAction && (
                  <Card variant="outlined" sx={{ mb: 3, bgcolor: alpha(theme.palette.primary.main, 0.03) }}>
                    <CardContent sx={{ p: 2 }}>
                      <Typography variant="caption" color="text.secondary">Treasury Action</Typography>
                      {selectedProposal.treasuryAction.amount && (
                        <Typography variant="h6" sx={{ fontWeight: 700 }}>{formatCurrency(selectedProposal.treasuryAction.amount)}</Typography>
                      )}
                      <Typography variant="body2">{selectedProposal.treasuryAction.description}</Typography>
                    </CardContent>
                  </Card>
                )}
                <Typography variant="subtitle2" sx={{ mb: 1 }}>Votes</Typography>
                {selectedProposal.votes.map((v) => (
                  <Box key={v.id} sx={{ display: 'flex', alignItems: 'center', gap: 1, py: 1, borderBottom: `1px solid ${theme.palette.divider}` }}>
                    <Avatar sx={{ width: 28, height: 28, fontSize: '0.75rem', bgcolor: alpha(theme.palette.primary.main, 0.2) }}>
                      {v.voterName.charAt(0)}
                    </Avatar>
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="body2" sx={{ fontWeight: 500 }}>{v.voterName}</Typography>
                      <Typography variant="caption" color="text.secondary">{new Date(v.timestamp).toLocaleString()}</Typography>
                    </Box>
                    <Chip
                      icon={v.decision === 'Approve' ? <ApproveIcon /> : v.decision === 'Reject' ? <RejectIcon /> : undefined}
                      label={v.decision}
                      size="small"
                      color={v.decision === 'Approve' ? 'success' : v.decision === 'Reject' ? 'error' : 'default'}
                    />
                  </Box>
                ))}
              </DialogContent>
              <DialogActions sx={{ p: 2.5 }}>
                <Button startIcon={<RejectIcon />} color="error" sx={{ textTransform: 'none' }}>Reject</Button>
                <Button startIcon={<ApproveIcon />} variant="contained" color="success"
                  sx={{ textTransform: 'none', borderRadius: 2.5 }}>Approve</Button>
              </DialogActions>
            </>
          )}
        </Dialog>

        {/* New Proposal Dialog */}
        <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="sm" fullWidth>
          <DialogTitle>Create Governance Proposal</DialogTitle>
          <DialogContent>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
              <TextField label="Proposal Title" size="small" fullWidth />
              <FormControl fullWidth size="small"><InputLabel>Type</InputLabel>
                <Select defaultValue="TreasuryAction" label="Type">
                  <MenuItem value="TreasuryAction">Treasury Action</MenuItem>
                  <MenuItem value="PolicyChange">Policy Change</MenuItem>
                  <MenuItem value="BudgetAllocation">Budget Allocation</MenuItem>
                  <MenuItem value="SignerChange">Signer Change</MenuItem>
                  <MenuItem value="Other">Other</MenuItem>
                </Select>
              </FormControl>
              <TextField label="Amount (if applicable)" size="small" type="number" fullWidth />
              <TextField label="Description" size="small" fullWidth multiline rows={4} />
              <FormControl fullWidth size="small"><InputLabel>Required Approvals</InputLabel>
                <Select defaultValue={2} label="Required Approvals">
                  {[1, 2, 3, 4, 5].map((n) => <MenuItem key={n} value={n}>{n} approvals</MenuItem>)}
                </Select>
              </FormControl>
            </Box>
          </DialogContent>
          <DialogActions sx={{ p: 2.5 }}>
            <Button onClick={() => setDialogOpen(false)} sx={{ textTransform: 'none' }}>Cancel</Button>
            <Button variant="contained" onClick={() => setDialogOpen(false)}
              sx={{ textTransform: 'none', borderRadius: 2.5 }}>Submit Proposal</Button>
          </DialogActions>
        </Dialog>
      </Box>
    </AppLayout>
  );
}
