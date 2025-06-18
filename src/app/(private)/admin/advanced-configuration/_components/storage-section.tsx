'use client';

import { FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import type { UseFormReturn } from 'react-hook-form';
import type { AdvancedConfigurationValues } from '@/lib/schemas';
import { Card, CardContent } from '@/components/ui/card';

interface StorageSectionProps {
  form: UseFormReturn<AdvancedConfigurationValues>
}

export default function StorageSection({ form }: StorageSectionProps) {
  const storageType = form.watch('storageType');
  const showS3Fields = storageType === 's3';

  return (
    <Card>
      <CardContent className="space-y-4">
        <FormField
          control={form.control}
          name="storageType"
          render={({ field }) => (
            <FormItem>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger floatingLabel="Tipo de Almacenamiento">
                    <SelectValue placeholder="Seleccionar tipo de almacenamiento" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="local">Almacenamiento Local</SelectItem>
                  <SelectItem value="s3">Amazon S3</SelectItem>
                  <SelectItem value="gcs">Google Cloud Storage</SelectItem>
                  <SelectItem value="azure">Azure Blob Storage</SelectItem>
                </SelectContent>
              </Select>
              <FormDescription>Tipo de almacenamiento para los archivos</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {showS3Fields && (
          <>
            <FormField
              control={form.control}
              name="s3Bucket"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input label="Bucket S3" {...field} placeholder="mis-archivos-app" />
                  </FormControl>
                  <FormDescription>Nombre del bucket de S3</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="s3Region"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input label=" Región S3" {...field} placeholder="us-east-1" />
                  </FormControl>
                  <FormDescription>Región de AWS para S3</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="s3AccessKey"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input label="Clave de Acceso" {...field} placeholder="AKIAXXXXXXXXXXXXXXXX" />
                  </FormControl>
                  <FormDescription>ID de la clave de acceso de AWS</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="s3SecretKey"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input label="Clave secreta" {...field} type="password" placeholder="••••••••" />
                  </FormControl>
                  <FormDescription>Clave secreta de acceso de AWS</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </>
        )}

        <FormField
          control={form.control}
          name="fileCompression"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel className="text-base text-primary">Compresión de Archivos</FormLabel>
                <FormDescription>Comprimir archivos antes de almacenarlos</FormDescription>
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
          name="maxFileSize"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input label="Tamaño máximo de archivo (MB)" {...field} type="number" min={1} />
              </FormControl>
              <FormDescription>Tamaño máximo permitido de archivo en megabytes</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      </CardContent>
    </Card>
  );
}
