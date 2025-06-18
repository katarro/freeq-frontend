import { OperatorTicketStatus } from '@/types/ticket';
import { Progress } from '@radix-ui/react-progress';
import { Badge } from '../ui/badge';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '../ui/card';

export function QueueStatusPanel({
  ticketStatus,
}: Readonly<{
  ticketStatus: OperatorTicketStatus;
}>) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Estado de la Fila en Tiempo Real</CardTitle>
        <CardDescription>Vista actual de clientes en espera</CardDescription>
      </CardHeader>
      <CardContent>
        <div className='space-y-4'>
          <div className='flex items-center justify-between'>
            <span className='text-sm font-medium'>Clientes en fila:</span>
            <Badge variant='outline'>{ticketStatus.queueCount}</Badge>
          </div>
          <div className='flex items-center justify-between'>
            <span className='text-sm font-medium'>
              Tiempo estimado de espera:
            </span>
            <span className='text-sm'>
              {Math.ceil(ticketStatus.queueCount * 3.75)} min
            </span>
          </div>
          <div className='space-y-2'>
            <div className='flex justify-between text-sm'>
              <span>Progreso del día</span>
              <span>12/20 objetivo</span>
            </div>
            <Progress value={60} className='w-full' />
          </div>
          <div className='grid grid-cols-2 gap-2 text-sm'>
            <div className='text-center p-2 bg-green-50 rounded'>
              <div className='font-medium text-green-700'>Satisfacción</div>
              <div className='text-lg font-bold'>91%</div>
            </div>
            <div className='text-center p-2 bg-blue-50 rounded'>
              <div className='font-medium text-blue-700'>Eficiencia</div>
              <div className='text-lg font-bold'>95%</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
