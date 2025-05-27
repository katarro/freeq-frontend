'use client';

import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { administratorSchema, AdministratorValues } from '@/lib/schemas/administrator-schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { LoaderCircle } from 'lucide-react';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { wait } from '@/lib/utils';

type Props = {
  initialData?: AdministratorValues;
  isEditing?: boolean;
}

export default function AdministratorForm({ initialData, isEditing = false }: Props) {
  const router = useRouter();

  const form = useForm<AdministratorValues>({
    resolver: zodResolver(administratorSchema),
    defaultValues: initialData || {
      name: '',
      email: '',
      company: '',
    },
  });

  const submitButtonText = isEditing ? 'Guardar Cambios' : 'Agregar administrador';
  const loadingButtonText = isEditing ? 'Guardando cambios...' : 'Agregando administrador...';
  const successMessage = isEditing ? 'Administrador actualizado exitosamente.' : 'Administrador agregado exitosamente.';
  const errorMessage = `Ocurrió un error al ${isEditing ? 'actualizar' : 'agregar'} el administrador. Inténtalo nuevamente.`;

  async function onSubmit(values: AdministratorValues) {
    console.warn('Valores del formulario:', values);
    try {
      await wait(3000);
      toast.success(successMessage);
      router.push('/super-admin/administrators'); // Ruta para administradores
    } catch (error) {
      console.error(error);
      toast.error(errorMessage);
    }
  }

  const isSubmitting = form.formState.isSubmitting;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 max-w-lg w-full mx-auto">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input
                  label='Nombre del administrador'
                  placeholder='Ej. Juan Pérez'
                  type='text'
                  disabled={isSubmitting}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input
                  label='Correo electrónico'
                  placeholder='Ej. juan.perez@ejemplo.com'
                  type='email'
                  disabled={isSubmitting}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="company"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input
                  label='Empresa'
                  placeholder='Ej. Banco Estado'
                  type='text'
                  disabled={isSubmitting}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-end space-x-4">
          <Button type="submit" aria-label={submitButtonText} disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
                {loadingButtonText}
              </>
            ) : (
              submitButtonText
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}
