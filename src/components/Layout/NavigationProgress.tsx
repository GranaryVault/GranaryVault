'use client';

import { useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { Box, keyframes } from '@mui/material';

const slideIn = keyframes`
  from { transform: translateX(-100%); }
  to { transform: translateX(0); }
`;

const complete = keyframes`
  from { transform: translateX(0); opacity: 1; }
  to { transform: translateX(100%); opacity: 0; }
`;

export default function NavigationProgress() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    // The bar animation is triggered by route changes;
    // CSS animation handles the visual effect automatically.
  }, [pathname, searchParams]);

  if (typeof window === 'undefined') return null;

  return (
    <Box
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 9999,
        height: '3px',
        pointerEvents: 'none',
      }}
    >
      <Box
        key={pathname}
        sx={{
          height: '100%',
          width: '100%',
          background: (theme) =>
            `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
          animation: `${slideIn} 0.6s ease-out, ${complete} 0.3s ease-in 0.6s forwards`,
        }}
      />
    </Box>
  );
}
