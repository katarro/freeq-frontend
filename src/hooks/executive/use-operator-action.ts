import { useCallback, useRef } from 'react';
import { toast } from 'sonner';
import { UnifiedTicketResponse } from './use-next-ticket';

interface UseOperatorActionsProps {
  isLoading: boolean;
  flowStep: string;
  currentTicketId: string | null;
  isLoaded: boolean;
  ticketStatus: any;
  callNextTicket: () => Promise<UnifiedTicketResponse>;
  processTicketAction: (ticketId: string, action: 'absent' | 'completed') => Promise<void>;
  fetchData: () => void;
  clearCurrentTicket: () => void;
  setFlowStep: (step: 'waiting' | 'called' | 'completed') => void;
  setError: (error: string | null) => void;
}

// Constantes para patrones de clientes inválidos
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

// Clase helper para validación de clientes (SRP)
class ClientValidationService {
  static isUndefinedClient(clientName?: string): boolean {
    if (!clientName || clientName.trim() === '') return true;

    const isInvalid = INVALID_CLIENT_PATTERNS.some(
      (pattern) =>
        clientName.toLowerCase() === pattern.toLowerCase() ||
        clientName.toLowerCase().includes('undefined') ||
        clientName.toLowerCase().includes(' null '),
    );

    const isValidFallback = VALID_FALLBACK_REGEX.test(clientName);
    return isInvalid && !isValidFallback;
  }
}

// Clase helper para logging (SRP)
class LoggingService {
  static logAction(action: string, details?: any) {
    console.log(`🎯 ACCIÓN: ${action}`, details);
  }

  static logError(action: string, error: any) {
    console.error(`❌ Error en ${action}:`, error);
  }

  static logSuccess(action: string, details?: any) {
    console.log(`✅ ${action} exitoso:`, details);
  }
}

// Clase helper para manejo de errores (SRP)
class ErrorHandlingService {
  static handleTicketError(error: any, action: string) {
    if (error.response?.status === 404) {
      toast.warning('⚠️ El ticket ya fue procesado por otro ejecutivo');
      return 'TICKET_NOT_FOUND';
    }

    if (error.message?.includes('no se puede procesar')) {
      toast.error('⚠️ El ticket no se puede procesar en su estado actual');
      return 'INVALID_STATE';
    }

    if (error.message?.includes('No tienes permiso')) {
      toast.error('⚠️ No tienes permiso para realizar esta acción');
      return 'NO_PERMISSION';
    }

    toast.error(`❌ Error: ${error.message || 'Error desconocido'}`);
    return 'GENERIC_ERROR';
  }

  static handleCallNextError(error: any) {
    if (error.response?.status === 404) {
      toast.info('📭 No hay clientes en cola. Esperando nuevos clientes...');
      return 'EMPTY_QUEUE';
    }

    toast.error(`❌ Error: ${error.message || 'Error desconocido'}`);
    return 'GENERIC_ERROR';
  }
}

export const useOperatorActions = ({
  isLoading,
  flowStep,
  currentTicketId,
  isLoaded,
  ticketStatus,
  callNextTicket,
  processTicketAction,
  fetchData,
  clearCurrentTicket,
  setFlowStep,
  setError,
}: UseOperatorActionsProps) => {
  // Referencias para protección contra doble ejecución
  const processingRef = useRef(false);
  const callingRef = useRef(false);

  // ACCIÓN 1: Llamar siguiente cliente
  const handleCallNext = useCallback(async () => {
    LoggingService.logAction('Llamar siguiente cliente');

    // Protecciones
    if (isLoading || callingRef.current || processingRef.current) {
      console.log('🔒 Llamada bloqueada - operación en curso');
      return;
    }

    callingRef.current = true;
    processingRef.current = true;

    try {
      LoggingService.logAction('Iniciando llamada al siguiente cliente', {
        flowStep,
        currentTicketId,
      });

      const result = await callNextTicket();

      LoggingService.logSuccess('Cliente llamado', {
        clientName: result.clientName,
        ticketId: result.id,
        ticketNumber: result.ticketNumber,
      });

      toast.success(`📞 Cliente llamado: ${result.clientName || result.ticketNumber}`);

      // Actualizar datos después de llamar
      setTimeout(() => fetchData(), 1000);
    } catch (error: any) {
      LoggingService.logError('llamar siguiente cliente', error);

      const errorType = ErrorHandlingService.handleCallNextError(error);

      if (errorType === 'EMPTY_QUEUE') {
        setFlowStep('waiting');
        clearCurrentTicket();
      }
    } finally {
      callingRef.current = false;
      processingRef.current = false;
      LoggingService.logAction('Llamada finalizada');
    }
  }, [
    isLoading,
    flowStep,
    currentTicketId,
    callNextTicket,
    fetchData,
    setFlowStep,
    clearCurrentTicket,
  ]);

  // ACCIÓN 2: Completar cliente
  const handleCompleteClient = useCallback(async () => {
    // Validaciones iniciales
    if (!currentTicketId || currentTicketId.trim() === '') {
      toast.error('❌ No hay ticket activo para procesar');
      return;
    }

    if (isLoading || processingRef.current) {
      console.log('🔒 Completar bloqueado - operación en curso');
      return;
    }

    // Verificar cliente undefined
    const clientName = ticketStatus?.currentClient || '';
    const isClientUndefined = ClientValidationService.isUndefinedClient(clientName);

    if (isClientUndefined) {
      LoggingService.logAction('Cliente sin datos válidos detectado, finalizando automáticamente');
      toast.success('✅ Atención finalizada (cliente sin datos válidos)');
      setFlowStep('completed');
      clearCurrentTicket();
      setTimeout(() => fetchData(), 1000);
      return;
    }

    processingRef.current = true;

    try {
      LoggingService.logAction('Procesando ticket como completado', {
        ticketId: currentTicketId,
        clientName,
        flowStep,
      });

      // 🔍 DEBUG ADICIONAL: Estado antes de enviar al backend
      console.log('🔍 DEBUG COMPLETAR - Estado antes de backend:', {
        currentTicketId,
        clientName,
        flowStep,
        ticketStatus: ticketStatus?.status,
        isClientUndefined,
        fullTicketStatus: ticketStatus,
      });

      // Procesar en backend
      await processTicketAction(currentTicketId, 'completed');

      LoggingService.logSuccess('Ticket procesado en backend');

      // Actualizar estado frontend
      clearCurrentTicket();
      setFlowStep('completed');

      toast.success(`✅ Cliente "${clientName}" atendido exitosamente`);

      // Actualizar datos
      setTimeout(() => fetchData(), 1000);
    } catch (error: any) {
      LoggingService.logError('completando ticket', error);

      const errorType = ErrorHandlingService.handleTicketError(error, 'completar');

      if (errorType === 'TICKET_NOT_FOUND') {
        clearCurrentTicket();
      }

      // ✅ RE-LANZAR EL ERROR para que el wrapper pueda manejarlo
      throw error;
    } finally {
      processingRef.current = false;
      LoggingService.logAction('Completar finalizado');
    }
  }, [
    currentTicketId,
    ticketStatus,
    isLoading,
    processTicketAction,
    clearCurrentTicket,
    setFlowStep,
    fetchData,
  ]);

  // ACCIÓN 3: Marcar ausente
  const handleMarkAbsent = useCallback(async () => {
    LoggingService.logAction('Marcar cliente ausente');

    // Validaciones iniciales
    if (!currentTicketId || currentTicketId.trim() === '') {
      toast.error('❌ No hay ticket activo para procesar');
      return;
    }

    if (isLoading || processingRef.current) {
      console.log('🔒 Marcar ausente bloqueado - operación en curso');
      return;
    }

    processingRef.current = true;

    try {
      const clientName = ticketStatus?.currentClient || '';

      LoggingService.logAction('Procesando ticket como ausente', {
        ticketId: currentTicketId,
        clientName,
        flowStep,
      });

      // Procesar en backend
      await processTicketAction(currentTicketId, 'absent');

      LoggingService.logSuccess('Ticket marcado como ausente en backend');

      // Actualizar estado frontend
      clearCurrentTicket();
      setFlowStep('completed');

      toast.success(`❌ Cliente "${clientName}" marcado como ausente`);

      // Actualizar datos
      setTimeout(() => fetchData(), 1000);
    } catch (error: any) {
      LoggingService.logError('marcando ausente', error);

      const errorType = ErrorHandlingService.handleTicketError(error, 'marcar ausente');

      if (errorType === 'TICKET_NOT_FOUND') {
        clearCurrentTicket();
      }

      // ✅ RE-LANZAR EL ERROR para que el wrapper pueda manejarlo
      throw error;
    } finally {
      processingRef.current = false;
      LoggingService.logAction('Marcar ausente finalizado');
    }
  }, [
    currentTicketId,
    ticketStatus,
    isLoading,
    processTicketAction,
    clearCurrentTicket,
    setFlowStep,
    fetchData,
  ]);

  // Funciones de estado para backward compatibility
  const isNextButtonEnabled = useCallback(() => {
    if (isLoading || !isLoaded || callingRef.current || processingRef.current) return false;
    return flowStep === 'waiting' || flowStep === 'completed';
  }, [isLoading, isLoaded, flowStep]);

  const getNextButtonText = useCallback(() => {
    if (!isLoaded) return 'Cargando...';
    if (callingRef.current) return 'Llamando...';
    return 'Llamar Siguiente Cliente';
  }, [isLoaded]);

  return {
    // Nuevas acciones específicas
    handleCallNext,
    handleCompleteClient,
    handleMarkAbsent,

    // Funciones legacy para backward compatibility
    handleNext: handleCallNext,
    handleAbsent: handleMarkAbsent,
    handleCompleted: handleCompleteClient,
    isNextButtonEnabled,
    getNextButtonText,

    // Referencias para debugging
    processingRef,
    callingRef,

    // Utilidades
    isUndefinedClient: ClientValidationService.isUndefinedClient,
  };
};
