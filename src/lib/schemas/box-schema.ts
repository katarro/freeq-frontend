import { z } from 'zod';

export const boxSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, { message: 'El nombre de la caja es requerido.' }),
  type: z.enum(['physical', 'virtual', 'mixed']),
  location: z.string().optional(),
  capacity: z.coerce.number().int().min(1, { message: 'La capacidad debe ser un número positivo mayor a 0.' }).optional(),
  equipment: z.array(z.string()).optional(),
  priority: z.enum(['Muy Alta', 'Alta', 'Media', 'Baja']).optional(),
  assignedOperator: z.string().nullable().optional(),
  services: z.array(z.string()).optional(),
  status: z.enum(['Activa', 'Inactiva', 'Mantenimiento']).optional(),
  currentQueue: z.number().int().min(0).optional(),
  avgWaitTime: z.string().optional(),
  platform: z.string().optional(),
  connectionType: z.string().optional(),
  bandwidth: z.string().optional(),
  physicalLocation: z.string().optional(),
  virtualPlatform: z.string().optional(),
  flexibleMode: z.boolean().optional(),
});

export type BoxFormValues = z.infer<typeof boxSchema>;
