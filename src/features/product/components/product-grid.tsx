import { ProductCard } from '@/features/product/components/product-card';
import type { ProductListItem } from '@/features/product/queries/get-products';

export function ProductGrid({
  products,
  locale,
  emptyLabel,
}: {
  products: ProductListItem[];
  locale: string;
  emptyLabel: string;
}) {
  if (products.length === 0) {
    return (
      <div className="rounded-[1.75rem] border border-dashed border-stone-300 bg-white/60 px-6 py-16 text-center text-stone-500 dark:border-white/15 dark:bg-white/5 dark:text-white/60">
        {emptyLabel}
      </div>
    );
  }

  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} locale={locale} />
      ))}
    </div>
  );
}
