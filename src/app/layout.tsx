import '@/lib/env-validation';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { ThemeProvider } from './provider';
import { AuthProvider } from '@/contexts/AuthContext'; // 👈 Importar AuthProvider

import './globals.css';

const inter = Inter({ variable: '--font-inter', subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'FreeQ',
  description: 'Haz la fila antes de llegar a la tienda',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='es' className='bg-background' suppressHydrationWarning>
      <body className={`${inter.variable} overflow-hidden antialiased`}>
        <ThemeProvider
          attribute='class'
          defaultTheme='system'
          enableSystem
          disableTransitionOnChange
        >
          <AuthProvider>{children}</AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
