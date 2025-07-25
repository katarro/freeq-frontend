'use client';

import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { LoaderCircle } from 'lucide-react';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { wait } from '@/lib/utils';
import { ruleSchema, RuleValues } from '@/lib/schemas/rule-schema';

type Props = {
  initialData?: RuleValues;
  isEditing?: boolean;
};

export default function RuleForm({ initialData, isEditing = false }: Props) {
  const router = useRouter();

  const form = useForm<RuleValues>({
    resolver: zodResolver(ruleSchema),
    defaultValues: initialData || {
      name: '',
      type: 'time',
      description: '',
      value: '',
      unit: '',
      priority: 'Muy Alta',
      actions: [],
    },
  });

  const submitButtonText = isEditing ? 'Guardar Cambios' : 'Crear Regla';
  const loadingButtonText = isEditing ? 'Guardando cambios...' : 'Creando regla...';
  const successMessage = isEditing
    ? 'Regla actualizada exitosamente.'
    : 'Regla creada exitosamente.';
  const errorMessage = `Ocurrió un error al ${isEditing ? 'actualizar' : 'crear'} la regla. Inténtalo nuevamente.`;

  async function onSubmit(values: RuleValues) {
    console.warn('Valores del formulario:', values);
    try {
      await wait(3000);
      toast.success(successMessage);
    } catch (error) {
      console.error(error);
      toast.error(errorMessage);
    } finally {
      router.push('/admin-branch/queue-rules/');
    }
  }

  const isSubmitting = form.formState.isSubmitting;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4 max-w-lg w-full mx-auto">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input
                  label="Nombre de la regla"
                  placeholder="Ej: Tiempo máximo de atención"
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
          name="type"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  disabled={isSubmitting}
                >
                  <SelectTrigger floatingLabel="Tipo de regla">
                    <SelectValue placeholder="Seleccionar tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="time">Tiempo</SelectItem>
                    <SelectItem value="absence">Ausencia</SelectItem>
                    <SelectItem value="priority">Prioridad</SelectItem>
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Textarea
                  label="Descripción"
                  placeholder="Describe el propósito de esta regla..."
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
          name="value"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input
                  label="Valor"
                  placeholder="5"
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
          name="unit"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  disabled={isSubmitting}
                >
                  <SelectTrigger floatingLabel="Unidad">
                    <SelectValue placeholder="Seleccionar" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="minutos">minutos</SelectItem>
                    <SelectItem value="horas">horas</SelectItem>
                    <SelectItem value="nivel">nivel</SelectItem>
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="priority"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  disabled={isSubmitting}
                >
                  <SelectTrigger floatingLabel="Prioridad">
                    <SelectValue placeholder="Seleccionar" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Muy Alta">Muy Alta</SelectItem>
                    <SelectItem value="Alta">Alta</SelectItem>
                    <SelectItem value="Media">Media</SelectItem>
                    <SelectItem value="Baja">Baja</SelectItem>
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {form.watch('type') === 'priority' && (
          <FormField
            control={form.control}
            name="criteria"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    label="Criterio (para reglas de prioridad)"
                    placeholder="Ej: Estatus VIP en sistema"
                    type="text"
                    disabled={isSubmitting}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        <div className="grid gap-4">
          <FormLabel>Acciones Automáticas</FormLabel>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
            <FormField
              control={form.control}
              name="actions"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-y-0">
                  <FormControl>
                    <Checkbox
                      checked={field.value?.includes('Alerta al supervisor')}
                      onCheckedChange={(checked) => {
                        return checked
                          ? field.onChange([...(field.value || []), 'Alerta al supervisor'])
                          : field.onChange(
                              field.value?.filter((value) => value !== 'Alerta al supervisor'),
                            );
                      }}
                      disabled={isSubmitting}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Alerta al supervisor</FormLabel>
                  </div>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="actions"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-y-0">
                  <FormControl>
                    <Checkbox
                      checked={field.value?.includes('Notificación al operador')}
                      onCheckedChange={(checked) => {
                        return checked
                          ? field.onChange([...(field.value || []), 'Notificación al operador'])
                          : field.onChange(
                              field.value?.filter((value) => value !== 'Notificación al operador'),
                            );
                      }}
                      disabled={isSubmitting}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Notificar operador</FormLabel>
                  </div>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="actions"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-y-0">
                  <FormControl>
                    <Checkbox
                      checked={field.value?.includes('Redistribuir clientes')}
                      onCheckedChange={(checked) => {
                        return checked
                          ? field.onChange([...(field.value || []), 'Redistribuir clientes'])
                          : field.onChange(
                              field.value?.filter((value) => value !== 'Redistribuir clientes'),
                            );
                      }}
                      disabled={isSubmitting}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Redistribuir clientes</FormLabel>
                  </div>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="actions"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-y-0">
                  <FormControl>
                    <Checkbox
                      checked={field.value?.includes('Escalar problema')}
                      onCheckedChange={(checked) => {
                        return checked
                          ? field.onChange([...(field.value || []), 'Escalar problema'])
                          : field.onChange(
                              field.value?.filter((value) => value !== 'Escalar problema'),
                            );
                      }}
                      disabled={isSubmitting}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Escalar problema</FormLabel>
                  </div>
                </FormItem>
              )}
            />
          </div>
          <FormMessage />
        </div>

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
