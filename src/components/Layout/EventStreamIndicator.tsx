'use client';

import { useEffect } from 'react';
import { Box, Typography, Tooltip, alpha, useTheme, keyframes } from '@mui/material';
import { useRealtimeEvents } from '@/hooks/useRealtimeEvents';
import { Wifi as WifiIcon, WifiOff as WifiOffIcon } from '@mui/icons-material';

const pulse = keyframes`
  0%, 100% { opacity: 1; }
  50% { opacity: 0.4; }
`;

export default function EventStreamIndicator() {
  const theme = useTheme();
  const { isConnected, lastEvent, connect, disconnect } = useRealtimeEvents();

  useEffect(() => {
    connect();
    return () => disconnect();
  }, [connect, disconnect]);

  return (
    <Tooltip
      title={
        lastEvent
          ? `Last event: ${lastEvent.type} (${new Date(lastEvent.timestamp).toLocaleTimeString()})`
          : 'Real-time event stream status'
      }
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 1,
          px: 1.5,
          py: 0.5,
          borderRadius: 2,
          cursor: 'default',
        }}
      >
        {isConnected ? (
          <WifiIcon
            sx={{
              fontSize: '0.875rem',
              color: theme.palette.success.main,
              animation: `${pulse} 2s ease-in-out infinite`,
            }}
          />
        ) : (
          <WifiOffIcon sx={{ fontSize: '0.875rem', color: theme.palette.text.secondary }} />
        )}
        <Typography variant="caption" sx={{ color: isConnected ? 'success.main' : 'text.secondary', fontWeight: 500 }}>
          {isConnected ? 'Live' : 'Offline'}
        </Typography>
        {lastEvent && (
          <Box
            sx={{
              width: 6,
              height: 6,
              borderRadius: '50%',
              bgcolor: theme.palette.primary.main,
              animation: `${pulse} 1s ease-in-out infinite`,
            }}
          />
        )}
      </Box>
    </Tooltip>
  );
}
