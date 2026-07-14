'use server';

import { emailSchema } from '@/auth/schemas/auth-field-schemas';
import { authService } from '@/auth/services/auth.service';
import type { Locale } from '@/i18n/routing';

export type ResendVerificationEmailState = {
  ok: boolean;
  code?: 'sent' | 'invalidEmail' | 'unknown';
};

export async function resendVerificationEmailAction(
  locale: Locale,
  formData: FormData,
): Promise<ResendVerificationEmailState> {
  const parsed = emailSchema.safeParse(formData.get('email'));

  if (!parsed.success) {
    return { ok: false, code: 'invalidEmail' };
  }

  const result = await authService.sendVerificationEmail(parsed.data, locale);

  if (!result.ok) {
    return { ok: false, code: 'unknown' };
  }

  return { ok: true, code: 'sent' };
}
