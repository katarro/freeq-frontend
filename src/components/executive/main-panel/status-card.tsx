import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { getStatusColor, getStatusText } from '@/lib/operator-ticket-status';
import { OperatorTicketStatus } from '@/types/ticket';
import { User, Users, Clock, TrendingUp } from 'lucide-react';

export function StatusCards({
  ticketStatus,
}: {
  readonly ticketStatus: OperatorTicketStatus;
}) {
  return (
    <div className='grid gap-4 md:grid-cols-4'>
      <Card>
        <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
          <CardTitle className='text-sm font-medium'>
            Estado del Turno
          </CardTitle>
          <User className='h-4 w-4 text-muted-foreground' />
        </CardHeader>
        <CardContent>
          <div className={`text-2xl font-bold ${getStatusColor(ticketStatus)}`}>
            {getStatusText(ticketStatus)}
          </div>
          <p className='text-xs text-muted-foreground'>Caja 1 - Turno Mañana</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
          <CardTitle className='text-sm font-medium'>Fila Asignada</CardTitle>
          <Users className='h-4 w-4 text-muted-foreground' />
        </CardHeader>
        <CardContent>
          <div
            className={`text-2xl font-bold ${
              ticketStatus.queueCount === 0 ? 'text-muted-foreground' : ''
            }`}
          >
            {ticketStatus.queueCount}
          </div>
          <p className='text-xs text-muted-foreground'>
            {ticketStatus.queueCount === 0
              ? 'Cola vacía'
              : 'Clientes en espera'}
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
          <CardTitle className='text-sm font-medium'>Tiempo Promedio</CardTitle>
          <Clock className='h-4 w-4 text-muted-foreground' />
        </CardHeader>
        <CardContent>
          <div className='text-2xl font-bold'>3:45</div>
          <p className='text-xs text-muted-foreground'>Por cliente hoy</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
          <CardTitle className='text-sm font-medium'>Atendidos Hoy</CardTitle>
          <TrendingUp className='h-4 w-4 text-muted-foreground' />
        </CardHeader>
        <CardContent>
          <div className='text-2xl font-bold'>12</div>
          <p className='text-xs text-muted-foreground'>Clientes completados</p>
        </CardContent>
      </Card>
    </div>
  );
}
