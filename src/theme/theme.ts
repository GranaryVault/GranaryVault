'use client';

import { createTheme } from '@mui/material/styles';

const granaryVaultTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#7C5CFC',
      light: '#A78BFA',
      dark: '#5B3FD9',
      contrastText: '#FFFFFF',
    },
    secondary: {
      main: '#06D6A0',
      light: '#34E8B6',
      dark: '#05A87D',
      contrastText: '#0A0A1A',
    },
    background: {
      default: '#0A0A1A',
      paper: '#12122A',
    },
    text: {
      primary: '#F0F0FF',
      secondary: '#9393B8',
    },
    error: {
      main: '#EF4444',
      light: '#F87171',
    },
    warning: {
      main: '#F59E0B',
      light: '#FBBF24',
    },
    success: {
      main: '#06D6A0',
      light: '#34E8B6',
    },
    info: {
      main: '#3B82F6',
      light: '#60A5FA',
    },
    divider: 'rgba(147, 147, 184, 0.12)',
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontSize: '2.25rem',
      fontWeight: 700,
      letterSpacing: '-0.02em',
    },
    h2: {
      fontSize: '1.875rem',
      fontWeight: 700,
      letterSpacing: '-0.02em',
    },
    h3: {
      fontSize: '1.5rem',
      fontWeight: 600,
      letterSpacing: '-0.01em',
    },
    h4: {
      fontSize: '1.25rem',
      fontWeight: 600,
      letterSpacing: '-0.01em',
    },
    h5: {
      fontSize: '1.125rem',
      fontWeight: 600,
    },
    h6: {
      fontSize: '1rem',
      fontWeight: 600,
    },
    body1: {
      fontSize: '0.9375rem',
      lineHeight: 1.6,
    },
    body2: {
      fontSize: '0.8125rem',
      lineHeight: 1.6,
    },
    caption: {
      fontSize: '0.75rem',
      color: '#9393B8',
    },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 600,
          borderRadius: 10,
          padding: '10px 20px',
        },
        contained: {
          boxShadow: '0 1px 3px rgba(124, 92, 252, 0.2)',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          borderRadius: 16,
          border: '1px solid rgba(147, 147, 184, 0.08)',
          boxShadow: '0 4px 24px rgba(0, 0, 0, 0.3)',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          borderRight: '1px solid rgba(147, 147, 184, 0.08)',
          backgroundImage: 'none',
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.2)',
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          borderBottom: '1px solid rgba(147, 147, 184, 0.08)',
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          fontWeight: 500,
        },
      },
    },
  },
});

export default granaryVaultTheme;
