// TicketCard.tsx - CON SSE INTEGRADO DIRECTAMENTE
import { cn } from '@/lib/utils';
import { Ticket, getTicketInfo, TicketStatus } from '@/types/ticket';
import { Separator } from '@radix-ui/react-separator';
import { Card, CardHeader, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Building, X, Loader2 } from 'lucide-react';
import { STATUS_LABELS } from '@/services/tickets';
import { InfoGrid } from './info-grid';
import { useSSEGlobalState } from '@/hooks/use-sse';
import { useEffect, useState, useRef } from 'react';
import { TurnNotificationModal } from './turn-notification-modal';
import { PostServiceSurvey } from './post-service-survey';
import { SecureStorage } from '@/lib/secure-storage';
import apiClient from '@/lib/api-client';
import { ENV } from '@/lib/env';
import { useWaitTime } from '@/hooks/use-wait-time';

interface TicketCardProps {
  readonly shift: Ticket;
  readonly onCancel?: (shift: Ticket) => void;
  readonly isHistory?: boolean;
  readonly onTicketCompleted?: (ticketId: string) => void;
  readonly onTicketWaitingSurvey?: (ticketId: string) => void; // 🆕 AGREGAR
}

interface SurveyResponses {
  appUsability: number;
  timeAccuracy: number;
  comparedToPhysical: number;
  ticketId?: string;
}

function StatusBadge({ status }: { readonly status: TicketStatus }) {
  const statusConfig = STATUS_LABELS[status];
  if (!statusConfig) {
    return <Badge className="bg-muted text-muted-foreground">Desconocido</Badge>;
  }
  const { label, className } = statusConfig;
  return <Badge className={cn('border font-medium text-xs px-2 py-1', className)}>{label}</Badge>;
}

function TicketNumber({
  ticketNumber,
  isHistory,
}: {
  readonly ticketNumber: string | number;
  readonly isHistory?: boolean;
}) {
  return (
    <div
      className={cn(
        'relative rounded-2xl px-4 py-3 sm:px-5 text-center',
        isHistory
          ? 'bg-muted border-2 border-border'
          : 'bg-gradient-to-br from-primary/15 to-secondary/25 border-2 border-primary/30',
      )}
    >
      <div className="relative">
        <div
          className={cn(
            'text-2xl sm:text-3xl font-black',
            isHistory ? 'text-muted-foreground' : 'text-primary',
          )}
        >
          {ticketNumber}
        </div>
        <div className="text-xs font-medium text-muted-foreground mt-1">
          {isHistory ? 'Finalizado' : 'Tu número'}
        </div>
      </div>
    </div>
  );
}

function CurrentAttention({
  currentTicket,
  isSSEConnected,
  isLoading,
}: {
  readonly currentTicket: number | null;
  readonly isSSEConnected?: boolean;
  readonly isLoading?: boolean;
}) {
  let content;
  if (isLoading) {
    content = (
      <div className="flex flex-col items-center gap-2">
        <Loader2 className="w-8 h-8 animate-spin text-success" />
        <div className="text-xs text-success/70 font-normal">Obteniendo número actual...</div>
      </div>
    );
  } else if (currentTicket !== null) {
    content = (
      <div className="flex flex-col items-center">
        <div className="transition-all duration-300" key={currentTicket}>
          {currentTicket}
        </div>
        <div className="text-base font-semibold text-success/80 mt-1">
          Número actual en atención
          <span className="inline-block w-6 text-left">
            <span className="animate-pulse">.</span>
            <span className="animate-pulse" style={{ animationDelay: '0.33s' }}>
              .
            </span>
            <span className="animate-pulse" style={{ animationDelay: '0.66s' }}>
              .
            </span>
          </span>
        </div>
      </div>
    );
  } else {
    content = (
      <div className="flex flex-col items-center gap-2">
        <div className="text-2xl text-success/50">—</div>
        <div className="text-xs text-success/70 font-normal">Sin atención activa</div>
      </div>
    );
  }

  return (
    <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-success/5 to-secondary/5 border border-success/20 p-4 sm:p-5">
      <div className="relative text-center">
        <div className="text-3xl sm:text-4xl font-black text-success mb-1 min-h-[3rem] flex items-center justify-center">
          {content}
        </div>
      </div>
    </div>
  );
}

export function TicketCard({
  shift,
  onCancel,
  isHistory,
  onTicketCompleted,
  onTicketWaitingSurvey,
}: TicketCardProps) {
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [loadingTimeout, setLoadingTimeout] = useState<NodeJS.Timeout | null>(null);

  // ✅ ESTADOS PARA EL MODAL DE TURNO
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [hasNotified, setHasNotified] = useState(false);
  const currentTicketRef = useRef<number | null>(null);

  // 🆕 ESTADOS PARA SSE DIRECTO
  const [sseConnected, setSSEConnected] = useState(false);
  const [sseError, setSSEError] = useState<string | null>(null);
  const sseRef = useRef<EventSource | null>(null);

  // ✅ ESTADOS PARA LA ENCUESTA POST-ATENCIÓN
  const [showSurvey, setShowSurvey] = useState(false);
  const [previousStatus, setPreviousStatus] = useState<TicketStatus | null>(null);
  const [surveyShownForTicket, setSurveyShownForTicket] = useState<string | null>(null);
  const [isSurveyCompleted, setIsSurveyCompleted] = useState(false);

  // ✅ Hook existente para datos globales
  const { isConnected, activeTicketId, currentTicketNumber, lastEvent } = useSSEGlobalState();

  const isSSEConnected = isConnected && activeTicketId === shift.id?.toString();

  const [liveWaitTime, setLiveWaitTime] = useState<number | null>(null);
  // const { waitTime: initialWaitTime } = useWaitTime(shift.queueId, shift.id);
  // const showWaitTime = liveWaitTime !== null ? liveWaitTime : initialWaitTime;

  // 🆕 FUNCIÓN: Obtener token de autenticación
  const getAuthToken = (): string | null => {
    try {
      const { token } = SecureStorage.getAuthData();
      return token || null;
    } catch (error) {
      console.error('❌ Error obteniendo token:', error);
      return null;
    }
  };

  // 🆕 FUNCIÓN: Conectar a SSE para escuchar eventos del usuario
  const connectToUserSSE = (userId: string) => {
    if (isHistory || sseRef.current) return;

    const token = getAuthToken();
    if (!token) {
      console.error('❌ No se encontró token para SSE');
      setSSEError('Token requerido para conexión SSE');
      return;
    }

    try {
      const url = `${ENV.API_URL}/eventos-cola/usuario/${userId}`;

      console.log(`🔗 Conectando SSE de usuario PARA COMPLETADO: ${userId}`);
      console.log(`🌐 URL SSE: ${url}`);

      const eventSource = new EventSource(url);
      sseRef.current = eventSource;

      eventSource.onopen = () => {
        console.log('✅ SSE Usuario conectado en COMPLETADO');
        setSSEConnected(true);
        setSSEError(null);
      };

      eventSource.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          console.log('📨 Evento SSE Usuario recibido:', data);

          // 🎯 DETECTAR: Mi ticket fue completado
          if (data.type === 'TICKET_COMPLETED' && data.ticketId === shift.id) {
            console.log('🎉 ¡Mi ticket fue completado!', data);

            // ✅ NOTIFICAR AL PADRE QUE EL TICKET ESTÁ ESPERANDO ENCUESTA
            onTicketWaitingSurvey?.(shift.id);

            console.log('encuesta surveyShownForTicket', surveyShownForTicket);
            console.log('encuesta shift.id', shift.id);

            // Mostrar encuesta si no se ha mostrado
            if (surveyShownForTicket !== shift.id) {
              console.log('🔍 Mostrando encuesta para ticket:', shift.id);
              setSurveyShownForTicket(shift.id);
              console.log('⏳ Esperando 1 segundo antes de mostrar encuesta');
              setTimeout(() => {
                console.log('📋 Mostrando encuesta después de 1 segundo');
                setShowSurvey(true);
              }, 1000);
            }
          }

          // 🎯 DETECTAR: Actualización de estado general
          if (data.type === 'QUEUE_STATUS_UPDATE' && data.ticketCompleted === shift.id) {
            console.log('📊 Mi ticket completado via actualización de cola');

            // ✅ NOTIFICAR AL PADRE QUE EL TICKET ESTÁ ESPERANDO ENCUESTA
            onTicketWaitingSurvey?.(shift.id);

            if (surveyShownForTicket !== shift.id) {
              setSurveyShownForTicket(shift.id);
              setTimeout(() => {
                setShowSurvey(true);
              }, 1000);
            }
          }

          if (data.type === 'UPDATE_REMAINING_TIME' && data.ticketId === shift.id) {
            setLiveWaitTime(data.tiempo_restante);
            console.log('📊 Actualizando tiempo restante en cola:', data.tiempo_restante);
          }
        } catch (error) {
          console.error('❌ Error parseando evento SSE:', error);
        }
      };

      eventSource.onerror = (error) => {
        console.error('❌ Error SSE Usuario:', error);
        setSSEConnected(false);
        setSSEError('Error de conexión SSE');

        // Auto-reconectar después de 3 segundos
        setTimeout(() => {
          if (sseRef.current === eventSource) {
            console.log('🔄 Reintentando conexión SSE...');
            connectToUserSSE(userId);
          }
        }, 3000);
      };
    } catch (error) {
      console.error('💥 Error iniciando SSE Usuario:', error);
      setSSEError('Error al conectar SSE');
    }
  };

  // 🆕 FUNCIÓN: Desconectar SSE
  const disconnectUserSSE = () => {
    if (sseRef.current) {
      console.log('🔌 Desconectando SSE Usuario');
      sseRef.current.close();
      sseRef.current = null;
      setSSEConnected(false);
      setSSEError(null);
    }
  };

  // 🆕 EFECTO: Conectar SSE cuando el componente se monta
  useEffect(() => {
    if (!isHistory && shift.userId) {
      console.log(`🚀 Iniciando SSE para usuario: ${shift.userId}`);
      connectToUserSSE(shift.userId);

      // Cleanup al desmontar
      return () => {
        disconnectUserSSE();
      };
    }
  }, [shift.userId, shift.id, isHistory]);

  // ✅ EFECTO: Escuchar evento de control panel para encuesta
  useEffect(() => {
    if (isHistory) return;

    const handleControlPanelTicketCompleted = (event: CustomEvent) => {
      const { ticketId, action, operatorId, completionType, timestamp } = event.detail;

      console.log('🎯 Evento controlPanelTicketCompleted recibido:', {
        eventTicketId: ticketId,
        myTicketId: shift.id,
        matches: ticketId === shift.id,
        action,
        operatorId,
        completionType,
        timestamp,
      });

      // Solo procesar si es para este ticket y no se ha mostrado la encuesta
      if (ticketId === shift.id && surveyShownForTicket !== shift.id) {
        console.log('🎉 ¡Ticket completado desde control panel! Mostrando encuesta...');
        console.log('📊 Detalles del completado:', { action, completionType, operatorId });

        setSurveyShownForTicket(shift.id);

        // ✅ NOTIFICAR AL PADRE QUE EL TICKET ESTÁ ESPERANDO ENCUESTA
        onTicketWaitingSurvey?.(shift.id);

        // Mostrar encuesta después de un pequeño delay
        setTimeout(() => {
          console.log('📋 Abriendo encuesta post atención...');
          setShowSurvey(true);
        }, 1000);
      }
    };

    // Agregar listener para el evento personalizado
    document.addEventListener(
      'controlPanelTicketCompleted',
      handleControlPanelTicketCompleted as EventListener,
    );

    // Cleanup al desmontar
    return () => {
      document.removeEventListener(
        'controlPanelTicketCompleted',
        handleControlPanelTicketCompleted as EventListener,
      );
    };
  }, [shift.id, isHistory, surveyShownForTicket, onTicketCompleted]);

  // ✅ EFECTO: Detectar cambio de props (fallback si SSE falla)
  useEffect(() => {
    if (isHistory) return;

    const isNowCompleted = shift.status === 'COMPLETED';
    const wasNotCompletedBefore = previousStatus && previousStatus !== 'COMPLETED';
    const surveyNotShownYet = surveyShownForTicket !== shift.id;

    console.log('🔍 Verificando cambio de estado via props:', {
      ticketId: shift.id,
      currentStatus: shift.status,
      previousStatus,
      shouldShow: isNowCompleted && wasNotCompletedBefore && surveyNotShownYet,
      sseConnected,
    });

    // Solo usar fallback de props si NO tenemos SSE conectado
    if (isNowCompleted && wasNotCompletedBefore && surveyNotShownYet && !sseConnected) {
      console.log('✅ Mostrando encuesta via props (fallback)');
      setSurveyShownForTicket(shift.id);
      setTimeout(() => {
        setShowSurvey(true);
      }, 1500);
    }

    setPreviousStatus(shift.status);
  }, [shift.status, shift.id, previousStatus, isHistory, surveyShownForTicket, sseConnected]);

  // ✅ EFECTO: Detectar cuando es el turno del usuario
  useEffect(() => {
    if (isHistory || !currentTicketNumber || !shift.ticketNumber) return;

    const currentNum = Number(currentTicketNumber);
    const ticketNum = Number(shift.ticketNumber);
    const currentTicketChanged = currentTicketRef.current !== currentNum;
    currentTicketRef.current = currentNum;

    if (currentNum === ticketNum && !hasNotified && currentTicketChanged) {
      console.log('🎉 ¡Es tu turno!', {
        currentTicketNumber: currentNum,
        myTicketNumber: ticketNum,
      });

      setIsModalOpen(true);
      setHasNotified(true);

      if ('vibrate' in navigator) {
        navigator.vibrate([500, 200, 500, 200, 500]);
      }
    }

    if (currentNum > ticketNum && hasNotified) {
      setHasNotified(false);
    }
  }, [currentTicketNumber, shift.ticketNumber, shift.id, hasNotified, isHistory]);

  // ✅ EFECTO: Loading states
  useEffect(() => {
    if (!isHistory) {
      setIsInitialLoading(true);
      if (loadingTimeout) clearTimeout(loadingTimeout);
      const timeout = setTimeout(() => {
        setIsInitialLoading(false);
        setLoadingTimeout(null);
      }, 1500);
      setLoadingTimeout(timeout);
      return () => {
        if (timeout) clearTimeout(timeout);
      };
    }
  }, [shift.id, isHistory]);

  useEffect(() => {
    if (currentTicketNumber !== null && isInitialLoading) {
      setIsInitialLoading(false);
      if (loadingTimeout) {
        clearTimeout(loadingTimeout);
        setLoadingTimeout(null);
      }
    }
  }, [currentTicketNumber, isInitialLoading, loadingTimeout]);

  // ✅ HANDLERS
  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleCloseSurvey = () => {
    console.log('🔒 Cerrando encuesta para ticket:', shift.id);
    setShowSurvey(false);

    // ✅ NOTIFICAR AL PADRE QUE LA ENCUESTA SE CERRÓ (usuario la canceló)
    onTicketCompleted?.(shift.id);
  };

  const handleSubmitSurvey = async (responses: SurveyResponses) => {
    try {
      console.log('📤 handleSubmitSurvey llamado para ticket:', shift.id);
      console.log('📤 Respuestas recibidas:', responses);

      const surveyData = {
        ...responses,
        ticketId: shift.id,
        ticketNumber: shift.ticketNumber,
        serviceId: shift.serviceModuleId,
        queueId: shift.queue?.id,
        submittedAt: new Date().toISOString(),
      };

      console.log('📋 Datos completos a enviar:', surveyData);
      console.log('🌐 URL del endpoint:', `${ENV.API_URL}/cliente/encuestas`);

      const response = await apiClient.post(`${ENV.API_URL}/cliente/encuestas`, surveyData);

      console.log('✅ Encuesta enviada exitosamente:', response.data);
      console.log('✅ Status de respuesta:', response.status);

      // ✅ MARCAR ENCUESTA COMO COMPLETADA
      setIsSurveyCompleted(true);
      console.log('✅ Encuesta marcada como completada');
    } catch (error: any) {
      console.error('❌ Error enviando encuesta:', error);
      console.error('❌ Detalles del error:', {
        message: error?.message,
        status: error?.response?.status,
        data: error?.response?.data,
      });
      throw error;
    }
  };

  const ticketInfo = shift.queue ? getTicketInfo(shift) : null;
  const serviceName = ticketInfo?.serviceName || shift.serviceModuleId || 'Servicio General';
  const siteName = ticketInfo?.branchName || 'Sucursal Principal';
  const companyName = ticketInfo?.companyName || 'Empresa Principal';
  const serviceDescription = ticketInfo?.serviceDescription || serviceName;

  const shouldShowLoader = !isHistory && isInitialLoading;
  const currentTicketBeingServed = shouldShowLoader ? null : currentTicketNumber;

  return (
    <>
      <Card
        className={cn(
          'relative overflow-hidden border-0 shadow-lg bg-gradient-to-br from-card via-card/50 to-card',
          isHistory && 'opacity-75 grayscale',
          isSSEConnected && !isHistory && 'ring-2 ring-success/30 shadow-success/20',
          currentTicketNumber === Number(shift.ticketNumber) &&
            !isHistory &&
            'ring-4 ring-green-400 shadow-green-400/30 animate-pulse',
        )}
      >
        <CardHeader className="pb-4 bg-gradient-to-r from-primary/5 to-secondary/5">
          <div className="space-y-4">
            <div className="hidden sm:flex items-center justify-between">
              <div className="flex items-center gap-4 flex-1 min-w-0">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary/10 to-secondary/20 flex items-center justify-center flex-shrink-0">
                  <Building className="w-7 h-7 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-bold text-lg text-heading-foreground truncate">
                      {companyName}
                    </h3>
                    {currentTicketNumber !== Number(shift.ticketNumber) && (
                      <StatusBadge status={shift.status} />
                    )}
                    {currentTicketNumber === Number(shift.ticketNumber) && !isHistory && (
                      <Badge className="bg-green-100 text-green-800 border-green-300 animate-bounce">
                        ¡Tu turno!
                      </Badge>
                    )}
                  </div>
                  <div className="mb-1">
                    <h4 className="font-semibold text-base text-foreground truncate">{siteName}</h4>
                  </div>
                  <div className="text-sm text-muted-foreground truncate">{serviceDescription}</div>
                </div>
              </div>
              <TicketNumber ticketNumber={shift.ticketNumber} isHistory={isHistory} />
            </div>

            {/* Versión móvil */}
            <div className="sm:hidden space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/10 to-secondary/20 flex items-center justify-center flex-shrink-0">
                  <Building className="w-6 h-6 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <h3 className="font-bold text-base text-heading-foreground truncate">
                      {companyName}
                    </h3>
                    <StatusBadge status={shift.status} />
                    {currentTicketNumber === Number(shift.ticketNumber) && !isHistory && (
                      <Badge className="bg-green-100 text-green-800 border-green-300 animate-bounce text-xs">
                        ¡Tu turno!
                      </Badge>
                    )}
                    {sseConnected && !isHistory && (
                      <Badge variant="outline" className="text-xs border-blue-300 text-blue-700">
                        🔗
                      </Badge>
                    )}
                  </div>
                  <div className="mb-1">
                    <h4 className="font-medium text-sm text-foreground truncate">{siteName}</h4>
                  </div>
                  <div className="text-xs text-muted-foreground truncate">{serviceDescription}</div>
                </div>
              </div>
              <div className="flex justify-center">
                <TicketNumber ticketNumber={shift.ticketNumber} isHistory={isHistory} />
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-4 sm:p-6">
          <div className="space-y-4 sm:space-y-5">
            {!isHistory && (
              <CurrentAttention
                currentTicket={currentTicketBeingServed}
                isSSEConnected={isSSEConnected && !shouldShowLoader}
                isLoading={shouldShowLoader}
              />
            )}
            <InfoGrid
              isHistory={isHistory}
              shift={shift}
              createdAt={shift.createdAt}
              // waitTime={liveWaitTime}
            />
            {!isHistory && (
              <>
                <Separator className="bg-border" />
                <div className="flex items-center justify-between">
                  {shouldShowLoader && (
                    <div className="flex items-center gap-2 text-xs text-yellow-600">
                      <Loader2 className="w-3 h-3 animate-spin" />
                      <span>Conectando...</span>
                    </div>
                  )}

                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => onCancel?.(shift)}
                    className={cn((isSSEConnected || shouldShowLoader) && 'ml-auto')}
                    disabled={shouldShowLoader}
                  >
                    <X className="w-4 h-4 mr-2" />
                    Cancelar turno
                  </Button>
                </div>
              </>
            )}
          </div>
        </CardContent>
      </Card>

      {/* ✅ MODAL DE NOTIFICACIÓN DE TURNO */}
      <TurnNotificationModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        ticketNumber={shift.ticketNumber}
        moduleName={serviceName}
        serviceName={serviceDescription}
        branchName={siteName}
        autoCloseDelay={30}
      />

      {/* ✅ ENCUESTA POST-ATENCIÓN */}
      <PostServiceSurvey
        isOpen={showSurvey}
        onClose={handleCloseSurvey}
        onSubmit={handleSubmitSurvey}
        ticketNumber={shift.ticketNumber}
        serviceName={serviceDescription}
        branchName={siteName}
      />
    </>
  );
}
