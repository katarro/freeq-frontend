// TurnNotificationModal.tsx
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
import { CheckCircle, MapPin, Clock, User } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TurnNotificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  ticketNumber: string | number;
  moduleName?: string;
  serviceName?: string;
  branchName?: string;
  autoCloseDelay?: number; // Tiempo en segundos antes de cerrar automáticamente
}

export function TurnNotificationModal({
  isOpen,
  onClose,
  ticketNumber,
  moduleName = 'Módulo de Atención',
  serviceName = 'Servicio General',
  branchName = 'Sucursal Principal',
  autoCloseDelay = 30, // 30 segundos por defecto
}: TurnNotificationModalProps) {
  const [countdown, setCountdown] = useState(autoCloseDelay);
  const [isCountdownActive, setIsCountdownActive] = useState(false);

  // ✅ EFECTO: Iniciar countdown cuando se abre el modal
  useEffect(() => {
    if (isOpen) {
      setCountdown(autoCloseDelay);
      setIsCountdownActive(true);
    } else {
      setIsCountdownActive(false);
    }
  }, [isOpen, autoCloseDelay]);

  // ✅ EFECTO: Manejar countdown
  useEffect(() => {
    if (!isCountdownActive || countdown <= 0) return;

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          setIsCountdownActive(false);
          onClose(); // Cerrar modal automáticamente
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isCountdownActive, countdown, onClose]);

  const handleConfirm = () => {
    setIsCountdownActive(false);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="text-center pb-4">
          <div className="mx-auto w-16 h-16 bg-gradient-to-br from-green-100 to-emerald-100 rounded-full flex items-center justify-center mb-4">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>

          <DialogTitle className="text-2xl font-bold text-green-700">¡Es tu turno!</DialogTitle>

          <DialogDescription className="text-base text-gray-600 mt-2">
            Tu número ha sido llamado para atención
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Número del ticket destacado */}
          <div className="text-center">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-xl px-6 py-3 border border-primary/20">
              <User className="w-5 h-5 text-primary" />
              <span className="text-sm font-medium text-muted-foreground">Número:</span>
              <span className="text-3xl font-black text-primary">{ticketNumber}</span>
            </div>
          </div>

          {/* Información del módulo */}
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

          {/* Badge de estado */}
          <div className="text-center">
            <Badge className="bg-green-100 text-green-800 border-green-200 px-4 py-2">
              <Clock className="w-4 h-4 mr-2" />
              Atención disponible
            </Badge>
          </div>

          {/* Countdown */}
          {isCountdownActive && (
            <div className="text-center text-sm text-gray-500">
              <p>Este mensaje se cerrará automáticamente en:</p>
              <span
                className={cn(
                  'font-mono font-bold text-lg',
                  countdown <= 10 ? 'text-red-600' : 'text-gray-700',
                )}
              >
                {countdown}s
              </span>
            </div>
          )}
        </div>

        <DialogFooter className="flex gap-2 sm:gap-2">
          <Button
            variant="outline"
            onClick={() => {
              setIsCountdownActive(false);
              onClose();
            }}
            className="flex-1"
          >
            Cerrar
          </Button>

          <Button onClick={handleConfirm} className="flex-1 bg-green-600 hover:bg-green-700">
            <CheckCircle className="w-4 h-4 mr-2" />
            Entendido
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
