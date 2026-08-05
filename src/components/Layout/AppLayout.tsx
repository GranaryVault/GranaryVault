'use client';

import { Box } from '@mui/material';
import Sidebar from '@/components/Layout/Sidebar';
import Header from '@/components/Layout/Header';

const DRAWER_WIDTH = 280;

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar drawerWidth={DRAWER_WIDTH} />
      <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
        <Header drawerWidth={DRAWER_WIDTH} />
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            p: { xs: 2, md: 4 },
            mt: 8,
            ml: { md: `${DRAWER_WIDTH}px` },
            backgroundColor: 'background.default',
            minHeight: '100vh',
          }}
        >
          {children}
        </Box>
      </Box>
    </Box>
  );
}
