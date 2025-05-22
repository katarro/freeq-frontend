'use client';

import type { ColumnDef } from '@tanstack/react-table';
import { ArrowUpDown, Edit, Trash } from 'lucide-react';

import { Button, buttonVariants } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { AdministratorValues } from '@/lib/schemas/administrator-schema';
import Link from 'next/link';
import { cn } from '@/lib/utils';

export const columns: ColumnDef<AdministratorValues>[] = [
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
          Administrador
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: 'email',
    header: 'Correo',
  },
  {
    accessorKey: 'company',
    header: 'Empresa',
  },
  {
    id: 'acciones',
    header: 'Acciones',
    cell: ({ row, table }) => {
      const administrator = row.original;
      const onDeleteClick = (table.options.meta as { onDeleteClick: (id: number) => void }).onDeleteClick;

      return (
        <div className="flex items-center justify-center space-x-2">
          <abbr title="Editar">
            <Link
              href={`/super-admin/administrators/edit/${administrator.id}`}
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
              onClick={() => administrator.id !== undefined && onDeleteClick(administrator.id)}
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
