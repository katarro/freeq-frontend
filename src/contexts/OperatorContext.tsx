'use client';

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
  useMemo,
} from 'react';
import {
  useNextTicket,
  useStatusCard,
  useOperatorState,
  useOperatorActions,
  useOperatorErrorHandler,
  useOperatorTicketHandler,
} from '@/hooks/executive';

// 🔧 TIPO BASE: Extender el retorno de useOperatorState
type OperatorStateReturn = ReturnType<typeof useOperatorState>;

// 🔧 TIPO EXTENDIDO: Solo agregar lo que no está en useOperatorState
interface OperatorContextExtensions {
  // Estados adicionales específicos del contexto
  statusMarked: boolean;
  error: string | null;
  isLoading: boolean;

  // Acciones específicas del operador
  handleNext: () => Promise<void>;
  handleAbsent: () => void;
  handleCompleted: () => void;

  // Funciones de utilidad
  isNextButtonEnabled: () => boolean;
  getNextButtonText: () => string;
}

// 🔧 TIPO FINAL: Combinación de ambos
type OperatorContextType = OperatorStateReturn & OperatorContextExtensions;

// Props del provider
interface OperatorProviderProps {
  children: ReactNode;
}

// Crear el contexto
const OperatorContext = createContext<OperatorContextType | undefined>(
  undefined,
);

// Hook personalizado para usar el contexto
export const useOperatorContext = (): OperatorContextType => {
  const context = useContext(OperatorContext);
  if (!context) {
    throw new Error(
      'useOperatorContext debe usarse dentro de OperatorProvider',
    );
  }
  return context;
};

// Provider del contexto refactorizado
const OperatorProvider: React.FC<OperatorProviderProps> = ({ children }) => {
  // 🎯 OBTENER TODO EL ESTADO DEL OPERADOR
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
    // ✅ FUNCIONES DE HISTORIAL (solo para logging)
    markTicketAsProcessed,
    wasTicketProcessed,
    sessionTicketHistory,
    lastProcessedTicketId,
  } = operatorState;

  // 🎯 ESTADOS ADICIONALES (solo los que no están en useOperatorState)
  const { fetchData } = useStatusCard();
  const [statusMarked, setStatusMarked] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 🎯 CUSTOM HOOKS PARA LÓGICA ESPECÍFICA
  const { handleError } = useOperatorErrorHandler({
    setTicketStatus,
    setCurrentTicketId,
    setPendingAction,
    setFlowStep,
    clearCurrentTicket,
  });

  const { handleTicketCompleted, handleNextTicketCalled } =
    useOperatorTicketHandler({
      setCurrentTicketId,
      setFlowStep,
      setTicketStatus,
      setPendingAction,
      clearCurrentTicket,
      setError,
    });

  // ✅ ENHANCED ERROR HANDLER simplificado
  const enhancedHandleError = (errorMessage: string) => {
    // console.log('🔍 Manejando error en contexto:', errorMessage);

    // ✅ CASO ESPECIAL: Errores de API que NO requieren limpiar estado
    if (
      errorMessage.includes('ya fue procesado') ||
      errorMessage.includes('Ticket duplicado') ||
      errorMessage.includes('Ticket no encontrado')
    ) {
      // console.log('ℹ️ Error de estado de ticket detectado:', errorMessage);

      // NO limpiar estado automáticamente - dejar que el usuario maneje
      // El backend es la fuente de verdad
      setError(errorMessage);
      return;
    }

    // Para otros errores, usar el manejador normal
    handleError(errorMessage);
  };

  // ✅ CONFIGURACIÓN SIMPLIFICADA DE useNextTicket
  const { callNextTicket, processTicketAction, isLoading } = useNextTicket({
    onTicketCompleted: handleTicketCompleted,
    onNextTicketCalled: handleNextTicketCalled,
    onError: enhancedHandleError,
    // ✅ PASAR FUNCIONES DE HISTORIAL (solo para logging/debugging)
    wasTicketProcessed,
    markTicketAsProcessed,
  });

  const {
    handleNext,
    handleAbsent,
    handleCompleted,
    isNextButtonEnabled,
    getNextButtonText,
  } = useOperatorActions({
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
    ticketStatus: operatorState.ticketStatus,
  });

  // 🎯 EFECTO PARA RESTAURAR ESTADO (simplificado)
  useEffect(() => {
    if (isLoaded && currentTicketId && flowStep === 'called') {
      // console.log('🔄 Restaurando estado del operador:', {
      //   currentTicketId,
      //   cliente: operatorState.ticketStatus?.currentClient,
      //   flowStep,
      //   pendingAction,
      //   nota: 'El backend validará si este ticket sigue siendo válido',
      // });
      // ✅ NO limpiar automáticamente - confiar en el backend
      // Si el ticket ya no es válido, el backend lo manejará cuando se haga la siguiente llamada
    }
  }, [
    isLoaded,
    currentTicketId,
    flowStep,
    pendingAction,
    operatorState.ticketStatus?.currentClient,
  ]);

  // ✅ EFECTO PARA LOGGING DE HISTORIAL (solo en desarrollo)
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      // console.log('📊 Estado del operador:', {
      //   ticketActual: currentTicketId,
      //   flowStep,
      //   pendingAction,
      //   ultimoProcesado: lastProcessedTicketId,
      //   totalEnHistorial: sessionTicketHistory.length,
      //   isLoading,
      //   error,
      // });
    }
  }, [
    currentTicketId,
    flowStep,
    pendingAction,
    lastProcessedTicketId,
    sessionTicketHistory.length,
    isLoading,
    error,
  ]);

  // 🎯 EXTENSIONES DEL CONTEXTO (solo lo que no está en useOperatorState)
  const contextExtensions: OperatorContextExtensions = useMemo(
    () => ({
      // Estados adicionales
      statusMarked,
      error,
      isLoading,

      // Acciones
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
      handleNext,
      handleAbsent,
      handleCompleted,
      isNextButtonEnabled,
      getNextButtonText,
    ],
  );

  // 🎯 VALOR FINAL DEL CONTEXTO (spreading ambos objetos)
  const contextValue: OperatorContextType = useMemo(
    () => ({
      ...operatorState, // Todo lo de useOperatorState
      ...contextExtensions, // Solo las extensiones específicas
    }),
    [operatorState, contextExtensions],
  );

  return (
    <OperatorContext.Provider value={contextValue}>
      {children}
    </OperatorContext.Provider>
  );
};

// Componente Render Props para flexibilidad adicional
export const OperatorConsumer: React.FC<{
  children: (contextValue: OperatorContextType) => ReactNode;
}> = ({ children }) => {
  const contextValue = useOperatorContext();
  return <>{children(contextValue)}</>;
};

export default OperatorProvider;
