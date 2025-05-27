// columns.ts
'use client';

import type { ColumnDef } from '@tanstack/react-table';
import { ArrowUpDown, Eye, MessageSquare, BarChart3 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { OperatorValues } from '@/lib/schemas/operator-schema'; // Ensure this path is correct

const getPerformanceColor = (score: number) => {
  if (score >= 95) return 'text-green-600';
  if (score >= 90) return 'text-blue-600';
  if (score >= 85) return 'text-yellow-600';
  return 'text-red-600';
};

export const columns: ColumnDef<OperatorValues>[] = [
  {
    accessorKey: 'queue',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="shadow-none !px-0"
          size="default"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Caja/Fila
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const operator = row.original;
      return <Badge variant="outline">{operator.queue}</Badge>;
    },
  },
  {
    accessorKey: 'name',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="shadow-none !px-0"
          size="default"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Operador
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const operator = row.original;
      return <div className="font-medium">{operator.name ?? 'N/A'}</div>;
    },
  },
  {
    accessorKey: 'totalResponses',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="shadow-none !px-0 text-center"
          size="default"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Respuestas
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const operator = row.original;
      return (
        <div className="text-center">
          <div className="font-medium">{operator.totalResponses}</div>
          <div className="text-sm text-muted-foreground">respuestas</div>
        </div>
      );
    },
  },
  {
    accessorKey: 'averageSatisfaction',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="shadow-none !px-0"
          size="default"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Satisfacción
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const satisfaction = row.getValue('averageSatisfaction') as number;
      return (
        <div className="flex items-center space-x-2">
          <div className="w-16 bg-muted rounded-full h-2">
            <Progress value={satisfaction} className="h-2 rounded-full bg-primary" />
          </div>
          <span className={`text-sm font-medium ${getPerformanceColor(satisfaction)}`}>
            {satisfaction}%
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: 'monthlyTrend',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="shadow-none !px-0"
          size="default"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Tendencia
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const trend = row.getValue('monthlyTrend') as string;
      return (
        <Badge variant="outline" className="bg-success/10 text-success">
          {trend}
        </Badge>
      );
    },
  },
  {
    id: 'actions',
    header: 'Acciones',
    enableHiding: false,
    cell: ({ row, table }) => {
      const operator = row.original;
      const meta = table.options.meta as {
        openDetailsDialog: (operator: OperatorValues) => void;
        openCommentsDialog: (operator: OperatorValues) => void;
        openChartsDialog: (operator: OperatorValues) => void;
      };

      return  (
        <div className="flex items-center space-x-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => meta.openDetailsDialog(operator)}
            title="Ver detalles"
          >
            <Eye className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => meta.openCommentsDialog(operator)}
            title="Ver comentarios"
          >
            <MessageSquare className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => meta.openChartsDialog(operator)}
            title="Ver gráficos"
          >
            <BarChart3 className="h-4 w-4" />
          </Button>
        </div>
      );
    },
  },
];
