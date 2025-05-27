'use client';

import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { subsidiarySchema, SubsidiaryValues } from '@/lib/schemas/subsidiary-schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Check, ChevronsUpDown, LoaderCircle } from 'lucide-react';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { wait, cn } from '@/lib/utils';

import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useState } from 'react';


type Props = {
  initialData?: SubsidiaryValues;
  isEditing?: boolean;
}

const branchManagers = [
  { value: 'roberto sánchez', label: 'Roberto Sánchez' },
  { value: 'ana martínez', label: 'Ana Martínez' },
  { value: 'carlos rodríguez', label: 'Carlos Rodríguez' },
  { value: 'maría gonzález', label: 'María González' },
  { value: 'juan pérez', label: 'Juan Pérez' },
  { value: 'carmen silva', label: 'Carmen Silva' },
  { value: 'diego muñoz', label: 'Diego Muñoz' },
];

export default function SubsidiaryForm({ initialData, isEditing = false }: Props) {
  const [openPopover, setOpenPopover] = useState(false);


  const router = useRouter();

  const form = useForm<SubsidiaryValues>({
    resolver: zodResolver(subsidiarySchema),
    defaultValues: initialData || {
      name: '',
      address: '',
      branchManager: '',
      executives: 0,
      status: 'Activo',
    },
  });

  const submitButtonText = isEditing ? 'Guardar Cambios' : 'Agregar sucursal';
  const loadingButtonText = isEditing ? 'Guardando cambios...' : 'Agregando sucursal...';
  const successMessage = isEditing ? 'Sucursal actualizada exitosamente.' : 'Sucursal agregada exitosamente.';
  const errorMessage = `Ocurrió un error al ${isEditing ? 'actualizar' : 'agregar'} la sucursal. Inténtalo nuevamente.`;

  async function onSubmit(values: SubsidiaryValues) {
    console.warn('Valores del formulario:', values);
    try {
      await wait(3000);
      toast.success(successMessage);
      router.push('/company-administrator/subsidiaries/');
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
                  label="Nombre de la sucursal"
                  placeholder='Ej. Santiago Centro'
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
          name="address"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input
                  label="Dirección"
                  placeholder='Ej. Alameda 1340, Santiago'
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
          name="branchManager"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <Popover open={openPopover} onOpenChange={setOpenPopover}>
                <PopoverTrigger label="Jefe de sucursal" disabled={isSubmitting}>
                  {field.value
                    ? branchManagers.find(
                      (manager) => manager.value === field.value.toLowerCase(),
                    )?.label
                    : 'Selecciona un jefe de sucursal'}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0" />
                </PopoverTrigger>
                <PopoverContent className="p-0">
                  <Command>
                    <CommandInput placeholder="Buscar jefe de sucursal..." />
                    <CommandEmpty>No se encontró ningún jefe de sucursal.</CommandEmpty>
                    <CommandList>
                      <CommandGroup>
                        {branchManagers.map((manager) => (
                          <CommandItem
                            value={manager.label}
                            key={manager.value}
                            onSelect={(currentLabel) => {
                              field.onChange(currentLabel === field.value ? '' : currentLabel);
                              setOpenPopover(false);
                            }}
                          >
                            <Check
                              className={cn(
                                'mr-2 h-4 w-4',
                                manager.label === field.value ? 'opacity-100' : 'opacity-0',
                              )}
                            />
                            {manager.label}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="executives"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input
                  label="Número de ejecutivos"
                  type='number'
                  placeholder='Ej. 10'
                  disabled={isSubmitting}
                  {...field}
                  onChange={(e) => field.onChange(parseInt(e.target.value))}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="status"
          render={({ field }) => (
            <FormItem>
              <Select onValueChange={field.onChange} defaultValue={field.value} disabled={isSubmitting}>
                <FormControl>
                  <SelectTrigger floatingLabel="Estado">
                    <SelectValue placeholder="Selecciona el estado" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="Activo">Activo</SelectItem>
                  <SelectItem value="Inactivo">Inactivo</SelectItem>
                </SelectContent>
              </Select>
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
