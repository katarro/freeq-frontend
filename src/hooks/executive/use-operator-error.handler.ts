import { useCallback } from 'react';
import { toast } from 'sonner';
import { OperatorTicketStatus } from '@/types/ticket';

interface UseOperatorErrorHandlerProps {
  setTicketStatus: (status: OperatorTicketStatus) => void;
  setCurrentTicketId: (id: string | null) => void;
  setPendingAction: (action: 'absent' | 'completed' | null) => void;
  setFlowStep: (step: 'waiting' | 'called' | 'completed') => void;
  clearCurrentTicket: () => void;
}

export const useOperatorErrorHandler = ({
  setTicketStatus,
  setCurrentTicketId,
  setPendingAction,
  setFlowStep,
  clearCurrentTicket,
}: UseOperatorErrorHandlerProps) => {
  const handleError = useCallback(
    (errorMessage: string) => {
      console.error('🚨 Error en OperatorContext:', errorMessage);

      switch (true) {
        // Errores de módulo/configuración
        case errorMessage.includes('No tienes un módulo asignado'):
        case errorMessage.includes('módulo'):
          toast.error(
            '⚠️ Error de configuración: No tienes un módulo asignado. Contacta al administrador.',
          );
          setTicketStatus({
            operatorId: 'OP-001',
            status: 'WAITING',
            currentClient: null,
            queueCount: 0,
            canTakeNext: false,
            lastAction: 'none',
          });
          break;

        // Errores de cola vacía
        case errorMessage.includes('No hay tickets en espera'):
          toast.info(
            '📭 No hay tickets en espera. Esperando nuevos clientes...',
          );
          break;

        case errorMessage.includes('No hay nadie en cola'):
        case errorMessage.includes('cola vacía'):
          toast.info(
            '📭 No hay clientes en cola. Esperando nuevos clientes...',
          );
          setTicketStatus({
            operatorId: 'OP-001',
            status: 'WAITING',
            currentClient: null,
            queueCount: 0,
            canTakeNext: true,
            lastAction: 'none',
          });
          setCurrentTicketId(null);
          setPendingAction(null);
          setFlowStep('waiting');
          break;

        // Errores de autenticación
        case errorMessage.includes('Token'):
        case errorMessage.includes('Unauthorized'):
        case errorMessage.includes('401'):
          toast.error(
            '🔐 Sesión expirada. Por favor, inicia sesión nuevamente.',
          );
          break;

        // Errores de conexión
        case errorMessage.includes('conectar'):
        case errorMessage.includes('Network'):
        case errorMessage.includes('fetch'):
        case errorMessage.includes('Failed to fetch'):
          toast.error(
            '🌐 No se pudo conectar con el servidor. Verifica tu conexión.',
          );
          break;

        // Errores del servidor
        case errorMessage.includes('500'):
        case errorMessage.includes('Error interno'):
          toast.error(
            '🔧 Error del servidor. Inténtalo nuevamente en unos minutos.',
          );
          break;

        // Errores de datos incorrectos (400)
        case errorMessage.includes('400'):
        case errorMessage.includes('Bad Request'):
        case errorMessage.includes('inválido'):
          toast.error(
            '📝 Error en los datos enviados. Verifica la configuración.',
          );
          console.error('🔍 Detalles del error 400:', errorMessage);
          break;

        // Errores de permisos
        case errorMessage.includes('403'):
        case errorMessage.includes('Forbidden'):
        case errorMessage.includes('permisos'):
          toast.error('🚫 No tienes permisos para realizar esta acción.');
          break;

        // Errores específicos de tickets
        case errorMessage.includes('Ticket'):
        case errorMessage.includes('ticket'):
          toast.error('🎫 Error procesando el ticket. Inténtalo nuevamente.');
          break;

        // Errores de cola
        case errorMessage.includes('Cola'):
        case errorMessage.includes('queue'):
          toast.error('📋 Error en la cola. Verifica el estado del sistema.');
          break;

        default:
          console.error('🚨 Error no categorizado:', errorMessage);
          toast.error('❌ Error inesperado. Por favor, inténtalo de nuevo.');

          // Para debug en desarrollo
          if (process.env.NODE_ENV === 'development') {
            console.log('🔍 Error completo para debug:', errorMessage);
          }
          break;
      }
    },
    [
      setTicketStatus,
      setCurrentTicketId,
      setPendingAction,
      setFlowStep,
      clearCurrentTicket,
    ],
  );

  return { handleError };
};
