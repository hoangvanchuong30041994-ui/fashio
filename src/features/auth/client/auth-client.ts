import { createAuthClient } from 'better-auth/react';
import { getPathname } from '@/i18n/navigation';
import type { Locale } from '@/i18n/routing';

export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_APP_URL,
});

async function loginWithSocialProvider(provider: 'google' | 'github', locale: Locale) {
  const result = await authClient.signIn.social({
    provider,
    callbackURL: getPathname({ locale, href: '/' }),
  });

  if (result.error) {
    throw new Error(`OAuth sign-in failed with status ${result.error.status}.`);
  }

  return result.data;
}

export const loginWithGoogle = (locale: Locale) => loginWithSocialProvider('google', locale);

export const loginWithGithub = (locale: Locale) => loginWithSocialProvider('github', locale);
