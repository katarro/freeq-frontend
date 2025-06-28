import { useCallback } from 'react';
import { UnifiedTicketResponse } from '@/hooks/executive';
import { OperatorTicketStatus } from '@/types/ticket';

interface UseOperatorTicketHandlerProps {
  setCurrentTicketId: (id: string | null) => void;
  setFlowStep: (step: 'waiting' | 'called' | 'completed') => void;
  setTicketStatus: (status: OperatorTicketStatus) => void;
  setPendingAction: (action: 'absent' | 'completed' | null) => void;
  clearCurrentTicket: () => void;
  setError: (error: string | null) => void;
}

export const useOperatorTicketHandler = ({
  setCurrentTicketId,
  setFlowStep,
  setTicketStatus,
  setPendingAction,
  clearCurrentTicket,
  setError,
}: UseOperatorTicketHandlerProps) => {
  // Handler para cuando se completa un ticket
  const handleTicketCompleted = useCallback(
    (ticketId: string, action: string) => {
      console.log('✅ Ticket completado:', ticketId, 'acción:', action);
      setError(null);
      clearCurrentTicket();
      setFlowStep('completed');
    },
    [setError, clearCurrentTicket, setFlowStep],
  );

  // ✅ FUNCIÓN AUXILIAR: Detectar clientes "undefined" o inválidos
  const isInvalidClient = (clientName: string): boolean => {
    if (!clientName || clientName.trim() === '') return true;

    const invalidPatterns = [
      'undefined',
      '#undefined',
      'Cliente #undefined',
      'null',
      'Cliente null',
      'Sin nombre',
      '',
    ];

    return invalidPatterns.some((pattern) =>
      clientName.toLowerCase().includes(pattern.toLowerCase()),
    );
  };

  // ✅ FUNCIÓN AUXILIAR: Extraer y validar datos del ticket
  const extractTicketData = (unifiedTicket: UnifiedTicketResponse) => {
    // PASO 1: Determinar ticket ID (misma lógica que en useNextTicket)
    let ticketId = unifiedTicket.id;
    if (unifiedTicket.ticket?.id) {
      ticketId = unifiedTicket.ticket.id;
    } else if (unifiedTicket.id === unifiedTicket.userId) {
      // Si el ID directo es igual al userId, hay un problema
      console.error('❌ PROBLEMA DETECTADO: ID directo igual a userId');
      throw new Error('Error en la estructura del ticket: ID inválido');
    }

    // PASO 2: Determinar número de ticket
    const ticketNumber =
      unifiedTicket.ticketNumber || unifiedTicket.ticket?.ticketNumber || ticketId.slice(-3); // Usar últimos 3 caracteres del ID como fallback

    // PASO 3: Determinar nombre del cliente
    let clientName = unifiedTicket.clientInfo?.name || unifiedTicket.clientName || '';

    // Si el cliente es inválido, crear un nombre de fallback
    if (isInvalidClient(clientName)) {
      clientName = `${ticketNumber}`;
      // console.log(
      //   '⚠️ Cliente inválido detectado, usando fallback:',
      //   clientName,
      // );
    }

    // PASO 4: Determinar conteo de cola
    const queueCount = unifiedTicket.queueCount || 0;

    return {
      ticketId,
      ticketNumber,
      clientName,
      queueCount,
      isValidClient: !isInvalidClient(
        unifiedTicket.clientInfo?.name || unifiedTicket.clientName || '',
      ),
    };
  };

  // Handler para cuando se llama un nuevo ticket
  const handleNextTicketCalled = useCallback(
    (unifiedTicket: UnifiedTicketResponse) => {
      if (!unifiedTicket) {
        console.error('❌ Respuesta inválida del servidor');
        setError('Error: Respuesta inválida del servidor');
        return;
      }

      try {
        // ✅ EXTRAER Y VALIDAR DATOS
        const extractedData = extractTicketData(unifiedTicket);

        // console.log('🔍 Datos extraídos y validados:', extractedData);

        // ✅ VALIDACIONES CRÍTICAS
        if (!extractedData.ticketId || extractedData.ticketId.trim() === '') {
          throw new Error('ID de ticket inválido después de la extracción');
        }

        if (extractedData.ticketId === unifiedTicket.userId) {
          throw new Error('Error crítico: Ticket ID es igual al User ID');
        }

        // ✅ LIMPIAR ERRORES PREVIOS
        setError(null);

        // ✅ CONFIGURAR NUEVO TICKET
        // console.log('✅ Configurando nuevo ticket:', {
        //   ticketId: extractedData.ticketId,
        //   clientName: extractedData.clientName,
        //   queueCount: extractedData.queueCount,
        //   isValidClient: extractedData.isValidClient,
        // });

        setCurrentTicketId(extractedData.ticketId);
        setFlowStep('called');
        setPendingAction(null);

        // ✅ CONFIGURAR STATUS DEL TICKET
        setTicketStatus({
          operatorId: 'OP-001',
          status: 'CALLED',
          currentClient: extractedData.clientName,
          queueCount: extractedData.queueCount,
          canTakeNext: false,
          lastAction: 'none',
          // Campos adicionales para debugging
          _isValidClient: extractedData.isValidClient,
          _originalTicketId: unifiedTicket.id,
          _extractedTicketId: extractedData.ticketId,
        } as any);

        // ✅ LOG FINAL DE CONFIRMACIÓN
        // console.log('✅ TICKET CONFIGURADO EXITOSAMENTE:', {
        //   'ID guardado': extractedData.ticketId,
        //   'Cliente mostrado': extractedData.clientName,
        //   'Es cliente válido': extractedData.isValidClient,
        //   'Flow step': 'called',
        // });
      } catch (error: any) {
        console.error('❌ Error procesando ticket llamado:', error);
        setError(`Error procesando ticket: ${error.message}`);

        // En caso de error, limpiar estado
        clearCurrentTicket();
        setFlowStep('waiting');
      }
    },
    [
      setCurrentTicketId,
      setPendingAction,
      setFlowStep,
      setTicketStatus,
      setError,
      clearCurrentTicket,
    ],
  );

  return {
    handleTicketCompleted,
    handleNextTicketCalled,
  };
};
