import { useStatusCard } from '@/hooks/executive/use-status-card';
import { User, Users, TrendingUp, Timer } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { useOperatorContext } from '@/contexts/OperatorContext';
import { useControlPanel } from '@/hooks/executive/use-control-panel';

export function StatusCards() {
  const { data, loading, error, countUsersInQueue, myCompletedTicketsToday } = useStatusCard();
  const { ticketStatus } = useOperatorContext();
  const { startTime, elapsedTime } = useControlPanel();

  if (loading) {
    return (
      <div className="grid gap-4 md:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i}>
            <CardContent className="flex items-center justify-center h-24">
              <div className="animate-pulse text-muted-foreground">Cargando...</div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="md:col-span-4">
          <CardContent className="flex items-center justify-center h-24">
            <p className="text-red-500">Error: {error}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="grid gap-4 md:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Cliente Actual</CardTitle>
          <User className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className={'text-2xl font-bold'}>
            {ticketStatus?.currentClient ? ticketStatus.currentClient : 'Sin Cliente'}
          </div>
          <p className="text-xs text-muted-foreground">Cliente actual en atención</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Tiempo de atención</CardTitle>
          <Timer
            className={`h-5 w-5 mr-2 text-gray-500 dark:text-gray-400 ${
              startTime ? 'animate-pulse' : ''
            }`}
          />
        </CardHeader>
        <CardContent>
          <div className={'text-2xl font-bold'}>{elapsedTime}</div>
          <p className="text-xs text-muted-foreground">Cliente actual en atención</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Clientes en Cola</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div
            className={`text-2xl font-bold ${
              countUsersInQueue === 0 ? 'text-muted-foreground' : 'text-primary'
            }`}
          >
            <span className="inline-flex items-center gap-2">
              {countUsersInQueue}
              <span
                className="w-2 h-2 bg-green-500 rounded-full animate-pulse"
                title="Datos en tiempo real"
              />
            </span>
          </div>
          <p className="text-xs text-muted-foreground">
            {countUsersInQueue === 0
              ? 'Cola vacía (tiempo real)'
              : `${countUsersInQueue} clientes esperando (tiempo real)`}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Atendidos Hoy</CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{myCompletedTicketsToday}</div>
          <p className="text-xs text-muted-foreground">Clientes completados</p>
        </CardContent>
      </Card>
    </div>
  );
}
