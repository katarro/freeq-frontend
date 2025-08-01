import { useEffect, useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, MapPin, Clock, User, Volume2, X, Play } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAudioAlarm } from '@/hooks/use-audio-alarm';
import { AudioActivationService } from '@/services/alarm/audio-activation.service';

interface TurnNotificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  ticketNumber: string | number;
  moduleName?: string;
  serviceName?: string;
  branchName?: string;
  autoCloseDelay?: number;
}

export function TurnNotificationModal({
  isOpen,
  onClose,
  ticketNumber,
  moduleName = 'Módulo de Atención',
  serviceName = 'Servicio General',
  branchName = 'Sucursal Principal',
  autoCloseDelay = 30,
}: TurnNotificationModalProps) {
  const [countdown, setCountdown] = useState(autoCloseDelay);
  const [isCountdownActive, setIsCountdownActive] = useState(false);
  const [alarmPlayed, setAlarmPlayed] = useState(false);

  const { playAlarm, stopAlarm, isPlaying } = useAudioAlarm();

  // ✅ EFECTO: Countdown
  useEffect(() => {
    if (isOpen) {
      setCountdown(autoCloseDelay);
      setIsCountdownActive(true);
      setAlarmPlayed(false);
    } else {
      setIsCountdownActive(false);
      setAlarmPlayed(false);
    }
  }, [isOpen, autoCloseDelay]);

  useEffect(() => {
    if (!isCountdownActive || countdown <= 0) return;

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          setIsCountdownActive(false);
          onClose();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isCountdownActive, countdown, onClose]);

  // ✅ EFECTO: Reproducir alarma SOLO cuando se abre el modal
  useEffect(() => {
    if (isOpen && !alarmPlayed) {
      const playAlarmIfActivated = async () => {
        // ✅ VERIFICAR si el audio fue activado desde localStorage
        const audioInfo = AudioActivationService.getActivationInfo();

        if (audioInfo.activated && audioInfo.hoursAgo !== null && audioInfo.hoursAgo < 24) {
          const success = await playAlarm();

          if (success) {
            setAlarmPlayed(true);
          }
        }
      };

      // ✅ MOSTRAR notificación nativa del navegador
      if ('Notification' in window && Notification.permission === 'granted') {
        new Notification('¡Es tu turno!', {
          body: `Tu número ${ticketNumber} ha sido llamado para atención`,
          icon: '/favicon.ico',
          tag: 'turn-notification',
          requireInteraction: true,
          silent: false,
        });
      }

      playAlarmIfActivated();
    }

    // ✅ LIMPIAR al cerrar modal
    return () => {
      if (!isOpen) {
        stopAlarm();
      }
    };
  }, [isOpen, alarmPlayed, playAlarm, stopAlarm, ticketNumber]);

  // ✅ HANDLERS
  const handleClose = () => {
    stopAlarm();
    setAlarmPlayed(false);
    onClose();
  };

  const handleTestAlarm = async () => {
    await playAlarm();
  };

  const handleStopAlarm = () => {
    stopAlarm();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="text-center pb-4">
          <div
            className={cn(
              'mx-auto w-16 h-16 rounded-full flex items-center justify-center mb-4 transition-all duration-300',
              isPlaying()
                ? 'bg-gradient-to-br from-red-100 to-orange-100 animate-pulse'
                : 'bg-gradient-to-br from-green-100 to-emerald-100',
            )}
          >
            <CheckCircle
              className={cn(
                'w-8 h-8 transition-colors duration-300',
                isPlaying() ? 'text-red-600' : 'text-green-600',
              )}
            />
          </div>

          <DialogTitle className="text-2xl font-bold text-green-700">¡Es tu turno!</DialogTitle>

          <DialogDescription className="text-base text-gray-600 mt-2">
            Tu número ha sido llamado para atención
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Número del ticket */}
          <div className="text-center">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-xl px-6 py-3 border border-primary/20">
              <User className="w-5 h-5 text-primary" />
              <span className="text-sm font-medium text-muted-foreground">Número:</span>
              <span className="text-3xl font-black text-primary">{ticketNumber}</span>
            </div>
          </div>

          {/* Información del servicio */}
          <div className="space-y-3 bg-gray-50 rounded-lg p-4">
            <div className="flex items-center gap-3">
              <MapPin className="w-5 h-5 text-blue-600 flex-shrink-0" />
              <div>
                <p className="font-semibold text-gray-900">{moduleName}</p>
                <p className="text-sm text-gray-600">{serviceName}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
              <div>
                <p className="font-medium text-gray-900">Preséntate ahora</p>
                <p className="text-sm text-gray-600">{branchName}</p>
              </div>
            </div>
          </div>

          {/* ✅ CONTROLES DE ALARMA */}
          <div className="flex gap-2 justify-center">
            {isPlaying() && (
              <Button variant="outline" size="sm" onClick={handleStopAlarm}>
                <X className="w-4 h-4 mr-2" />
                Detener
              </Button>
            )}
          </div>

          {/* Countdown */}
          {isCountdownActive && (
            <div className="text-center text-sm text-gray-500">
              <p>Este mensaje se cerrará automáticamente en:</p>
              <span
                className={cn(
                  'font-mono font-bold text-lg',
                  countdown <= 10 ? 'text-red-600 animate-pulse' : 'text-gray-700',
                )}
              >
                {countdown}s
              </span>
            </div>
          )}
        </div>

        <DialogFooter className="flex gap-2">
          <Button variant="ghost" onClick={handleClose}>
            Cerrar
          </Button>
          <Button onClick={handleClose}>
            <CheckCircle className="w-4 h-4 mr-2" />
            Entendido
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
