'use client';

import { useState, useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import {
  Form,
} from '@/components/ui/form';

import {
  companyParametersSchema,
  type CompanyParametersValues,
} from '@/lib/schemas/company-parameters-schema';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import HeaderSection from './_components/header-section';
import GeneralSection from './_components/general-section';
import CustomerServiceSection from './_components/customer-service-section';
import NotificationsSection from './_components/notifications-section';
import ValidationAlert from './_components/validation-alert';
import { toast } from 'sonner';
import Heading from '@/components/heading';
import { Loader2 } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import BottomAction from '@/components/bottom-action';

const defaultValues: CompanyParametersValues = {
  companyName: 'Banco Estado',
  timezone: 'america-santiago',
  language: 'es',
  dateFormat: 'dd-mm-yyyy',
  maintenanceMode: false,
  openingTime: '09:00',
  closingTime: '18:00',

  maxWaitTime: 15,
  averageAttentionTime: 5,
  priorityQueue: true,
  satisfactionSurvey: true,
  maxClientsPerExecutive: 30,

  emailNotifications: true,
  smsNotifications: true,
  pushNotifications: true,
  notificationEmail: 'notificaciones@bancoestado.cl',
  notificationAnticipationTime: 10,
  notificationTemplate: 'Estimado(a) {nombre}, su turno {numero} está próximo a ser atendido.',
};

const sectionFields: Record<string, string[]> = {
  general: [
    'companyName',
    'timezone',
    'language',
    'dateFormat',
    'maintenanceMode',
    'openingTime',
    'closingTime',
  ],
  customerService: [
    'maxWaitTime',
    'averageAttentionTime',
    'priorityQueue',
    'satisfactionSurvey',
    'maxClientsPerExecutive',
  ],
  notifications: [
    'emailNotifications',
    'smsNotifications',
    'pushNotifications',
    'notificationEmail',
    'notificationAnticipationTime',
    'notificationTemplate',
  ],
};

export default function CompanyParametersPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [openSections, setOpenSections] = useState<string>('general');
  const [sectionErrors, setSectionErrors] = useState<Record<string, number>>({
    general: 0,
    customerService: 0,
    notifications: 0,
  });

  const form = useForm<CompanyParametersValues>({
    resolver: zodResolver(companyParametersSchema),
    defaultValues,
    mode: 'onChange',
  });

  useEffect(() => {
    const errors = form.formState.errors;
    const newSectionErrors = {
      general: 0,
      customerService: 0,
      notifications: 0,
    };

    Object.keys(errors).forEach((fieldName) => {
      Object.entries(sectionFields).forEach(([section, fields]) => {
        if (fields.includes(fieldName) && errors[fieldName as keyof CompanyParametersValues]) {
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-expect-error
          newSectionErrors[section]++;
        }
      });
    });

    setSectionErrors(newSectionErrors);
  }, [form.formState.errors]);

  async function onSubmit(data: CompanyParametersValues) {
    setIsSubmitting(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));

      console.warn('Datos enviados:', data);

      toast.success('Cambios guardados', {
        description: 'Los parámetros de la empresa han sido actualizados exitosamente.',
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

  const testFieldValidation = async (fieldName: keyof CompanyParametersValues) => {
    await form.trigger(fieldName);
  };

  const hasErrors = Object.values(sectionErrors).some((count) => count > 0);
  const totalErrors = Object.values(sectionErrors).reduce((a, b) => a + b, 0);

  const sectionTitles = {
    general: 'General',
    customerService: 'Atención al Cliente',
    notifications: 'Notificaciones',
  };

  return (
    <section className="grid gap-6 pb-[82px]">
      <Heading
        title="Parámetros de la empresa"
        right={
          <Button
            variant="default"
            onClick={handleSaveClick}
            className="hidden lg:flex"
            disabled={isSubmitting}
          >
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isSubmitting ? 'Guardando...' : 'Guardar Cambios'}
          </Button>
        }
      />
      <Separator/>
      {hasErrors && (
        <ValidationAlert sectionErrors={sectionErrors} totalErrors={totalErrors} onSectionClick={setOpenSections} />
      )}

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 xl:max-w-2xl w-full mx-auto">
          <Accordion type="single" collapsible value={openSections} onValueChange={setOpenSections} className="w-full">
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

            <AccordionItem value="customerService" className="border rounded-lg mb-4">
              <AccordionTrigger className="px-4 py-2 hover:bg-muted/50 rounded-t-lg">
                <HeaderSection
                  title={sectionTitles.customerService}
                  section="customerService"
                  sectionErrors={sectionErrors}
                  form={form}
                  sectionFields={sectionFields}
                />
              </AccordionTrigger>
              <AccordionContent className="px-4 pt-2 pb-4">
                <CustomerServiceSection form={form} />
              </AccordionContent>
            </AccordionItem>

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
                {/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */}
                {/*@ts-expect-error*/}
                <NotificationsSection form={form} testFieldValidation={testFieldValidation} />
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
