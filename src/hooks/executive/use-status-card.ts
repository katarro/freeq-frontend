// ============================================
// ARCHIVO: hooks/executive/use-status-card.ts (REFACTORIZADO)
// ============================================

import apiClient from '@/lib/api-client';
import { ENV } from '@/lib/env';
import { useCallback, useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';

// ============================================
// INTERFACES
// ============================================

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
    id: string;
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
  connectToMyCompletedTickets: () => void;
  disconnectSSE: () => void;
  getExecutiveStatus: () => string;
  formatTime: (minutes: number) => string;
  myCompletedTicketsToday: number;
}

// ============================================
// CONSTANTES
// ============================================

const SSE_EVENTS = {
  QUEUE_UPDATE: 'QUEUE_UPDATE_EVENT',
  TICKET_COMPLETED: 'TICKET_COMPLETED_EVENT',
  ERROR: 'ERROR',
} as const;

const CONNECTION_STATES = {
  CONNECTING: 0,
  OPEN: 1,
  CLOSED: 2,
} as const;

// ============================================
// UTILIDADES
// ============================================

const createHeaders = () => ({
  Authorization: `Bearer ${localStorage.getItem('token')}`,
  'Content-Type': 'application/json',
});

const parseSSEData = (data: string) => {
  try {
    return JSON.parse(data);
  } catch {
    return null;
  }
};

// ============================================
// HOOK PRINCIPAL
// ============================================

export function useStatusCard(): ControlPanelResponse {
  // ============================================
  // ESTADO
  // ============================================

  const [data, setData] = useState<ControlPanelData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [countUsersInQueue, setCountUsersInQueue] = useState<number>(0);
  const [myCompletedTicketsToday, setMyCompletedTicketsToday] =
    useState<number>(0);

  const queueCountEventSourceRef = useRef<EventSource | null>(null);
  const completedTicketsEventSourceRef = useRef<EventSource | null>(null);

  // ============================================
  // FUNCIONES DE DATOS
  // ============================================

  const fetchControlPanelData = async (): Promise<ControlPanelData> => {
    const response = await apiClient.get<ControlPanelData>(
      `${ENV.API_URL}/ejecutivo/panel-de-control`,
      { headers: createHeaders() },
    );
    return response.data;
  };

  const syncMyCompletedTicketsFromRedis = async (
    queueId: string,
  ): Promise<number> => {
    try {
      const response = await apiClient.get(
        `${ENV.API_URL}/ejecutivo/mis-tickets-completados/${queueId}`,
        { headers: createHeaders() },
      );
      return response.data.count || 0;
    } catch {
      return 0;
    }
  };

  const fetchData = async (): Promise<void> => {
    try {
      setLoading(true);
      const panelData = await fetchControlPanelData();
      setData(panelData);
      setError(null);

      const completedCount = await syncMyCompletedTicketsFromRedis(
        panelData.queueInfo.id,
      );
      setMyCompletedTicketsToday(completedCount);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setLoading(false);
    }
  };

  // ============================================
  // FUNCIONES SSE - QUEUE COUNT
  // ============================================

  const handleQueueCountMessage = useCallback((data: string) => {
    const parsedData = parseSSEData(data);
    if (!parsedData) return;

    switch (parsedData.type) {
      case SSE_EVENTS.QUEUE_UPDATE:
        setCountUsersInQueue(parsedData.clientsInQueue);
        break;
      case SSE_EVENTS.ERROR:
        toast.error(`Error: ${parsedData.message}`);
        break;
    }
  }, []);

  const handleQueueCountError = useCallback((event: Event) => {
    const eventSource = event.target as EventSource;

    if (eventSource.readyState === CONNECTION_STATES.CLOSED) return;
    if (eventSource.readyState === CONNECTION_STATES.CONNECTING) return;

    toast.error('Error al conectar con el servidor en tiempo real');
  }, []);

  const connectToQueueCount = useCallback(() => {
    const queueId = data?.queueInfo.id;
    if (!queueId) return;

    if (queueCountEventSourceRef.current) {
      queueCountEventSourceRef.current.close();
    }

    const eventSource = new EventSource(
      `${ENV.API_URL}/eventos-cola/ejecutivo/clientes-en-cola/${queueId}`,
      { withCredentials: true },
    );

    eventSource.onmessage = ({ data }) => handleQueueCountMessage(data);
    eventSource.onerror = handleQueueCountError;

    queueCountEventSourceRef.current = eventSource;
  }, [data?.queueInfo.id, handleQueueCountMessage, handleQueueCountError]);

  // ============================================
  // FUNCIONES SSE - COMPLETED TICKETS
  // ============================================

  const handleTicketCompletedMessage = useCallback(
    (data: string, executiveId: string) => {
      const parsedData = parseSSEData(data);
      if (!parsedData) return;

      switch (parsedData.type) {
        case SSE_EVENTS.TICKET_COMPLETED:
          if (parsedData.executiveId === executiveId) {
            const newCount =
              parsedData.myCompletedToday ?? myCompletedTicketsToday + 1;
            setMyCompletedTicketsToday(newCount);
          }
          break;
        case SSE_EVENTS.ERROR:
          toast.error(`Error: ${parsedData.message}`);
          break;
      }
    },
    [myCompletedTicketsToday],
  );

  const handleTicketCompletedError = useCallback((event: Event) => {
    const eventSource = event.target as EventSource;

    if (eventSource.readyState === CONNECTION_STATES.CLOSED) return;
    if (eventSource.readyState === CONNECTION_STATES.CONNECTING) return;

    toast.error('Error al conectar con mis tickets completados');
  }, []);

  const connectToMyCompletedTickets = useCallback(() => {
    const { queueId, executiveId } =
      data?.queueInfo.id && data?.executiveInfo.id
        ? { queueId: data.queueInfo.id, executiveId: data.executiveInfo.id }
        : { queueId: null, executiveId: null };

    if (!queueId || !executiveId) return;

    if (completedTicketsEventSourceRef.current) {
      completedTicketsEventSourceRef.current.close();
    }

    const eventSource = new EventSource(
      `${ENV.API_URL}/eventos-cola/ejecutivo/tickets-completados/${queueId}/${executiveId}`,
      { withCredentials: true },
    );

    eventSource.onmessage = ({ data }) =>
      handleTicketCompletedMessage(data, executiveId);
    eventSource.onerror = handleTicketCompletedError;

    completedTicketsEventSourceRef.current = eventSource;
  }, [
    data?.queueInfo.id,
    data?.executiveInfo.id,
    handleTicketCompletedMessage,
    handleTicketCompletedError,
  ]);

  // ============================================
  // FUNCIONES DE UTILIDAD
  // ============================================

  const disconnectSSE = useCallback(() => {
    [queueCountEventSourceRef, completedTicketsEventSourceRef].forEach(
      (ref) => {
        if (ref.current) {
          ref.current.close();
          ref.current = null;
        }
      },
    );
  }, []);

  const getExecutiveStatus = useCallback(() => {
    if (!data?.clientsInQueue) return 'IDLE';

    const statusChecks = {
      ATTENDING: (client: any) => client.status === 'ATTENDING',
      CALLED: (client: any) => client.status === 'CALLED',
    };

    if (data.clientsInQueue.some(statusChecks.ATTENDING)) return 'ATTENDING';
    if (data.clientsInQueue.some(statusChecks.CALLED)) return 'CALLED';
    if (data.queueInfo.totalWaiting > 0) return 'AVAILABLE';

    return 'IDLE';
  }, [data]);

  const formatTime = useCallback((minutes: number): string => {
    if (minutes === 0) return '0:00';

    const mins = Math.floor(minutes);
    const secs = Math.round((minutes - mins) * 60);

    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }, []);

  // ============================================
  // EFECTOS
  // ============================================

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (data?.queueInfo.id && data?.executiveInfo.id) {
      connectToQueueCount();
      connectToMyCompletedTickets();
    }
  }, [
    data?.queueInfo.id,
    data?.executiveInfo.id,
    connectToQueueCount,
    connectToMyCompletedTickets,
  ]);

  useEffect(() => {
    return () => disconnectSSE();
  }, [disconnectSSE]);

  // ============================================
  // RETORNO
  // ============================================

  return {
    data,
    loading,
    error,
    fetchData,
    countUsersInQueue,
    connectToQueueCount,
    connectToMyCompletedTickets,
    disconnectSSE,
    getExecutiveStatus,
    formatTime,
    myCompletedTicketsToday,
  };
}
