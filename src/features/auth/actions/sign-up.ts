'use server';

import { redirect } from '@/i18n/navigation';
import { type AuthErrorCode } from '@/auth/constants/auth-error-codes';
import { AUTH_ROUTES } from '@/auth/constants/auth-routes';
import { registerSchema } from '@/auth/schemas/register.schema';
import { authService } from '@/auth/services/auth.service';
import type { AuthActionState } from '@/auth/types/auth-action-state';
import type { Locale } from '@/i18n/routing';

export async function signUpAction(
  locale: Locale,
  _prevState: AuthActionState,
  formData: FormData,
): Promise<AuthActionState> {
  const parsed = registerSchema.safeParse({
    name: formData.get('name'),
    email: formData.get('email'),
    password: formData.get('password'),
    confirmPassword: formData.get('confirmPassword'),
  });

  if (!parsed.success) {
    return {
      ok: false,
      formError: undefined,
      fieldErrors: parsed.error.flatten().fieldErrors as Record<
        string,
        AuthErrorCode[] | undefined
      >,
    };
  }

  const result = await authService.signUp(parsed.data, locale);

  if (!result.ok) {
    return {
      ok: false,
      formError: result.error,
      fieldErrors: {},
    };
  }

  return redirect({ locale, href: AUTH_ROUTES.verifyEmail });
}
