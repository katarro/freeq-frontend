'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { toast } from 'sonner';

import { boxSchema, type BoxFormValues } from '@/lib/schemas';
import { useRouter } from 'next/navigation';

type Props = {
  isEditing?: boolean;
  initialData?: Partial<BoxFormValues>;
};

export default function BoxForm({ isEditing = false, initialData }: Props) {
  const router = useRouter();

  const form = useForm<BoxFormValues>({
    resolver: zodResolver(boxSchema),
    defaultValues: initialData || {
      name: '',
      type: 'physical',
      location: '',
      capacity: 1,
      priority: 'Muy Alta',
      assignedOperator: null,
      services: [],
      equipment: [],
    },
  });

  const { handleSubmit, control, formState: { isSubmitting }, getValues, setValue } = form;

  async function onSubmit  (data: BoxFormValues) {
    console.warn('Datos del formulario:', data);
    try {
      await new Promise((resolve) => setTimeout(resolve, 3000));
      toast.success(isEditing ? 'Caja actualizada exitosamente!' : 'Caja creada exitosamente!');
    } catch (error) {
      console.error('Error al crear/actualizar la caja o validación de esquema fallida:', error);
      toast.error('Ocurrió un error al enviar la caja. Revisa los datos.');
    } finally {
      router.push('/subsidiary-manager/boxes-configuration/');
    }
  }

  const handleEquipmentChange = (value: boolean | string, equipmentName: string) => {
    const currentEquipment = getValues('equipment') || [];
    let updatedEquipment: string[];

    if (value) {
      updatedEquipment = [...currentEquipment, equipmentName];
    } else {
      updatedEquipment = currentEquipment.filter(item => item !== equipmentName);
    }
    setValue('equipment', updatedEquipment, { shouldValidate: true });
  };

  const isEquipmentChecked = (equipmentName: string) => {
    const currentEquipment = getValues('equipment') || [];
    return currentEquipment.includes(equipmentName);
  };

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit(onSubmit)} className="max-w-lg w-full mx-auto flex flex-col gap-4">
        <FormField
          control={control}
          name="name"
          render={({ field }) => (
            <FormItem className="space-y-2">
              <FormControl>
                <Input label="Nombre de la caja" id="boxName" placeholder="Ej: Caja 4" disabled={isSubmitting} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="type"
          render={({ field }) => (
            <FormItem className="space-y-2">
              <FormControl>
                <Select onValueChange={field.onChange} value={field.value} disabled={isSubmitting}>
                  <SelectTrigger floatingLabel="Tipo de caja" id="boxType">
                    <SelectValue placeholder="Física" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="physical">Física</SelectItem>
                    <SelectItem value="virtual">Virtual</SelectItem>
                    <SelectItem value="mixed">Mixta</SelectItem>
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="location"
          render={({ field }) => (
            <FormItem className="space-y-2">
              <FormControl>
                <Input label="Ubicación física" id="location" placeholder="Ej: Planta Baja - Sector D" disabled={isSubmitting} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name="capacity"
          render={({ field }) => (
            <FormItem className="space-y-2">
              <FormControl>
                <Input
                  id="capacity"
                  label="Capacidad máxima"
                  type="number"
                  placeholder="15"
                  disabled={isSubmitting}
                  {...field}
                  value={field.value ?? ''}
                  onChange={e => field.onChange(e.target.value === '' ? undefined : parseInt(e.target.value, 10))}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid gap-4">
          <FormLabel>Equipamiento</FormLabel>
          <div className="grid grid-cols-2 gap-2">
            <FormItem className="flex flex-row items-start space-y-0 p-0">
              <FormControl>
                <Checkbox
                  checked={isEquipmentChecked('Terminal POS')}
                  onCheckedChange={(checked) => handleEquipmentChange(checked, 'Terminal POS')}
                  id="pos"
                  disabled={isSubmitting}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel htmlFor="pos">Terminal POS</FormLabel>
              </div>
            </FormItem>
            <FormItem className="flex flex-row items-start space-y-0 p-0">
              <FormControl>
                <Checkbox
                  checked={isEquipmentChecked('Impresora')}
                  onCheckedChange={(checked) => handleEquipmentChange(checked, 'Impresora')}
                  id="printer"
                  disabled={isSubmitting}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel htmlFor="printer">Impresora</FormLabel>
              </div>
            </FormItem>
            <FormItem className="flex flex-row items-start space-y-0 p-0">
              <FormControl>
                <Checkbox
                  checked={isEquipmentChecked('Escaner')}
                  onCheckedChange={(checked) => handleEquipmentChange(checked, 'Escaner')}
                  id="scanner"
                  disabled={isSubmitting}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel htmlFor="scanner">Scanner</FormLabel>
              </div>
            </FormItem>
            <FormItem className="flex flex-row items-start space-y-0 p-0">
              <FormControl>
                <Checkbox
                  checked={isEquipmentChecked('Cámara')}
                  onCheckedChange={(checked) => handleEquipmentChange(checked, 'Cámara')}
                  id="camera"
                  disabled={isSubmitting}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel htmlFor="camera">Cámara</FormLabel>
              </div>
            </FormItem>
          </div>
          <FormMessage className="col-span-2">
            {form.formState.errors.equipment?.message as string}
          </FormMessage>
        </div>

        <FormField
          control={control}
          name="priority"
          render={({ field }) => (
            <FormItem className="space-y-2">
              <FormControl>
                <Select onValueChange={field.onChange} value={field.value} disabled={isSubmitting}>
                  <SelectTrigger floatingLabel="Prioridad">
                    <SelectValue placeholder="Seleccionar prioridad" />
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
        <FormField
          control={control}
          name="assignedOperator"
          render={({ field }) => (
            <FormItem className="space-y-2">
              <FormControl>
                {/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */}
                {/*@ts-expect-error*/}
                <Select onValueChange={field.onChange} value={field.value} disabled={isSubmitting}>
                  <SelectTrigger floatingLabel="Operador asignado">
                    <SelectValue placeholder="Seleccionar operador" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ana">Ana García</SelectItem>
                    <SelectItem value="carlos">Carlos López</SelectItem>
                    <SelectItem value="maria">María Rodríguez</SelectItem>
                    <SelectItem value="juan">Juan Pérez</SelectItem>
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name="services"
          render={({ field }) => (
            <FormItem className="space-y-2">
              <FormControl>
                <Textarea label="Servicios disponibles" id="services" placeholder="Ej: Depósitos, Retiros, Consultas, Asesorías..." rows={3} disabled={isSubmitting} {...field} value={field.value || ''} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end space-x-2 mt-6">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? (isEditing ? 'Guardando...' : 'Creando...') : (isEditing ? 'Guardar Cambios' : 'Crear Caja')}
          </Button>
        </div>
      </form>
    </Form>
  );
}
