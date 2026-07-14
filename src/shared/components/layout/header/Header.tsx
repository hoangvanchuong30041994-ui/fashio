import { getTranslations } from 'next-intl/server';
import { getCurrentUser } from '@/auth/server/session';
import type { Locale } from '@/i18n/routing';
import { HeaderActions } from './HeaderActions';
import { Logo } from './Logo';
import { Navigation, type HeaderNavigationHref } from './Navigation';

type HeaderProps = {
  locale: Locale;
};

export async function Header({ locale }: HeaderProps) {
  const [tNav, currentUser] = await Promise.all([
    getTranslations({ locale, namespace: 'Navigation' }),
    getCurrentUser(),
  ]);

  const navigationItems: Array<{ href: HeaderNavigationHref; label: string }> = [
    { href: '/', label: tNav('home') },
    { href: '/products', label: tNav('products') },
    { href: '/cart', label: tNav('cart') },
    { href: '/orders', label: tNav('orders') },
  ];

  return (
    <header className="sticky top-2 z-20 mx-auto mt-3 flex w-[calc(100%-2rem)] max-w-7xl flex-wrap items-center justify-between gap-3 rounded-[1.75rem] border border-stone-200/80 bg-white/80 px-3 py-3 shadow-sm shadow-stone-950/5 backdrop-blur-xl sm:top-4 sm:mt-5 sm:w-[calc(100%-3rem)] sm:gap-4 sm:rounded-full sm:px-4 lg:mt-8 lg:w-[calc(100%-5rem)] dark:border-white/10 dark:bg-white/5 dark:shadow-black/20">
      <Logo label={tNav('brand')} />
      <Navigation items={navigationItems} />
      <HeaderActions
        locale={locale}
        user={currentUser}
        labels={{
          signIn: tNav('signIn'),
          signUp: tNav('signUp'),
          signedInAs: tNav('signedInAs'),
          signOut: tNav('signOut'),
        }}
      />
    </header>
  );
}
