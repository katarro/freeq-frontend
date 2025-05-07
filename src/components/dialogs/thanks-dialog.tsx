'use client';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from '@/components/ui/dialog';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect, useCallback } from 'react';
import confetti from 'canvas-confetti';

export default function ThanksDialog({
  open,
  onOpenChange,
}: Readonly<{
  open: boolean;
  onOpenChange: (open: boolean) => void;
}>) {
  const router = useRouter();

  // Mover handleClose antes del useEffect y usar useCallback
  const handleClose = useCallback(() => {
    onOpenChange(false);
    router.push('/admin/home'); // Añadir  para manejar la promesa
  }, [onOpenChange, router]);

  useEffect(() => {
    if (open) {
      // Disparar fuegos artificiales de confeti cuando el diálogo se abre
      triggerFireworks();

      // Temporizador para cerrar automáticamente
      const timer = setTimeout(() => {
        handleClose();
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [open, handleClose]); // Añadir handleClose como dependencia

  const triggerFireworks = () => {
    const duration = 5 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = {
      startVelocity: 30,
      spread: 360,
      ticks: 60,
      zIndex: 9999,
      scalar: 1.5, // Establecer un z-index alto para que aparezca por encima del overlay
    };

    const randomInRange = (min: number, max: number) =>
      Math.random() * (max - min) + min;

    const interval = window.setInterval(() => {
      // Eliminar async ya que usamos await
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);

      // Lanzar confeti desde el lado izquierdo
      // Usar  en lugar de await para manejar la promesa
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
      });

      // Lanzar confeti desde el lado derecho
      // Usar  en lugar de await para manejar la promesa
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
      });
    }, 250);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='max-w-[293px] [&_svg]:hidden gap-5 bg-linear-to-bl from-secondary to-primary border-[2px] data-[state=open]:animate-slide-up-fade data-[state=closed]:animate-slide-down-fade'>
        <figure className='mx-auto'>
          <Image
            src='/images/thanks-rafiki.avif'
            alt='Gracias'
            width={250}
            height={250}
            className='w-full h-full object-cover aspect-auto'
          />
        </figure>
        <DialogTitle className='text-center text-2xl text-primary-foreground'>
          Te has unido a la fila con éxito
        </DialogTitle>
        <DialogDescription className='sr-only'>
          Te has unido a la fila con éxito
        </DialogDescription>
      </DialogContent>
    </Dialog>
  );
}
