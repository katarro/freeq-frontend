import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { ThemeProvider } from './provider';
import { Toaster } from 'sonner';
import dynamic from 'next/dynamic';
import './globals.css';
import { ENV } from '@/lib/env';

// Componente dinámico para AuthProvider (siguiendo principio de carga diferida)
const AuthProvider = dynamic(() =>
  import('@/contexts/AuthContext').then((mod) => ({
    default: mod.AuthProvider,
  })),
);

// Configuración de fuente Inter solo para producción
const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
  // Solo cargar en producción para evitar problemas con ngrok
  display: 'swap',
  fallback: [
    '-apple-system',
    'BlinkMacSystemFont',
    'Segoe UI',
    'Roboto',
    'Helvetica Neue',
    'Arial',
    'sans-serif',
  ],
});

export const metadata: Metadata = {
  title: 'FreeQ',
  description: 'Haz la fila antes de llegar a la tienda',
};

// Componente para detectar entorno ngrok (Principio de Responsabilidad Única)
function FontStyleProvider() {
  // CSS para fuentes del sistema cuando estamos en desarrollo
  const systemFontCSS = `
    :root {
      --font-inter: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 
                    'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 
                    'Helvetica Neue', sans-serif;
    }
    
    * {
      font-family: var(--font-inter) !important;
    }
    
    body {
      font-family: var(--font-inter) !important;
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
    }
    
    /* Deshabilitar cualquier @font-face problemático */
    @font-face {
      font-family: '__Inter_*';
      src: none !important;
    }
  `;

  // Solo aplicar fuentes del sistema en desarrollo
  if (ENV.API_URL === 'development') {
    return <style dangerouslySetInnerHTML={{ __html: systemFontCSS }} suppressHydrationWarning />;
  }

  return null;
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Determinar si usar Inter o fuentes del sistema
  const fontClass = ENV.API_URL === 'production' ? inter.variable : ''; // No aplicar Inter en desarrollo

  return (
    <html lang="es" className="bg-background" suppressHydrationWarning>
      <head>
        <FontStyleProvider />
      </head>
      <body className={`${fontClass} overflow-hidden antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
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
