import apiClient from '@/lib/api-client';
import { ENV } from '@/lib/env';
import { useState } from 'react';

// Interfaz para los datos del panel de control
interface ControlPanelData {
  queueInfo: {
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

export function useStatusCard() {
  const [data, setData] = useState<ControlPanelData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
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

  return {
    data,
    loading,
    error,
    fetchData,
  };
}
