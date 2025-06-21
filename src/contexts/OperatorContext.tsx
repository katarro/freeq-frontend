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

// Render props type
interface OperatorRenderProps {
  children: (contextValue: OperatorContextType) => ReactNode;
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
  // 🎯 OBTENER ToODO EL ESTADO DEL OPERADOR
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

  const { callNextTicket, processTicketAction, isLoading } = useNextTicket({
    onTicketCompleted: handleTicketCompleted,
    onNextTicketCalled: handleNextTicketCalled,
    onError: handleError,
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
  });

  // 🎯 EFECTO PARA RESTAURAR ESTADO
  useEffect(() => {
    if (isLoaded && currentTicketId && flowStep === 'called') {
      console.log('🔄 Restaurando estado del operador:', {
        currentTicketId,
        cliente: operatorState.ticketStatus?.currentClient,
      });
    }
  }, [
    isLoaded,
    currentTicketId,
    flowStep,
    operatorState.ticketStatus?.currentClient,
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
export const OperatorConsumer: React.FC<OperatorRenderProps> = ({
  children,
}) => {
  const contextValue = useOperatorContext();
  return <>{children(contextValue)}</>;
};

export default OperatorProvider;
