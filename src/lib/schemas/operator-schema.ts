import { z } from 'zod';

export const operatorSchema = z.object({
  id: z.number().int().positive('El ID del operador debe ser un número entero positivo').optional(),
  name: z.string().min(1, 'El nombre del operador es requerido').optional(),
  status: z.enum(['Atendiendo', 'Disponible', 'Ausente', 'Descanso', 'Activo', 'Vacaciones'], {
    errorMap: () => ({ message: 'Estado de operador inválido' }),
  }).optional(),
  queue: z.string().min(1, 'La cola es requerida').optional(),
  currentClient: z.string().nullable().optional(),
  timeWithClient: z.string().nullable().optional(),
  avgTime: z.string().min(1, 'El tiempo promedio es requerido').optional(),
  served: z.number().int().min(0, 'El número de clientes atendidos no puede ser negativo').optional(),
  waitingClients: z.number().int().min(0, 'El número de clientes en espera no puede ser negativo').optional(),
  lastActivity: z.string().min(1, 'La última actividad es requerida').optional(),
  efficiency: z.number().int().min(0).max(100, 'La eficiencia debe estar entre 0 y 100').optional(),
  satisfaction: z.number().int().min(0).max(100, 'La satisfacción debe estar entre 0 y 100').optional(),
  email: z.string().email('El formato del correo electrónico es inválido').optional(),
  phone: z.string().min(1, 'El número de teléfono es requerido').optional(),
  position: z.string().min(1, 'El cargo es requerido').optional(),
  branch: z.string().min(1, 'La sucursal es requerida').optional(),
  assignedQueue: z.string().min(1, 'La cola asignada es requerida').optional(),
  startDate: z.string().min(1, 'La fecha de inicio es requerida').optional(),
  performance: z.number().int().min(0).max(100, 'El rendimiento debe estar entre 0 y 100').optional(),
  monthlyClients: z.number().int().min(0, 'El número de clientes mensuales no puede ser negativo').optional(),
  shift: z.string().min(1, 'El turno es requerido').optional(),
});

export type OperatorValues = z.infer<typeof operatorSchema>;
