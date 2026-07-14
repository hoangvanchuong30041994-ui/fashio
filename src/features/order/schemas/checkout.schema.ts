import { z } from 'zod/v4';

export const checkoutSchema = z.object({
  name: z.string().trim().min(2).max(120),
  phone: z.string().trim().min(8).max(32),
  street: z.string().trim().min(5).max(254),
  ward: z.string().trim().max(120).optional(),
  district: z.string().trim().min(2).max(120),
  province: z.string().trim().min(2).max(120),
  country: z.string().trim().min(2).max(80).default('VN'),
  note: z.string().trim().max(500).optional(),
});

export type CheckoutInput = z.infer<typeof checkoutSchema>;
