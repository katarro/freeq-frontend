// hooks/useCompanies.ts
import { useState, useEffect } from 'react';
import { Company } from '@/types/company';
import { ENV } from '@/lib/env';
import apiClient from '@/lib/api-client';

interface UseCompaniesReturn {
  companies: Company[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
  getActiveCompanies: () => Company[];
  findCompanyById: (id: string) => Company | undefined;
  getCompaniesByCity: (city: string) => Company[];
}

export function useCompanies(): UseCompaniesReturn {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCompanies = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await apiClient.get<Company[]>(
        `${ENV.API_URL}/cliente/empresas`,
      );
      setCompanies(response.data);
    } catch (error: any) {
      console.error('Error fetching companies:', error);
      setError(
        error?.response?.data?.message || 'Error al cargar las empresas',
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCompanies();
  }, []);

  // Funciones helper
  const getActiveCompanies = (): Company[] => {
    return companies.filter((company) => company.isActive);
  };

  const findCompanyById = (id: string): Company | undefined => {
    return companies.find((company) => company.id === id);
  };

  const getCompaniesByCity = (city: string): Company[] => {
    return companies.filter((company) =>
      company.address.toLowerCase().includes(city.toLowerCase()),
    );
  };

  const refetch = () => {
    fetchCompanies();
  };

  return {
    companies,
    loading,
    error,
    refetch,
    getActiveCompanies,
    findCompanyById,
    getCompaniesByCity,
  };
}

// Uso del hook en cualquier componente:
/*
import { useCompanies } from '@/hooks/useCompanies';

function MyComponent() {
  const { 
    companies, 
    loading, 
    error, 
    getActiveCompanies, 
    findCompanyById 
  } = useCompanies();

  if (loading) return <div>Cargando...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      {getActiveCompanies().map(company => (
        <div key={company.id}>{company.name}</div>
      ))}
    </div>
  );
}
*/
