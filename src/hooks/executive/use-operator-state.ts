import { useState, useEffect, useCallback } from 'react';
import { OperatorTicketStatus } from '@/types/ticket';

export interface OperatorState {
  currentTicketId: string | null;
  flowStep: 'waiting' | 'called' | 'completed';
  ticketStatus: OperatorTicketStatus | null;
  pendingAction: 'absent' | 'completed' | null;
  lastUpdated: string;
}

const STORAGE_KEY = 'operator_state';
const STATE_EXPIRY_HOURS = 8; // 8 horas de validez

// 🔧 ESTADO MÍNIMO SIN DATOS HARDCODEADOS
const createEmptyState = (): OperatorState => ({
  currentTicketId: null,
  flowStep: 'waiting',
  ticketStatus: null, // Se establecerá desde el OperatorProvider
  pendingAction: null,
  lastUpdated: new Date().toISOString(),
});

export function useOperatorState() {
  const [state, setState] = useState<OperatorState>(createEmptyState);
  const [isLoaded, setIsLoaded] = useState(false);

  // 🔧 FUNCIÓN: Verificar si el estado guardado es válido
  const isStateValid = useCallback((savedState: OperatorState): boolean => {
    const now = new Date();
    const lastUpdated = new Date(savedState.lastUpdated);
    const hoursDiff =
      (now.getTime() - lastUpdated.getTime()) / (1000 * 60 * 60);

    console.log('🔍 Validando estado guardado:', {
      lastUpdated: savedState.lastUpdated,
      hoursDiff: hoursDiff.toFixed(2),
      isValid: hoursDiff < STATE_EXPIRY_HOURS,
      hasCurrentTicket: !!savedState.currentTicketId,
    });

    return hoursDiff < STATE_EXPIRY_HOURS;
  }, []);

  // 🔧 FUNCIÓN: Cargar estado desde localStorage
  const loadState = useCallback(() => {
    try {
      const savedStateStr = localStorage.getItem(STORAGE_KEY);

      if (!savedStateStr) {
        console.log('📭 No hay estado guardado, usando estado vacío');
        setIsLoaded(true);
        return;
      }

      const savedState: OperatorState = JSON.parse(savedStateStr);

      if (!isStateValid(savedState)) {
        console.log('⏰ Estado guardado expirado, limpiando...');
        localStorage.removeItem(STORAGE_KEY);
        setIsLoaded(true);
        return;
      }

      console.log('✅ Restaurando estado del operador:', {
        currentTicketId: savedState.currentTicketId,
        flowStep: savedState.flowStep,
        pendingAction: savedState.pendingAction,
      });

      setState(savedState);
      setIsLoaded(true);

      // 🔧 Log para restauración de ticket activo
      if (savedState.currentTicketId && savedState.flowStep === 'called') {
        console.log(
          `🔔 Ticket activo restaurado: ${savedState.currentTicketId}`,
        );
      }
    } catch (error) {
      console.error('❌ Error cargando estado del operador:', error);
      localStorage.removeItem(STORAGE_KEY);
      setIsLoaded(true);
    }
  }, [isStateValid]);

  // 🔧 FUNCIÓN: Guardar estado en localStorage
  const saveState = useCallback((newState: OperatorState) => {
    try {
      const stateToSave = {
        ...newState,
        lastUpdated: new Date().toISOString(),
      };

      localStorage.setItem(STORAGE_KEY, JSON.stringify(stateToSave));

      console.log('💾 Estado del operador guardado:', {
        currentTicketId: stateToSave.currentTicketId,
        flowStep: stateToSave.flowStep,
        pendingAction: stateToSave.pendingAction,
      });
    } catch (error) {
      console.error('❌ Error guardando estado del operador:', error);
    }
  }, []);

  // 🔧 FUNCIÓN: Actualizar estado completo
  const updateState = useCallback(
    (updates: Partial<OperatorState>) => {
      setState((prevState) => {
        const newState = { ...prevState, ...updates };
        saveState(newState);
        return newState;
      });
    },
    [saveState],
  );

  // 🔧 FUNCIÓN: Actualizar solo currentTicketId
  const setCurrentTicketId = useCallback(
    (ticketId: string | null) => {
      console.log('🎫 Actualizando currentTicketId:', ticketId);
      updateState({ currentTicketId: ticketId });
    },
    [updateState],
  );

  // 🔧 FUNCIÓN: Actualizar solo flowStep
  const setFlowStep = useCallback(
    (step: 'waiting' | 'called' | 'completed') => {
      console.log('📋 Actualizando flowStep:', step);
      updateState({ flowStep: step });
    },
    [updateState],
  );

  // 🔧 FUNCIÓN: Actualizar solo ticketStatus
  const setTicketStatus = useCallback(
    (
      status:
        | OperatorTicketStatus
        | ((prev: OperatorTicketStatus | null) => OperatorTicketStatus)
        | null,
    ) => {
      if (typeof status === 'function') {
        setState((prevState) => {
          const newTicketStatus = status(prevState.ticketStatus);
          const newState = { ...prevState, ticketStatus: newTicketStatus };
          saveState(newState);
          return newState;
        });
      } else {
        console.log('🔧 Actualizando ticketStatus:', status?.status);
        updateState({ ticketStatus: status });
      }
    },
    [updateState, saveState],
  );

  // 🔧 FUNCIÓN: Actualizar solo pendingAction
  const setPendingAction = useCallback(
    (action: 'absent' | 'completed' | null) => {
      console.log('⚡ Actualizando pendingAction:', action);
      updateState({ pendingAction: action });
    },
    [updateState],
  );

  // 🔧 FUNCIÓN: Reset completo del estado
  const resetState = useCallback(() => {
    console.log('🔄 Reset completo del estado del operador');
    localStorage.removeItem(STORAGE_KEY);
    setState(createEmptyState());
  }, []);

  // 🔧 FUNCIÓN: Limpiar solo el ticket actual (mantener configuración)
  const clearCurrentTicket = useCallback(() => {
    console.log('🧹 Limpiando ticket actual');
    updateState({
      currentTicketId: null,
      flowStep: 'waiting',
      pendingAction: null,
    });

    // Si hay ticketStatus, actualizar solo los campos relacionados al ticket
    if (state.ticketStatus) {
      updateState({
        ticketStatus: {
          ...state.ticketStatus,
          status: 'WAITING',
          currentClient: null,
          canTakeNext: true,
          lastAction: 'none',
        },
      });
    }
  }, [updateState, state.ticketStatus]);

  // 🔧 CARGAR ESTADO AL MONTAR EL COMPONENTE
  useEffect(() => {
    loadState();
  }, [loadState]);

  return {
    // Estado básico
    currentTicketId: state.currentTicketId,
    flowStep: state.flowStep,
    ticketStatus: state.ticketStatus,
    pendingAction: state.pendingAction,
    isLoaded,

    // Funciones de actualización
    setCurrentTicketId,
    setFlowStep,
    setTicketStatus,
    setPendingAction,
    updateState,

    // Funciones de utilidad
    resetState,
    clearCurrentTicket,

    // Estado completo para casos especiales
    fullState: state,
  };
}
