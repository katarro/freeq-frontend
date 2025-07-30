import { useWaitTime } from '@/hooks/use-wait-time';
import { Ticket } from '@/types/ticket';
import { Calendar, Clock, User } from 'lucide-react';

export function InfoGrid({
  isHistory,
  shift,
  createdAt,
}: {
  readonly isHistory?: boolean;
  readonly shift: Ticket;
  readonly createdAt: string;
}) {
  function formatDate(dateString: string) {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-CL', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  }

  const { waitTime } = useWaitTime(shift.queueId, shift.id);

  return (
    <div className="grid gap-3 sm:gap-4 text-sm">
      {!isHistory && (
        <div className="flex items-center gap-3 p-3 rounded-lg bg-primary/5 border border-primary/10">
          <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
            <Clock className="w-4 h-4 text-primary" />
          </div>
          <div>
            <p className="text-xs text-primary/70 font-medium">Tiempo estimado</p>
            <p className="font-bold text-primary">{waitTime} minutos</p>
          </div>
        </div>
      )}

      <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50 border border-border">
        <div className="w-8 h-8 rounded-lg bg-muted-foreground/10 flex items-center justify-center flex-shrink-0">
          <Calendar className="w-4 h-4 text-muted-foreground" />
        </div>
        <div>
          <p className="text-xs text-muted-foreground font-medium">Fecha de solicitud</p>
          <p className="font-semibold text-foreground text-xs sm:text-sm">
            {formatDate(createdAt)}
          </p>
        </div>
      </div>

      {/* Mostrar ejecutivo que atendió (solo en historial y si existe) */}
      {isHistory && shift.executiveName && (
        <div className="flex items-center gap-3 p-3 rounded-lg bg-secondary/5 border border-secondary/10">
          <div className="w-8 h-8 rounded-lg bg-secondary/10 flex items-center justify-center flex-shrink-0">
            <User className="w-4 h-4 text-secondary" />
          </div>
          <div>
            <p className="text-xs text-secondary/70 font-medium">Atendido por</p>
            <p className="font-semibold text-secondary text-xs sm:text-sm">{shift.executiveName}</p>
          </div>
        </div>
      )}
    </div>
  );
}
