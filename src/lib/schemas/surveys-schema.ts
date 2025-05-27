import { z } from 'zod';

export const questionSchema = z.object({
  id: z.string().min(1, 'El ID de la pregunta es requerido'),
  text: z.string().min(1, 'El texto de la pregunta es requerido'),
  type: z.enum(['rating', 'text', 'multiple', 'boolean'], {
    errorMap: () => ({ message: 'Tipo de pregunta inválido' }),
  }),
  options: z.array(z.string().min(1, 'La opción no puede estar vacía')).optional(),
});

export const surveySchema = z.object({
  id: z.string().optional(),
  title: z.string().min(3, 'El título es requerido y debe tener al menos 3 caracteres'),
  description: z.string().min(10, 'La descripción es requerida y debe tener al menos 10 caracteres').optional(),
  startDate: z.string().min(1, 'La fecha de inicio es requerida'),
  endDate: z.string().min(1, 'La fecha de fin es requerida'),
  status: z.enum(['Activa', 'Programada', 'Finalizada'], {
    errorMap: () => ({ message: 'Estado inválido' }),
  }),
  responses: z.number().default(0),
  satisfaction: z.number().default(0),
  questions: z.array(questionSchema).min(1, 'Debe haber al menos una pregunta').optional(),
  questionsTotal: z.number().default(0).optional(),
});

export type SurveyFormValues = z.infer<typeof surveySchema>;
export type QuestionFormValues = z.infer<typeof questionSchema>;
