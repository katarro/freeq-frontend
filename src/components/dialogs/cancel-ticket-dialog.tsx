'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

interface CancelTicketDialogProps {
  readonly open: boolean;
  readonly onOpenChange: (open: boolean) => void;
  readonly onConfirm: () => void;
  readonly ticketNumber: number;
  readonly serviceName: string;
  readonly siteName: string;
}

export default function CancelTicketDialog({
  open,
  onOpenChange,
  onConfirm,
  ticketNumber,
  serviceName,
  siteName,
}: CancelTicketDialogProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleConfirm = async () => {
    setIsLoading(true);

    try {
      // Simular delay de cancelación
      await new Promise((resolve) => setTimeout(resolve, 1000));
      onConfirm();
      onOpenChange(false);
    } catch (error) {
      console.error('Error al cancelar:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='max-w-md'>
        <DialogHeader className='text-center'>
          <div className='mx-auto w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mb-4'>
            <svg
              className='w-8 h-8 text-destructive'
              fill='none'
              stroke='currentColor'
              viewBox='0 0 24 24'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 18.5c-.77.833.192 2.5 1.732 2.5z'
              />
            </svg>
          </div>
          <DialogTitle className='text-xl font-semibold'>
            ¿Cancelar turno?
          </DialogTitle>
          <DialogDescription className='text-center text-muted-foreground mt-2'>
            Esta acción no se puede deshacer. Una vez cancelado, perderás tu
            lugar en la cola.
          </DialogDescription>
        </DialogHeader>

        {/* Información del turno */}
        <div className='bg-muted/50 rounded-lg p-4 my-4'>
          <div className='text-center'>
            <div className='text-2xl font-bold text-destructive mb-2'>
              #{ticketNumber}
            </div>
            <div className='space-y-1'>
              <p className='font-medium text-heading-foreground'>
                {serviceName}
              </p>
              <p className='text-sm text-muted-foreground'>{siteName}</p>
            </div>
          </div>
        </div>

        <DialogFooter className='className="flex flex-col-reverse sm:flex-row sm:justify-between gap-2"'>
          <Button
            variant='destructive'
            onClick={handleConfirm}
            disabled={isLoading}
            className='w-full sm:w-auto hover:cursor-pointer'
          >
            {isLoading ? (
              <>
                <div className='w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2' />
                Cancelando...
              </>
            ) : (
              'Sí, cancelar turno'
            )}
          </Button>
          <Button
            variant='outline'
            onClick={() => onOpenChange(false)}
            disabled={isLoading}
            className='w-full sm:w-auto hover:cursor-pointer'
          >
            Mantener turno
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
