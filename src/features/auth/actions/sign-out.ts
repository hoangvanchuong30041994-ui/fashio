'use server';

import { redirect } from '@/i18n/navigation';
import { AUTH_ROUTES } from '@/auth/constants/auth-routes';
import { authService } from '@/auth/services/auth.service';
import type { Locale } from '@/i18n/routing';

export async function signOutAction(locale: Locale) {
  const result = await authService.signOut();

  if (!result.ok) {
    throw new Error('Sign-out failed.');
  }

  return redirect({ locale, href: AUTH_ROUTES.signIn });
}
