'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, usePathname, useRouter } from 'next/navigation';
import sitesData from '@/data/sites.json';

export type FilterType = 'all' | 'open' | 'favorites';

export function useHomePage() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  // Estado inicial desde query params
  const initialFilter = (searchParams.get('filter') as FilterType) || 'all';
  const [activeFilter, setActiveFilter] = useState<FilterType>(initialFilter);
  const [searchSite, setSearchSite] = useState<string>('');

  // Obtener favoritos del localStorage
  const getFavorites = (): string[] => {
    if (typeof window !== 'undefined') {
      return JSON.parse(localStorage.getItem('favorites') ?? '[]');
    }
    return [];
  };

  // Sincronizar cuando cambian los query params
  useEffect(() => {
    const newFilter = (searchParams.get('filter') as FilterType) || 'all';
    if (newFilter !== activeFilter) {
      setActiveFilter(newFilter);
    }
  }, [searchParams, activeFilter]);

  // Actualizar filtro y URL
  const updateFilter = (filter: FilterType) => {
    setActiveFilter(filter);
    const params = new URLSearchParams(searchParams);

    if (filter === 'all') {
      params.delete('filter');
    } else {
      params.set('filter', filter);
    }

    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  };

  // Filtrar sitios
  const filteredSites = sitesData.sites.filter((site) => {
    const matchesSearch = site.title
      .toLowerCase()
      .includes(searchSite.toLowerCase());

    let matchesFilter = true;
    if (activeFilter === 'open') {
      matchesFilter = site.status !== 'closed';
    } else if (activeFilter === 'favorites') {
      matchesFilter = getFavorites().includes(site.slug);
    }

    return matchesSearch && matchesFilter;
  });

  // Función para el botón del input (cicla entre filtros)
  const toggleInputFilter = () => {
    let nextFilter: FilterType;
    if (activeFilter === 'all') {
      nextFilter = 'open';
    } else if (activeFilter === 'open') {
      nextFilter = 'favorites';
    } else {
      nextFilter = 'all';
    }

    updateFilter(nextFilter);
  };

  return {
    filteredSites,
    setSearchSite,
    activeFilter,
    updateFilter,
    toggleInputFilter,
  };
}
