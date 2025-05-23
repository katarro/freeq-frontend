import z from 'zod';

export const activityLogSchema = z.object({
  date: z.string(),
  time: z.string(),
  user: z.string(),
  action: z.string(),
  details: z.string(),
  ip: z.string(),
  level: z.enum(['Info', 'Error', 'Warning']),
});

export type ActivityLogValues = z.infer<typeof activityLogSchema>;
