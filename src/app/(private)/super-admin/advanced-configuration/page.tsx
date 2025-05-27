'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';

import {
  advancedConfigurationSchema,
  type AdvancedConfigurationValues,
} from '@/lib/schemas';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import DatabaseSection from '@/app/(private)/super-admin/advanced-configuration/_components/data-base-section';
import HeaderSection from '@/app/(private)/super-admin/advanced-configuration/_components/header-section';
import StorageSection from '@/app/(private)/super-admin/advanced-configuration/_components/storage-section';
import SystemSection from '@/app/(private)/super-admin/advanced-configuration/_components/system-section';
import ValidationAlert from '@/app/(private)/super-admin/advanced-configuration/_components/validation-alert';
import Heading from '@/components/heading';
import { Separator } from '@/components/ui/separator';
import BottomAction from '@/components/bottom-action';

export default function AdvancedConfigurationPage() {
  const [openSection, setOpenSection] = useState<string>('system');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasChanges, setHasChanges] = useState<Record<string, boolean>>({
    system: false,
    database: false,
    storage: false,
  });

  const defaultValues: Partial<AdvancedConfigurationValues> = {
    // Valores predeterminados del sistema
    appVersion: '2.4.1',
    environment: 'production',
    debugMode: false,
    cacheEnabled: true,
    logLevel: 'info',
    cronJobs: '0 0 * * * /backup.sh\n0 */4 * * * /check-services.sh\n0 8 * * * /send-reports.sh',

    // Valores predeterminados de la base de datos
    dbHost: 'db.freeq.com',
    dbPort: '5432',
    dbName: 'freeq_production',
    dbUser: 'freeq_admin',
    dbPassword: '********',
    dbBackup: true,
    backupRetention: 30,

    // Valores predeterminados de almacenamiento
    storageType: 's3',
    s3Bucket: 'freeq-files-production',
    s3Region: 'us-east-1',
    s3AccessKey: 'AKIAXXXXXXXXXXXXXXXX',
    s3SecretKey: '********',
    fileCompression: true,
    maxFileSize: 10,
  };

  const form = useForm<AdvancedConfigurationValues>({
    resolver: zodResolver(advancedConfigurationSchema),
    defaultValues,
    mode: 'onChange',
  });

  const formState = form.formState;

  const getErrorsBySection = () => {
    const errors = formState.errors;
    const errorsBySection: Record<string, number> = {
      system: 0,
      database: 0,
      storage: 0,
    };

    const systemFields = ['appVersion', 'environment', 'debugMode', 'cacheEnabled', 'logLevel', 'cronJobs'];
    systemFields.forEach((field) => {
      if (errors[field as keyof AdvancedConfigurationValues]) {
        errorsBySection.system++;
      }
    });

    const databaseFields = ['dbHost', 'dbPort', 'dbName', 'dbUser', 'dbPassword', 'dbBackup', 'backupRetention'];
    databaseFields.forEach((field) => {
      if (errors[field as keyof AdvancedConfigurationValues]) {
        errorsBySection.database++;
      }
    });

    const storageFields = [
      'storageType',
      's3Bucket',
      's3Region',
      's3AccessKey',
      's3SecretKey',
      'fileCompression',
      'maxFileSize',
    ];
    storageFields.forEach((field) => {
      if (errors[field as keyof AdvancedConfigurationValues]) {
        errorsBySection.storage++;
      }
    });

    return errorsBySection;
  };

  const errorsBySection = getErrorsBySection();
  const totalErrors = Object.values(errorsBySection).reduce((sum, count) => sum + count, 0);

  const handleSaveClick = async () => {
    const result = await form.trigger();

    if (!result) {
      const sectionWithErrors = Object.entries(errorsBySection).find(([_, count]) => count > 0)?.[0];

      if (sectionWithErrors) {
        setOpenSection(sectionWithErrors);

        toast.error('Ocurrió un error, inténtalo más tarde');
      }
      return;
    }

    handleSubmit();
  };

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);

      await new Promise((resolve) => setTimeout(resolve, 1000));

      toast.success('Los cambios fueron guardados correctamente');

      setHasChanges({
        system: false,
        database: false,
        storage: false,
      });
    } catch (error) {
      toast.error('Hubo un error inesperado, inténtalo más tarde');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleViewErrors = (section: string) => {
    setOpenSection(section);
  };

  return (
    <section className="grid gap-6 pb-[82px]">
      <Heading
        title="Configuración avanzada"
        right={
          <Button
            variant="default"
            onClick={handleSaveClick}
            disabled={isSubmitting}
            className="hidden lg:flex"
          >
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isSubmitting ? 'Guardando...' : 'Guardar Cambios'}
          </Button>
        }
      />
      <Separator />
      {totalErrors > 0 && <ValidationAlert sectionErrors={errorsBySection} onViewErrors={handleViewErrors} />}
      <Form {...form}>
        <form className="space-y-4 xl:max-w-2xl w-full mx-auto">
          <Accordion type="single" collapsible value={openSection} onValueChange={setOpenSection} className="w-full">
            <AccordionItem  value="system" className="border rounded-lg mb-4">
              <AccordionTrigger className="px-4 py-2 hover:bg-muted/50 rounded-t-lg">
                <HeaderSection
                  title="Sistema"
                  errorCount={errorsBySection.system}
                  isValid={errorsBySection.system === 0}
                  hasChanges={hasChanges.system}
                />
              </AccordionTrigger>
              <AccordionContent className="px-4 pt-2 pb-4">
                <SystemSection form={form} />
              </AccordionContent>
            </AccordionItem>

            <AccordionItem  value="database" className="border rounded-lg mb-4">
              <AccordionTrigger className="px-4 py-2 hover:bg-muted/50 rounded-t-lg">
                <HeaderSection
                  title="Base de Datos"
                  errorCount={errorsBySection.database}
                  isValid={errorsBySection.database === 0}
                  hasChanges={hasChanges.database}
                />
              </AccordionTrigger>
              <AccordionContent className="px-4 pt-2 pb-4">
                <DatabaseSection form={form} />
              </AccordionContent>
            </AccordionItem>

            <AccordionItem  value="storage" className="border rounded-lg mb-4">
              <AccordionTrigger className="px-4 py-2 hover:bg-muted/50 rounded-t-lg">
                <HeaderSection
                  title="Almacenamiento"
                  errorCount={errorsBySection.storage}
                  isValid={errorsBySection.storage === 0}
                  hasChanges={hasChanges.storage}
                />
              </AccordionTrigger>
              <AccordionContent className="px-4 pt-2 pb-4">
                <StorageSection form={form} />
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </form>
      </Form>
      <BottomAction>
        <Button
          variant="default"
          onClick={handleSaveClick}
          className="w-full"
          disabled={isSubmitting}
        >
          {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {isSubmitting ? 'Guardando...' : 'Guardar Cambios'}
        </Button>
      </BottomAction>
    </section>
  );
}
