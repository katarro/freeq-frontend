'use client';

import type { ColumnDef } from '@tanstack/react-table';
import { ArrowUpDown, Edit, Trash } from 'lucide-react';

import { Button, buttonVariants } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { OperatorValues } from '@/lib/schemas/operator-schema';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { Progress } from '@/components/ui/progress';

export const columns: ColumnDef<OperatorValues>[] = [
  {
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        className="mx-auto"
        checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && 'indeterminate')}
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Seleccionar todo"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Seleccionar fila"
        className="mx-auto grid"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'name', // Ejecutivo
    header: ({ column }) => {
      return (
        <Button variant="ghost" className="shadow-none !px-0" size="default" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
          Ejecutivo
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const operator = row.original;
      return (
        <div className="flex items-center gap-2">
          <div>
            <div className="font-medium">{operator.name}</div>
            {operator.startDate && <div className="text-sm text-muted-foreground">Desde {operator.startDate}</div>}
          </div>
        </div>
      );
    },
  },
  {
    id: 'contact',
    header: 'Contacto',
    cell: ({ row }) => {
      const operator = row.original;
      return (
        <div className="flex flex-col">
          {operator.email && <div className="text-sm">{operator.email}</div>}
          {operator.phone && <div className="text-sm text-muted-foreground">+ {operator.phone}</div>}
        </div>
      );
    },
    enableSorting: false,
    enableHiding: true,
  },
  {
    accessorKey: 'position',
    header: 'Cargo',
    cell: ({ row }) => {
      const operator = row.original;
      return (
        <div className="flex flex-col">
          <div className="text-sm">{operator.position}</div>
          {operator.shift && <div className="text-sm text-muted-foreground">{operator.shift}</div>}
        </div>
      );
    },
  },
  {
    accessorKey: 'assignedQueue',
    header: 'Caja Asignada',
  },
  {
    accessorKey: 'status',
    header: 'Estado',
  },
  {
    accessorKey: 'performance',
    header: 'Performance',
    cell: ({ row }) => {
      const performance = row.getValue('performance') as number;
      return (
        <div className="flex items-center gap-2">
          <Progress value={performance} className="w-[100px]" />
          <span className="text-sm font-medium">{performance}%</span>
        </div>
      );
    },
  },
  {
    accessorKey: 'satisfaction',
    header: 'Satisfacción',
    cell: ({ row }) => {
      const satisfaction = row.getValue('satisfaction') as number;
      return (
        <div className="flex items-center gap-2">
          <Progress value={satisfaction} className="w-[100px]" />
          <span className="text-sm font-medium">{satisfaction}%</span>
        </div>
      );
    },
  },
  {
    accessorKey: 'monthlyClients',
    header: ({ column }) => {
      return (
        <Button variant="ghost" className="shadow-none !px-0" size="default" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
          Clientes/Mes
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const monthlyClients = row.getValue('monthlyClients') as number;
      const avgTime = row.original.avgTime;
      return (
        <div className="flex flex-col">
          <div className="font-medium">{monthlyClients}</div>
          {avgTime && <div className="text-sm text-muted-foreground">{avgTime} prom.</div>}
        </div>
      );
    },
  },
  {
    id: 'acciones',
    header: 'Acciones',
    cell: ({ row, table }) => {
      const operator = row.original;
      const onDeleteClick = (table.options.meta as { onDeleteClick: (id: number) => void }).onDeleteClick;

      return (
        <div className="flex items-center justify-center space-x-2">
          <abbr title="Editar">
            <Link
              href={`/subsidiary-manager/operators/edit/${operator.id}`}
              className={cn(buttonVariants({ variant: 'ghost', size: 'icon' }), 'h-8 w-8 shadow-none text-muted-foreground')}
            >
              <Edit className="h-4 w-4" />
              <span className="sr-only">Editar</span>
            </Link>
          </abbr>
          <abbr title="Eliminar">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 shadow-none text-muted-foreground"
              onClick={() => operator.id !== undefined && onDeleteClick(operator.id)}
            >
              <Trash className="h-4 w-4" />
              <span className="sr-only">Eliminar</span>
            </Button>
          </abbr>
        </div>
      );
    },
  },
];
