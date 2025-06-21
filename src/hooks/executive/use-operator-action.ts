import { useCallback, useRef } from 'react';
import { toast } from 'sonner';
import { UnifiedTicketResponse } from './use-next-ticket';

interface UseOperatorActionsProps {
  isLoading: boolean;
  flowStep: string;
  pendingAction: 'absent' | 'completed' | null;
  currentTicketId: string | null;
  isLoaded: boolean;
  callNextTicket: () => Promise<UnifiedTicketResponse>;
  processTicketAction: (
    ticketId: string,
    action: 'absent' | 'completed',
  ) => Promise<void>;
  fetchData: () => void;
  clearCurrentTicket: () => void;
  setFlowStep: (step: 'waiting' | 'called' | 'completed') => void;
  setPendingAction: (action: 'absent' | 'completed' | null) => void;
  setError: (error: string | null) => void;
}

export const useOperatorActions = ({
  isLoading,
  flowStep,
  pendingAction,
  currentTicketId,
  isLoaded,
  callNextTicket,
  processTicketAction,
  fetchData,
  clearCurrentTicket,
  setFlowStep,
  setPendingAction,
  setError,
}: UseOperatorActionsProps) => {
  const processingRef = useRef(false);

  // Función principal para manejar siguiente
  const handleNext = useCallback(async () => {
    if (isLoading || processingRef.current) {
      console.log(
        '⏸️ HandleNext bloqueado - isLoading:',
        isLoading,
        'processingRef:',
        processingRef.current,
      );
      return;
    }

    processingRef.current = true;
    console.log('▶️ HandleNext iniciado - flowStep:', flowStep);

    try {
      if (flowStep === 'waiting') {
        console.log('📞 Llamando próximo ticket...');
        try {
          await callNextTicket();
          setTimeout(() => fetchData(), 1000);
        } catch (error: any) {
          console.error('❌ Error al llamar ticket:', error);
          const errorMessage = error.message || error.toString();

          if (
            errorMessage.includes('No hay tickets en espera') ||
            errorMessage.includes('cola vacía') ||
            errorMessage.includes('No hay nadie en cola')
          ) {
            toast.info('📭 No hay clientes en cola');
            return;
          }
          throw error;
        }
        return;
      }

      if (flowStep === 'called' && pendingAction && currentTicketId) {
        if (!currentTicketId || currentTicketId.trim() === '') {
          toast.error('❌ No hay ticket activo para procesar');
          processingRef.current = false;
          return;
        }

        console.log(
          '⚡ Procesando acción:',
          pendingAction,
          'para ticket:',
          currentTicketId,
        );

        try {
          await processTicketAction(currentTicketId, pendingAction);
          await new Promise((resolve) => setTimeout(resolve, 300));
          await callNextTicket();
          setTimeout(() => fetchData(), 1000);
        } catch (processError: any) {
          console.error('❌ Error al procesar ticket:', processError);
          const errorMessage = processError.message || processError.toString();

          switch (true) {
            case errorMessage.includes('No hay tickets en espera'):
            case errorMessage.includes('cola vacía'):
              toast.info('📭 No hay más clientes en cola');
              clearCurrentTicket();
              setFlowStep('waiting');
              break;
            case errorMessage.includes('Token'):
            case errorMessage.includes('401'):
              toast.error('🔐 Sesión expirada. Inicia sesión nuevamente.');
              break;
            case errorMessage.includes('conectar'):
              toast.error('🌐 Error de conexión. Verifica tu internet.');
              break;
            default:
              toast.error(`❌ Error procesando: ${errorMessage}`);
              break;
          }
        }
        return;
      }

      if (flowStep === 'completed') {
        console.log('✅ Completado, llamando siguiente...');
        await callNextTicket();
        setTimeout(() => fetchData(), 1000);
        return;
      }

      if (flowStep === 'called' && !pendingAction) {
        toast.warning(
          '⚠️ Debe seleccionar Completado o Ausente antes de continuar',
        );
        processingRef.current = false;
        return;
      }

      console.warn('🤔 Estado inválido en handleNext:', {
        flowStep,
        pendingAction,
        currentTicketId,
      });
      toast.error('❌ Estado inválido. Use el botón Reset si persiste.');
    } catch (error: any) {
      console.error('🚨 Error general en handleNext:', error);
      const errorMessage = error.message || 'Error desconocido';
      toast.error(`❌ Error: ${errorMessage}`);
    } finally {
      processingRef.current = false;
      console.log('🏁 HandleNext finalizado');
    }
  }, [
    isLoading,
    flowStep,
    pendingAction,
    currentTicketId,
    callNextTicket,
    processTicketAction,
    fetchData,
    clearCurrentTicket,
    setFlowStep,
  ]);

  // Función para manejar ausente
  const handleAbsent = useCallback(() => {
    const newAction = pendingAction === 'absent' ? null : 'absent';
    console.log('👤 Marcando ausente:', newAction);
    setPendingAction(newAction);
    setError(null);
  }, [pendingAction, setPendingAction, setError]);

  // Función para manejar completado
  const handleCompleted = useCallback(() => {
    const newAction = pendingAction === 'completed' ? null : 'completed';
    console.log('✅ Marcando completado:', newAction);
    setPendingAction(newAction);
    setError(null);
  }, [pendingAction, setPendingAction, setError]);

  // Función para determinar si el botón está habilitado
  const isNextButtonEnabled = useCallback(() => {
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
  }, [isLoading, isLoaded, flowStep, pendingAction]);

  // Función para obtener el texto del botón
  const getNextButtonText = useCallback(() => {
    if (!isLoaded) return 'Cargando...';
    if (isLoading) return 'Procesando...';
    return 'Siguiente';
  }, [isLoaded, isLoading]);

  return {
    handleNext,
    handleAbsent,
    handleCompleted,
    isNextButtonEnabled,
    getNextButtonText,
    processingRef,
  };
};
