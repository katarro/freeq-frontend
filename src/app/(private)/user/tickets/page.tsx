'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import CancelTicketDialog from '@/components/dialogs/cancel-ticket-dialog';
import { cn } from '@/lib/utils';

interface Ticket {
  id: string;
  ticketNumber: number;
  service: string;
  site: string;
  siteImage: string;
  address: string;
  date: string;
  estimatedTime: string;
  status: 'waiting' | 'in-progress' | 'completed' | 'cancelled';
  queuePosition: number;
  totalQueue: number;
}

export default function MyShiftsPage() {
  const [shifts, setShifts] = useState<Ticket[]>([]);
  const [activeTab, setActiveTab] = useState<'current' | 'history'>('current');
  const [cancelDialog, setCancelDialog] = useState<{
    isOpen: boolean;
    shift: Ticket | null;
  }>({ isOpen: false, shift: null });

  useEffect(() => {
    // Simular carga de turnos desde localStorage o API
    const mockShifts: Ticket[] = [
      {
        id: '1',
        ticketNumber: 42,
        service: 'Cédula de Identidad',
        site: 'Registro Civil',
        siteImage: '/images/sites/registro-civil-e-identificacion.avif',
        address: 'Gran Avenida Jose Miguel Carrera 4751, San Miguel',
        date: new Date().toISOString(),
        estimatedTime: '15 min',
        status: 'waiting',
        queuePosition: 3,
        totalQueue: 12,
      },
      {
        id: '2',
        ticketNumber: 38,
        service: 'Pasaporte',
        site: 'Registro Civil',
        siteImage: '/images/sites/registro-civil-e-identificacion.avif',
        address: 'Gran Avenida Jose Miguel Carrera 4751, San Miguel',
        date: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
        estimatedTime: '25 min',
        status: 'completed',
        queuePosition: 0,
        totalQueue: 15,
      },
      {
        id: '3',
        ticketNumber: 156,
        service: 'Supermercado',
        site: 'JUMBO El Llano',
        siteImage: '/images/sites/jumbo.avif',
        address: 'El Llano Subercaseaux 3519, San Miguel',
        date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        estimatedTime: '5 min',
        status: 'cancelled',
        queuePosition: 0,
        totalQueue: 8,
      },
    ];

    setShifts(mockShifts);
  }, []);

  const getStatusBadge = (status: Ticket['status']) => {
    switch (status) {
      case 'waiting':
        return (
          <Badge className='bg-warning/10 text-warning hover:bg-warning/20'>
            En espera
          </Badge>
        );
      case 'in-progress':
        return (
          <Badge className='bg-blue-500/10 text-blue-600 hover:bg-blue-500/20'>
            En progreso
          </Badge>
        );
      case 'completed':
        return (
          <Badge className='bg-success/10 text-success hover:bg-success/20'>
            Completado
          </Badge>
        );
      case 'cancelled':
        return (
          <Badge className='bg-destructive/10 text-destructive hover:bg-destructive/20'>
            Cancelado
          </Badge>
        );
      default:
        return null;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-CL', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const currentShifts = shifts.filter(
    (shift) => shift.status === 'waiting' || shift.status === 'in-progress',
  );

  const historyShifts = shifts.filter(
    (shift) => shift.status === 'completed' || shift.status === 'cancelled',
  );

  const handleCancelShift = (shiftId: string) => {
    setShifts((prev) =>
      prev.map((shift) =>
        shift.id === shiftId
          ? { ...shift, status: 'cancelled' as const }
          : shift,
      ),
    );
  };

  const openCancelDialog = (shift: Ticket) => {
    setCancelDialog({ isOpen: true, shift });
  };

  const closeCancelDialog = () => {
    setCancelDialog({ isOpen: false, shift: null });
  };

  const confirmCancelShift = () => {
    if (cancelDialog.shift) {
      handleCancelShift(cancelDialog.shift.id);
    }
  };

  return (
    <div className='min-h-screen bg-background'>
      {/* Header */}
      <section className='bg-gradient-to-bl from-secondary to-primary p-6'>
        <div className='container max-w-4xl mx-auto'>
          <h1 className='text-2xl font-semibold text-primary-foreground text-center'>
            Mis Turnos
          </h1>
          <p className='text-primary-foreground/80 text-center mt-1'>
            Gestiona tus citas y revisa tu historial
          </p>
        </div>
      </section>

      {/* Content */}
      <div className='container max-w-[600px] mx-auto px-4 py-6'>
        {/* Tabs */}
        <div className='flex bg-muted/50 rounded-lg p-1 mb-6 overflow-hidden'>
          <button
            onClick={() => setActiveTab('current')}
            className={cn(
              'flex-1 py-2 px-2 sm:px-4 rounded-md text-xs sm:text-sm font-medium transition-colors',
              activeTab === 'current'
                ? 'bg-background text-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground',
            )}
          >
            <span className='hidden sm:inline'>
              Actuales ({currentShifts.length})
            </span>
            <span className='sm:hidden'>Actuales ({currentShifts.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={cn(
              'flex-1 py-2 px-2 sm:px-4 rounded-md text-xs sm:text-sm font-medium transition-colors',
              activeTab === 'history'
                ? 'bg-background text-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground',
            )}
          >
            <span className='hidden sm:inline'>
              Historial ({historyShifts.length})
            </span>
            <span className='sm:hidden'>
              Historial ({historyShifts.length})
            </span>
          </button>
        </div>

        {/* Tickets List */}
        <div className='space-y-4'>
          {activeTab === 'current' && (
            <>
              {currentShifts.length === 0 ? (
                <div className='text-center py-12'>
                  <div className='w-16 h-16 mx-auto mb-4 bg-muted rounded-full flex items-center justify-center'>
                    <svg
                      className='w-8 h-8 text-muted-foreground'
                      fill='none'
                      stroke='currentColor'
                      viewBox='0 0 24 24'
                    >
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        strokeWidth={2}
                        d='M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z'
                      />
                    </svg>
                  </div>
                  <h3 className='text-lg font-medium text-foreground mb-2'>
                    No tienes turnos activos
                  </h3>
                  <p className='text-muted-foreground'>
                    Cuando solicites un turno, aparecerá aquí
                  </p>
                </div>
              ) : (
                currentShifts.map((shift) => (
                  <Card key={shift.id} className='overflow-hidden'>
                    <CardHeader className='pb-3'>
                      <div className='flex flex-col sm:flex-row sm:items-center gap-3'>
                        <div className='flex items-center gap-3 flex-1 min-w-0'>
                          <figure className='w-12 h-12 rounded-full overflow-hidden flex-shrink-0'>
                            <Image
                              src={shift.siteImage}
                              alt={shift.site}
                              width={48}
                              height={48}
                              className='w-full h-full object-cover'
                            />
                          </figure>
                          <div className='flex-1 min-w-0'>
                            <div className='flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 mb-1'>
                              <h3 className='font-semibold text-foreground truncate'>
                                {shift.service}
                              </h3>
                              {getStatusBadge(shift.status)}
                            </div>
                            <p className='text-sm text-muted-foreground truncate'>
                              {shift.site}
                            </p>
                          </div>
                        </div>

                        {/* Número de ticket centrado */}
                        <div className='flex justify-center sm:justify-end'>
                          <div className='bg-primary/10 rounded-full px-4 py-2 text-center'>
                            <div className='text-2xl sm:text-3xl font-bold text-primary'>
                              #{shift.ticketNumber}
                            </div>
                            <div className='text-xs text-muted-foreground'>
                              Tu turno
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className='pt-0'>
                      <div className='space-y-3'>
                        {/* Número en atención - Grande y destacado */}
                        <div className='bg-gradient-to-r from-primary/10 to-primary/5 rounded-xl p-4 text-center border border-primary/20'>
                          <div className='text-xs text-muted-foreground mb-1'>
                            NÚMERO EN ATENCIÓN
                          </div>
                          <div className='text-4xl sm:text-5xl font-bold text-primary mb-1'>
                            #{shift.queuePosition}
                          </div>
                          <div className='text-sm text-muted-foreground'>
                            Actualmente siendo atendido
                          </div>
                        </div>

                        <div className='grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm'>
                          <div className='flex justify-between sm:flex-col sm:justify-start'>
                            <span className='text-muted-foreground'>
                              Tiempo estimado:
                            </span>
                            <span className='font-medium sm:mt-1'>
                              {shift.estimatedTime}
                            </span>
                          </div>
                          <div className='flex justify-between sm:flex-col sm:justify-start'>
                            <span className='text-muted-foreground'>
                              Tu ticket:
                            </span>
                            <span className='font-medium sm:mt-1'>
                              #{shift.ticketNumber}
                            </span>
                          </div>
                        </div>

                        <div className='text-sm'>
                          <span className='text-muted-foreground'>Fecha:</span>
                          <p className='font-medium mt-1'>
                            {formatDate(shift.date)}
                          </p>
                        </div>

                        <div className='text-sm'>
                          <span className='text-muted-foreground'>
                            Dirección:
                          </span>
                          <p className='font-medium mt-1 leading-relaxed'>
                            {shift.address}
                          </p>
                        </div>

                        <Separator />

                        <div className='flex justify-start'>
                          <Button
                            variant='destructive'
                            size='sm'
                            className='hover:cursor-pointer'
                            onClick={() => openCancelDialog(shift)}
                          >
                            Cancelar turno
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </>
          )}

          {activeTab === 'history' && (
            <>
              {historyShifts.length === 0 ? (
                <div className='text-center py-12'>
                  <div className='w-16 h-16 mx-auto mb-4 bg-muted rounded-full flex items-center justify-center'>
                    <svg
                      className='w-8 h-8 text-muted-foreground'
                      fill='none'
                      stroke='currentColor'
                      viewBox='0 0 24 24'
                    >
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        strokeWidth={2}
                        d='M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z'
                      />
                    </svg>
                  </div>
                  <h3 className='text-lg font-medium text-foreground mb-2'>
                    Sin historial
                  </h3>
                  <p className='text-muted-foreground'>
                    Tus turnos completados aparecerán aquí
                  </p>
                </div>
              ) : (
                historyShifts.map((shift) => (
                  <Card key={shift.id} className='overflow-hidden opacity-75'>
                    <CardHeader className='pb-3'>
                      <div className='flex flex-col sm:flex-row sm:items-center gap-3'>
                        <div className='flex items-center gap-3 flex-1 min-w-0'>
                          <figure className='w-12 h-12 rounded-full overflow-hidden flex-shrink-0'>
                            <Image
                              src={shift.siteImage}
                              alt={shift.site}
                              width={48}
                              height={48}
                              className='w-full h-full object-cover'
                            />
                          </figure>
                          <div className='flex-1 min-w-0'>
                            <div className='flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 mb-1'>
                              <h3 className='font-semibold text-foreground truncate'>
                                {shift.service}
                              </h3>
                              {getStatusBadge(shift.status)}
                            </div>
                            <p className='text-sm text-muted-foreground truncate'>
                              {shift.site}
                            </p>
                          </div>
                        </div>

                        {/* Número de ticket centrado */}
                        <div className='flex justify-center sm:justify-end'>
                          <div className='bg-muted/50 rounded-full px-4 py-2 text-center'>
                            <div className='text-2xl sm:text-3xl font-bold text-muted-foreground'>
                              #{shift.ticketNumber}
                            </div>
                            <div className='text-xs text-muted-foreground'>
                              Finalizado
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className='pt-0'>
                      <div className='space-y-3'>
                        <div className='text-sm'>
                          <span className='text-muted-foreground'>Fecha:</span>
                          <p className='font-medium mt-1'>
                            {formatDate(shift.date)}
                          </p>
                        </div>
                        <div className='text-sm'>
                          <span className='text-muted-foreground'>
                            Dirección:
                          </span>
                          <p className='font-medium mt-1 leading-relaxed'>
                            {shift.address}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </>
          )}
        </div>
      </div>

      {/* Dialog de confirmación */}
      {cancelDialog.shift && (
        <CancelTicketDialog
          open={cancelDialog.isOpen}
          onOpenChange={closeCancelDialog}
          onConfirm={confirmCancelShift}
          ticketNumber={cancelDialog.shift.ticketNumber}
          serviceName={cancelDialog.shift.service}
          siteName={cancelDialog.shift.site}
        />
      )}
    </div>
  );
}
