'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FormControl, FormDescription, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import type { CompanyParametersValues } from '@/lib/schemas/company-parameters-schema';
import type { UseFormReturn } from 'react-hook-form';

interface CustomerServiceSectionProps {
  form: UseFormReturn<CompanyParametersValues>
}

export default function CustomerServiceSection({ form }: CustomerServiceSectionProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Atención al Cliente</CardTitle>
        <CardDescription>Configuración de los parámetros de atención al cliente</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <FormField
          control={form.control}
          name="maxWaitTime"
          render={({ field }) => (
            <FormItem>
              <span className="text-base text-primary">Tiempo máximo de espera (minutos)</span>
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
          name="averageAttentionTime"
          render={({ field }) => (
            <FormItem>
              <span className="text-base text-primary">Tiempo Promedio de Atención (minutos)</span>
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
          name="priorityQueue"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <span className="text-base text-primary">Cola Prioritaria</span>
                <FormDescription>Habilitar cola prioritaria para adultos mayores, embarazadas y personas con discapacidad</FormDescription>
              </div>
              <FormControl>
                <Switch checked={field.value} onCheckedChange={field.onChange} />
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="satisfactionSurvey"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <span className="text-base text-primary">Encuesta de Satisfacción</span>
                <FormDescription>Solicitar encuesta de satisfacción después de finalizar el servicio</FormDescription>
              </div>
              <FormControl>
                <Switch checked={field.value} onCheckedChange={field.onChange} />
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="maxClientsPerExecutive"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input
                  label='Máximo de Clientes por Ejecutivo'
                  placeholder='Ej. 30'
                  type='number'
                  {...field}
                  onChange={event => field.onChange(Number(event.target.value))}
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
