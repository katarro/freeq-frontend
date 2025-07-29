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

  // ✅ ESTADO PARA TICKETS ESPERANDO ENCUESTA
  const [ticketsWaitingSurvey, setTicketsWaitingSurvey] = useState<Set<string>>(new Set());

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

  // Filtrar tickets actuales (incluyendo tickets esperando encuesta)
  const currentTickets = useMemo(() => {
    const activeTickets = tickets.filter(
      (t) => t.status === 'WAITING' || t.status === 'CALLED' || t.status === 'ATTENDING',
    );

    // ✅ INCLUIR TICKETS QUE ESTÁN ESPERANDO ENCUESTA
    const ticketsWithSurvey = tickets.filter((t) => ticketsWaitingSurvey.has(t.id));

    // Combinar y eliminar duplicados
    const allTickets = [...activeTickets, ...ticketsWithSurvey];
    const uniqueTickets = allTickets.filter(
      (ticket, index, self) => index === self.findIndex((t) => t.id === ticket.id),
    );

    return uniqueTickets;
  }, [tickets, ticketsWaitingSurvey]);

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

  // Agregar después de las otras funciones useCallback:

  // 🆕 AGREGAR: Función para manejar ticket completado
  // ✅ FUNCIÓN: Marcar ticket como esperando encuesta
  const handleTicketWaitingSurvey = useCallback((ticketId: string) => {
    console.log('⏳ Ticket marcado como esperando encuesta:', ticketId);
    setTicketsWaitingSurvey((prev) => {
      const newSet = new Set(prev);
      newSet.add(ticketId);
      return newSet;
    });
  }, []);

  // ✅ FUNCIÓN: Manejar ticket completado (encuesta terminada)
  const handleTicketCompleted = useCallback(
    async (ticketId: string) => {
      console.log('🔄 Ticket completado, refrescando lista inmediatamente:', ticketId);

      try {
        // ✅ REFRESCAR INMEDIATAMENTE - La encuesta ya se completó o se cerró
        console.log('🔄 Refrescando lista después de encuesta completada:', ticketId);

        // Remover el ticket de la lista de espera de encuesta
        setTicketsWaitingSurvey((prev) => {
          const newSet = new Set(prev);
          newSet.delete(ticketId);
          return newSet;
        });

        // Refrescar tickets activos para remover el completado
        await getTicketActives();

        // Si estamos en la pestaña de historial, también refrescar historial
        if (activeTab === 'history') {
          setHistoryTicketsData([]);
          await loadHistoryTickets();
        }
      } catch (error) {
        console.error('Error refrescando después de ticket completado:', error);
      }
    },
    [getTicketActives, activeTab, loadHistoryTickets],
  );

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
              onTicketCompleted={handleTicketCompleted}
              onTicketWaitingSurvey={handleTicketWaitingSurvey}
            />
          ) : (
            <TicketsList
              tickets={historyTicketsData}
              isHistory={true}
              loading={loadingHistory}
              onTicketCompleted={handleTicketCompleted}
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
            cancelDialog.shift.queue?.serviceType?.name || cancelDialog.shift.serviceModuleId
          }
          siteName={cancelDialog.shift.queue?.branch?.name || 'Sucursal Principal'}
        />
      )}
    </div>
  );
}
