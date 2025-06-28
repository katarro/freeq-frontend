import { STATUS_BADGE } from '@/services/tickets';
import { TicketStatus } from '@/types/ticket';
import { Badge } from 'lucide-react';

export function StatusBadge({ status }: { status: TicketStatus }) {
  const statusConfig = STATUS_BADGE[status];
  if (!statusConfig) {
    return <Badge className="bg-gray-500/10 text-gray-600">Desconocido</Badge>;
  }
  return <Badge className={statusConfig.className}>{statusConfig.label}</Badge>;
}
