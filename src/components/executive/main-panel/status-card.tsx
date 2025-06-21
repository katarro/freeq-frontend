import { useEffect } from 'react';
import { useStatusCard } from '@/hooks/executive/use-status-card';
import { User, Users, Clock, TrendingUp } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

export function StatusCards() {
  const { data, loading, error, fetchData } = useStatusCard();

  useEffect(() => {
    fetchData();
  }, []);

  // Determinar estado del ejecutivo
  const getExecutiveStatus = () => {
    if (!data?.clientsInQueue) return 'IDLE';

    const hasAttending = data.clientsInQueue.some(
      (client) => client.status === 'ATTENDING',
    );
    const hasCalled = data.clientsInQueue.some(
      (client) => client.status === 'CALLED',
    );

    if (hasAttending) return 'ATTENDING';
    if (hasCalled) return 'CALLED';
    if (data.queueInfo.totalWaiting > 0) return 'AVAILABLE';
    return 'IDLE';
  };

  // Formatear tiempo en minutos a MM:SS
  const formatTime = (minutes: number): string => {
    if (minutes === 0) return '0:00';
    const mins = Math.floor(minutes);
    const secs = Math.round((minutes - mins) * 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

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
              data.queueInfo.totalWaiting === 0 ? 'text-muted-foreground' : ''
            }`}
          >
            {data.queueInfo.totalWaiting}
          </div>
          <p className='text-xs text-muted-foreground'>
            {data.queueInfo.totalWaiting === 0
              ? 'Cola vacía'
              : `${data.queueInfo.regularQueue} regulares, ${data.queueInfo.absentQueue} ausentes`}
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
          <div className='text-2xl font-bold'>{data.clientsAttendedToday}</div>
          <p className='text-xs text-muted-foreground'>Clientes completados</p>
        </CardContent>
      </Card>
    </div>
  );
}
