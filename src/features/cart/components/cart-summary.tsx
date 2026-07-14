import { clearCartAction } from '@/features/cart/actions/clear-cart';
import { Link } from '@/i18n/navigation';
import { Button } from '@/components/ui/button';

export function CartSummary({
  subtotal,
  locale,
  labels,
}: {
  subtotal: number;
  locale: string;
  labels: {
    title: string;
    subtotal: string;
    shipping: string;
    total: string;
    checkout: string;
    clear: string;
  };
}) {
  const formattedSubtotal = new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: 'USD',
  }).format(subtotal);

  return (
    <aside className="space-y-5 rounded-[1.75rem] border border-stone-200/80 bg-white/80 p-5 shadow-sm shadow-stone-950/5 lg:sticky lg:top-8 dark:border-white/10 dark:bg-white/5 dark:shadow-black/20">
      <h2 className="text-xl font-semibold">{labels.title}</h2>

      <div className="space-y-3 text-sm text-stone-500 dark:text-white/60">
        <div className="flex items-center justify-between gap-4">
          <span>{labels.subtotal}</span>
          <span className="font-medium text-stone-950 dark:text-white">{formattedSubtotal}</span>
        </div>
        <div className="flex items-center justify-between gap-4">
          <span>{labels.shipping}</span>
          <span className="font-medium text-stone-950 dark:text-white">—</span>
        </div>
      </div>

      <div className="flex items-center justify-between border-t border-stone-200 pt-4 text-base font-semibold dark:border-white/10">
        <span>{labels.total}</span>
        <span>{formattedSubtotal}</span>
      </div>

      <Link
        href="/checkout"
        className="flex h-12 w-full items-center justify-center rounded-2xl bg-stone-950 px-5 text-sm font-medium text-white transition hover:bg-stone-800 dark:bg-white dark:text-stone-950 dark:hover:bg-rose-100"
      >
        {labels.checkout}
      </Link>

      <form action={clearCartAction}>
        <Button type="submit" variant="outline" className="h-11 w-full rounded-2xl">
          {labels.clear}
        </Button>
      </form>
    </aside>
  );
}
