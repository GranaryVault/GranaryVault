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
} from '@mui/material';
import {
  Menu as MenuIcon,
  NotificationsOutlined as NotificationsIcon,
  AccountBalanceWalletOutlined as WalletIcon,
  MoreVert as MoreIcon,
  DarkMode as DarkModeIcon,
  LightMode as LightModeIcon,
} from '@mui/icons-material';
import { useThemeMode } from '@/theme/ThemeRegistry';

interface HeaderProps {
  drawerWidth: number;
  onMenuClick?: () => void;
}

export default function Header({ drawerWidth, onMenuClick }: HeaderProps) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { mode, toggleTheme } = useThemeMode();

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

          <Tooltip title="Connect Wallet">
            <Button
              variant="outlined"
              size="small"
              startIcon={<WalletIcon />}
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
              Connect Wallet
            </Button>
          </Tooltip>

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
