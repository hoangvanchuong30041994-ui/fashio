import { headers } from 'next/headers';
import { AUTH_ERROR_CODES } from '@/auth/constants/auth-error-codes';
import { AUTH_ROUTES } from '@/auth/constants/auth-routes';
import type { LoginInput } from '@/auth/schemas/login.schema';
import type { RegisterInput } from '@/auth/schemas/register.schema';
import { auth } from '@/auth/server/auth';
import { isExistingAccountError, mapAuthError } from '@/auth/utils/map-auth-error';
import { getPathname } from '@/i18n/navigation';
import type { Locale } from '@/i18n/routing';

async function getAuthHeaders(locale: Locale) {
  const requestHeaders = new Headers(await headers());
  requestHeaders.set('x-fashio-locale', locale);
  return requestHeaders;
}

function getVerificationCallbackURL(locale: Locale) {
  const pathname = getPathname({ locale, href: AUTH_ROUTES.signIn });
  return new URL(pathname, process.env.NEXT_PUBLIC_APP_URL).toString();
}

export const authService = {
  async signIn(data: LoginInput, locale: Locale) {
    try {
      await auth.api.signInEmail({
        body: {
          ...data,
          callbackURL: getVerificationCallbackURL(locale),
        },
        headers: await getAuthHeaders(locale),
      });

      return { ok: true as const };
    } catch (error) {
      return {
        ok: false as const,
        error: mapAuthError(error),
      };
    }
  },

  async signUp(data: RegisterInput, locale: Locale) {
    try {
      await auth.api.signUpEmail({
        body: {
          name: data.name,
          email: data.email,
          password: data.password,
          callbackURL: getVerificationCallbackURL(locale),
        },
        headers: await getAuthHeaders(locale),
      });

      return { ok: true as const };
    } catch (error) {
      if (isExistingAccountError(error)) {
        return { ok: true as const };
      }

      return {
        ok: false as const,
        error: mapAuthError(error),
      };
    }
  },

  async sendVerificationEmail(email: string, locale: Locale) {
    try {
      await auth.api.sendVerificationEmail({
        body: {
          email,
          callbackURL: getVerificationCallbackURL(locale),
        },
        headers: await getAuthHeaders(locale),
      });

      return { ok: true as const };
    } catch {
      return {
        ok: false as const,
        error: AUTH_ERROR_CODES.unknown,
      };
    }
  },

  async signOut() {
    try {
      await auth.api.signOut({
        headers: await headers(),
      });

      return { ok: true as const };
    } catch {
      return {
        ok: false as const,
        error: AUTH_ERROR_CODES.unknown,
      };
    }
  },
};
