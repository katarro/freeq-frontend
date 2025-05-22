// components/empresas-table/columns.tsx
'use client';

import type { ColumnDef } from '@tanstack/react-table';
import { ArrowUpDown, Edit, Trash } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button, buttonVariants } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { CompanyValues } from '@/lib/schemas/company-schema';
import Link from 'next/link';
import { cn } from '@/lib/utils';


export const columns: ColumnDef<CompanyValues>[] = [
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
    accessorKey: 'id',
    header: 'ID',
    cell: ({ row }) => <div className="">{row.getValue('id')}</div>,
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
  },
  {
    accessorKey: 'rut',
    header: 'RUT',
  },
  {
    accessorKey: 'subsidiaries',
    header: 'Sucursales',
    cell: ({ row }) => {
      return <div className="">{row.getValue('subsidiaries')}</div>;
    },
  },
  {
    accessorKey: 'administrators',
    header: 'Administradores',
    cell: ({ row }) => {
      return <div className="">{row.getValue('administrators')}</div>;
    },
  },
  {
    accessorKey: 'state',
    header: 'Estado',
    cell: ({ row }) => {
      const estado = row.getValue('state') as string;
      return (
        <Badge
          variant={estado === 'Activo' ? 'default' : 'destructive'}
          className={
            estado === 'Activo'
              ? 'bg-green-100 text-green-800 hover:bg-green-100 hover:text-green-800'
              : 'bg-red-100 text-red-800 hover:bg-red-100 hover:text-red-800'
          }
        >
          {estado}
        </Badge>
      );
    },
  },
  {
    id: 'acciones',
    header: 'Acciones',
    cell: ({ row, table }) => {
      const company = row.original;
      const onDeleteClick = (table.options.meta as { onDeleteClick: (id: number) => void }).onDeleteClick;

      return (
        <div className="flex items-center justify-center space-x-2">
          <abbr title="Editar">
            <Link
              href={`/super-admin/companies/edit/${company.id}`}
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
              onClick={() => company.id !== undefined && onDeleteClick(company.id)}
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
