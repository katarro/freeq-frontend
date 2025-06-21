import apiClient from '@/lib/api-client';
import { useState } from 'react';

interface UseNextTicketProps {
  onTicketCompleted?: (
    ticketId: string,
    action: 'completed' | 'absent',
  ) => void;
  onNextTicketCalled?: (newTicket: UnifiedTicketResponse) => void;
  onError?: (error: string) => void;
  // ✅ PROPS PARA CONTROL DE HISTORIAL (opcionales)
  wasTicketProcessed?: (ticketId: string) => boolean;
  markTicketAsProcessed?: (ticketId: string) => void;
}

export interface UnifiedTicketResponse {
  // Información del ticket (estructura principal)
  id: string;
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

  // ✅ ESTRUCTURA ANIDADA DEL TICKET (si la incluye el backend)
  ticket?: {
    id: string;
    ticketNumber: number;
    queue: string;
    serviceModule: string;
    entryType: string;
    status: string;
    entryTime: string;
    callTime: string;
  };

  // Información adicional para el frontend
  clientInfo?: {
    id: string;
    name: string;
    email: string;
    phone: string;
    picture: string | null;
    rut: string | null;
    hasValidData?: boolean;
  };

  queueInfo?: {
    name: string;
    remainingTickets: number;
  };

  serviceModuleInfo?: {
    name: string;
  };

  // Campos de conveniencia
  clientName?: string;
  queueCount?: number;

  // Metadata adicional
  _metadata?: {
    hasValidUserData: boolean;
    isReturningTicket: boolean;
    isNewTicket: boolean;
    ticketStatus: string;
    timestamp: string;
  };
}

export function useNextTicket({
  onTicketCompleted,
  onNextTicketCalled,
  onError,
  wasTicketProcessed,
  markTicketAsProcessed,
}: UseNextTicketProps = {}) {
  const [isLoading, setIsLoading] = useState(false);

  const completeTicket = async (ticketId: string) => {
    // console.log(`🔵 Llamando a la API para completar ticket ${ticketId}`);
    try {
      const response = await apiClient.post(
        `ejecutivo/tickets/${ticketId}/completar`,
      );

      const result = response.data;
      // console.log('✅ Ticket completado exitosamente:', {
      //   ticketId: result.data?.id || ticketId,
      //   status: result.data?.status,
      //   endTime: result.data?.endTime,
      //   fullResponse: result,
      // });

      // ✅ SOLO MARCAR COMO PROCESADO SI LA API RESPONDE EXITOSAMENTE
      markTicketAsProcessed?.(ticketId);
      onTicketCompleted?.(ticketId, 'completed');
      return result;
    } catch (error: any) {
      console.error('❌ Error al completar ticket:', error);
      console.error('❌ Detalles del error:', {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message,
      });

      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        'Error desconocido al completar ticket';
      onError?.(errorMessage);
      throw error;
    }
  };

  const absentTicket = async (ticketId: string) => {
    // console.log(
    //   `🔴 Llamando a la API para marcar ticket ${ticketId} como ausente`,
    // );
    try {
      const response = await apiClient.post(
        `ejecutivo/tickets/${ticketId}/ausente`,
      );

      const result = response.data;
      // console.log('✅ Ticket marcado como ausente exitosamente:', {
      //   ticketId: result.data?.id || ticketId,
      //   status: result.data?.status,
      //   endTime: result.data?.endTime,
      //   absenceCount: result.data?.absenceCount,
      //   fullResponse: result,
      // });

      // ✅ SOLO MARCAR COMO PROCESADO SI LA API RESPONDE EXITOSAMENTE
      markTicketAsProcessed?.(ticketId);
      onTicketCompleted?.(ticketId, 'absent');
      return result;
    } catch (error: any) {
      console.error('❌ Error al marcar ticket como ausente:', error);
      console.error('❌ Detalles del error:', {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message,
      });

      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        'Error desconocido al marcar como ausente';
      onError?.(errorMessage);
      throw error;
    }
  };

  // ✅ FUNCIÓN AUXILIAR: Determinar el ticket ID correcto
  const determineTicketId = (unifiedTicket: UnifiedTicketResponse): string => {
    // PRIORIDAD 1: ticket.id (estructura anidada) - si existe
    if (unifiedTicket.ticket?.id) {
      // console.log('🎯 Usando ticket.id (anidado):', unifiedTicket.ticket.id);
      return unifiedTicket.ticket.id;
    }

    // PRIORIDAD 2: id directo (más común basado en tu respuesta de Postman)
    if (unifiedTicket.id) {
      // console.log('🎯 Usando id directo:', unifiedTicket.id);
      return unifiedTicket.id;
    }

    // FALLBACK: Si ambos fallan, hay un problema crítico
    console.error('❌ No se pudo determinar el ticket ID válido');
    throw new Error('Error crítico: No se pudo determinar el ticket ID válido');
  };

  // ✅ FUNCIÓN AUXILIAR: Generar información del cliente
  const generateClientInfo = (unifiedTicket: UnifiedTicketResponse): string => {
    // Si viene clientName del backend, usarlo
    if (
      unifiedTicket.clientName &&
      !unifiedTicket.clientName.includes('undefined') &&
      unifiedTicket.clientName.trim() !== ''
    ) {
      return unifiedTicket.clientName;
    }

    // Si viene clientInfo del backend, usarlo
    if (
      unifiedTicket.clientInfo?.name &&
      !unifiedTicket.clientInfo.name.includes('undefined') &&
      unifiedTicket.clientInfo.name.trim() !== ''
    ) {
      return unifiedTicket.clientInfo.name;
    }

    // Fallback: usar número de ticket
    const ticketNumber = unifiedTicket.ticketNumber || 'Sin número';
    const fallbackName = `Cliente #${ticketNumber}`;

    // console.log('⚠️ Cliente sin datos válidos, usando fallback:', fallbackName);
    return fallbackName;
  };

  const callNextTicket = async (): Promise<UnifiedTicketResponse> => {
    // console.log('🔵 callNextTicket INICIADO');

    try {
      setIsLoading(true);

      const response = await apiClient.post(
        'ejecutivo/tickets/llamar-siguiente',
      );

      // console.log('📥 RESPUESTA RAW DE LA API:', {
      //   status: response.status,
      //   data: response.data,
      //   timestamp: new Date().toISOString(),
      // });

      // Verificar que la respuesta no esté vacía
      if (!response.data) {
        throw new Error('La API devolvió una respuesta vacía');
      }

      const unifiedTicket: UnifiedTicketResponse = response.data;

      // console.log('🔍 ANÁLISIS DE LA RESPUESTA (basado en Postman):', {
      //   'ID del ticket': unifiedTicket.id,
      //   'User ID': unifiedTicket.userId,
      //   'Ticket Number': unifiedTicket.ticketNumber,
      //   Status: unifiedTicket.status,
      //   'Executive ID': unifiedTicket.executiveId,
      //   'Call Time': unifiedTicket.callTime,
      //   'Tiene estructura anidada': !!unifiedTicket.ticket,
      // });

      // ✅ PASO 1: Determinar el ticket ID correcto
      const realTicketId = determineTicketId(unifiedTicket);

      // ✅ PASO 2: Verificar si ya fue procesado (solo si hay función de verificación)
      if (wasTicketProcessed && wasTicketProcessed(realTicketId)) {
        console.warn(
          '⚠️ TICKET YA PROCESADO LOCALMENTE DETECTADO:',
          realTicketId,
        );
        console.warn(
          '⚠️ Esto puede indicar desincronización entre frontend y backend',
        );

        // ✅ NO rechazar automáticamente, solo dar warning
        // El backend es la fuente de verdad
        // console.log(
        //   '✅ Permitiendo ticket porque el backend lo devolvió como válido',
        // );
      }

      // ✅ PASO 3: Generar información del cliente
      const validatedClientName = generateClientInfo(unifiedTicket);

      // ✅ PASO 4: Verificaciones básicas
      if (!realTicketId || realTicketId.trim() === '') {
        throw new Error('El ticket devuelto no tiene un ID válido');
      }

      // console.log('✅ VALIDACIONES PASADAS:', {
      //   'Ticket ID final': realTicketId,
      //   Cliente: validatedClientName,
      //   'User ID': unifiedTicket.userId,
      //   Status: unifiedTicket.status,
      //   'Executive ID': unifiedTicket.executiveId,
      // });

      // ✅ PASO 5: Crear respuesta normalizada (mantener estructura original + mejoras)
      const normalizedTicket: UnifiedTicketResponse = {
        ...unifiedTicket, // Mantener todo lo original del backend
        id: realTicketId, // Asegurar ID correcto
        clientName: validatedClientName, // Asegurar nombre válido

        // ✅ Agregar campos que podrían faltar
        clientInfo: unifiedTicket.clientInfo || {
          id: unifiedTicket.userId || '',
          name: validatedClientName,
          email: '',
          phone: '',
          picture: null,
          rut: null,
          hasValidData: !validatedClientName.includes('Cliente #'),
        },

        queueInfo: unifiedTicket.queueInfo || {
          name: 'Cola General',
          remainingTickets: 0,
        },

        serviceModuleInfo: unifiedTicket.serviceModuleInfo || {
          name: 'Módulo General',
        },

        queueCount: unifiedTicket.queueCount || 0,

        // Metadata para debugging
        _metadata: {
          ...unifiedTicket._metadata,
          frontendProcessed: false,
          responseProcessedAt: new Date().toISOString(),
          wasInLocalHistory: wasTicketProcessed
            ? wasTicketProcessed(realTicketId)
            : false,
        } as any,
      };

      // console.log('✅ TICKET NORMALIZADO CREADO:', {
      //   'ID final': normalizedTicket.id,
      //   'Cliente final': normalizedTicket.clientName,
      //   Status: normalizedTicket.status,
      //   'Executive ID': normalizedTicket.executiveId,
      //   Metadata: normalizedTicket._metadata,
      // });

      // ✅ PASO 6: Llamar callback con ticket normalizado
      onNextTicketCalled?.(normalizedTicket);

      // console.log('✅ callNextTicket COMPLETADO EXITOSAMENTE');
      return normalizedTicket;
    } catch (error: any) {
      console.error('❌ ERROR en callNextTicket:', error);

      // ✅ MANEJO ESPECÍFICO DE ERRORES
      if (error.response?.status === 404) {
        const errorMessage =
          error.response?.data?.message || 'No hay tickets en espera';
        // console.log('📭 COLA VACÍA:', errorMessage);

        const emptyQueueError = new Error(errorMessage);
        (emptyQueueError as any).type = 'EMPTY_QUEUE';
        throw emptyQueueError;
      }

      if (error.response?.status >= 500) {
        const serverError = new Error('Error interno del servidor');
        (serverError as any).type = 'SERVER_ERROR';
        (serverError as any).status = error.response.status;
        throw serverError;
      }

      if (!error.response) {
        const networkError = new Error('Error de conexión con el servidor');
        (networkError as any).type = 'NETWORK_ERROR';
        throw networkError;
      }

      // Error genérico
      const errorMessage =
        error.response?.data?.message || error.message || 'Error desconocido';
      onError?.(errorMessage);
      throw error;
    } finally {
      setIsLoading(false);
      // console.log('🏁 callNextTicket FINALIZADO');
    }
  };

  const processTicketAction = async (
    currentTicketId: string,
    action: 'completed' | 'absent',
  ) => {
    // console.log(
    //   `🔄 Procesando acción ${action} para ticket ${currentTicketId}`,
    // );

    // Verificar que el ticketId sea válido
    if (
      !currentTicketId ||
      currentTicketId === 'null' ||
      currentTicketId.trim() === ''
    ) {
      throw new Error('ID de ticket inválido para procesar la acción');
    }

    // ✅ NO verificar historial local aquí - el backend es la fuente de verdad
    // console.log(
    //   `📤 Enviando ${action} al backend para ticket:`,
    //   currentTicketId,
    // );

    try {
      if (action === 'completed') {
        return await completeTicket(currentTicketId);
      } else {
        return await absentTicket(currentTicketId);
      }
    } catch (error: any) {
      // ✅ MANEJO ESPECÍFICO DE ERRORES DE PROCESAMIENTO
      if (error.response?.status === 404) {
        throw new Error(
          'Ticket no encontrado o ya fue procesado por otro ejecutivo',
        );
      }

      if (error.response?.status === 400) {
        throw new Error('El ticket no se puede procesar en su estado actual');
      }

      // Re-lanzar error original
      throw error;
    }
  };

  return {
    completeTicket,
    absentTicket,
    callNextTicket,
    processTicketAction,
    isLoading,
  };
}
