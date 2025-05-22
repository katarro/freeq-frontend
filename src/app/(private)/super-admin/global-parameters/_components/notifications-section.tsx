'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import type { GlobalParametersValues } from '@/lib/schemas';
import type { UseFormReturn } from 'react-hook-form';

type Props = {
  form: UseFormReturn<GlobalParametersValues>;
  testFieldValidation: (fieldName: keyof GlobalParametersValues) => Promise<void>;
}

export default function NotificationsSection({ form, testFieldValidation }: Props) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Configuración de Notificaciones</CardTitle>
        <CardDescription>Ajustes de notificaciones del sistema</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <FormField
          control={form.control}
          name="emailNotifications"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel className="text-base">Notificaciones por Correo Electrónico</FormLabel>
                <FormDescription>Enviar notificaciones por correo electrónico</FormDescription>
              </div>
              <FormControl>
                <Switch checked={field.value} onCheckedChange={field.onChange} />
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="smsNotifications"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel className="text-base">Notificaciones por SMS</FormLabel>
                <FormDescription>Enviar notificaciones por mensaje de texto</FormDescription>
              </div>
              <FormControl>
                <Switch checked={field.value} onCheckedChange={field.onChange} />
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="pushNotifications"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel className="text-base">Notificaciones Push</FormLabel>
                <FormDescription>Enviar notificaciones push a dispositivos móviles</FormDescription>
              </div>
              <FormControl>
                <Switch checked={field.value} onCheckedChange={field.onChange} />
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="notificationEmail"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input
                  label='Correo Electrónico de Notificación'
                  placeholder='Ej. notificaciones@ejemplo.com'
                  type='email'
                  {...field}
                  required
                  onBlur={() => testFieldValidation('notificationEmail')}
                />
              </FormControl>
              <FormDescription>Este campo es obligatorio y debe ser una dirección de correo electrónico válida.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="notificationAnticipation"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tiempo de Anticipación de Notificación (minutos)</FormLabel>
              <div className="flex items-center space-x-4">
                <FormControl>
                  <Slider
                    value={[field.value]}
                    min={1}
                    max={30}
                    step={1}
                    onValueChange={(vals) => field.onChange(vals[0])}
                    className="flex-1"
                  />
                </FormControl>
                <span className="w-12 text-center">{field.value}</span>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
      </CardContent>
    </Card>
  );
}
