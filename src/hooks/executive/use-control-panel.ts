import { useOperatorContext } from '@/contexts/OperatorContext';
import { useEffect, useMemo, useState } from 'react';

// Interfaces segregadas según ISP (Interface Segregation Principle)
interface IClientInfo {
  title: string;
  subtitle: string;
  badgeColor: string;
  showTimer: boolean;
  status: string;
  statusColor: string;
  isSpecialCase: boolean;
}

interface IFlowStatus {
  message: string;
  color: string;
  icon: string;
}

interface IButtonStates {
  nextClient: {
    enabled: boolean;
    text: string;
    visible: boolean;
  };
  completeClient: {
    enabled: boolean;
    text: string;
    visible: boolean;
  };
  markAbsent: {
    enabled: boolean;
    text: string;
    visible: boolean;
  };
}

interface IControlPanel {
  // ✅ MANTENER COMPATIBILIDAD CON StatusCards
  elapsedTime: string;
  startTime: Date | null;
  setStartTime: (time: Date | null) => void;

  // Estados de validación
  isUndefinedClient: boolean;
  isClientCalled: boolean;

  // Información del cliente y flujo
  clientInfo: IClientInfo | null;
  flowStatus: IFlowStatus;

  // Estados de botones (nuevo diseño)
  buttonStates: IButtonStates;

  // Funciones helper
  getClientStatusInfo: () => IClientInfo | null;
  getFlowStatusMessage: () => IFlowStatus;
  getButtonStates: () => IButtonStates;

  // ✅ MANTENER BACKWARD COMPATIBILITY
  buttonEnabled: boolean; // Para componentes legacy
  buttonText: string; // Para componentes legacy
}

// Constantes siguiendo DRY principle
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

// Clase helper para manejo de tiempo (SRP - Single Responsibility Principle)
class TimerService {
  static formatElapsedTime(startTime: Date): string {
    const now = new Date();
    const diff = Math.floor((now.getTime() - startTime.getTime()) / 1000);
    const minutes = Math.floor(diff / 60);
    const seconds = diff % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  }
}

// Clase helper para validación de clientes (SRP)
class ClientValidator {
  static isUndefinedClient(clientName: string | undefined): boolean {
    if (!clientName || clientName.trim() === '') return true;

    return INVALID_CLIENT_PATTERNS.some((pattern) =>
      clientName.toLowerCase().includes(pattern.toLowerCase()),
    );
  }
}

// Factory para crear información del cliente (Factory Pattern + SRP)
class ClientInfoFactory {
  static createUndefinedClientInfo(): IClientInfo {
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

  static createValidClientInfo(isClientCalled: boolean): IClientInfo {
    return {
      title: 'Cliente Llamado',
      subtitle: 'En atención',
      badgeColor: isClientCalled ? 'bg-blue-500 text-white' : 'bg-green-500 text-white',
      showTimer: true,
      status: isClientCalled ? 'Esperando respuesta' : 'En atención',
      statusColor: isClientCalled ? 'text-blue-600' : 'text-green-600',
      isSpecialCase: false,
    };
  }
}

// Factory para crear estados del flujo (Factory Pattern + SRP)
class FlowStatusFactory {
  static createWaitingStatus(): IFlowStatus {
    return {
      message: 'Listo para llamar al siguiente cliente',
      color: 'text-blue-600',
      icon: '👋',
    };
  }

  static createClientCalledStatus(): IFlowStatus {
    return {
      message: 'Cliente en atención - Seleccione el resultado',
      color: 'text-amber-600',
      icon: '⏳',
    };
  }

  static createUndefinedClientStatus(): IFlowStatus {
    return {
      message: 'Cliente con datos incompletos - Puede finalizar directamente',
      color: 'text-orange-600',
      icon: '⚠️',
    };
  }

  static createCompletedStatus(): IFlowStatus {
    return {
      message: 'Atención finalizada. Listo para siguiente cliente',
      color: 'text-green-600',
      icon: '✅',
    };
  }

  static createUnknownStatus(): IFlowStatus {
    return {
      message: 'Estado desconocido',
      color: 'text-gray-600',
      icon: '❓',
    };
  }
}

// Factory para crear estados de botones (Factory Pattern + SRP)
class ButtonStateFactory {
  static createWaitingState(isLoading: boolean): IButtonStates {
    return {
      nextClient: {
        enabled: !isLoading,
        text: isLoading ? 'Cargando...' : 'Llamar Siguiente Cliente',
        visible: true, // ✅ SIEMPRE VISIBLE cuando no hay cliente
      },
      completeClient: {
        enabled: false,
        text: 'Completar Cliente',
        visible: false,
      },
      markAbsent: {
        enabled: false,
        text: 'Marcar Ausente',
        visible: false,
      },
    };
  }

  static createClientCalledState(isLoading: boolean, isUndefinedClient: boolean): IButtonStates {
    return {
      nextClient: {
        enabled: false,
        text: 'Cliente en Atención',
        visible: false, // ✅ OCULTO cuando hay cliente en atención
      },
      completeClient: {
        enabled: !isLoading,
        text: isLoading
          ? 'Procesando...'
          : isUndefinedClient
            ? 'Finalizar Atención'
            : 'Completar Cliente',
        visible: true,
      },
      markAbsent: {
        enabled: !isLoading && !isUndefinedClient,
        text: isLoading ? 'Procesando...' : 'Marcar Ausente',
        visible: !isUndefinedClient, // No mostrar para clientes undefined
      },
    };
  }

  static createCompletedState(isLoading: boolean): IButtonStates {
    return {
      nextClient: {
        enabled: !isLoading,
        text: isLoading ? 'Cargando...' : 'Llamar Siguiente Cliente',
        visible: true, // ✅ VISIBLE después de completar para llamar al siguiente
      },
      completeClient: {
        enabled: false,
        text: 'Completar Cliente',
        visible: false,
      },
      markAbsent: {
        enabled: false,
        text: 'Marcar Ausente',
        visible: false,
      },
    };
  }
}

export function useControlPanel(): IControlPanel {
  const {
    ticketStatus,
    pendingAction,
    isLoading,
    flowStep,
    isNextButtonEnabled,
    getNextButtonText,
  } = useOperatorContext();

  // ✅ ESTADO PARA TIMER (Compatible con StatusCards)
  const [elapsedTime, setElapsedTime] = useState('0:00');
  const [startTime, setStartTime] = useState<Date | null>(null);

  // Memoización de validaciones (OCP - Open/Closed Principle)
  const isUndefinedClient = useMemo(() => {
    return ClientValidator.isUndefinedClient(ticketStatus?.currentClient);
  }, [ticketStatus?.currentClient]);

  const isClientCalled = useMemo(() => {
    return ticketStatus?.status === 'CALLED' && !!ticketStatus?.currentClient && !isUndefinedClient;
  }, [ticketStatus?.status, ticketStatus?.currentClient, isUndefinedClient]);

  // ✅ BACKWARD COMPATIBILITY: Estados de botones legacy
  const buttonEnabled =
    typeof isNextButtonEnabled === 'function' ? isNextButtonEnabled() : isNextButtonEnabled;

  const buttonText =
    typeof getNextButtonText === 'function'
      ? getNextButtonText()
      : getNextButtonText || 'Siguiente';

  // ✅ EFECTO: Iniciar timer cuando se llama un cliente VÁLIDO
  useEffect(() => {
    if (isClientCalled && !startTime) {
      console.log('⏱️ Iniciando timer para cliente:', ticketStatus?.currentClient);
      setStartTime(new Date());
    } else if (!isClientCalled && startTime) {
      console.log('⏱️ Deteniendo timer - cliente completado');
      setStartTime(null);
      setElapsedTime('0:00');
    }
  }, [isClientCalled, ticketStatus?.currentClient, startTime]);

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

  // Función para obtener información del cliente (usando Factory)
  const getClientStatusInfo = (): IClientInfo | null => {
    if (!ticketStatus?.currentClient) return null;

    if (isUndefinedClient) {
      return ClientInfoFactory.createUndefinedClientInfo();
    }

    return ClientInfoFactory.createValidClientInfo(isClientCalled);
  };

  // Función para obtener estado del flujo (usando Factory)
  const getFlowStatusMessage = (): IFlowStatus => {
    switch (flowStep) {
      case 'waiting':
        return FlowStatusFactory.createWaitingStatus();

      case 'called':
        if (isUndefinedClient) {
          return FlowStatusFactory.createUndefinedClientStatus();
        }
        return FlowStatusFactory.createClientCalledStatus();

      case 'completed':
        return FlowStatusFactory.createCompletedStatus();

      default:
        return FlowStatusFactory.createUnknownStatus();
    }
  };

  // Función para obtener estados de botones (usando Factory)
  const getButtonStates = (): IButtonStates => {
    switch (flowStep) {
      case 'waiting':
        return ButtonStateFactory.createWaitingState(isLoading);

      case 'called':
        return ButtonStateFactory.createClientCalledState(isLoading, isUndefinedClient);

      case 'completed':
        return ButtonStateFactory.createCompletedState(isLoading);

      default:
        return ButtonStateFactory.createWaitingState(isLoading);
    }
  };

  const clientInfo = getClientStatusInfo();
  const flowStatus = getFlowStatusMessage();
  const buttonStates = getButtonStates();

  return {
    // ✅ COMPATIBILIDAD CON StatusCards
    elapsedTime,
    startTime,
    setStartTime,

    // Estados de validación
    isUndefinedClient,
    isClientCalled,

    // Información del cliente y flujo
    clientInfo,
    flowStatus,

    // Estados de botones (nuevo diseño)
    buttonStates,

    // Funciones helper
    getClientStatusInfo,
    getFlowStatusMessage,
    getButtonStates,

    // ✅ BACKWARD COMPATIBILITY
    buttonEnabled,
    buttonText,
  };
}
