'use client';

import { useState, useCallback, useRef } from 'react';
import Heading from '@/components/heading';
import { Separator } from '@/components/ui/separator';
import { Clock, Users, TrendingUp, User } from 'lucide-react';
import { QueueStatusPanel } from '@/components/executive/queue-status-panel';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AttendanceHistoryTable } from '@/components/executive/attendance-history';
import {
  AttendanceHistory,
  OperatorTicketStatus,
  TicketStatus,
} from '@/types/ticket';
import { ControlPanel } from '@/components/executive/control-panel';
import { useNextTicket, UnifiedTicketResponse } from '@/hooks/use-next-ticket';

const attendanceHistory: AttendanceHistory[] = [
  {
    id: 1,
    client: 'Cliente #001',
    startTime: '09:15',
    endTime: '09:18',
    duration: '3:12',
    satisfaction: 95,
    operatorId: 'OP-001',
  },
  {
    id: 2,
    client: 'Cliente #002',
    startTime: '09:20',
    endTime: '09:25',
    duration: '4:45',
    satisfaction: 88,
    operatorId: 'OP-001',
  },
  {
    id: 3,
    client: 'Cliente #003',
    startTime: '09:28',
    endTime: '09:31',
    duration: '2:58',
    satisfaction: 92,
    operatorId: 'OP-001',
  },
  {
    id: 4,
    client: 'Cliente #004',
    startTime: '09:35',
    endTime: '09:39',
    duration: '3:22',
    satisfaction: 90,
    operatorId: 'OP-001',
  },
];

const STATUS_TEXT: Record<TicketStatus, string> = {
  WAITING: 'En espera',
  CALLED: 'Llamado',
  ATTENDING: 'Atendiendo',
  COMPLETED: 'Completado',
  ABSENT: 'Ausente',
  POSTPONED: 'Postergado',
  CANCELLED: 'Cancelado',
};

const STATUS_COLOR: Record<TicketStatus, string> = {
  WAITING: 'text-muted-foreground',
  CALLED: 'text-info',
  ATTENDING: 'text-success',
  COMPLETED: 'text-success',
  ABSENT: 'text-destructive',
  POSTPONED: 'text-warning',
  CANCELLED: 'text-muted-foreground',
};

function getStatusText(ticketStatus: OperatorTicketStatus) {
  if (ticketStatus.status === 'CALLED' && ticketStatus.currentClient)
    return 'Cliente llamado';
  if (ticketStatus.status === 'ATTENDING' && ticketStatus.currentClient)
    return 'Atendiendo';
  return STATUS_TEXT[ticketStatus.status];
}

function getStatusColor(ticketStatus: OperatorTicketStatus) {
  if (ticketStatus.status === 'CALLED' && ticketStatus.currentClient)
    return 'text-blue-600';
  if (ticketStatus.status === 'ATTENDING' && ticketStatus.currentClient)
    return 'text-warning';
  return STATUS_COLOR[ticketStatus.status];
}

function StatusCards({ ticketStatus }: { ticketStatus: OperatorTicketStatus }) {
  return (
    <div className='grid gap-4 md:grid-cols-4'>
      <Card>
        <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
          <CardTitle className='text-sm font-medium'>
            Estado del Turno
          </CardTitle>
          <User className='h-4 w-4 text-muted-foreground' />
        </CardHeader>
        <CardContent>
          <div className={`text-2xl font-bold ${getStatusColor(ticketStatus)}`}>
            {getStatusText(ticketStatus)}
          </div>
          <p className='text-xs text-muted-foreground'>Caja 1 - Turno Mañana</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
          <CardTitle className='text-sm font-medium'>Fila Asignada</CardTitle>
          <Users className='h-4 w-4 text-muted-foreground' />
        </CardHeader>
        <CardContent>
          <div
            className={`text-2xl font-bold ${
              ticketStatus.queueCount === 0 ? 'text-muted-foreground' : ''
            }`}
          >
            {ticketStatus.queueCount}
          </div>
          <p className='text-xs text-muted-foreground'>
            {ticketStatus.queueCount === 0
              ? 'Cola vacía'
              : 'Clientes en espera'}
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
          <CardTitle className='text-sm font-medium'>Tiempo Promedio</CardTitle>
          <Clock className='h-4 w-4 text-muted-foreground' />
        </CardHeader>
        <CardContent>
          <div className='text-2xl font-bold'>3:45</div>
          <p className='text-xs text-muted-foreground'>Por cliente hoy</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
          <CardTitle className='text-sm font-medium'>Atendidos Hoy</CardTitle>
          <TrendingUp className='h-4 w-4 text-muted-foreground' />
        </CardHeader>
        <CardContent>
          <div className='text-2xl font-bold'>12</div>
          <p className='text-xs text-muted-foreground'>Clientes completados</p>
        </CardContent>
      </Card>
    </div>
  );
}

export default function MainPanelPage() {
  const [ticketStatus, setTicketStatus] = useState<OperatorTicketStatus>({
    operatorId: 'OP-001',
    status: 'WAITING',
    currentClient: null,
    queueCount: 8,
    canTakeNext: true,
    lastAction: 'none',
  });

  const [pendingAction, setPendingAction] = useState<
    'absent' | 'completed' | null
  >(null);

  const [currentTicketId, setCurrentTicketId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Control de flujo - 3 estados principales
  const [flowStep, setFlowStep] = useState<'waiting' | 'called' | 'completed'>(
    'waiting',
  );
  const processingRef = useRef(false);

  const { callNextTicket, processTicketAction, isLoading } = useNextTicket({
    onTicketCompleted: (ticketId, action) => {
      console.log(
        `✅ PASO 2 COMPLETADO: Ticket ${ticketId} marcado como ${action}`,
      );
      setError(null);

      // CRÍTICO: Limpiar completamente el estado después de completar
      console.log('🧹 LIMPIANDO ESTADO después de completar ticket');
      setCurrentTicketId(null);
      setPendingAction(null);
      setFlowStep('completed');
    },
    onNextTicketCalled: useCallback((unifiedTicket: UnifiedTicketResponse) => {
      console.log('🎫 CALLBACK onNextTicketCalled EJECUTADO:', {
        timestamp: new Date().toISOString(),
        'RAW unifiedTicket object': unifiedTicket,
        'unifiedTicket.id': unifiedTicket.id,
        'unifiedTicket.userId': unifiedTicket.userId,
        'typeof unifiedTicket.id': typeof unifiedTicket.id,
        'typeof unifiedTicket.userId': typeof unifiedTicket.userId,
      });

      // DEBUGGING CRÍTICO: Imprimir TODAS las propiedades
      console.log('🔍 TODAS LAS PROPIEDADES del objeto unifiedTicket:');
      Object.keys(unifiedTicket).forEach((key) => {
        console.log(
          `  ${key}:`,
          unifiedTicket[key as keyof UnifiedTicketResponse],
        );
      });

      // Validación crítica
      if (!unifiedTicket || !unifiedTicket.id) {
        console.error('❌ Ticket inválido recibido:', unifiedTicket);
        setError('Error: Ticket sin ID válido');
        processingRef.current = false;
        return;
      }

      // EXTRACCIÓN EXPLÍCITA Y VERIFICACIÓN - CORREGIDA
      console.log('🔍 ESTRUCTURA COMPLETA DE LA RESPUESTA:', {
        'unifiedTicket.id': unifiedTicket.id,
        'unifiedTicket.ticket': unifiedTicket.ticket,
        'unifiedTicket.ticket?.id': unifiedTicket.ticket?.id,
        'unifiedTicket.userId': unifiedTicket.userId,
      });

      // ✅ CORRECCIÓN CRÍTICA: Usar ticket.id en lugar de id directo
      const ticketId = unifiedTicket.ticket?.id || unifiedTicket.id; // Fallback por si acaso
      const userId = unifiedTicket.userId;
      const clientName =
        unifiedTicket.clientName || unifiedTicket.clientInfo?.name;

      console.log('🔍 EXTRACCIÓN CORREGIDA:', {
        'ticketId extraído (DE TICKET.ID)': ticketId,
        'id directo (NO USAR)': unifiedTicket.id,
        'userId extraído': userId,
        'clientName extraído': clientName,
        'Son diferentes ticket.id vs userId?': ticketId !== userId,
        'PROBLEMA: ¿id directo === userId?': unifiedTicket.id === userId,
      });

      // Verificación que el ticket ID sea el correcto
      if (
        unifiedTicket.ticket?.id &&
        unifiedTicket.id !== unifiedTicket.ticket.id
      ) {
        console.warn('⚠️ INCONSISTENCIA DETECTADA:', {
          'Campo id directo': unifiedTicket.id,
          'Campo ticket.id (CORRECTO)': unifiedTicket.ticket.id,
          'Usando ticket.id como fuente de verdad': true,
        });
      }

      // Verificar que los IDs sean diferentes
      if (ticketId === userId) {
        console.error('❌ CRÍTICO: Los IDs extraídos son iguales:', {
          ticketId,
          userId,
        });
        setError('Error crítico: IDs iguales extraídos');
        processingRef.current = false;
        return;
      }

      console.log('✅ VALIDACIONES PASADAS');

      // CRÍTICO: Limpiar COMPLETAMENTE el estado anterior
      console.log('🧹 LIMPIANDO ESTADO ANTERIOR COMPLETAMENTE');
      setCurrentTicketId(null);
      setPendingAction(null);
      setError(null);
      setFlowStep('waiting'); // Reset temporal

      // Usar setTimeout para asegurar que el estado se limpie completamente
      setTimeout(() => {
        console.log('🎯 APLICANDO NUEVO ESTADO CON TICKET ID:', ticketId);

        // Aplicar el nuevo estado
        setCurrentTicketId(ticketId);
        setFlowStep('called');
        setTicketStatus({
          operatorId: 'OP-001',
          status: 'CALLED',
          currentClient: clientName || `Ticket #${unifiedTicket.ticketNumber}`,
          queueCount: unifiedTicket.queueCount || 0,
          canTakeNext: false,
          lastAction: 'none',
        });

        processingRef.current = false;

        console.log('✅ NUEVO ESTADO APLICADO:', {
          'currentTicketId guardado': ticketId,
          'currentTicketId NO debe ser': userId,
          flowStep: 'called',
          clientName: clientName,
        });

        // VERIFICACIÓN FINAL
        setTimeout(() => {
          console.log(
            '🔍 VERIFICACIÓN FINAL después de 200ms - ¿Se aplicó correctamente?',
          );
        }, 200);
      }, 50); // Pequeño delay para limpiar estado
    }, []),
    onError: (errorMessage) => {
      console.error('❌ Error:', errorMessage);

      // ✅ MANEJO ESPECÍFICO PARA COLA VACÍA EN EL FRONTEND
      if (
        errorMessage.includes('No hay tickets en espera') ||
        errorMessage.includes('No hay nadie en cola') ||
        errorMessage.includes('cola vacía')
      ) {
        console.log('📭 MANEJANDO COLA VACÍA EN FRONTEND');

        // ✅ MOSTRAR ALERT AL EJECUTIVO
        alert(
          `📭 Cola Vacía\n\n${errorMessage}\n\nEsperando nuevos clientes...`,
        );

        setError('📭 No hay nadie en la cola. Esperando nuevos clientes...');

        // Actualizar estado para mostrar que no hay clientes
        setTicketStatus((prev) => ({
          ...prev,
          status: 'WAITING',
          currentClient: null,
          queueCount: 0,
          canTakeNext: true,
          lastAction: 'none',
        }));

        setCurrentTicketId(null);
        setPendingAction(null);
        setFlowStep('waiting');
      } else {
        setError(errorMessage);
      }

      processingRef.current = false;
    },
  });

  // Lógica del botón "Siguiente" (comportamiento adaptativo)
  const handleNext = async () => {
    if (isLoading || processingRef.current) {
      console.log('⏳ Operación en curso');
      return;
    }

    processingRef.current = true;
    setError(null);

    try {
      // CASO 1: Estado inicial - llamar primer ticket
      if (flowStep === 'waiting') {
        console.log('📞 FLUJO: Llamando primer ticket');
        await callNextTicket();
        return;
      }

      // CASO 2: Cliente llamado - debe completar/ausente primero, luego llamar siguiente
      if (flowStep === 'called' && pendingAction && currentTicketId) {
        console.log('🔄 FLUJO CASO 2 INICIADO:', {
          flowStep,
          pendingAction,
          currentTicketId,
          ticketStatusCurrentClient: ticketStatus.currentClient,
        });

        console.log(
          `📝 PASO 2A: Procesando ${pendingAction} para ticket ${currentTicketId}`,
        );

        // Validar que el currentTicketId no sea un userId (longitud y formato)
        if (!currentTicketId || currentTicketId.length < 30) {
          console.error('❌ currentTicketId parece inválido:', currentTicketId);
          setError(`ID de ticket inválido: ${currentTicketId}`);
          return;
        }

        // Hacer una copia del ticketId antes de procesar
        const ticketIdToProcess = currentTicketId;
        console.log('📋 Copiando ticketId para procesar:', ticketIdToProcess);

        // Primero completar el ticket actual
        await processTicketAction(ticketIdToProcess, pendingAction);
        console.log(
          `✅ PASO 2A COMPLETADO: Ticket ${ticketIdToProcess} procesado como ${pendingAction}`,
        );

        // CRÍTICO: Limpiar COMPLETAMENTE el estado antes de llamar al siguiente
        console.log(
          '🧹 LIMPIANDO ESTADO COMPLETAMENTE antes de llamar siguiente',
        );
        setCurrentTicketId(null);
        setPendingAction(null);
        setFlowStep('waiting'); // Reset temporal

        // Forzar re-render antes del siguiente paso
        await new Promise((resolve) => setTimeout(resolve, 100));

        // Luego llamar al siguiente automáticamente
        console.log(
          '📞 PASO 2B: Llamando siguiente ticket después de completar',
        );
        await callNextTicket();
        console.log('✅ PASO 2B COMPLETADO: Siguiente ticket llamado');
        return;
      }

      // CASO 3: Ticket completado - llamar siguiente
      if (flowStep === 'completed') {
        console.log('📞 FLUJO: Llamando siguiente ticket');
        await callNextTicket();
        return;
      }

      // CASO 4: Estado inválido
      if (flowStep === 'called' && !pendingAction) {
        setError('Debe seleccionar Completado o Ausente antes de continuar');
        return;
      }

      console.error('❌ Estado inválido:', {
        flowStep,
        pendingAction,
        currentTicketId,
      });
      setError('Estado inválido. Use el botón Reset si persiste.');
    } catch (error) {
      console.error('❌ Error en handleNext:', error);
      const errorMessage =
        error instanceof Error ? error.message : 'Error desconocido';
      setError(`Error: ${errorMessage}`);
    } finally {
      processingRef.current = false;
    }
  };

  const handleAbsent = () => {
    const newAction = pendingAction === 'absent' ? null : 'absent';
    console.log('👤 Seleccionando ausente:', newAction);
    setPendingAction(newAction);
    setError(null);
  };

  const handleCompleted = () => {
    const newAction = pendingAction === 'completed' ? null : 'completed';
    console.log('✅ Seleccionando completado:', newAction);
    setPendingAction(newAction);
    setError(null);
  };

  const resetState = () => {
    console.log('🔄 Reset completo del estado');
    setCurrentTicketId(null);
    setPendingAction(null);
    setError(null);
    setFlowStep('waiting');
    setTicketStatus({
      operatorId: 'OP-001',
      status: 'WAITING',
      currentClient: null,
      queueCount: 8,
      canTakeNext: true,
      lastAction: 'none',
    });
    processingRef.current = false;
  };

  // Determinar si el botón "Siguiente" debe estar habilitado
  const isNextButtonEnabled = () => {
    if (isLoading || processingRef.current) return false;

    switch (flowStep) {
      case 'waiting':
        return true; // Siempre puede llamar el primer ticket
      case 'called':
        return !!pendingAction; // Solo si seleccionó una acción
      case 'completed':
        return true; // Puede llamar al siguiente
      default:
        return false;
    }
  };

  // Determinar el texto del botón "Siguiente"
  const getNextButtonText = () => {
    if (isLoading) return 'Procesando...';

    return 'Siguiente';
  };

  return (
    <section className='grid gap-4'>
      <Heading title='Panel operador' />
      <Separator />

      {/* Mostrar errores */}
      {error && (
        <div
          className={`p-4 border rounded-lg ${
            error.includes('📭') || error.includes('No hay nadie en la cola')
              ? 'bg-blue-50 border-blue-200'
              : 'bg-destructive/10 border-destructive/30'
          }`}
        >
          <p
            className={`font-medium ${
              error.includes('📭') || error.includes('No hay nadie en la cola')
                ? 'text-blue-700'
                : 'text-destructive'
            }`}
          >
            {error}
          </p>
          {error.includes('📭') && (
            <p className='text-blue-600 text-sm mt-2'>
              💡 El sistema quedará en espera hasta que llegue un nuevo cliente.
            </p>
          )}
        </div>
      )}

      <StatusCards ticketStatus={ticketStatus} />

      <div className='grid gap-4 md:grid-cols-2'>
        <ControlPanel
          ticketStatus={ticketStatus}
          pendingAction={pendingAction}
          isLoading={isLoading}
          handleNext={handleNext}
          handleAbsent={handleAbsent}
          handleCompleted={handleCompleted}
        />
        <QueueStatusPanel ticketStatus={ticketStatus} />
      </div>
      <AttendanceHistoryTable attendanceHistory={attendanceHistory} />
    </section>
  );
}
