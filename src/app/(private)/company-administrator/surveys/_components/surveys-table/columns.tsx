'use client';

import type { ColumnDef } from '@tanstack/react-table';
import { ArrowUpDown, Edit, Trash2 } from 'lucide-react';

import { Button, buttonVariants } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import  SurveyResultsModal from '../survey-result-modal';
import { cn } from '@/lib/utils';
import { SurveyFormValues } from '@/lib/schemas';
import Link from 'next/link';
import { Progress } from '@/components/ui/progress';

export const columns: ColumnDef<SurveyFormValues>[] = [
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
    accessorKey: 'title',
    header: ({ column }) => {
      return (
        <Button variant="ghost" className="shadow-none !px-0" size="default" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
          Título
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => <div className="min-w-[120px]">{row.getValue('title')}</div>,
  },
  {
    accessorKey: 'questionsTotal',
    header: 'Preguntas',
    cell: ({ row }) => <div className="min-w-[80px] text-center">{row.getValue('questionsTotal')}</div>,
  },
  {
    accessorKey: 'responses',
    header: 'Respuestas',
    cell: ({ row }) => <div className="min-w-[80px] text-center">{row.getValue('responses')}</div>,
  },
  {
    accessorKey: 'satisfaction',
    header: 'Satisfacción',
    cell: ({ row }) => {
      const satisfaction = row.getValue('satisfaction') as number;
      if (satisfaction === 0) return <span>-</span>;

      let indicatorColorClass: string;

      if (satisfaction < 70) {
        indicatorColorClass = 'bg-red-500';
      } else if (satisfaction < 85) {
        indicatorColorClass = 'bg-yellow-500';
      } else {
        indicatorColorClass = 'bg-green-500';
      }

      return (
        <div className="flex items-center space-x-2 min-w-[150px]">
          <Progress
            value={satisfaction}
            className="h-2.5 flex-1 !bg-muted"
            indicatorClassName={indicatorColorClass}
          />
          <span className="w-10 text-right">{satisfaction}%</span>
        </div>
      );
    },
  },
  {
    accessorKey: 'date',
    header: 'Período',
    cell: ({ row }) => {
      const survey = row.original;
      return (
        <div className="text-sm min-w-[150px]">
          <div>{survey.startDate}</div>
          <div>{survey.endDate}</div>
        </div>
      );
    },
  },
  {
    accessorKey: 'status',
    header: 'Estado',
    cell: ({ row }) => {
      const status = row.getValue('status') as string;
      return (
        <Badge
          className={cn(
            'border',
            status === 'Activa' && 'bg-green-100 text-green-800 border-green-200',
            status === 'Finalizada' && 'bg-gray-100 text-gray-800 border-gray-200',
            status === 'Programada' && 'bg-blue-100 text-blue-800 border-blue-200',
          )}
        >
          {status}
        </Badge>
      );
    },
  },
  {
    id: 'actions',
    header: 'Acciones',
    cell: ({ row, table }) => {
      const survey = row.original;
      const onDeleteClick = (table.options.meta as { onDeleteClick: (id: string) => void }).onDeleteClick;

      return (
        <div className="flex items-center justify-center space-x-2 min-w-[100px]">
          <SurveyResultsModal survey={survey} />
          <abbr title="Editar">
            <Link
              href={`/company-administrator/surveys/edit/${survey.id}`}
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
              className={cn('h-8 w-8 shadow-none text-muted-foreground')}
              onClick={() => survey.id && onDeleteClick(survey.id)}
            >
              <Trash2 className="h-4 w-4 text-muted-foreground" />
              <span className="sr-only">Eliminar</span>
            </Button>
          </abbr>
        </div>
      );
    },
  },
];
