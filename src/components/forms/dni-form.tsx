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
import { useState } from 'react';
import { Button } from '../ui/button';

interface DniFormProps {
  onSubmit: (values: DniFormValues) => Promise<void>;
}

export default function DniForm({ onSubmit }: DniFormProps) {
  const form = useForm<DniFormValues>({
    resolver: zodResolver(dniSchema),
    defaultValues: {
      dni: '',
    },
  });

  const [isLoading, setIsLoading] = useState<boolean>(false);

  async function handleSubmit(values: DniFormValues) {
    setIsLoading(true);
    try {
      await onSubmit(values);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
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
                  label='DNI'
                  placeholder='ej. 45508712D'
                  type='text'
                  disabled={isLoading}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type='submit' className='w-full' disabled={isLoading}>
          Confirmar turno
        </Button>
      </form>
    </Form>
  );
}
