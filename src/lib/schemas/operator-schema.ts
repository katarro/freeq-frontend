import { z } from 'zod';

export const operatorSchema = z.object({
  id: z.number().int().positive('El ID del operador debe ser un número entero positivo'),
  name: z.string().min(1, 'El nombre del operador es requerido'),
  status: z.enum(['Atendiendo', 'Disponible', 'Ausente', 'Descanso'], {
    errorMap: () => ({ message: 'Estado de operador inválido' }),
  }),
  queue: z.string().min(1, 'La cola es requerida'),
  currentClient: z.string().nullable(),
  timeWithClient: z.string().nullable(),
  avgTime: z.string().min(1, 'El tiempo promedio es requerido'),
  served: z.number().int().min(0, 'El número de clientes atendidos no puede ser negativo'),
  waitingClients: z.number().int().min(0, 'El número de clientes en espera no puede ser negativo'),
  lastActivity: z.string().min(1, 'La última actividad es requerida'),
  efficiency: z.number().int().min(0).max(100, 'La eficiencia debe estar entre 0 y 100'),
  satisfaction: z.number().int().min(0).max(100, 'La satisfacción debe estar entre 0 y 100'),
});

export type OperatorValues = z.infer<typeof operatorSchema>;
