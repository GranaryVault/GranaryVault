'use client';

import { createTheme, alpha } from '@mui/material/styles';
import type {} from '@mui/material/themeCssVarsAugmentation';

// ── Shared typography ────────────────────────────────────────────────────────
const typography = {
  fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
  h1: { fontSize: '2.25rem', fontWeight: 700, letterSpacing: '-0.02em', lineHeight: 1.2 },
  h2: { fontSize: '1.875rem', fontWeight: 700, letterSpacing: '-0.02em', lineHeight: 1.25 },
  h3: { fontSize: '1.5rem', fontWeight: 600, letterSpacing: '-0.01em', lineHeight: 1.3 },
  h4: { fontSize: '1.25rem', fontWeight: 600, letterSpacing: '-0.01em', lineHeight: 1.35 },
  h5: { fontSize: '1.125rem', fontWeight: 600, lineHeight: 1.4 },
  h6: { fontSize: '1rem', fontWeight: 600, lineHeight: 1.45 },
  body1: { fontSize: '0.9375rem', lineHeight: 1.6 },
  body2: { fontSize: '0.8125rem', lineHeight: 1.6 },
  caption: { fontSize: '0.75rem' },
  overline: { fontSize: '0.6875rem', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase' as const },
};

// ── Shared shape ─────────────────────────────────────────────────────────────
const shape = { borderRadius: 12 };

// ── Shared component overrides ───────────────────────────────────────────────
const componentOverrides = (isDark: boolean) => ({
  MuiButton: {
    styleOverrides: {
      root: {
        textTransform: 'none' as const,
        fontWeight: 600,
        borderRadius: 10,
        padding: '10px 20px',
        transition: 'all 0.2s ease',
      },
      contained: {
        boxShadow: isDark
          ? '0 1px 3px rgba(124, 92, 252, 0.2)'
          : '0 1px 3px rgba(124, 92, 252, 0.15)',
      },
    },
  },
  MuiCard: {
    styleOverrides: {
      root: {
        backgroundImage: 'none',
        borderRadius: 16,
        border: `1px solid ${isDark ? 'rgba(147, 147, 184, 0.08)' : 'rgba(0, 0, 0, 0.06)'}`,
        boxShadow: isDark
          ? '0 4px 24px rgba(0, 0, 0, 0.3)'
          : '0 2px 16px rgba(0, 0, 0, 0.06)',
        transition: 'box-shadow 0.3s ease, border-color 0.3s ease',
      },
    },
  },
  MuiPaper: {
    styleOverrides: { root: { backgroundImage: 'none' } },
  },
  MuiDrawer: {
    styleOverrides: {
      paper: {
        borderRight: `1px solid ${isDark ? 'rgba(147, 147, 184, 0.08)' : 'rgba(0, 0, 0, 0.06)'}`,
        backgroundImage: 'none',
      },
    },
  },
  MuiAppBar: {
    styleOverrides: {
      root: {
        backgroundImage: 'none',
        boxShadow: isDark
          ? '0 1px 3px rgba(0, 0, 0, 0.2)'
          : '0 1px 3px rgba(0, 0, 0, 0.05)',
      },
    },
  },
  MuiTableCell: {
    styleOverrides: {
      root: {
        borderBottom: `1px solid ${isDark ? 'rgba(147, 147, 184, 0.08)' : 'rgba(0, 0, 0, 0.06)'}`,
      },
    },
  },
  MuiChip: {
    styleOverrides: { root: { fontWeight: 500 } },
  },
  MuiTooltip: {
    styleOverrides: {
      tooltip: {
        backgroundColor: isDark ? '#1E1E3A' : '#1A1A2E',
        borderRadius: 8,
        padding: '8px 14px',
        fontSize: '0.75rem',
      },
    },
  },
  MuiTableContainer: {
    styleOverrides: {
      root: {
        borderRadius: 16,
      },
    },
  },
});

// ── Dark theme ───────────────────────────────────────────────────────────────
export const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: { main: '#7C5CFC', light: '#A78BFA', dark: '#5B3FD9', contrastText: '#FFFFFF' },
    secondary: { main: '#06D6A0', light: '#34E8B6', dark: '#05A87D', contrastText: '#0A0A1A' },
    background: { default: '#0A0A1A', paper: '#12122A' },
    text: { primary: '#F0F0FF', secondary: '#9393B8' },
    error: { main: '#EF4444', light: '#F87171' },
    warning: { main: '#F59E0B', light: '#FBBF24' },
    success: { main: '#06D6A0', light: '#34E8B6' },
    info: { main: '#3B82F6', light: '#60A5FA' },
    divider: 'rgba(147, 147, 184, 0.12)',
  },
  typography,
  shape,
  components: componentOverrides(true),
});

// ── Light theme ──────────────────────────────────────────────────────────────
export const lightTheme = createTheme({
  palette: {
    mode: 'light',
    primary: { main: '#6D28D9', light: '#8B5CF6', dark: '#5B21B6', contrastText: '#FFFFFF' },
    secondary: { main: '#059669', light: '#10B981', dark: '#047857', contrastText: '#FFFFFF' },
    background: { default: '#F8FAFC', paper: '#FFFFFF' },
    text: { primary: '#0F172A', secondary: '#64748B' },
    error: { main: '#DC2626', light: '#EF4444' },
    warning: { main: '#D97706', light: '#F59E0B' },
    success: { main: '#059669', light: '#10B981' },
    info: { main: '#2563EB', light: '#3B82F6' },
    divider: 'rgba(0, 0, 0, 0.06)',
  },
  typography,
  shape,
  components: componentOverrides(false),
});

// ── Semantic color helpers ──────────────────────────────────────────────────
/**
 * Returns a gradient style for cards and backgrounds.
 */
export function primaryGradient(opacity: number = 1) {
  return `linear-gradient(135deg, ${alpha('#7C5CFC', opacity * 0.15)}, ${alpha('#06D6A0', opacity * 0.08)})`;
}

/**
 * Glass-morphism card style (dark mode only).
 */
export function glassStyle(dark: boolean) {
  if (!dark) return {};
  return {
    backdropFilter: 'blur(12px)',
    backgroundColor: 'rgba(18, 18, 42, 0.7)',
    border: '1px solid rgba(147, 147, 184, 0.08)',
  };
}
