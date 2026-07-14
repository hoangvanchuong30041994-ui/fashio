import type { CartWithItems } from '@/features/cart/queries/get-cart';

function formatCurrency(value: number, locale: string) {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: 'USD',
  }).format(value);
}

export function CheckoutCartSummary({
  cart,
  locale,
  labels,
}: {
  cart: CartWithItems;
  locale: string;
  labels: {
    title: string;
    subtotal: string;
    total: string;
  };
}) {
  const subtotal = cart.items.reduce(
    (total, item) => total + Number(item.variant.price.toString()) * item.quantity,
    0,
  );

  return (
    <aside className="space-y-5 rounded-[1.75rem] border border-stone-200/80 bg-white/80 p-5 shadow-sm shadow-stone-950/5 dark:border-white/10 dark:bg-white/5 dark:shadow-black/20 lg:sticky lg:top-8">
      <h2 className="text-xl font-semibold">{labels.title}</h2>
      <div className="space-y-4">
        {cart.items.map((item) => {
          const product = item.variant.product;
          return (
            <div key={item.id} className="flex items-start justify-between gap-4 text-sm">
              <div className="min-w-0">
                <p className="line-clamp-1 font-medium text-stone-950 dark:text-white">{product.name}</p>
                <p className="mt-1 text-stone-500 dark:text-white/60">
                  {item.quantity} × {[item.variant.color, item.variant.size].filter(Boolean).join(' · ')}
                </p>
              </div>
              <p className="font-medium">
                {formatCurrency(Number(item.variant.price.toString()) * item.quantity, locale)}
              </p>
            </div>
          );
        })}
      </div>
      <div className="space-y-3 border-t border-stone-200 pt-4 dark:border-white/10">
        <div className="flex items-center justify-between text-sm text-stone-500 dark:text-white/60">
          <span>{labels.subtotal}</span>
          <span className="font-medium text-stone-950 dark:text-white">{formatCurrency(subtotal, locale)}</span>
        </div>
        <div className="flex items-center justify-between text-base font-semibold">
          <span>{labels.total}</span>
          <span>{formatCurrency(subtotal, locale)}</span>
        </div>
      </div>
    </aside>
  );
}
