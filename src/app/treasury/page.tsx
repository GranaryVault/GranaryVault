'use client';

import { useEffect, useState } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  Chip,
  alpha,
  useTheme,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  LinearProgress,
  Skeleton,
} from '@mui/material';
import {
  Add as AddIcon,
  PersonAdd as PersonAddIcon,
  Settings as SettingsIcon,
} from '@mui/icons-material';
import AppLayout from '@/components/Layout/AppLayout';
import TreasuryHealthBadge from '@/components/Treasury/TreasuryHealthBadge';
import MultiSigConfig from '@/components/Treasury/MultiSigConfig';
import { useTreasuryStore } from '@/store/treasuryStore';
import { shortenAddress } from '@/lib/stellar';
import type { Signer } from '@/types';

function formatCurrency(amount: number, currency?: string): string {
  const cur = currency || 'USD';
  if (['USD', 'EUR', 'GBP'].includes(cur)) {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: cur, maximumFractionDigits: 0 }).format(amount);
  }
  return `${amount.toLocaleString('en-US')} ${cur}`;
}

export default function TreasuryPage() {
  const theme = useTheme();
  const { treasuries, isLoading, initialize } = useTreasuryStore();
  const [configOpen, setConfigOpen] = useState(false);
  const [selectedTreasury, setSelectedTreasury] = useState<string>('');

  useEffect(() => {
    if (treasuries.length === 0) initialize();
  }, [treasuries.length, initialize]);

  const handleOpenConfig = (treasuryId: string) => {
    setSelectedTreasury(treasuryId);
    setConfigOpen(true);
  };

  const handleSaveConfig = (_signers: Signer[], _threshold: number) => {
    setConfigOpen(false);
  };

  const selectedTreasuryData = treasuries.find((t) => t.id === selectedTreasury);

  const totalBalance = treasuries.reduce((sum, t) => sum + t.balance, 0);
  const healthScore = treasuries.length > 0
    ? Math.round(treasuries.reduce((sum, t) => sum + Math.min(t.signers.length * 20 + 40, 100), 0) / treasuries.length)
    : 0;

  return (
    <AppLayout>
      <Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1, flexWrap: 'wrap', gap: 2 }}>
          <Box>
            <Typography variant="h4">Treasury</Typography>
            <Typography variant="body1" color="text.secondary">
              Multi-signature treasury management and asset allocation.
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button variant="outlined" startIcon={<AddIcon />} sx={{ borderRadius: 2.5, textTransform: 'none' }}>
              New Treasury
            </Button>
            <TreasuryHealthBadge score={healthScore} />
          </Box>
        </Box>

        {isLoading ? (
          <Grid container spacing={3} sx={{ mt: 2 }}>
            {[0, 1, 2].map((i) => (
              <Grid size={{ xs: 12, md: 6, lg: 4 }} key={i}>
                <Card><CardContent sx={{ p: 3 }}><Skeleton variant="rounded" height={200} /></CardContent></Card>
              </Grid>
            ))}
          </Grid>
        ) : (
          <>
            {/* Total balance bar */}
            <Card sx={{ mb: 3, mt: 2 }}>
              <CardContent sx={{ p: 3, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2 }}>
                <Box>
                  <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                    Total Treasury Value
                  </Typography>
                  <Typography variant="h3" sx={{ fontWeight: 800 }}>
                    {formatCurrency(totalBalance, 'USD')}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Across {treasuries.length} treasuries
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                  {treasuries.map((t) => (
                    <Box key={t.id} sx={{ textAlign: 'center' }}>
                      <Box
                        sx={{
                          width: 12,
                          height: 12,
                          borderRadius: '50%',
                          bgcolor: t.id === 'treasury-1' ? 'primary.main' : t.id === 'treasury-2' ? 'secondary.main' : 'warning.main',
                          mx: 'auto',
                          mb: 0.5,
                        }}
                      />
                      <Typography variant="caption" sx={{ fontWeight: 600 }}>{t.name}</Typography>
                      <Typography variant="body2" sx={{ fontWeight: 700 }}>
                        {formatCurrency(t.balance, t.currency)}
                      </Typography>
                    </Box>
                  ))}
                </Box>
              </CardContent>
            </Card>

            {/* Treasury account cards */}
            <Grid container spacing={3}>
              {treasuries.map((treasury) => (
                <Grid size={{ xs: 12, lg: 4 }} key={treasury.id}>
                  <Card
                    sx={{
                      transition: 'all 0.2s ease',
                      '&:hover': { borderColor: alpha(theme.palette.primary.main, 0.3) },
                    }}
                  >
                    <CardContent sx={{ p: 3 }}>
                      {/* Header */}
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                        <Box>
                          <Typography variant="h6" sx={{ fontWeight: 600, fontSize: '1rem' }}>
                            {treasury.name}
                          </Typography>
                          <Typography variant="caption" color="text.secondary" sx={{ fontFamily: 'monospace' }}>
                            {shortenAddress(treasury.stellarAddress)}
                          </Typography>
                        </Box>
                        <Chip
                          label={treasury.assetType === 'native' ? 'XLM' : treasury.assetCode || 'Asset'}
                          size="small"
                          color={treasury.assetType === 'native' ? 'warning' : 'primary'}
                          variant="outlined"
                          sx={{ fontWeight: 600, fontSize: '0.7rem' }}
                        />
                      </Box>

                      {/* Balance */}
                      <Typography variant="h3" sx={{ fontWeight: 800, mb: 1 }}>
                        {formatCurrency(treasury.balance, treasury.currency)}
                      </Typography>

                      {/* Threshold progress */}
                      <Box sx={{ mb: 2 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                          <Typography variant="caption" color="text.secondary">
                            Signer Threshold
                          </Typography>
                          <Typography variant="caption" sx={{ fontWeight: 600 }}>
                            {treasury.signers.reduce((s, si) => s + si.weight, 0)} / {treasury.threshold}
                          </Typography>
                        </Box>
                        <LinearProgress
                          variant="determinate"
                          value={Math.min(
                            (treasury.signers.reduce((s, si) => s + si.weight, 0) / treasury.threshold) * 100,
                            100
                          )}
                          sx={{
                            height: 6,
                            borderRadius: 3,
                            bgcolor: alpha(theme.palette.primary.main, 0.1),
                            '& .MuiLinearProgress-bar': {
                              borderRadius: 3,
                              bgcolor: theme.palette.primary.main,
                            },
                          }}
                        />
                      </Box>

                      {/* Signers */}
                      <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1 }}>
                        Signers ({treasury.signers.length})
                      </Typography>
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 2 }}>
                        {treasury.signers.map((signer) => (
                          <Chip
                            key={signer.id}
                            label={signer.name}
                            size="small"
                            sx={{
                              fontSize: '0.7rem',
                              fontWeight: 500,
                              bgcolor: alpha(theme.palette.primary.main, 0.08),
                              color: 'primary.light',
                            }}
                          />
                        ))}
                      </Box>

                      {/* Actions */}
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <Button
                          size="small"
                          variant="outlined"
                          startIcon={<PersonAddIcon />}
                          sx={{ flex: 1, borderRadius: 2, textTransform: 'none', fontSize: '0.75rem' }}
                        >
                          Add Signer
                        </Button>
                        <Button
                          size="small"
                          variant="outlined"
                          startIcon={<SettingsIcon />}
                          onClick={() => handleOpenConfig(treasury.id)}
                          sx={{ flex: 1, borderRadius: 2, textTransform: 'none', fontSize: '0.75rem' }}
                        >
                          Configure
                        </Button>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>

            {/* Signer Details Table */}
            <Card sx={{ mt: 4 }}>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" sx={{ mb: 3 }}>
                  All Signers
                </Typography>
                <TableContainer>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>Name</TableCell>
                        <TableCell>Role</TableCell>
                        <TableCell>Public Key</TableCell>
                        <TableCell align="center">Weight</TableCell>
                        <TableCell align="right">Treasury</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {treasuries.flatMap((t) =>
                        t.signers.map((signer) => (
                          <TableRow key={`${t.id}-${signer.id}`} hover>
                            <TableCell>
                              <Typography variant="body2" sx={{ fontWeight: 600 }}>{signer.name}</Typography>
                            </TableCell>
                            <TableCell>
                              <Chip label={signer.role} size="small" sx={{ fontSize: '0.7rem', fontWeight: 500 }} />
                            </TableCell>
                            <TableCell>
                              <Typography variant="caption" sx={{ fontFamily: 'monospace' }}>
                                {shortenAddress(signer.stellarPublicKey)}
                              </Typography>
                            </TableCell>
                            <TableCell align="center">
                              <Typography variant="body2" sx={{ fontWeight: 600 }}>{signer.weight}</Typography>
                            </TableCell>
                            <TableCell align="right">
                              <Typography variant="caption" color="text.secondary">{t.name}</Typography>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </TableContainer>
              </CardContent>
            </Card>
          </>
        )}

        <MultiSigConfig
          open={configOpen}
          onClose={() => setConfigOpen(false)}
          treasuryName={selectedTreasuryData?.name}
          initialSigners={selectedTreasuryData?.signers || []}
          initialThreshold={selectedTreasuryData?.threshold || 2}
          onSave={handleSaveConfig}
        />
      </Box>
    </AppLayout>
  );
}
