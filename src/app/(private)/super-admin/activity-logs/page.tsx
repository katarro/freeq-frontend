'use client';


import { Button } from '@/components/ui/button';
import { Calendar, Download } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import Heading from '@/components/heading';

import ActivityLogsTable from './_components/activity-logs-table';
import { ActivityLogValues } from '@/lib/schemas';

const activityLogsData: ActivityLogValues[] = [
  { date: '15/05/2025', time: '21:15:34', user: 'superadmin@freeq.com', action: 'Inicio de sesión', details: 'Inicio de sesión exitoso', ip: '192.168.1.1', level: 'Info' },
  { date: '15/05/2025', time: '20:45:12', user: 'admin@empresa.com', action: 'Actualización', details: 'Actualización de parámetros de sucursal', ip: '192.168.1.2', level: 'Info' },
  { date: '15/05/2025', time: '19:30:45', user: 'jefe@sucursal.com', action: 'Creación', details: 'Creación de nuevo ejecutivo', ip: '192.168.1.3', level: 'Info' },
  { date: '15/05/2025', time: '18:22:10', user: 'sistema', action: 'Error', details: 'Error en la conexión con el servicio de notificaciones', ip: '192.168.1.4', level: 'Error' },
  { date: '15/05/2025', time: '17:15:30', user: 'superadmin@freeq.com', action: 'Eliminación', details: 'Eliminación de empresa inactiva', ip: '192.168.1.1', level: 'Warning' },
  { date: '15/05/2025', time: '16:45:22', user: 'admin@empresa.com', action: 'Actualización', details: 'Actualización de datos de empresa', ip: '192.168.1.2', level: 'Info' },
  { date: '15/05/2025', time: '15:30:15', user: 'jefe@sucursal.com', action: 'Configuración', details: 'Cambio en reglas de fila', ip: '192.168.1.3', level: 'Info' },
  { date: '15/05/2025', time: '14:20:05', user: 'sistema', action: 'Mantenimiento', details: 'Respaldo automático de base de datos', ip: '192.168.1.4', level: 'Info' },
  { date: '15/05/2025', time: '13:10:45', user: 'ejecutivo@freeq.com', action: 'Inicio de sesión', details: 'Intento fallido de inicio de sesión', ip: '192.168.1.5', level: 'Warning' },
  { date: '15/05/2025', time: '12:05:30', user: 'superadmin@freeq.com', action: 'Creación', details: 'Creación de nueva empresa', ip: '192.168.1.1', level: 'Info' },
];

export default function ActivityLogsPage() {
  return (
    <>
      <section className="grid gap-6 pb-[calc(56px+16px)]">
        <Heading
          title="Logs de Actividad"
          description="Historial de acciones realizadas en el sistema"
          className="grid lg:grid-cols-[auto_auto] gap-4"
          right={
            <div className="grid grid-cols-2 w-full lg:w-auto items-center gap-4">
              <Button variant="outline" size="default" className="w-full lg:w-auto flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Filtrar por fecha
              </Button>
              <Button variant="outline" size="default" className="w-full lg:w-auto flex items-center gap-2">
                <Download className="h-4 w-4" />
                Exportar
              </Button>
            </div>
          }
        />
        <Separator />
        <div className="">
          <ActivityLogsTable data={activityLogsData} />
        </div>
      </section>
    </>
  );
}
