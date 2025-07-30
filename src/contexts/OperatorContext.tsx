'use client';

import React, { createContext, useContext, useEffect, useState, ReactNode, useMemo } from 'react';
import {
  useNextTicket,
  useStatusCard,
  useOperatorState,
  useOperatorActions,
  useOperatorErrorHandler,
  useOperatorTicketHandler,
} from '@/hooks/executive';

// Tipo base: Extender el retorno de useOperatorState
type OperatorStateReturn = ReturnType<typeof useOperatorState>;

// Tipo extendido: Solo agregar lo que no está en useOperatorState
interface OperatorContextExtensions {
  // Estados adicionales específicos del contexto
  statusMarked: boolean;
  error: string | null;
  isLoading: boolean;

  // ✅ NUEVO: Conteo de clientes en cola
  countUsersInQueue: number;

  // Acciones principales separadas
  handleCallNext: () => Promise<void>;
  handleCompleteClient: () => Promise<void>;
  handleMarkAbsent: () => Promise<void>;
  startAttendingTicket: (ticketId: string) => Promise<any>;

  // Acciones legacy (para backward compatibility)
  handleNext: () => Promise<void>;
  handleAbsent: () => void;
  handleCompleted: () => void;

  // Funciones de utilidad
  isNextButtonEnabled: () => boolean;
  getNextButtonText: () => string;
}

// Tipo final: Combinación de ambos
type OperatorContextType = OperatorStateReturn & OperatorContextExtensions;

// Props del provider
interface OperatorProviderProps {
  children: ReactNode;
}

// Crear el contexto
const OperatorContext = createContext<OperatorContextType | undefined>(undefined);

// Hook personalizado para usar el contexto
export const useOperatorContext = (): OperatorContextType => {
  const context = useContext(OperatorContext);
  if (!context) {
    throw new Error('useOperatorContext debe usarse dentro de OperatorProvider');
  }
  return context;
};

// Clase helper para logging del contexto (SRP)
class ContextLoggingService {
  static logStateChange(type: string, details: any) {
    if (process.env.NODE_ENV === 'development') {
      console.log(`📊 Contexto - ${type}:`, details);
    }
  }

  static logError(context: string, error: any) {
    console.error(`❌ Error en contexto ${context}:`, error);
  }
}

// Provider del contexto refactorizado
const OperatorProvider: React.FC<OperatorProviderProps> = ({ children }) => {
  // Obtener todo el estado del operador
  const operatorState = useOperatorState();
  const {
    setTicketStatus,
    setCurrentTicketId,
    setPendingAction,
    setFlowStep,
    clearCurrentTicket,
    currentTicketId,
    flowStep,
    pendingAction,
    isLoaded,
    markTicketAsProcessed,
    wasTicketProcessed,
    sessionTicketHistory,
    lastProcessedTicketId,
  } = operatorState;

  // ✅ OBTENER countUsersInQueue desde useStatusCard
  const { fetchData, countUsersInQueue } = useStatusCard();
  const [statusMarked, setStatusMarked] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Custom hooks para lógica específica
  const { handleError } = useOperatorErrorHandler({
    setTicketStatus,
    setCurrentTicketId,
    setPendingAction,
    setFlowStep,
    clearCurrentTicket,
  });

  const { handleTicketCompleted, handleNextTicketCalled } = useOperatorTicketHandler({
    setCurrentTicketId,
    setFlowStep,
    setTicketStatus,
    setPendingAction,
    clearCurrentTicket,
    setError,
  });

  // Enhanced error handler simplificado
  const enhancedHandleError = (errorMessage: string) => {
    ContextLoggingService.logError('manejando error', errorMessage);

    // Caso especial: Errores de API que NO requieren limpiar estado
    if (
      errorMessage.includes('ya fue procesado') ||
      errorMessage.includes('Ticket duplicado') ||
      errorMessage.includes('Ticket no encontrado')
    ) {
      ContextLoggingService.logStateChange('Error de estado de ticket detectado', errorMessage);

      // NO limpiar estado automáticamente - dejar que el usuario maneje
      // El backend es la fuente de verdad
      setError(errorMessage);
      return;
    }

    // Para otros errores, usar el manejador normal
    handleError(errorMessage);
  };

  // Configuración de useNextTicket
  const { callNextTicket, processTicketAction, startAttendingTicket, isLoading } = useNextTicket({
    onTicketCompleted: handleTicketCompleted,
    onNextTicketCalled: handleNextTicketCalled,
    onError: enhancedHandleError,
    wasTicketProcessed,
    markTicketAsProcessed,
  });

  // ✅ CONFIGURACIÓN DE useOperatorActions CON countUsersInQueue
  const {
    handleCallNext,
    handleCompleteClient,
    handleMarkAbsent,
    // Legacy functions para backward compatibility
    handleNext,
    handleAbsent,
    handleCompleted,
    isNextButtonEnabled,
    getNextButtonText,
  } = useOperatorActions({
    isLoading,
    flowStep,
    currentTicketId,
    isLoaded,
    callNextTicket,
    processTicketAction,
    fetchData,
    clearCurrentTicket,
    setFlowStep,
    setError,
    ticketStatus: operatorState.ticketStatus,
    countUsersInQueue, // ✅ AGREGAR countUsersInQueue
  });

  // Efecto para restaurar estado
  useEffect(() => {
    if (isLoaded && currentTicketId && flowStep === 'called') {
      ContextLoggingService.logStateChange('Restaurando estado del operador', {
        currentTicketId,
        cliente: operatorState.ticketStatus?.currentClient,
        flowStep,
        pendingAction,
        nota: 'El backend validará si este ticket sigue siendo válido',
      });
    }
  }, [
    isLoaded,
    currentTicketId,
    flowStep,
    pendingAction,
    operatorState.ticketStatus?.currentClient,
  ]);

  // Efecto para logging de historial - OPTIMIZADO para reducir re-renders
  useEffect(() => {
    // Solo loggear en desarrollo y cuando hay cambios significativos
    if (process.env.NODE_ENV === 'development') {
      ContextLoggingService.logStateChange('Estado del operador', {
        ticketActual: currentTicketId,
        flowStep,
        pendingAction,
        ultimoProcesado: lastProcessedTicketId,
        totalEnHistorial: sessionTicketHistory.length,
        isLoading,
        error,
        countUsersInQueue, // ✅ AGREGAR AL LOG
      });
    }
  }, [
    currentTicketId,
    flowStep,
    pendingAction,
    lastProcessedTicketId,
    sessionTicketHistory.length,
    isLoading,
    error,
    countUsersInQueue, // ✅ AGREGAR A LAS DEPENDENCIAS
  ]);

  // Extensiones del contexto - OPTIMIZADO para reducir re-renders
  const contextExtensions: OperatorContextExtensions = useMemo(
    () => ({
      // Estados adicionales
      statusMarked,
      error,
      isLoading,
      countUsersInQueue, // ✅ AGREGAR AL CONTEXTO

      // Acciones principales separadas
      handleCallNext,
      handleCompleteClient,
      handleMarkAbsent,
      startAttendingTicket,

      // Acciones legacy (para backward compatibility)
      handleNext,
      handleAbsent,
      handleCompleted,

      // Funciones de utilidad
      isNextButtonEnabled,
      getNextButtonText,
    }),
    [
      statusMarked,
      error,
      isLoading,
      countUsersInQueue, // ✅ AGREGAR A LAS DEPENDENCIAS
      // Las funciones ya están memoizadas en useOperatorActions
      handleCallNext,
      handleCompleteClient,
      handleMarkAbsent,
      handleNext,
      handleAbsent,
      handleCompleted,
      isNextButtonEnabled,
      getNextButtonText,
      startAttendingTicket,
    ],
  );

  // Valor final del contexto - OPTIMIZADO para reducir re-renders
  const contextValue: OperatorContextType = useMemo(
    () => ({
      ...operatorState, // Todo lo de useOperatorState
      ...contextExtensions, // Solo las extensiones específicas
    }),
    [
      // Solo las propiedades específicas que realmente cambian
      operatorState.currentTicketId,
      operatorState.flowStep,
      operatorState.pendingAction,
      operatorState.isLoaded,
      operatorState.ticketStatus,
      operatorState.lastProcessedTicketId,
      operatorState.sessionTicketHistory,
      // Extensiones
      contextExtensions,
    ],
  );

  return <OperatorContext.Provider value={contextValue}>{children}</OperatorContext.Provider>;
};

// Componente Render Props para flexibilidad adicional
export const OperatorConsumer: React.FC<{
  children: (contextValue: OperatorContextType) => ReactNode;
}> = ({ children }) => {
  const contextValue = useOperatorContext();
  return <>{children(contextValue)}</>;
};

export default OperatorProvider;
