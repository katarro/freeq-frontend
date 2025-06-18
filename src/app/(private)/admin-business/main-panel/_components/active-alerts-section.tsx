// components/panel-components/active-alerts-section.tsx
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertTriangle, XCircle } from 'lucide-react';

export default function ActiveAlertsSection() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <AlertTriangle className="h-5 w-5 mr-2 text-warning" />
          Alertas Activas
        </CardTitle>
        <CardDescription>Situaciones que requieren atención inmediata</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-warning/10 rounded-lg border border-warning/20">
            <div className="flex items-center space-x-3">
              <AlertTriangle className="h-5 w-5 text-warning" />
              <div>
                <p className="font-medium">Juan Pérez - Tiempo excedido</p>
                <p className="text-sm text-muted-foreground">Cliente #052 lleva 4:32 minutos en atención</p>
              </div>
            </div>
            <Button size="sm" variant="outline">
              Revisar
            </Button>
          </div>
          <div className="flex items-center justify-between p-3 bg-destructive/10 rounded-lg border border-destructive/20">
            <div className="flex items-center space-x-3">
              <XCircle className="h-5 w-5 text-destructive" />
              <div>
                <p className="font-medium">María Rodríguez - Ausente prolongada</p>
                <p className="text-sm text-muted-foreground">
                  Sin actividad desde hace 12 minutos - 8 clientes esperando
                </p>
              </div>
            </div>
            <Button size="sm" variant="outline">
              Contactar
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
