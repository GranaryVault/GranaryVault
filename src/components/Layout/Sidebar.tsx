'use client';

import { useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import {
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Box,
  Typography,
  Toolbar,
  useMediaQuery,
  useTheme,
  IconButton,
  alpha,
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  AccountBalance as TreasuryIcon,
  SwapHoriz as TransactionsIcon,
  HowToVote as ProposalsIcon,
  Gavel as PoliciesIcon,
  Schedule as PayoutsIcon,
  Assessment as ReportsIcon,
  BarChart as AnalyticsIcon,
  Receipt as AuditIcon,
  Settings as SettingsIcon,
  Groups as BatchIcon,
  ChevronLeft as ChevronLeftIcon,
} from '@mui/icons-material';
import { useWallet } from '@/context/WalletContext';
import AccountSwitcher from '@/components/Layout/AccountSwitcher';

interface NavItem {
  label: string;
  path: string;
  icon: React.ReactNode;
}

const navItems: NavItem[] = [
  { label: 'Dashboard', path: '/', icon: <DashboardIcon /> },
  { label: 'Treasury', path: '/treasury', icon: <TreasuryIcon /> },
  { label: 'Transactions', path: '/transactions', icon: <TransactionsIcon /> },
  { label: 'Proposals', path: '/proposals', icon: <ProposalsIcon /> },
  { label: 'Policies', path: '/policies', icon: <PoliciesIcon /> },
  { label: 'Payouts', path: '/payouts', icon: <PayoutsIcon /> },
  { label: 'Batch Disburse', path: '/batch', icon: <BatchIcon /> },
  { label: 'Reports', path: '/reports', icon: <ReportsIcon /> },
  { label: 'Analytics', path: '/analytics', icon: <AnalyticsIcon /> },
  { label: 'Audit Trail', path: '/audit', icon: <AuditIcon /> },
  { label: 'Settings', path: '/settings', icon: <SettingsIcon /> },
];

interface SidebarProps {
  drawerWidth: number;
  onMobileToggle?: (open: boolean) => void;
  mobileOpen?: boolean;
}

export default function Sidebar({ drawerWidth, onMobileToggle, mobileOpen: externalMobileOpen }: SidebarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [internalMobileOpen, setInternalMobileOpen] = useState(false);
  const { isConnected } = useWallet();

  const mobileOpen = externalMobileOpen ?? internalMobileOpen;

  const handleNavClick = (path: string) => {
    router.push(path);
    if (isMobile) {
      if (onMobileToggle) onMobileToggle(false);
      else setInternalMobileOpen(false);
    }
  };

  const closeMobile = () => {
    if (onMobileToggle) onMobileToggle(false);
    else setInternalMobileOpen(false);
  };

  const isDark = theme.palette.mode === 'dark';

  const drawerContent = (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Toolbar
        sx={{
          px: 2.5,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          minHeight: '64px !important',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Box
            sx={{
              width: 36,
              height: 36,
              borderRadius: 2,
              background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 700,
              fontSize: '1.1rem',
              color: '#fff',
            }}
          >
            G
          </Box>
          <Typography
            variant="h6"
            sx={{
              fontWeight: 700,
              fontSize: '1.1rem',
              background: `linear-gradient(135deg, ${theme.palette.primary.light}, ${theme.palette.secondary.main})`,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            GranaryVault
          </Typography>
        </Box>
        {isMobile && (
          <IconButton onClick={closeMobile}>
            <ChevronLeftIcon />
          </IconButton>
        )}
      </Toolbar>

      <Box sx={{ px: 2, mb: 2 }}>
        <Typography
          variant="caption"
          sx={{
            px: 1,
            fontWeight: 600,
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            fontSize: '0.7rem',
            color: 'text.secondary',
          }}
        >
          Navigation
        </Typography>
      </Box>

      <Box sx={{ px: 2, mb: 2 }}>
        <AccountSwitcher />
      </Box>

      <List sx={{ px: 1.5, flexGrow: 1 }}>
        {navItems.map((item) => {
          const isActive = pathname === item.path;
          return (
            <ListItemButton
              key={item.path}
              onClick={() => handleNavClick(item.path)}
              sx={{
                borderRadius: 2,
                mb: 0.5,
                minHeight: 44,
                color: isActive ? 'primary.light' : 'text.secondary',
                backgroundColor: isActive
                  ? alpha(theme.palette.primary.main, isDark ? 0.1 : 0.08)
                  : 'transparent',
                '&:hover': {
                  backgroundColor: alpha(theme.palette.primary.main, isDark ? 0.08 : 0.06),
                },
                transition: 'all 0.15s ease',
              }}
            >
              <ListItemIcon
                sx={{
                  minWidth: 40,
                  color: isActive ? 'primary.light' : 'text.secondary',
                }}
              >
                {item.icon}
              </ListItemIcon>
              <ListItemText
                primary={item.label}
                slotProps={{
                  primary: {
                    sx: {
                      fontSize: '0.875rem',
                      fontWeight: isActive ? 600 : 400,
                    },
                  },
                }}
              />
              {isActive && (
                <Box
                  sx={{
                    width: 3,
                    height: 20,
                    borderRadius: 2,
                    backgroundColor: 'primary.main',
                  }}
                />
              )}
            </ListItemButton>
          );
        })}
      </List>

      <Box
        sx={{
          p: 2,
          mx: 1.5,
          mb: 2,
          borderRadius: 3,
          background: isDark
            ? `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.12)}, ${alpha(theme.palette.secondary.main, 0.08)})`
            : `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.06)}, ${alpha(theme.palette.secondary.main, 0.04)})`,
          border: `1px solid ${alpha(theme.palette.primary.main, isDark ? 0.15 : 0.1)}`,
        }}
      >
        <Typography variant="body2" sx={{ fontWeight: 600, mb: 0.5 }}>
          Stellar Testnet
        </Typography>
        <Typography
          variant="caption"
          sx={{ color: isConnected ? theme.palette.success.main : theme.palette.text.secondary }}
        >
          {isConnected ? '● Connected' : '○ Not Connected'}
        </Typography>
      </Box>
    </Box>
  );

  return (
    <>
      {/* Mobile drawer */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={closeMobile}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            backgroundColor: 'background.paper',
          },
        }}
      >
        {drawerContent}
      </Drawer>

      {/* Desktop drawer */}
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: 'none', md: 'block' },
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            backgroundColor: 'background.paper',
          },
        }}
        open
      >
        {drawerContent}
      </Drawer>
    </>
  );
}
