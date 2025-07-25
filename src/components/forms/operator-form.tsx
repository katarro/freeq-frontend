'use client';

import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { operatorSchema, OperatorValues } from '@/lib/schemas/operator-schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { LoaderCircle } from 'lucide-react';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { wait } from '@/lib/utils';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { CalendarIcon } from 'lucide-react';

type Props = {
  initialData?: OperatorValues;
  isEditing?: boolean;
};

export default function OperatorForm({ initialData, isEditing = false }: Props) {
  const router = useRouter();

  const form = useForm<OperatorValues>({
    resolver: zodResolver(operatorSchema),
    defaultValues: initialData || {
      name: '',
      email: '',
      phone: '',
      shift: '',
      branch: '',
      startDate: '',
    },
  });

  const isSubmitting = form.formState.isSubmitting;
  const submitButtonText = isEditing ? 'Guardar Cambios' : 'Agregar Operador';
  const loadingButtonText = isEditing ? 'Guardando cambios...' : 'Agregando operador...';
  const successMessage = isEditing
    ? 'Operador actualizado exitosamente.'
    : 'Operador agregado exitosamente.';
  const errorMessage = `Ocurrió un error al ${isEditing ? 'actualizar' : 'agregar'} el operador. Inténtalo nuevamente.`;

  async function onSubmit(values: OperatorValues) {
    if (!isEditing && values.id === 0) {
    } else {
      console.warn('Valores del formulario:', values);
    }

    try {
      await wait(3000);
      toast.success(successMessage);
      router.push('/admin-branch/operators/');
    } catch (error) {
      console.error(error);
      toast.error(errorMessage);
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-6 max-w-2xl w-full mx-auto p-4"
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input
                  label="Nombre del operador"
                  placeholder="Ej. Ana Garcia"
                  type="text"
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
                  label="Correo electrónico"
                  placeholder="Ej. ana.garcia@empresa.com"
                  type="email"
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
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input
                  label="Número de teléfono"
                  placeholder="Ej. 56 9 1234 5678"
                  type="tel"
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
          name="shift"
          render={({ field }) => (
            <FormItem>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value}
                disabled={isSubmitting}
              >
                <FormControl>
                  <SelectTrigger floatingLabel="Turno">
                    <SelectValue placeholder="Selecciona un turno" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {['Mañana', 'Tarde', 'Noche', 'Mixto'].map((shiftOption) => (
                    <SelectItem key={shiftOption} value={shiftOption}>
                      {shiftOption}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="branch"
          render={({ field }) => (
            <FormItem>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value}
                disabled={isSubmitting}
              >
                <FormControl>
                  <SelectTrigger floatingLabel="Sucursal">
                    <SelectValue placeholder="Selecciona una sucursal" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {['Centro', 'Norte', 'Sur', 'Oriente'].map((branchOption) => (
                    <SelectItem key={branchOption} value={branchOption}>
                      {branchOption}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="startDate"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <Popover>
                <PopoverTrigger label="Fecha de inicio">
                  <FormControl>
                    <div className="flex justify-between w-full">
                      {field.value ? (
                        format(new Date(field.value), 'PPP', { locale: es })
                      ) : (
                        <span>Selecciona una fecha</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </div>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value ? new Date(field.value) : undefined}
                    onSelect={(date) => field.onChange(date ? format(date, 'yyyy-MM-dd') : '')}
                    disabled={(date) => date > new Date() || date < new Date('1900-01-01')}
                    initialFocus
                    locale={es}
                  />
                </PopoverContent>
              </Popover>
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
