'use client';

import { notFound, useParams } from 'next/navigation';
import { useCompanies } from '@/hooks/use-companies';
import Link from 'next/link';
import { SiteStatus } from '@/components/cards/site-card';
import { Separator } from '@/components/ui/separator';
import { useBranches } from '@/hooks/use-branches';
import React from 'react';
import { BranchesList } from '@/components/branch/branches-list';
import { CompanyHeader } from '@/components/business/company-header';
import { ButtonBack } from '@/components/ui/button-back';

function LoadingSkeleton() {
  return (
    <div className='container mx-auto py-8'>
      <div className='text-center'>
        <div className='animate-pulse'>
          <div className='w-[88px] h-[88px] bg-gray-200 rounded-full mx-auto mb-4'></div>
          <div className='h-6 bg-gray-200 rounded w-48 mx-auto mb-2'></div>
          <div className='h-4 bg-gray-200 rounded w-32 mx-auto'></div>
        </div>
      </div>
    </div>
  );
}

function ErrorMessage({
  title = 'Error',
  message,
}: {
  title?: string;
  message: string;
}) {
  return (
    <div className='container mx-auto py-8'>
      <div className='text-center'>
        <h1 className='text-2xl font-bold text-red-600 mb-2'>{title}</h1>
        <p className='text-gray-600'>{message}</p>
      </div>
    </div>
  );
}

function getCompanyStatus(company: any): SiteStatus {
  return company.isActive ? SiteStatus.AVAILABLE : SiteStatus.CLOSED;
}

function getCurrentStatus(status: SiteStatus): string {
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
}

export default function BranchPage() {
  const params = useParams();
  const slug = params.businessSlug as string;

  const { loading, error, findCompanyById } = useCompanies();
  const company = findCompanyById(slug);

  const { branches, loadingBranch, errorBranch } = useBranches(
    company?.id || '',
  );

  if (loading) return <LoadingSkeleton />;
  if (error) return <ErrorMessage message={error} />;
  if (!company) notFound();

  const companyStatus = getCompanyStatus(company);

  return (
    <>
      {/* Header Section con toda la info de la empresa */}
      <CompanyHeader
        company={company}
        status={getCurrentStatus(companyStatus)}
      />

      {/* Main Content */}
      <section className='px-4 py-5 grid gap-6 container max-w'>
        <h2 className='text-lg font-semibold text-heading-foreground'>
          Sucursales disponibles
        </h2>
        <BranchesList
          branches={branches}
          loading={loadingBranch}
          error={errorBranch}
          slug={slug}
        />
        <Separator />
        <div className='text-start'>
          <ButtonBack href={'/user/home'} variant='secondary' />
        </div>
      </section>
    </>
  );
}
