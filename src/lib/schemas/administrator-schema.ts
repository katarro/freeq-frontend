import z from 'zod';

export const administratorSchema = z.object({
  id: z.number().optional(),
  name: z.string().min(2, {
    message: 'El nombre debe tener al menos 2 caracteres.',
  }),
  email: z.string().email({
    message: 'Ingrese un correo electrónico válido.',
  }),
  company: z.string().min(2, {
    message: 'El nombre de la empresa debe tener al menos 2 caracteres.',
  }),
});

export type AdministratorValues = z.infer<typeof administratorSchema>;
