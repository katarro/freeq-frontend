import { cn } from '@/lib/utils';

export function TicketsTabs({
  activeTab,
  setActiveTab,
  currentCount,
  historyCount,
  loadingHistory,
}: Readonly<{
  activeTab: 'current' | 'history';
  setActiveTab: (tab: 'current' | 'history') => void;
  currentCount: number;
  historyCount: number;
  loadingHistory?: boolean;
}>) {
  return (
    <div className='flex bg-muted/50 rounded-lg p-1 mb-6 overflow-hidden'>
      <button
        onClick={() => setActiveTab('current')}
        className={cn(
          'flex-1 py-2 px-2 sm:px-4 rounded-md text-xs sm:text-sm font-medium transition-colors',
          activeTab === 'current'
            ? 'bg-background text-foreground shadow-sm'
            : 'text-muted-foreground hover:text-foreground',
        )}
      >
        <span className='hidden sm:inline'>Actuales ({currentCount})</span>
        <span className='sm:hidden'>Actuales ({currentCount})</span>
      </button>
      <button
        onClick={() => setActiveTab('history')}
        className={cn(
          'flex-1 py-2 px-2 sm:px-4 rounded-md text-xs sm:text-sm font-medium transition-colors',
          activeTab === 'history'
            ? 'bg-background text-foreground shadow-sm'
            : 'text-muted-foreground hover:text-foreground',
        )}
      >
        <span className='hidden sm:inline'>
          Historial ({loadingHistory ? '...' : historyCount})
        </span>
        <span className='sm:hidden'>
          Historial ({loadingHistory ? '...' : historyCount})
        </span>
      </button>
    </div>
  );
}
