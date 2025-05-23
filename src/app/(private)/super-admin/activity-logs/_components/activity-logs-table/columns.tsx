'use client';

import { ColumnDef } from '@tanstack/react-table';
import { cn } from '@/lib/utils';
import { ActivityLogValues } from '@/lib/schemas';

export const columns: ColumnDef<ActivityLogValues>[] = [
  {
    accessorKey: 'dateTime',
    header: 'Fecha y Hora',
    cell: ({ row }) => (
      <div>
        {row.original.date} {row.original.time}
      </div>
    ),
  },
  {
    accessorKey: 'user',
    header: 'Usuario',
  },
  {
    accessorKey: 'action',
    header: 'Acción',
  },
  {
    accessorKey: 'details',
    header: 'Detalles',
  },
  {
    accessorKey: 'ip',
    header: 'IP',
  },
  {
    accessorKey: 'level',
    header: 'Nivel',
    cell: ({ row }) => {
      const level = row.original.level;
      return (
        <span
          className={cn(
            'px-2 py-1 rounded-full text-xs font-semibold',
            level === 'Info' && 'bg-blue-100 text-blue-800',
            level === 'Error' && 'bg-red-100 text-red-800',
            level === 'Warning' && 'bg-yellow-100 text-yellow-800',
          )}
        >
          {level}
        </span>
      );
    },
  },
];
