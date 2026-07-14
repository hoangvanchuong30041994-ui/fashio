import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { AuthPageShell } from '@/auth/components/auth-page-shell';
import { LoginForm } from '@/auth/components/login-form';
import { requireGuest } from '@/auth/server/require-guest';
import type { Locale } from '@/i18n/routing';

type Props = {
  params: Promise<{ locale: Locale }>;
  searchParams: Promise<{ error?: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'Auth.signIn' });

  return {
    title: t('metaTitle'),
    description: t('metaDescription'),
  };
}

export default async function SignInPage({ params, searchParams }: Props) {
  const { locale } = await params;
  const { error } = await searchParams;
  await requireGuest(locale);

  const verificationError =
    error === 'TOKEN_EXPIRED' || error === 'INVALID_TOKEN' ? error : undefined;

  const t = await getTranslations({ locale, namespace: 'Auth.signIn' });
  const common = await getTranslations({ locale, namespace: 'Auth.common' });

  return (
    <AuthPageShell
      badge={t('badge')}
      title={t('heroTitle')}
      description={t('heroDescription')}
      highlights={[t('benefits.orders'), t('benefits.profile'), t('benefits.secure')]}
      homeLabel={common('home')}
      trustBefore={common('trustBefore')}
      trustCount={common('trustCount')}
      trustAfter={common('trustAfter')}
    >
      <LoginForm verificationError={verificationError} />
    </AuthPageShell>
  );
}
