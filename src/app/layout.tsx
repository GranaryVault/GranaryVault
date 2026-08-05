import type { Metadata } from 'next';
import ThemeRegistry from '@/theme/ThemeRegistry';

export const metadata: Metadata = {
  title: 'GranaryVault — Treasury Governance Platform',
  description:
    'Stellar-native treasury management and financial governance platform for organizations, DAOs, nonprofits, and institutions.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body style={{ margin: 0 }}>
        <ThemeRegistry>{children}</ThemeRegistry>
      </body>
    </html>
  );
}
