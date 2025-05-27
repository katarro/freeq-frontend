import z from 'zod';

export const globalParametersSchema = z.object({
  // General
  platformName: z.string().min(1, 'El nombre de la plataforma es requerido'),
  timezone: z.string().min(1, 'La zona horaria es requerida'),
  language: z.string().min(1, 'El idioma es requerido'),
  dateFormat: z.string().min(1, 'El formato de fecha es requerido'),
  maintenanceMode: z.boolean().default(false),
  maxWaitTime: z.coerce.number().min(1, 'El tiempo máximo de espera debe ser mayor a 0'),
  maxUsersPerCompany: z.coerce.number().min(10, 'El máximo de usuarios por empresa debe ser al menos 10'),
  maxBranchesPerCompany: z.coerce.number().min(1, 'El máximo de sucursales por empresa debe ser al menos 1'),
  maxExecutivesPerBranch: z.coerce.number().min(1, 'El máximo de ejecutivos por sucursal debe ser al menos 1'),
  // Notificaciones
  emailNotifications: z.boolean().default(true),
  smsNotifications: z.boolean().default(true),
  pushNotifications: z.boolean().default(true),
  notificationEmail: z
    .string()
    .min(1, 'El email para notificaciones es requerido')
    .email('Correo electrónico inválido'),
  notificationAnticipation: z.coerce.number().min(1, 'El tiempo de anticipación debe ser mayor a 0'),
  // Seguridad
  twoFactorAuth: z.boolean().default(false),
  sessionDuration: z.coerce.number().min(5, 'La duración de sesión debe ser al menos 5 minutos'),
  loginAttempts: z.coerce.number().min(1, 'Los intentos de inicio de sesión deben ser al menos 1'),
  forcePasswordChange: z.boolean().default(true),
  ipRestriction: z.boolean().default(false),
  // Integraciones
  apiIntegration: z.boolean().default(true),
  apiKey: z.string().optional(),
  webhookIntegration: z.boolean().default(true),
  webhookUrl: z.string().url('URL inválida').optional().or(z.literal('')),
  ssoIntegration: z.boolean().default(false),
});

export type GlobalParametersValues = z.infer<typeof globalParametersSchema>
