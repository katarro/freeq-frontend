'use client';

import { FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import type { UseFormReturn } from 'react-hook-form';
import type { AdvancedConfigurationValues } from '@/lib/schemas';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

type Props = {
  form: UseFormReturn<AdvancedConfigurationValues>
}

export default function DatabaseSection({ form }: Props) {
  return (
    <Card>
      <CardHeader className="hidden">
        <CardTitle className="sr-only">Base de datos</CardTitle>
        <CardDescription className="sr-only">Base de datos</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="dbHost"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input label="Host" {...field} placeholder="db.example.com" />
                </FormControl>
                <FormDescription>Nombre de host o IP del servidor de la base de datos</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="dbPort"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input label="Puerto" {...field} placeholder="5432" />
                </FormControl>
                <FormDescription>Puerto del servidor de la base de datos</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="dbName"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input label="Nombre de la base de datos" {...field} placeholder="app_production" />
                </FormControl>
                <FormDescription>Nombre de la base de datos</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="dbUser"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input label="Usuario" {...field} placeholder="db_user" />
                </FormControl>
                <FormDescription>Nombre de usuario de la base de datos</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <FormField
          control={form.control}
          name="dbPassword"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input label="Contraseña" {...field} type="password" placeholder="••••••••" />
              </FormControl>
              <FormDescription>Contraseña de la base de datos</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="dbBackup"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel className="text-base text-primary">Copia de Seguridad Automática</FormLabel>
                <FormDescription>Realizar copias de seguridad automáticas diarias</FormDescription>
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
          name="backupRetention"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input label="Retención de Copias de Seguridad (días)" {...field} type="number" min={1} />
              </FormControl>
              <FormDescription>Número de días para conservar las copias de seguridad</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end space-x-2 pt-2">
          <Button variant="outline" type="button" size="default">
            Probar conexión
          </Button>
          <Button variant="outline" type="button" size="default">
            Hacer copia de seguridad
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
