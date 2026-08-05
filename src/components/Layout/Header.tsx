'use client';

import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Box,
  Avatar,
  Badge,
  Button,
  alpha,
  useMediaQuery,
  useTheme,
  Tooltip,
  Chip,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Divider,
} from '@mui/material';
import { useState } from 'react';
import {
  Menu as MenuIcon,
  NotificationsOutlined as NotificationsIcon,
  AccountBalanceWalletOutlined as WalletIcon,
  MoreVert as MoreIcon,
  DarkMode as DarkModeIcon,
  LightMode as LightModeIcon,
  ContentCopy as CopyIcon,
  OpenInNew as OpenIcon,
  Logout as LogoutIcon,
  CheckCircle as CheckCircleIcon,
} from '@mui/icons-material';
import { useThemeMode } from '@/theme/ThemeRegistry';
import { useWallet } from '@/context/WalletContext';
import { shortenAddress, getExplorerAccountUrl } from '@/lib/stellar';

interface HeaderProps {
  drawerWidth: number;
  onMenuClick?: () => void;
}

export default function Header({ drawerWidth, onMenuClick }: HeaderProps) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { mode, toggleTheme } = useThemeMode();
  const { isInstalled, isConnecting, isConnected, publicKey, error, connect, disconnect } = useWallet();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [copied, setCopied] = useState(false);

  const handleCopyAddress = () => {
    if (publicKey) {
      navigator.clipboard.writeText(publicKey);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleOpenExplorer = () => {
    if (publicKey) {
      window.open(getExplorerAccountUrl(publicKey), '_blank');
    }
  };

  return (
    <AppBar
      position="fixed"
      sx={{
        width: { md: `calc(100% - ${drawerWidth}px)` },
        ml: { md: `${drawerWidth}px` },
        backgroundColor: alpha(
          theme.palette.background.default,
          mode === 'dark' ? 0.85 : 0.95
        ),
        backdropFilter: 'blur(12px)',
        borderBottom: `1px solid ${theme.palette.divider}`,
      }}
      elevation={0}
    >
      <Toolbar sx={{ minHeight: '64px !important', px: { xs: 2, md: 4 } }}>
        {isMobile && (
          <IconButton edge="start" sx={{ mr: 2 }} onClick={onMenuClick}>
            <MenuIcon />
          </IconButton>
        )}

        <Typography
          variant="h6"
          sx={{
            flexGrow: 1,
            fontWeight: 600,
            fontSize: { xs: '1rem', md: '1.1rem' },
            color: 'text.primary',
          }}
        >
          Treasury Dashboard
        </Typography>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {/* Theme toggle */}
          <Tooltip title={mode === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}>
            <IconButton
              onClick={toggleTheme}
              sx={{
                color: 'text.secondary',
                transition: 'all 0.3s ease',
                '&:hover': { color: 'primary.light', transform: 'rotate(20deg)' },
              }}
            >
              {mode === 'dark' ? <LightModeIcon /> : <DarkModeIcon />}
            </IconButton>
          </Tooltip>

          {/* Wallet button */}
          {!isInstalled ? (
            <Tooltip title="Freighter wallet not detected. Install the Freighter browser extension.">
              <Chip
                icon={<WalletIcon />}
                label="Install Freighter"
                size="small"
                variant="outlined"
                color="warning"
                sx={{ fontWeight: 500, borderRadius: 2.5 }}
              />
            </Tooltip>
          ) : isConnected && publicKey ? (
            <>
              <Tooltip title="View wallet details">
                <Button
                  variant="outlined"
                  size="small"
                  onClick={(e) => setAnchorEl(e.currentTarget)}
                  startIcon={<CheckCircleIcon sx={{ color: 'success.main', fontSize: '0.875rem' }} />}
                  sx={{
                    borderRadius: 2.5,
                    borderColor: alpha(theme.palette.success.main, 0.3),
                    color: 'success.light',
                    textTransform: 'none',
                    fontWeight: 500,
                    fontSize: '0.8rem',
                    '&:hover': {
                      borderColor: theme.palette.success.main,
                      backgroundColor: alpha(theme.palette.success.main, 0.06),
                    },
                  }}
                >
                  {shortenAddress(publicKey)}
                </Button>
              </Tooltip>
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={() => setAnchorEl(null)}
                slotProps={{ paper: { sx: { mt: 1, minWidth: 220, borderRadius: 2 } } }}
              >
                <Box sx={{ px: 2, py: 1 }}>
                  <Typography variant="caption" color="text.secondary">
                    Connected Wallet
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600, wordBreak: 'break-all' }}>
                    {publicKey}
                  </Typography>
                </Box>
                <Divider />
                <MenuItem onClick={handleCopyAddress}>
                  <ListItemIcon>
                    {copied ? <CheckCircleIcon fontSize="small" color="success" /> : <CopyIcon fontSize="small" />}
                  </ListItemIcon>
                  <ListItemText>{copied ? 'Copied!' : 'Copy Address'}</ListItemText>
                </MenuItem>
                <MenuItem onClick={handleOpenExplorer}>
                  <ListItemIcon><OpenIcon fontSize="small" /></ListItemIcon>
                  <ListItemText>View on Explorer</ListItemText>
                </MenuItem>
                <Divider />
                <MenuItem onClick={disconnect}>
                  <ListItemIcon><LogoutIcon fontSize="small" color="error" /></ListItemIcon>
                  <ListItemText>Disconnect</ListItemText>
                </MenuItem>
              </Menu>
            </>
          ) : (
            <Tooltip title={error || 'Connect your Freighter wallet'}>
              <Button
                variant="outlined"
                size="small"
                startIcon={<WalletIcon />}
                onClick={connect}
                disabled={isConnecting}
                sx={{
                  borderRadius: 2.5,
                  borderColor: alpha(theme.palette.primary.main, 0.4),
                  color: 'primary.main',
                  textTransform: 'none',
                  fontWeight: 500,
                  display: { xs: 'none', sm: 'flex' },
                  '&:hover': {
                    borderColor: theme.palette.primary.main,
                    backgroundColor: alpha(theme.palette.primary.main, 0.08),
                  },
                }}
              >
                {isConnecting ? 'Connecting...' : 'Connect Wallet'}
              </Button>
            </Tooltip>
          )}

          <Tooltip title="Notifications">
            <IconButton
              sx={{
                color: 'text.secondary',
                '&:hover': { color: 'text.primary' },
              }}
            >
              <Badge badgeContent={3} color="error" variant="dot">
                <NotificationsIcon />
              </Badge>
            </IconButton>
          </Tooltip>

          <Tooltip title="Account">
            <IconButton sx={{ ml: 0.5 }}>
              <Avatar
                sx={{
                  width: 34,
                  height: 34,
                  fontSize: '0.875rem',
                  bgcolor: alpha(theme.palette.primary.main, 0.2),
                  color: 'primary.light',
                  fontWeight: 600,
                }}
              >
                GV
              </Avatar>
            </IconButton>
          </Tooltip>

          <IconButton size="small" sx={{ color: 'text.secondary' }}>
            <MoreIcon fontSize="small" />
          </IconButton>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
