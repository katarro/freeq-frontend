import { cn } from '@/lib/utils';

export function TicketsHeader({
  onRefresh,
  loading,
}: Readonly<{
  onRefresh: () => void;
  loading: boolean;
}>) {
  return (
    <section className='bg-gradient-to-bl from-secondary to-primary p-6'>
      <div className='container max-w-4xl mx-auto'>
        <div className='flex items-center justify-between'>
          <div className='text-center flex-1'>
            <h1 className='text-2xl font-semibold text-primary-foreground'>
              Mis Turnos
            </h1>
          </div>
          <button
            onClick={onRefresh}
            disabled={loading}
            className='text-primary-foreground/80 hover:text-primary-foreground transition-colors p-2'
          >
            <svg
              className={cn('w-5 h-5', loading && 'animate-spin')}
              fill='none'
              stroke='currentColor'
              viewBox='0 0 24 24'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15'
              />
            </svg>
          </button>
        </div>
      </div>
    </section>
  );
}
