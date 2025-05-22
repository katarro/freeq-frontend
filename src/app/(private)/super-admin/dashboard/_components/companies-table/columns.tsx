
'use client';

import { ColumnDef } from '@tanstack/react-table';
import { Badge } from '@/components/ui/badge';
import { TCompany } from '@/types';

export const columns: ColumnDef<TCompany>[] = [
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
      const estado = row.getValue('state') as TCompany['state'];
      return (
        <Badge
          className={`px-2 py-1 rounded-full text-xs font-medium ${
            estado === 'Activo'
              ? 'bg-green-100 text-green-800'
              : 'bg-red-100 text-red-800' // Puedes añadir más estilos para otros estados
          }`}
        >
          {estado}
        </Badge>
      );
    },
  },
];
