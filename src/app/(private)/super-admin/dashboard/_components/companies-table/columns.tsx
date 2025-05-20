
'use client';

import { ColumnDef } from '@tanstack/react-table';
import { Badge } from '@/components/ui/badge';
import { TCompany } from '@/types';

export const columns: ColumnDef<TCompany>[] = [
  {
    accessorKey: 'nombre',
    header: 'Nombre',
  },
  {
    accessorKey: 'sucursales',
    header: 'Sucursales',
  },
  {
    accessorKey: 'usuarios',
    header: 'Usuarios',
  },
  {
    accessorKey: 'estado',
    header: 'Estado',
    cell: ({ row }) => {
      const estado = row.getValue('estado') as TCompany['estado'];
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
