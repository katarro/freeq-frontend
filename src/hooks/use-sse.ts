// hooks/use-sse.ts - VERSION CON TOKEN DESDE LOCALSTORAGE
import { useRef, useState, useCallback, useEffect } from 'react';
import { ENV } from '@/lib/env';
import { Ticket } from '@/types/ticket';
import { SecureStorage } from '@/lib/secure-storage';

export interface SSEEvent {
  type: string;
  currentTicketNumber?: number;
  ticketNumber?: number;
  estimatedWaitTime?: number;
  moduleCode?: string;
  message?: string;
  error?: string;
  data?: any;
}

interface UseSSEReturn {
  isConnected: boolean;
  lastEvent: SSEEvent | null;
  connect: (queueId: string, ticketId: string, ticketData?: Ticket) => void;
  disconnect: () => void;
  connectionError: string | null;
}

// ✅ GLOBAL: EventSource persistente fuera de React
let globalEventSource: EventSource | null = null;
const globalConnectionState = {
  isConnected: false,
  shouldPersist: false,
  activeTicketId: null as string | null,
  lastConnection: null as {
    queueId: string;
    ticketId: string;
    ticketData?: any;
  } | null,
};

// ✅ GLOBAL: Datos de eventos SSE
const globalSSEData = {
  lastEvent: null as SSEEvent | null,
  currentTicketNumber: 0 as number | null,
};

console.log('🚀 useSSE Hook cargado - Estado inicial:', {
  globalConnectionState,
  globalSSEData,
});

// ✅ SISTEMA DE EVENTOS: Para notificaciones reactivas
const globalStateListeners = new Set<() => void>();

const notifyGlobalStateChange = () => {
  console.log('📢 Notificando cambios a', globalStateListeners.size, 'listeners');
  globalStateListeners.forEach((listener) => listener());
};

// ✅ FUNCIÓN HELPER: Para actualizar estado global y notificar
const updateGlobalConnectionState = (newState: Partial<typeof globalConnectionState>) => {
  const prevState = { ...globalConnectionState };
  Object.assign(globalConnectionState, newState);

  console.log('🔄 Actualizando estado de conexión:', {
    anterior: prevState,
    nuevo: globalConnectionState,
    cambios: Object.keys(newState),
  });

  // Solo notificar si realmente cambió algo importante
  if (
    prevState.isConnected !== globalConnectionState.isConnected ||
    prevState.activeTicketId !== globalConnectionState.activeTicketId ||
    prevState.shouldPersist !== globalConnectionState.shouldPersist
  ) {
    console.log('✅ Estado global SSE actualizado - Notificando listeners');
    notifyGlobalStateChange();
  } else {
    console.log('⏸️ Sin cambios significativos - No se notifica');
  }
};

// ✅ FUNCIÓN HELPER: Para actualizar datos SSE y notificar
const updateGlobalSSEData = (newData: Partial<typeof globalSSEData>) => {
  const prevData = { ...globalSSEData };
  Object.assign(globalSSEData, newData);

  console.log('📊 Actualizando datos SSE:', {
    anterior: prevData,
    nuevo: globalSSEData,
    cambios: Object.keys(newData),
  });

  // Notificar si cambió algo importante
  if (
    prevData.lastEvent !== globalSSEData.lastEvent ||
    prevData.currentTicketNumber !== globalSSEData.currentTicketNumber
  ) {
    console.log('✅ Datos SSE actualizados - Notificando listeners');
    notifyGlobalStateChange();
  } else {
    console.log('⏸️ Sin cambios en datos SSE - No se notifica');
  }
};

// 🔧 NUEVA FUNCIÓN: Para obtener token desde localStorage
const getAuthToken = (): string | null => {
  try {
    const { token } = SecureStorage.getAuthData();
    if (token) {
      console.log('🔑 Token encontrado en localStorage');
      return token;
    }

    console.warn('⚠️ No se encontró token en localStorage');
    return null;
  } catch (error) {
    console.error('❌ Error obteniendo token:', error);
    return null;
  }
};

// ✅ HOOK REACTIVO: Para acceder al estado global desde componentes
export function useSSEGlobalState() {
  const [state, setState] = useState(() => ({ ...globalConnectionState }));
  const [sseData, setSSEData] = useState(() => ({ ...globalSSEData }));

  console.log('🔗 useSSEGlobalState hook iniciado:', {
    estadoInicial: state,
    datosSSEIniciales: sseData,
  });

  useEffect(() => {
    console.log('👂 useSSEGlobalState: Registrando listener');

    // Listener para actualizaciones del estado global
    const listener = () => {
      console.log('📡 useSSEGlobalState: Cambio detectado, actualizando estado local');
      setState({ ...globalConnectionState });
      setSSEData({ ...globalSSEData });
    };

    globalStateListeners.add(listener);
    console.log('📊 Total listeners registrados:', globalStateListeners.size);

    // Cleanup al desmontarse
    return () => {
      console.log('🧹 useSSEGlobalState: Limpiando listener');
      globalStateListeners.delete(listener);
      console.log('📊 Total listeners después de cleanup:', globalStateListeners.size);
    };
  }, []);

  // Log cada vez que el estado cambia
  useEffect(() => {
    console.log('🔄 useSSEGlobalState: Estado actualizado:', {
      isConnected: state.isConnected,
      activeTicketId: state.activeTicketId,
      currentTicketNumber: sseData.currentTicketNumber ?? 0,
      lastEvent: sseData.lastEvent?.type,
    });
  }, [state, sseData]);

  return {
    isConnected: state.isConnected,
    shouldPersist: state.shouldPersist,
    activeTicketId: state.activeTicketId,
    lastEvent: sseData.lastEvent,
    currentTicketNumber: sseData.currentTicketNumber ?? 0,
  };
}

// ✅ HOOK PRINCIPAL: Para manejar conexiones SSE
export function useSSE(): UseSSEReturn {
  const [isConnected, setIsConnected] = useState(false);
  const [lastEvent, setLastEvent] = useState<SSEEvent | null>(null);
  const [connectionError, setConnectionError] = useState<string | null>(null);

  console.log('🔌 useSSE hook iniciado');

  // ✅ Sincronizar estado local con estado global
  useEffect(() => {
    console.log('🔄 useSSE: Sincronizando con estado global');
    setIsConnected(globalConnectionState.isConnected);

    // Listener para mantener sincronizado el estado local
    const listener = () => {
      console.log('📡 useSSE: Sincronizando estado local con global');
      setIsConnected(globalConnectionState.isConnected);
    };

    globalStateListeners.add(listener);

    return () => {
      console.log('🧹 useSSE: Removiendo listener de sincronización');
      globalStateListeners.delete(listener);
    };
  }, []);

  const disconnect = useCallback(() => {
    console.log('🔌 Solicitud de desconexión SSE...', {
      hasGlobalConnection: !!globalEventSource,
      shouldPersist: globalConnectionState.shouldPersist,
      activeTicketId: globalConnectionState.activeTicketId,
    });

    // ✅ VERIFICAR: Solo desconectar si NO debe persistir
    if (!globalConnectionState.shouldPersist) {
      console.log('🔌 Desconectando SSE (no debe persistir)');

      if (globalEventSource) {
        console.log('🔌 Cerrando EventSource');
        globalEventSource.close();
        globalEventSource = null;
      }

      updateGlobalConnectionState({
        isConnected: false,
        shouldPersist: false,
        activeTicketId: null,
      });

      // ✅ LIMPIAR DATOS SSE
      updateGlobalSSEData({
        lastEvent: null,
        currentTicketNumber: 0,
      });

      setIsConnected(false);
      setConnectionError(null);
      console.log('✅ Desconexión SSE completada');
    } else {
      console.log('✅ SSE mantenido activo (debe persistir)');
    }
  }, []);

  const connect = useCallback((queueId: string, ticketId: string, ticketData?: Ticket) => {
    console.log('🔗 Intentando conectar SSE:', {
      queueId,
      ticketId,
      ticketData: !!ticketData,
      hasExistingConnection: !!globalEventSource,
    });

    if (!queueId || !ticketId) {
      const errorMsg = '❌ Faltan parámetros para SSE';
      console.error(errorMsg, { queueId, ticketId });
      setConnectionError('ID de cola y ticket son requeridos para SSE');
      return;
    }

    const authToken = getAuthToken();
    if (!authToken) {
      console.error('❌ No se encontró token de autenticación');
      setConnectionError('Token de autenticación requerido para SSE');
      return;
    }

    // ✅ GUARDAR DATOS PARA RECONEXIÓN
    globalConnectionState.lastConnection = {
      queueId,
      ticketId,
      ticketData,
    };

    // ✅ VERIFICAR: Si ya hay conexión activa para este ticket
    if (globalEventSource && globalConnectionState.activeTicketId === ticketId) {
      console.log('🔄 Reutilizando conexión SSE existente para ticket:', ticketId);
      setIsConnected(true);
      setConnectionError(null);
      return;
    }

    // ✅ LIMPIAR: Conexión anterior si existe
    if (globalEventSource) {
      console.log('🔄 Cerrando conexión SSE anterior');
      globalEventSource.close();
    }

    try {
      const params = new URLSearchParams();
      params.append('ticketId', ticketId);
      params.append('token', authToken);

      if (ticketData) {
        console.log('📋 Agregando datos del ticket a los parámetros:', ticketData);
        if (ticketData.ticketNumber) {
          params.append('ticketNumber', ticketData.ticketNumber.toString());
        }
        if (ticketData.estimatedWaitTime !== undefined) {
          params.append('estimatedWaitTime', ticketData.estimatedWaitTime.toString());
        }
        if (ticketData.moduleCode) {
          params.append('moduleCode', ticketData.moduleCode);
        }
      }

      const url = `${ENV.API_URL}/eventos-cola/suscribirse/${queueId}?${params.toString()}`;
      console.log('🌐 URL completa SSE:', url);

      globalEventSource = new EventSource(url);

      updateGlobalConnectionState({
        isConnected: false,
        shouldPersist: true,
        activeTicketId: ticketId,
      });

      console.log('🔄 Conectando a SSE con configuración:', {
        url,
        readyState: globalEventSource.readyState,
      });

      globalEventSource.onopen = () => {
        console.log('✅ Conexión SSE establecida exitosamente');
        updateGlobalConnectionState({ isConnected: true });
        setIsConnected(true);
        setConnectionError(null);
        console.log('📡 Solicitando estado inicial de la cola...');
      };

      globalEventSource.onmessage = (event) => {
        try {
          const data: SSEEvent = JSON.parse(event.data);

          console.log('🔍 DEBUG DETALLADO (CORREGIDO):', {
            tipo: data.type,
            currentTicketNumber_del_evento: data.currentTicketNumber,
            currentTicketNumber_global_ANTES: globalSSEData.currentTicketNumber,
            typeof_del_evento: typeof data.currentTicketNumber,
            valor_es_valido:
              data.currentTicketNumber !== undefined && data.currentTicketNumber !== null,
            data_keys: Object.keys(data),
          });

          setLastEvent(data);

          if (data.currentTicketNumber !== undefined && data.currentTicketNumber !== null) {
            console.log('🔄 ANTES de updateGlobalSSEData:', {
              globalAntes: globalSSEData.currentTicketNumber,
              valorNuevo: data.currentTicketNumber,
            });

            updateGlobalSSEData({
              lastEvent: data,
              currentTicketNumber: data.currentTicketNumber,
            });

            console.log('🔄 DESPUÉS de updateGlobalSSEData:', {
              globalDespues: globalSSEData.currentTicketNumber,
              actualizado: globalSSEData.currentTicketNumber === data.currentTicketNumber,
            });
          } else {
            console.log('⚠️ currentTicketNumber no válido, no se actualiza');
          }

          // Manejar diferentes tipos de eventos
          if (data.type === 'TICKET_CALLED_EVENT') {
            console.log(`📣 EVENTO: Ticket llamado: ${data.currentTicketNumber}`);
            if (ticketData && data.currentTicketNumber === ticketData.ticketNumber) {
              console.log(
                `🎉 ¡ES TU TURNO! Dirígete al módulo ${ticketData.moduleCode || 'asignado'}`,
              );
            }
          } else if (data.type === 'CURRENT_STATE' || data.type === 'INITIAL_STATE') {
            console.log(
              `📊 EVENTO: Estado inicial recibido - Ticket actual: ${data.currentTicketNumber}`,
            );
          } else if (data.type === 'QUEUE_STATUS') {
            console.log(`📋 EVENTO: Estado de cola: ${data.message}`);
          } else if (data.type === 'KEEPALIVE') {
            console.debug('💓 EVENTO: Keepalive recibido');
          } else if (data.message) {
            console.log(`📩 EVENTO: Mensaje: ${data.message}`);
          } else if (data.error) {
            console.info(`❌ EVENTO: Error SSE: ${data.error}`);
            setConnectionError(data.error);
          } else {
            console.log('❓ EVENTO: Tipo desconocido:', data.type);
          }
        } catch (parseError) {
          console.warn('⚠️ Error al parsear mensaje SSE:', {
            error: parseError,
            rawData: event.data,
          });
        }
      };

      // ✅ RECONEXIÓN AUTOMÁTICA EN ONERROR
      globalEventSource.onerror = (error) => {
        console.info('❌ Error detallado SSE:', {
          error,
          readyState: globalEventSource?.readyState,
          url: globalEventSource?.url,
          timestamp: new Date().toISOString(),
        });

        updateGlobalConnectionState({ isConnected: false });
        setIsConnected(false);

        // 🔧 DIAGNÓSTICO DE ERROR MEJORADO CON RECONEXIÓN
        if (globalEventSource?.readyState === EventSource.CLOSED) {
          setConnectionError('Conexión cerrada - Reintentando en 3 segundos...');

          // ✅ RECONEXIÓN AUTOMÁTICA
          setTimeout(() => {
            console.log('🔄 Intentando reconectar SSE automáticamente...');

            // ✅ USAR DATOS GUARDADOS PARA RECONECTAR
            const lastConn = globalConnectionState.lastConnection;
            if (lastConn?.queueId && lastConn?.ticketId) {
              console.log('📡 Reconectando con datos:', lastConn);
              connect(lastConn.queueId, lastConn.ticketId, lastConn.ticketData);
            } else {
              console.error('❌ No hay datos de conexión guardados para reconectar');
              setConnectionError('No se puede reconectar - datos de conexión perdidos');
            }
          }, 3000); // Reconectar después de 3 segundos
        } else {
          setConnectionError('Conexión perdida - reintentando...');
        }
      };
    } catch (error) {
      console.error('💥 Error al iniciar SSE:', error);
      setConnectionError('Error al conectar con el servidor');
    }
  }, []);
  // ✅ MÉTODO: Para permitir desconexión manual (ej: cancelar ticket)
  const forceDisconnect = useCallback(() => {
    console.log('🔌 Forzando desconexión SSE');

    if (globalEventSource) {
      console.log('🔌 Cerrando EventSource forzadamente');
      globalEventSource.close();
      globalEventSource = null;
    }

    updateGlobalConnectionState({
      isConnected: false,
      shouldPersist: false,
      activeTicketId: null,
    });

    // ✅ LIMPIAR DATOS SSE
    updateGlobalSSEData({
      lastEvent: null,
      currentTicketNumber: 0,
    });

    setIsConnected(false);
    setConnectionError(null);
    console.log('✅ Desconexión forzada completada');
  }, []);

  // ✅ CLEANUP: Solo si el componente raíz se desmonta
  useEffect(() => {
    return () => {
      console.log('🔍 Cleanup useSSE - Estado global:', globalConnectionState);

      // Solo desconectar si NO hay ticket activo
      if (!globalConnectionState.activeTicketId) {
        console.log('🔌 No hay ticket activo, limpiando SSE en cleanup');
        if (globalEventSource) {
          globalEventSource.close();
          globalEventSource = null;
        }
        updateGlobalConnectionState({
          isConnected: false,
          shouldPersist: false,
          activeTicketId: null,
        });
        updateGlobalSSEData({
          lastEvent: null,
          currentTicketNumber: 0,
        });
      } else {
        console.log('✅ Ticket activo detectado, manteniendo SSE');
      }
    };
  }, []);

  // Log cambios en el estado local
  useEffect(() => {
    console.log('🔄 useSSE estado local actualizado:', {
      isConnected,
      hasLastEvent: !!lastEvent,
      lastEventType: lastEvent?.type,
      connectionError,
    });
  }, [isConnected, lastEvent, connectionError]);

  return {
    isConnected,
    lastEvent,
    connect,
    disconnect: forceDisconnect,
    connectionError,
  };
}
