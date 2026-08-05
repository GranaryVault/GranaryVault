'use client';

import { Box, Grid, Card, CardContent, Typography, Button, Chip, alpha, useTheme, IconButton } from '@mui/material';
import {
  Assessment as ReportIcon, Download as DownloadIcon, FilePresent as FileIcon,
  CalendarMonth as CalendarIcon, TrendingUp as TrendIcon, AccountBalance as BalanceIcon,
  PieChart as PieIcon, Receipt as ReceiptIcon,
} from '@mui/icons-material';
import AppLayout from '@/components/Layout/AppLayout';

const REPORTS = [
  { id: 'r1', title: 'Treasury Balance Report', description: 'Current balances across all treasury accounts with asset allocation breakdown.',
    icon: <BalanceIcon />, type: 'Balance', generated: 'Aug 5, 2026' },
  { id: 'r2', title: 'Monthly Spending Summary', description: 'July 2026 spending by category, department, and payment type.',
    icon: <ReceiptIcon />, type: 'Spending', generated: 'Aug 1, 2026' },
  { id: 'r3', title: 'Asset Allocation Analysis', description: 'Distribution of assets across USDC, XLM, and other Stellar assets.',
    icon: <PieIcon />, type: 'Allocation', generated: 'Aug 5, 2026' },
  { id: 'r4', title: 'Department Spending Report', description: 'Budget utilization and spending trends per department for Q3 2026.',
    icon: <TrendIcon />, type: 'Department', generated: 'Aug 4, 2026' },
  { id: 'r5', title: 'Grant Distribution Report', description: 'Grant program disbursements, recipient tracking, and fund allocation.',
    icon: <FileIcon />, type: 'Grant', generated: 'Aug 3, 2026' },
  { id: 'r6', title: 'Payment History Report', description: 'Complete payment history with transaction hashes and settlement status.',
    icon: <CalendarIcon />, type: 'History', generated: 'Aug 5, 2026' },
];

export default function ReportsPage() {
  const theme = useTheme();

  return (
    <AppLayout>
      <Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1, flexWrap: 'wrap', gap: 2 }}>
          <Box>
            <Typography variant="h4">Financial Reports</Typography>
            <Typography variant="body1" color="text.secondary">Generate and export comprehensive treasury and financial reports.</Typography>
          </Box>
          <Button variant="contained" startIcon={<DownloadIcon />}
            sx={{ borderRadius: 2.5, textTransform: 'none' }}>Generate Report</Button>
        </Box>

        <Grid container spacing={3} sx={{ mt: 2 }}>
          {REPORTS.map((report) => (
            <Grid size={{ xs: 12, md: 6, lg: 4 }} key={report.id}>
              <Card sx={{ '&:hover': { borderColor: alpha(theme.palette.primary.main, 0.3) }, height: '100%' }}>
                <CardContent sx={{ p: 3, display: 'flex', flexDirection: 'column', height: '100%' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
                    <Box sx={{ width: 44, height: 44, borderRadius: 2, bgcolor: alpha(theme.palette.primary.main, 0.1),
                      display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Box sx={{ color: 'primary.light' }}>{report.icon}</Box>
                    </Box>
                    <Box>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>{report.title}</Typography>
                      <Chip label={report.type} size="small" variant="outlined" sx={{ fontSize: '0.65rem', height: 20 }} />
                    </Box>
                  </Box>
                  <Typography variant="caption" color="text.secondary" sx={{ flex: 1, mb: 2, lineHeight: 1.6 }}>
                    {report.description}
                  </Typography>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="caption" color="text.secondary">Generated: {report.generated}</Typography>
                    <Box sx={{ display: 'flex', gap: 0.5 }}>
                      <Button size="small" sx={{ textTransform: 'none', fontSize: '0.75rem' }}>View</Button>
                      <IconButton size="small" color="primary"><DownloadIcon fontSize="small" /></IconButton>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
    </AppLayout>
  );
}
