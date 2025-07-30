import { useCallback, useRef, useState } from 'react';
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
  // ✅ NUEVA PROP: Conteo de clientes en cola
  countUsersInQueue: number;
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

    return 'GENERIC_ERROR';
  }

  static handleCallNextError(error: any) {
    if (error.response?.status === 404) {
      toast.info('📭 Cola vacía. Esperando nuevos clientes...');
      return 'EMPTY_QUEUE';
    }

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
  countUsersInQueue, // ✅ NUEVA PROP
}: UseOperatorActionsProps) => {
  // Referencias para protección contra doble ejecución
  const processingRef = useRef(false);
  const callingRef = useRef(false);
  const [isProcessing, setIsProcessing] = useState(false);

  // ✅ ACCIÓN 1: Llamar siguiente cliente - CON VALIDACIÓN DE COLA
  const handleCallNext = useCallback(async () => {
    LoggingService.logAction('Intentando llamar siguiente cliente', {
      flowStep,
      currentTicketId,
      countUsersInQueue,
    });

    // 🔒 PROTECCIONES BÁSICAS
    if (isLoading || callingRef.current || processingRef.current) {
      console.log('🔒 Llamada bloqueada - operación en curso');
      return;
    }

    // ✅ VALIDACIÓN NUEVA: Verificar si hay clientes en cola
    if (countUsersInQueue <= 0) {
      console.log('📭 Cola vacía - evitando request al backend');
      toast.info('📭 Cola vacía. Esperando nuevos clientes...');
      return;
    }

    console.log(`📊 Clientes en cola detectados: ${countUsersInQueue} - procediendo con request`);

    callingRef.current = true;
    processingRef.current = true;

    try {
      LoggingService.logAction('Iniciando llamada al siguiente cliente', {
        flowStep,
        currentTicketId,
        clientesEnCola: countUsersInQueue,
      });

      const result = await callNextTicket();

      LoggingService.logSuccess('Cliente llamado', {
        clientName: result.clientName,
        ticketId: result.id,
        ticketNumber: result.ticketNumber,
      });

      // Actualizar datos después de llamar
      setTimeout(() => fetchData(), 1000);
    } catch (error: any) {
      LoggingService.logError('llamar siguiente cliente', error);

      const errorType = ErrorHandlingService.handleCallNextError(error);

      if (errorType === 'EMPTY_QUEUE') {
        console.warn('⚠️ 404 recibido del backend - cola realmente vacía (fallback)');
        setFlowStep('waiting');
        clearCurrentTicket();
      } else {
        toast.error(`❌ Error: ${error.message || 'Error desconocido'}`);
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
    countUsersInQueue, // ✅ NUEVA DEPENDENCIA
    callNextTicket,
    fetchData,
    setFlowStep,
    clearCurrentTicket,
  ]);

  // ACCIÓN 2: Completar cliente
  const handleCompleteClient = useCallback(async () => {
    const executionId = Math.random().toString(36).substr(2, 9);
    console.log(`🔵 [EXEC-${executionId}] handleCompleteClient INICIADO`);

    if (isProcessing) {
      console.log(`🔒 [EXEC-${executionId}] YA ESTÁ PROCESANDO - BLOQUEADO`);
      return;
    }

    if (!currentTicketId?.trim()) {
      toast.error('❌ No hay ticket activo');
      return;
    }

    setIsProcessing(true);

    try {
      console.log(`🚀 [EXEC-${executionId}] Iniciando processTicketAction`);

      // CAPTURAR VALORES INMUTABLES
      const ticketId = currentTicketId;
      const clientName = ticketStatus?.currentClient || '';

      await processTicketAction(ticketId, 'completed');

      console.log(`✅ [EXEC-${executionId}] processTicketAction COMPLETADO`);

      // Post-procesamiento
      clearCurrentTicket();
      setFlowStep('completed');
      toast.success(`✅ Cliente "${clientName}" atendido`);
      setTimeout(() => fetchData(), 1000);
    } catch (error: any) {
      console.error(`❌ [EXEC-${executionId}] ERROR:`, error);
      // NO re-lanzar para evitar cascadas
    } finally {
      console.log(`🔓 [EXEC-${executionId}] LIBERANDO PROCESAMIENTO`);
      setIsProcessing(false);
    }
  }, [
    // SOLO DEPENDENCIAS ESENCIALES
    currentTicketId,
    ticketStatus?.currentClient,
    isProcessing,
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

  // ✅ FUNCIONES DE ESTADO ACTUALIZADAS
  const isNextButtonEnabled = useCallback(() => {
    if (isLoading || !isLoaded || callingRef.current || processingRef.current) return false;
    if (countUsersInQueue <= 0) return false; // ✅ NUEVA VALIDACIÓN
    return flowStep === 'waiting' || flowStep === 'completed';
  }, [isLoading, isLoaded, flowStep, countUsersInQueue]);

  const getNextButtonText = useCallback(() => {
    if (!isLoaded) return 'Cargando...';
    if (callingRef.current) return 'Llamando...';
    if (countUsersInQueue <= 0) return 'Sin clientes en cola'; // ✅ NUEVO TEXTO
    return 'Llamar Siguiente Cliente';
  }, [isLoaded, countUsersInQueue]);

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
