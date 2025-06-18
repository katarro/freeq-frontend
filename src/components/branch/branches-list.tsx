import { cn } from '@/lib/utils';
import Link from 'next/link';

export function BranchesList({
  branches,
  loading,
  error,
  slug,
}: Readonly<{
  branches: any[];
  loading: boolean;
  error: string | null;
  slug: string;
}>) {
  if (loading) {
    return (
      <div className='grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-4'>
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className='border border-border rounded-lg p-4 animate-pulse'
          >
            <div className='flex items-center justify-between'>
              <div className='flex-1'>
                <div className='h-5 bg-gray-200 rounded w-32 mb-2'></div>
                <div className='h-4 bg-gray-200 rounded w-48'></div>
              </div>
              <div className='h-6 bg-gray-200 rounded w-20'></div>
            </div>
          </div>
        ))}
      </div>
    );
  }
  if (error) {
    return (
      <div className='text-center py-8'>
        <p className='text-red-600 mb-2'>Error al cargar sucursales</p>
        <p className='text-sm text-gray-500'>{error}</p>
      </div>
    );
  }
  if (branches && branches.length > 0) {
    return (
      <div className='grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4'>
        {branches.map((branch) => (
          <Link
            key={branch.id}
            href={`/user/business/${slug}/branch/${branch.id}`}
            className={cn(
              'block border border-border rounded-lg p-4 hover:shadow-md transition-shadow',
              !branch.isActive && 'opacity-60 pointer-events-none',
            )}
          >
            <div className='flex items-center justify-between'>
              <div className='flex-1'>
                <h3 className='font-medium text-heading-foreground mb-1'>
                  {branch.name}
                </h3>
                <div className='flex items-center gap-4 text-sm text-muted-foreground'>
                  <span className='flex items-center gap-1'>
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
                        d='M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z'
                      />
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        strokeWidth={2}
                        d='M15 11a3 3 0 11-6 0 3 3 0 016 0z'
                      />
                    </svg>
                    {branch.address}
                  </span>
                  {branch.phone && (
                    <span className='flex items-center gap-1'>
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
                          d='M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z'
                        />
                      </svg>
                      {branch.phone}
                    </span>
                  )}
                </div>
              </div>
              <div className='text-right'>
                <span
                  className={cn(
                    'inline-flex items-center px-2 py-1 rounded-full text-xs font-medium',
                    branch.isActive
                      ? 'bg-success/10 text-success'
                      : 'bg-destructive/10 text-destructive',
                  )}
                >
                  {branch.isActive ? 'Abierto' : 'Cerrado'}
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    );
  }
  return (
    <div className='text-center py-8'>
      <p className='text-gray-600'>
        No hay sucursales disponibles para esta empresa.
      </p>
      <p className='text-sm text-gray-500 mt-2'>
        Inténtalo de nuevo más tarde.
      </p>
    </div>
  );
}
