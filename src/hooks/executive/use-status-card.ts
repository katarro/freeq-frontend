// ============================================
// ARCHIVO: hooks/executive/use-status-card.ts (FIXED)
// ============================================

import { useCallback, useEffect, useState, useRef } from 'react';
import { ControlPanelData, ControlPanelHookReturn, ExecutiveStatus } from '@/types/executive.type';
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
  const [myCompletedTicketsToday, setMyCompletedTicketsToday] = useState<number>(0);
  const [sseManager, setSSEManager] = useState<SSEManager | null>(null);

  // ✅ REFERENCIAS PARA TRACKING
  const isInitializedRef = useRef<boolean>(false);
  const lastFetchTimeRef = useRef<number>(0);
  const visibilityRef = useRef<boolean>(!document.hidden);

  // ============================================
  // FUNCIONES DE DATOS
  // ============================================

  const fetchData = async (): Promise<void> => {
    try {
      setLoading(true);
      setError(null);
      lastFetchTimeRef.current = Date.now();

      console.log('🔄 Fetching control panel data...');

      const panelData = await executiveApiService.getControlPanelData();
      setData(panelData);

      console.log('✅ Panel data loaded:', {
        queueId: panelData.queueInfo.id,
        executiveId: panelData.executiveInfo.id,
        initialQueueCount: panelData.queueInfo.totalWaiting,
      });

      // ✅ ESTABLECER CONTEO INICIAL INMEDIATAMENTE
      setCountUsersInQueue(panelData.queueInfo.totalWaiting || 0);

      const completedTicketsResponse = await executiveApiService.getMyCompletedTickets(
        panelData.queueInfo.id,
      );
      setMyCompletedTicketsToday(completedTicketsResponse.count);

      console.log('✅ Initial data set:', {
        queueCount: panelData.queueInfo.totalWaiting,
        completedToday: completedTicketsResponse.count,
      });
    } catch (err) {
      console.error('❌ Error fetching data:', err);
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setLoading(false);
    }
  };

  // ✅ FUNCIÓN PARA REFRESCAR DATOS (FALLBACK)
  const refreshData = useCallback(async () => {
    if (!data?.queueInfo.id) return;

    try {
      console.log('🔄 Refreshing queue count...');
      const panelData = await executiveApiService.getControlPanelData();

      // Solo actualizar el conteo si es diferente
      if (panelData.queueInfo.totalWaiting !== countUsersInQueue) {
        console.log('📊 Queue count updated via API:', {
          old: countUsersInQueue,
          new: panelData.queueInfo.totalWaiting,
        });
        setCountUsersInQueue(panelData.queueInfo.totalWaiting || 0);
      }
    } catch (err) {
      console.warn('⚠️ Error refreshing data:', err);
    }
  }, [data?.queueInfo.id, countUsersInQueue]);

  // ============================================
  // FUNCIONES SSE
  // ============================================

  const initializeSSEManager = useCallback((executiveId: string) => {
    console.log('🔌 Initializing SSE Manager for executive:', executiveId);

    const manager = new SSEManager({
      executiveId,
      onQueueCountUpdate: (count: number) => {
        console.log('📊 SSE Queue count update:', count);
        setCountUsersInQueue(count);
      },
      onTicketCompleted: (count: number) => {
        console.log('✅ SSE Ticket completed, new count:', count);
        setMyCompletedTicketsToday(count);
      },
    });

    setSSEManager(manager);
    return manager;
  }, []);

  const connectToQueueCount = useCallback(() => {
    const queueId = data?.queueInfo.id;
    if (!queueId || !sseManager) {
      console.warn('⚠️ Cannot connect to queue count: missing queueId or sseManager');
      return;
    }

    console.log('🔗 Connecting to queue count SSE for queue:', queueId);
    sseManager.connectToQueueCount(queueId);
  }, [data?.queueInfo.id, sseManager]);

  const connectToMyCompletedTickets = useCallback(() => {
    const queueId = data?.queueInfo.id;
    if (!queueId || !sseManager) {
      console.warn('⚠️ Cannot connect to completed tickets: missing queueId or sseManager');
      return;
    }

    console.log('🔗 Connecting to completed tickets SSE for queue:', queueId);
    sseManager.connectToCompletedTickets(queueId);
  }, [data?.queueInfo.id, sseManager]);

  const disconnectSSE = useCallback(() => {
    if (sseManager) {
      console.log('🔌 Disconnecting all SSE connections');
      sseManager.disconnectAll();
    }
  }, [sseManager]);

  // ✅ FUNCIÓN DE RECONEXIÓN
  const reconnectSSE = useCallback(() => {
    if (!sseManager || !data?.queueInfo.id) return;

    console.log('🔄 Reconnecting SSE...');
    disconnectSSE();

    // Pequeño delay para asegurar desconexión completa
    setTimeout(() => {
      connectToQueueCount();
      connectToMyCompletedTickets();
    }, 100);
  }, [
    sseManager,
    data?.queueInfo.id,
    disconnectSSE,
    connectToQueueCount,
    connectToMyCompletedTickets,
  ]);

  // ============================================
  // MANEJO DE VISIBILIDAD
  // ============================================

  const handleVisibilityChange = useCallback(() => {
    const isVisible = !document.hidden;
    const wasVisible = visibilityRef.current;
    visibilityRef.current = isVisible;

    console.log('👁️ Visibility changed:', { isVisible, wasVisible });

    if (isVisible && !wasVisible) {
      console.log('🔄 Page became visible - reconnecting and refreshing...');

      // Reconectar SSE
      reconnectSSE();

      // Refrescar datos si han pasado más de 30 segundos
      const timeSinceLastFetch = Date.now() - lastFetchTimeRef.current;
      if (timeSinceLastFetch > 30000) {
        refreshData();
      }
    }
  }, [reconnectSSE, refreshData]);

  // ============================================
  // FUNCIONES DE UTILIDAD
  // ============================================

  const getExecutiveStatus = useCallback((): ExecutiveStatus => {
    if (!data?.clientsInQueue) return 'IDLE';

    const hasAttending = data.clientsInQueue.some((client) => client.status === 'ATTENDING');
    const hasCalled = data.clientsInQueue.some((client) => client.status === 'CALLED');

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

  // ✅ EFECTO 1: INICIALIZACIÓN INMEDIATA
  useEffect(() => {
    console.log('🚀 useStatusCard initializing...');
    fetchData();
  }, []);

  // ✅ EFECTO 2: INICIALIZAR SSE TAN PRONTO COMO SEA POSIBLE
  useEffect(() => {
    if (data?.executiveInfo.id && !sseManager && !isInitializedRef.current) {
      console.log('🔌 Initializing SSE immediately with executive:', data.executiveInfo.id);
      isInitializedRef.current = true;
      initializeSSEManager(data.executiveInfo.id);
    }
  }, [data?.executiveInfo.id, sseManager, initializeSSEManager]);

  // ✅ EFECTO 3: CONECTAR SSE INMEDIATAMENTE DESPUÉS DE INICIALIZAR
  useEffect(() => {
    if (data?.queueInfo.id && sseManager && isInitializedRef.current) {
      console.log('🔗 Connecting SSE immediately for queue:', data.queueInfo.id);

      // Conectar inmediatamente
      connectToQueueCount();
      connectToMyCompletedTickets();
    }
  }, [data?.queueInfo.id, sseManager, connectToQueueCount, connectToMyCompletedTickets]);

  // ✅ EFECTO 4: MANEJO DE VISIBILIDAD
  useEffect(() => {
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [handleVisibilityChange]);

  // ✅ EFECTO 5: HEARTBEAT/FALLBACK CADA 60 SEGUNDOS
  useEffect(() => {
    if (!data?.queueInfo.id) return;

    const heartbeatInterval = setInterval(() => {
      if (!document.hidden && sseManager) {
        // Verificar estado de conexiones
        const queueConnected = sseManager.isQueueCountConnected();
        const ticketsConnected = sseManager.isCompletedTicketsConnected();

        console.log('💓 Heartbeat check:', { queueConnected, ticketsConnected });

        // Si alguna conexión está caída, reconectar
        if (!queueConnected || !ticketsConnected) {
          console.log('🔄 Heartbeat detected disconnection, reconnecting...');
          reconnectSSE();
        }

        // Refrescar datos cada 2 minutos como fallback
        const timeSinceLastFetch = Date.now() - lastFetchTimeRef.current;
        if (timeSinceLastFetch > 120000) {
          // 2 minutos
          refreshData();
        }
      }
    }, 60000); // Cada 60 segundos

    return () => clearInterval(heartbeatInterval);
  }, [data?.queueInfo.id, sseManager, reconnectSSE, refreshData]);

  // ✅ EFECTO 6: CLEANUP
  useEffect(() => {
    return () => {
      console.log('🧹 Cleaning up SSE connections');
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
