'use client';

import { notFound, useParams } from 'next/navigation';
import { useCompanies } from '@/hooks/use-companies';
import { SiteStatus } from '@/components/cards/site-card';
import { Separator } from '@/components/ui/separator';
import React from 'react';
import { CompanyHeader } from '@/components/business/company-header';
import { QueueList } from '@/components/queues/queue-list';
import { useQueues } from '@/hooks/use-queues';
import { ButtonBack } from '@/components/ui/button-back';
const LoadingSkeleton = () => (
  <div className="container mx-auto py-8">
    <div className="text-center">
      <div className="animate-pulse">
        <div className="w-[88px] h-[88px] bg-gray-200 rounded-full mx-auto mb-4"></div>
        <div className="h-6 bg-gray-200 rounded w-48 mx-auto mb-2"></div>
        <div className="h-4 bg-gray-200 rounded w-32 mx-auto"></div>
      </div>
    </div>
  </div>
);

const ErrorMessage = ({ title = 'Error', message }: { title?: string; message: string }) => (
  <div className="text-center py-8">
    <div className="bg-red-50 border border-red-200 rounded-lg p-6 mx-auto max-w-md">
      <h3 className="text-lg font-semibold text-red-800 mb-2">{title}</h3>
      <p className="text-red-600">{message}</p>
    </div>
  </div>
);

const getCompanyStatus = (company: any): SiteStatus =>
  company.isActive ? SiteStatus.AVAILABLE : SiteStatus.CLOSED;

const getCurrentStatus = (status: SiteStatus): string => {
  switch (status) {
    case SiteStatus.AVAILABLE:
      return 'Disponible';
    case SiteStatus.HIGH_DEMAND:
      return 'Alta demanda';
    case SiteStatus.CLOSED:
      return 'Cerrado';
    default:
      return 'Disponible';
  }
};

export default function ServicesPage() {
  const { businessSlug, branchSlug } = useParams<{
    businessSlug: string;
    branchSlug: string;
  }>();

  if (!businessSlug || !branchSlug) notFound();

  const { loading, error, findCompanyById } = useCompanies();
  const { loadingQueues, errorQueues, queues } = useQueues(branchSlug);

  // Solo mostrar loading si company también está cargando
  if (loading) return <LoadingSkeleton />;

  // Solo fallar si company tiene error
  if (error) return <ErrorMessage message={error} />;

  const company = findCompanyById(businessSlug);
  if (!company) notFound();

  const companyStatus = getCompanyStatus(company);

  return (
    <>
      <CompanyHeader company={company} status={getCurrentStatus(companyStatus)} />
      <section className="px-4 py-5 grid gap-6 container max-w">
        <section className="space-y-4">
          <h2 className="text-lg font-semibold text-heading-foreground">Servicios disponibles</h2>
        </section>

        {/* Mostrar loading solo para servicios */}
        {loadingQueues && (
          <div className="text-center py-4">
            <div className="animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-48 mx-auto mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-32 mx-auto"></div>
            </div>
          </div>
        )}

        {/* Mostrar error de servicios si existe */}
        {errorQueues && <ErrorMessage title="Error al cargar servicios" message={errorQueues} />}

        {/* Mostrar servicios solo si no hay error y no está cargando */}
        {!errorQueues && !loadingQueues && (
          <>
            {queues.length === 0 ? (
              <div className="text-center text-gray-500 py-8">
                No hay servicios disponibles en esta sucursal.
              </div>
            ) : (
              <>
                <Separator />
                <QueueList company={company} queues={queues} />
              </>
            )}
          </>
        )}

        <Separator />
        <div className="text-start">
          <ButtonBack href={`/user/business/${businessSlug}`} variant="secondary" />
        </div>
      </section>
    </>
  );
}
