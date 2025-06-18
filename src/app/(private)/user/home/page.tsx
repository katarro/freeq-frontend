'use client';

import SiteCard, { SiteStatus } from '@/components/cards/site-card';
import FreeqSearch from '@/components/freeq-search';
import { useHomePage } from '@/hooks/use-home-page';
import { useCompanies } from '@/hooks/use-companies';
import { Company } from '@/types/company';
import Image from 'next/image';
import { Suspense, useMemo } from 'react';
import { add } from 'date-fns';

export default function HomePage() {
  const { searchSite, setSearchSite, activeFilter, toggleInputFilter } =
    useHomePage();
  const { companies, loading, error } = useCompanies();

  // Convertir empresas a formato compatible con SiteCard
  const sitesFromCompanies = useMemo(() => {
    return companies.map((company: Company) => ({
      id: company.id,
      title: company.name,
      address: company.address,
      description: company.description,
      status: company.isActive ? 'available' : 'closed',
      slug: company.id,
      logo: company.logo || '/images/sites/default-company.png',
      isLiked: false, // Se actualiza en SiteCard desde localStorage
    }));
  }, [companies]);

  // Función para obtener favoritos
  const getFavorites = (): string[] => {
    if (typeof window !== 'undefined') {
      return JSON.parse(localStorage.getItem('favorites') ?? '[]');
    }
    return [];
  };

  // Filtrar empresas basado en búsqueda y filtro activo
  const filteredSites = useMemo(() => {
    return sitesFromCompanies.filter((site) => {
      // Filtro por búsqueda
      const matchesSearch = site.title
        .toLowerCase()
        .includes(searchSite.toLowerCase());

      // Filtro por estado
      let matchesFilter = true;
      if (activeFilter === 'open') {
        matchesFilter = site.status !== 'closed';
      } else if (activeFilter === 'favorites') {
        matchesFilter = getFavorites().includes(site.slug);
      }

      return matchesSearch && matchesFilter;
    });
  }, [sitesFromCompanies, searchSite, activeFilter]);

  if (loading) {
    return (
      <section className='flex flex-col'>
        <div className='px-4 pt-8 lg:pb-9 bg-primary flex flex-col gap-2.5 lg:gap-10'>
          <h1 className='text-2xl lg:text-3xl font-semibold text-primary-foreground text-center'>
            Elige tu lugar y haz fila <br className='lg:hidden' /> sin estrés
          </h1>
          <figure className='w-[240px] h-[179px] mx-auto'>
            <Image
              className='aspect-square w-full h-full object-cover'
              src='/images/rafiki.avif'
              alt='Rifiki Que'
              width={240}
              height={179}
            />
          </figure>
        </div>
        <div className='px-4 pb-8 pt-10 bg-primary lg:bg-transparent flex flex-col gap-4 md:gap-6'>
          <div className='max-w-[400px]'>
            <FreeqSearch
              onSearchChange={setSearchSite}
              onToggleFilter={toggleInputFilter}
              filterActive={activeFilter !== 'all'}
            />
          </div>

          {/* Loading skeleton */}
          <div className='grid lg:grid-cols-4 gap-6'>
            {Array.from({ length: 8 }).map((_, index) => (
              <div key={index} className='animate-pulse'>
                <div className='bg-gray-200 rounded-lg h-48'></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className='flex flex-col'>
        <div className='px-4 pt-8 lg:pb-9 bg-primary flex flex-col gap-2.5 lg:gap-10'>
          <h1 className='text-2xl lg:text-3xl font-semibold text-primary-foreground text-center'>
            Elige tu lugar y haz fila <br className='lg:hidden' /> sin estrés
          </h1>
          <figure className='w-[240px] h-[179px] mx-auto'>
            <Image
              className='aspect-square w-full h-full object-cover'
              src='/images/rafiki.avif'
              alt='Rifiki Que'
              width={240}
              height={179}
            />
          </figure>
        </div>
        <div className='px-4 pb-8 pt-10 bg-primary lg:bg-transparent flex flex-col gap-4 md:gap-6'>
          <div className='text-center py-8'>
            <h3 className='text-lg font-semibold text-red-600 mb-2'>
              Error al cargar empresas
            </h3>
            <p className='text-gray-600 mb-4'>{error}</p>
            <button
              onClick={() => window.location.reload()}
              className='px-4 py-2 bg-primary text-white rounded hover:bg-primary/90'
            >
              Reintentar
            </button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <Suspense fallback={<div className='w-full h-full' />}>
      <section className='flex flex-col'>
        <div className='px-4 pt-8 lg:pb-9 bg-primary flex flex-col gap-2.5 lg:gap-10'>
          <h1 className='text-2xl lg:text-3xl font-semibold text-primary-foreground text-center'>
            Elige tu lugar y haz fila <br className='lg:hidden' /> sin estrés
          </h1>
          <figure className='w-[240px] h-[179px] mx-auto'>
            <Image
              className='aspect-square w-full h-full object-cover'
              src='/images/rafiki.avif'
              alt='Rifiki Que'
              width={240}
              height={179}
            />
          </figure>
        </div>
        <div className='px-4 pb-8 pt-10 bg-primary lg:bg-transparent flex flex-col gap-4 md:gap-6'>
          <div className='max-w-[400px]'>
            <FreeqSearch
              onSearchChange={setSearchSite}
              onToggleFilter={toggleInputFilter}
              filterActive={activeFilter !== 'all'}
            />
          </div>

          {/* Mostrar mensaje si no hay resultados */}
          {filteredSites.length === 0 ? (
            <div className='text-center py-8'>
              <h3 className='text-lg font-semibold text-gray-900 mb-2'>
                {searchSite
                  ? 'No se encontraron resultados'
                  : 'No hay empresas disponibles'}
              </h3>
              <p className='text-gray-600'>
                {searchSite
                  ? `No encontramos empresas que coincidan con "${searchSite}"`
                  : activeFilter === 'favorites'
                    ? 'No tienes empresas marcadas como favoritas'
                    : 'Actualmente no hay empresas registradas'}
              </p>
            </div>
          ) : (
            <div className='grid lg:grid-cols-4 gap-6'>
              {filteredSites.map((site) => (
                <SiteCard
                  key={site.id}
                  title={site.title}
                  address={site.address}
                  description={site.description}
                  status={site.status as SiteStatus}
                  isLiked={site.isLiked}
                  slug={site.slug}
                  // siteImage={site.logo}
                />
              ))}
            </div>
          )}
        </div>
      </section>
    </Suspense>
  );
}
