import { z } from 'zod';

export const SubsidiaryManagerSchema = z.object({
  id: z.number().int().positive().optional(), // ID will be optional for new entries
  fullName: z.string().min(1, 'El nombre completo es requerido'),
  email: z.string().email('Ingresa un correo electrónico válido'),
  phone: z.string().optional(),
  subsidiary: z.string().min(1, 'La sucursal asignada es requerida'),
  status: z.enum(['Activo', 'Inactivo'], {
    required_error: 'El estado es requerido',
  }),
});

export type SubsidiaryManagerValues = z.infer<typeof SubsidiaryManagerSchema>;
