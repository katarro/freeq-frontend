import { Play, UserX, CheckCircle, Timer, Check, X } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../ui/card';
import { Button } from '../../ui/button';
import { Badge } from '../../ui/badge';
import { useOperatorContext } from '@/contexts/OperatorContext';
import { useControlPanel } from '@/hooks/executive/use-control-panel';

export function ControlPanel() {
  const {
    ticketStatus,
    pendingAction,
    isLoading,
    flowStep,
    handleNext,
    handleAbsent,
    handleCompleted,
  } = useOperatorContext();

  const {
    buttonText,
    clientInfo,
    flowStatus,
    startTime,
    elapsedTime,
    buttonEnabled,
    isUndefinedClient,
  } = useControlPanel();

  return (
    <Card>
      <CardHeader className="pb-6">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <CardTitle className="text-2xl">Control de Atención</CardTitle>

            {/* 🔧 ESTADO DEL FLUJO */}
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
        {/* 🔧 CONTROLES PRINCIPALES */}
        <div className="flex flex-col space-y-4">
          {/* BOTÓN PRINCIPAL */}
          <Button
            onClick={handleNext}
            disabled={!buttonEnabled}
            size="lg"
            className={`h-16 text-lg font-semibold transition-all duration-200 ${
              pendingAction
                ? 'bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg'
                : ''
            } ${isLoading ? 'opacity-75 cursor-not-allowed' : ''} ${
              !buttonEnabled ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            <Play className={`h-6 w-6 mr-3 ${isLoading ? 'animate-pulse' : ''}`} />
            {buttonText}
          </Button>

          {/* ✅ BOTONES DE ACCIÓN - LÓGICA MEJORADA */}
          {ticketStatus?.status === 'CALLED' && ticketStatus?.currentClient && (
            <>
              {isUndefinedClient ? (
                // Cliente undefined - Solo mostrar información
                <div className="p-4 bg-orange-50 rounded-lg border border-orange-200">
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-orange-500 rounded-full mr-3 animate-pulse"></div>
                    <p className="text-base text-orange-700 font-medium">
                      Cliente sin datos válidos detectado. Presione 'Finalizar atención' para
                      continuar automáticamente.
                    </p>
                  </div>
                  <p className="text-sm text-orange-600 mt-2 ml-5">
                    El sistema procesará este ticket sin requerir acciones adicionales.
                  </p>
                </div>
              ) : (
                // Cliente válido - Mostrar botones normales
                <div className="grid grid-cols-2 gap-4">
                  <Button
                    onClick={handleAbsent}
                    disabled={pendingAction === 'completed'}
                    variant="outline"
                    className={`w-full relative h-16 text-lg font-semibold transition-all duration-200 ${
                      pendingAction === 'absent'
                        ? 'bg-destructive/20 text-destructive border-destructive/30 hover:bg-destructive/30 shadow-md'
                        : pendingAction === 'completed'
                          ? 'opacity-40 cursor-not-allowed'
                          : 'hover:bg-destructive/10 hover:border-destructive hover:text-destructive'
                    }`}
                  >
                    <UserX className="h-6 w-6 mr-3" />
                    <span>Ausente</span>
                    {pendingAction === 'absent' && (
                      <div className="absolute -top-1 -right-1 w-3 h-3 bg-destructive rounded-full animate-pulse"></div>
                    )}
                  </Button>

                  <Button
                    onClick={handleCompleted}
                    disabled={pendingAction === 'absent'}
                    variant="outline"
                    className={`w-full relative h-16 text-lg font-semibold transition-all duration-200 ${
                      pendingAction === 'completed'
                        ? 'bg-green-500 text-white border-green-500 hover:bg-green-600 shadow-md'
                        : pendingAction === 'absent'
                          ? 'opacity-40 cursor-not-allowed'
                          : 'hover:bg-green-50 hover:border-green-500 hover:text-green-700'
                    }`}
                  >
                    <CheckCircle className="h-6 w-6 mr-3" />
                    <span>Completado</span>
                    {pendingAction === 'completed' && (
                      <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-600 rounded-full animate-pulse"></div>
                    )}
                  </Button>
                </div>
              )}
            </>
          )}
        </div>

        {/* 🔧 ALERTAS Y ESTADOS */}

        {/* Advertencia: Debe seleccionar acción - Solo para clientes válidos */}
        {ticketStatus?.status === 'CALLED' && !pendingAction && !isUndefinedClient && (
          <div className="p-4 bg-amber-50 rounded-lg border border-amber-200">
            <div className="flex items-center">
              <div className="w-2 h-2 bg-amber-500 rounded-full mr-3 animate-pulse"></div>
              <p className="text-base text-amber-700 font-medium">
                Debe marcar como Completado o Ausente antes de finalizar la atención
              </p>
            </div>
          </div>
        )}

        {/* Confirmación de acción */}
        {pendingAction && ticketStatus?.status === 'CALLED' && !isUndefinedClient && (
          <div
            className={`p-4 rounded-lg border transition-all duration-200 ${
              pendingAction === 'absent'
                ? 'bg-red-50 border-red-200'
                : 'bg-green-50 border-green-200'
            }`}
          >
            <div className="flex items-center">
              {pendingAction === 'absent' ? (
                <X className="h-5 w-5 mr-3 text-red-600" />
              ) : (
                <Check className="h-5 w-5 mr-3 text-green-600" />
              )}
              <p
                className={`text-base font-medium ${
                  pendingAction === 'absent' ? 'text-red-700' : 'text-green-700'
                }`}
              >
                Cliente será marcado como '{pendingAction === 'absent' ? 'Ausente' : 'Completado'}'
              </p>
            </div>
            <p className="text-sm text-gray-600 mt-1 ml-8">
              Presione 'Finalizar atención' para confirmar y continuar
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
