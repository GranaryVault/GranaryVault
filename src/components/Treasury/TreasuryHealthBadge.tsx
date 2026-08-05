'use client';

import { Box, Typography, Tooltip, alpha, useTheme } from '@mui/material';
import {
  Shield as ShieldIcon,
  Warning as WarningIcon,
  Error as ErrorIcon,
} from '@mui/icons-material';

interface Props {
  score: number; // 0–100
  size?: 'small' | 'medium';
}

export default function TreasuryHealthBadge({ score, size = 'medium' }: Props) {
  const theme = useTheme();

  const config = score >= 80
    ? { color: theme.palette.success.main, bg: alpha(theme.palette.success.main, 0.1), icon: <ShieldIcon />, label: 'Healthy' }
    : score >= 50
      ? { color: theme.palette.warning.main, bg: alpha(theme.palette.warning.main, 0.1), icon: <WarningIcon />, label: 'Attention' }
      : { color: theme.palette.error.main, bg: alpha(theme.palette.error.main, 0.1), icon: <ErrorIcon />, label: 'Critical' };

  const isSmall = size === 'small';
  const dimension = isSmall ? 36 : 56;

  return (
    <Tooltip title={`Treasury Health Score: ${score}/100`}>
      <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 1 }}>
        <Box
          sx={{
            width: dimension,
            height: dimension,
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
            background: `conic-gradient(${config.color} ${score}%, ${alpha(config.color, 0.1)} ${score}%)`,
          }}
        >
          <Box
            sx={{
              width: dimension - 8,
              height: dimension - 8,
              borderRadius: '50%',
              bgcolor: 'background.paper',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Box sx={{ color: config.color, display: 'flex', fontSize: isSmall ? '1rem' : '1.25rem' }}>
              {config.icon}
            </Box>
          </Box>
        </Box>
        {!isSmall && (
          <Box>
            <Typography variant="body2" sx={{ fontWeight: 600 }}>
              Treasury Health
            </Typography>
            <Typography variant="caption" sx={{ color: config.color, fontWeight: 600 }}>
              {config.label} · {score}/100
            </Typography>
          </Box>
        )}
      </Box>
    </Tooltip>
  );
}
