import { Link } from '@/i18n/navigation';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import type { ProductListItem } from '@/features/product/queries/get-products';

function formatCurrency(value: { toString(): string }, locale: string) {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: 'USD',
  }).format(Number(value.toString()));
}

export function ProductCard({ product, locale }: { product: ProductListItem; locale: string }) {
  const image = product.images[0];
  const totalStock = product.variants.reduce((total, variant) => total + variant.stock, 0);

  return (
    <Link
      href={{ pathname: '/products/[slug]', params: { slug: product.slug } }}
      className="group block h-full"
    >
      <Card className="h-full overflow-hidden rounded-[1.75rem] border-stone-200/80 bg-white/80 shadow-sm transition hover:-translate-y-1 hover:shadow-xl hover:shadow-stone-950/10 dark:border-white/10 dark:bg-white/5 dark:hover:shadow-black/30">
        <div className="relative aspect-4/5 overflow-hidden bg-linear-to-br from-stone-100 via-rose-100/70 to-stone-200 dark:from-stone-800 dark:via-stone-900 dark:to-stone-950">
          {image ? (
            <div
              className="absolute inset-0 bg-cover bg-center transition duration-500 group-hover:scale-105"
              style={{ backgroundImage: `url(${image.url})` }}
              aria-label={image.alt ?? product.name}
            />
          ) : null}
          <div className="absolute inset-0 bg-linear-to-t from-stone-950/25 to-transparent" />
          <Badge className="absolute top-4 left-4 bg-white/90 text-stone-950 hover:bg-white dark:bg-stone-950/80 dark:text-white">
            {product.category.name}
          </Badge>
        </div>

        <CardContent className="space-y-3 p-5">
          <div className="space-y-1">
            <h3 className="line-clamp-1 text-lg font-semibold text-stone-950 dark:text-white">
              {product.name}
            </h3>
            {product.description ? (
              <p className="line-clamp-2 text-sm leading-6 text-stone-500 dark:text-white/60">
                {product.description}
              </p>
            ) : null}
          </div>

          <div className="flex items-center justify-between gap-3">
            <p className="font-semibold text-stone-950 dark:text-white">
              {formatCurrency(product.basePrice, locale)}
            </p>
            <p className="text-xs text-stone-400 dark:text-white/45">{totalStock} in stock</p>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
