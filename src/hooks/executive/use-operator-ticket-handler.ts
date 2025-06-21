import { useCallback } from 'react';
import { UnifiedTicketResponse } from '@/hooks/executive/use-next-ticket';
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

  // Handler para cuando se llama un nuevo ticket
  const handleNextTicketCalled = useCallback(
    (unifiedTicket: UnifiedTicketResponse) => {
      console.log('📞 Nuevo ticket llamado:', unifiedTicket);

      if (!unifiedTicket) {
        console.error('❌ Respuesta inválida del servidor');
        setError('Error: Respuesta inválida del servidor');
        return;
      }

      const ticketId = unifiedTicket.ticket?.id || unifiedTicket.id;
      const ticketNumber = unifiedTicket.ticketNumber;
      const clientName = unifiedTicket.clientName;
      const queueCount = unifiedTicket.queueCount || 0;

      console.log('🔍 Datos extraídos del ticket:', {
        ticketId,
        ticketNumber,
        clientName,
        queueCount,
        originalData: unifiedTicket,
      });

      if (!ticketId) {
        console.error('❌ ID de ticket inválido', { ticketId, unifiedTicket });
        setError('Error: ID de ticket inválido');
        return;
      }

      // 🔧 VALIDACIÓN MÁS FLEXIBLE PARA TICKET NUMBER
      if (!ticketNumber && ticketNumber !== 0) {
        console.error('❌ Número de ticket inválido', {
          ticketNumber,
          unifiedTicket,
        });
        setError('Error: Número de ticket inválido');
        return;
      }

      setError(null);

      const displayName = clientName || `Cliente #${ticketNumber}`;

      console.log('✅ Configurando nuevo ticket:', {
        ticketId,
        displayName,
        queueCount,
      });

      setCurrentTicketId(ticketId);
      setFlowStep('called');
      setPendingAction(null);

      setTicketStatus({
        operatorId: 'OP-001',
        status: 'CALLED',
        currentClient: displayName,
        queueCount: queueCount,
        canTakeNext: false,
        lastAction: 'none',
      });
    },
    [
      setCurrentTicketId,
      setPendingAction,
      setFlowStep,
      setTicketStatus,
      setError,
    ],
  );

  return {
    handleTicketCompleted,
    handleNextTicketCalled,
  };
};
