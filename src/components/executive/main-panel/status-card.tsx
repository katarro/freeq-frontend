import { useStatusCard } from '@/hooks/executive/use-status-card';
import { User, Users, Clock, TrendingUp } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

export function StatusCards() {
  const {
    data,
    loading,
    error,
    countUsersInQueue,
    getExecutiveStatus,
    clientsAttendedToday,
  } = useStatusCard();

  if (loading) {
    return (
      <div className='grid gap-4 md:grid-cols-4'>
        {[...Array(4)].map((_, i) => (
          <Card key={i}>
            <CardContent className='flex items-center justify-center h-24'>
              <div className='animate-pulse text-muted-foreground'>
                Cargando...
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className='grid gap-4 md:grid-cols-4'>
        <Card className='md:col-span-4'>
          <CardContent className='flex items-center justify-center h-24'>
            <p className='text-red-500'>Error: {error}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!data) return null;

  const executiveStatus = getExecutiveStatus();

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
          <div className={`text-2xl font-bold`}>{executiveStatus}</div>
          <p className='text-xs text-muted-foreground'>
            {data.executiveInfo.module.name} -{' '}
            {data.executiveInfo.module.serviceType}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
          <CardTitle className='text-sm font-medium'>
            Clientes en Cola
          </CardTitle>
          <Users className='h-4 w-4 text-muted-foreground' />
        </CardHeader>
        <CardContent>
          <div
            className={`text-2xl font-bold ${
              countUsersInQueue === 0 ? 'text-muted-foreground' : 'text-primary'
            }`}
          >
            {/* ✅ MOSTRAR DATA DEL EVENTO SSE */}
            <span className='inline-flex items-center gap-2'>
              {countUsersInQueue}
              <span
                className='w-2 h-2 bg-green-500 rounded-full animate-pulse'
                title='Datos en tiempo real'
              />
            </span>
          </div>
          <p className='text-xs text-muted-foreground'>
            {countUsersInQueue === 0
              ? 'Cola vacía (tiempo real)'
              : `${countUsersInQueue} clientes esperando (tiempo real)`}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
          <CardTitle className='text-sm font-medium'>Tiempo Promedio</CardTitle>
          <Clock className='h-4 w-4 text-muted-foreground' />
        </CardHeader>
        <CardContent>
          <div className='text-2xl font-bold'>
            {/* {formatTime(data.averageServiceTime)} */}
          </div>
          <p className='text-xs text-muted-foreground'>Por cliente (30 días)</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
          <CardTitle className='text-sm font-medium'>Atendidos Hoy</CardTitle>
          <TrendingUp className='h-4 w-4 text-muted-foreground' />
        </CardHeader>
        <CardContent>
          <div className='text-2xl font-bold'>{clientsAttendedToday}</div>
          <p className='text-xs text-muted-foreground'>Clientes completados</p>
        </CardContent>
      </Card>
    </div>
  );
}
