import { useOperatorContext } from '@/contexts/OperatorContext';
import { useEffect, useMemo, useState } from 'react';

interface IControlPanel {
  elapsedTime: string;
  isUndefinedClient: boolean;
  isClientCalled: boolean;
  buttonEnabled: boolean;
  buttonText: string;
  clientInfo: {
    title: string;
    subtitle: string;
    badgeColor: string;
    showTimer: boolean;
    status: string;
    statusColor: string;
    isSpecialCase: boolean;
  } | null;
  flowStatus: {
    message: string;
    color: string;
    icon: string;
  };
  startTime: Date | null;
  setStartTime: (time: Date | null) => void;
  getClientStatusInfo: () => any;
  getFlowStatusMessage: () => any;
}

export function useControlPanel(): IControlPanel {
  const {
    ticketStatus,
    pendingAction,
    isLoading,
    flowStep,
    handleNext,
    handleAbsent,
    handleCompleted,
    isNextButtonEnabled,
    getNextButtonText,
  } = useOperatorContext();

  // 🔧 TIMER: Estado para tiempo transcurrido
  const [elapsedTime, setElapsedTime] = useState('0:00');
  const [startTime, setStartTime] = useState<Date | null>(null);

  // ✅ FUNCIÓN AUXILIAR: Detectar cliente undefined mejorada
  const isUndefinedClient = useMemo(() => {
    const clientName = ticketStatus?.currentClient || '';
    if (!clientName || clientName.trim() === '') return true;

    const invalidPatterns = [
      'undefined',
      '#undefined',
      'Cliente #undefined',
      'null',
      'Cliente null',
      'Sin nombre',
      'Cliente #Sin',
    ];

    return invalidPatterns.some((pattern) =>
      clientName.toLowerCase().includes(pattern.toLowerCase()),
    );
  }, [ticketStatus?.currentClient]);

  // ✅ ESTADO DERIVADO: ¿hay un cliente llamado válido?
  const isClientCalled = useMemo(() => {
    return (
      ticketStatus?.status === 'CALLED' &&
      !!ticketStatus?.currentClient &&
      !isUndefinedClient
    );
  }, [ticketStatus?.status, ticketStatus?.currentClient, isUndefinedClient]);

  // Estados de los botones
  const buttonEnabled = isNextButtonEnabled();
  const buttonText = getNextButtonText();

  // 🔧 EFECTO: Iniciar timer cuando se llama un cliente VÁLIDO
  useEffect(() => {
    if (isClientCalled && !startTime) {
      // console.log(
      //   '⏱️ Iniciando timer para cliente:',
      //   ticketStatus?.currentClient,
      // );
      setStartTime(new Date());
    } else if (!isClientCalled && startTime) {
      // console.log('⏱️ Deteniendo timer - cliente completado');
      setStartTime(null);
      setElapsedTime('0:00');
    }
  }, [isClientCalled, ticketStatus?.currentClient, startTime]);

  // 🔧 EFECTO: Actualizar timer cada segundo
  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (startTime && isClientCalled) {
      interval = setInterval(() => {
        const now = new Date();
        const diff = Math.floor((now.getTime() - startTime.getTime()) / 1000);
        const minutes = Math.floor(diff / 60);
        const seconds = diff % 60;
        setElapsedTime(`${minutes}:${seconds.toString().padStart(2, '0')}`);
      }, 1000);
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [startTime, isClientCalled]);

  // ✅ FUNCIÓN: Determinar el estado visual del cliente
  const getClientStatusInfo = () => {
    if (!ticketStatus?.currentClient) return null;

    // Cliente undefined - estado especial
    if (isUndefinedClient) {
      return {
        title: 'Cliente Sin Datos',
        subtitle: 'Datos incompletos',
        badgeColor: 'bg-orange-500 text-white',
        showTimer: false,
        status: 'Procesando...',
        statusColor: 'text-orange-600',
        isSpecialCase: true,
      };
    }

    // Cliente válido normal
    return {
      title: 'Cliente Llamado',
      subtitle: 'En atención',
      badgeColor: isClientCalled
        ? 'bg-blue-500 text-white'
        : 'bg-green-500 text-white',
      showTimer: true,
      status: isClientCalled ? 'Esperando respuesta' : 'En atención',
      statusColor: isClientCalled ? 'text-blue-600' : 'text-green-600',
      isSpecialCase: false,
    };
  };

  const clientInfo = getClientStatusInfo();

  // ✅ FUNCIÓN: Obtener el mensaje de estado del flujo mejorado
  const getFlowStatusMessage = () => {
    switch (flowStep) {
      case 'waiting':
        return {
          message: 'Listo para llamar al siguiente cliente',
          color: 'text-blue-600',
          icon: '👋',
        };
      case 'called':
        if (isUndefinedClient) {
          return {
            message: 'Cliente con datos incompletos detectado',
            color: 'text-orange-600',
            icon: '⚠️',
          };
        }
        if (pendingAction) {
          const action =
            pendingAction === 'completed' ? 'completado' : 'ausente';
          return {
            message: `Cliente será marcado como ${action}`,
            color:
              pendingAction === 'completed' ? 'text-green-600' : 'text-red-600',
            icon: pendingAction === 'completed' ? '✅' : '❌',
          };
        }
        return {
          message: 'Esperando selección de estado del cliente',
          color: 'text-amber-600',
          icon: '⏳',
        };
      case 'completed':
        return {
          message: 'Atención finalizada. Listo para siguiente cliente',
          color: 'text-green-600',
          icon: '✅',
        };
      default:
        return {
          message: 'Estado desconocido',
          color: 'text-gray-600',
          icon: '❓',
        };
    }
  };

  const flowStatus = getFlowStatusMessage();

  return {
    elapsedTime,
    isUndefinedClient,
    isClientCalled,
    buttonEnabled,
    buttonText,
    clientInfo,
    flowStatus,
    startTime,
    setStartTime,
    getClientStatusInfo,
    getFlowStatusMessage,
  };
}
