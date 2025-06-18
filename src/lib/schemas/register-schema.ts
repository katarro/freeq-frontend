import { z } from 'zod';

// Nuevo schema de registro
export const registerSchema = z
  .object({
    email: z
      .string()
      .min(1, { message: 'El email es requerido.' })
      .email({ message: 'Por favor ingresa un email válido.' }),

    password: z
      .string()
      .min(8, { message: 'La contraseña debe tener al menos 8 caracteres.' })
      .refine(
        (password) => {
          // Emular exactamente las reglas de @IsStrongPassword
          const hasMinLength = password.length >= 8;
          const hasLowercase = /[a-z]/.test(password);
          const hasUppercase = /[A-Z]/.test(password);
          const hasNumbers = /\d/.test(password);
          // minSymbols: 0 significa que no requiere símbolos

          return hasMinLength && hasLowercase && hasUppercase && hasNumbers;
        },
        {
          message:
            'La contraseña debe contener al menos 8 caracteres, 1 minúscula, 1 mayúscula y 1 número.',
        },
      ),

    confirmPassword: z.string().min(1, { message: 'Confirma tu contraseña.' }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Las contraseñas no coinciden',
    path: ['confirmPassword'],
  });

export type RegisterFormValues = z.infer<typeof registerSchema>;
