import { z } from 'zod';

export const recentCommentSchema = z.object({
  text: z.string(),
  rating: z.number().int().min(1).max(5),
  date: z.string(),
  customer: z.string(),
});

export const weeklyDailyDataSchema = z.object({
  week: z.string().optional(),
  day: z.string().optional(),
  satisfaction: z.number().int().min(0).max(100),
  responses: z.number().int().min(0),
});

export const operatorDetailsSchema = z.object({
  startDate: z.string(),
  totalCustomers: z.number().int().min(0),
  averageServiceTime: z.string(),
  resolutionRate: z.number().int().min(0).max(100),
  escalationRate: z.number().int().min(0).max(100),
  languages: z.array(z.string()),
  certifications: z.array(z.string()),
});

export const operatorSchema = z.object({
  id: z.number().int().positive().optional(),
  name: z.string().min(1, 'El nombre del operador es requerido').optional(),
  status: z.enum(['Atendiendo', 'Disponible', 'Ausente', 'Descanso', 'Activo', 'Vacaciones'], {
    errorMap: () => ({ message: 'Estado de operador inválido' }),
  }).optional(),
  queue: z.string().min(1, 'La cola es requerida').optional(),
  currentClient: z.string().nullable().optional(),
  timeWithClient: z.string().nullable().optional(),
  avgTime: z.string().min(1, 'El tiempo promedio es requerido').optional(),
  served: z.number().int().min(0).optional(),
  waitingClients: z.number().int().min(0).optional(),
  lastActivity: z.string().min(1, 'La última actividad es requerida').optional(),
  efficiency: z.number().int().min(0).max(100).optional(),
  satisfaction: z.number().int().min(0).max(100).optional(),
  email: z.string().email('El formato del correo electrónico es inválido').optional(),
  phone: z.string().min(1, 'El número de teléfono es requerido').optional(),
  position: z.string().min(1, 'El cargo es requerido').optional(),
  branch: z.string().min(1, 'La sucursal es requerida').optional(),
  assignedQueue: z.string().min(1, 'La cola asignada es requerida').optional(),
  startDate: z.string().min(1, 'La fecha de inicio es requerida').optional(),
  performance: z.number().int().min(0).max(100).optional(),
  monthlyClients: z.number().int().min(0).optional(),
  shift: z.string().min(1, 'El turno es requerido').optional(),

  totalResponses: z.number().int().min(0).optional(),
  averageSatisfaction: z.number().int().min(0).max(100).optional(),
  monthlyTrend: z.string().optional(),
  categories: z.object({
    atencion: z.number().int().min(0).max(100).optional(),
    rapidez: z.number().int().min(0).max(100).optional(),
    conocimiento: z.number().int().min(0).max(100).optional(),
    amabilidad: z.number().int().min(0).max(100).optional(),
    resolucion: z.number().int().min(0).max(100).optional(),
  }).optional(),
  comments: z.array(z.string()).optional(),

  recentComments: z.array(recentCommentSchema).optional(),
  weeklyData: z.array(weeklyDailyDataSchema).optional(),
  dailyData: z.array(weeklyDailyDataSchema).optional(),
  details: operatorDetailsSchema.optional(),
});

export type OperatorValues = z.infer<typeof operatorSchema>;

export const satisfactionDistributionSchema = z.object({
  name: z.string(),
  value: z.number(),
  color: z.string(),
});

export type SatisfactionDistribution = z.infer<typeof satisfactionDistributionSchema>;
