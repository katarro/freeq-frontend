import { Play, UserX, CheckCircle, Timer, Clock } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../ui/card';
import { Button } from '../../ui/button';
import { Badge } from '../../ui/badge';
import { useOperatorContext } from '@/contexts/OperatorContext';
import { useControlPanel } from '@/hooks/executive/use-control-panel';

// Componente para mostrar información del cliente (SRP)
const ClientInfoDisplay = ({
  clientInfo,
  elapsedTime,
  currentClient,
}: {
  clientInfo: any;
  elapsedTime: string;
  currentClient?: string;
}) => {
  if (!clientInfo) return null;

  return (
    <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Badge className={clientInfo.badgeColor}>{clientInfo.title}</Badge>
          <div>
            <p className="font-medium text-gray-900">{currentClient || 'Cliente sin nombre'}</p>
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

  static notifyCompletion(ticketId: string): void {
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

  const { elapsedTime, clientInfo, flowStatus, buttonStates, isUndefinedClient } =
    useControlPanel();

  // ✅ WRAPPER PARA COMPLETAR CLIENTE CON NOTIFICACIÓN
  const handleCompleteClientWithNotification = async () => {
    try {
      // Ejecutar la acción de completar
      await handleCompleteClient();

      // ✅ NOTIFICAR COMPLETADO PARA ENCUESTA
      if (currentTicketId) {
        console.log('🎯 Notificando completado para encuesta:', currentTicketId);
        TicketCompletionNotifier.notifyCompletion(currentTicketId);
      }
    } catch (error) {
      console.error('❌ Error completando cliente:', error);
    }
  };

  // ✅ WRAPPER PARA MARCAR AUSENTE CON NOTIFICACIÓN
  const handleMarkAbsentWithNotification = async () => {
    try {
      // Ejecutar la acción de marcar ausente
      await handleMarkAbsent();

      // ✅ NOTIFICAR COMPLETADO (ausente también es un tipo de completado)
      if (currentTicketId) {
        console.log('🎯 Notificando ausente como completado para encuesta:', currentTicketId);
        TicketCompletionNotifier.notifyCompletion(currentTicketId);
      }
    } catch (error) {
      console.error('❌ Error marcando ausente:', error);
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
            currentClient={ticketStatus?.currentClient}
          />
        )}

        {/* Controles principales */}
        <div className="flex flex-col space-y-4">
          {/* Botón Siguiente Cliente */}
          <NextClientButton
            buttonState={buttonStates.nextClient}
            onCallNext={handleCallNext}
            isLoading={isLoading}
          />

          {/* Botones de acción del cliente */}
          <ClientActionButtons
            buttonStates={buttonStates}
            onCompleteClient={handleCompleteClientWithNotification}
            onMarkAbsent={handleMarkAbsentWithNotification}
            isLoading={isLoading}
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
