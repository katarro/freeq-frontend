'use client';

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';

import { OperatorValues } from '@/lib/schemas';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';

const messageFormSchema = z.object({
  message: z.string().min(5, 'El mensaje debe tener al menos 5 caracteres').max(500, 'El mensaje no puede exceder 500 caracteres'),
});

type MessageFormValues = z.infer<typeof messageFormSchema>;

type SendMessageDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  operator: OperatorValues | null;
  onMessageSent: () => void
};

export default function SendMessageDialog({ open, onOpenChange, operator, onMessageSent }: SendMessageDialogProps) {
  const form = useForm<MessageFormValues>({
    resolver: zodResolver(messageFormSchema),
    defaultValues: {
      message: '',
    },
  });

  const { handleSubmit, reset, formState: { isSubmitting } } = form;

  const onSubmitMessage = async (data: MessageFormValues) => {
    console.log(`Sending message to ${operator?.name}:`, data.message);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));

      toast.success('Mensaje enviado', {
        description: `El mensaje a ${operator?.name} ha sido enviado exitosamente.`,
      });
      onMessageSent();
      reset();
    } catch (error) {
      toast.error('Error al enviar mensaje', {
        description: 'No se pudo enviar el mensaje. Inténtalo de nuevo.',
      });
      console.error('Error sending message:', error);
    }
  };


  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Enviar Mensaje a {operator?.name}</DialogTitle>
          <DialogDescription>Envía un mensaje directo al operador</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={handleSubmit(onSubmitMessage)}>
            <div className="grid gap-4 py-4">
              <FormField
                control={form.control}
                name="message"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Textarea
                        label="Mensaje"
                        placeholder="Escribe tu mensaje aquí..."
                        {...field}
                        rows={4}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => onOpenChange(false)} type="button">
                Cancelar
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Enviando...' : 'Enviar Mensaje'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
