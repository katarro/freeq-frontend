'use client';

import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { useTickets } from '@/hooks/use-tickets';
import { useState, useMemo, useCallback, useEffect } from 'react';
import CancelTicketDialog from '@/components/dialogs/cancel-ticket-dialog';
import { Ticket, TicketStatus } from '@/types/ticket';
import { TicketCard } from '@/components/tickets/ticket-card';
import { EmptyState } from '@/components/tickets/empty-state';
import { TicketsHeader } from '@/components/tickets/tickets-header';
import { SSEStatus } from '@/components/sse/sse-status';
import { STATUS_BADGE } from '@/services/tickets';

function StatusBadge({ status }: { status: TicketStatus }) {
  const statusConfig = STATUS_BADGE[status];
  if (!statusConfig) {
    return <Badge className='bg-gray-500/10 text-gray-600'>Desconocido</Badge>;
  }
  return <Badge className={statusConfig.className}>{statusConfig.label}</Badge>;
}

function TicketsTabs({
  activeTab,
  setActiveTab,
  currentCount,
  historyCount,
  loadingHistory,
}: {
  activeTab: 'current' | 'history';
  setActiveTab: (tab: 'current' | 'history') => void;
  currentCount: number;
  historyCount: number;
  loadingHistory?: boolean;
}) {
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

function TicketsList({
  tickets,
  isHistory,
  onCancel,
  loading,
  isSSEConnected,
  activeTicketId,
}: {
  tickets: Ticket[];
  isHistory: boolean;
  onCancel?: (ticket: Ticket) => void;
  loading?: boolean;
  isSSEConnected?: boolean;
  activeTicketId?: string;
}) {
  if (loading) {
    return (
      <div className='space-y-4'>
        {[1, 2, 3].map((i) => (
          <div key={i} className='animate-pulse'>
            <div className='bg-gray-200 rounded-lg h-24'></div>
          </div>
        ))}
      </div>
    );
  }

  if (tickets.length === 0) {
    return <EmptyState isHistory={isHistory} />;
  }

  return (
    <>
      {tickets.map((ticket) => (
        <TicketCard
          key={ticket.id}
          shift={ticket}
          onCancel={onCancel}
          isHistory={isHistory}
        />
      ))}
    </>
  );
}

function TicketsError({
  error,
  onClear,
}: {
  error: string | null;
  onClear: () => void;
}) {
  if (!error) return null;
  return (
    <div className='bg-red-50 border border-red-200 rounded-lg p-4 mb-6'>
      <div className='flex items-center justify-between'>
        <p className='text-sm text-red-600'>{error}</p>
        <button onClick={onClear} className='text-red-400 hover:text-red-600'>
          ✕
        </button>
      </div>
    </div>
  );
}

export default function MyTicketsPage() {
  const [activeTab, setActiveTab] = useState<'current' | 'history'>('current');
  const [historyTicketsData, setHistoryTicketsData] = useState<Ticket[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [cancelDialog, setCancelDialog] = useState<{
    isOpen: boolean;
    shift: Ticket | null;
  }>({ isOpen: false, shift: null });

  const {
    tickets,
    loadingTickets,
    errorTickets,
    getTicketActives,
    clearError,
    cancelTicket,
    historyTickets,
    // SSE related
    isSSEConnected,
    sseConnectionError,
    activeTicket,
  } = useTickets();

  // Filtrar tickets actuales (solo tickets activos)
  const currentTickets = useMemo(
    () =>
      tickets.filter(
        (t) =>
          t.status === 'WAITING' ||
          t.status === 'CALLED' ||
          t.status === 'ATTENDING',
      ),
    [tickets],
  );

  // Función para cargar historial
  const loadHistoryTickets = useCallback(async () => {
    if (historyTicketsData.length > 0) return;

    try {
      setLoadingHistory(true);
      const historyData = await historyTickets();
      setHistoryTicketsData(historyData);
    } catch (error) {
      console.error('Error cargando historial:', error);
    } finally {
      setLoadingHistory(false);
    }
  }, [historyTickets, historyTicketsData.length]);

  // Cargar historial cuando se cambia a la pestaña
  useEffect(() => {
    if (activeTab === 'history') {
      loadHistoryTickets();
    }
  }, [activeTab, loadHistoryTickets]);

  const handleCancelTicket = useCallback(
    (ticketId: string) => {
      cancelTicket(ticketId);
      console.log('Cancelando ticket:', ticketId);
    },
    [cancelTicket],
  );

  const openCancelDialog = useCallback((ticket: Ticket) => {
    setCancelDialog({ isOpen: true, shift: ticket });
  }, []);

  const closeCancelDialog = useCallback(() => {
    setCancelDialog({ isOpen: false, shift: null });
  }, []);

  const confirmCancelShift = useCallback(() => {
    if (cancelDialog.shift) {
      handleCancelTicket(cancelDialog.shift.id);
      closeCancelDialog();
    }
  }, [cancelDialog.shift, handleCancelTicket, closeCancelDialog]);

  const handleRefresh = useCallback(async () => {
    try {
      clearError();
      if (activeTab === 'current') {
        await getTicketActives();
      } else {
        setHistoryTicketsData([]);
        await loadHistoryTickets();
      }
    } catch (error) {
      console.error('Error refreshing tickets:', error);
    }
  }, [getTicketActives, clearError, activeTab, loadHistoryTickets]);

  return (
    <div className='min-h-screen bg-background'>
      <TicketsHeader
        onRefresh={handleRefresh}
        loading={loadingTickets || loadingHistory}
      />
      <div className='container max-w-[600px] mx-auto px-4 py-6'>
        <TicketsError error={errorTickets} onClear={clearError} />

        {/* Mostrar estado SSE si hay ticket activo */}
        {activeTicket && (
          <div className='mb-4'>
            <SSEStatus
              isConnected={isSSEConnected}
              error={sseConnectionError}
              activeTicket={activeTicket}
            />
          </div>
        )}

        <TicketsTabs
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          currentCount={currentTickets.length}
          historyCount={historyTicketsData.length}
          loadingHistory={loadingHistory}
        />
        <div className='space-y-4'>
          {activeTab === 'current' ? (
            <TicketsList
              tickets={currentTickets}
              isHistory={false}
              onCancel={openCancelDialog}
              loading={loadingTickets}
              isSSEConnected={isSSEConnected}
              activeTicketId={activeTicket?.id}
            />
          ) : (
            <TicketsList
              tickets={historyTicketsData}
              isHistory={true}
              loading={loadingHistory}
            />
          )}
        </div>
      </div>
      {cancelDialog.shift && (
        <CancelTicketDialog
          open={cancelDialog.isOpen}
          onOpenChange={closeCancelDialog}
          onConfirm={confirmCancelShift}
          ticketNumber={cancelDialog.shift.ticketNumber}
          serviceName={
            cancelDialog.shift.queue?.serviceType?.name ||
            cancelDialog.shift.serviceModuleId
          }
          siteName={
            cancelDialog.shift.queue?.branch?.name || 'Sucursal Principal'
          }
        />
      )}
    </div>
  );
}
