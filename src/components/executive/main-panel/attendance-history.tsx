'use client';
import { Card, CardTitle, CardHeader, CardContent, CardDescription } from '../../ui/card';
import { TableRow, TableHead, TableBody, TableCell, TableHeader, Table } from '../../ui/table';
import { Button } from '../../ui/button';
import apiClient from '@/lib/api-client';
import { ENV } from '@/lib/env';
import { useCallback, useEffect, useState, useRef } from 'react';
import React from 'react';

export interface TicketHistory {
  id: string;
  originalId: string;
  userId: string | null;
  serviceModuleId: string | null;
  executiveId: string | null;
  queueId: string;
  ticketNumber: number;
  status: string;
  entryType: string;
  entryTime: string | Date;
  callTime: string | Date | null;
  serviceTime: number;
  endTime: string | Date | null;
  priorityLevel: number;
  waitTime: number | Date | null;
  createdAt: string | Date;
  updatedAt: string | Date;
}

interface PaginationResponse {
  data: TicketHistory[];
  total: number;
  currentPage: number;
  totalPages: number;
}

interface AttendanceHistoryTableProps {
  flowStep?: string;
}

export const AttendanceHistoryTable = React.memo(({ flowStep }: AttendanceHistoryTableProps) => {
  const [history, setHistory] = useState<TicketHistory[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [initialized, setInitialized] = useState(false);
  const tableRef = useRef<HTMLDivElement>(null);
  const itemsPerPage = 10;

  const fetchHistoryTickets = useCallback(
    async (page: number = 1, limit: number = itemsPerPage) => {
      try {
        setLoading(true);
        const response = await apiClient.get(
          `${ENV.API_URL}/ejecutivo/historial-de-atencion?page=${page}&limit=${limit}`,
        );
        console.log(response.data);

        const { data, pagination } = response.data;

        setHistory(data);
        setCurrentPage(pagination.currentPage);
        setTotalPages(pagination.totalPages);
        setTotal(pagination.total);
      } catch (error) {
        console.error('Error fetching history:', error);
      } finally {
        setLoading(false);
      }
    },
    [itemsPerPage],
  );

  // Memoizar el handler de cambio de página con scroll preservation
  const handlePageChange = useCallback(
    (newPage: number) => {
      if (newPage >= 1 && newPage <= totalPages) {
        // Guardar la posición actual del scroll
        const currentScrollY = window.scrollY;

        fetchHistoryTickets(newPage).then(() => {
          // Restaurar la posición del scroll después de la actualización
          setTimeout(() => {
            window.scrollTo(0, currentScrollY);
          }, 0);
        });
      }
    },
    [totalPages, fetchHistoryTickets],
  );

  // Efecto para cargar datos cuando flowStep cambia a 'completed'
  useEffect(() => {
    if (flowStep === 'completed' && !initialized) {
      fetchHistoryTickets(1);
      setInitialized(true);
    }
  }, [flowStep, fetchHistoryTickets, initialized]);

  useEffect(() => {
    fetchHistoryTickets(1);
  }, []);

  const stringToTime = useCallback((date: string | Date | null) => {
    if (!date) {
      return 'N/A';
    }

    if (date instanceof Date) {
      return date.toLocaleTimeString('es-CL', {
        hour: '2-digit',
        minute: '2-digit',
      });
    }

    if (typeof date === 'string') {
      return new Date(date).toLocaleTimeString('es-CL', {
        hour: '2-digit',
        minute: '2-digit',
      });
    }

    return 'N/A';
  }, []);

  const decimalToTime = useCallback((decimal: number): string => {
    if (!decimal || decimal === 0) return '0:00';

    const totalSeconds = Math.round(decimal * 60);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;

    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  }, []);

  return (
    <Card className="overflow-hidden" ref={tableRef}>
      <CardHeader>
        <CardTitle>Historial de atención</CardTitle>
        <CardDescription>Últimos clientes atendidos hoy - Total: {total} registros</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Cliente</TableHead>
              <TableHead>Hora Inicio</TableHead>
              <TableHead>Hora Fin</TableHead>
              <TableHead>Duración</TableHead>
              <TableHead>Satisfacción</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-4">
                  Cargando...
                </TableCell>
              </TableRow>
            ) : history.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-4">
                  No hay registros disponibles
                </TableCell>
              </TableRow>
            ) : (
              history.map((ticket) => (
                <TableRow key={ticket.id}>
                  <TableCell className="font-medium">{ticket.ticketNumber}</TableCell>
                  <TableCell>{stringToTime(ticket.callTime)}</TableCell>
                  <TableCell>{stringToTime(ticket.endTime)}</TableCell>
                  <TableCell>{decimalToTime(ticket.serviceTime)}</TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium justify-end">-</span>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>

        {/* Controles de paginación */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between space-x-2 py-4">
            <div className="text-sm text-muted-foreground">
              Página {currentPage} de {totalPages} - Mostrando {history.length} de {total} registros
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1 || loading}
              >
                Anterior
              </Button>

              {/* Números de página */}
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                const pageNumber = Math.max(1, currentPage - 2) + i;
                if (pageNumber <= totalPages) {
                  return (
                    <Button
                      key={pageNumber}
                      variant={pageNumber === currentPage ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => handlePageChange(pageNumber)}
                      disabled={loading}
                    >
                      {pageNumber}
                    </Button>
                  );
                }
                return null;
              })}

              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages || loading}
              >
                Siguiente
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
});

AttendanceHistoryTable.displayName = 'AttendanceHistoryTable';
