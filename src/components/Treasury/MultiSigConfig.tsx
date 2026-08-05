'use client';

import { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Slider,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  alpha,
  useTheme,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
} from '@mui/material';
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  Shield as ShieldIcon,
} from '@mui/icons-material';
import type { TreasuryRole, Signer } from '@/types';

interface MultiSigConfigProps {
  open: boolean;
  onClose: () => void;
  treasuryName?: string;
  initialSigners?: Signer[];
  initialThreshold?: number;
  onSave: (signers: Signer[], threshold: number) => void;
}

const ROLES: { value: TreasuryRole; label: string; color: string }[] = [
  { value: 'Owner', label: 'Owner', color: '#7C5CFC' },
  { value: 'Administrator', label: 'Admin', color: '#3B82F6' },
  { value: 'Treasurer', label: 'Treasurer', color: '#06D6A0' },
  { value: 'FinanceManager', label: 'Finance Mgr', color: '#F59E0B' },
  { value: 'Approver', label: 'Approver', color: '#06D6A0' },
  { value: 'Auditor', label: 'Auditor', color: '#8B5CF6' },
  { value: 'Viewer', label: 'Viewer', color: '#9393B8' },
];

export default function MultiSigConfig({
  open,
  onClose,
  treasuryName = 'Treasury',
  initialSigners = [],
  initialThreshold = 2,
  onSave,
}: MultiSigConfigProps) {
  const theme = useTheme();
  const [signers, setSigners] = useState<Signer[]>(initialSigners);
  const [threshold, setThreshold] = useState(initialThreshold);
  const [newSignerName, setNewSignerName] = useState('');
  const [newSignerKey, setNewSignerKey] = useState('');
  const [newSignerRole, setNewSignerRole] = useState<TreasuryRole>('Approver');
  const [newSignerWeight, setNewSignerWeight] = useState(1);

  const totalWeight = signers.reduce((s, si) => s + si.weight, 0);

  const handleAddSigner = () => {
    if (!newSignerName.trim() || !newSignerKey.trim()) return;
    const newSigner: Signer = {
      id: `signer-${Date.now()}`,
      name: newSignerName.trim(),
      stellarPublicKey: newSignerKey.trim(),
      role: newSignerRole,
      weight: newSignerWeight,
      addedAt: new Date().toISOString(),
    };
    setSigners([...signers, newSigner]);
    setNewSignerName('');
    setNewSignerKey('');
    setNewSignerRole('Approver');
    setNewSignerWeight(1);
  };

  const handleRemoveSigner = (id: string) => {
    setSigners(signers.filter((s) => s.id !== id));
  };

  const handleSave = () => {
    onSave(signers, threshold);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <ShieldIcon color="primary" />
        Configure Multi-Signature: {treasuryName}
      </DialogTitle>

      <DialogContent dividers>
        {/* Threshold Configuration */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
            Approval Threshold
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Set the minimum total signer weight required to approve transactions.
          </Typography>
          <Box sx={{ px: 2 }}>
            <Slider
              value={threshold}
              onChange={(_, val) => setThreshold(val as number)}
              min={1}
              max={Math.max(totalWeight, 5)}
              step={1}
              marks={[
                { value: 1, label: '1' },
                { value: Math.max(totalWeight, 5), label: String(Math.max(totalWeight, 5)) },
              ]}
              valueLabelDisplay="auto"
              sx={{
                color: theme.palette.primary.main,
                '& .MuiSlider-thumb': {
                  width: 20,
                  height: 20,
                },
              }}
            />
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
              <Typography variant="caption" color="text.secondary">
                Total signer weight: {totalWeight}
              </Typography>
              <Typography
                variant="caption"
                sx={{
                  color: totalWeight >= threshold ? 'success.main' : 'error.main',
                  fontWeight: 600,
                }}
              >
                {totalWeight >= threshold ? '✓ Threshold met' : '⚠ Threshold not met'}
              </Typography>
            </Box>
          </Box>
        </Box>

        <Divider sx={{ mb: 3 }} />

        {/* Signer List */}
        <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
          Signers ({signers.length})
        </Typography>

        <List disablePadding>
          {signers.map((signer) => {
            const roleInfo = ROLES.find((r) => r.value === signer.role);
            return (
              <ListItem
                key={signer.id}
                sx={{
                  borderRadius: 2,
                  mb: 1,
                  bgcolor: alpha(theme.palette.primary.main, 0.03),
                  border: `1px solid ${theme.palette.divider}`,
                }}
              >
                <ListItemText
                  primary={signer.name}
                  secondary={signer.stellarPublicKey}
                  slotProps={{
                    primary: { sx: { fontWeight: 600, fontSize: '0.875rem' } },
                    secondary: { sx: { fontFamily: 'monospace' } },
                  }}
                />
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mr: 1 }}>
                  <Chip
                    label={roleInfo?.label || signer.role}
                    size="small"
                    sx={{
                      fontSize: '0.7rem',
                      fontWeight: 500,
                      bgcolor: alpha(roleInfo?.color || '#9393B8', 0.12),
                      color: roleInfo?.color || '#9393B8',
                    }}
                  />
                  <Chip
                    label={`Weight: ${signer.weight}`}
                    size="small"
                    variant="outlined"
                    sx={{ fontSize: '0.7rem' }}
                  />
                </Box>
                <ListItemSecondaryAction>
                  <IconButton size="small" onClick={() => handleRemoveSigner(signer.id)}>
                    <DeleteIcon fontSize="small" color="error" />
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>
            );
          })}
          {signers.length === 0 && (
            <Box sx={{ textAlign: 'center', py: 4, color: 'text.secondary' }}>
              <Typography variant="body2">No signers added yet.</Typography>
              <Typography variant="caption">Add signers below to configure multi-signature.</Typography>
            </Box>
          )}
        </List>

        <Divider sx={{ my: 3 }} />

        {/* Add Signer Form */}
        <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
          Add Signer
        </Typography>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
            <TextField
              label="Signer Name"
              size="small"
              value={newSignerName}
              onChange={(e) => setNewSignerName(e.target.value)}
              sx={{ flex: 1, minWidth: 200 }}
            />
            <FormControl size="small" sx={{ minWidth: 140 }}>
              <InputLabel>Role</InputLabel>
              <Select
                value={newSignerRole}
                label="Role"
                onChange={(e) => setNewSignerRole(e.target.value as TreasuryRole)}
              >
                {ROLES.map((role) => (
                  <MenuItem key={role.value} value={role.value}>
                    {role.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl size="small" sx={{ minWidth: 100 }}>
              <InputLabel>Weight</InputLabel>
              <Select
                value={newSignerWeight}
                label="Weight"
                onChange={(e) => setNewSignerWeight(Number(e.target.value))}
              >
                {[1, 2, 3, 4, 5].map((w) => (
                  <MenuItem key={w} value={w}>{w}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
          <TextField
            label="Stellar Public Key"
            size="small"
            value={newSignerKey}
            onChange={(e) => setNewSignerKey(e.target.value)}
            placeholder="GABC..."
            fullWidth
          />
          <Button
            variant="outlined"
            startIcon={<AddIcon />}
            onClick={handleAddSigner}
            disabled={!newSignerName.trim() || !newSignerKey.trim()}
            sx={{ alignSelf: 'flex-start', borderRadius: 2.5, textTransform: 'none' }}
          >
            Add Signer
          </Button>
        </Box>
      </DialogContent>

      <DialogActions sx={{ p: 2.5 }}>
        <Button onClick={onClose} sx={{ textTransform: 'none' }}>Cancel</Button>
        <Button
          variant="contained"
          onClick={handleSave}
          disabled={totalWeight < threshold}
          sx={{ textTransform: 'none', fontWeight: 600, borderRadius: 2.5 }}
        >
          Save Configuration
        </Button>
      </DialogActions>
    </Dialog>
  );
}
