'use client';

import * as React from 'react';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';

import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

export function ModeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const toggleTheme = () => {
    // ✅ MEJORADO: Usar resolvedTheme para el toggle también
    const currentResolvedTheme = resolvedTheme || 'light';
    setTheme(currentResolvedTheme === 'dark' ? 'light' : 'dark');
  };

  // ✅ USAR resolvedTheme para mejor detección
  const currentTheme = mounted ? resolvedTheme : 'light';
  const isDark = currentTheme === 'dark';

  // Evitar el renderizado en el lado del servidor
  if (!mounted) {
    return (
      <div className='flex items-center space-x-2'>
        <Label htmlFor='theme-mode'>
          <Sun className='h-4 w-4' />
        </Label>
        <Switch id='theme-mode' />
        <Label htmlFor='theme-mode'>
          <Moon className='h-4 w-4' />
        </Label>
      </div>
    );
  }

  return (
    <div className='flex items-center space-x-2'>
      {/* ✅ ICONOS FIJOS: Sun siempre a la izquierda */}
      <Label htmlFor='theme-mode' className='cursor-pointer'>
        <Sun
          className={`h-4 w-4 transition-opacity ${isDark ? 'opacity-50' : 'opacity-100'}`}
        />
      </Label>
      <Switch checked={isDark} onCheckedChange={toggleTheme} id='theme-mode' />
      {/* ✅ ICONOS FIJOS: Moon siempre a la derecha */}
      <Label htmlFor='theme-mode' className='cursor-pointer'>
        <Moon
          className={`h-4 w-4 transition-opacity ${isDark ? 'opacity-100' : 'opacity-50'}`}
        />
      </Label>
      <Label htmlFor='theme-mode' className='sr-only'>
        Toggle theme
      </Label>
    </div>
  );
}
