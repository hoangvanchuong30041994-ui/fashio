'use client';

import { useLocale, useTranslations } from 'next-intl';
import { useParams } from 'next/navigation';
import { useRouter, usePathname } from '@/i18n/navigation';
import { routing, type Locale } from '@/i18n/routing';
import * as Flags from 'country-flag-icons/react/3x2';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const LOCALE_CONFIG: Record<Locale, { countryCode: keyof typeof Flags }> = {
  vi: { countryCode: 'VN' },
  en: { countryCode: 'US' },
};

function Flag({ code, className }: { code: keyof typeof Flags; className?: string }) {
  const FlagComponent = Flags[code];
  return FlagComponent ? <FlagComponent className={className} /> : null;
}

export function LocaleSwitcher() {
  const locale = useLocale();
  const t = useTranslations('UI.locale');
  const router = useRouter();
  const pathname = usePathname();
  const params = useParams<{ slug?: string | string[]; id?: string | string[] }>();

  function switchLocale(nextLocale: Locale) {
    if (pathname.includes('[slug]')) {
      const slug = Array.isArray(params.slug) ? params.slug[0] : params.slug;

      if (slug) {
        router.replace({ pathname, params: { slug } } as never, { locale: nextLocale });
      }

      return;
    }

    if (pathname.includes('[id]')) {
      const id = Array.isArray(params.id) ? params.id[0] : params.id;

      if (id) {
        router.replace({ pathname, params: { id } } as never, { locale: nextLocale });
      }

      return;
    }

    router.replace(pathname as never, { locale: nextLocale });
  }

  const current = LOCALE_CONFIG[locale];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="inline-flex size-9 items-center justify-center rounded-full border border-stone-200 bg-stone-100 transition hover:bg-stone-200 disabled:opacity-50 dark:border-white/10 dark:bg-white/5 dark:hover:bg-white/10">
        {current ? (
          <Flag
            code={current.countryCode}
            className="size-5 overflow-hidden rounded-sm object-cover"
          />
        ) : (
          <span className="text-xs font-medium">{locale.toUpperCase()}</span>
        )}
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" sideOffset={6}>
        {routing.locales.map((loc) => {
          const config = LOCALE_CONFIG[loc];
          const isActive = loc === locale;
          const localeLabel = t((loc === 'vi' ? 'vi' : 'en') as 'vi' | 'en');
          return (
            <DropdownMenuItem
              key={loc}
              onClick={() => switchLocale(loc)}
              className={isActive ? 'bg-accent text-accent-foreground' : ''}
            >
              {config ? (
                <Flag
                  code={config.countryCode}
                  className="size-5 overflow-hidden rounded-sm object-cover"
                />
              ) : (
                <span className="text-xs font-medium uppercase">{loc}</span>
              )}
              <span>{localeLabel}</span>
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
