import { z } from 'zod';

export const companyParametersSchema = z.object({
  companyName: z.string().min(1, 'El nombre de la empresa es requerido'),
  timezone: z.enum(['america-santiago', 'america-bogota', 'america-mexico', 'america-lima', 'america-buenos-aires'], {
    required_error: 'La zona horaria es requerida',
  }),
  language: z.enum(['es', 'en', 'pt'], {
    required_error: 'El idioma es requerido',
  }),
  dateFormat: z.enum(['dd-mm-yyyy', 'mm-dd-yyyy', 'yyyy-mm-dd'], {
    required_error: 'El formato de fecha es requerido',
  }),
  maintenanceMode: z.boolean(),
  openingTime: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, 'Formato de hora inválido (HH:MM)'),
  closingTime: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, 'Formato de hora inválido (HH:MM)'),

  maxWaitTime: z.number().min(1).max(60),
  averageAttentionTime: z.number().min(1).max(60),
  priorityQueue: z.boolean(),
  satisfactionSurvey: z.boolean(),
  maxClientsPerExecutive: z.number().min(1).max(100),

  emailNotifications: z.boolean(),
  smsNotifications: z.boolean(),
  pushNotifications: z.boolean(),
  notificationEmail: z.string().email('Correo electrónico de notificación inválido').min(1, 'El correo de notificación es requerido'),
  notificationAnticipationTime: z.number().min(1).max(60),
  notificationTemplate: z.string().min(1, 'La plantilla de notificación es requerida'),
});

export type CompanyParametersValues = z.infer<typeof companyParametersSchema>;
