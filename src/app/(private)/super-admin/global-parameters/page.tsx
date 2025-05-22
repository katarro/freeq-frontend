'use client';

import { useState, useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import {
  Form,
} from '@/components/ui/form';

import {
  globalParametersSchema,
  type GlobalParametersValues,
} from '@/lib/schemas';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import IntegrationsSection from '@/app/(private)/super-admin/global-parameters/_components/integrations-section';
import HeaderSection from '@/app/(private)/super-admin/global-parameters/_components/header-section';
import NotificationsSection from '@/app/(private)/super-admin/global-parameters/_components/notifications-section';
import GeneralSection from '@/app/(private)/super-admin/global-parameters/_components/general-section';
import ValidationAlert from '@/app/(private)/super-admin/global-parameters/_components/validation-alert';
import { toast } from 'sonner';
import SecuritySection from '@/app/(private)/super-admin/global-parameters/_components/security-section';
import Heading from '@/components/heading';

const defaultValues: GlobalParametersValues = {
  platformName: 'Mi Plataforma',
  timezone: 'america-santiago',
  language: 'es',
  dateFormat: 'dd-mm-yyyy',
  maintenanceMode: false,
  maxWaitTime: 5,
  maxUsersPerCompany: 100,
  maxBranchesPerCompany: 50,
  maxExecutivesPerBranch: 20,
  emailNotifications: true,
  smsNotifications: false,
  pushNotifications: true,
  notificationEmail: 'admin@ejemplo.com',
  notificationAnticipation: 10,
  twoFactorAuth: true,
  sessionDuration: 60,
  loginAttempts: 5,
  forcePasswordChange: true,
  ipRestriction: false,
  apiIntegration: true,
  apiKey: 'sk_test_exampleapikey123',
  webhookIntegration: false,
  webhookUrl: '',
  ssoIntegration: false,
};

const sectionFields: Record<string, string[]> = {
  general: [
    'platformName',
    'timezone',
    'language',
    'dateFormat',
    'maintenanceMode',
    'maxWaitTime',
    'maxUsersPerCompany',
    'maxBranchesPerCompany',
    'maxExecutivesPerBranch',
  ],
  notifications: [
    'emailNotifications',
    'smsNotifications',
    'pushNotifications',
    'notificationEmail',
    'notificationAnticipation',
  ],
  security: [
    'twoFactorAuth',
    'sessionDuration',
    'loginAttempts',
    'forcePasswordChange',
    'ipRestriction',
  ],
  integrations: [
    'apiIntegration',
    'apiKey',
    'webhookIntegration',
    'webhookUrl',
    'ssoIntegration',
  ],
};


export default function ParametrosGlobalesPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [openSections, setOpenSections] = useState<string>('general');
  const [sectionErrors, setSectionErrors] = useState<Record<string, number>>({
    general: 0,
    notifications: 0,
    security: 0,
    integrations: 0,
  });

  const form = useForm<GlobalParametersValues>({
    resolver: zodResolver(globalParametersSchema),
    defaultValues,
    mode: 'onChange',
  });

  useEffect(() => {
    const errors = form.formState.errors;
    const newSectionErrors = {
      general: 0,
      notifications: 0,
      security: 0,
      integrations: 0,
    };

    Object.keys(errors).forEach((fieldName) => {
      Object.entries(sectionFields).forEach(([section, fields]) => {
        if (fields.includes(fieldName) && errors[fieldName as keyof GlobalParametersValues]) {
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-expect-error
          newSectionErrors[section]++;
        }
      });
    });

    setSectionErrors(newSectionErrors);
  }, [form.formState.errors]);

  async function onSubmit(data: GlobalParametersValues) {
    setIsSubmitting(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));

      console.warn('Datos enviados:', data);

      toast.success('Cambios guardados', {
        description: 'Los parámetros globales han sido actualizados exitosamente.',
      });
    } catch (error) {
      console.error('Error al guardar:', error);

      toast.error('Error al guardar', {
        description: 'Ocurrió un error al guardar los parámetros. Por favor, inténtalo de nuevo.',
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  const handleSaveClick = async () => {
    const isValid = await form.trigger();

    if (isValid) {
      form.handleSubmit(onSubmit)();
    } else {
      const sectionsWithErrors = Object.entries(sectionErrors)
        .filter(([, count]) => count > 0)
        .map(([section]) => section);

      if (sectionsWithErrors.length > 0) {
        setOpenSections(sectionsWithErrors[0]);
      }

      toast.error('Error de validación', {
        description: `Hay ${totalErrors} errores que deben corregirse antes de guardar.`,
      });
    }
  };

  const testFieldValidation = async (fieldName: keyof GlobalParametersValues) => {
    await form.trigger(fieldName);
  };

  const hasErrors = Object.values(sectionErrors).some((count) => count > 0);
  const totalErrors = Object.values(sectionErrors).reduce((a, b) => a + b, 0);

  const sectionTitles = {
    general: 'General',
    notifications: 'Notificaciones',
    security: 'Seguridad',
    integrations: 'Integraciones',
  };

  return (
    <div className="flex flex-col space-y-6">
      <Heading
        title="Parámetros globales del sistema"
        right={
          <Button variant="default" onClick={handleSaveClick} disabled={isSubmitting}>
            {isSubmitting ? 'Guardando...' : 'Guardar Cambios'}
          </Button>
        }
      />

      {hasErrors && (
        <ValidationAlert sectionErrors={sectionErrors} totalErrors={totalErrors} onSectionClick={setOpenSections} />
      )}

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <Accordion type="single" collapsible value={openSections} onValueChange={setOpenSections} className="w-full pb-10">
            {/* Sección General */}
            <AccordionItem value="general" className="border rounded-lg mb-4">
              <AccordionTrigger className="px-4 py-2 hover:bg-muted/50 rounded-t-lg items-center">
                <HeaderSection
                  title={sectionTitles.general}
                  section="general"
                  sectionErrors={sectionErrors}
                  form={form}
                  sectionFields={sectionFields}
                />
              </AccordionTrigger>
              <AccordionContent className="px-4 pt-2 pb-4">
                <GeneralSection form={form} />
              </AccordionContent>
            </AccordionItem>

            {/* Sección de Notificaciones */}
            <AccordionItem value="notifications" className="border rounded-lg mb-4">
              <AccordionTrigger className="px-4 py-2 hover:bg-muted/50 rounded-t-lg">
                <HeaderSection
                  title={sectionTitles.notifications}
                  section="notifications"
                  sectionErrors={sectionErrors}
                  form={form}
                  sectionFields={sectionFields}
                />
              </AccordionTrigger>
              <AccordionContent className="px-4 pt-2 pb-4">
                <NotificationsSection form={form} testFieldValidation={testFieldValidation} />
              </AccordionContent>
            </AccordionItem>

            {/* Sección de Seguridad */}
            <AccordionItem value="security" className="border rounded-lg mb-4">
              <AccordionTrigger className="px-4 py-2 hover:bg-muted/50 rounded-t-lg">
                <HeaderSection
                  title={sectionTitles.security}
                  section="security"
                  sectionErrors={sectionErrors}
                  form={form}
                  sectionFields={sectionFields}
                />
              </AccordionTrigger>
              <AccordionContent className="px-4 pt-2 pb-4">
                <SecuritySection form={form} />
              </AccordionContent>
            </AccordionItem>

            {/* Sección de Integraciones */}
            <AccordionItem value="integrations" className="border rounded-lg mb-4">
              <AccordionTrigger className="px-4 py-2 hover:bg-muted/50 rounded-t-lg">
                <HeaderSection
                  title={sectionTitles.integrations}
                  section="integrations"
                  sectionErrors={sectionErrors}
                  form={form}
                  sectionFields={sectionFields}
                />
              </AccordionTrigger>
              <AccordionContent className="px-4 pt-2 pb-4">
                <IntegrationsSection form={form} />
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </form>
      </Form>
    </div>
  );
}
