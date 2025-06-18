// components/forms/dni-form.tsx
import { DniFormValues, dniSchema } from '@/lib/schemas';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '../ui/button';
import { formatRut } from '@/lib/rut-formatter';

interface DniFormProps {
  readonly onSubmit: (values: DniFormValues) => Promise<void>;
  readonly isLoading?: boolean; // 👈 Prop opcional para loading externo
}

export default function DniForm({
  onSubmit,
  isLoading: externalLoading = false,
}: DniFormProps) {
  const form = useForm<DniFormValues>({
    resolver: zodResolver(dniSchema),
    defaultValues: {
      dni: '',
    },
  });

  // Usar loading externo si se proporciona
  const isLoading = externalLoading;

  async function handleSubmit(values: DniFormValues) {
    try {
      await onSubmit(values);
    } catch (error) {
      console.error('Error en DniForm:', error);
      // El error se maneja en el componente padre
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className='space-y-5'>
        <FormField
          control={form.control}
          name='dni'
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input
                  autoComplete='off'
                  label='RUT'
                  placeholder='ej. 18.771.857-7'
                  type='text'
                  disabled={isLoading}
                  {...field}
                  value={field.value}
                  onChange={(e) => {
                    const formattedValue = formatRut(e.target.value);
                    field.onChange(formattedValue);
                  }}
                  maxLength={12}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          type='submit'
          className='w-full hover:cursor-pointer'
          disabled={isLoading}
        >
          {isLoading ? 'Confirmando...' : 'Confirmar turno'}
        </Button>
      </form>
    </Form>
  );
}
