'use client';

import { notFound, useParams } from 'next/navigation';
import { useCompanies } from '@/hooks/use-companies';
import { useQueues } from '@/hooks/use-queues';
import { SiteStatus } from '@/components/cards/site-card';
import { Separator } from '@/components/ui/separator';
import { CompanyHeader } from '@/components/business/company-header';
import DniDialog from '@/components/dialogs/dni-dialog';
import { getCurrentStatus } from '@/lib/get-current-status';
import { cn } from '@/lib/utils';
import { ButtonBack } from '@/components/ui/button-back';

const LoadingSkeleton = () => (
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

const ErrorMessage = ({ message }: { message: string }) => (
  <div className='container mx-auto py-8'>
    <div className='text-center'>
      <h1 className='text-2xl font-bold text-red-600 mb-2'>Error</h1>
      <p className='text-gray-600'>{message}</p>
    </div>
  </div>
);

const DemandBadge = ({ demandLevel }: { demandLevel: string }) => (
  <span
    className={cn(
      'text-sm font-bold px-3 py-1 rounded-full',
      demandLevel === 'Baja' && 'bg-green-100 text-green-800',
      demandLevel === 'Media' && 'bg-yellow-100 text-yellow-800',
      demandLevel === 'Alta' && 'bg-red-100 text-red-800',
    )}
  >
    {demandLevel}
  </span>
);

const DemandBar = ({ demandLevel }: { demandLevel: string }) => (
  <div className='w-full bg-gray-200 rounded-full h-3 overflow-hidden'>
    <div
      className={cn(
        'h-full rounded-full transition-all duration-1000 ease-out',
        demandLevel === 'Baja' &&
          'bg-gradient-to-r from-green-400 to-green-500 w-1/3',
        demandLevel === 'Media' &&
          'bg-gradient-to-r from-yellow-400 to-yellow-500 w-2/3',
        demandLevel === 'Alta' &&
          'bg-gradient-to-r from-red-400 to-red-500 w-full',
      )}
    ></div>
  </div>
);

const QueueStatusBadge = ({ isActive }: { isActive: boolean }) => (
  <span
    className={cn(
      'inline-flex items-center px-3 py-1 rounded-full text-xs font-medium transition-all duration-300',
      isActive
        ? 'bg-success/10 text-success'
        : 'bg-destructive/10 text-destructive',
    )}
  >
    {isActive ? (
      <div className='relative w-2 h-2 mr-2'>
        <div className='absolute inset-0 w-2 h-2 bg-success rounded-full animate-ping opacity-75'></div>
        <div className='relative w-2 h-2 bg-success rounded-full'></div>
      </div>
    ) : (
      <span className='w-2 h-2 rounded-full mr-2 bg-destructive'></span>
    )}
    {isActive ? 'En línea' : 'Cerrado'}
  </span>
);

const QueueMetrics = ({
  currentPeopleInQueue,
  isActive,
  estimatedWaitTimeMinutes,
}: {
  currentPeopleInQueue: number;
  isActive: boolean;
  estimatedWaitTimeMinutes: number;
}) => (
  <div className='flex-1 flex justify-center'>
    <div className='text-center space-y-3'>
      <div className='relative'>
        <p className='font-black text-5xl text-primary mb-1'>
          {currentPeopleInQueue}
        </p>
      </div>
      <p className='text-gray-600 font-medium'>
        {currentPeopleInQueue === 1
          ? 'Persona esperando'
          : 'Personas esperando'}
      </p>
      <div className='flex items-center justify-center gap-2 p-3 bg-white rounded-xl shadow-sm border '>
        <p className={cn('text-sm font-semibold text-primary')}>
          {isActive ? ` ⏱️ ~ ${estimatedWaitTimeMinutes} min` : '🔒 Cerrado'}
        </p>
      </div>
    </div>
  </div>
);

export default function ServicesPage() {
  const params = useParams();
  const businessSlug = params.businessSlug as string;
  const branchSlug = params.branchSlug as string;
  const queueId = params.queueId as string;

  const {
    companies,
    loading: loadingCompany,
    error: errorCompany,
    findCompanyById,
  } = useCompanies();
  const { loadingQueues, errorQueues, getQueueById } = useQueues(branchSlug);

  const queue = getQueueById(queueId);

  if (loadingCompany || loadingQueues) return <LoadingSkeleton />;
  if (errorCompany) return <ErrorMessage message={errorCompany} />;
  if (errorQueues) return <ErrorMessage message={errorQueues} />;

  const company = findCompanyById(businessSlug);
  if (!company) notFound();
  if (!queue) return <ErrorMessage message='Cola no encontrada' />;

  const companyStatus = company.isActive
    ? SiteStatus.AVAILABLE
    : SiteStatus.CLOSED;

  return (
    <>
      <CompanyHeader
        company={company}
        status={getCurrentStatus(companyStatus)}
      />

      <section className='px-4 py-5 flex flex-col gap-6 container max-w-[600px] mx-auto'>
        <div className='text-center space-y-4 mb-6'>
          <div className='relative'>
            <h1 className='text-2xl font-bold text-heading-foreground mb-2'>
              {queue.name}
            </h1>
            <p className='text-muted-foreground text-sm max-w-sm mx-auto leading-relaxed mb-4'>
              {queue.description}
            </p>
            <div className='flex justify-center gap-2 mb-2'>
              <QueueStatusBadge isActive={queue.isActive} />
            </div>
          </div>
        </div>

        <div className='bg-gradient-to-br from-white to-gray-50 border border-gray-200 rounded-2xl p-6 shadow-lg backdrop-blur-sm'>
          <div className='flex items-center justify-between mb-6'>
            <QueueMetrics
              currentPeopleInQueue={queue.currentPeopleInQueue}
              isActive={queue.isActive}
              estimatedWaitTimeMinutes={queue.estimatedWaitTimeMinutes}
            />
          </div>

          <div className='space-y-3 mb-6'>
            <div className='flex justify-between items-center'>
              <span className='text-sm font-medium text-gray-600'>
                Nivel de demanda
              </span>
              <DemandBadge demandLevel={queue.demandLevel} />
            </div>
            <DemandBar demandLevel={queue.demandLevel} />
          </div>

          {queue.isActive ? (
            <div className='relative'>
              <div className='absolute inset-0 bg-gradient-to-r from-primary to-blue-600 rounded-xl blur opacity-25'></div>
              <div className='relative'>
                <DniDialog queueId={queueId} />
              </div>
            </div>
          ) : (
            <div className='text-center p-6 bg-gray-50 rounded-xl border-2 border-dashed border-gray-300'>
              <p className='text-gray-500 font-medium'>
                🔒 Esta cola está temporalmente cerrada
              </p>
              <p className='text-sm text-gray-400 mt-1'>Inténtalo más tarde</p>
            </div>
          )}
        </div>

        <Separator />

        <div className='text-start'>
          <ButtonBack
            href={`/user/business/${businessSlug}/branch/${branchSlug}`}
            variant='secondary'
          />
        </div>
      </section>
    </>
  );
}
