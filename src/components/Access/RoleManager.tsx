'use client';

import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Chip,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  alpha,
  useTheme,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
} from '@mui/material';
import { useState } from 'react';
import {
  PersonAdd as PersonAddIcon,
  Shield as ShieldIcon,
} from '@mui/icons-material';
import type { TreasuryRole, Signer } from '@/types';

interface Member {
  id: string;
  name: string;
  email: string;
  role: TreasuryRole;
  addedAt: string;
}

const ROLE_CONFIG: Record<TreasuryRole, { label: string; color: string; description: string }> = {
  Owner: { label: 'Owner', color: '#7C5CFC', description: 'Full control over all treasury operations and governance.' },
  Administrator: { label: 'Administrator', color: '#3B82F6', description: 'Manages treasury configuration, signers, and policies.' },
  Treasurer: { label: 'Treasurer', color: '#06D6A0', description: 'Creates transactions and manages daily treasury operations.' },
  FinanceManager: { label: 'Finance Manager', color: '#F59E0B', description: 'Oversees budgets, spending policies, and financial reports.' },
  Approver: { label: 'Approver', color: '#EC4899', description: 'Reviews and approves transactions and proposals.' },
  Auditor: { label: 'Auditor', color: '#8B5CF6', description: 'Read-only access to audit trails and financial reports.' },
  Viewer: { label: 'Viewer', color: '#9393B8', description: 'View-only access to treasury balances and activity.' },
};

const MOCK_MEMBERS: Member[] = [
  { id: 'mem-1', name: 'Alice Chen', email: 'alice@granaryvault.io', role: 'Owner', addedAt: '2026-01-15' },
  { id: 'mem-2', name: 'Bob Martinez', email: 'bob@granaryvault.io', role: 'Treasurer', addedAt: '2026-01-15' },
  { id: 'mem-3', name: 'Carol Wu', email: 'carol@granaryvault.io', role: 'Approver', addedAt: '2026-02-01' },
  { id: 'mem-4', name: 'Dan Park', email: 'dan@granaryvault.io', role: 'Auditor', addedAt: '2026-03-10' },
  { id: 'mem-5', name: 'Eve Johnson', email: 'eve@granaryvault.io', role: 'FinanceManager', addedAt: '2026-03-01' },
  { id: 'mem-6', name: 'Frank Torres', email: 'frank@granaryvault.io', role: 'Treasurer', addedAt: '2026-04-01' },
  { id: 'mem-7', name: 'Grace Kim', email: 'grace@granaryvault.io', role: 'Approver', addedAt: '2026-04-01' },
];

export default function RoleManager() {
  const theme = useTheme();
  const [members, setMembers] = useState<Member[]>(MOCK_MEMBERS);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [newName, setNewName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newRole, setNewRole] = useState<TreasuryRole>('Viewer');

  const handleAddMember = () => {
    if (!newName.trim() || !newEmail.trim()) return;
    const member: Member = {
      id: `mem-${Date.now()}`,
      name: newName.trim(),
      email: newEmail.trim(),
      role: newRole,
      addedAt: new Date().toISOString().split('T')[0],
    };
    setMembers([...members, member]);
    setNewName('');
    setNewEmail('');
    setNewRole('Viewer');
    setDialogOpen(false);
  };

  const roleCounts = members.reduce(
    (acc, m) => {
      acc[m.role] = (acc[m.role] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>
  );

  return (
    <Box>
      {/* Role summary cards */}
      <Grid container spacing={2} sx={{ mb: 4 }}>
        {(Object.entries(ROLE_CONFIG) as [TreasuryRole, typeof ROLE_CONFIG[TreasuryRole]][]).map(([role, config]) => (
          <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }} key={role}>
            <Card
              sx={{
                transition: 'all 0.2s ease',
                '&:hover': { borderColor: alpha(config.color, 0.3) },
              }}
            >
              <CardContent sx={{ p: 2.5 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1.5 }}>
                  <Box
                    sx={{
                      width: 40,
                      height: 40,
                      borderRadius: 2,
                      bgcolor: alpha(config.color, 0.12),
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <ShieldIcon sx={{ color: config.color, fontSize: '1.25rem' }} />
                  </Box>
                  <Box>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      {config.label}
                    </Typography>
                    <Typography variant="caption" sx={{ color: config.color, fontWeight: 500 }}>
                      {roleCounts[role] || 0} member{(roleCounts[role] || 0) !== 1 ? 's' : ''}
                    </Typography>
                  </Box>
                </Box>
                <Typography variant="caption" color="text.secondary" sx={{ display: 'block', lineHeight: 1.5 }}>
                  {config.description}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Member list */}
      <Card>
        <CardContent sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h6">Organization Members</Typography>
            <Button
              variant="contained"
              startIcon={<PersonAddIcon />}
              onClick={() => setDialogOpen(true)}
              sx={{ borderRadius: 2.5, textTransform: 'none' }}
            >
              Add Member
            </Button>
          </Box>
          <List disablePadding>
            {members.map((member) => {
              const roleConfig = ROLE_CONFIG[member.role];
              return (
                <ListItem
                  key={member.id}
                  sx={{
                    borderRadius: 2,
                    mb: 1,
                    border: `1px solid ${theme.palette.divider}`,
                  }}
                >
                  <ListItemAvatar>
                    <Avatar sx={{ bgcolor: alpha(roleConfig.color, 0.15), color: roleConfig.color, fontWeight: 600 }}>
                      {member.name.charAt(0)}
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={member.name}
                    secondary={member.email}
                    slotProps={{
                      primary: { sx: { fontWeight: 600, fontSize: '0.875rem' } },
                    }}
                  />
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Chip
                      label={roleConfig.label}
                      size="small"
                      sx={{
                        fontWeight: 600,
                        fontSize: '0.75rem',
                        bgcolor: alpha(roleConfig.color, 0.12),
                        color: roleConfig.color,
                      }}
                    />
                    <Typography variant="caption" color="text.secondary">
                      Joined {member.addedAt}
                    </Typography>
                  </Box>
                </ListItem>
              );
            })}
          </List>
        </CardContent>
      </Card>

      {/* Add member dialog */}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Add Organization Member</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
            <TextField
              label="Full Name"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              fullWidth
            />
            <TextField
              label="Email Address"
              type="email"
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
              fullWidth
            />
            <FormControl fullWidth>
              <InputLabel>Role</InputLabel>
              <Select
                value={newRole}
                label="Role"
                onChange={(e) => setNewRole(e.target.value as TreasuryRole)}
              >
                {Object.entries(ROLE_CONFIG).map(([role, config]) => (
                  <MenuItem key={role} value={role}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: config.color }} />
                      {config.label}
                    </Box>
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2.5 }}>
          <Button onClick={() => setDialogOpen(false)} sx={{ textTransform: 'none' }}>Cancel</Button>
          <Button
            variant="contained"
            onClick={handleAddMember}
            disabled={!newName.trim() || !newEmail.trim()}
            sx={{ textTransform: 'none', borderRadius: 2.5 }}
          >
            Add Member
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
