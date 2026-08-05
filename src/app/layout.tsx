import type { Metadata } from 'next';
import { inter } from '@/theme/fonts';
import ThemeRegistry from '@/theme/ThemeRegistry';

export const metadata: Metadata = {
  title: 'GranaryVault — Treasury Governance Platform',
  description:
    'Stellar-native treasury management and financial governance platform for organizations, DAOs, nonprofits, and institutions.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.variable}>
      <body style={{ margin: 0, fontFamily: inter.style.fontFamily }}>
        <ThemeRegistry>{children}</ThemeRegistry>
      </body>
    </html>
  );
}
