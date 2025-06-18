import { ENV } from '@/lib/env';
import { useState, useEffect } from 'react';
import apiClient from '@/lib/api-client';
import { Service } from '@/types/service';

interface UseServicesReturn {
  services: Service[];
  loadingServices: boolean;
  errorServices: string | null;
  refetch: (branchId: string) => void;
  getServices: () => Service[];
}

export function useServices(branchId: string): UseServicesReturn {
  const [services, setServices] = useState<Service[]>([]);
  const [loadingServices, setLoadingServices] = useState(true);
  const [errorServices, setErrorServices] = useState<string | null>(null);

  const fetchServices = async (branchId: string) => {
    if (!branchId || branchId.trim() === '') {
      setServices([]);
      setLoadingServices(false);
      setErrorServices(null);
      return;
    }
    try {
      setLoadingServices(true);
      setErrorServices(null);

      const response = await apiClient.get<Service[]>(
        `${ENV.API_URL}/cliente/servicios/${branchId}`,
      );
      console.log('Servicios: ', response.data);
      setServices(response.data);
    } catch (error: any) {
      console.error('Error fetching services:', error);
      setErrorServices(error.message || 'Error al cargar los servicios');
      setServices([]);
    } finally {
      setLoadingServices(false);
    }
  };

  useEffect(() => {
    fetchServices(branchId);
  }, [branchId]);

  const refetch = (branchId: string) => {
    fetchServices(branchId);
  };
  const getServices = () => {
    return services;
  };

  return { services, loadingServices, errorServices, refetch, getServices };
}
