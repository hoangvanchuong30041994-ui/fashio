import { signOutAction } from '@/auth/actions/sign-out';
import { Link } from '@/i18n/navigation';
import type { Locale } from '@/i18n/routing';
import { Avatar, AvatarFallback, AvatarImage } from '@/shared/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/shared/components/ui/dropdown-menu';
import { UserIcon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';

type HeaderUser = {
  name?: string | null;
  email: string;
  image?: string | null;
};

type UserMenuLabels = {
  signedInAs: string;
  signOut: string;
};

type AuthLinkLabels = {
  signIn: string;
  signUp: string;
};

type UserMenuProps = {
  locale: Locale;
  user: HeaderUser | null;
  labels: UserMenuLabels & AuthLinkLabels;
};

export function UserMenu({ locale, user, labels }: UserMenuProps) {
  if (!user) {
    return (
      <>
        {/* Mobile: Circular button with User01Icon */}
        <Link
          href="/sign-in"
          aria-label={labels.signIn}
          className="inline-flex size-9 items-center justify-center rounded-full border border-stone-200 bg-stone-100 text-stone-600 transition hover:bg-stone-200 hover:text-stone-950 disabled:opacity-50 sm:hidden dark:border-white/10 dark:bg-white/5 dark:text-white/70 dark:hover:bg-white/10 dark:hover:text-white"
        >
          <HugeiconsIcon icon={UserIcon} strokeWidth={2} className="size-4" />
        </Link>

        {/* Desktop: Sign-in and Sign-up pill buttons */}
        <div className="hidden sm:flex items-center rounded-full border border-stone-200/80 bg-stone-50/80 p-1 text-sm dark:border-white/10 dark:bg-white/5">
          <Link
            href="/sign-in"
            className="rounded-full px-3 py-2 font-medium text-stone-600 transition hover:bg-white hover:text-stone-950 hover:shadow-sm lg:px-4 dark:text-white/70 dark:hover:bg-white/10 dark:hover:text-white"
          >
            {labels.signIn}
          </Link>
          <Link
            href="/sign-up"
            className="rounded-full bg-stone-950 px-3 py-2 font-medium text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-rose-500 hover:shadow-rose-500/20 lg:px-4 dark:bg-white dark:text-stone-950 dark:hover:bg-rose-100"
          >
            {labels.signUp}
          </Link>
        </div>
      </>
    );
  }

  const displayName = user.name || user.email;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="focus-visible:ring-ring/50 flex max-w-55 items-center gap-2 rounded-full border border-stone-200/80 bg-stone-50/80 p-1 text-sm shadow-sm shadow-stone-950/5 transition hover:bg-white hover:shadow-md hover:shadow-stone-950/5 focus-visible:ring-[3px] focus-visible:outline-none dark:border-white/10 dark:bg-white/5 dark:hover:bg-white/10">
        <UserAvatar name={displayName} email={user.email} image={user.image} />
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" sideOffset={8} className="w-72 p-2">
        <div className="flex items-center gap-3 rounded-xl px-2 py-2.5">
          <UserAvatar name={displayName} email={user.email} image={user.image} />
          <div className="min-w-0">
            <p className="text-muted-foreground text-xs">{labels.signedInAs}</p>
            <p className="text-foreground truncate text-sm font-medium">{displayName}</p>
            <p className="text-muted-foreground truncate text-xs">{user.email}</p>
          </div>
        </div>

        <DropdownMenuSeparator />

        <form action={signOutAction.bind(null, locale)}>
          <button
            type="submit"
            className="text-destructive hover:bg-destructive/10 focus-visible:ring-destructive/20 dark:hover:bg-destructive/20 flex w-full items-center justify-center rounded-xl px-3 py-2 text-sm font-medium transition focus-visible:ring-[3px] focus-visible:outline-none"
          >
            {labels.signOut}
          </button>
        </form>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function UserAvatar({
  name,
  email,
  image,
}: {
  name: string;
  email: string;
  image?: string | null;
}) {
  return (
    <Avatar className="bg-white dark:bg-white/10">
      {image ? <AvatarImage src={image} alt={name} /> : null}
      <AvatarFallback className="bg-stone-950 text-[10px] font-semibold text-white dark:bg-white dark:text-stone-950">
        {getUserInitials(name || email)}
      </AvatarFallback>
    </Avatar>
  );
}

function getUserInitials(value: string) {
  return value
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('');
}
