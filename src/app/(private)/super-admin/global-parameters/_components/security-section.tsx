'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import type { GlobalParametersValues } from '@/lib/schemas';
import type { UseFormReturn } from 'react-hook-form';

type Props = {
  form: UseFormReturn<GlobalParametersValues>;
}

export default function SecuritySection({ form }: Props) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Configuración de seguridad</CardTitle>
        <CardDescription>Ajustes de seguridad del sistema</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <FormField
          control={form.control}
          name="twoFactorAuth"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel className="text-base">Autenticación de Dos Factores</FormLabel>
                <FormDescription>Requerir autenticación de dos factores para todos los usuarios</FormDescription>
              </div>
              <FormControl>
                <Switch checked={field.value} onCheckedChange={field.onChange} />
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="sessionDuration"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Duración de la Sesión (minutos)</FormLabel>
              <div className="flex items-center space-x-4">
                <FormControl>
                  <Slider
                    value={[field.value]}
                    min={5}
                    max={120}
                    step={5}
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
          name="loginAttempts"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Intentos de Inicio de Sesión</FormLabel>
              <div className="flex items-center space-x-4">
                <FormControl>
                  <Slider
                    value={[field.value]}
                    min={1}
                    max={10}
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
          name="forcePasswordChange"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel className="text-base">Forzar Cambio de Contraseña</FormLabel>
                <FormDescription>Forzar el cambio de contraseña cada 90 días</FormDescription>
              </div>
              <FormControl>
                <Switch checked={field.value} onCheckedChange={field.onChange} />
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="ipRestriction"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel className="text-base">Restricción por IP</FormLabel>
                <FormDescription>Restringir el acceso por dirección IP</FormDescription>
              </div>
              <FormControl>
                <Switch checked={field.value} onCheckedChange={field.onChange} />
              </FormControl>
            </FormItem>
          )}
        />
      </CardContent>
    </Card>
  );
}
