import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { ThemeProvider } from './provider';
import { Toaster } from 'sonner'; // 🔧 AGREGAR IMPORT
import dynamic from 'next/dynamic';

const AuthProvider = dynamic(() =>
  import('@/contexts/AuthContext').then((mod) => ({
    default: mod.AuthProvider,
  })),
);
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
    <html lang="es" className="bg-background" suppressHydrationWarning>
      <body className={`${inter.variable} overflow-hidden antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <AuthProvider>
            {children}
            <Toaster position="top-right" richColors closeButton duration={3000} />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
