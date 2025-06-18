import {
  Play,
  UserX,
  CheckCircle,
  Timer,
  Check,
  X,
  RotateCcw,
} from 'lucide-react';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '../ui/card';
import { Button } from '../ui/button';
import { OperatorTicketStatus } from '@/types/ticket';
import { Badge } from '../ui/badge';
import { useState, useEffect } from 'react';

export function ControlPanel({
  ticketStatus,
  pendingAction,
  isLoading,
  handleNext,
  handleAbsent,
  handleCompleted,
  isNextButtonEnabled, // 🔧 NUEVA PROP
  nextButtonText, // 🔧 NUEVA PROP
}: Readonly<{
  ticketStatus: OperatorTicketStatus;
  pendingAction: 'absent' | 'completed' | null;
  isLoading?: boolean;
  handleNext: () => void;
  handleAbsent: () => void;
  handleCompleted: () => void;
  isNextButtonEnabled?: boolean; // 🔧 NUEVA PROP
  nextButtonText?: string; // 🔧 NUEVA PROP
}>) {
  // 🔧 TIMER: Estado para tiempo transcurrido
  const [elapsedTime, setElapsedTime] = useState('0:00');
  const [startTime, setStartTime] = useState<Date | null>(null);

  // Lógica para determinar si hay un cliente llamado esperando ser marcado
  const isClientCalled =
    ticketStatus.status === 'CALLED' && ticketStatus.currentClient;

  // 🔧 USAR PROPS EXTERNAS si están disponibles, sino usar lógica interna
  const buttonEnabled =
    isNextButtonEnabled !== undefined
      ? isNextButtonEnabled
      : (() => {
          if (isLoading) return false;
          if (!isClientCalled) return ticketStatus.canTakeNext;
          return !!pendingAction;
        })();

  const buttonText =
    nextButtonText ||
    (() => {
      if (isLoading) return 'Procesando...';
      if (!isClientCalled) return 'Siguiente';
      if (pendingAction) return 'Siguiente';
      return 'Atendiendo';
    })();

  // 🔧 EFECTO: Iniciar timer cuando se llama un cliente
  useEffect(() => {
    if (isClientCalled && !startTime) {
      console.log(
        '⏱️ Iniciando timer para cliente:',
        ticketStatus.currentClient,
      );
      setStartTime(new Date());
    } else if (!isClientCalled && startTime) {
      console.log('⏱️ Deteniendo timer - cliente completado');
      setStartTime(null);
      setElapsedTime('0:00');
    }
  }, [isClientCalled, ticketStatus.currentClient, startTime]);

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

  // 🔧 FUNCIÓN: Determinar el estado visual del cliente
  const getClientStatusInfo = () => {
    if (!ticketStatus.currentClient) return null;

    if (isClientCalled) {
      return {
        title: 'Cliente Llamado',
        subtitle: 'Esperando ser atendido',
        badgeColor: 'bg-blue-500 text-white',
        showTimer: true,
      };
    }

    return {
      title: 'Cliente en Atención',
      subtitle: 'Siendo atendido actualmente',
      badgeColor: 'bg-green-500 text-white',
      showTimer: true,
    };
  };

  const clientInfo = getClientStatusInfo();

  return (
    <Card>
      <CardHeader className='pb-6'>
        <div className='flex items-center justify-between'>
          <div>
            <CardTitle className='text-2xl'>Control de Atención</CardTitle>
            <CardDescription className='text-lg'>
              {ticketStatus.currentClient
                ? `${isClientCalled ? 'Cliente llamado: ' : 'Atendiendo: '}${ticketStatus.currentClient}`
                : 'Sin cliente en atención'}
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className='space-y-6'>
        <div className='flex flex-col space-y-4'>
          {/* 🔧 BOTÓN PRINCIPAL - CON MEJOR FEEDBACK VISUAL */}
          <Button
            onClick={handleNext}
            disabled={!buttonEnabled}
            className={`h-16 text-lg font-semibold transition-all duration-200 ${
              pendingAction
                ? 'bg-primary hover:bg-primary/90 text-primary-foreground shadow-md'
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

          {/* 🔧 BOTONES DE ACCIÓN - CON MEJOR ESTADO VISUAL */}
          <div className='grid grid-cols-2 gap-4'>
            <Button
              onClick={handleAbsent}
              disabled={!isClientCalled || pendingAction === 'completed'}
              variant='outline'
              className={`w-full relative h-16 text-lg font-semibold transition-all duration-200 ${
                pendingAction === 'absent'
                  ? 'bg-destructive/20 text-destructive border-destructive/30 hover:bg-destructive/30 shadow-md'
                  : pendingAction === 'completed'
                    ? 'opacity-40 cursor-not-allowed'
                    : !isClientCalled
                      ? 'opacity-50 cursor-not-allowed'
                      : 'hover:bg-destructive/10 hover:border-destructive hover:text-destructive'
              }`}
            >
              <UserX className='h-6 w-6 mr-3' />
              <span>Ausente</span>
              {pendingAction === 'absent' && (
                <div className='absolute -top-1 -right-1 w-3 h-3 bg-destructive rounded-full'></div>
              )}
            </Button>

            <Button
              onClick={handleCompleted}
              disabled={!isClientCalled || pendingAction === 'absent'}
              variant='outline'
              className={`w-full relative h-16 text-lg font-semibold transition-all duration-200 ${
                pendingAction === 'completed'
                  ? 'bg-green-500 text-white border-green-500 hover:bg-green-600 shadow-md'
                  : pendingAction === 'absent'
                    ? 'opacity-40 cursor-not-allowed'
                    : !isClientCalled
                      ? 'opacity-50 cursor-not-allowed'
                      : 'hover:bg-green-50 hover:border-green-500 hover:text-green-700'
              }`}
            >
              <CheckCircle className='h-6 w-6 mr-3' />
              <span>Completado</span>
              {pendingAction === 'completed' && (
                <div className='absolute -top-1 -right-1 w-3 h-3 bg-green-600 rounded-full'></div>
              )}
            </Button>
          </div>
        </div>

        {/* 🔧 ADVERTENCIA MEJORADA */}
        {isClientCalled && !pendingAction && (
          <div className='p-4 bg-amber-50 rounded-lg border border-amber-200 animate-pulse'>
            <div className='flex items-center'>
              <div className='w-2 h-2 bg-amber-500 rounded-full mr-3 animate-pulse'></div>
              <p className='text-base text-amber-700 font-medium'>
                Debe marcar como Completado o Ausente antes de atender el
                siguiente cliente
              </p>
            </div>
          </div>
        )}

        {/* 🔧 CONFIRMACIÓN DE ACCIÓN MEJORADA */}
        {pendingAction && isClientCalled && (
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
                  pendingAction === 'absent' ? 'text-red-700' : 'text-green-700'
                }`}
              >
                Cliente será marcado como "
                {pendingAction === 'absent' ? 'Ausente' : 'Completado'}"
              </p>
            </div>
            <p className='text-sm text-gray-600 mt-1 ml-8'>
              Presione "Siguiente" para confirmar y llamar al próximo cliente
            </p>
          </div>
        )}

        {/* 🔧 INFO DEL CLIENTE ACTUAL MEJORADA */}
        {clientInfo && (
          <div className='p-5 bg-gray-50 rounded-lg border'>
            <div className='flex items-center justify-between mb-3'>
              <div>
                <span className='font-medium text-lg text-gray-800'>
                  {clientInfo.title}:
                </span>
                <p className='text-sm text-gray-600'>{clientInfo.subtitle}</p>
              </div>
              <Badge className={`text-base px-3 py-1 ${clientInfo.badgeColor}`}>
                {ticketStatus.currentClient}
              </Badge>
            </div>

            {clientInfo.showTimer && (
              <div className='flex items-center justify-between pt-3 border-t border-gray-200'>
                <span className='text-base text-gray-600'>
                  Tiempo transcurrido:
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

            {/* 🔧 INFORMACIÓN ADICIONAL DEL ESTADO */}
            <div className='mt-3 pt-3 border-t border-gray-200'>
              <div className='flex items-center justify-between text-sm'>
                <span className='text-gray-600'>Estado:</span>
                <span
                  className={`font-medium ${
                    isClientCalled ? 'text-blue-600' : 'text-green-600'
                  }`}
                >
                  {isClientCalled ? 'Llamado' : 'En atención'}
                </span>
              </div>

              {pendingAction && (
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
            </div>
          </div>
        )}

        {/* 🔧 ESTADO VACÍO MEJORADO */}
        {!ticketStatus.currentClient && (
          <div className='p-5 bg-blue-50 rounded-lg border border-blue-200 text-center'>
            <div className='text-blue-600 mb-2'>
              <Play className='h-8 w-8 mx-auto' />
            </div>
            <p className='text-blue-700 font-medium'>
              Presione "Siguiente" para llamar al primer cliente
            </p>
            <p className='text-blue-600 text-sm mt-1'>
              {ticketStatus.queueCount > 0
                ? `${ticketStatus.queueCount} cliente${ticketStatus.queueCount !== 1 ? 's' : ''} en cola`
                : 'No hay clientes en cola'}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
