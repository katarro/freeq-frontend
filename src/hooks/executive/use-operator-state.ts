import { useState, useEffect, useCallback } from 'react';
import { OperatorTicketStatus } from '@/types/ticket';

export interface OperatorState {
  currentTicketId: string | null;
  flowStep: 'waiting' | 'called' | 'completed';
  ticketStatus: OperatorTicketStatus | null;
  pendingAction: 'absent' | 'completed' | null;
  lastUpdated: string;
  // ✅ CAMPOS DE HISTORIAL SIMPLIFICADOS
  lastProcessedTicketId: string | null;
  sessionTicketHistory: string[]; // Solo para logging/debugging
}

const STORAGE_KEY = 'operator_state';
const STATE_EXPIRY_HOURS = 8; // 8 horas de validez

// ✅ ESTADO INICIAL LIMPIO
const createEmptyState = (): OperatorState => ({
  currentTicketId: null,
  flowStep: 'waiting',
  ticketStatus: null,
  pendingAction: null,
  lastUpdated: new Date().toISOString(),
  lastProcessedTicketId: null,
  sessionTicketHistory: [],
});

export function useOperatorState() {
  const [state, setState] = useState<OperatorState>(createEmptyState);
  const [isLoaded, setIsLoaded] = useState(false);

  // ✅ FUNCIÓN: Verificar si el estado guardado es válido
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
      flowStep: savedState.flowStep,
    });

    return hoursDiff < STATE_EXPIRY_HOURS;
  }, []);

  // ✅ FUNCIÓN: Cargar estado desde localStorage
  const loadState = useCallback(() => {
    try {
      const savedStateStr = localStorage.getItem(STORAGE_KEY);

      if (!savedStateStr) {
        console.log('📭 No hay estado guardado, usando estado vacío');
        setIsLoaded(true);
        return;
      }

      const savedState: OperatorState = JSON.parse(savedStateStr);

      // ✅ MIGRAR ESTADO ANTIGUO SI NO TIENE NUEVOS CAMPOS
      if (!savedState.sessionTicketHistory) {
        savedState.sessionTicketHistory = [];
      }
      if (!savedState.lastProcessedTicketId) {
        savedState.lastProcessedTicketId = null;
      }

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
        lastProcessedTicketId: savedState.lastProcessedTicketId,
      });

      setState(savedState);
      setIsLoaded(true);

      // ✅ LOG PARA TICKETS ACTIVOS
      if (savedState.currentTicketId && savedState.flowStep === 'called') {
        console.log(
          `🔔 Ticket activo restaurado: ${savedState.currentTicketId}`,
        );
        console.log(
          '⚠️ NOTA: El backend es la fuente de verdad para el estado del ticket',
        );
      }
    } catch (error) {
      console.error('❌ Error cargando estado del operador:', error);
      localStorage.removeItem(STORAGE_KEY);
      setIsLoaded(true);
    }
  }, [isStateValid]);

  // ✅ FUNCIÓN: Guardar estado en localStorage
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
        timestamp: stateToSave.lastUpdated,
      });
    } catch (error) {
      console.error('❌ Error guardando estado del operador:', error);
    }
  }, []);

  // ✅ FUNCIÓN: Actualizar estado completo
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

  // ✅ FUNCIÓN: Marcar ticket como procesado (solo para logging/debugging)
  const markTicketAsProcessed = useCallback(
    (ticketId: string) => {
      setState((prevState) => {
        const updatedHistory = [...(prevState.sessionTicketHistory || [])];

        // Agregar al historial si no está ya
        if (!updatedHistory.includes(ticketId)) {
          updatedHistory.push(ticketId);

          // Mantener solo los últimos 20 tickets para evitar overflow
          if (updatedHistory.length > 20) {
            updatedHistory.splice(0, updatedHistory.length - 20);
          }
        }

        const newState = {
          ...prevState,
          lastProcessedTicketId: ticketId,
          sessionTicketHistory: updatedHistory,
        };

        console.log('📝 Ticket registrado en historial local:', {
          ticketId,
          totalEnHistorial: updatedHistory.length,
          nota: 'Solo para logging - el backend es la fuente de verdad',
        });

        saveState(newState);
        return newState;
      });
    },
    [saveState],
  );

  // ✅ FUNCIÓN: Verificar si un ticket está en el historial LOCAL (solo informativo)
  const wasTicketProcessedLocally = useCallback(
    (ticketId: string): boolean => {
      const wasProcessed =
        state.sessionTicketHistory?.includes(ticketId) || false;

      if (wasProcessed) {
        console.log('ℹ️ Ticket encontrado en historial local:', {
          ticketId,
          nota: 'Esto es solo informativo - el backend es la fuente de verdad',
        });
      }

      return wasProcessed;
    },
    [state.sessionTicketHistory],
  );

  // ✅ FUNCIÓN: Actualizar solo currentTicketId
  const setCurrentTicketId = useCallback(
    (ticketId: string | null) => {
      console.log('🎫 Actualizando currentTicketId:', {
        nuevo: ticketId,
        anterior: state.currentTicketId,
        enHistorialLocal: ticketId
          ? wasTicketProcessedLocally(ticketId)
          : false,
      });

      updateState({ currentTicketId: ticketId });
    },
    [updateState, state.currentTicketId, wasTicketProcessedLocally],
  );

  // ✅ FUNCIÓN: Actualizar solo flowStep
  const setFlowStep = useCallback(
    (step: 'waiting' | 'called' | 'completed') => {
      console.log('📋 Actualizando flowStep:', {
        nuevo: step,
        anterior: state.flowStep,
        currentTicketId: state.currentTicketId,
      });
      updateState({ flowStep: step });
    },
    [updateState, state.flowStep, state.currentTicketId],
  );

  // ✅ FUNCIÓN: Actualizar solo ticketStatus
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

  // ✅ FUNCIÓN: Actualizar solo pendingAction
  const setPendingAction = useCallback(
    (action: 'absent' | 'completed' | null) => {
      console.log('⚡ Actualizando pendingAction:', action);
      updateState({ pendingAction: action });
    },
    [updateState],
  );

  // ✅ FUNCIÓN: Reset completo del estado
  const resetState = useCallback(() => {
    console.log('🔄 Reset completo del estado del operador');
    localStorage.removeItem(STORAGE_KEY);
    setState(createEmptyState());
  }, []);

  // ✅ FUNCIÓN: Limpiar solo el ticket actual
  const clearCurrentTicket = useCallback(() => {
    console.log('🧹 Limpiando ticket actual:', {
      ticketActual: state.currentTicketId,
      flowStep: state.flowStep,
      pendingAction: state.pendingAction,
    });

    // ✅ SOLO agregar al historial si había un ticket Y se completó realmente
    if (state.currentTicketId && state.flowStep === 'completed') {
      console.log(
        '✅ Ticket completado, agregando al historial:',
        state.currentTicketId,
      );
      markTicketAsProcessed(state.currentTicketId);
    }

    updateState({
      currentTicketId: null,
      flowStep: 'waiting',
      pendingAction: null,
    });

    // ✅ Actualizar ticketStatus si existe
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
  }, [
    updateState,
    state.currentTicketId,
    state.flowStep,
    state.ticketStatus,
    markTicketAsProcessed,
  ]);

  // ✅ FUNCIÓN: Limpiar historial de sesión (para mantenimiento)
  const clearSessionHistory = useCallback(() => {
    console.log('🗑️ Limpiando historial de sesión');
    updateState({
      sessionTicketHistory: [],
      lastProcessedTicketId: null,
    });
  }, [updateState]);

  // ✅ CARGAR ESTADO AL MONTAR EL COMPONENTE
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

    // ✅ CAMPOS DE HISTORIAL (solo para información/debugging)
    lastProcessedTicketId: state.lastProcessedTicketId,
    sessionTicketHistory: state.sessionTicketHistory || [],

    // Funciones de actualización
    setCurrentTicketId,
    setFlowStep,
    setTicketStatus,
    setPendingAction,
    updateState,

    // ✅ FUNCIONES DE HISTORIAL (principalmente para logging)
    markTicketAsProcessed,
    wasTicketProcessed: wasTicketProcessedLocally, // Renombrado para claridad
    clearSessionHistory,

    // Funciones de utilidad
    resetState,
    clearCurrentTicket,

    // Estado completo para casos especiales
    fullState: state,
  };
}
