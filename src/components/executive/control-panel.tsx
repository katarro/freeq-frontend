import { Play, UserX, CheckCircle, Timer, Check, X } from 'lucide-react';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '../ui/card';
import { Button } from '../ui/button';
import { OperatorTicketStatus } from '@/types/ticket';
import { Badge } from '../ui/badge';

export function ControlPanel({
  ticketStatus,
  pendingAction,
  isLoading,
  handleNext,
  handleAbsent,
  handleCompleted,
}: Readonly<{
  ticketStatus: OperatorTicketStatus;
  pendingAction: 'absent' | 'completed' | null;
  isLoading?: boolean;
  handleNext: () => void;
  handleAbsent: () => void;
  handleCompleted: () => void;
}>) {
  // Lógica para determinar si hay un cliente llamado esperando ser marcado
  const isClientCalled =
    ticketStatus.status === 'CALLED' && ticketStatus.currentClient;

  // Determinar si el botón "Siguiente" debe estar habilitado
  const isNextButtonEnabled = () => {
    if (isLoading) return false;

    // Si no hay cliente, puede llamar al primero
    if (!isClientCalled) return ticketStatus.canTakeNext;

    // Si hay cliente llamado, debe seleccionar una acción primero
    return !!pendingAction;
  };

  // Determinar el texto del botón "Siguiente"
  const getNextButtonText = () => {
    if (isLoading) return 'Procesando...';

    if (!isClientCalled) {
      return 'Siguiente'; // Primer ticket
    }

    if (pendingAction) {
      return 'Siguiente'; // Completar + llamar siguiente
    }

    return 'Atendiendo';
  };

  return (
    <Card>
      <CardHeader className='pb-6'>
        <CardTitle className='text-2xl'>Control de Atención</CardTitle>
        <CardDescription className='text-lg'>
          {ticketStatus.currentClient
            ? `${isClientCalled ? 'Cliente llamado: ' : 'Atendiendo: '}${ticketStatus.currentClient}`
            : 'Sin cliente en atención'}
        </CardDescription>
      </CardHeader>
      <CardContent className='space-y-6'>
        <div className='flex flex-col space-y-4'>
          <Button
            onClick={handleNext}
            disabled={!isNextButtonEnabled()}
            className={`h-16 text-lg font-semibold ${
              pendingAction
                ? 'bg-primary hover:bg-primary/90 text-primary-foreground'
                : ''
            } ${isLoading ? 'opacity-75' : ''}`}
          >
            <Play className='h-6 w-6 mr-3' />
            {getNextButtonText()}
          </Button>
          <div className='grid grid-cols-2 gap-4'>
            <Button
              onClick={handleAbsent}
              disabled={!isClientCalled || pendingAction === 'completed'}
              variant='outline'
              className={`w-full relative h-16 text-lg font-semibold ${
                pendingAction === 'absent'
                  ? 'bg-destructive/20 text-destructive-foreground/50 border-destructive/10 hover:bg-destructive/30'
                  : pendingAction === 'completed'
                    ? 'opacity-50 cursor-not-allowed'
                    : 'hover:bg-destructive/10 hover:border-destructive hover:text-destructive'
              }`}
            >
              <>
                <UserX className='h-6 w-6 mr-3' />
                <span>Ausente</span>
              </>
            </Button>
            <Button
              onClick={handleCompleted}
              disabled={!isClientCalled || pendingAction === 'absent'}
              variant='outline'
              className={`w-full relative h-16 text-lg font-semibold ${
                pendingAction === 'completed'
                  ? 'bg-success text-white border-success hover:bg-success/90'
                  : pendingAction === 'absent'
                    ? 'opacity-50 cursor-not-allowed'
                    : 'hover:bg-success/10 hover:border-success hover:text-success'
              }`}
            >
              <>
                <CheckCircle className='h-6 w-6 mr-3' />
                <span>Completado</span>
              </>
            </Button>
          </div>
        </div>
        {isClientCalled && !pendingAction && (
          <div className='p-4 bg-warning/10 rounded-lg border border-warning/30'>
            <p className='text-base text-warning font-medium'>
              Debe marcar como Completado o Ausente antes de atender el
              siguiente cliente
            </p>
          </div>
        )}
        {pendingAction && isClientCalled && (
          <div
            className={`p-4 rounded-lg border ${
              pendingAction === 'absent'
                ? 'bg-destructive/10 border-destructive/30'
                : 'bg-success/10 border-success/30'
            }`}
          >
            <div className='flex items-center'>
              {pendingAction === 'absent' ? (
                <X className='h-5 w-5 mr-3 text-destructive' />
              ) : (
                <Check className='h-5 w-5 mr-3 text-success' />
              )}
              <p
                className={`text-base font-medium ${
                  pendingAction === 'absent'
                    ? 'text-destructive'
                    : 'text-success'
                }`}
              >
                Cliente será marcado como "
                {pendingAction === 'absent' ? 'Ausente' : 'Completado'}"
              </p>
            </div>
          </div>
        )}
        {ticketStatus.currentClient && (
          <div className='p-5 bg-muted rounded-lg'>
            <div className='flex items-center justify-between mb-3'>
              <span className='font-medium text-lg'>Cliente Actual:</span>
              <Badge
                className={`text-base px-3 py-1 ${
                  isClientCalled
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-secondary text-secondary-foreground'
                }`}
              >
                {ticketStatus.currentClient}
              </Badge>
            </div>
            <div className='flex items-center justify-between'>
              <span className='text-base text-muted-foreground'>
                Tiempo transcurrido:
              </span>
              <div className='flex items-center'>
                <Timer className='h-5 w-5 mr-2' />
                <span className='text-base font-mono'>2:15</span>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
