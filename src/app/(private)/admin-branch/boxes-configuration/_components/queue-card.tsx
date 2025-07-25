import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Label } from '@/components/ui/label';
import { Edit, Trash2, MoreHorizontal, Wifi, Smartphone } from 'lucide-react';
import React from 'react';
import { Separator } from '@/components/ui/separator';
import Link from 'next/link';

import { BoxFormValues } from '@/lib/schemas/box-schema';

export type Queue = BoxFormValues;

type Props = {
  queue: Queue;
  IconComponent: React.ElementType;
  handleEdit: (queue: Queue) => void;
  handleConfigure: (queue: Queue) => void;
  handleDelete: (queue: Queue) => void;
  configureActionLabel: string;
  configureActionIcon: React.ElementType;
};

export default function QueueCard({
  queue,
  IconComponent,
  handleEdit,
  handleConfigure,
  handleDelete,
  configureActionLabel,
  configureActionIcon: ConfigureActionIcon,
}: Props) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Activa':
        return 'bg-success/10 text-success border-success/20';
      case 'Inactiva':
        return 'bg-muted/10 text-muted-foreground border-muted/20';
      case 'Mantenimiento':
        return 'bg-warning/10 text-warning border-warning/20';
      default:
        return 'bg-muted/10 text-muted-foreground border-muted/20';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'Muy Alta':
        return 'bg-red-100 text-red-800';
      case 'Alta':
        return 'bg-orange-100 text-orange-800';
      case 'Media':
        return 'bg-yellow-100 text-yellow-800';
      case 'Baja':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-row gap-4 items-start justify-between">
          <div className="flex flex-col gap-4 items-center space-x-3">
            <div className="flex items-center space-x-2">
              {queue.status && (
                <Badge variant="outline" className={getStatusColor(queue.status)}>
                  {queue.status}
                </Badge>
              )}
              {queue.priority && (
                <Badge variant="outline" className={getPriorityColor(queue.priority)}>
                  {queue.priority}
                </Badge>
              )}
              {queue.type === 'mixed' && queue.flexibleMode && (
                <Badge variant="outline" className="bg-blue-100 text-blue-800">
                  Flexible
                </Badge>
              )}
            </div>
            <div className="flex items-start gap-3">
              <IconComponent className="h-6 w-6 text-primary" />
              <div>
                <CardTitle className="text-lg">{queue.name}</CardTitle>
                <CardDescription>
                  {queue.type === 'physical' && queue.location}
                  {queue.type === 'virtual' && queue.platform}
                  {queue.type === 'mixed' && `${queue.physicalLocation} • ${queue.virtualPlatform}`}
                </CardDescription>
              </div>
            </div>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="w-fit ml-auto">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem asChild onClick={() => handleEdit(queue)}>
                <Link href={`/subsidiary-manager/boxes-configuration/edit/${queue.id}`}>
                  <Edit className="h-4 w-4 mr-2" />
                  Editar
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleConfigure(queue)}>
                <ConfigureActionIcon className="h-4 w-4 mr-2" />
                {configureActionLabel}
              </DropdownMenuItem>
              <DropdownMenuItem className="" onClick={() => handleDelete(queue)}>
                <Trash2 className="h-4 w-4 mr-2" />
                Eliminar
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent className="grid gap-4">
        <div className="grid gap-4 md:grid-cols-3">
          <div className="space-y-2">
            <Label className="text-sm font-medium">Operador Asignado</Label>
            <p className="text-sm text-muted-foreground">
              {queue.assignedOperator || 'Sin asignar'}
            </p>
          </div>
          <div className="space-y-2">
            <Label className="text-sm font-medium">
              {queue.type === 'mixed' ? 'Cola Híbrida' : 'Cola Actual'}
            </Label>
            <p className="text-sm text-muted-foreground">
              {queue.currentQueue}/{queue.capacity} clientes
            </p>
          </div>
          <div className="space-y-2">
            <Label className="text-sm font-medium">Tiempo Promedio</Label>
            <p className="text-sm text-muted-foreground">{queue.avgWaitTime}</p>
          </div>
        </div>
        <Separator />
        {queue.type === 'virtual' && ( // Solo para virtual
          <div className=" grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label className="text-sm font-medium">Tipo de Conexión</Label>
              <p className="text-sm flex items-center text-muted-foreground">
                <Wifi className="h-4 w-4 mr-1" />
                {queue.connectionType}
              </p>
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-medium">Ancho de Banda</Label>
              <p className="text-sm text-muted-foreground">{queue.bandwidth}</p>
            </div>
          </div>
        )}
        {queue.type === 'virtual' && <Separator />}
        <div className="space-y-2">
          <Label className="text-sm font-medium">Servicios Disponibles</Label>
          <div className="flex flex-wrap gap-1">
            {queue.services &&
              queue?.services?.length > 0 &&
              queue.services.map((service, index) => (
                <Badge key={index} variant="secondary" className="text-xs">
                  {service}
                </Badge>
              ))}
          </div>
        </div>
        {queue.services && queue.services.length > 0 && <Separator />}
        <div className="space-y-2">
          <Label className="text-sm font-medium">
            {queue.type === 'mixed' ? 'Equipamiento Híbrido' : 'Equipamiento'}
          </Label>
          <div className="flex flex-wrap gap-1">
            {queue.equipment?.map((item, index) => (
              <Badge key={index} variant="outline" className="text-xs">
                {item}
              </Badge>
            ))}
          </div>
        </div>
        {queue.type === 'mixed' && queue.flexibleMode && (
          <div className="mt-4 p-3 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-800">
              <Smartphone className="inline h-4 w-4 mr-1" />
              Modo flexible activado: La caja cambia automáticamente entre atención física y virtual
              según la demanda.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
