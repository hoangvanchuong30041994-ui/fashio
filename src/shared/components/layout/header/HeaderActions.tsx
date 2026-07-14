import type { Locale } from '@/i18n/routing';
import { LocaleSwitcher } from '@/shared/components/locale-switcher';
import { ModeToggle } from '@/shared/components/theme-toggle';
import { UserMenu } from './UserMenu';

type HeaderUser = {
  name?: string | null;
  email: string;
  image?: string | null;
};

type HeaderActionsProps = {
  locale: Locale;
  user: HeaderUser | null;
  labels: {
    signIn: string;
    signUp: string;
    signedInAs: string;
    signOut: string;
  };
};

export function HeaderActions({ locale, user, labels }: HeaderActionsProps) {
  return (
    <div className="ml-auto flex flex-wrap items-center justify-end gap-2 sm:gap-3">
      <LocaleSwitcher />
      <ModeToggle />
      <UserMenu locale={locale} user={user} labels={labels} />
    </div>
  );
}
