'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import type { GlobalParametersValues } from '@/lib/schemas';
import type { UseFormReturn } from 'react-hook-form';
import { toast } from 'sonner';

type Props = {
  form: UseFormReturn<GlobalParametersValues>
}

export default function IntegrationsSection({ form }: Props) {

  return (
    <Card>
      <CardHeader>
        <CardTitle>Integraciones</CardTitle>
        <CardDescription>Configuración de la integración con servicios externos</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <FormField
          control={form.control}
          name="apiIntegration"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel className="text-base text-primary">API REST</FormLabel>
                <FormDescription>Habilitar la integración con la API REST</FormDescription>
              </div>
              <FormControl>
                <Switch checked={field.value} onCheckedChange={field.onChange} />
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="apiKey"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input
                  label='Clave de API'
                  placeholder="Generada automáticamente"
                  type="password"
                  {...field}
                />
              </FormControl>
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  type="button"
                  size="default"
                  onClick={() => {
                    const newApiKey =
                      'sk_test_' +
                      Math.random().toString(36).substring(2, 15) +
                      Math.random().toString(36).substring(2, 15);
                    form.setValue('apiKey', newApiKey);

                    toast.success('Clave de API regenerada');
                  }}
                >
                  Regenerar
                </Button>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="webhookIntegration"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel className="text-base text-primary">Webhooks</FormLabel>
                <FormDescription>Habilitar la integración de webhooks</FormDescription>
              </div>
              <FormControl>
                <Switch checked={field.value} onCheckedChange={field.onChange} />
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="webhookUrl"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input
                  label='URL del Webhook'
                  placeholder="Ej. https://tu-sitio.com/webhook"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="ssoIntegration"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel className="text-base text-primary">Inicio de Sesión Único (SSO)</FormLabel>
                <FormDescription>Habilitar la integración de SSO</FormDescription>
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
