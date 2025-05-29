import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const googleButtonVariants = cva(
  "inline-flex items-center shadow-lg justify-center gap-2 whitespace-nowrap rounded-md text-sm font-normal transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
  {
    variants: {
      variant: {
        google:
          'bg-white text-[var(--primary)] border border-gray-300 hover:bg-gray-50 focus-visible:ring-blue-500/20 shadow-sm',
        'google-dark':
          'bg-gray-900 text-white border border-gray-700 hover:bg-gray-800 focus-visible:ring-blue-500/20',
      },
      size: {
        default: 'h-9 px-4 py-2 has-[>svg]:px-3',
        sm: 'h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5',
        lg: 'h-12 rounded-md px-6 has-[>svg]:px-4 text-base',
        icon: 'size-9',
      },
    },
    defaultVariants: {
      variant: 'google',
      size: 'lg',
    },
  },
);

interface GoogleButtonProps
  extends React.ComponentProps<'button'>,
    VariantProps<typeof googleButtonVariants> {
  asChild?: boolean;
  action?: 'signin' | 'signup';
}

function GoogleButton({
  className,
  variant,
  size,
  asChild = false,
  action = 'signin',
  children,
  ...props
}: GoogleButtonProps) {
  const Comp = asChild ? Slot : 'button';

  const buttonText =
    children ||
    (action === 'signin'
      ? 'Iniciar sesión con Google'
      : 'Registrarse con Google');

  return (
    <Comp
      data-slot='google-button'
      className={cn(googleButtonVariants({ variant, size, className }))}
      {...props}
    >
      {/* Icono de Google */}
      <svg className='w-5 h-5' viewBox='0 0 24 24' aria-hidden='true'>
        <path
          fill='#4285F4'
          d='M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z'
        />
        <path
          fill='#34A853'
          d='M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z'
        />
        <path
          fill='#FBBC05'
          d='M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z'
        />
        <path
          fill='#EA4335'
          d='M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z'
        />
      </svg>
      {buttonText}
    </Comp>
  );
}

export { GoogleButton, googleButtonVariants };
