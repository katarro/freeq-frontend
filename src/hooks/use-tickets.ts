// hooks/use-tickets.ts (VERSION CON SSE PERSISTENTE Y RECONEXIÓN AUTOMÁTICA)
import { useState, useCallback, useEffect, useRef } from 'react';
import apiClient from '@/lib/api-client';
import { ENV } from '@/lib/env';
import { Ticket } from '@/types/ticket';
import { useSSE } from './use-sse';
import { SecureStorage } from '@/lib/secure-storage'; // 🔧 AGREGAR IMPORT

export interface CreateTicketRequest {
  rut: string;
  queueId: string;
}

interface UseTicketsReturn {
  tickets: Ticket[];
  loadingTickets: boolean;
  errorTickets: string | null;
  createTicket: (data: CreateTicketRequest) => Promise<Ticket>;
  getTicketActives: () => Promise<Ticket[]>;
  clearError: () => void;
  cancelTicket: (ticketId: string) => Promise<void>;
  historyTickets: () => Promise<Ticket[]>;
  // SSE related
  isSSEConnected: boolean;
  sseConnectionError: string | null;
  activeTicket: Ticket | null;
  isMyTurn: boolean;
  dismissNotification: () => void;
}

// ✅ GLOBAL: Tracker para evitar cleanup accidental de SSE
let globalSSETracker: {
  isActive: boolean;
  ticketId: string | null;
  shouldPersist: boolean;
} = {
  isActive: false,
  ticketId: null,
  shouldPersist: false,
};

export function useTickets(): UseTicketsReturn {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loadingTickets, setLoadingTickets] = useState<boolean>(false);
  const [errorTickets, setErrorTickets] = useState<string | null>(null);
  const [activeTicket, setActiveTicket] = useState<Ticket | null>(null);
  const [isMyTurn, setIsMyTurn] = useState(false);

  // ✅ NUEVO: Estado para tracking de reconexión
  const [initialLoadCompleted, setInitialLoadCompleted] = useState(false);

  // ✅ REF para evitar loops con activeTicket
  const activeTicketRef = useRef<Ticket | null>(null);

  // ✅ REF para trackear eventos procesados
  const processedEventsRef = useRef<Set<string>>(new Set());

  const { isConnected, lastEvent, connect, disconnect, connectionError } =
    useSSE();

  // ✅ Sincronizar ref con state
  useEffect(() => {
    activeTicketRef.current = activeTicket;
  }, [activeTicket]);

  const checkActiveTicketInQueue = useCallback(
    async (queueId: string): Promise<Ticket | null> => {
      try {
        const response = await apiClient.get<{ activeTicket: Ticket | null }>(
          `${ENV.API_URL}/cliente/tickets/activos/cola/${queueId}`,
        );
        return response.data.activeTicket;
      } catch (error) {
        console.log('No hay ticket activo en esta cola');
        return null;
      }
    },
    [],
  );

  const hasValidToken = useCallback((): boolean => {
    try {
      const { token } = SecureStorage.getAuthData();
      if (!token) {
        console.warn('⚠️ No hay token en localStorage');
        return false;
      }
      console.log('✅ Token encontrado en localStorage');
      return true;
    } catch (error) {
      console.error('❌ Error verificando token:', error);
      return false;
    }
  }, []);

  // ✅ NUEVO: Función para reconectar SSE automáticamente
  const autoReconnectSSE = useCallback(
    (ticketsList: Ticket[]) => {
      console.log('🔄 Verificando reconexión automática SSE...', {
        ticketsCount: ticketsList.length,
        isConnected,
        globalSSETracker,
        initialLoadCompleted,
        hasValidToken: hasValidToken(),
      });

      // 🔧 VERIFICAR TOKEN ANTES DE RECONECTAR
      if (!hasValidToken()) {
        console.error(
          '❌ No se puede reconectar SSE: token inválido o faltante',
        );
        return;
      }

      // Solo reconectar si hay tickets activos y no estamos ya conectados
      if (ticketsList.length > 0 && !isConnected && initialLoadCompleted) {
        const firstActiveTicket = ticketsList[0]; // Usar el primer ticket activo

        if (firstActiveTicket?.id && firstActiveTicket?.queueId) {
          console.log('🔌 Reconectando SSE automáticamente...', {
            ticketId: firstActiveTicket.id,
            queueId: firstActiveTicket.queueId,
          });

          // Marcar SSE como persistente
          globalSSETracker = {
            isActive: true,
            ticketId: firstActiveTicket.id,
            shouldPersist: true,
          };

          // Conectar SSE
          connect(
            firstActiveTicket.queueId,
            firstActiveTicket.id,
            firstActiveTicket,
          );
          setActiveTicket(firstActiveTicket);

          console.log('✅ Reconexión SSE iniciada');
        } else {
          console.warn('⚠️ No se puede reconectar - faltan datos del ticket:', {
            hasId: !!firstActiveTicket?.id,
            hasQueueId: !!firstActiveTicket?.queueId,
            ticket: firstActiveTicket,
          });
        }
      } else {
        console.log('ℹ️ No se necesita reconexión:', {
          hasTickets: ticketsList.length > 0,
          isConnected,
          initialLoadCompleted,
          hasValidToken: hasValidToken(),
          razon:
            ticketsList.length === 0
              ? 'Sin tickets activos'
              : isConnected
                ? 'Ya conectado'
                : !initialLoadCompleted
                  ? 'Carga inicial no completada'
                  : !hasValidToken()
                    ? 'Token inválido'
                    : 'Desconocido',
        });
      }
    },
    [isConnected, connect, initialLoadCompleted, hasValidToken],
  );

  const createTicket = useCallback(
    async (data: CreateTicketRequest): Promise<Ticket> => {
      try {
        setLoadingTickets(true);
        setErrorTickets(null);

        // 🔧 VERIFICAR TOKEN ANTES DE CREAR TICKET
        if (!hasValidToken()) {
          throw new Error('Token de autenticación inválido o faltante');
        }

        console.log('🔍 Verificando ticket activo en cola...', data.queueId);

        const existingTicket = await checkActiveTicketInQueue(data.queueId);

        if (existingTicket) {
          console.log('⚠️ Ya tienes un ticket activo:', existingTicket.id);

          const queueId = existingTicket.queueId || data.queueId;
          const ticketId = existingTicket.id;

          console.log(
            '🔌 Conectando SSE - QueueID:',
            queueId,
            'TicketID:',
            ticketId,
          );

          // ✅ MARCAR SSE COMO PERSISTENTE
          globalSSETracker = {
            isActive: true,
            ticketId: existingTicket.id,
            shouldPersist: true,
          };

          connect(queueId, ticketId, existingTicket);
          setActiveTicket(existingTicket);

          setTickets((prev) => {
            const exists = prev.find((t) => t.id === existingTicket.id);
            return exists ? prev : [existingTicket, ...prev];
          });

          return existingTicket;
        }

        console.log('🎫 Creando nuevo ticket:', data);

        const response = await apiClient.post<Ticket>(
          `${ENV.API_URL}/cliente/tickets/crear`,
          data,
        );

        console.log('✅ Ticket creado:', response.data);

        const newTicket = response.data;
        const queueId = newTicket.queueId;
        const ticketId = newTicket.id;

        console.log(
          '🔌 Conectando SSE - QueueID:',
          queueId,
          'TicketID:',
          ticketId,
        );

        if (!queueId || !ticketId) {
          console.error('❌ Faltan datos para SSE:', {
            queueId,
            ticketId,
            newTicket,
          });
          setErrorTickets(
            'Error: No se pueden obtener los IDs necesarios para la conexión en tiempo real',
          );
        } else {
          // ✅ MARCAR SSE COMO PERSISTENTE
          globalSSETracker = {
            isActive: true,
            ticketId: newTicket.id,
            shouldPersist: true,
          };

          connect(queueId, ticketId, newTicket);
        }

        setActiveTicket(newTicket);
        setTickets((prev) => [newTicket, ...prev]);

        console.log('🔄 Ticket creado, SSE marcado como persistente');

        return newTicket;
      } catch (error: any) {
        console.error('❌ Error creando ticket:', error);
        const errorMessage =
          error.response?.data?.message ||
          error.message ||
          'Error al crear el ticket';
        setErrorTickets(errorMessage);
        throw new Error(errorMessage);
      } finally {
        setLoadingTickets(false);
      }
    },
    [connect, checkActiveTicketInQueue, hasValidToken],
  );

  const getTicketActivesStable = useCallback(async (): Promise<Ticket[]> => {
    try {
      setLoadingTickets(true);
      setErrorTickets(null);

      // 🔧 VERIFICAR TOKEN ANTES DE OBTENER TICKETS
      if (!hasValidToken()) {
        console.warn('⚠️ Token inválido, no se pueden obtener tickets');
        setTickets([]);
        return [];
      }

      console.log('📋 Obteniendo tickets activos...');

      const response = await apiClient.get<Ticket[]>(
        `${ENV.API_URL}/cliente/tickets-activos`,
      );

      console.log('🎫 Mis tickets activos:', response.data);

      const ticketsList = Array.isArray(response.data) ? response.data : [];
      setTickets(ticketsList);

      if (ticketsList.length === 0) {
        console.log('ℹ️ No hay tickets activos para mostrar');
      } else {
        // ✅ NUEVO: Intentar reconexión automática después de cargar tickets
        console.log('🔄 Tickets cargados, verificando reconexión...');
        // Usar setTimeout para asegurar que el estado se actualice primero
        setTimeout(() => {
          autoReconnectSSE(ticketsList);
        }, 100);
      }

      return ticketsList;
    } catch (error: any) {
      console.error('❌ Error obteniendo tickets activos:', error);

      if (error.response?.status === 404) {
        console.log('ℹ️ No se encontraron tickets activos');
        setTickets([]);
        return [];
      }

      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        'Error al obtener los tickets';
      setErrorTickets(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoadingTickets(false);
      // ✅ MARCAR: Carga inicial completada
      setInitialLoadCompleted(true);
    }
  }, [autoReconnectSSE, hasValidToken]);

  const cancelTicket = useCallback(
    async (ticketId: string): Promise<void> => {
      try {
        setLoadingTickets(true);
        setErrorTickets(null);
        console.log('❌ Cancelando ticket:', ticketId);

        // ✅ PRIMERO: Marcar que SSE ya NO debe persistir
        globalSSETracker = {
          isActive: false,
          ticketId: null,
          shouldPersist: false,
        };

        // ✅ SEGUNDO: Ahora SÍ desconectar SSE (porque shouldPersist = false)
        disconnect();

        // ✅ TERCERO: Cancelar ticket en el backend
        await apiClient.post(
          `${ENV.API_URL}/cliente/tickets/cancelar/${ticketId}`,
        );

        console.log('✅ Ticket cancelado:', ticketId);

        // ✅ CUARTO: Limpiar estado local
        setActiveTicket(null);
        setTickets((prev) => prev.filter((ticket) => ticket.id !== ticketId));
      } catch (error: any) {
        console.error('❌ Error cancelando ticket:', error);

        if (error.response?.status === 500) {
          console.log('🔍 Error 500 detectado, verificando...');
          try {
            await getTicketActivesStable();
            return;
          } catch (refreshError) {
            console.log('❌ Error al verificar estado:', refreshError);
          }
        }

        const errorMessage =
          error.response?.data?.message ||
          error.message ||
          'Error al cancelar el ticket';
        setErrorTickets(errorMessage);
        throw new Error(errorMessage);
      } finally {
        setLoadingTickets(false);
      }
    },
    [getTicketActivesStable, disconnect],
  );

  const historyTickets = useCallback(async (): Promise<Ticket[]> => {
    try {
      setErrorTickets(null);

      console.log('📜 Obteniendo historial de tickets...');
      const response = await apiClient.get<Ticket[]>(
        `${ENV.API_URL}/cliente/tickets/historial`,
      );

      console.log('✅ Historial obtenido:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('❌ Error obteniendo historial:', error);
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        'Error al obtener el historial de tickets';
      setErrorTickets(errorMessage);
      throw new Error(errorMessage);
    }
  }, []);

  const clearError = useCallback(() => {
    setErrorTickets(null);
  }, []);

  const dismissNotification = useCallback(() => {
    setIsMyTurn(false);
  }, []);

  // ✅ MANEJAR EVENTOS SSE sin loops
  useEffect(() => {
    if (lastEvent) {
      const eventKey = `${lastEvent.type}-${lastEvent.currentTicketNumber || 'no-current'}-${lastEvent.ticketNumber || 'no-ticket'}-${lastEvent.message || 'no-msg'}`;

      if (processedEventsRef.current.has(eventKey)) {
        console.debug('⏭️ Evento ya procesado, saltando:', eventKey);
        return;
      }

      processedEventsRef.current.add(eventKey);
      console.log('🔄 Procesando evento SSE NUEVO:', lastEvent);

      if (lastEvent.type === 'TICKET_CALLED_EVENT') {
        const currentActiveTicket = activeTicketRef.current;
        if (
          currentActiveTicket &&
          lastEvent.currentTicketNumber === currentActiveTicket.ticketNumber
        ) {
          console.log('🎉 ¡Tu ticket ha sido llamado!');
          setIsMyTurn(true);
        }
      }

      if (
        activeTicketRef.current &&
        (lastEvent.ticketNumber ||
          lastEvent.estimatedWaitTime ||
          lastEvent.moduleCode)
      ) {
        setActiveTicket((prev) =>
          prev
            ? {
                ...prev,
                ...(lastEvent.ticketNumber && {
                  ticketNumber: lastEvent.ticketNumber,
                }),
                ...(lastEvent.estimatedWaitTime && {
                  estimatedWaitTime: lastEvent.estimatedWaitTime,
                }),
                ...(lastEvent.moduleCode && {
                  moduleCode: lastEvent.moduleCode,
                }),
              }
            : null,
        );
      }
    }
  }, [lastEvent]);

  // ✅ CARGAR TICKETS ACTIVOS solo al montar
  useEffect(() => {
    console.log('🔄 useTickets montado, cargando tickets activos...');
    getTicketActivesStable();
  }, []);

  // ✅ RECONEXIÓN ADICIONAL: Si hay tickets pero no hay conexión después de la carga inicial
  useEffect(() => {
    if (initialLoadCompleted && tickets.length > 0 && !isConnected) {
      console.log('🔄 Verificando reconexión post-carga...', {
        ticketsCount: tickets.length,
        isConnected,
        initialLoadCompleted,
      });

      // Delay para evitar múltiples reconexiones
      const timeoutId = setTimeout(() => {
        autoReconnectSSE(tickets);
      }, 500);

      return () => clearTimeout(timeoutId);
    }
  }, [initialLoadCompleted, tickets.length, isConnected, autoReconnectSSE]);

  // ✅ CLEANUP CONDICIONAL - Solo desconectar si NO debe persistir
  useEffect(() => {
    return () => {
      console.log(
        '🔍 Cleanup useTickets - ¿Debe persistir SSE?',
        globalSSETracker.shouldPersist,
      );

      if (!globalSSETracker.shouldPersist) {
        console.log('🔌 Desconectando SSE en cleanup');
        disconnect();
      } else {
        console.log('✅ SSE persistirá después del desmontaje del componente');
      }
    };
  }, [disconnect]);

  return {
    tickets,
    loadingTickets,
    errorTickets,
    createTicket,
    getTicketActives: getTicketActivesStable,
    clearError,
    cancelTicket,
    historyTickets,
    isSSEConnected: isConnected,
    sseConnectionError: connectionError,
    activeTicket,
    isMyTurn,
    dismissNotification,
  };
}
