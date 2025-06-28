'use client';

import { Ticket } from '@/types/ticket';
import { useTickets } from '@/hooks/use-tickets';
import { useState, useMemo, useCallback, useEffect } from 'react';
import CancelTicketDialog from '@/components/dialogs/cancel-ticket-dialog';
import { TicketsHeader } from '@/components/tickets/tickets-header';
import { SSEStatus } from '@/components/sse/sse-status';
import { TicketsError } from '@/components/user/tickets/tickets-error';
import { TicketsList } from '@/components/user/tickets/tickets-list';
import { TicketsTabs } from '@/components/user/tickets/tickets-tabs';

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
        (t) => t.status === 'WAITING' || t.status === 'CALLED' || t.status === 'ATTENDING',
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
    <div className="min-h-screen bg-background">
      <TicketsHeader onRefresh={handleRefresh} loading={loadingTickets || loadingHistory} />
      <div className="container max-w-[600px] mx-auto px-4 py-6">
        <TicketsError error={errorTickets} onClear={clearError} />

        {/* Mostrar estado SSE si hay ticket activo */}
        {activeTicket && (
          <div className="mb-4">
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
        <div className="space-y-4">
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
            <TicketsList tickets={historyTicketsData} isHistory={true} loading={loadingHistory} />
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
            cancelDialog.shift.queue?.serviceType?.name || cancelDialog.shift.serviceModuleId
          }
          siteName={cancelDialog.shift.queue?.branch?.name || 'Sucursal Principal'}
        />
      )}
    </div>
  );
}
