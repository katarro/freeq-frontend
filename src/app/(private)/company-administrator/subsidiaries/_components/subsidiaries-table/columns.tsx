'use client';

import type { ColumnDef } from '@tanstack/react-table';
import { ArrowUpDown, Edit, Trash, MapPin } from 'lucide-react';

import { Button, buttonVariants } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { SubsidiaryValues } from '@/lib/schemas/subsidiary-schema';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';

export const columns: ColumnDef<SubsidiaryValues>[] = [
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
    accessorKey: 'name',
    header: ({ column }) => {
      return (
        <Button variant="ghost" className="shadow-none !px-0" size="default" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
          Nombre
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => <div className="min-w-[120px]">{row.getValue('name')}</div>,
  },
  {
    accessorKey: 'address',
    header: 'Dirección',
    cell: ({ row }) => (
      <div className="flex items-center min-w-[200px]">
        <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
        {row.getValue('address')}
      </div>
    ),
  },
  {
    accessorKey: 'branchManager',
    header: 'Jefe de Sucursal',
    cell: ({ row }) => <div className="min-w-[150px]">{row.getValue('branchManager')}</div>,
  },
  {
    accessorKey: 'executives',
    header: ({ column }) => {
      return (
        <Button variant="ghost" className="shadow-none !px-0" size="default" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
          Ejecutivos
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => <div className="text-center">{row.getValue('executives')}</div>,
  },
  {
    accessorKey: 'status',
    header: 'Estado',
    cell: ({ row }) => {
      const status = row.getValue('status');
      return (
        <Badge
          className={`
            ${status === 'Activo' ? 'bg-green-100 text-green-800 border-green-200' : ''}
            ${status === 'Inactivo' ? 'bg-red-100 text-red-800 border-red-200' : ''}
          `}
        >
          {status === 'Activo' ? 'Activo' : 'Inactivo'}
        </Badge>
      );
    },
  },
  {
    id: 'acciones',
    header: 'Acciones',
    cell: ({ row, table }) => {
      const subsidiary = row.original;
      const onDeleteClick = (table.options.meta as { onDeleteClick: (id: number) => void }).onDeleteClick;

      return (
        <div className="flex items-center justify-center space-x-2">
          <abbr title="Editar">
            <Link
              href={`/company-administrator/subsidiaries/edit/${subsidiary.id}`}
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
              onClick={() => subsidiary.id !== undefined && onDeleteClick(subsidiary.id)}
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
