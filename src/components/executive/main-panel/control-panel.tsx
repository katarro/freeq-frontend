import { Play, UserX, CheckCircle, Timer, Check, X } from 'lucide-react';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '../../ui/card';
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
      <CardHeader className='pb-6'>
        <div className='flex items-center justify-between'>
          <div className='flex-1'>
            <CardTitle className='text-2xl'>Control de Atención</CardTitle>
            <CardDescription className='text-lg'>
              {ticketStatus?.currentClient
                ? `Cliente actual: ${ticketStatus.currentClient}`
                : 'Sin cliente en atención'}
            </CardDescription>

            {/* 🔧 ESTADO DEL FLUJO */}
            <div className='mt-2 flex items-center'>
              <span className='mr-2'>{flowStatus.icon}</span>
              <span className={`text-sm font-medium ${flowStatus.color}`}>
                {flowStatus.message}
              </span>
            </div>
          </div>

          {/* 🔧 INDICADOR DE ESTADO */}
          <div className='text-right'>
            <Badge
              variant={
                flowStep === 'waiting'
                  ? 'secondary'
                  : flowStep === 'called'
                    ? isUndefinedClient
                      ? 'destructive'
                      : 'default'
                    : 'secondary'
              }
            >
              {flowStep.toUpperCase()}
            </Badge>
          </div>
        </div>
      </CardHeader>

      <CardContent className='space-y-6'>
        {/* 🔧 CONTROLES PRINCIPALES */}
        <div className='flex flex-col space-y-4'>
          {/* BOTÓN PRINCIPAL */}
          <Button
            onClick={handleNext}
            disabled={!buttonEnabled}
            size='lg'
            className={`h-16 text-lg font-semibold transition-all duration-200 ${
              pendingAction
                ? 'bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg'
                : ''
            } ${isLoading ? 'opacity-75 cursor-not-allowed' : ''} ${
              !buttonEnabled ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            <Play
              className={`h-6 w-6 mr-3 ${isLoading ? 'animate-pulse' : ''}`}
            />
            {buttonText}
          </Button>

          {/* ✅ BOTONES DE ACCIÓN - LÓGICA MEJORADA */}
          {ticketStatus?.status === 'CALLED' && ticketStatus?.currentClient && (
            <>
              {isUndefinedClient ? (
                // Cliente undefined - Solo mostrar información
                <div className='p-4 bg-orange-50 rounded-lg border border-orange-200'>
                  <div className='flex items-center'>
                    <div className='w-2 h-2 bg-orange-500 rounded-full mr-3 animate-pulse'></div>
                    <p className='text-base text-orange-700 font-medium'>
                      Cliente sin datos válidos detectado. Presione "Finalizar
                      atención" para continuar automáticamente.
                    </p>
                  </div>
                  <p className='text-sm text-orange-600 mt-2 ml-5'>
                    El sistema procesará este ticket sin requerir acciones
                    adicionales.
                  </p>
                </div>
              ) : (
                // Cliente válido - Mostrar botones normales
                <div className='grid grid-cols-2 gap-4'>
                  <Button
                    onClick={handleAbsent}
                    disabled={pendingAction === 'completed'}
                    variant='outline'
                    className={`w-full relative h-16 text-lg font-semibold transition-all duration-200 ${
                      pendingAction === 'absent'
                        ? 'bg-destructive/20 text-destructive border-destructive/30 hover:bg-destructive/30 shadow-md'
                        : pendingAction === 'completed'
                          ? 'opacity-40 cursor-not-allowed'
                          : 'hover:bg-destructive/10 hover:border-destructive hover:text-destructive'
                    }`}
                  >
                    <UserX className='h-6 w-6 mr-3' />
                    <span>Ausente</span>
                    {pendingAction === 'absent' && (
                      <div className='absolute -top-1 -right-1 w-3 h-3 bg-destructive rounded-full animate-pulse'></div>
                    )}
                  </Button>

                  <Button
                    onClick={handleCompleted}
                    disabled={pendingAction === 'absent'}
                    variant='outline'
                    className={`w-full relative h-16 text-lg font-semibold transition-all duration-200 ${
                      pendingAction === 'completed'
                        ? 'bg-green-500 text-white border-green-500 hover:bg-green-600 shadow-md'
                        : pendingAction === 'absent'
                          ? 'opacity-40 cursor-not-allowed'
                          : 'hover:bg-green-50 hover:border-green-500 hover:text-green-700'
                    }`}
                  >
                    <CheckCircle className='h-6 w-6 mr-3' />
                    <span>Completado</span>
                    {pendingAction === 'completed' && (
                      <div className='absolute -top-1 -right-1 w-3 h-3 bg-green-600 rounded-full animate-pulse'></div>
                    )}
                  </Button>
                </div>
              )}
            </>
          )}
        </div>

        {/* 🔧 ALERTAS Y ESTADOS */}

        {/* Advertencia: Debe seleccionar acción - Solo para clientes válidos */}
        {ticketStatus?.status === 'CALLED' &&
          !pendingAction &&
          !isUndefinedClient && (
            <div className='p-4 bg-amber-50 rounded-lg border border-amber-200'>
              <div className='flex items-center'>
                <div className='w-2 h-2 bg-amber-500 rounded-full mr-3 animate-pulse'></div>
                <p className='text-base text-amber-700 font-medium'>
                  Debe marcar como Completado o Ausente antes de finalizar la
                  atención
                </p>
              </div>
            </div>
          )}

        {/* Confirmación de acción */}
        {pendingAction &&
          ticketStatus?.status === 'CALLED' &&
          !isUndefinedClient && (
            <div
              className={`p-4 rounded-lg border transition-all duration-200 ${
                pendingAction === 'absent'
                  ? 'bg-red-50 border-red-200'
                  : 'bg-green-50 border-green-200'
              }`}
            >
              <div className='flex items-center'>
                {pendingAction === 'absent' ? (
                  <X className='h-5 w-5 mr-3 text-red-600' />
                ) : (
                  <Check className='h-5 w-5 mr-3 text-green-600' />
                )}
                <p
                  className={`text-base font-medium ${
                    pendingAction === 'absent'
                      ? 'text-red-700'
                      : 'text-green-700'
                  }`}
                >
                  Cliente será marcado como "
                  {pendingAction === 'absent' ? 'Ausente' : 'Completado'}"
                </p>
              </div>
              <p className='text-sm text-gray-600 mt-1 ml-8'>
                Presione "Finalizar atención" para confirmar y continuar
              </p>
            </div>
          )}

        {/* ✅ INFORMACIÓN DEL CLIENTE ACTUAL - MEJORADA */}
        {clientInfo && (
          <div className='p-5 bg-gray-50 rounded-lg border'>
            <div className='flex items-center justify-between mb-3'>
              <div>
                <span className='font-medium text-lg text-gray-800'>
                  {clientInfo.title}
                </span>
                <p className='text-sm text-gray-600'>{clientInfo.subtitle}</p>
                {clientInfo.isSpecialCase && (
                  <p className='text-xs text-orange-600 mt-1'>
                    ⚠️ Este ticket será procesado automáticamente
                  </p>
                )}
              </div>
              <Badge className={`text-base px-3 py-1 ${clientInfo.badgeColor}`}>
                {ticketStatus?.currentClient}
              </Badge>
            </div>

            {/* Timer - Solo para clientes válidos */}
            {clientInfo.showTimer && (
              <div className='flex items-center justify-between pt-3 border-t border-gray-200'>
                <span className='text-base text-gray-600'>
                  Tiempo de atención:
                </span>
                <div className='flex items-center'>
                  <Timer
                    className={`h-5 w-5 mr-2 text-gray-500 ${startTime ? 'animate-pulse' : ''}`}
                  />
                  <span className='text-base font-mono bg-white px-2 py-1 rounded border'>
                    {elapsedTime}
                  </span>
                </div>
              </div>
            )}

            {/* Estado detallado */}
            <div className='mt-3 pt-3 border-t border-gray-200'>
              <div className='flex items-center justify-between text-sm'>
                <span className='text-gray-600'>Estado:</span>
                <span className={`font-medium ${clientInfo.statusColor}`}>
                  {clientInfo.status}
                </span>
              </div>

              {pendingAction && !isUndefinedClient && (
                <div className='flex items-center justify-between text-sm mt-1'>
                  <span className='text-gray-600'>Acción pendiente:</span>
                  <span
                    className={`font-medium ${
                      pendingAction === 'absent'
                        ? 'text-red-600'
                        : 'text-green-600'
                    }`}
                  >
                    {pendingAction === 'absent'
                      ? 'Marcar ausente'
                      : 'Marcar completado'}
                  </span>
                </div>
              )}

              {/* Información adicional para casos especiales */}
              {clientInfo.isSpecialCase && (
                <div className='mt-2 p-2 bg-orange-100 rounded text-xs text-orange-700'>
                  <strong>Nota:</strong> Este ticket contiene datos incompletos
                  y será procesado automáticamente sin requerir marcado manual.
                </div>
              )}
            </div>
          </div>
        )}

        {/* 🔧 ESTADO SIN CLIENTE (waiting) */}
        {/* {!ticketStatus?.currentClient && flowStep === 'waiting' && (
          <div className='p-6 bg-blue-50 rounded-lg border border-blue-200 text-center'>
            <div className='text-blue-600 mb-3'>
              <Play className='h-12 w-12 mx-auto' />
            </div>
            <h3 className='text-lg font-semibold text-blue-800 mb-2'>
              Listo para atender
            </h3>
            <p className='text-blue-700 font-medium mb-1'>
              Presione "Siguiente" para llamar al próximo cliente
            </p>
            <p className='text-blue-600 text-sm'>
              {ticketStatus?.queueCount && ticketStatus.queueCount > 0
                ? `${ticketStatus.queueCount} cliente${ticketStatus.queueCount !== 1 ? 's' : ''} en cola`
                : 'Cola actualizada automáticamente'}
            </p>
          </div>
        )} */}

        {/* 🔧 ESTADO COMPLETED - Listo para siguiente */}
        {flowStep === 'completed' && (
          <div className='p-6 bg-green-50 rounded-lg border border-green-200 text-center'>
            <div className='text-green-600 mb-3'>
              <CheckCircle className='h-12 w-12 mx-auto' />
            </div>
            <h3 className='text-lg font-semibold text-green-800 mb-2'>
              Atención finalizada
            </h3>
            <p className='text-green-700 font-medium mb-1'>
              Presione "Siguiente" para llamar al próximo cliente
            </p>
            <p className='text-green-600 text-sm'>
              Cliente anterior procesado exitosamente
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
