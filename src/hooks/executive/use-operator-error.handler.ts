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
        // ✅ ERRORES DE ESTRUCTURA DE DATOS - NUEVOS CASOS
        case errorMessage.includes('Error crítico: Ticket ID y User ID son iguales'):
        case errorMessage.includes('Error crítico: No se pudo identificar el ticket ID válido'):
        case errorMessage.includes('Error en la estructura del ticket'):
        case errorMessage.includes('ID inválido después de la extracción'):
          console.log('🔧 Error de estructura de datos detectado - No resetear estado');
          toast.error('⚠️ Error en la estructura del ticket. Reintentando automáticamente...');
          // NO resetear el estado, permitir que el sistema reintente
          break;

        // ✅ CASO ESPECIAL: Ticket undefined rechazado - Llamar siguiente automáticamente
        case errorMessage.includes('Ticket sin información válida'):
        case errorMessage.includes('Cliente sin datos válidos'):
          console.log('🔄 Ticket con datos inválidos, el sistema manejará automáticamente...');
          toast.info('📋 Procesando ticket con datos incompletos...');
          // No cambiar estado, mantener el flujo para que reintente
          break;

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

        // Errores de cola vacía - CASOS NORMALES
        case errorMessage.includes('No hay tickets en espera'):
          toast.info('📭 Cola vacía. Esperando nuevos clientes...');
          setFlowStep('waiting');
          clearCurrentTicket();
          break;

        case errorMessage.includes('No hay nadie en cola'):
        case errorMessage.includes('cola vacía'):
          toast.info('📭 Cola vacía. Esperando nuevos clientes...');

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
          toast.error('🔐 Sesión expirada. Por favor, inicia sesión nuevamente.');
          break;

        // Errores de conexión
        case errorMessage.includes('conectar'):
        case errorMessage.includes('Network'):
        case errorMessage.includes('fetch'):
        case errorMessage.includes('Failed to fetch'):
        case errorMessage.includes('Error de conexión'):
          toast.error('🌐 No se pudo conectar con el servidor. Verifica tu conexión.');
          break;

        // Errores del servidor
        case errorMessage.includes('500'):
        case errorMessage.includes('Error interno'):
        case errorMessage.includes('Error del servidor'):
          toast.error('🔧 Error del servidor. Inténtalo nuevamente en unos minutos.');
          break;

        // Errores de datos incorrectos (400)
        case errorMessage.includes('400'):
        case errorMessage.includes('Bad Request'):
        case errorMessage.includes('inválido'):
          console.error('🔍 Detalles del error 400:', errorMessage);

          // ✅ MANEJO ESPECÍFICO PARA ERRORES DE TICKET ID
          if (
            errorMessage.includes('ID de ticket inválido') ||
            errorMessage.includes('ticket inválido')
          ) {
            toast.warning('⚠️ Ticket inválido detectado. Pasando al siguiente...');
            setFlowStep('waiting');
            clearCurrentTicket();
          } else {
            toast.error('📝 Error en los datos enviados. Verifica la configuración.');
          }
          break;

        // Errores de permisos
        case errorMessage.includes('403'):
        case errorMessage.includes('Forbidden'):
        case errorMessage.includes('permisos'):
          toast.error('🚫 No tienes permisos para realizar esta acción.');
          break;

        // Errores específicos de tickets
        case errorMessage.includes('Ticket no encontrado'):
        case errorMessage.includes('ticket no existe'):
          toast.warning('⚠️ El ticket no existe o ya fue procesado. Continuando...');
          setFlowStep('waiting');
          clearCurrentTicket();
          break;

        case errorMessage.includes('ya procesado'):
        case errorMessage.includes('ya fue procesado'):
          toast.warning('⚠️ El ticket ya fue procesado por otro ejecutivo');
          setFlowStep('waiting');
          clearCurrentTicket();
          break;

        // Errores de cola
        case errorMessage.includes('Cola'):
        case errorMessage.includes('queue'):
          toast.error('📋 Error en la cola. Verifica el estado del sistema.');
          break;

        // ✅ ERRORES CRÍTICOS QUE REQUIEREN RESET COMPLETO
        case errorMessage.includes('fatal'):
        case errorMessage.includes('crítico sistema'):
          console.log('🔄 Error crítico del sistema, reseteando completamente...');
          toast.error('❌ Error crítico del sistema. Reiniciando estado...');
          setFlowStep('waiting');
          clearCurrentTicket();
          setPendingAction(null);
          setTicketStatus({
            operatorId: 'OP-001',
            status: 'WAITING',
            currentClient: null,
            queueCount: 0,
            canTakeNext: true,
            lastAction: 'none',
          });
          break;

        default:
          console.error('🚨 Error no categorizado:', errorMessage);

          // ✅ CATEGORIZACIÓN AUTOMÁTICA BASADA EN PALABRAS CLAVE
          if (
            errorMessage.toLowerCase().includes('timeout') ||
            errorMessage.toLowerCase().includes('time out')
          ) {
            toast.error('⏰ Tiempo de espera agotado. Inténtalo de nuevo.');
          } else if (
            errorMessage.toLowerCase().includes('parse') ||
            errorMessage.toLowerCase().includes('json')
          ) {
            toast.error('📝 Error procesando respuesta del servidor.');
          } else {
            toast.error('❌ Error inesperado. Por favor, inténtalo de nuevo.');
          }

          // Para debug en desarrollo
          if (process.env.NODE_ENV === 'development') {
            console.log('🔍 Error completo para debug:', errorMessage);
          }
          break;
      }
    },
    [setTicketStatus, setCurrentTicketId, setPendingAction, setFlowStep, clearCurrentTicket],
  );

  return { handleError };
};
