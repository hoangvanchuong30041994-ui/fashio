import type { Locale } from '@/i18n/routing';
import { AppShell } from '@/shared/components/layout/app-shell';
import { Header } from '@/shared/components/layout/header';

type MainLayoutProps = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export default async function MainLayout({ children, params }: MainLayoutProps) {
  const { locale } = await params;

  return <AppShell header={<Header locale={locale as Locale} />}>{children}</AppShell>;
}
