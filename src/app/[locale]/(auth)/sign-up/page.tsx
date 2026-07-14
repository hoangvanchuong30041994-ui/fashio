import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { AuthPageShell } from '@/auth/components/auth-page-shell';
import { RegisterForm } from '@/auth/components/register-form';
import { requireGuest } from '@/auth/server/require-guest';
import type { Locale } from '@/i18n/routing';

type Props = {
  params: Promise<{ locale: Locale }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'Auth.signUp' });

  return {
    title: t('metaTitle'),
    description: t('metaDescription'),
  };
}

export default async function SignUpPage({ params }: Props) {
  const { locale } = await params;
  await requireGuest(locale);

  const t = await getTranslations({ locale, namespace: 'Auth.signUp' });
  const common = await getTranslations({ locale, namespace: 'Auth.common' });

  return (
    <AuthPageShell
      badge={t('badge')}
      title={t('heroTitle')}
      description={t('heroDescription')}
      highlights={[t('benefits.faster'), t('benefits.preferences'), t('benefits.secure')]}
      homeLabel={common('home')}
      trustBefore={common('trustBefore')}
      trustCount={common('trustCount')}
      trustAfter={common('trustAfter')}
    >
      <RegisterForm />
    </AuthPageShell>
  );
}
