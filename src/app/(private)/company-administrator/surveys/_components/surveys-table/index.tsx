'use client';

import {
  type ColumnFiltersState,
  type SortingState,
  type VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';

import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Columns,
  LoaderCircle,
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { toast } from 'sonner';

import { columns } from './columns';
import { useState, type MouseEvent } from 'react';
import { SurveyFormValues } from '@/lib/schemas';


type SurveyTableProps = {
  data: SurveyFormValues[];
}

export function SurveyTable({ data: initialData }: SurveyTableProps) {
  const [data, setData] = useState<SurveyFormValues[]>(initialData);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });

  const [isAlertDialogOpen, setIsAlertDialogOpen] = useState(false);
  const [surveyToDeleteId, setSurveyToDeleteId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDeleteClick = (surveyId: string) => {
    setSurveyToDeleteId(surveyId);
    setIsAlertDialogOpen(true);
  };

  const confirmDelete = async (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();

    if (surveyToDeleteId === null) return;

    setIsDeleting(true);
    try {
      // Simula una llamada a la API
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setData((prevData) => prevData.filter((survey) => survey.id !== surveyToDeleteId));
      toast.success(`Encuesta con ID ${surveyToDeleteId} eliminada.`);
    } catch (error) {
      console.error('Error al eliminar la encuesta:', error);
      toast.error('Ocurrió un error al eliminar la encuesta. Inténtalo de nuevo.');
    } finally {
      setIsDeleting(false);
      setIsAlertDialogOpen(false);
      setSurveyToDeleteId(null);
    }
  };

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      pagination,
    },
    meta: {
      onDeleteClick: handleDeleteClick,
    },
  });

  return (
    <>
      <div className="w-full gap-4 grid">
        <div className="grid lg:grid-cols-[auto_auto] flex-col gap-4 lg:flex-row items-center lg:justify-between">
          <Input
            placeholder="Buscar encuestas por título..."
            value={(table.getColumn('title')?.getFilterValue() as string) ?? ''}
            onChange={(event) => table.getColumn('title')?.setFilterValue(event.target.value)}
            className="lg:max-w-sm !w-full max-w-full py-0"
          />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="w-full lg:ml-auto" size="default">
                <Columns className="mr-2 h-4 w-4" />
                Personalizar columnas
                <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[200px]">
              {table
                .getAllColumns()
                .filter((column) => typeof column.accessorFn !== 'undefined' && column.id !== 'select')
                .map((column) => {
                  return (
                    <DropdownMenuCheckboxItem
                      key={column.id}
                      className="capitalize"
                      checked={column.getIsVisible()}
                      onCheckedChange={(value) => column.toggleVisibility(value)}
                    >
                      {column.id === 'id'
                        ? 'ID'
                        : column.id === 'title'
                          ? 'Título'
                          : column.id === 'questions'
                            ? 'Preguntas'
                            : column.id === 'responses'
                              ? 'Respuestas'
                              : column.id === 'satisfaction'
                                ? 'Satisfacción'
                                : column.id === 'date'
                                  ? 'Período'
                                  : column.id === 'status'
                                    ? 'Estado'
                                    : column.id === 'actions'
                                      ? 'Acciones'
                                      : column.id}
                    </DropdownMenuCheckboxItem>
                  );
                })}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div className="rounded-md border overflow-x-auto">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead key={header.id} className="">
                        {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                      </TableHead>
                    );
                  })}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow key={row.id} data-state={row.getIsSelected() && 'selected'}>
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id} className="">{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={columns.length} className="h-24 text-center">
                    No se encontraron resultados.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        <div className="flex items-center justify-between space-x-2">
          <div className="hidden lg:flex flex-1 text-sm text-muted-foreground">
            {table.getFilteredSelectedRowModel().rows.length} de {table.getFilteredRowModel().rows.length} fila(s)
            seleccionada(s).
          </div>
          <div className="flex w-full lg:w-fit justify-between items-center space-x-6 lg:space-x-8">
            <div className="hidden lg:flex items-center space-x-2">
              <p className="text-sm font-medium">Filas por página</p>
              <Select
                value={`${table.getState().pagination.pageSize}`}
                onValueChange={(value) => {
                  table.setPageSize(Number(value));
                }}
              >
                <SelectTrigger className="h-8 w-[70px]">
                  <SelectValue placeholder={table.getState().pagination.pageSize} />
                </SelectTrigger>
                <SelectContent side="top">
                  {[5, 10, 20, 30, 40, 50].map((pageSize) => (
                    <SelectItem key={pageSize} value={`${pageSize}`}>
                      {pageSize}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex w-[100px] items-center justify-center text-sm font-medium">
              Página {table.getState().pagination.pageIndex + 1} de {table.getPageCount()}
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                className="hidden h-8 w-8 p-0 lg:flex"
                onClick={() => table.setPageIndex(0)}
                disabled={!table.getCanPreviousPage()}
              >
                <span className="sr-only">Ir a la primera página</span>
                <ChevronsLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                className="h-8 w-8 p-0"
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
              >
                <span className="sr-only">Ir a la página anterior</span>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                className="h-8 w-8 p-0"
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
              >
                <span className="sr-only">Ir a la página siguiente</span>
                <ChevronRight className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                className="hidden h-8 w-8 p-0 lg:flex"
                onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                disabled={!table.getCanNextPage()}
              >
                <span className="sr-only">Ir a la última página</span>
                <ChevronsRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      <AlertDialog open={isAlertDialogOpen} onOpenChange={setIsAlertDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Estás absolutamente seguro?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. Esto eliminará permanentemente la encuesta
              (ID: {surveyToDeleteId}) de nuestros servidores.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} disabled={isDeleting}>
              {isDeleting ?
                <>
                  <LoaderCircle className="h-4 w-4 mr-2 animate-spin" />
                  Eliminando
                </>
                : 'Eliminar'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
