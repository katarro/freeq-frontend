import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users } from 'lucide-react';
import { OperatorValues } from '@/lib/schemas';

type Props = {
  operators: OperatorValues[];
}

export default function OperatorsOverviewCards({ operators }: Props) {
  return(
    <div className="grid gap-4 md:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Ejecutivos</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{operators.length}</div>
          <p className="text-xs text-muted-foreground">
            {operators.filter((e) => e.status === 'Activo').length} activos
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Performance Promedio</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {Math.round(operators.reduce((sum: number, e) => sum + (e.performance ?? 0), 0))}
          </div>
          <p className="text-xs text-muted-foreground">Evaluación general</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Satisfacción Promedio</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {Math.round(operators.reduce((sum, e) => sum + (e.satisfaction ?? 0), 0) / operators.length)}%
          </div>
          <p className="text-xs text-muted-foreground">Feedback de clientes</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Clientes Mensuales</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {operators.reduce((sum: number, e) => sum + (e.monthlyClients ?? 0), 0)}
          </div>
          <p className="text-xs text-muted-foreground">Total atendidos</p>
        </CardContent>
      </Card>
    </div>
  );
}
