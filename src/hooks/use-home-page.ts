'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, usePathname, useRouter } from 'next/navigation';

export type FilterType = 'all' | 'open' | 'favorites';

export function useHomePage() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  // Estado inicial desde query params
  const initialFilter = (searchParams.get('filter') as FilterType) || 'all';
  const [activeFilter, setActiveFilter] = useState<FilterType>(initialFilter);
  const [searchSite, setSearchSite] = useState<string>('');

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
    searchSite,
    setSearchSite,
    activeFilter,
    updateFilter,
    toggleInputFilter,
  };
}
