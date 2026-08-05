'use client';

import { useState, Suspense } from 'react';
import { Box } from '@mui/material';
import Sidebar from '@/components/Layout/Sidebar';
import Header from '@/components/Layout/Header';
import Breadcrumbs from '@/components/Layout/Breadcrumbs';
import PageTransition from '@/components/Layout/PageTransition';
import NavigationProgress from '@/components/Layout/NavigationProgress';

const DRAWER_WIDTH = 280;

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <Suspense fallback={null}>
        <NavigationProgress />
      </Suspense>
      <Sidebar
        drawerWidth={DRAWER_WIDTH}
        mobileOpen={mobileOpen}
        onMobileToggle={setMobileOpen}
      />
      <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
        <Header drawerWidth={DRAWER_WIDTH} onMenuClick={() => setMobileOpen(true)} />
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
          <Breadcrumbs />
          <PageTransition>{children}</PageTransition>
        </Box>
      </Box>
    </Box>
  );
}
