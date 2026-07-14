import type { AppPathname } from '@/i18n/routing';

export const AUTH_ROUTES = {
  signIn: '/sign-in',
  signUp: '/sign-up',
  verifyEmail: '/verify-email',
  defaultRedirect: '/',
} as const satisfies Record<string, AppPathname>;
