// components/dialogs/dni-dialog.tsx
'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import DniForm from '@/components/forms/dni-form';
import ThanksDialog from '@/components/dialogs/thanks-dialog';
import { DniFormValues } from '@/lib/schemas';
import { useTickets } from '@/hooks/use-tickets';
import { cleanRut } from '@/lib/rut-formatter';

interface DniDialogProps {
  readonly queueId: string; // 👈 Recibir queueId como prop
}

export default function DniDialog({ queueId }: DniDialogProps) {
  const [showThanks, setShowThanks] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [createdTicket, setCreatedTicket] = useState<any>(null);

  const { createTicket, loadingTickets, errorTickets, clearError } = useTickets();
  const router = useRouter();

  async function onSubmit(values: DniFormValues) {
    try {
      console.log('📝 Enviando datos:', {
        rut: values.dni,
        queueId: queueId,
      });

      // Crear el ticket
      const ticket = await createTicket({
        rut: values.dni, // 👈 Limpiar el RUT
        queueId: queueId,
      });

      console.log('✅ Ticket creado exitosamente:', ticket);

      // Guardar el ticket creado para mostrarlo en el modal de agradecimiento
      setCreatedTicket(ticket);

      // Cerrar el diálogo de DNI
      setIsOpen(false);

      // Mostrar el diálogo de agradecimiento
      setShowThanks(true);
    } catch (error: any) {
      console.error('❌ Error al crear ticket:', error);

      // setTimeout(() => {
      //   router.push('/user/tickets');
      // }, 2000);
      // El error ya se maneja en el hook, aquí podrías mostrar un toast o alert
    }
  }

  const handleThanksClose = () => {
    setShowThanks(false);
    // Limpiar cualquier error
    clearError();

    // Redirigir a la página de tickets después de cerrar
    // Puedes ajustar esta ruta según tu estructura
    router.push('/user/tickets');
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button
            className="w-full hover:cursor-pointer"
            onClick={() => {
              setIsOpen(true);
              clearError(); // Limpiar errores previos
            }}
          >
            Unirse a la fila
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-[293px] pt-14 gap-4">
          <DialogHeader>
            <DialogTitle className="text-start text-2xl font-semibold">
              Verifica tu identidad <br /> para confirmar tu turno
            </DialogTitle>
            <DialogDescription className="sr-only">
              Por favor, ingresa tu RUT para confirmar tu turno.
            </DialogDescription>
          </DialogHeader>

          {/* Mostrar error si existe */}
          {errorTickets && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <p className="text-sm text-red-600">{errorTickets}</p>
            </div>
          )}

          <DniForm
            onSubmit={onSubmit}
            isLoading={loadingTickets} // 👈 Pasar estado de loading
          />
        </DialogContent>
      </Dialog>

      <ThanksDialog open={showThanks} onOpenChange={handleThanksClose} />
    </>
  );
}
