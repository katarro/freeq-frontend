import { EmptyState } from '@/components/tickets/empty-state';
import { TicketCard } from '@/components/tickets/ticket-card';
import { Ticket } from '@/types/ticket';

export function TicketsList({
  tickets,
  isHistory,
  onCancel,
  loading,
  isSSEConnected,
  activeTicketId,
  onTicketCompleted,
  onTicketWaitingSurvey,
}: {
  tickets: Ticket[];
  isHistory: boolean;
  onCancel?: (ticket: Ticket) => void;
  loading?: boolean;
  isSSEConnected?: boolean;
  activeTicketId?: string;
  onTicketCompleted?: (ticketId: string) => void;
  onTicketWaitingSurvey?: (ticketId: string) => void; // 🆕 AGREGAR
}) {
  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="animate-pulse">
            <div className="bg-gray-200 rounded-lg h-24"></div>
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
          onTicketCompleted={onTicketCompleted}
          onTicketWaitingSurvey={onTicketWaitingSurvey}
        />
      ))}
    </>
  );
}
