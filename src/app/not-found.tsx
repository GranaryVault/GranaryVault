'use client';

import { Box, Typography, Button, alpha } from '@mui/material';
import { useRouter } from 'next/navigation';
import { AccountBalance as TreasuryIcon } from '@mui/icons-material';

export default function NotFoundPage() {
  const router = useRouter();

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: 'background.default',
        p: 3,
      }}
    >
      <Box sx={{ textAlign: 'center', maxWidth: 480 }}>
        {/* Icon */}
        <Box
          sx={{
            width: 100,
            height: 100,
            borderRadius: 4,
            mx: 'auto',
            mb: 4,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: (theme) =>
              `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.12)}, ${alpha(theme.palette.secondary.main, 0.06)})`,
            border: (theme) => `1px solid ${alpha(theme.palette.primary.main, 0.15)}`,
          }}
        >
          <TreasuryIcon sx={{ fontSize: 48, color: 'primary.light', opacity: 0.6 }} />
        </Box>

        <Typography
          variant="h2"
          sx={{
            fontWeight: 800,
            mb: 1.5,
            background: (theme) =>
              `linear-gradient(135deg, ${theme.palette.primary.light}, ${theme.palette.secondary.main})`,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          404
        </Typography>

        <Typography variant="h5" sx={{ mb: 1.5, fontWeight: 600 }}>
          Vault Not Found
        </Typography>

        <Typography variant="body1" color="text.secondary" sx={{ mb: 4, lineHeight: 1.7 }}>
          This treasury page doesn&apos;t exist or has been moved. Let&apos;s get you back
          to managing your organization&apos;s assets.
        </Typography>

        <Button
          variant="contained"
          size="large"
          onClick={() => router.push('/')}
          sx={{
            px: 4,
            py: 1.5,
            borderRadius: 3,
            fontWeight: 600,
          }}
        >
          Return to Dashboard
        </Button>
      </Box>
    </Box>
  );
}
