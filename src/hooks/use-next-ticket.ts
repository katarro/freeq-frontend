import apiClient from '@/lib/api-client';
import { useState } from 'react';

interface UseNextTicketProps {
  onTicketCompleted?: (
    ticketId: string,
    action: 'completed' | 'absent',
  ) => void;
  onNextTicketCalled?: (newTicket: UnifiedTicketResponse) => void;
  onError?: (error: string) => void;
}

// Nueva interfaz que coincide con la respuesta unificada del backend
export interface UnifiedTicketResponse {
  // Información del ticket (estructura principal - igual que en base de datos)
  id: string; // ⚠️ ESTE PUEDE SER EL USER ID ERRÓNEAMENTE
  queueId: string;
  userId: string;
  serviceModuleId: string;
  executiveId: string | null;
  anonymousEmail: string | null;
  anonymousPhone: string | null;
  registrationToken: string | null;
  ticketNumber: number;
  estimatedWaitTime: number;
  priorityLevel: number;
  status: string;
  entryTime: string;
  callTime: string | null;
  serviceTime: string | null;
  endTime: string | null;
  entryType: string;
  createdOffline: boolean;
  syncStatus: string;
  absenceCount: number;
  createdAt: string;
  updatedAt: string;
  moduleCode: string;

  // ✅ ESTRUCTURA ANIDADA DEL TICKET (LA CORRECTA)
  ticket?: {
    id: string; // ← ESTE ES EL TICKET ID REAL
    ticketNumber: number;
    queue: string;
    serviceModule: string;
    entryType: string;
    status: string;
    entryTime: string;
    callTime: string;
  };

  // Información adicional para el frontend
  clientInfo: {
    id: string;
    name: string;
    email: string;
    phone: string;
    picture: string | null;
    rut: string | null;
  };

  queueInfo: {
    name: string;
    remainingTickets: number;
  };

  serviceModuleInfo: {
    name: string;
  };

  // Campos de conveniencia
  clientName: string;
  queueCount: number;
}

export function useNextTicket({
  onTicketCompleted,
  onNextTicketCalled,
  onError,
}: UseNextTicketProps = {}) {
  const [isLoading, setIsLoading] = useState(false);

  const completeTicket = async (ticketId: string) => {
    console.log(`🔵 Llamando a la API para completar ticket ${ticketId}`);
    try {
      const response = await apiClient.post(
        `ejecutivo/tickets/${ticketId}/completar`,
      );

      const result = response.data;
      console.log('✅ Ticket completado:', result);

      onTicketCompleted?.(ticketId, 'completed');
      return result;
    } catch (error) {
      console.error('❌ Error al completar ticket:', error);
      const errorMessage =
        error instanceof Error ? error.message : 'Error desconocido';
      onError?.(errorMessage);
      throw error;
    }
  };

  const absentTicket = async (ticketId: string) => {
    console.log(
      `🔴 Llamando a la API para marcar ticket ${ticketId} como ausente`,
    );
    try {
      const response = await apiClient.post(
        `ejecutivo/tickets/${ticketId}/ausente`,
      );

      const result = response.data;
      console.log('✅ Ticket marcado como ausente:', result);

      onTicketCompleted?.(ticketId, 'absent');
      return result;
    } catch (error) {
      console.error('❌ Error al marcar ticket como ausente:', error);
      const errorMessage =
        error instanceof Error ? error.message : 'Error desconocido';
      onError?.(errorMessage);
      throw error;
    }
  };

  const callNextTicket = async (): Promise<UnifiedTicketResponse> => {
    console.log('🔵 callNextTicket INICIADO');
    console.log('🔍 Estado antes de llamar API:', {
      isLoading,
      timestamp: new Date().toISOString(),
    });

    try {
      setIsLoading(true);

      const response = await apiClient.post(
        'ejecutivo/tickets/llamar-siguiente',
      );

      console.log('📥 RESPUESTA RAW DE LA API:', {
        status: response.status,
        data: response.data,
        timestamp: new Date().toISOString(),
      });

      // Verificar que la respuesta no esté vacía
      if (!response.data) {
        throw new Error('La API devolvió una respuesta vacía');
      }

      const unifiedTicket: UnifiedTicketResponse = response.data;

      console.log('🔍 ANÁLISIS DE LA RESPUESTA:', {
        'Campo id directo': unifiedTicket.id,
        'Campo ticket.id (si existe)': unifiedTicket.ticket?.id,
        'Campo userId': unifiedTicket.userId,
        'Client Name': unifiedTicket.clientName,
        'Ticket Number': unifiedTicket.ticketNumber,
        'Estructura ticket completa': unifiedTicket.ticket,
      });

      // DETERMINACIÓN DEL TICKET ID CORRECTO
      const realTicketId = unifiedTicket.ticket?.id || unifiedTicket.id;
      const isUsingNestedTicket = !!unifiedTicket.ticket?.id;

      console.log('🎯 DETERMINACIÓN DEL TICKET ID:', {
        'Ticket ID a usar': realTicketId,
        Fuente: isUsingNestedTicket ? 'ticket.id (anidado)' : 'id directo',
        'User ID': unifiedTicket.userId,
        'Son diferentes': realTicketId !== unifiedTicket.userId,
      });

      // VERIFICACIÓN CRÍTICA: Asegurar que los IDs sean diferentes
      if (realTicketId === unifiedTicket.userId) {
        console.error('❌ ERROR CRÍTICO: Ticket ID y User ID son iguales');
        console.error('❌ Esto indica que estamos usando el campo incorrecto');
        console.error('❌ Ticket ID:', realTicketId);
        console.error('❌ User ID:', unifiedTicket.userId);
        throw new Error(
          'Error crítico: Ticket ID y User ID son iguales - revisar estructura de respuesta',
        );
      }

      // Verificar que el ticket tenga un ID válido
      if (!realTicketId) {
        throw new Error('El ticket devuelto no tiene un ID válido');
      }

      // Verificar que tenga la información del cliente
      if (!unifiedTicket.clientInfo?.name && !unifiedTicket.clientName) {
        console.warn('⚠️ Ticket sin información de cliente, usando fallback');
        unifiedTicket.clientName = `Cliente #${String(unifiedTicket.ticketNumber).padStart(3, '0')}`;
      }

      console.log(
        '✅ VALIDACIONES PASADAS - Llamando callback onNextTicketCalled',
      );

      // Crear una copia modificada del objeto con el ticket ID correcto
      const correctedTicket = {
        ...unifiedTicket,
        id: realTicketId, // Usar el ticket ID real
        _originalId: unifiedTicket.id, // Guardar el ID original para debugging
        _source: isUsingNestedTicket ? 'nested' : 'direct',
      };

      onNextTicketCalled?.(correctedTicket);

      console.log('✅ callNextTicket COMPLETADO EXITOSAMENTE');
      return correctedTicket;
    } catch (error: any) {
      console.error('❌ ERROR en callNextTicket:', error);

      // ✅ CAPTURAR ERROR 404 (COLA VACÍA) - AGREGADO
      if (error.response?.status === 404) {
        const errorMessage =
          error.response?.data?.message || 'No hay tickets en espera';

        console.log('📭 COLA VACÍA DETECTADA:', {
          status: error.response.status,
          message: errorMessage,
          fullError: error.response.data,
        });

        // Crear un error específico para cola vacía
        const emptyQueueError = new Error(errorMessage);
        (emptyQueueError as any).type = 'EMPTY_QUEUE';
        (emptyQueueError as any).originalError = error;
        throw emptyQueueError;
      }

      // ✅ MANEJO DE OTROS ERRORES DE AXIOS - AGREGADO
      if (error.response) {
        // El servidor respondió con un código de error
        console.error('❌ Error del servidor:', {
          status: error.response.status,
          message: error.response.data?.message || 'Error del servidor',
          data: error.response.data,
        });

        const serverErrorMessage =
          error.response.data?.message ||
          `Error del servidor (${error.response.status})`;
        const serverError = new Error(serverErrorMessage);
        (serverError as any).type = 'SERVER_ERROR';
        (serverError as any).status = error.response.status;
        throw serverError;
      } else if (error.request) {
        // La petición se hizo pero no hubo respuesta
        console.error('❌ Error de red/conexión:', error.request);
        const networkError = new Error('Error de conexión con el servidor');
        (networkError as any).type = 'NETWORK_ERROR';
        throw networkError;
      } else {
        // Algo más pasó
        console.error('❌ Error desconocido:', error.message);
      }

      // Log detallado del error para depuración
      if (error instanceof Error) {
        console.error('Error message:', error.message);
        console.error('Error stack:', error.stack);
      }

      const errorMessage =
        error instanceof Error
          ? error.message
          : 'Error desconocido al llamar siguiente ticket';
      onError?.(errorMessage);
      throw error;
    } finally {
      setIsLoading(false);
      console.log('🏁 callNextTicket FINALIZADO (finally block)');
    }
  };

  const processTicketAction = async (
    currentTicketId: string,
    action: 'completed' | 'absent',
  ) => {
    console.log(
      `🔄 Procesando acción ${action} para ticket ${currentTicketId}`,
    );

    // Verificar que el ticketId sea válido
    if (!currentTicketId || currentTicketId === 'null') {
      throw new Error('ID de ticket inválido para procesar la acción');
    }

    if (action === 'completed') {
      return await completeTicket(currentTicketId);
    } else {
      return await absentTicket(currentTicketId);
    }
  };

  const processNextTicket = async (
    currentTicketId: string | null,
    pendingAction: 'completed' | 'absent' | null,
  ) => {
    setIsLoading(true);

    try {
      let result = null;

      // 1. Si hay un ticket actual y una acción pendiente, procesarlo primero
      if (currentTicketId && pendingAction) {
        console.log(
          `🔄 Procesando ticket ${currentTicketId} con acción ${pendingAction}`,
        );
        await processTicketAction(currentTicketId, pendingAction);
      }

      // 2. Llamar al siguiente ticket
      console.log('🔄 Llamando al siguiente ticket...');
      result = await callNextTicket();

      return result;
    } catch (error) {
      console.error('❌ Error en processNextTicket:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    processNextTicket,
    completeTicket,
    absentTicket,
    callNextTicket,
    processTicketAction,
    isLoading,
  };
}
