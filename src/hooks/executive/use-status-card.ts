import apiClient from '@/lib/api-client';
import { ENV } from '@/lib/env';
import { useCallback, useRef, useState } from 'react';
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
  countUsers: number;
  loading: boolean;
  error: string | null;
  fetchData: () => Promise<void>;
  fetchCountUsersInQueue: () => void;
  disconnectSSE: () => void;
}

export function useStatusCard(): ControlPanelResponse {
  const [data, setData] = useState<ControlPanelData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [countUsers, setCountUsers] = useState<number>(0);

  // ✅ Usar ref para mantener referencia del EventSource
  const eventSourceRef = useRef<EventSource | null>(null);

  const fetchData = async (): Promise<void> => {
    try {
      console.log('OBTENIENDO DATOS DEL PANEL DE CONTROL');
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
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setLoading(false);
    }
  };

  const disconnectSSE = useCallback(() => {
    if (eventSourceRef.current) {
      console.log('🔌 Cerrando conexión SSE');
      eventSourceRef.current.close();
      eventSourceRef.current = null;
    }
  }, []);

  const fetchCountUsersInQueue = useCallback(() => {
    const queueId = data?.queueInfo.id;
    if (!queueId) {
      console.error('No se pudo obtener el ID de la cola');
      return;
    }

    disconnectSSE();
    console.log('🔌 Conectando SSE para ejecutivos:', queueId);

    const eventSource = new EventSource(
      `${ENV.API_URL}/eventos-cola/ejecutivo/clientes-en-cola/${queueId}`,
    );

    eventSourceRef.current = eventSource;

    eventSource.onopen = () => {
      console.log('✅ Conexión SSE establecida para ejecutivos');
    };

    eventSource.onmessage = ({ data }) => {
      try {
        const parsedData = JSON.parse(data);
        console.log('📬 Mensaje SSE recibido:', parsedData.clientsInQueue);

        // ✅ Verificar la estructura del mensaje
        if (parsedData.type === 'QUEUE_UPDATE_EVENT') {
          const count = parsedData.clientsInQueue;
          console.log('📊 Actualizando count de usuarios:', count);
          setCountUsers(count);
        } else if (parsedData.type === 'ERROR') {
          console.error('❌ Error del servidor SSE:', parsedData.message);
          toast.error(`Error: ${parsedData.message}`);
        } else {
          console.log('ℹ️ Mensaje SSE de tipo desconocido:', parsedData.type);
        }
      } catch (error) {
        console.error('Error al procesar los datos de la cola:', error);
        console.error('Datos recibidos:', data);
      }
    };

    eventSource.onerror = (error) => {
      console.error('❌ Error en conexión SSE:', error);

      // ✅ Verificar estado de la conexión
      if (eventSource.readyState === EventSource.CLOSED) {
        console.log('🔌 Conexión SSE cerrada');
      } else if (eventSource.readyState === EventSource.CONNECTING) {
        console.log('🔄 Reconectando SSE...');
      }

      toast.error('Error al conectar con el servidor en tiempo real');
    };
  }, [data?.queueInfo.id, disconnectSSE]);

  return {
    data,
    loading,
    error,
    fetchData,
    countUsers,
    fetchCountUsersInQueue,
    disconnectSSE,
  };
}
