import z from "zod";

export const dniSchema = z.object({
  dni: z.string().min(8, {
    message: "Por favor ingresa un DNI válido",
  }),
});

export type DniFormValues = z.infer<typeof dniSchema>;
