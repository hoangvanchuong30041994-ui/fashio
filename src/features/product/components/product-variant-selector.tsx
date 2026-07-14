'use client';

import { useActionState, useMemo, useState } from 'react';
import { addToCartAction } from '@/features/cart/actions/add-to-cart';
import { Link } from '@/i18n/navigation';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

type Variant = {
  id: string;
  sku: string;
  size: string | null;
  color: string | null;
  price: string;
  stock: number;
};

function uniqueValues(values: Array<string | null>) {
  return Array.from(new Set(values.filter((value): value is string => Boolean(value))));
}

function formatCurrency(value: string, locale: string) {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: 'USD',
  }).format(Number(value));
}

export function ProductVariantSelector({
  variants,
  locale,
  labels,
}: {
  variants: Variant[];
  locale: string;
  labels: {
    size: string;
    color: string;
    selected: string;
    stock: string;
    outOfStock: string;
    comingSoon: string;
    quantity: string;
    addToCart: string;
    added: string;
    viewCart: string;
    invalidVariant: string;
    unknownError: string;
  };
}) {
  const sizes = useMemo(() => uniqueValues(variants.map((variant) => variant.size)), [variants]);
  const colors = useMemo(() => uniqueValues(variants.map((variant) => variant.color)), [variants]);

  const [selectedSize, setSelectedSize] = useState(sizes[0] ?? null);
  const [selectedColor, setSelectedColor] = useState(colors[0] ?? null);
  const [state, formAction, isPending] = useActionState(addToCartAction.bind(null, locale), {
    ok: false,
  });

  const selectedVariant = variants.find(
    (variant) =>
      (selectedSize ? variant.size === selectedSize : true) &&
      (selectedColor ? variant.color === selectedColor : true),
  );

  const isUnavailable = !selectedVariant || selectedVariant.stock <= 0;

  return (
    <form
      action={formAction}
      className="space-y-6 rounded-[1.75rem] border border-stone-200/80 bg-white/75 p-5 dark:border-white/10 dark:bg-white/5"
    >
      <input type="hidden" name="variantId" value={selectedVariant?.id ?? ''} />
      {colors.length > 0 ? (
        <div className="space-y-3">
          <p className="text-sm font-medium text-stone-500 dark:text-white/60">{labels.color}</p>
          <div className="flex flex-wrap gap-2">
            {colors.map((color) => (
              <Button
                key={color}
                type="button"
                variant={selectedColor === color ? 'default' : 'outline'}
                className="rounded-full"
                onClick={() => setSelectedColor(color)}
              >
                {color}
              </Button>
            ))}
          </div>
        </div>
      ) : null}

      {sizes.length > 0 ? (
        <div className="space-y-3">
          <p className="text-sm font-medium text-stone-500 dark:text-white/60">{labels.size}</p>
          <div className="flex flex-wrap gap-2">
            {sizes.map((size) => (
              <Button
                key={size}
                type="button"
                variant={selectedSize === size ? 'default' : 'outline'}
                className="rounded-full"
                onClick={() => setSelectedSize(size)}
              >
                {size}
              </Button>
            ))}
          </div>
        </div>
      ) : null}

      <div className="rounded-2xl bg-stone-50 p-4 dark:bg-white/5">
        {selectedVariant ? (
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-sm text-stone-500 dark:text-white/60">{labels.selected}</p>
              <p className="mt-1 font-semibold text-stone-950 dark:text-white">
                {selectedVariant.sku} · {formatCurrency(selectedVariant.price, locale)}
              </p>
            </div>
            <Badge
              className={cn(
                selectedVariant.stock > 0
                  ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300'
                  : 'bg-destructive/10 text-destructive',
              )}
            >
              {selectedVariant.stock > 0
                ? `${selectedVariant.stock} ${labels.stock}`
                : labels.outOfStock}
            </Badge>
          </div>
        ) : (
          <p className="text-sm text-stone-500 dark:text-white/60">{labels.comingSoon}</p>
        )}
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <label className="space-y-2 sm:w-28">
          <span className="text-sm font-medium text-stone-500 dark:text-white/60">
            {labels.quantity}
          </span>
          <Input
            type="number"
            name="quantity"
            min={1}
            max={selectedVariant?.stock ?? 1}
            defaultValue={1}
            disabled={isUnavailable || isPending}
            className="h-12 rounded-2xl text-center"
          />
        </label>

        <Button
          type="submit"
          size="lg"
          disabled={isUnavailable || isPending}
          className="mt-auto h-12 flex-1 rounded-2xl"
        >
          {isPending ? labels.addToCart : labels.addToCart}
        </Button>
      </div>

      {state.code ? (
        <div
          className={cn(
            'rounded-2xl px-4 py-3 text-sm',
            state.ok
              ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300'
              : 'bg-destructive/10 text-destructive',
          )}
        >
          {state.ok
            ? labels.added
            : state.code === 'invalidVariant'
              ? labels.invalidVariant
              : labels.unknownError}
          {state.ok ? (
            <Link href="/cart" className="ml-2 font-semibold underline underline-offset-4">
              {labels.viewCart}
            </Link>
          ) : null}
        </div>
      ) : null}
    </form>
  );
}
