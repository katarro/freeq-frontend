import { cn } from '@/lib/utils';
import { Company } from '@/types/company';
import { Queue } from '@/types/queue';
import Link from 'next/link';
import { useParams } from 'next/navigation';

interface ServicesListProps {
  readonly company: Company;
  readonly queues: Queue[];
}

export function QueueList({ company, queues }: ServicesListProps) {
  const params = useParams();
  const businessSlug = params.businessSlug as string;
  const branchSlug = params.branchSlug as string;
  // RETORNAR SI ESTA ACTIVA O NO
  return (
    <>
      {company.isActive ? (
        <div className='grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4'>
          {queues.map((queue) => (
            <Link
              key={queue.id}
              href={`/user/business/${businessSlug}/branch/${branchSlug}/service/${queue.id}`}
              className={cn(
                'block border border-border rounded-lg overflow-hidden hover:shadow-md transition-shadow',
                queue.isActive === false && 'opacity-60 pointer-events-none',
              )}
            >
              {/* Card Body */}
              <div className='p-4'>
                <div className='flex items-start justify-between mb-3'>
                  <div className='flex-1'>
                    <h3 className='font-medium text-heading-foreground mb-1'>
                      {queue.name}
                    </h3>
                    <p className='text-xs text-muted-foreground'>
                      {queue.description}
                    </p>
                  </div>
                  <div className='text-left'>
                    <div className='relative'>
                      {queue.isActive && (
                        <div className='absolute -top-1 -right-1 w-3 h-3'>
                          <div className='absolute inset-0 w-3 h-3 bg-green-400 rounded-full animate-ping opacity-75'></div>
                          <div className='relative w-3 h-3 bg-green-500 rounded-full'></div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Métricas principales */}
                <div className='flex items-center justify-between'>
                  <div className='flex items-center gap-1 text-sm text-muted-foreground'>
                    <svg
                      className='w-4 h-4'
                      fill='none'
                      stroke='currentColor'
                      viewBox='0 0 24 24'
                    >
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        strokeWidth={2}
                        d='M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z'
                      />
                    </svg>
                    <span>{queue.currentPeopleInQueue} en cola</span>
                  </div>

                  {queue.isActive && (
                    <div className='flex items-center gap-1 text-sm font-medium text-primary'>
                      <svg
                        className='w-4 h-4'
                        fill='none'
                        stroke='currentColor'
                        viewBox='0 0 24 24'
                      >
                        <path
                          strokeLinecap='round'
                          strokeLinejoin='round'
                          strokeWidth={2}
                          d='M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z'
                        />
                      </svg>
                      <span>~{queue.estimatedWaitTimeMinutes} min</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Card Footer con indicador de demanda */}
              <div
                data-slot='card-footer'
                className={cn(
                  'flex items-center px-4 py-3 justify-center border-t border-t-border',
                  // Colores según demanda
                  queue.demandLevel === 'Baja' && 'bg-green-50 text-green-700',
                  queue.demandLevel === 'Media' &&
                    'bg-yellow-50 text-yellow-700',
                  queue.demandLevel === 'Alta' && 'bg-red-50 text-red-700',
                  !queue.isActive && 'bg-gray-50 text-gray-500',
                )}
              >
                <div className='flex items-center gap-2'>
                  {/* Indicador visual de demanda */}
                  <div
                    className={cn(
                      'w-2 h-2 rounded-full',
                      queue.demandLevel === 'Baja' && 'bg-green-500',
                      queue.demandLevel === 'Media' && 'bg-yellow-500',
                      queue.demandLevel === 'Alta' && 'bg-red-500',
                      !queue.isActive && 'bg-gray-400',
                    )}
                  />
                  <p className='text-sm font-medium'>
                    {queue.isActive
                      ? `Demanda ${queue.demandLevel.toLowerCase()}`
                      : 'No disponible'}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className='text-center py-8'>
          <p className='text-gray-600'>
            Esta empresa está cerrada actualmente.
          </p>
          <p className='text-sm text-gray-500 mt-2'>
            Los servicios no están disponibles.
          </p>
        </div>
      )}
    </>
  );
}
