import { useOperatorContext } from '@/contexts/OperatorContext';
import { useEffect, useMemo, useState } from 'react';

// Interfaces para datos puros (sin lógica de presentación)
interface IControlPanelData {
  // Estados de validación
  isUndefinedClient: boolean;
  isClientCalled: boolean;

  // Datos del cliente
  currentClient: string | number | null;
  hasCurrentClient: boolean;

  // Timer
  elapsedTime: string;
  startTime: Date | null;
  setStartTime: (time: Date | null) => void;

  // Estados del flujo
  flowStep: string;
  ticketStatus: any;
  isLoading: boolean;

  // Estados de botones (datos puros)
  nextClientEnabled: boolean;
  completeClientEnabled: boolean;
  markAbsentEnabled: boolean;

  // Backward compatibility
  buttonEnabled: boolean;
  buttonText: string;
}

// Constantes para validación
const INVALID_CLIENT_PATTERNS = [
  'undefined',
  '#undefined',
  'Cliente #undefined',
  'null',
  'Cliente null',
  'Sin nombre',
  'Cliente #Sin',
] as const;

const TIMER_INTERVAL = 1000;

// Clase helper para validación de clientes (SRP)
class ClientValidator {
  static isUndefinedClient(clientName: string | undefined): boolean {
    if (!clientName || clientName.trim() === '') return true;

    return INVALID_CLIENT_PATTERNS.some((pattern) =>
      clientName.toLowerCase().includes(pattern.toLowerCase()),
    );
  }
}

// Clase helper para manejo de tiempo (SRP)
class TimerService {
  static formatElapsedTime(startTime: Date): string {
    const now = new Date();
    const diff = Math.floor((now.getTime() - startTime.getTime()) / 1000);
    const minutes = Math.floor(diff / 60);
    const seconds = diff % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  }
}

export function useControlPanel(): IControlPanelData {
  const {
    ticketStatus,
    pendingAction,
    isLoading,
    flowStep,
    isNextButtonEnabled,
    getNextButtonText,
    startAttendingTicket,
    currentTicketId,
    setTicketStatus,
  } = useOperatorContext();

  // ✅ ESTADO PARA TIMER
  const [elapsedTime, setElapsedTime] = useState('0:00');
  const [startTime, setStartTime] = useState<Date | null>(null);

  // Memoización de validaciones (datos puros)
  const isUndefinedClient = useMemo(() => {
    const clientName = ticketStatus?.currentClient ? String(ticketStatus.currentClient) : undefined;
    return ClientValidator.isUndefinedClient(clientName);
  }, [ticketStatus?.currentClient]);

  const isClientCalled = useMemo(() => {
    // Un cliente está siendo atendido si está en estado CALLED o ATTENDING
    const isInService = ticketStatus?.status === 'CALLED' || ticketStatus?.status === 'ATTENDING';
    return isInService && !!ticketStatus?.currentClient && !isUndefinedClient;
  }, [ticketStatus?.status, ticketStatus?.currentClient, isUndefinedClient]);

  const hasCurrentClient = useMemo(() => {
    return !!ticketStatus?.currentClient;
  }, [ticketStatus?.currentClient]);

  // ✅ LÓGICA PURA: Estados de botones (sin presentación)
  const nextClientEnabled = useMemo(() => {
    if (isLoading) return false;
    if (flowStep === 'called' && hasCurrentClient) return false;
    return flowStep === 'waiting' || flowStep === 'completed';
  }, [isLoading, flowStep, hasCurrentClient]);

  const completeClientEnabled = useMemo(() => {
    if (isLoading) return false;
    return flowStep === 'called' && hasCurrentClient;
  }, [isLoading, flowStep, hasCurrentClient]);

  const markAbsentEnabled = useMemo(() => {
    if (isLoading) return false;
    if (isUndefinedClient) return false;
    return flowStep === 'called' && hasCurrentClient && !isUndefinedClient;
  }, [isLoading, flowStep, hasCurrentClient, isUndefinedClient]);

  // ✅ BACKWARD COMPATIBILITY: Estados de botones legacy
  const buttonEnabled =
    typeof isNextButtonEnabled === 'function' ? isNextButtonEnabled() : isNextButtonEnabled;

  const buttonText =
    typeof getNextButtonText === 'function'
      ? getNextButtonText()
      : getNextButtonText || 'Siguiente';

  // ✅ EFECTO: Iniciar timer cuando se llama un cliente VÁLIDO
  useEffect(() => {
    // 🔍 DEBUG: Estado completo del ticket
    console.log('🔍 DEBUG Timer - Estado completo:', {
      isClientCalled,
      startTime: !!startTime,
      currentClient: ticketStatus?.currentClient,
      ticketStatus: ticketStatus?.status,
      flowStep,
      isUndefinedClient,
      ticketStatusObject: ticketStatus,
    });

    if (isClientCalled && !startTime) {
      console.log('⏱️ Iniciando timer para cliente:', ticketStatus?.currentClient);

      // 🔄 TRANSICIÓN AUTOMÁTICA: CALLED → ATTENDING
      if (ticketStatus?.status === 'CALLED' && currentTicketId) {
        console.log('🔄 Transición automática CALLED → ATTENDING para ticket:', currentTicketId);

        // Intentar marcar como ATTENDING en el backend
        startAttendingTicket(currentTicketId)
          .then((result) => {
            if (!result?.localOnly) {
              console.log('✅ Ticket marcado como ATTENDING en backend');
            } else {
              console.log('⚠️ Manejando transición localmente');
              // Actualizar estado local
              setTicketStatus({
                ...ticketStatus,
                status: 'ATTENDING',
              });
            }
          })
          .catch((error) => {
            console.warn('⚠️ Error en transición a ATTENDING, continuando localmente:', error);
            // Actualizar estado local como fallback
            setTicketStatus({
              ...ticketStatus,
              status: 'ATTENDING',
            });
          });
      }

      setStartTime(new Date());
    } else if (!isClientCalled && startTime) {
      console.log('⏱️ Deteniendo timer - cliente completado');
      setStartTime(null);
      setElapsedTime('0:00');
    }
  }, [
    isClientCalled,
    ticketStatus?.currentClient,
    startTime,
    flowStep,
    isUndefinedClient,
    ticketStatus,
    currentTicketId,
    startAttendingTicket,
    setTicketStatus,
  ]);

  // ✅ EFECTO: Actualizar timer cada segundo
  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (startTime && isClientCalled) {
      interval = setInterval(() => {
        setElapsedTime(TimerService.formatElapsedTime(startTime));
      }, TIMER_INTERVAL);
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [startTime, isClientCalled]);

  return {
    // Estados de validación
    isUndefinedClient,
    isClientCalled,

    // Datos del cliente
    currentClient: ticketStatus?.currentClient ?? null,
    hasCurrentClient,

    // Timer
    elapsedTime,
    startTime,
    setStartTime,

    // Estados del flujo
    flowStep,
    ticketStatus,
    isLoading,

    // Estados de botones (datos puros)
    nextClientEnabled,
    completeClientEnabled,
    markAbsentEnabled,

    // Backward compatibility
    buttonEnabled,
    buttonText,
  };
}
