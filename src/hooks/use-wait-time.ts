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

  useEffect(() => {
    if (!queueId) return;

    async function fetchWaitTime() {
      setLoading(true);
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
        setWaitTime(data.tiempo_espera ?? data.tiempo_restante); // minutos
      } catch (err) {
        setError('Error de red');
      } finally {
        setLoading(false);
      }
    }

    fetchWaitTime();
  }, [queueId, ticketId]);

  return { waitTime, loading, error };
}
