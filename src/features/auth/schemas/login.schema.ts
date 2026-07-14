import { z } from 'zod/v4';
import { emailSchema, passwordSchema } from '@/auth/schemas/auth-field-schemas';

export const loginSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
});

export type LoginInput = z.infer<typeof loginSchema>;
