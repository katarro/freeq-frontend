import { useEffect, useState } from 'react';
import apiClient from '@/lib/api-client';
import { ENV } from '@/lib/env';
import { Branch } from '@/types/branch';

export interface UseBranchesReturn {
  branches: Branch[];
  loadingBranch: boolean;
  errorBranch: string | null;
  fetchBranches: (companyId: string) => Promise<void>;
  getBranches: () => Branch[];
  getBranchById: (id: string) => Branch | undefined;
  getActiveBranches: () => Branch[];
  refetch: (companyId: string) => void;
}

export function useBranches(companyId: string): UseBranchesReturn {
  const [branches, setBranches] = useState<Branch[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchBranches = async (companyId: string) => {
    if (!companyId || companyId.trim() === '') {
      setBranches([]);
      setLoading(false);
      setError(null);
      return;
    }
    try {
      setLoading(true);
      setError(null);

      const response = await apiClient.get<Branch[]>(
        `${ENV.API_URL}/cliente/sucursales/${companyId}`,
      );

      console.log('Sucursales: ', response.data);
      setBranches(response.data);
    } catch (error: any) {
      console.error('Error fetching branches:', error);
      setError(error.message || 'Error al cargar las sucursales');
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchBranches(companyId);
  }, [companyId]);

  const getBranches = (): Branch[] => {
    return branches;
  };
  const getBranchById = (id: string): Branch | undefined => {
    return branches.find((branch) => branch.id === id);
  };
  const getActiveBranches = (): Branch[] => {
    return branches.filter((branch) => branch.isActive);
  };
  const refetch = (companyId: string) => {
    fetchBranches(companyId);
  };

  return {
    branches,
    loadingBranch: loading,
    errorBranch: error,
    fetchBranches,
    getBranches,
    getBranchById,
    getActiveBranches,
    refetch,
  };
}
