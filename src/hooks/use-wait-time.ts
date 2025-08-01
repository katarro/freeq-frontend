import apiClient from '@/lib/api-client';
import { ENV } from '@/lib/env';
import { useEffect, useState } from 'react';

/**
 * Hook para obtener el tiempo estimado de espera en la cola.
 * Si se pasa ticketId, consulta el endpoint de tiempo restante para ese ticket.
 */
export function useWaitTime(queueId: string, ticketId?: string) {
  const [waitTime, setWaitTime] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFirstLoad, setIsFirstLoad] = useState(true);

  useEffect(() => {
    if (!queueId) return;

    async function fetchWaitTime() {
      // Solo mostrar loading en la primera carga
      if (isFirstLoad) {
        setLoading(true);
      }
      setError(null);

      try {
        let url = `${ENV.API_URL}/cola/obtener-tiempo-en-cola/${queueId}`;
        if (ticketId) {
          url = `${ENV.API_URL}/cola/tiempo-restante-ticket/${queueId}/${ticketId}`;
        }

        const res = await apiClient.post(url, {
          date: new Date().toISOString(),
        });

        console.log('📊 Tiempo de espera obtenido:', res.data);

        const data = res.data;
        const newTime = data.tiempo_espera ?? data.tiempo_restante;

        // Solo actualizar si cambió el valor
        if (newTime !== waitTime) {
          setWaitTime(newTime);
        }
      } catch (err) {
        setError('Error de red');
      } finally {
        if (isFirstLoad) {
          setLoading(false);
          setIsFirstLoad(false);
        }
      }
    }

    // Fetch inicial inmediato
    fetchWaitTime();

    const interval = setInterval(() => {
      fetchWaitTime();
    }, 8000); // 8 segundos en vez de 3

    return () => clearInterval(interval);
  }, [queueId, ticketId]);

  return { waitTime, loading, error };
}
