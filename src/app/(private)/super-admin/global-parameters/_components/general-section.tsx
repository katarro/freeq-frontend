'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import type { GlobalParametersValues } from '@/lib/schemas';
import type { UseFormReturn } from 'react-hook-form';

interface GeneralSectionProps {
  form: UseFormReturn<GlobalParametersValues>
}

export default function GeneralSection({ form }: GeneralSectionProps) {
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Configuración General</CardTitle>
          <CardDescription>Ajustes generales del sistema</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="platformName"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      label='Nombre de la Plataforma'
                      placeholder='Ej. Mi Plataforma'
                      type='text'
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="timezone"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <SelectTrigger floatingLabel="Zona Horaria">  Usando floatingLabel
                        <SelectValue placeholder="Seleccione zona horaria" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="america-santiago">América/Santiago</SelectItem>
                        <SelectItem value="america-bogota">América/Bogotá</SelectItem>
                        <SelectItem value="america-mexico">América/Ciudad de México</SelectItem>
                        <SelectItem value="america-lima">América/Lima</SelectItem>
                        <SelectItem value="america-buenos-aires">América/Buenos Aires</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="language"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <SelectTrigger floatingLabel="Idioma Predeterminado"> {/* Usando floatingLabel */}
                        <SelectValue placeholder="Seleccione idioma" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="es">Español</SelectItem>
                        <SelectItem value="en">Inglés</SelectItem>
                        <SelectItem value="pt">Portugués</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="dateFormat"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <SelectTrigger floatingLabel="Formato de Fecha">
                        <SelectValue placeholder="Seleccione formato" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="dd-mm-yyyy">DD-MM-YYYY</SelectItem>
                        <SelectItem value="mm-dd-yyyy">MM-DD-YYYY</SelectItem>
                        <SelectItem value="yyyy-mm-dd">YYYY-MM-DD</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="maintenanceMode"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <FormLabel className="text-base">Modo de Mantenimiento</FormLabel>
                  <FormDescription>Activar modo de mantenimiento para realizar actualizaciones del sistema</FormDescription>
                </div>
                <FormControl>
                  <Switch checked={field.value} onCheckedChange={field.onChange} />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="maxWaitTime"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tiempo Máximo de Espera (minutos)</FormLabel>
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
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Límites del Sistema</CardTitle>
          <CardDescription>Configuración de límites operacionales</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <FormField
            control={form.control}
            name="maxUsersPerCompany"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Máximo de Usuarios por Empresa</FormLabel>
                <div className="flex items-center space-x-4">
                  <FormControl>
                    <Slider
                      value={[field.value]}
                      min={10}
                      max={500}
                      step={10}
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
            name="maxBranchesPerCompany"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Máximo de Sucursales por Empresa</FormLabel>
                <div className="flex items-center space-x-4">
                  <FormControl>
                    <Slider
                      value={[field.value]}
                      min={1}
                      max={200}
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
            name="maxExecutivesPerBranch"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Máximo de Ejecutivos por Sucursal</FormLabel>
                <div className="flex items-center space-x-4">
                  <FormControl>
                    <Slider
                      value={[field.value]}
                      min={1}
                      max={100}
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
        </CardContent>
      </Card>
    </div>
  );
}
