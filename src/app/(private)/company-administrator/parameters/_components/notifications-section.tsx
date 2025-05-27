'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FormControl, FormDescription, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import type { CompanyParametersValues } from '@/lib/schemas/company-parameters-schema';
import type { UseFormReturn } from 'react-hook-form';

interface NotificationsSectionProps {
  form: UseFormReturn<CompanyParametersValues>;
  testFieldValidation: (fieldName: keyof CompanyParametersValues) => Promise<boolean>;
}

export default function NotificationsSection({ form, testFieldValidation }: NotificationsSectionProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Notificaciones</CardTitle>
        <CardDescription>Configuración de las notificaciones</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <FormField
          control={form.control}
          name="emailNotifications"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <span className="text-base text-primary">Notificaciones por Email</span>
                <FormDescription>Enviar notificaciones vía email</FormDescription>
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
                <span className="text-base text-primary">Notificaciones por SMS</span>
                <FormDescription>Enviar notificaciones vía mensaje de texto</FormDescription>
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
                <span className="text-base text-primary">Notificaciones Push</span>
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
                  placeholder='Ej. notificaciones@miempresa.com'
                  type='email'
                  {...field}
                  onBlur={() => testFieldValidation('notificationEmail')}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="notificationAnticipationTime"
          render={({ field }) => (
            <FormItem>
              <span className="text-base text-primary">Tiempo de Anticipación de Notificación (minutos)</span>
              <div className="flex items-center space-x-4">
                <FormControl>
                  <Slider
                    value={[field.value]}
                    min={1}
                    max={60}
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

        <FormField
          control={form.control}
          name="notificationTemplate"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input
                  label='Plantilla de Notificación'
                  placeholder='Ej. Estimado(a) {nombre}, su turno {numero} está próximo a ser atendido.'
                  type='text'
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </CardContent>
    </Card>
  );
}
