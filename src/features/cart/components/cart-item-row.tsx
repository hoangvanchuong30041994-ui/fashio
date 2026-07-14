import { removeCartItemAction } from '@/features/cart/actions/remove-cart-item';
import { updateCartItemAction } from '@/features/cart/actions/update-cart-item';
import type { CartLineItem } from '@/features/cart/queries/get-cart';
import type { Locale } from '@/i18n/routing';
import { Link } from '@/i18n/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

function formatCurrency(value: { toString(): string }, locale: string) {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: 'USD',
  }).format(Number(value.toString()));
}

export function CartItemRow({
  item,
  locale,
  labels,
}: {
  item: CartLineItem;
  locale: Locale;
  labels: {
    quantity: string;
    update: string;
    remove: string;
    stock: string;
  };
}) {
  const product = item.variant.product;
  const image = product.images[0];
  const lineTotal = Number(item.variant.price.toString()) * item.quantity;

  return (
    <article className="grid gap-4 rounded-[1.5rem] border border-stone-200/80 bg-white/80 p-4 sm:grid-cols-[7rem_1fr] dark:border-white/10 dark:bg-white/5">
      <Link
        href={{ pathname: '/products/[slug]', params: { slug: product.slug } }}
        className="relative aspect-square overflow-hidden rounded-2xl bg-linear-to-br from-stone-100 via-rose-100/70 to-stone-200 dark:from-stone-800 dark:via-stone-900 dark:to-stone-950"
      >
        {image ? (
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${image.url})` }}
            aria-label={image.alt ?? product.name}
          />
        ) : null}
      </Link>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0 space-y-2">
          <Link
            href={{ pathname: '/products/[slug]', params: { slug: product.slug } }}
            className="line-clamp-1 text-lg font-semibold transition hover:text-rose-500 dark:hover:text-rose-300"
          >
            {product.name}
          </Link>
          <p className="text-sm text-stone-500 dark:text-white/60">
            {[item.variant.color, item.variant.size].filter(Boolean).join(' · ')}
          </p>
          <p className="text-sm text-stone-500 dark:text-white/60">
            {formatCurrency(item.variant.price, locale)} · {item.variant.stock} {labels.stock}
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:items-end">
          <p className="text-lg font-semibold">
            {new Intl.NumberFormat(locale, { style: 'currency', currency: 'USD' }).format(lineTotal)}
          </p>

          <div className="flex flex-wrap gap-2">
            <form action={updateCartItemAction.bind(null, locale)} className="flex items-center gap-2">
              <input type="hidden" name="itemId" value={item.id} />
              <Input
                type="number"
                name="quantity"
                min={1}
                max={item.variant.stock}
                defaultValue={item.quantity}
                aria-label={labels.quantity}
                className="h-10 w-20 rounded-full text-center"
              />
              <Button type="submit" variant="outline" className="h-10 rounded-full">
                {labels.update}
              </Button>
            </form>

            <form action={removeCartItemAction.bind(null, locale)}>
              <input type="hidden" name="itemId" value={item.id} />
              <Button type="submit" variant="ghost" className="h-10 rounded-full text-destructive">
                {labels.remove}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </article>
  );
}
