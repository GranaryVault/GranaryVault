'use client';

import { useState } from 'react';
import {
  Box, Typography, Chip, alpha, useTheme, Menu, MenuItem,
  ListItemIcon, ListItemText, Divider, IconButton, Button,
} from '@mui/material';
import {
  AccountBalance as TreasuryIcon, Add as AddIcon,
  KeyboardArrowDown as ArrowIcon, Check as CheckIcon,
} from '@mui/icons-material';
import { useTreasuryStore } from '@/store/treasuryStore';
import { shortenAddress } from '@/lib/stellar';

interface AccountSwitcherProps {
  collapsed?: boolean;
}

export default function AccountSwitcher({ collapsed }: AccountSwitcherProps) {
  const theme = useTheme();
  const { treasuries } = useTreasuryStore();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [active, setActive] = useState(treasuries[0]?.id || '');

  const activeAccount = treasuries.find((t) => t.id === active) || treasuries[0];

  if (treasuries.length === 0) return null;

  return (
    <>
      <Button
        onClick={(e) => setAnchorEl(e.currentTarget)}
        endIcon={<ArrowIcon />}
        sx={{
          width: '100%',
          justifyContent: 'flex-start',
          px: collapsed ? 1 : 1.5,
          py: 1,
          borderRadius: 2,
          textTransform: 'none',
          color: 'text.primary',
          border: `1px solid ${theme.palette.divider}`,
          '&:hover': { borderColor: alpha(theme.palette.primary.main, 0.3), bgcolor: alpha(theme.palette.primary.main, 0.04) },
        }}
      >
        <TreasuryIcon sx={{ mr: collapsed ? 0 : 1, fontSize: '1.25rem', color: 'primary.light' }} />
        {!collapsed && (
          <Box sx={{ textAlign: 'left', overflow: 'hidden', flex: 1 }}>
            <Typography variant="body2" sx={{ fontWeight: 600, fontSize: '0.8rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {activeAccount?.name || 'Select Treasury'}
            </Typography>
            <Typography variant="caption" color="text.secondary" sx={{ fontFamily: 'monospace', fontSize: '0.65rem' }}>
              {activeAccount ? shortenAddress(activeAccount.stellarAddress) : ''}
            </Typography>
          </Box>
        )}
      </Button>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={() => setAnchorEl(null)}
        slotProps={{ paper: { sx: { mt: 1, minWidth: 260, borderRadius: 2 } } }}
      >
        <Box sx={{ px: 2, py: 1 }}>
          <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            Switch Treasury
          </Typography>
        </Box>
        {treasuries.map((t) => (
          <MenuItem
            key={t.id}
            selected={t.id === active}
            onClick={() => { setActive(t.id); setAnchorEl(null); }}
          >
            <ListItemIcon>
              {t.id === active ? <CheckIcon color="primary" /> : <TreasuryIcon />}
            </ListItemIcon>
            <ListItemText
              primary={t.name}
              secondary={shortenAddress(t.stellarAddress)}
              slotProps={{
                primary: { sx: { fontWeight: 600, fontSize: '0.85rem' } },
                secondary: { sx: { fontFamily: 'monospace', fontSize: '0.7rem' } },
              }}
            />
          </MenuItem>
        ))}
        <Divider />
        <MenuItem>
          <ListItemIcon><AddIcon /></ListItemIcon>
          <ListItemText primary="Add New Treasury" />
        </MenuItem>
      </Menu>
    </>
  );
}
