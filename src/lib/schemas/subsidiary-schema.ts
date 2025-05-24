import { z } from 'zod';

export const subsidiarySchema = z.object({
  id: z.number().optional(),
  name: z.string().min(2, {
    message: 'El nombre de la sucursal debe tener al menos 2 caracteres.',
  }),
  address: z.string().min(5, {
    message: 'La dirección debe tener al menos 5 caracteres.',
  }),
  branchManager: z.string().min(2, { // Será el valor seleccionado del combobox
    message: 'El nombre del jefe de sucursal debe tener al menos 2 caracteres.',
  }),
  executives: z.number().int().min(0, {
    message: 'El número de ejecutivos no puede ser negativo.',
  }),
  status: z.enum(['Activo', 'Inactivo'], {
    message: 'El estado debe ser "Activo" o "Inactivo".',
  }),
});

export type SubsidiaryValues = z.infer<typeof subsidiarySchema>;
