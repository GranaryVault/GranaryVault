'use client';

import { Box, keyframes } from '@mui/material';
import { useEffect, useState } from 'react';

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(8px); }
  to { opacity: 1; transform: translateY(0); }
`;

interface PageTransitionProps {
  children: React.ReactNode;
}

export default function PageTransition({ children }: PageTransitionProps) {
  const [key, setKey] = useState(0);

  useEffect(() => {
    setKey((k) => k + 1);
  }, []);

  return (
    <Box
      key={key}
      sx={{
        animation: `${fadeIn} 0.35s ease-out`,
      }}
    >
      {children}
    </Box>
  );
}
