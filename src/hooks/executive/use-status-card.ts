// ============================================
// ARCHIVO: hooks/executive/use-status-card.ts (SEPARADO)
// ============================================

import apiClient from '@/lib/api-client';
import { ENV } from '@/lib/env';
import { useCallback, useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';

// Interfaz para los datos del panel de control
interface ControlPanelData {
  queueInfo: {
    id: string;
    totalWaiting: number;
    regularQueue: number;
    absentQueue: number;
  };
  averageServiceTime: number;
  clientsAttendedToday: number;
  executiveInfo: {
    module: {
      name: string;
      serviceType: string;
    };
  };
  clientsInQueue: Array<{
    status: 'WAITING' | 'CALLED' | 'ATTENDING';
  }>;
}

interface ControlPanelResponse {
  data: ControlPanelData | null;
  countUsersInQueue: number;
  loading: boolean;
  error: string | null;
  fetchData: () => Promise<void>;
  connectToQueueCount: () => void;
  connectToCompletedTickets: () => void;
  disconnectSSE: () => void;
  getExecutiveStatus: () => string;
  formatTime: (minutes: number) => string;
  clientsAttendedToday: number;
}

export function useStatusCard(): ControlPanelResponse {
  const [data, setData] = useState<ControlPanelData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [countUsersInQueue, setCountUsersInQueue] = useState<number>(0);
  const [clientsAttendedToday, setClientsAttendedToday] = useState<number>(0);

  // ✅ Refs separados para cada tipo de conexión SSE
  const queueCountEventSourceRef = useRef<EventSource | null>(null);
  const completedTicketsEventSourceRef = useRef<EventSource | null>(null);

  const fetchData = async (): Promise<void> => {
    try {
      console.log('🔄 OBTENIENDO DATOS DEL PANEL DE CONTROL');
      setLoading(true);
      const response = await apiClient.get<ControlPanelData>(
        `${ENV.API_URL}/ejecutivo/panel-de-control`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json',
          },
        },
      );

      setData(response.data);
      setError(null);

      // ✅ Obtener conteo real desde Redis después de cargar datos
      const queueId = response.data.queueInfo.id;
      await syncCompletedTicketsFromRedis(queueId);

      console.log('✅ Datos del panel obtenidos:', {
        queueId: response.data.queueInfo.id,
        initialClientsAttendedToday: response.data.clientsAttendedToday,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
      console.error('❌ Error obteniendo datos del panel:', err);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Sincronizar con valor real desde Redis
  const syncCompletedTicketsFromRedis = async (queueId: string) => {
    try {
      console.log('🔄 Sincronizando tickets completados desde Redis...');

      const response = await apiClient.get(
        `${ENV.API_URL}/ejecutivo/tickets-completados-hoy/${queueId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json',
          },
        },
      );

      const realCount = response.data.count;
      console.log(`✅ Conteo real desde Redis: ${realCount}`);

      setClientsAttendedToday(realCount);
      return realCount;
    } catch (error) {
      console.error('❌ Error obteniendo conteo desde Redis:', error);
      return null;
    }
  };

  const disconnectSSE = useCallback(() => {
    if (queueCountEventSourceRef.current) {
      console.log('🔌 Cerrando conexión SSE de conteo');
      queueCountEventSourceRef.current.close();
      queueCountEventSourceRef.current = null;
    }

    if (completedTicketsEventSourceRef.current) {
      console.log('🔌 Cerrando conexión SSE de tickets completados');
      completedTicketsEventSourceRef.current.close();
      completedTicketsEventSourceRef.current = null;
    }
  }, []);

  // ✅ CONEXIÓN SEPARADA: Solo para conteo de usuarios en cola
  const connectToQueueCount = useCallback(() => {
    const queueId = data?.queueInfo.id;
    if (!queueId) {
      console.error('❌ No se pudo obtener el ID de la cola');
      return;
    }

    // ✅ Cerrar conexión anterior si existe
    if (queueCountEventSourceRef.current) {
      queueCountEventSourceRef.current.close();
    }

    console.log('🔌 Conectando SSE para conteo de usuarios:', queueId);

    const eventSource = new EventSource(
      `${ENV.API_URL}/eventos-cola/ejecutivo/clientes-en-cola/${queueId}`,
      { withCredentials: true },
    );
    queueCountEventSourceRef.current = eventSource;

    eventSource.onopen = () => {
      console.log('✅ Conexión SSE de conteo establecida');
    };

    eventSource.onmessage = ({ data }) => {
      try {
        const parsedData = JSON.parse(data);
        console.log('📬 Evento conteo recibido:', parsedData);

        if (parsedData.type === 'QUEUE_UPDATE_EVENT') {
          const count = parsedData.clientsInQueue;
          console.log('📊 Actualizando count de usuarios:', count);
          setCountUsersInQueue(count);
        } else if (parsedData.type === 'ERROR') {
          console.error('❌ Error del servidor SSE:', parsedData.message);
          toast.error(`Error: ${parsedData.message}`);
        } else {
          console.log('ℹ️ Mensaje SSE de tipo desconocido:', parsedData.type);
        }
      } catch (error) {
        console.error('❌ Error procesando evento de conteo:', error);
        console.error('Datos recibidos:', data);
      }
    };

    eventSource.onerror = (error) => {
      console.error('❌ Error en conexión SSE de conteo:', error);

      if (eventSource.readyState === EventSource.CLOSED) {
        console.log('🔌 Conexión SSE de conteo cerrada');
      } else if (eventSource.readyState === EventSource.CONNECTING) {
        console.log('🔄 Reconectando SSE de conteo...');
      }

      toast.error('Error al conectar con el servidor en tiempo real');
    };
  }, [data?.queueInfo.id]);

  // ✅ CONEXIÓN SEPARADA: Solo para tickets completados
  const connectToCompletedTickets = useCallback(() => {
    const queueId = data?.queueInfo.id;
    if (!queueId) {
      console.error('❌ No se pudo obtener el ID de la cola');
      return;
    }

    // ✅ Cerrar conexión anterior si existe
    if (completedTicketsEventSourceRef.current) {
      completedTicketsEventSourceRef.current.close();
    }

    console.log('🔌 Conectando SSE para tickets completados:', queueId);

    const eventSource = new EventSource(
      `${ENV.API_URL}/eventos-cola/ejecutivo/tickets-completados/${queueId}`,
      { withCredentials: true },
    );
    completedTicketsEventSourceRef.current = eventSource;

    eventSource.onopen = () => {
      console.log('✅ Conexión SSE de tickets completados establecida');
    };

    eventSource.onmessage = ({ data }) => {
      try {
        const parsedData = JSON.parse(data);
        console.log('📬 Evento ticket completado recibido:', parsedData);

        if (parsedData.type === 'TICKET_COMPLETED_EVENT') {
          console.log('🎉 Ticket completado:', parsedData.ticket);
          console.log('📊 Cantidad desde Redis:', parsedData.completedToday);

          // ✅ USAR CANTIDAD DESDE REDIS (fuente de verdad)
          if (parsedData.completedToday !== undefined) {
            setClientsAttendedToday(parsedData.completedToday);
            console.log(
              `📊 Actualizando desde Redis: ${parsedData.completedToday}`,
            );
          } else {
            // ✅ FALLBACK: Incrementar localmente si no viene el campo
            console.warn(
              '⚠️ completedToday no definido, incrementando localmente',
            );
            setClientsAttendedToday((prev) => {
              const newValue = prev + 1;
              console.log(`📊 Incremento local: ${prev} → ${newValue}`);
              return newValue;
            });
          }

          // ✅ Mostrar notificación
          toast.success(
            `Ticket ${parsedData.ticket?.ticketNumber || 'N/A'} completado`,
            { duration: 3000 },
          );
        } else if (parsedData.type === 'ERROR') {
          console.error('❌ Error del servidor SSE:', parsedData.message);
          toast.error(`Error: ${parsedData.message}`);
        } else {
          console.log('ℹ️ Mensaje SSE de tipo desconocido:', parsedData.type);
        }
      } catch (error) {
        console.error(
          '❌ Error procesando evento de ticket completado:',
          error,
        );
        console.error('Datos recibidos:', data);
      }
    };

    eventSource.onerror = (error) => {
      console.error('❌ Error en conexión SSE de tickets completados:', error);

      if (eventSource.readyState === EventSource.CLOSED) {
        console.log('🔌 Conexión SSE de tickets completados cerrada');
      } else if (eventSource.readyState === EventSource.CONNECTING) {
        console.log('🔄 Reconectando SSE de tickets completados...');
      }

      toast.error('Error al conectar con tickets completados');
    };
  }, [data?.queueInfo.id]);

  // ✅ Cargar datos iniciales
  useEffect(() => {
    fetchData();
  }, []);

  // ✅ Conectar a ambos SSE cuando tengamos el queueId
  useEffect(() => {
    if (data?.queueInfo.id) {
      console.log('🎯 QueueId disponible, conectando a eventos separados...');
      connectToQueueCount();
      connectToCompletedTickets();
    }
  }, [data?.queueInfo.id, connectToQueueCount, connectToCompletedTickets]);

  // ✅ Cleanup al desmontar
  useEffect(() => {
    return () => {
      disconnectSSE();
    };
  }, [disconnectSSE]);

  // Determinar estado del ejecutivo
  const getExecutiveStatus = () => {
    if (!data?.clientsInQueue) return 'IDLE';

    const hasAttending = data.clientsInQueue.some(
      (client) => client.status === 'ATTENDING',
    );
    const hasCalled = data.clientsInQueue.some(
      (client) => client.status === 'CALLED',
    );

    if (hasAttending) return 'ATTENDING';
    if (hasCalled) return 'CALLED';
    if (data.queueInfo.totalWaiting > 0) return 'AVAILABLE';
    return 'IDLE';
  };

  // Formatear tiempo en minutos a MM:SS
  const formatTime = (minutes: number): string => {
    if (minutes === 0) return '0:00';
    const mins = Math.floor(minutes);
    const secs = Math.round((minutes - mins) * 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return {
    data,
    loading,
    error,
    fetchData,
    countUsersInQueue,
    connectToQueueCount,
    connectToCompletedTickets,
    disconnectSSE,
    getExecutiveStatus,
    formatTime,
    clientsAttendedToday,
  };
}
