'use client';

import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  alpha,
  useTheme,
  Card,
  CardContent,
} from '@mui/material';
import {
  Check as CheckIcon,
  Close as CloseIcon,
  Remove as PartialIcon,
} from '@mui/icons-material';
import type { TreasuryRole } from '@/types';

type Permission =
  | 'View Balances'
  | 'Create Transactions'
  | 'Approve Transactions'
  | 'Execute Transactions'
  | 'Manage Signers'
  | 'Manage Policies'
  | 'Create Proposals'
  | 'Approve Proposals'
  | 'View Reports'
  | 'Export Reports'
  | 'Manage Roles'
  | 'View Audit Trail'
  | 'Manage Integrations'
  | 'Full Admin';

type Access = 'full' | 'limited' | 'none';

const PERMISSION_MATRIX: Record<TreasuryRole, Record<Permission, Access>> = {
  Owner: {
    'View Balances': 'full',
    'Create Transactions': 'full',
    'Approve Transactions': 'full',
    'Execute Transactions': 'full',
    'Manage Signers': 'full',
    'Manage Policies': 'full',
    'Create Proposals': 'full',
    'Approve Proposals': 'full',
    'View Reports': 'full',
    'Export Reports': 'full',
    'Manage Roles': 'full',
    'View Audit Trail': 'full',
    'Manage Integrations': 'full',
    'Full Admin': 'full',
  },
  Administrator: {
    'View Balances': 'full',
    'Create Transactions': 'full',
    'Approve Transactions': 'full',
    'Execute Transactions': 'full',
    'Manage Signers': 'full',
    'Manage Policies': 'full',
    'Create Proposals': 'full',
    'Approve Proposals': 'full',
    'View Reports': 'full',
    'Export Reports': 'full',
    'Manage Roles': 'full',
    'View Audit Trail': 'full',
    'Manage Integrations': 'limited',
    'Full Admin': 'none',
  },
  Treasurer: {
    'View Balances': 'full',
    'Create Transactions': 'full',
    'Approve Transactions': 'limited',
    'Execute Transactions': 'none',
    'Manage Signers': 'limited',
    'Manage Policies': 'none',
    'Create Proposals': 'full',
    'Approve Proposals': 'limited',
    'View Reports': 'full',
    'Export Reports': 'full',
    'Manage Roles': 'none',
    'View Audit Trail': 'full',
    'Manage Integrations': 'none',
    'Full Admin': 'none',
  },
  FinanceManager: {
    'View Balances': 'full',
    'Create Transactions': 'full',
    'Approve Transactions': 'full',
    'Execute Transactions': 'limited',
    'Manage Signers': 'none',
    'Manage Policies': 'full',
    'Create Proposals': 'limited',
    'Approve Proposals': 'limited',
    'View Reports': 'full',
    'Export Reports': 'full',
    'Manage Roles': 'none',
    'View Audit Trail': 'limited',
    'Manage Integrations': 'none',
    'Full Admin': 'none',
  },
  Approver: {
    'View Balances': 'full',
    'Create Transactions': 'none',
    'Approve Transactions': 'full',
    'Execute Transactions': 'none',
    'Manage Signers': 'none',
    'Manage Policies': 'none',
    'Create Proposals': 'none',
    'Approve Proposals': 'full',
    'View Reports': 'limited',
    'Export Reports': 'none',
    'Manage Roles': 'none',
    'View Audit Trail': 'limited',
    'Manage Integrations': 'none',
    'Full Admin': 'none',
  },
  Auditor: {
    'View Balances': 'full',
    'Create Transactions': 'none',
    'Approve Transactions': 'none',
    'Execute Transactions': 'none',
    'Manage Signers': 'none',
    'Manage Policies': 'none',
    'Create Proposals': 'none',
    'Approve Proposals': 'none',
    'View Reports': 'full',
    'Export Reports': 'full',
    'Manage Roles': 'none',
    'View Audit Trail': 'full',
    'Manage Integrations': 'none',
    'Full Admin': 'none',
  },
  Viewer: {
    'View Balances': 'full',
    'Create Transactions': 'none',
    'Approve Transactions': 'none',
    'Execute Transactions': 'none',
    'Manage Signers': 'none',
    'Manage Policies': 'none',
    'Create Proposals': 'none',
    'Approve Proposals': 'none',
    'View Reports': 'limited',
    'Export Reports': 'none',
    'Manage Roles': 'none',
    'View Audit Trail': 'none',
    'Manage Integrations': 'none',
    'Full Admin': 'none',
  },
};

const PERMISSIONS: Permission[] = [
  'View Balances',
  'Create Transactions',
  'Approve Transactions',
  'Execute Transactions',
  'Manage Signers',
  'Manage Policies',
  'Create Proposals',
  'Approve Proposals',
  'View Reports',
  'Export Reports',
  'Manage Roles',
  'View Audit Trail',
  'Manage Integrations',
  'Full Admin',
];

const ROLES: TreasuryRole[] = [
  'Owner',
  'Administrator',
  'Treasurer',
  'FinanceManager',
  'Approver',
  'Auditor',
  'Viewer',
];

function AccessIcon({ access }: { access: Access }) {
  const theme = useTheme();
  if (access === 'full') {
    return <CheckIcon sx={{ color: theme.palette.success.main, fontSize: '1.1rem' }} />;
  }
  if (access === 'limited') {
    return <PartialIcon sx={{ color: theme.palette.warning.main, fontSize: '1.1rem' }} />;
  }
  return <CloseIcon sx={{ color: alpha(theme.palette.text.secondary, 0.3), fontSize: '1.1rem' }} />;
}

export default function PermissionMatrix() {
  const theme = useTheme();

  return (
    <Card>
      <CardContent sx={{ p: 3 }}>
        <Typography variant="h6" sx={{ mb: 1 }}>
          Permission Matrix
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          Granular permissions for each organizational role across treasury operations.
        </Typography>
        <TableContainer sx={{ overflowX: 'auto' }}>
          <Table size="small" sx={{ minWidth: 900 }}>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 600, minWidth: 180 }}>Permission</TableCell>
                {ROLES.map((role) => (
                  <TableCell key={role} align="center" sx={{ fontWeight: 600, fontSize: '0.75rem' }}>
                    {role === 'FinanceManager' ? 'Finance Mgr' : role}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {PERMISSIONS.map((perm) => (
                <TableRow
                  key={perm}
                  hover
                  sx={{
                    '&:nth-of-type(odd)': {
                      bgcolor: alpha(theme.palette.primary.main, 0.02),
                    },
                  }}
                >
                  <TableCell sx={{ fontWeight: 500, fontSize: '0.8125rem' }}>
                    {perm}
                  </TableCell>
                  {ROLES.map((role) => (
                    <TableCell key={role} align="center">
                      <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                        <AccessIcon access={PERMISSION_MATRIX[role][perm]} />
                      </Box>
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <Box sx={{ display: 'flex', gap: 3, mt: 3, flexWrap: 'wrap' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <CheckIcon sx={{ color: 'success.main', fontSize: '1rem' }} />
            <Typography variant="caption">Full Access</Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <PartialIcon sx={{ color: 'warning.main', fontSize: '1rem' }} />
            <Typography variant="caption">Limited Access</Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <CloseIcon sx={{ color: alpha(theme.palette.text.secondary, 0.3), fontSize: '1rem' }} />
            <Typography variant="caption">No Access</Typography>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
}
