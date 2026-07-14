import { redirect } from '@/i18n/navigation';
import { AUTH_ROUTES } from '@/auth/constants/auth-routes';
import { getSession } from '@/auth/server/session';
import type { Locale } from '@/i18n/routing';

export async function requireGuest(locale: Locale) {
  const session = await getSession();

  if (session) {
    return redirect({ locale, href: AUTH_ROUTES.defaultRedirect });
  }
}
