import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { OperatorValues } from '@/lib/schemas';

type OperatorDetailsDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  operator: OperatorValues | null;
};

export default function OperatorDetailsDialog({ open, onOpenChange, operator }: OperatorDetailsDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="leading-relaxed">Detalles del operador <br/> {operator?.name}</DialogTitle>
          <DialogDescription>Información detallada y métricas de rendimiento</DialogDescription>
        </DialogHeader>
        {operator && (
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium">Información General</Label>
                <div className="space-y-1 text-sm">
                  <p>
                    <strong>Nombre:</strong> {operator.name}
                  </p>
                  <p>
                    <strong>Caja:</strong> {operator.queue}
                  </p>
                  <p>
                    <strong>Estado:</strong> {operator.status}
                  </p>
                  <p>
                    <strong>Cliente actual:</strong> {operator.currentClient || 'Ninguno'}
                  </p>
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium">Métricas del Día</Label>
                <div className="space-y-1 text-sm">
                  <p>
                    <strong>Clientes atendidos:</strong> {operator.served}
                  </p>
                  <p>
                    <strong>Tiempo promedio:</strong> {operator.avgTime}
                  </p>
                  <p>
                    <strong>Eficiencia:</strong> {operator.efficiency}%
                  </p>
                  <p>
                    <strong>Satisfacción:</strong> {operator.satisfaction}%
                  </p>
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-medium">Estado de la Fila</Label>
              <div className="p-3 bg-muted rounded-lg">
                <p className="text-sm">
                  <strong>Clientes en espera:</strong> {operator.waitingClients}
                </p>
                <p className="text-sm">
                  <strong>Última actividad:</strong> {operator.lastActivity}
                </p>
                {operator.currentClient && operator.timeWithClient && (
                  <p className="text-sm">
                    <strong>Tiempo con cliente actual:</strong> {operator.timeWithClient}
                  </p>
                )}
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
