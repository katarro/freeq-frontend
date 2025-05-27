'use client';

import { FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import type { UseFormReturn } from 'react-hook-form';
import type { AdvancedConfigurationValues } from '@/lib/schemas';
import { Card, CardContent } from '@/components/ui/card';

type Props = {
  form: UseFormReturn<AdvancedConfigurationValues>
}

export default function SystemSection({ form }: Props) {
  return (
    <Card>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="appVersion"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    label='Versión actual de la aplicación'
                    placeholder='Versión actual de la aplicación'
                    {...field}
                    readOnly
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="environment"
            render={({ field }) => (
              <FormItem>
                <Select  onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger floatingLabel="Entorno de aplicación">
                      <SelectValue placeholder="Seleccionar entorno" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="development">Desarrollo</SelectItem>
                    <SelectItem value="staging">Staging</SelectItem>
                    <SelectItem value="production">Producción</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="debugMode"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel className="text-base text-primary">Modo Depuración</FormLabel>
                <FormDescription>Activar el modo de depuración para información detallada de errores</FormDescription>
              </div>
              <FormControl>
                <Switch checked={field.value} onCheckedChange={field.onChange} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="cacheEnabled"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel className="text-base text-primary">Caché del Sistema</FormLabel>
                <FormDescription>Activar caché para mejorar el rendimiento</FormDescription>
              </div>
              <FormControl>
                <Switch checked={field.value} onCheckedChange={field.onChange} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="logLevel"
          render={({ field }) => (
            <FormItem>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger
                    floatingLabel='Nivel de registro (Logs)'
                  >
                    <SelectValue placeholder="Seleccionar nivel de registro" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="error">Error</SelectItem>
                  <SelectItem value="warning">Advertencia</SelectItem>
                  <SelectItem value="info">Información</SelectItem>
                  <SelectItem value="debug">Depuración</SelectItem>
                </SelectContent>
              </Select>
              <FormDescription>Nivel de verbosidad del registro</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="cronJobs"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Textarea {...field} label="Ingresar expresiones CRON" placeholder="Ingresar expresiones CRON" className="font-mono text-sm" rows={4} />
              </FormControl>
              <FormDescription>Programar tareas recurrentes usando la sintaxis CRON</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      </CardContent>
    </Card>
  );
}
