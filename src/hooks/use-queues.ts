import apiClient from '@/lib/api-client';
import { useEffect, useState } from 'react';
import { ENV } from '@/lib/env';
import { Queue } from '@/types/queue';

interface UseQueuesReturn {
  queues: Queue[];
  loadingQueues: boolean;
  errorQueues: string | null;
  refetch: (branchId: string) => void;
  getQueues: () => Queue[];
  getQueueById: (queueId: string) => Queue | null;
}

export function useQueues(branchId: string): UseQueuesReturn {
  const [queues, setQueues] = useState<Queue[]>([]);
  const [loadingQueues, setLoadingQueues] = useState<boolean>(false);
  const [errorQueues, setErrorQueues] = useState<string | null>(null);

  const fetchQueues = async (branchId: string) => {
    if (!branchId || branchId.trim() === '') {
      setQueues([]);
      setLoadingQueues(false);
      setErrorQueues(null);
      return;
    }
    try {
      setLoadingQueues(true);
      setErrorQueues(null);

      const response = await apiClient.get<Queue[]>(
        `${ENV.API_URL}/cliente/colas/${branchId}`,
      );
      setQueues(response.data);
    } catch (error: any) {
      console.error('Error fetching queues:', error);
      setErrorQueues(error.message || 'Error al cargar las colas');
      setQueues([]);
    } finally {
      setLoadingQueues(false);
    }
  };

  useEffect(() => {
    fetchQueues(branchId);
  }, [branchId]);

  const refetch = (branchId: string) => {
    fetchQueues(branchId);
  };

  const getQueues = () => {
    return queues;
  };

  const getQueueById = (queueId: string): Queue | null => {
    if (!queueId || queues.length === 0) {
      return null;
    }
    return queues.find((queue) => queue.id === queueId) || null;
  };

  return {
    queues,
    loadingQueues,
    errorQueues,
    refetch,
    getQueues,
    getQueueById,
  };
}
