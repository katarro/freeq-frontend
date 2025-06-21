import { useCallback, useRef } from 'react';
import { toast } from 'sonner';
import { UnifiedTicketResponse } from './use-next-ticket';

interface UseOperatorActionsProps {
  isLoading: boolean;
  flowStep: string;
  pendingAction: 'absent' | 'completed' | null;
  currentTicketId: string | null;
  isLoaded: boolean;
  ticketStatus: any;
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

// ✅ CONSTANTES FUERA DEL HOOK: No se recrean en cada render
const INVALID_CLIENT_PATTERNS = [
  'undefined',
  'Cliente #undefined',
  'null',
  'Cliente null',
  'Sin nombre',
  'Cliente #Sin',
  'Cliente sin datos',
  'undefined undefined',
] as const;

const VALID_FALLBACK_REGEX = /^Cliente #\d+$/;

// ✅ FUNCIÓN EXTERNA: No se recrea NUNCA
const isUndefinedClient = (clientName?: string): boolean => {
  if (!clientName || clientName.trim() === '') {
    return true;
  }

  const isInvalid = INVALID_CLIENT_PATTERNS.some(
    (pattern) =>
      clientName.toLowerCase() === pattern.toLowerCase() ||
      clientName.toLowerCase().includes('undefined') ||
      clientName.toLowerCase().includes(' null '),
  );

  const isValidFallback = VALID_FALLBACK_REGEX.test(clientName);

  return isInvalid && !isValidFallback;
};

export const useOperatorActions = ({
  isLoading,
  flowStep,
  pendingAction,
  currentTicketId,
  isLoaded,
  ticketStatus,
  callNextTicket,
  processTicketAction,
  fetchData,
  clearCurrentTicket,
  setFlowStep,
  setPendingAction,
  setError,
}: UseOperatorActionsProps) => {
  const processingRef = useRef(false);

  // ✅ FUNCIÓN AUXILIAR: Manejo robusto de errores de API
  const handleApiError = useCallback(
    (error: any) => {
      const errorMessage = error.message || error.toString();

      // console.log('🔍 Analizando error de API:', {
      //   message: errorMessage,
      //   type: error.type,
      //   status: error.status,
      //   response: error.response?.data,
      // });

      // ✅ TICKET DUPLICADO - LIMPIAR Y REINTENTAR
      if (
        errorMessage.includes('ya fue procesado') ||
        errorMessage.includes('Ticket duplicado') ||
        error.type === 'DUPLICATE_TICKET'
      ) {
        // console.log('🔄 Ticket duplicado detectado - Limpiando estado...');

        clearCurrentTicket();
        setError(null);

        toast.info('🔄 Obteniendo siguiente ticket disponible...');

        setTimeout(() => {
          // console.log('🔄 Reintentando obtener siguiente ticket...');
          if (!processingRef.current) {
            handleNext();
          }
        }, 500);

        return;
      }

      // Cola vacía - No es un error crítico
      if (
        errorMessage.includes('No hay tickets en espera') ||
        errorMessage.includes('cola vacía') ||
        errorMessage.includes('No hay nadie en cola') ||
        error.type === 'EMPTY_QUEUE'
      ) {
        // console.log('📭 Cola vacía detectada - Estado normal');
        toast.info('📭 No hay clientes en cola. Esperando nuevos clientes...');
        setFlowStep('waiting');
        clearCurrentTicket();
        return;
      }

      // Errores de estructura de datos
      if (
        errorMessage.includes('Error crítico') ||
        errorMessage.includes('ID inválido') ||
        errorMessage.includes('estructura')
      ) {
        // console.log('🔧 Error de estructura detectado');
        toast.error('⚠️ Error en los datos del ticket. Reintentando...');

        clearCurrentTicket();
        return;
      }

      // Errores de servidor
      if (error.response?.status >= 500) {
        toast.error('🔧 Error del servidor. Inténtalo nuevamente.');
        return;
      }

      // Errores de red
      if (error.type === 'NETWORK_ERROR') {
        toast.error('🌐 Error de conexión. Verifica tu internet.');
        return;
      }

      // Error genérico
      toast.error(`❌ Error: ${errorMessage}`);
    },
    [setFlowStep, clearCurrentTicket, setError],
  );

  // Función principal para manejar siguiente
  const handleNext = useCallback(async () => {
    // 🔒 PROTECCIÓN CONTRA DOBLE CLICK
    if (isLoading || processingRef.current) {
      // console.log(
      //   '⏸️ HandleNext bloqueado - isLoading:',
      //   isLoading,
      //   'processingRef:',
      //   processingRef.current,
      // );
      return;
    }

    processingRef.current = true;
    // console.log(
    //   '▶️ HandleNext iniciado - flowStep:',
    //   flowStep,
    //   'pendingAction:',
    //   pendingAction,
    //   'currentTicketId:',
    //   currentTicketId,
    // );

    try {
      // 📍 CASO 1 & 2: Inicio de sesión/turno + Llamar primer cliente
      if (flowStep === 'waiting') {
        // console.log(
        //   '📞 CASO 1-2: Llamando primer/siguiente cliente desde waiting...',
        // );

        try {
          const result = await callNextTicket();
          console.log('✅ Cliente llamado exitosamente:', {
            clientName: result.clientName,
            ticketId: result.id,
            ticketNumber: result.ticketNumber,
            // responseId: result._metadata?.responseId,
          });

          setTimeout(() => fetchData(), 1000);
        } catch (error: any) {
          console.error('❌ Error al llamar primer cliente:', error);
          handleApiError(error);
        }
        return;
      }

      // 📍 CASO 3 & 4: Cliente presente/ausente - Finalizar atención
      if (flowStep === 'called' && currentTicketId) {
        if (!currentTicketId || currentTicketId.trim() === '') {
          toast.error('❌ No hay ticket activo para procesar');
          processingRef.current = false;
          return;
        }

        // ✅ DETECCIÓN CORREGIDA DE CLIENTE UNDEFINED
        const clientName = ticketStatus?.currentClient || '';
        const isClientUndefined = isUndefinedClient(clientName);

        // console.log('🔍 Analizando cliente para procesamiento:', {
        //   clientName,
        //   isClientUndefined,
        //   pendingAction,
        //   currentTicketId,
        //   'Detalles de validación': {
        //     'Es string vacío': clientName.trim() === '',
        //     'Contiene undefined': clientName
        //       .toLowerCase()
        //       .includes('undefined'),
        //     'Es patrón de fallback válido':
        //       VALID_FALLBACK_REGEX.test(clientName), // ✅ Usar constante
        //     'Resultado final': isClientUndefined,
        //   },
        // });

        if (isClientUndefined) {
          // 📍 CASO ESPECIAL: Cliente verdaderamente undefined - Finalizar sin API
          // console.log(
          //   '📋 CASO ESPECIAL: Cliente sin datos válidos - Finalizando sin procesamiento de API',
          // );

          toast.success('✅ Atención finalizada (cliente sin datos válidos)');

          setFlowStep('completed');
          clearCurrentTicket();

          setTimeout(() => fetchData(), 1000);
          return;
        }

        // 📍 CASO NORMAL: Cliente válido - Requiere acción pendiente
        if (!pendingAction) {
          toast.warning(
            '⚠️ Debe seleccionar Completado o Ausente antes de continuar',
          );
          processingRef.current = false;
          return;
        }

        // console.log(
        //   `⚡ CASO 3-4: Finalizando atención con acción "${pendingAction}" para ticket:`,
        //   currentTicketId,
        //   'Cliente:',
        //   clientName,
        // );

        try {
          // console.log(
          //   `📤 Enviando ${pendingAction} al backend para ticket:`,
          //   currentTicketId,
          // );

          await processTicketAction(currentTicketId, pendingAction);

          const actionMessage =
            pendingAction === 'completed'
              ? `Cliente "${clientName}" atendido exitosamente`
              : `Cliente "${clientName}" marcado como ausente`;

          toast.success(actionMessage);

          setFlowStep('completed');
          clearCurrentTicket();

          // console.log(
          //   '✅ Acción procesada exitosamente via API, cambiando a estado completed',
          // );

          setTimeout(() => fetchData(), 1000);
        } catch (processError: any) {
          console.error(
            '❌ Error al procesar acción del ticket:',
            processError,
          );

          if (processError.message?.includes('Ticket no encontrado')) {
            toast.warning('⚠️ El ticket ya fue procesado por otro ejecutivo');
            clearCurrentTicket();
          } else if (processError.message?.includes('no se puede procesar')) {
            toast.error(
              '⚠️ El ticket no se puede procesar en su estado actual',
            );
          } else {
            handleApiError(processError);
          }
        }
        return;
      }

      // 📍 CASO 5: Continuar con siguiente cliente desde completed
      if (flowStep === 'completed') {
        // console.log('📞 CASO 5: Llamando siguiente cliente desde completed...');

        try {
          const result = await callNextTicket();
          // console.log('✅ Siguiente cliente llamado exitosamente:', {
          //   clientName: result.clientName,
          //   ticketId: result.id,
          //   ticketNumber: result.ticketNumber,
          //   // responseId: result._metadata?.responseId,
          // });

          setTimeout(() => fetchData(), 1000);
        } catch (error: any) {
          console.error('❌ Error al llamar siguiente cliente:', error);
          handleApiError(error);
        }
        return;
      }

      // 📍 CASO EDGE: Cliente llamado pero sin acción pendiente
      if (flowStep === 'called' && !pendingAction) {
        const clientName = ticketStatus?.currentClient || '';
        if (!isUndefinedClient(clientName)) {
          toast.warning(
            '⚠️ Debe seleccionar Completado o Ausente antes de continuar',
          );
        }
        processingRef.current = false;
        return;
      }

      // 📍 CASO ERROR: Estado inválido
      console.warn('🤔 Estado inválido en handleNext:', {
        flowStep,
        pendingAction,
        currentTicketId,
      });
      toast.error('❌ Estado inválido. Contacte al administrador si persiste.');
    } catch (error: any) {
      console.error('🚨 Error general en handleNext:', error);

      if (
        error.message?.includes('crítico') ||
        error.message?.includes('fatal')
      ) {
        // console.log('🔄 Error crítico detectado, reseteando a estado waiting');
        setFlowStep('waiting');
        clearCurrentTicket();
        setPendingAction(null);
        toast.error(
          '❌ Error crítico detectado. Sistema reiniciado a estado seguro.',
        );
      } else {
        handleApiError(error);
      }
    } finally {
      processingRef.current = false;
      // console.log('🏁 HandleNext finalizado');
    }
  }, [
    isLoading,
    flowStep,
    pendingAction,
    currentTicketId,
    ticketStatus,
    callNextTicket,
    processTicketAction,
    fetchData,
    clearCurrentTicket,
    setFlowStep,
    setPendingAction,
    setError,
    handleApiError,
  ]);

  // 📍 CASO 3: Cliente presente - Marcar como completado
  const handleCompleted = useCallback(() => {
    const newAction = pendingAction === 'completed' ? null : 'completed';
    // console.log('✅ CASO 3: Marcando cliente como completado:', newAction);

    setPendingAction(newAction);
    setError(null);

    if (newAction === 'completed') {
      toast.info('Cliente marcado como completado');
    } else {
      toast.info('Acción cancelada');
    }
  }, [pendingAction, setPendingAction, setError]);

  // 📍 CASO 4: Cliente ausente - Marcar como ausente
  const handleAbsent = useCallback(() => {
    const newAction = pendingAction === 'absent' ? null : 'absent';
    // console.log('❌ CASO 4: Marcando cliente como ausente:', newAction);

    setPendingAction(newAction);
    setError(null);

    if (newAction === 'absent') {
      toast.info('Cliente marcado como ausente');
    } else {
      toast.info('Acción cancelada');
    }
  }, [pendingAction, setPendingAction, setError]);

  // Función para determinar si el botón principal está habilitado
  const isNextButtonEnabled = useCallback(() => {
    if (isLoading || processingRef.current || !isLoaded) {
      return false;
    }

    switch (flowStep) {
      case 'waiting':
        return true;

      case 'called':
        const clientName = ticketStatus?.currentClient || '';
        const isClientUndefined = isUndefinedClient(clientName);

        if (isClientUndefined) {
          return true;
        }

        return !!pendingAction;

      case 'completed':
        return true;

      default:
        return false;
    }
  }, [
    isLoading,
    isLoaded,
    flowStep,
    pendingAction,
    ticketStatus?.currentClient,
  ]);

  // Función para obtener el texto del botón principal
  const getNextButtonText = useCallback(() => {
    if (!isLoaded) return 'Cargando...';
    if (isLoading) return 'Procesando...';

    switch (flowStep) {
      case 'waiting':
        return 'Siguiente';

      case 'called':
        const clientName = ticketStatus?.currentClient || '';
        const isClientUndefined = isUndefinedClient(clientName);

        if (isClientUndefined) {
          return 'Finalizar atención';
        }

        return pendingAction ? 'Finalizar atención' : 'Seleccione acción';

      case 'completed':
        return 'Siguiente';

      default:
        return 'Siguiente';
    }
  }, [
    isLoaded,
    isLoading,
    flowStep,
    pendingAction,
    ticketStatus?.currentClient,
  ]);

  return {
    handleNext,
    handleAbsent,
    handleCompleted,
    isNextButtonEnabled,
    getNextButtonText,
    processingRef,
  };
};
