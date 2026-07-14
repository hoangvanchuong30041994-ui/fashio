import { z } from 'zod/v4';
import { AUTH_ERROR_CODES } from '@/auth/constants/auth-error-codes';
import { emailSchema, passwordSchema } from '@/auth/schemas/auth-field-schemas';

export const registerSchema = z
  .object({
    name: z.string().trim().min(2, AUTH_ERROR_CODES.nameTooShort).max(254),
    email: emailSchema,
    password: passwordSchema,
    confirmPassword: passwordSchema,
  })
  .superRefine((data, ctx) => {
    if (data.password !== data.confirmPassword) {
      ctx.addIssue({
        code: 'custom',
        path: ['confirmPassword'],
        message: AUTH_ERROR_CODES.passwordMismatch,
      });
    }
  });

export type RegisterInput = z.infer<typeof registerSchema>;
