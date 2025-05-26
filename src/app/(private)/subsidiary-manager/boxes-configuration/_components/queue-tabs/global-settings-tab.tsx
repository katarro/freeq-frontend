import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { TabsContent } from '@/components/ui/tabs';

export default function GlobalSettingsContent() {
  return (
    <TabsContent value="settings" className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Configuración Global de Cajas</CardTitle>
            <CardDescription>Parámetros generales para todas las cajas</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Input label="Capacidad máxima por defecto" id="maxCapacity" type="number" defaultValue="15" />
            </div>
            <div className="space-y-2">
              <Select defaultValue="media">
                <SelectTrigger floatingLabel="Prioridad por defecto">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="muy-alta">Muy Alta</SelectItem>
                  <SelectItem value="alta">Alta</SelectItem>
                  <SelectItem value="media">Media</SelectItem>
                  <SelectItem value="baja">Baja</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-primary">Auto-asignación de operadores</Label>
                <p className="text-sm text-muted-foreground">Asignar automáticamente operadores disponibles</p>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-primary">Redistribución automática</Label>
                <p className="text-sm text-muted-foreground">Redistribuir clientes cuando una caja se satura</p>
              </div>
              <Switch defaultChecked />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Configuración de Alertas</CardTitle>
            <CardDescription>Notificaciones y alertas del sistema</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Input label="Umbral de alerta (clientes en espera)" id="alertThreshold" type="number" defaultValue="10" />
            </div>
            <div className="space-y-2">
              <Input label="Umbral de tiempo (minutos)" id="timeThreshold" type="number" defaultValue="5" />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-primary">Alertas por email</Label>
                <p className="text-sm text-muted-foreground">Enviar alertas por correo electrónico</p>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-primary">Alertas sonoras</Label>
                <p className="text-sm text-muted-foreground">Reproducir sonidos de alerta</p>
              </div>
              <Switch />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Configuración de Horarios</CardTitle>
            <CardDescription>Horarios de operación de las cajas</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Input label="Hora de apertura" id="openTime" type="time" defaultValue="09:00" />
              </div>
              <div className="space-y-2">
                <Input label="Hora de cierre" id="closeTime" type="time" defaultValue="17:00" />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Días de operación</Label>
              <div className="grid grid-cols-2 gap-2">
                <div className="flex items-center space-x-2">
                  <Checkbox id="monday" defaultChecked />
                  <Label htmlFor="monday">Lunes</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="tuesday" defaultChecked />
                  <Label htmlFor="tuesday">Martes</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="wednesday" defaultChecked />
                  <Label htmlFor="wednesday">Miércoles</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="thursday" defaultChecked />
                  <Label htmlFor="thursday">Jueves</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="friday" defaultChecked />
                  <Label htmlFor="friday">Viernes</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="saturday" />
                  <Label htmlFor="saturday">Sábado</Label>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Configuración Técnica</CardTitle>
            <CardDescription>Parámetros técnicos del sistema</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Input label="Frecuencia de actualización (segundos)" id="refreshRate" type="number" defaultValue="30" />
            </div>
            <div className="space-y-2">
              <Input label="Conexiones simultáneas máximas" id="maxConnections" type="number" defaultValue="100" />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-primary">Modo de alta disponibilidad</Label>
                <p className="text-sm text-muted-foreground">Redundancia y failover automático</p>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-primary">Logs detallados</Label>
                <p className="text-sm text-muted-foreground">Registrar todas las actividades</p>
              </div>
              <Switch defaultChecked />
            </div>
          </CardContent>
        </Card>
      </div>
    </TabsContent>
  );
}
