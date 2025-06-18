// components/sse/ticket-notification.tsx
import { useEffect, useState } from 'react';
import { Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface TicketNotificationProps {
  isMyTurn: boolean;
  currentTicketNumber?: number;
  moduleCode?: string;
  onDismiss: () => void;
}

export function TicketNotification({
  isMyTurn,
  currentTicketNumber,
  moduleCode,
  onDismiss,
}: Readonly<TicketNotificationProps>) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (isMyTurn) {
      setIsVisible(true);

      // Reproducir sonido (opcional)
      if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(
          `Es tu turno. Número ${currentTicketNumber}. Dirígete al módulo ${moduleCode || 'asignado'}.`,
        );
        utterance.lang = 'es-ES';
        speechSynthesis.speak(utterance);
      }

      // Auto-ocultar después de 10 segundos
      const timer = setTimeout(() => {
        setIsVisible(false);
        onDismiss();
      }, 10000);

      return () => clearTimeout(timer);
    }
  }, [isMyTurn, currentTicketNumber, moduleCode, onDismiss]);

  if (!isVisible || !isMyTurn) {
    return null;
  }

  return (
    <div className='fixed top-4 left-1/2 transform -translate-x-1/2 z-50 animate-in slide-in-from-top-5'>
      <div className='bg-gradient-to-r from-success via-success to-secondary text-white rounded-lg shadow-lg p-4 max-w-sm mx-4'>
        <div className='flex items-center gap-3'>
          <div className='flex-shrink-0'>
            <Bell className='w-6 h-6 animate-bounce' />
          </div>
          <div className='flex-1'>
            <h3 className='font-bold text-lg'>¡Es tu turno!</h3>
            <p className='text-sm opacity-90'>Número {currentTicketNumber}</p>
            <p className='text-sm opacity-90'>
              Dirígete al módulo {moduleCode || 'asignado'}
            </p>
          </div>
          <Button
            variant='ghost'
            size='sm'
            onClick={() => {
              setIsVisible(false);
              onDismiss();
            }}
            className='text-white hover:bg-white/20 p-1'
          >
            ✕
          </Button>
        </div>
      </div>
    </div>
  );
}
