'use server';

import { emailSchema } from '@/auth/schemas/auth-field-schemas';
import { authService } from '@/auth/services/auth.service';
import { isAuthRateLimitExceeded } from '@/auth/server/rate-limit';
import type { Locale } from '@/i18n/routing';

export type ResendVerificationEmailState = {
  ok: boolean;
  code?: 'sent' | 'invalidEmail' | 'rateLimited' | 'unknown';
};

export async function resendVerificationEmailAction(
  locale: Locale,
  formData: FormData,
): Promise<ResendVerificationEmailState> {
  const parsed = emailSchema.safeParse(formData.get('email'));

  if (!parsed.success) {
    return { ok: false, code: 'invalidEmail' };
  }

  if (await isAuthRateLimitExceeded('verification-email', parsed.data)) {
    return { ok: false, code: 'rateLimited' };
  }

  const result = await authService.sendVerificationEmail(parsed.data, locale);

  if (!result.ok) {
    return { ok: false, code: 'unknown' };
  }

  return { ok: true, code: 'sent' };
}
