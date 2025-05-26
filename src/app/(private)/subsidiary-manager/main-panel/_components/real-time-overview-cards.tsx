import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Clock, TrendingUp, AlertTriangle } from 'lucide-react';

type Props = {
  activeOperators: number;
  totalOperators: number;
  totalWaitingClients: number;
  avgEfficiency: number;
  activeAlerts: number;
};

export default function RealTimeOverviewCards({
  activeOperators,
  totalOperators,
  totalWaitingClients,
  avgEfficiency,
  activeAlerts,
}: Props) {
  const occupationPercentage = totalOperators > 0 ? Math.round((activeOperators / totalOperators) * 100) : 0;

  return (
    <div className="w-full grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Operadores Activos</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {activeOperators}/{totalOperators}
          </div>
          <p className="text-xs text-muted-foreground">{occupationPercentage}% de ocupación</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Clientes en Espera</CardTitle>
          <Clock className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalWaitingClients}</div>
          <p className="text-xs text-muted-foreground">En todas las cajas</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Eficiencia Promedio</CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{avgEfficiency}%</div>
          <p className="text-xs text-muted-foreground">Rendimiento general</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Alertas Activas</CardTitle>
          <AlertTriangle className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{activeAlerts}</div>
          <p className="text-xs text-muted-foreground">Requieren atención</p>
        </CardContent>
      </Card>
    </div>
  );
}
