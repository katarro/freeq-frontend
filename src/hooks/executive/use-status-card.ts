// ============================================
// ARCHIVO: hooks/executive/use-status-card.ts (REFACTORIZADO)
// ============================================

import { useCallback, useEffect, useState } from 'react';
import {
  ControlPanelData,
  ControlPanelHookReturn,
  ExecutiveStatus,
} from '@/types/executive.type';
import { executiveApiService } from '@/services/api';
import { SSEManager } from '@/lib/sse/sse-manager';

export function useStatusCard(): ControlPanelHookReturn {
  // ============================================
  // ESTADO
  // ============================================

  const [data, setData] = useState<ControlPanelData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [countUsersInQueue, setCountUsersInQueue] = useState<number>(0);
  const [myCompletedTicketsToday, setMyCompletedTicketsToday] =
    useState<number>(0);
  const [sseManager, setSSEManager] = useState<SSEManager | null>(null);

  // ============================================
  // FUNCIONES DE DATOS
  // ============================================

  const fetchData = async (): Promise<void> => {
    try {
      setLoading(true);
      setError(null);

      const panelData = await executiveApiService.getControlPanelData();
      setData(panelData);

      const completedTicketsResponse =
        await executiveApiService.getMyCompletedTickets(panelData.queueInfo.id);
      setMyCompletedTicketsToday(completedTicketsResponse.count);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setLoading(false);
    }
  };

  // ============================================
  // FUNCIONES SSE
  // ============================================

  const initializeSSEManager = useCallback((executiveId: string) => {
    const manager = new SSEManager({
      executiveId,
      onQueueCountUpdate: setCountUsersInQueue,
      onTicketCompleted: setMyCompletedTicketsToday,
    });

    setSSEManager(manager);
    return manager;
  }, []);

  const connectToQueueCount = useCallback(() => {
    const queueId = data?.queueInfo.id;
    if (!queueId || !sseManager) return;

    sseManager.connectToQueueCount(queueId);
  }, [data?.queueInfo.id, sseManager]);

  const connectToMyCompletedTickets = useCallback(() => {
    const queueId = data?.queueInfo.id;
    if (!queueId || !sseManager) return;

    sseManager.connectToCompletedTickets(queueId);
  }, [data?.queueInfo.id, sseManager]);

  const disconnectSSE = useCallback(() => {
    sseManager?.disconnectAll();
  }, [sseManager]);

  // ============================================
  // FUNCIONES DE UTILIDAD
  // ============================================

  const getExecutiveStatus = useCallback((): ExecutiveStatus => {
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
    if (data?.executiveInfo.id && !sseManager) {
      initializeSSEManager(data.executiveInfo.id);
    }
  }, [data?.executiveInfo.id, sseManager, initializeSSEManager]);

  useEffect(() => {
    if (data?.queueInfo.id && data?.executiveInfo.id && sseManager) {
      connectToQueueCount();
      connectToMyCompletedTickets();
    }
  }, [
    data?.queueInfo.id,
    data?.executiveInfo.id,
    sseManager,
    connectToQueueCount,
    connectToMyCompletedTickets,
  ]);

  useEffect(() => {
    return () => {
      disconnectSSE();
    };
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
