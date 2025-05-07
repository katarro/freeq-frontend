'use client';

import * as React from 'react';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';

import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

export function ModeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  // Usar useEffect para manejar la hidratación
  React.useEffect(() => {
    setMounted(true);
  }, []);

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

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
      <Label htmlFor='theme-mode'>
        <Sun className='h-4 w-4' />
      </Label>
      <Switch
        checked={theme === 'dark'}
        onCheckedChange={toggleTheme}
        id='theme-mode'
      />
      <Label htmlFor='theme-mode'>
        <Moon className='h-4 w-4' />
      </Label>
      <Label htmlFor='theme-mode' className='sr-only'>
        Toggle theme
      </Label>
    </div>
  );
}
