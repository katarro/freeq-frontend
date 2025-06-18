import { TicketStatus } from '@/types/ticket';

export const STATUS_LABELS: Record<
  TicketStatus,
  { label: string; className: string }
> = {
  WAITING: {
    label: 'En espera',
    className: 'bg-warning/10 text-warning border-warning/20',
  },
  CALLED: {
    label: 'Llamado',
    className: 'bg-primary/10 text-primary border-primary/20',
  },
  ATTENDING: {
    label: 'En atención',
    className: 'bg-secondary/10 text-secondary border-secondary/20',
  },
  COMPLETED: {
    label: 'Completado',
    className: 'bg-success/10 text-success border-success/20',
  },
  ABSENT: {
    label: 'Ausente',
    className: 'bg-destructive/10 text-destructive border-destructive/20',
  },
  POSTPONED: {
    label: 'Pospuesto',
    className: 'bg-muted text-muted-foreground border-border',
  },
  CANCELLED: {
    label: 'Cancelado',
    className: 'bg-red-500/10 text-red-600 hover:bg-red-500/20',
  },
};

export const STATUS_BADGE: Record<
  TicketStatus,
  { label: string; className: string }
> = {
  WAITING: {
    label: 'En espera',
    className: 'bg-warning/10 text-warning hover:bg-warning/20',
  },
  CALLED: {
    label: 'Llamado',
    className: 'bg-blue-500/10 text-blue-600 hover:bg-blue-500/20',
  },
  ATTENDING: {
    label: 'En atención',
    className: 'bg-blue-500/10 text-blue-600 hover:bg-blue-500/20',
  },
  COMPLETED: {
    label: 'Completado',
    className: 'bg-success/10 text-success hover:bg-success/20',
  },
  ABSENT: {
    label: 'Ausente',
    className: 'bg-destructive/10 text-destructive hover:bg-destructive/20',
  },
  POSTPONED: {
    label: 'Pospuesto',
    className: 'bg-gray-500/10 text-gray-600 hover:bg-gray-500/20',
  },
  CANCELLED: {
    label: 'Cancelado',
    className: 'bg-red-500/10 text-red-600 hover:bg-red-500/20',
  },
};
