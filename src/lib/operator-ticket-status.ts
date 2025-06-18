import { OperatorTicketStatus, TicketStatus } from '@/types/ticket';

const STATUS_TEXT: Record<TicketStatus, string> = {
  WAITING: 'En espera',
  CALLED: 'Llamado',
  ATTENDING: 'Atendiendo',
  COMPLETED: 'Completado',
  ABSENT: 'Ausente',
  POSTPONED: 'Postergado',
  CANCELLED: 'Cancelado',
};

const STATUS_COLOR: Record<TicketStatus, string> = {
  WAITING: 'text-muted-foreground',
  CALLED: 'text-info',
  ATTENDING: 'text-success',
  COMPLETED: 'text-success',
  ABSENT: 'text-destructive',
  POSTPONED: 'text-warning',
  CANCELLED: 'text-muted-foreground',
};

export function getStatusText(ticketStatus: OperatorTicketStatus) {
  if (ticketStatus.status === 'CALLED' && ticketStatus.currentClient)
    return 'Cliente llamado';
  if (ticketStatus.status === 'ATTENDING' && ticketStatus.currentClient)
    return 'Atendiendo';
  return STATUS_TEXT[ticketStatus.status];
}

export function getStatusColor(ticketStatus: OperatorTicketStatus) {
  if (ticketStatus.status === 'CALLED' && ticketStatus.currentClient)
    return 'text-blue-600';
  if (ticketStatus.status === 'ATTENDING' && ticketStatus.currentClient)
    return 'text-warning';
  return STATUS_COLOR[ticketStatus.status];
}
