
'use client';

import { ColumnDef } from '@tanstack/react-table';
import { Badge } from '@/components/ui/badge';
import { CompanyValues } from '@/lib/schemas';

export const columns: ColumnDef<CompanyValues>[] = [
  {
    accessorKey: 'name',
    header: 'Nombre',
  },
  {
    accessorKey: 'subsidiaries',
    header: 'Sucursales',
  },
  {
    accessorKey: 'users',
    header: 'Usuarios',
  },
  {
    accessorKey: 'state',
    header: 'Estado',
    cell: ({ row }) => {
      const estado = row.getValue('state') as CompanyValues['state'];
      return (
        <Badge
          className={`px-2 py-1 rounded-full text-xs font-medium ${
            estado === 'Activo'
              ? 'bg-green-100 text-green-800'
              : 'bg-red-100 text-red-800'
          }`}
        >
          {estado}
        </Badge>
      );
    },
  },
];
