import { z } from 'zod';

export const ruleSchema = z.object({
  id: z.string().optional(),
  name: z.string().optional(),
  description: z.string().optional(),
  value: z.union([z.string(), z.number()]).optional(),
  unit: z.string().optional(),
  type: z.enum(['time', 'absence', 'priority']).optional(),
  status: z.enum(['Activa', 'Inactiva', 'Pausada']).optional(),
  priority: z.enum(['Muy Alta', 'Alta', 'Media', 'Baja']).optional(),
  actions: z.array(z.string()).optional(),
  criteria: z.string().optional(),
});

export type RuleValues = z.infer<typeof ruleSchema>;
