// hooks/use-operator-state.ts
import { useState, useEffect, useCallback } from 'react';
import { OperatorTicketStatus } from '@/types/ticket';

export interface OperatorState {
  currentTicketId: string | null;
  flowStep: 'waiting' | 'called' | 'completed';
  ticketStatus: OperatorTicketStatus;
  pendingAction: 'absent' | 'completed' | null;
  lastUpdated: string;
}

const STORAGE_KEY = 'operator_state';
const STATE_EXPIRY_HOURS = 8; // 8 horas de validez

const defaultOperatorState: OperatorState = {
  currentTicketId: null,
  flowStep: 'waiting',
  ticketStatus: {
    operatorId: 'OP-001',
    status: 'WAITING',
    currentClient: null,
    queueCount: 9,
    canTakeNext: true,
    lastAction: 'none',
  },
  pendingAction: null,
  lastUpdated: new Date().toISOString(),
};

export function useOperatorState() {
  const [state, setState] = useState<OperatorState>(defaultOperatorState);
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
        console.log('📭 No hay estado guardado, usando estado por defecto');
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

      console.log('✅ Restaurando estado del operador:', savedState);
      setState(savedState);
      setIsLoaded(true);

      // 🔧 OPCIONAL: Mostrar notificación al operador
      if (savedState.currentTicketId && savedState.flowStep === 'called') {
        console.log(
          `🔔 Estado restaurado: Atendiendo ${savedState.ticketStatus.currentClient}`,
        );
        // Aquí podrías mostrar una notificación toast
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
        status: stateToSave.ticketStatus.status,
        currentClient: stateToSave.ticketStatus.currentClient,
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
      updateState({ currentTicketId: ticketId });
    },
    [updateState],
  );

  // 🔧 FUNCIÓN: Actualizar solo flowStep
  const setFlowStep = useCallback(
    (step: 'waiting' | 'called' | 'completed') => {
      updateState({ flowStep: step });
    },
    [updateState],
  );

  // 🔧 FUNCIÓN: Actualizar solo ticketStatus
  const setTicketStatus = useCallback(
    (
      status:
        | OperatorTicketStatus
        | ((prev: OperatorTicketStatus) => OperatorTicketStatus),
    ) => {
      if (typeof status === 'function') {
        setState((prevState) => {
          const newTicketStatus = status(prevState.ticketStatus);
          const newState = { ...prevState, ticketStatus: newTicketStatus };
          saveState(newState);
          return newState;
        });
      } else {
        updateState({ ticketStatus: status });
      }
    },
    [updateState, saveState],
  );

  // 🔧 FUNCIÓN: Actualizar solo pendingAction
  const setPendingAction = useCallback(
    (action: 'absent' | 'completed' | null) => {
      updateState({ pendingAction: action });
    },
    [updateState],
  );

  // 🔧 FUNCIÓN: Reset completo del estado
  const resetState = useCallback(() => {
    console.log('🔄 Reset completo del estado del operador');
    localStorage.removeItem(STORAGE_KEY);
    setState(defaultOperatorState);
  }, []);

  // 🔧 FUNCIÓN: Limpiar solo el ticket actual (mantener configuración)
  const clearCurrentTicket = useCallback(() => {
    console.log('🧹 Limpiando ticket actual');
    updateState({
      currentTicketId: null,
      flowStep: 'waiting',
      pendingAction: null,
      ticketStatus: {
        ...state.ticketStatus,
        status: 'WAITING',
        currentClient: null,
        canTakeNext: true,
        lastAction: 'none',
      },
    });
  }, [updateState, state.ticketStatus]);

  // 🔧 CARGAR ESTADO AL MONTAR EL COMPONENTE
  useEffect(() => {
    loadState();
  }, [loadState]);

  // 🔧 AUTO-GUARDAR cuando cambia el estado (solo si está cargado)
  useEffect(() => {
    if (isLoaded) {
      console.log('🔄 Estado del operador cambió, auto-guardando...');
    }
  }, [state, isLoaded]);

  return {
    // Estado
    currentTicketId: state.currentTicketId,
    flowStep: state.flowStep,
    ticketStatus: state.ticketStatus,
    pendingAction: state.pendingAction,
    isLoaded,

    // Actualizadores
    setCurrentTicketId,
    setFlowStep,
    setTicketStatus,
    setPendingAction,
    updateState,

    // Utilidades
    resetState,
    clearCurrentTicket,

    // Estado completo (para casos especiales)
    fullState: state,
  };
}
