'use client';

import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { Check, ChevronsUpDown, LoaderCircle } from 'lucide-react';
import { toast } from 'sonner';
import { useState } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { SubsidiaryManagerSchema, type SubsidiaryManagerValues } from '@/lib/schemas';
import { wait, cn } from '@/lib/utils';

const subsidiariesList = [
  { value: 'santiago centro', label: 'Santiago Centro' },
  { value: 'providencia', label: 'Providencia' },
  { value: 'las condes', label: 'Las Condes' },
  { value: 'ñuñoa', label: 'Ñuñoa' },
  { value: 'maipú', label: 'Maipú' },
  { value: 'la florida', label: 'La Florida' },
  { value: 'puente alto', label: 'Puente Alto' },
];

interface SubsidiaryManagerFormProps {
  isEditing?: boolean;
  initialData?: SubsidiaryManagerValues;
}

export default function SubsidiaryManagerForm({ isEditing = false, initialData }: SubsidiaryManagerFormProps) {
  const router = useRouter();
  const [openPopover, setOpenPopover] = useState(false);

  const form = useForm<SubsidiaryManagerValues>({
    resolver: zodResolver(SubsidiaryManagerSchema),
    defaultValues: initialData || {
      fullName: '',
      email: '',
      phone: '',
      subsidiary: '',
      status: 'Activo',
    },
  });

  const { isSubmitting } = form.formState;

  const onSubmit = async (values: SubsidiaryManagerValues) => {
    try {
      await wait(2000);
      if (isEditing) {
        toast.success(`Jefe de sucursal "${values.fullName}" actualizado.`);
      } else {
        toast.success(`Nuevo jefe de sucursal "${values.fullName}" agregado.`);
        form.reset();
      }
      router.push('/company-administrator/subsidiaries-managers/');
    } catch (error) {
      console.error('Error submitting form:', error);
      toast.error('Ocurrió un error al guardar. Inténtalo de nuevo.');
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 max-w-lg w-full mx-auto">
        <div className="grid grid-cols-1 gap-4">
          <FormField
            control={form.control}
            name="fullName"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input label="Nombre Completo" placeholder="Ej. Juan Pérez" {...field} disabled={isSubmitting} />
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
                  <Input label="Correo Electrónico" type="email" placeholder="Ej. juan.perez@example.com" {...field} disabled={isSubmitting} />
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
                  <Input label="Teléfono" placeholder="Ej. +56912345678" {...field} disabled={isSubmitting} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="subsidiary"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <Popover open={openPopover} onOpenChange={setOpenPopover}>
                  <PopoverTrigger label="Sucursal">
                    {field.value
                      ? subsidiariesList.find(
                        (subsidiary) => subsidiary.value === field.value.toLowerCase(),
                      )?.label
                      : 'Selecciona una sucursal'}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </PopoverTrigger>
                  <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
                    <Command>
                      <CommandInput placeholder="Buscar sucursal..." />
                      <CommandEmpty>No se encontró ninguna sucursal.</CommandEmpty>
                      <CommandList>
                        <CommandGroup>
                          {subsidiariesList.map((subsidiary) => (
                            <CommandItem
                              value={subsidiary.label}
                              key={subsidiary.value}
                              onSelect={(currentLabel) => {
                                const selectedSubsidiary = subsidiariesList.find(item => item.label.toLowerCase() === currentLabel.toLowerCase());
                                field.onChange(selectedSubsidiary ? selectedSubsidiary.label : '');
                                setOpenPopover(false);
                              }}
                            >
                              <Check
                                className={cn(
                                  'mr-2 h-4 w-4',
                                  field.value.toLowerCase() === subsidiary.value ? 'opacity-100' : 'opacity-0',
                                )}
                              />
                              {subsidiary.label}
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
            name="status"
            render={({ field }) => (
              <FormItem>
                <Select onValueChange={field.onChange} defaultValue={field.value} disabled={isSubmitting}>
                  <FormControl>
                    <SelectTrigger floatingLabel="Estado">
                      <SelectValue placeholder="Selecciona un estado" />
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
        </div>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
              Guardando...
            </>
          ) : isEditing ? (
            'Guardar Cambios'
          ) : (
            'Agregar Jefe'
          )}
        </Button>
      </form>
    </Form>
  );
}
