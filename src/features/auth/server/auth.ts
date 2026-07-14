import { betterAuth } from 'better-auth';
import { prismaAdapter } from 'better-auth/adapters/prisma';
import { after } from 'next/server';
import { prisma } from '@/lib/prisma';
import { nextCookies } from 'better-auth/next-js';
import { sendVerificationEmail } from '@/auth/services/email.service';
import { routing, type Locale } from '@/i18n/routing';

function isLocale(value: string | undefined): value is Locale {
  return !!value && routing.locales.includes(value as Locale);
}

function getEmailLocale(url: string, request?: Request): Locale {
  try {
    const callbackURL = new URL(url).searchParams.get('callbackURL');

    if (callbackURL) {
      const locale = new URL(callbackURL).pathname.split('/')[1];

      if (isLocale(locale)) {
        return locale;
      }
    }
  } catch {
    // Fall back to the locale header when Better Auth receives an unexpected callback URL.
  }

  const requestLocale = request?.headers.get('x-fashio-locale') ?? undefined;
  return isLocale(requestLocale) ? requestLocale : routing.defaultLocale;
}

export const auth = betterAuth({
  baseURL: process.env.NEXT_PUBLIC_APP_URL!,
  database: prismaAdapter(prisma, {
    provider: 'postgresql',
  }),
  experimental: {
    joins: true,
  },
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,
  },
  emailVerification: {
    sendOnSignUp: true,
    sendOnSignIn: false,
    sendVerificationEmail: async ({ user, url }, request) => {
      const locale = getEmailLocale(url, request);

      after(async () => {
        try {
          await sendVerificationEmail({
            to: user.email,
            url,
            locale,
          });
        } catch {
          console.error('Scheduled verification email delivery failed.');
        }
      });
    },
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      enabled: true,
    },
    github: {
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
      enabled: true,
    },
  },
  session: {
    expiresIn: 60 * 60 * 24 * 7,
    updateAge: 60 * 60 * 24,
    deferSessionRefresh: true,
  },
  plugins: [nextCookies()],
  trustedOrigins: [process.env.NEXT_PUBLIC_APP_URL!],
});
