import { z } from 'zod';

export const restorePasswordSchema = z.object({
  email: z.string().email({
    message: 'Por favor ingresa un email válido.',
  }),
});

export type RestorePasswordFormValues = z.infer<typeof restorePasswordSchema>;
