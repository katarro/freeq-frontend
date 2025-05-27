'use client';

import type { ColumnDef } from '@tanstack/react-table';
import { ArrowUpDown, Edit, Trash, Mail, Phone } from 'lucide-react';

import { Button, buttonVariants } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { SubsidiaryManagerValues } from '@/lib/schemas';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';

export const columns: ColumnDef<SubsidiaryManagerValues>[] = [
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
    accessorKey: 'fullName',
    header: ({ column }) => {
      return (
        <Button variant="ghost" className="shadow-none !px-0" size="default" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
          Nombre Completo
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => <div className="min-w-[150px]">{row.getValue('fullName')}</div>,
  },
  {
    accessorKey: 'email',
    header: 'Correo Electrónico',
    cell: ({ row }) => (
      <div className="flex items-center min-w-[200px]">
        <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
        {row.getValue('email')}
      </div>
    ),
  },
  {
    accessorKey: 'phone',
    header: 'Teléfono',
    cell: ({ row }) => {
      const phone = row.getValue('phone');
      return phone ? (
        <div className="flex items-center min-w-[120px]">
          <Phone className="h-4 w-4 mr-2 text-muted-foreground" />
          {phone as string}
        </div>
      ) : (
        <div className="min-w-[120px] text-muted-foreground italic">N/A</div>
      );
    },
  },
  {
    accessorKey: 'subsidiary',
    header: ({ column }) => {
      return (
        <Button variant="ghost" className="shadow-none !px-0" size="default" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
          Sucursal Asignada
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => <div className="min-w-[150px]">{row.getValue('subsidiary')}</div>,
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
      const manager = row.original;
      const onDeleteClick = (table.options.meta as { onDeleteClick: (id: number) => void }).onDeleteClick;

      return (
        <div className="flex items-center justify-center space-x-2">
          <abbr title="Editar">
            <Link
              href={`/company-administrator/subsidiaries-managers/edit/${manager.id}`}
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
              onClick={() => manager.id !== undefined && onDeleteClick(manager.id)}
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
