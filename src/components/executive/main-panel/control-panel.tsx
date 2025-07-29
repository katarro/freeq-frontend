import { Play, UserX, CheckCircle, Timer, Clock } from 'lucide-react';
import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../ui/card';
import { Button } from '../../ui/button';
import { Badge } from '../../ui/badge';
import { useOperatorContext } from '@/contexts/OperatorContext';
import { useControlPanel } from '@/hooks/executive/use-control-panel';

// ✅ FACTORIES DE PRESENTACIÓN (UI Layer)
class ClientInfoFactory {
  static createUndefinedClientInfo() {
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

  static createValidClientInfo(isClientCalled: boolean) {
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

class FlowStatusFactory {
  static createWaitingStatus() {
    return {
      message: 'Listo para llamar al siguiente cliente',
      color: 'text-blue-600',
      icon: '👋',
    };
  }

  static createClientCalledStatus() {
    return {
      message: 'Cliente en atención - Seleccione el resultado',
      color: 'text-amber-600',
      icon: '⏳',
    };
  }

  static createUndefinedClientStatus() {
    return {
      message: 'Cliente con datos incompletos - Puede finalizar directamente',
      color: 'text-orange-600',
      icon: '⚠️',
    };
  }

  static createCompletedStatus() {
    return {
      message: 'Atención finalizada. Listo para siguiente cliente',
      color: 'text-green-600',
      icon: '✅',
    };
  }

  static createUnknownStatus() {
    return {
      message: 'Estado desconocido',
      color: 'text-gray-600',
      icon: '❓',
    };
  }
}

class ButtonStateFactory {
  static createWaitingState(isLoading: boolean) {
    return {
      nextClient: {
        enabled: !isLoading,
        text: isLoading ? 'Cargando...' : 'Llamar Siguiente Cliente',
        visible: true,
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

  static createClientCalledState(isLoading: boolean, isUndefinedClient: boolean) {
    return {
      nextClient: {
        enabled: false,
        text: 'Cliente en Atención',
        visible: false,
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
        visible: !isUndefinedClient,
      },
    };
  }

  static createCompletedState(isLoading: boolean) {
    return {
      nextClient: {
        enabled: !isLoading,
        text: isLoading ? 'Cargando...' : 'Llamar Siguiente Cliente',
        visible: true,
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

// Componente para mostrar información del cliente (SRP)
const ClientInfoDisplay = ({
  clientInfo,
  elapsedTime,
  currentClient,
}: {
  clientInfo: any;
  elapsedTime: string;
  currentClient?: string | number | null;
}) => {
  if (!clientInfo) return null;

  // Convertir currentClient a string para evitar errores de tipo
  const clientName = currentClient ? String(currentClient) : 'Cliente sin nombre';

  return (
    <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Badge className={clientInfo.badgeColor}>{clientInfo.title}</Badge>
          <div>
            <p className="font-medium text-gray-900">{clientName}</p>
            <p className="text-sm text-gray-600">{clientInfo.subtitle}</p>
          </div>
        </div>

        {clientInfo.showTimer && (
          <div className="flex items-center space-x-2 text-blue-600">
            <Clock className="h-4 w-4" />
            <span className="font-mono text-lg font-bold">{elapsedTime}</span>
          </div>
        )}
      </div>

      <div className="mt-3 pt-3 border-t border-blue-200">
        <p className={`text-sm font-medium ${clientInfo.statusColor}`}>{clientInfo.status}</p>
      </div>
    </div>
  );
};

// Componente para el botón de siguiente cliente (SRP)
const NextClientButton = ({
  buttonState,
  onCallNext,
  isLoading,
}: {
  buttonState: any;
  onCallNext: () => void;
  isLoading: boolean;
}) => {
  if (!buttonState.visible) return null;

  return (
    <Button
      onClick={onCallNext}
      disabled={!buttonState.enabled}
      size="lg"
      className={`h-16 text-lg font-semibold transition-all duration-200 bg-blue-600 hover:bg-blue-700 text-white ${
        isLoading ? 'opacity-75 cursor-not-allowed' : ''
      } ${!buttonState.enabled ? 'opacity-50 cursor-not-allowed' : ''}`}
    >
      <Play className={`h-6 w-6 mr-3 ${isLoading ? 'animate-pulse' : ''}`} />
      {buttonState.text}
    </Button>
  );
};

// Componente para botones de acción del cliente (SRP)
const ClientActionButtons = ({
  buttonStates,
  onCompleteClient,
  onMarkAbsent,
  isLoading,
  isUndefinedClient,
}: {
  buttonStates: any;
  onCompleteClient: () => void;
  onMarkAbsent: () => void;
  isLoading: boolean;
  isUndefinedClient: boolean;
}) => {
  const { completeClient, markAbsent } = buttonStates;

  if (!completeClient.visible && !markAbsent.visible) return null;

  return (
    <div className="space-y-4">
      {/* Información para clientes undefined */}
      {isUndefinedClient && (
        <div className="p-4 bg-orange-50 rounded-lg border border-orange-200">
          <div className="flex items-center">
            <div className="w-2 h-2 bg-orange-500 rounded-full mr-3 animate-pulse"></div>
            <p className="text-base text-orange-700 font-medium">
              Cliente sin datos válidos detectado. Puede finalizar la atención directamente.
            </p>
          </div>
          <p className="text-sm text-orange-600 mt-2 ml-5">
            El sistema procesará este ticket automáticamente.
          </p>
        </div>
      )}

      {/* Botones de acción */}
      <div className={`${markAbsent.visible ? 'grid grid-cols-2 gap-4' : ''}`}>
        {/* Botón Completar/Finalizar */}
        {completeClient.visible && (
          <Button
            onClick={onCompleteClient}
            disabled={!completeClient.enabled}
            size="lg"
            className={`${!markAbsent.visible ? 'w-full' : ''} h-16 text-lg font-semibold transition-all duration-200 ${
              isUndefinedClient
                ? 'bg-orange-600 hover:bg-orange-700 text-white'
                : 'bg-green-600 hover:bg-green-700 text-white'
            } ${isLoading ? 'opacity-75 cursor-not-allowed' : ''} ${
              !completeClient.enabled ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            <CheckCircle className={`h-6 w-6 mr-3 ${isLoading ? 'animate-pulse' : ''}`} />
            {completeClient.text}
          </Button>
        )}

        {/* Botón Marcar Ausente */}
        {markAbsent.visible && (
          <Button
            onClick={onMarkAbsent}
            disabled={!markAbsent.enabled}
            variant="outline"
            size="lg"
            className={`h-16 text-lg font-semibold transition-all duration-200 hover:bg-red-50 hover:border-red-500 hover:text-red-700 ${
              isLoading ? 'opacity-75 cursor-not-allowed' : ''
            } ${!markAbsent.enabled ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            <UserX className={`h-6 w-6 mr-3 ${isLoading ? 'animate-pulse' : ''}`} />
            {markAbsent.text}
          </Button>
        )}
      </div>
    </div>
  );
};

// Componente para alertas y notificaciones (SRP)
const StatusAlerts = ({
  flowStep,
  ticketStatus,
  isUndefinedClient,
}: {
  flowStep: string;
  ticketStatus: any;
  isUndefinedClient: boolean;
}) => {
  // Alerta para clientes válidos que necesitan selección
  if (
    flowStep === 'called' &&
    ticketStatus?.status === 'CALLED' &&
    !isUndefinedClient &&
    ticketStatus?.currentClient
  ) {
    return (
      <div className="p-4 bg-amber-50 rounded-lg border border-amber-200">
        <div className="flex items-center">
          <div className="w-2 h-2 bg-amber-500 rounded-full mr-3 animate-pulse"></div>
          <p className="text-base text-amber-700 font-medium">
            Seleccione el resultado de la atención para continuar
          </p>
        </div>
        <p className="text-sm text-amber-600 mt-2 ml-5">
          Use "Completar Cliente" si fue atendido o "Marcar Ausente" si no se presentó.
        </p>
      </div>
    );
  }

  return null;
};

// ✅ CLASE HELPER PARA MANEJAR EVENTOS DE COMPLETADO (SRP)
class TicketCompletionNotifier {
  private static completedTickets = new Set<string>();

  static notifyCompletion(ticketId: string, ticketStatus?: any): void {
    if (this.completedTickets.has(ticketId)) {
      console.log('🔄 Ticket ya notificado como completado:', ticketId);
      return;
    }

    this.completedTickets.add(ticketId);

    console.log('🎉 Notificando completado de ticket para encuesta:', ticketId);

    // ✅ EMITIR EVENTO PERSONALIZADO PARA TICKETCARD
    const completionEvent = new CustomEvent('controlPanelTicketCompleted', {
      detail: {
        ticketId,
        timestamp: new Date().toISOString(),
        source: 'control_panel',
        action: 'completed', // Indica que fue completado (no cancelado)
        operatorId: ticketStatus?.operatorId || null, // ID del operador que completó
        completionType: 'normal', // Tipo de completado (normal, ausente, etc.)
      },
      bubbles: true,
    });

    document.dispatchEvent(completionEvent);

    // Limpiar después de 30 segundos para evitar memory leaks
    setTimeout(() => {
      this.completedTickets.delete(ticketId);
    }, 30000);
  }

  static clearCompleted(): void {
    this.completedTickets.clear();
  }
}

export function ControlPanel() {
  const {
    ticketStatus,
    isLoading,
    flowStep,
    currentTicketId,
    handleCallNext,
    handleCompleteClient,
    handleMarkAbsent,
  } = useOperatorContext();

  // ✅ ESTADO LOCAL PARA PREVENIR DOBLE EJECUCIÓN
  const [isProcessingAction, setIsProcessingAction] = useState(false);

  // ✅ OBTENER DATOS PUROS DEL HOOK
  const {
    elapsedTime,
    isUndefinedClient,
    isClientCalled,
    hasCurrentClient,
    currentClient,
    nextClientEnabled,
    completeClientEnabled,
    markAbsentEnabled,
  } = useControlPanel();

  // ✅ LÓGICA DE PRESENTACIÓN EN EL COMPONENTE
  const clientInfo = hasCurrentClient
    ? isUndefinedClient
      ? ClientInfoFactory.createUndefinedClientInfo()
      : ClientInfoFactory.createValidClientInfo(isClientCalled)
    : null;

  const flowStatus = (() => {
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
  })();

  const buttonStates = (() => {
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
  })();

  // ✅ WRAPPER PARA COMPLETAR CLIENTE CON NOTIFICACIÓN
  const handleCompleteClientWithNotification = async () => {
    console.log(`🔴 [${Date.now()}] BOTÓN CLICKEADO`);

    // ✅ PREVENIR DOBLE EJECUCIÓN
    if (isProcessingAction || isLoading) {
      console.log('⚠️ Acción ya en progreso, ignorando click');
      return;
    }

    try {
      setIsProcessingAction(true);
      console.log('🎯 Iniciando completado de cliente:', currentTicketId);

      // Ejecutar la acción de completar
      await handleCompleteClient();

      // ✅ SOLO NOTIFICAR SI SE COMPLETÓ EXITOSAMENTE
      if (currentTicketId) {
        console.log('🎯 Notificando completado para encuesta:', currentTicketId);
        TicketCompletionNotifier.notifyCompletion(currentTicketId, ticketStatus);
      }
    } catch (error) {
      console.error('❌ Error completando cliente:', error);
      // ❌ NO NOTIFICAR SI HAY ERROR
      console.log('❌ No se notifica completado debido al error');
    } finally {
      setIsProcessingAction(false);
    }
  };

  // ✅ WRAPPER PARA MARCAR AUSENTE CON NOTIFICACIÓN
  const handleMarkAbsentWithNotification = async () => {
    // ✅ PREVENIR DOBLE EJECUCIÓN
    if (isProcessingAction || isLoading) {
      console.log('⚠️ Acción ya en progreso, ignorando click');
      return;
    }

    try {
      setIsProcessingAction(true);
      console.log('🎯 Iniciando marcado como ausente:', currentTicketId);

      // Ejecutar la acción de marcar ausente
      await handleMarkAbsent();

      // ✅ SOLO NOTIFICAR SI SE MARCÓ EXITOSAMENTE
      if (currentTicketId) {
        console.log('🎯 Notificando ausente como completado para encuesta:', currentTicketId);
        TicketCompletionNotifier.notifyCompletion(currentTicketId, ticketStatus);
      }
    } catch (error) {
      console.error('❌ Error marcando ausente:', error);
      // ❌ NO NOTIFICAR SI HAY ERROR
      console.log('❌ No se notifica completado debido al error');
    } finally {
      setIsProcessingAction(false);
    }
  };

  return (
    <Card>
      <CardHeader className="pb-6">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <CardTitle className="text-2xl">Control de Atención</CardTitle>

            {/* Estado del flujo */}
            <div className="mt-2 flex items-center">
              <span className="mr-2">{flowStatus.icon}</span>
              <span className={`text-sm font-medium ${flowStatus.color}`}>
                {flowStatus.message}
              </span>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Información del cliente */}
        {clientInfo && (
          <ClientInfoDisplay
            clientInfo={clientInfo}
            elapsedTime={elapsedTime}
            currentClient={currentClient}
          />
        )}

        {/* Controles principales */}
        <div className="flex flex-col space-y-4">
          {/* Botón Siguiente Cliente */}
          <NextClientButton
            buttonState={buttonStates.nextClient}
            onCallNext={handleCallNext}
            isLoading={isLoading || isProcessingAction}
          />

          {/* Botones de acción del cliente */}
          <ClientActionButtons
            buttonStates={buttonStates}
            onCompleteClient={handleCompleteClientWithNotification}
            onMarkAbsent={handleMarkAbsentWithNotification}
            isLoading={isLoading || isProcessingAction}
            isUndefinedClient={isUndefinedClient}
          />
        </div>

        {/* Alertas y estados */}
        <StatusAlerts
          flowStep={flowStep}
          ticketStatus={ticketStatus}
          isUndefinedClient={isUndefinedClient}
        />
      </CardContent>
    </Card>
  );
}
