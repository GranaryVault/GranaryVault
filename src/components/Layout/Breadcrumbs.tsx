'use client';

import { usePathname } from 'next/navigation';
import {
  Breadcrumbs as MuiBreadcrumbs,
  Link,
  Typography,
  Box,
} from '@mui/material';
import {
  NavigateNext as NavigateNextIcon,
  Home as HomeIcon,
} from '@mui/icons-material';

const routeLabels: Record<string, string> = {
  treasury: 'Treasury',
  transactions: 'Transactions',
  proposals: 'Governance Proposals',
  policies: 'Spending Policies',
  payouts: 'Scheduled Payouts',
  batch: 'Batch Disbursement',
  reports: 'Financial Reports',
  analytics: 'Treasury Analytics',
  audit: 'Audit Trail',
  settings: 'Settings',
};

export default function Breadcrumbs() {
  const pathname = usePathname();

  if (pathname === '/') return null;

  const segments = pathname.split('/').filter(Boolean);

  return (
    <Box sx={{ mb: 1 }}>
      <MuiBreadcrumbs
        separator={<NavigateNextIcon fontSize="small" sx={{ color: 'text.secondary', fontSize: '0.9rem' }} />}
        aria-label="breadcrumb"
      >
        <Link
          href="/"
          underline="none"
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 0.5,
            color: 'text.secondary',
            fontSize: '0.8125rem',
            '&:hover': { color: 'primary.light' },
          }}
        >
          <HomeIcon sx={{ fontSize: '1rem' }} />
          Dashboard
        </Link>
        {segments.map((segment, index) => {
          const isLast = index === segments.length - 1;
          const label = routeLabels[segment] || segment.charAt(0).toUpperCase() + segment.slice(1);
          const href = '/' + segments.slice(0, index + 1).join('/');

          return isLast ? (
            <Typography
              key={href}
              sx={{ fontSize: '0.8125rem', color: 'text.primary', fontWeight: 500 }}
            >
              {label}
            </Typography>
          ) : (
            <Link
              key={href}
              href={href}
              underline="none"
              sx={{
                color: 'text.secondary',
                fontSize: '0.8125rem',
                '&:hover': { color: 'primary.light' },
              }}
            >
              {label}
            </Link>
          );
        })}
      </MuiBreadcrumbs>
    </Box>
  );
}
