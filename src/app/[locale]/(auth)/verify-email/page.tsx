import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { AuthCardShell } from '@/auth/components/auth-card-shell';
import { AuthPageShell } from '@/auth/components/auth-page-shell';
import { VerificationEmailForm } from '@/auth/components/verification-email-form';
import { AUTH_ROUTES } from '@/auth/constants/auth-routes';
import { Link } from '@/i18n/navigation';
import type { Locale } from '@/i18n/routing';

type Props = {
  params: Promise<{ locale: Locale }>;
  searchParams: Promise<{ error?: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'Auth.verifyEmail' });

  return {
    title: t('metaTitle'),
    description: t('metaDescription'),
  };
}

export default async function VerifyEmailPage({ params, searchParams }: Props) {
  const { locale } = await params;
  const { error } = await searchParams;
  const t = await getTranslations({ locale, namespace: 'Auth.verifyEmail' });
  const common = await getTranslations({ locale, namespace: 'Auth.common' });
  const hasVerificationError = error === 'TOKEN_EXPIRED' || error === 'INVALID_TOKEN';

  return (
    <AuthPageShell
      badge={t('badge')}
      title={t('heroTitle')}
      description={t('heroDescription')}
      highlights={[t('benefits.secure'), t('benefits.fast'), t('benefits.controlled')]}
      homeLabel={common('home')}
      trustBefore={common('trustBefore')}
      trustCount={common('trustCount')}
      trustAfter={common('trustAfter')}
    >
      <AuthCardShell title={t('cardTitle')} description={t('cardDescription')}>
        {hasVerificationError ? (
          <p className="text-destructive text-sm" role="alert">
            {error === 'TOKEN_EXPIRED' ? t('expiredToken') : t('invalidToken')}
          </p>
        ) : null}
        <VerificationEmailForm />
        <p className="text-muted-foreground text-center text-sm">
          {t('alreadyVerified')}{' '}
          <Link href={AUTH_ROUTES.signIn} className="text-primary font-medium hover:underline">
            {t('signInCta')}
          </Link>
        </p>
      </AuthCardShell>
    </AuthPageShell>
  );
}
