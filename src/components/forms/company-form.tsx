'use client';

import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { companySchema, CompanyValues } from '@/lib/schemas';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { LoaderCircle } from 'lucide-react';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { wait } from '@/lib/utils';

type Props = {
  initialData?: CompanyValues;
  isEditing?: boolean;
}

export default function CompanyForm({ initialData, isEditing = false }: Props) {
  const router = useRouter();

  const form = useForm<CompanyValues>({
    resolver: zodResolver(companySchema),
    defaultValues: initialData || {
      name: '',
      rut: '',
      subsidiaries: 0,
      administrators: 0,
      state: 'Activo',
    },
  });

  const submitButtonText = isEditing ? 'Guardar Cambios' : 'Agregar empresa';
  const loadingButtonText = isEditing ? 'Guardando cambios...' : 'Agregando empresa...';
  const successMessage = isEditing ? 'Empresa actualizada exitosamente.' : 'Empresa agregada exitosamente.';
  const errorMessage = `Ocurrió un error al ${isEditing ? 'actualizar' : 'agregar'} la empresa. Inténtalo nuevamente.`;

  async function onSubmit(values: CompanyValues) {
    console.warn('Valores del formulario:', values);
    try {
      await wait(3000);
      toast.success(successMessage);
      router.push('/super-admin/companies/');
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
                  label='Nombre de la empresa'
                  placeholder='Ej. Acme'
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
          name="rut"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input
                  label='RUT'
                  placeholder="Ej. 97.030.000-7"
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
          name="subsidiaries"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input
                  label='Sucursales'
                  placeholder="0"
                  type="number"
                  min={0}
                  disabled={isSubmitting}
                  {...field}
                  value={field.value === undefined || field.value === null ? '' : field.value.toString()}
                  onChange={(e) => {
                    const value = e.target.value;
                    field.onChange(value === '' ? '' : Number(value));
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="administrators"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input
                  label='Administradores'
                  placeholder="0"
                  type="number"
                  min={0}
                  disabled={isSubmitting}
                  {...field}
                  value={field.value === undefined || field.value === null ? '' : field.value.toString()}
                  onChange={(e) => {
                    const value = e.target.value;
                    field.onChange(value === '' ? '' : Number(value));
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="state"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  disabled={isSubmitting}
                >
                  <SelectTrigger floatingLabel="Estado">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Activo">Activo</SelectItem>
                    <SelectItem value="Inactivo">Inactivo</SelectItem>
                  </SelectContent>
                </Select>
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
