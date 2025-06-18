'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import Heading from '@/components/heading';
import { Separator } from '@/components/ui/separator';
import { QueueStatusPanel } from '@/components/executive/main-panel/queue-status-panel';
import { AttendanceHistoryTable } from '@/components/executive/main-panel/attendance-history';
import { ControlPanel } from '@/components/executive/control-panel';
import { useNextTicket, UnifiedTicketResponse } from '@/hooks/use-next-ticket';
import { useAuthPageAnimation } from '@/hooks/use-auth-page-animation';
import { AnimatePresence } from 'framer-motion';
import AuthLoadingScreen from '@/components/auth/auth-loading-screen';
import { StatusCards } from '@/components/executive/main-panel/status-card';
import { useOperatorState } from '@/hooks/use-operator-state';
import { toast } from 'sonner';

export default function MainPanelPage() {
  const {
    currentTicketId,
    flowStep,
    ticketStatus,
    pendingAction,
    isLoaded,
    setCurrentTicketId,
    setFlowStep,
    setTicketStatus,
    setPendingAction,
    resetState,
    clearCurrentTicket,
  } = useOperatorState();

  const [error, setError] = useState<string | null>(null);
  const processingRef = useRef(false);

  const { callNextTicket, processTicketAction, isLoading } = useNextTicket({
    onTicketCompleted: (ticketId, action) => {
      setError(null);
      clearCurrentTicket();
      setFlowStep('completed');
    },

    onNextTicketCalled: useCallback(
      (unifiedTicket: UnifiedTicketResponse) => {
        if (!unifiedTicket) {
          setError('Error: Respuesta inválida del servidor');
          processingRef.current = false;
          return;
        }

        const ticketId = unifiedTicket.ticket?.id || unifiedTicket.id;
        const ticketNumber = unifiedTicket.ticketNumber;
        const clientName = unifiedTicket.clientName;
        const queueCount = unifiedTicket.queueCount || 0;

        if (!ticketId) {
          setError('Error: ID de ticket inválido');
          processingRef.current = false;
          return;
        }

        if (!ticketNumber) {
          setError('Error: Número de ticket inválido');
          processingRef.current = false;
          return;
        }

        setError(null);

        const displayName = clientName || `Cliente #${ticketNumber}`;

        setCurrentTicketId(ticketId);
        setFlowStep('called');
        setPendingAction(null);

        setTicketStatus({
          operatorId: 'OP-001',
          status: 'CALLED',
          currentClient: displayName,
          queueCount: queueCount,
          canTakeNext: false,
          lastAction: 'none',
        });

        processingRef.current = false;
      },
      [setCurrentTicketId, setPendingAction, setFlowStep, setTicketStatus],
    ),

    onError: (errorMessage) => {
      switch (true) {
        case errorMessage.includes('No hay tickets en espera'):
          toast.info(
            '📭 No hay tickets en espera. Esperando nuevos clientes...',
          );
          break;
        case errorMessage.includes('No hay nadie en cola'):
        case errorMessage.includes('cola vacía'):
          toast.info(
            '📭 No hay clientes en cola. Esperando nuevos clientes...',
          );

          setTicketStatus({
            operatorId: 'OP-001',
            status: 'WAITING',
            currentClient: null,
            queueCount: 0,
            canTakeNext: true,
            lastAction: 'none',
          });
          setCurrentTicketId(null);
          setPendingAction(null);
          setFlowStep('waiting');
          break;

        case errorMessage.includes('Token'):
        case errorMessage.includes('Unauthorized'):
        case errorMessage.includes('401'):
          toast.error('Sesión expirada. Por favor, inicia sesión nuevamente.');
          break;

        case errorMessage.includes('conectar'):
        case errorMessage.includes('Network'):
        case errorMessage.includes('fetch'):
          toast.error(
            'No se pudo conectar con el servidor. Verifica tu conexión.',
          );
          break;

        case errorMessage.includes('500'):
        case errorMessage.includes('Error interno'):
          toast.error(
            'Error del servidor. Inténtalo nuevamente en unos minutos.',
          );
          break;

        case errorMessage.includes('400'):
        case errorMessage.includes('Bad Request'):
        case errorMessage.includes('inválido'):
          toast.error('Error en los datos enviados. Verifica la información.');
          break;

        case errorMessage.includes('403'):
        case errorMessage.includes('Forbidden'):
        case errorMessage.includes('permisos'):
          toast.error('No tienes permisos para realizar esta acción.');
          break;

        case errorMessage.includes('Ticket'):
        case errorMessage.includes('ticket'):
          toast.error('Error procesando el ticket. Inténtalo nuevamente.');
          break;

        case errorMessage.includes('Cola'):
        case errorMessage.includes('queue'):
          toast.error('Error en la cola. Verifica el estado del sistema.');
          break;

        default:
          toast.error('Error inesperado. Por favor, inténtalo de nuevo.');
          break;
      }

      processingRef.current = false;
    },
  });

  useEffect(() => {
    if (isLoaded && currentTicketId && flowStep === 'called') {
      const notification = `🔄 Estado restaurado\n\nAtendiendo: ${ticketStatus.currentClient || 'Cliente'}\nTicket ID: ${currentTicketId}`;

      setTimeout(() => {}, 1000);
    }
  }, [
    isLoaded,
    currentTicketId,
    flowStep,
    ticketStatus.currentClient,
    resetState,
  ]);

  const handleNext = async () => {
    if (isLoading || processingRef.current) {
      return;
    }

    processingRef.current = true;

    try {
      if (flowStep === 'waiting') {
        try {
          await callNextTicket();
        } catch (error: any) {
          const errorMessage = error.message || '';
          if (
            errorMessage.includes('No hay tickets en espera') ||
            errorMessage.includes('cola vacía') ||
            errorMessage.includes('No hay nadie en cola')
          ) {
            toast.info('No hay clientes en cola');
            return;
          }
          throw error;
        }
        return;
      }

      if (flowStep === 'called' && pendingAction && currentTicketId) {
        if (!currentTicketId || currentTicketId.trim() === '') {
          toast.error('No hay ticket activo para procesar');
          processingRef.current = false;
          return;
        }

        try {
          await processTicketAction(currentTicketId, pendingAction);

          await new Promise((resolve) => setTimeout(resolve, 300));

          await callNextTicket();
        } catch (processError: any) {
          const errorMessage = processError.message || '';

          switch (true) {
            case errorMessage.includes('No hay tickets en espera'):
            case errorMessage.includes('cola vacía'):
              toast.info('No hay más clientes en cola');
              clearCurrentTicket();
              setFlowStep('waiting');
              break;

            case errorMessage.includes('Token'):
            case errorMessage.includes('401'):
              toast.error('Sesión expirada. Inicia sesión nuevamente.');
              break;

            case errorMessage.includes('conectar'):
              toast.error('Error de conexión. Verifica tu internet.');
              break;

            default:
              toast.error(`Error procesando: ${errorMessage}`);
              break;
          }
        }

        return;
      }

      if (flowStep === 'completed') {
        await callNextTicket();
        return;
      }

      if (flowStep === 'called' && !pendingAction) {
        toast.warning(
          'Debe seleccionar Completado o Ausente antes de continuar',
        );
        processingRef.current = false;
        return;
      }

      toast.error('Estado inválido. Use el botón Reset si persiste.');
    } catch (error: any) {
      const errorMessage = error.message || 'Error desconocido';
      toast.error(`Error: ${errorMessage}`);
    } finally {
      processingRef.current = false;
    }
  };

  const handleAbsent = () => {
    const newAction = pendingAction === 'absent' ? null : 'absent';
    setPendingAction(newAction);
    setError(null);
  };

  const handleCompleted = () => {
    const newAction = pendingAction === 'completed' ? null : 'completed';
    setPendingAction(newAction);
    setError(null);
  };

  const isNextButtonEnabled = () => {
    if (isLoading || processingRef.current || !isLoaded) return false;

    switch (flowStep) {
      case 'waiting':
        return true;
      case 'called':
        return !!pendingAction;
      case 'completed':
        return true;
      default:
        return false;
    }
  };

  const getNextButtonText = () => {
    if (!isLoaded) return 'Cargando...';
    if (isLoading) return 'Procesando...';
    return 'Siguiente';
  };

  const { loading, setShowForm } = useAuthPageAnimation();

  if (!isLoaded) {
    return (
      <section className='grid gap-4'>
        <div className='flex items-center justify-center p-8'>
          <div className='text-center'>
            <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-4'></div>
            <p className='text-gray-600'>Restaurando estado del operador...</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className='grid gap-4'>
      <AnimatePresence>
        {loading && (
          <AuthLoadingScreen
            onAnimationStart={() => {
              if (!loading) {
                setShowForm(true);
              }
            }}
          />
        )}
      </AnimatePresence>
      <Heading title='Panel operador' />
      <Separator />

      <StatusCards ticketStatus={ticketStatus} />

      <div className='grid gap-4 md:grid-cols-2'>
        <ControlPanel
          ticketStatus={ticketStatus}
          pendingAction={pendingAction}
          isLoading={isLoading}
          handleNext={handleNext}
          handleAbsent={handleAbsent}
          handleCompleted={handleCompleted}
          isNextButtonEnabled={isNextButtonEnabled()}
          nextButtonText={getNextButtonText()}
        />
        <QueueStatusPanel ticketStatus={ticketStatus} />
      </div>
      <AttendanceHistoryTable />
    </section>
  );
}
