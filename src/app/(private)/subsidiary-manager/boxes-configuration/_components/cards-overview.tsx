import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Settings, Users, Building, Clock } from 'lucide-react';
import { queueConfigs } from '@/app/(private)/subsidiary-manager/boxes-configuration/data';

export default function CardsOverview() {
  const allQueues = [...queueConfigs.physical, ...queueConfigs.virtual, ...queueConfigs.mixed];

  const totalActiveQueues = allQueues.filter((q) => q.status === 'Activa').length;
  const totalQueues = allQueues.length;
  const totalClientsInQueue = allQueues.reduce((sum, q) => sum + (q.currentQueue ?? 0), 0);
  const totalCapacity = allQueues.reduce((sum, q) => sum + (q.capacity ?? 0), 0);

  return (
    <div className="grid gap-4 grid-cols-2 md:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Cajas</CardTitle>
          <Settings className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalQueues}</div>
          <p className="text-xs text-muted-foreground">{totalActiveQueues} activas</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Clientes en Espera</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalClientsInQueue}</div>
          <p className="text-xs text-muted-foreground">En todas las cajas</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Capacidad Total</CardTitle>
          <Building className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalCapacity}</div>
          <p className="text-xs text-muted-foreground">Clientes máximo</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Tiempo Promedio</CardTitle>
          <Clock className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">3:32</div>
          <p className="text-xs text-muted-foreground">Todas las cajas</p>
        </CardContent>
      </Card>
    </div>
  );
}
