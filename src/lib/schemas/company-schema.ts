import z from 'zod';

export const companySchema = z.object({
  id: z.number().optional(),
  rut: z.string().regex(/^\d{1,2}\.\d{3}\.\d{3}-[\dkK]$/, {
    message: 'El RUT debe tener el formato XX.XXX.XXX-X',
  }).optional(),
  administrators: z.coerce.number().min(0, {
    message: 'El número de administradores debe ser mayor o igual a 0.',
  }).optional(),
  name: z.string().min(2, {
    message: 'El nombre debe tener al menos 2 caracteres.',
  }),
  subsidiaries: z.coerce.number().min(0, {
    message: 'El número de sucursales debe ser mayor o igual a 0.',
  }),
  users: z.coerce.number().min(0, {
    message: 'El número de usuarios debe ser mayor o igual a 0.',
  }).optional(),
  state: z.enum(['Activo', 'Inactivo'], {
    required_error: 'Por favor seleccione un estado.',
  }),
});

export type CompanyValues = z.infer<typeof companySchema>;
