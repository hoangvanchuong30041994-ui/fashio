import { Link } from '@/i18n/navigation';

export type HeaderNavigationHref = '/' | '/products' | '/cart' | '/orders';

type NavigationItem = {
  href: HeaderNavigationHref;
  label: string;
};

type NavigationProps = {
  items: NavigationItem[];
};

export function Navigation({ items }: NavigationProps) {
  return (
    <nav className="order-3 hidden w-full items-center justify-center gap-1 border-t border-stone-200/70 pt-3 text-sm text-stone-500 md:order-0 md:flex md:w-auto md:border-0 md:pt-0 lg:gap-2 dark:border-white/10 dark:text-white/70">
      {items.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className="rounded-full px-3 py-2 transition hover:bg-stone-100 hover:text-stone-950 lg:px-4 dark:hover:bg-white/10 dark:hover:text-white"
        >
          {item.label}
        </Link>
      ))}
    </nav>
  );
}
